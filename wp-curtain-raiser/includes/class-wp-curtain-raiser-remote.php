<?php
/**
 * Remote Control for WP Curtain Raiser.
 *
 * Manages one-time reveal tokens and provides:
 *   • Tools > Curtain Remote admin page to generate tokens and trigger reveals.
 *   • GET  /wp-json/wcr/v1/status  — public polling endpoint for the watch URL.
 *   • POST /wp-json/wcr/v1/trigger — authenticated endpoint to fire a reveal.
 *   • admin-post handlers for generate / expire token form submissions.
 *
 * Flow:
 *   1. Admin generates a token (random 32-char hex, stored as WP transient).
 *   2. Watch URL ?curtain_ceremony=true&wcr_token=TOKEN is shared with attendees.
 *   3. Attendees' JS polls GET /wp-json/wcr/v1/status?token=TOKEN every 2 s.
 *   4. Admin clicks "Open Curtain" → JS POSTs /wp-json/wcr/v1/trigger.
 *   5. The token stores a desired state ('open'/'closed') plus the timestamp
 *      of the last change. /status returns it idempotently, so every active
 *      poller — not just the first — receives the signal. Clients de-dupe
 *      via the timestamp.
 *   6. When the transient expires, pollers stop via {expired:true}.
 *
 * @package WP_Curtain_Raiser
 * @since   1.6.0
 */

defined( 'ABSPATH' ) || exit;

class WP_Curtain_Raiser_Remote {

    // -----------------------------------------------------------------------
    // Constants
    // -----------------------------------------------------------------------

    /** Transient key prefix for reveal tokens. */
    const TOKEN_PREFIX = 'wcr_reveal_token_';

    /** wp_options key for the currently-active token pointer. */
    const ACTIVE_TOKEN_OPTION = 'wcr_active_token';

    /** Allowed TTL values (seconds) shown in the Generate form. */
    const TTL_OPTIONS = array(
        1800  => '30 minutes — short event',
        3600  => '1 hour',
        14400 => '4 hours — half-day event',
        86400 => '24 hours — full-day event',
    );

    // -----------------------------------------------------------------------
    // Boot
    // -----------------------------------------------------------------------

    public function __construct() {
        add_action( 'admin_menu',            array( $this, 'add_admin_page' ) );
        add_action( 'rest_api_init',         array( $this, 'register_rest_routes' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
        add_action( 'admin_post_wcr_generate_token', array( $this, 'handle_generate_token' ) );
        add_action( 'admin_post_wcr_expire_token',   array( $this, 'handle_expire_token' ) );
    }

    /**
     * Enqueue admin stylesheet on the Curtain Remote page.
     *
     * @param string $hook_suffix Current admin page hook suffix.
     */
    public function enqueue_admin_assets( string $hook_suffix ): void {
        if ( 'tools_page_wcr-remote' !== $hook_suffix ) {
            return;
        }
        wp_enqueue_style(
            'wp-curtain-raiser-admin',
            WP_CURTAIN_RAISER_URL . 'css/wp-curtain-raiser-admin.css',
            array(),
            WP_CURTAIN_RAISER_VERSION
        );
    }

    // -----------------------------------------------------------------------
    // Admin page
    // -----------------------------------------------------------------------

    /**
     * Register the Tools > Curtain Remote admin page.
     */
    public function add_admin_page(): void {
        add_management_page(
            __( 'Curtain Remote', 'wp-curtain-raiser' ),
            __( 'Curtain Remote', 'wp-curtain-raiser' ),
            'manage_options',
            'wcr-remote',
            array( $this, 'render_admin_page' )
        );
    }

    /**
     * Render the Tools > Curtain Remote admin page.
     */
    public function render_admin_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'You do not have permission to access this page.', 'wp-curtain-raiser' ) );
        }

        $token_info   = $this->get_active_token_info();
        $active_token = $token_info ? $token_info['token'] : '';
        $token_data   = $token_info ? $token_info['data']  : array();
        $has_token    = ! empty( $active_token );

        $watch_url = $has_token
            ? add_query_arg(
                array( 'curtain_ceremony' => 'true', 'wcr_token' => $active_token ),
                home_url( '/' )
              )
            : '';

        // Use the standard WP REST nonce — sent as X-WP-Nonce header so
        // WordPress' own cookie authentication middleware validates it and
        // sets current_user correctly before our permission_callback fires.
        $rest_nonce   = wp_create_nonce( 'wp_rest' );
        $rest_trigger = esc_url( rest_url( 'wcr/v1/trigger' ) );
        $rest_status  = esc_url( rest_url( 'wcr/v1/status' ) );

        $rest_close = esc_url( rest_url( 'wcr/v1/close' ) );

        // JS strings (safely encoded for inline output).
        $js_strings = wp_json_encode( array(
            'revealNow'    => __( 'Open Curtain', 'wp-curtain-raiser' ),
            'revealing'    => __( 'Opening…', 'wp-curtain-raiser' ),
            'revealed'     => __( '✓ Curtain Opened!', 'wp-curtain-raiser' ),
            'closeNow'     => __( 'Close Curtain', 'wp-curtain-raiser' ),
            'closing'      => __( 'Closing…', 'wp-curtain-raiser' ),
            'closedOk'     => __( '✓ Curtain Closed!', 'wp-curtain-raiser' ),
            'copyUrl'      => __( 'Copy Link', 'wp-curtain-raiser' ),
            'copied'       => __( '✓ Copied!', 'wp-curtain-raiser' ),
            'triggerUrl'   => $rest_trigger,
            'closeUrl'     => $rest_close,
            'statusUrl'    => $rest_status,
            'restNonce'    => $rest_nonce,
            'activeToken'  => $active_token,
        ) );
        ?>
        <div class="wrap wcr-remote-wrap">
            <h1><?php esc_html_e( 'Curtain Remote', 'wp-curtain-raiser' ); ?></h1>
            <p class="description"><?php esc_html_e( 'Create a session link, share it with your attendees, then open the curtain for everyone the moment your event begins.', 'wp-curtain-raiser' ); ?></p>

            <?php settings_errors( 'wcr_remote' ); ?>

            <!-- ============================================================
                 STATUS BLOCK
                 ============================================================ -->
            <div class="wcr-status-block postbox">
                <div class="inside">
                    <?php if ( $has_token ) : ?>
                        <p class="wcr-status wcr-status--active">
                            <span class="dashicons dashicons-yes-alt"></span>
                            <strong><?php esc_html_e( 'Session active', 'wp-curtain-raiser' ); ?></strong>
                            &mdash;
                            <code><?php echo esc_html( substr( $active_token, 0, 8 ) . '…' ); ?></code>
                            <?php if ( ! empty( $token_data['expires'] ) ) : ?>
                                <span class="wcr-expires"><?php
                                    printf(
                                        /* translators: %s = human-readable time difference */
                                        esc_html__( 'Expires in %s', 'wp-curtain-raiser' ),
                                        esc_html( human_time_diff( time(), (int) $token_data['expires'] ) )
                                    );
                                ?></span>
                            <?php endif; ?>
                        </p>
                    <?php else : ?>
                        <p class="wcr-status wcr-status--none">
                            <span class="dashicons dashicons-minus"></span>
                            <strong><?php esc_html_e( 'No active session', 'wp-curtain-raiser' ); ?></strong>
                            &mdash;
                            <?php esc_html_e( 'Create a new session below to get your attendee link.', 'wp-curtain-raiser' ); ?>
                        </p>
                    <?php endif; ?>
                </div>
            </div>

            <?php if ( $has_token ) : ?>
            <!-- ============================================================
                 ATTENDEE LINK
                 ============================================================ -->
            <div class="postbox">
                <h2 class="hndle"><span><?php esc_html_e( 'Attendee Link', 'wp-curtain-raiser' ); ?></span></h2>
                <div class="inside">
                    <p class="description"><?php esc_html_e( 'Send this link to your attendees before the event. They will see the closed curtain and wait for you to open it.', 'wp-curtain-raiser' ); ?></p>
                    <div class="wcr-url-row">
                        <input type="text"
                               id="wcr-watch-url"
                               class="large-text code"
                               readonly
                               value="<?php echo esc_attr( $watch_url ); ?>" />
                        <button type="button" id="wcr-copy-btn" class="button button-secondary">
                            <?php esc_html_e( 'Copy Link', 'wp-curtain-raiser' ); ?>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ============================================================
                 REVEAL / CLOSE CONTROLS
                 ============================================================ -->
            <div class="postbox wcr-reveal-box">
                <h2 class="hndle"><span><?php esc_html_e( 'Remote Control', 'wp-curtain-raiser' ); ?></span></h2>
                <div class="inside">
                    <p class="description"><?php esc_html_e( 'When your ceremony is ready to begin, press Open Curtain. Every attendee on the link will see the curtain open within about 2 seconds.', 'wp-curtain-raiser' ); ?></p>
                    <div class="wcr-control-row">
                        <button type="button"
                                id="wcr-reveal-btn"
                                class="button button-primary button-hero">
                            <?php esc_html_e( 'Open Curtain', 'wp-curtain-raiser' ); ?>
                        </button>
                        <button type="button"
                                id="wcr-close-btn"
                                class="button button-secondary button-hero">
                            <?php esc_html_e( 'Close Curtain', 'wp-curtain-raiser' ); ?>
                        </button>
                    </div>
                    <p id="wcr-reveal-result" class="wcr-reveal-result" aria-live="polite"></p>
                </div>
            </div>

            <!-- ============================================================
                 END SESSION
                 ============================================================ -->
            <div class="postbox">
                <h2 class="hndle"><span><?php esc_html_e( 'End Session', 'wp-curtain-raiser' ); ?></span></h2>
                <div class="inside">
                    <p class="description"><?php esc_html_e( 'Immediately invalidates the attendee link. Anyone still on the page will stop receiving remote signals.', 'wp-curtain-raiser' ); ?></p>
                    <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                        <?php wp_nonce_field( 'wcr_expire_token', 'wcr_expire_nonce' ); ?>
                        <input type="hidden" name="action" value="wcr_expire_token" />
                        <input type="submit"
                               class="button button-secondary"
                               value="<?php esc_attr_e( 'End Session Now', 'wp-curtain-raiser' ); ?>"
                               onclick="return confirm( <?php echo wp_json_encode( __( 'End this session? The attendee link will stop working immediately.', 'wp-curtain-raiser' ) ); ?> );" />
                    </form>
                </div>
            </div>
            <?php endif; /* has token */ ?>

            <!-- ============================================================
                 CREATE / REPLACE SESSION
                 ============================================================ -->
            <div class="postbox">
                <h2 class="hndle"><span><?php echo $has_token
                    ? esc_html__( 'Start New Session', 'wp-curtain-raiser' )
                    : esc_html__( 'Create a Session', 'wp-curtain-raiser' );
                ?></span></h2>
                <div class="inside">
                    <?php if ( $has_token ) : ?>
                    <p class="description" style="color:#b32d2e;">
                        <?php esc_html_e( 'This will end the current session and generate a fresh attendee link.', 'wp-curtain-raiser' ); ?>
                    </p>
                    <?php else : ?>
                    <p class="description">
                        <?php esc_html_e( 'A session gives you a unique attendee link and lets you open the curtain remotely from this page.', 'wp-curtain-raiser' ); ?>
                    </p>
                    <?php endif; ?>
                    <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                        <?php wp_nonce_field( 'wcr_generate_token', 'wcr_generate_nonce' ); ?>
                        <input type="hidden" name="action" value="wcr_generate_token" />

                        <table class="form-table" role="presentation">
                            <tr>
                                <th scope="row">
                                    <label for="wcr_ttl"><?php esc_html_e( 'Session Duration', 'wp-curtain-raiser' ); ?></label>
                                </th>
                                <td>
                                    <select id="wcr_ttl" name="wcr_ttl">
                                        <?php foreach ( self::TTL_OPTIONS as $seconds => $label ) : ?>
                                        <option value="<?php echo esc_attr( $seconds ); ?>"<?php selected( $seconds, 3600 ); ?>>
                                            <?php echo esc_html( $label ); ?>
                                        </option>
                                        <?php endforeach; ?>
                                    </select>
                                    <p class="description"><?php esc_html_e( 'How long the attendee link stays valid. Choose a window that covers your whole event.', 'wp-curtain-raiser' ); ?></p>
                                </td>
                            </tr>
                        </table>

                        <p class="submit">
                            <input type="submit"
                                   class="button button-primary"
                                   value="<?php echo $has_token
                                       ? esc_attr__( 'Generate New Session Link', 'wp-curtain-raiser' )
                                       : esc_attr__( 'Create Session &amp; Get Link', 'wp-curtain-raiser' );
                                   ?>" />
                        </p>
                    </form>
                </div>
            </div>

        </div><!-- .wcr-remote-wrap -->

        <script>
        ( function () {
            'use strict';
            var cfg = <?php echo $js_strings; // Already JSON-encoded and safe. ?>;

            // --- Copy URL button ---
            var copyBtn = document.getElementById( 'wcr-copy-btn' );
            var urlInput = document.getElementById( 'wcr-watch-url' );
            if ( copyBtn && urlInput ) {
                copyBtn.addEventListener( 'click', function () {
                    if ( navigator.clipboard && navigator.clipboard.writeText ) {
                        navigator.clipboard.writeText( urlInput.value ).then( function () {
                            copyBtn.textContent = cfg.copied;
                            setTimeout( function () { copyBtn.textContent = cfg.copyUrl; }, 2000 );
                        } );
                    } else {
                        // Fallback for older browsers.
                        urlInput.select();
                        document.execCommand( 'copy' );
                        copyBtn.textContent = cfg.copied;
                        setTimeout( function () { copyBtn.textContent = cfg.copyUrl; }, 2000 );
                    }
                } );
            }

            var revealResult = document.getElementById( 'wcr-reveal-result' );

            // Helper: POST to a WCR REST endpoint with the standard WP nonce.
            function wcrPost( url, label, btnEl, successLabel, successMsg, failLabel ) {
                btnEl.disabled    = true;
                btnEl.textContent = label;

                fetch( url, {
                    method:  'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce':   cfg.restNonce,
                    },
                    body:        JSON.stringify( { token: cfg.activeToken } ),
                    credentials: 'same-origin',
                } )
                .then( function ( res ) { return res.json(); } )
                .then( function ( data ) {
                    if ( data.ok ) {
                        btnEl.textContent = successLabel;
                        if ( revealResult ) { revealResult.textContent = successMsg; }
                    } else {
                        btnEl.disabled    = false;
                        btnEl.textContent = failLabel;
                        if ( revealResult ) {
                            revealResult.textContent = data.message || <?php echo wp_json_encode( __( 'An error occurred. Please try again.', 'wp-curtain-raiser' ) ); ?>;
                        }
                    }
                } )
                .catch( function () {
                    btnEl.disabled    = false;
                    btnEl.textContent = failLabel;
                    if ( revealResult ) {
                        revealResult.textContent = <?php echo wp_json_encode( __( 'Network error. Please try again.', 'wp-curtain-raiser' ) ); ?>;
                    }
                } );
            }

            // --- Reveal Now button ---
            var revealBtn = document.getElementById( 'wcr-reveal-btn' );
            if ( revealBtn && cfg.activeToken ) {
                revealBtn.addEventListener( 'click', function () {
                    wcrPost(
                        cfg.triggerUrl,
                        cfg.revealing,
                        revealBtn,
                        cfg.revealed,
                        <?php echo wp_json_encode( __( 'Signal sent! All attendees\' curtains will open within a couple of seconds.', 'wp-curtain-raiser' ) ); ?>,
                        cfg.revealNow
                    );
                } );
            }

            // --- Close Curtain button ---
            var closeBtn = document.getElementById( 'wcr-close-btn' );
            if ( closeBtn && cfg.activeToken ) {
                closeBtn.addEventListener( 'click', function () {
                    wcrPost(
                        cfg.closeUrl,
                        cfg.closing,
                        closeBtn,
                        cfg.closedOk,
                        <?php echo wp_json_encode( __( 'Signal sent! All attendees\' curtains will close within a couple of seconds.', 'wp-curtain-raiser' ) ); ?>,
                        cfg.closeNow
                    );
                } );
            }
        } )();
        </script>
        <?php
    }

    // -----------------------------------------------------------------------
    // admin-post handlers
    // -----------------------------------------------------------------------

    /**
     * Handle the "Generate Token" form submission (admin-post.php).
     */
    public function handle_generate_token(): void {
        check_admin_referer( 'wcr_generate_token', 'wcr_generate_nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Permission denied.', 'wp-curtain-raiser' ) );
        }

        // Sanitise and whitelist TTL.
        $raw_ttl = isset( $_POST['wcr_ttl'] ) ? (int) $_POST['wcr_ttl'] : 3600;
        $ttl     = array_key_exists( $raw_ttl, self::TTL_OPTIONS ) ? $raw_ttl : 3600;

        // Expire existing token if present.
        $this->expire_active_token();

        // Generate new token.
        $token = $this->generate_token();
        $data  = array(
            'state'   => 'none',   // 'none' | 'open' | 'closed' — desired curtain state.
            'changed' => 0,        // Unix timestamp of the last state change.
            'expires' => time() + $ttl,
            'ttl'     => $ttl,
        );

        set_transient( self::TOKEN_PREFIX . $token, $data, $ttl );
        update_option( self::ACTIVE_TOKEN_OPTION, $token );

        add_settings_error( 'wcr_remote', 'wcr_generated', __( 'Session created! Copy the Attendee Link below and share it before your event starts.', 'wp-curtain-raiser' ), 'success' );
        set_transient( 'settings_errors', get_settings_errors(), 30 );

        wp_safe_redirect( add_query_arg( array( 'page' => 'wcr-remote', 'settings-updated' => 'true' ), admin_url( 'tools.php' ) ) );
        exit;
    }

    /**
     * Handle the "Expire Token" form submission (admin-post.php).
     */
    public function handle_expire_token(): void {
        check_admin_referer( 'wcr_expire_token', 'wcr_expire_nonce' );

        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'Permission denied.', 'wp-curtain-raiser' ) );
        }

        $this->expire_active_token();

        add_settings_error( 'wcr_remote', 'wcr_expired', __( 'Session ended. The attendee link is no longer active.', 'wp-curtain-raiser' ), 'success' );
        set_transient( 'settings_errors', get_settings_errors(), 30 );

        wp_safe_redirect( add_query_arg( array( 'page' => 'wcr-remote', 'settings-updated' => 'true' ), admin_url( 'tools.php' ) ) );
        exit;
    }

    // -----------------------------------------------------------------------
    // REST routes
    // -----------------------------------------------------------------------

    /**
     * Register REST endpoints.
     */
    public function register_rest_routes(): void {
        // GET wcr/v1/status — public, polled by JS on the watch URL.
        register_rest_route(
            'wcr/v1',
            '/status',
            array(
                'methods'             => WP_REST_Server::READABLE,
                'callback'            => array( $this, 'rest_status' ),
                'permission_callback' => '__return_true',
                'args'                => array(
                    'token' => array(
                        'required'          => true,
                        'type'              => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                        'validate_callback' => array( $this, 'validate_token_arg' ),
                    ),
                ),
            )
        );

        // POST wcr/v1/trigger — admin only, opens curtain on all pollers.
        register_rest_route(
            'wcr/v1',
            '/trigger',
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'rest_trigger' ),
                'permission_callback' => array( $this, 'rest_trigger_permission' ),
                'args'                => array(
                    'token' => array(
                        'required'          => true,
                        'type'              => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                        'validate_callback' => array( $this, 'validate_token_arg' ),
                    ),
                ),
            )
        );

        // POST wcr/v1/close — admin only, closes curtain on all pollers.
        register_rest_route(
            'wcr/v1',
            '/close',
            array(
                'methods'             => WP_REST_Server::CREATABLE,
                'callback'            => array( $this, 'rest_close' ),
                'permission_callback' => array( $this, 'rest_trigger_permission' ), // same: manage_options
                'args'                => array(
                    'token' => array(
                        'required'          => true,
                        'type'              => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                        'validate_callback' => array( $this, 'validate_token_arg' ),
                    ),
                ),
            )
        );
    }

    /**
     * GET wcr/v1/status — returns the curtain state for the given token.
     *
     * Read-only and idempotent: every poller receives the same answer, so a
     * signal reaches ALL active attendees, not just the first one to poll.
     * Clients use `changed` (Unix timestamp of the last state change) to
     * apply each signal only once.
     *
     * Response shape:
     *   { triggered: bool, closed: bool, expired: bool, changed: int }
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function rest_status( WP_REST_Request $request ): WP_REST_Response {
        $token = $request->get_param( 'token' );
        $data  = get_transient( self::TOKEN_PREFIX . $token );

        if ( false === $data ) {
            // Transient missing → token expired or never existed.
            return new WP_REST_Response(
                array( 'triggered' => false, 'closed' => false, 'expired' => true, 'changed' => 0 ),
                200
            );
        }

        $state = $data['state'] ?? 'none';

        return new WP_REST_Response(
            array(
                'triggered' => ( 'open' === $state ),
                'closed'    => ( 'closed' === $state ),
                'expired'   => false,
                'changed'   => (int) ( $data['changed'] ?? 0 ),
            ),
            200
        );
    }

    /**
     * POST wcr/v1/close — signals all active pollers to close the curtain.
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function rest_close( WP_REST_Request $request ): WP_REST_Response {
        $token = $request->get_param( 'token' );
        $data  = get_transient( self::TOKEN_PREFIX . $token );

        if ( false === $data ) {
            return new WP_REST_Response(
                array( 'ok' => false, 'message' => __( 'Token not found or already expired.', 'wp-curtain-raiser' ) ),
                404
            );
        }

        $this->set_token_state( $token, $data, 'closed' );

        return new WP_REST_Response( array( 'ok' => true ), 200 );
    }

    /**
     * Permission callback for POST wcr/v1/trigger.
     *
     * Authentication is handled by WordPress' built-in REST cookie middleware
     * which validates the X-WP-Nonce header (wp_rest nonce) and sets the
     * current user before this callback fires. We only need to gate on
     * capability here.
     *
     * @param WP_REST_Request $request
     * @return bool
     */
    public function rest_trigger_permission( WP_REST_Request $request ): bool {
        return current_user_can( 'manage_options' );
    }

    /**
     * POST wcr/v1/trigger — signals all active pollers to open the curtain.
     *
     * @param WP_REST_Request $request
     * @return WP_REST_Response
     */
    public function rest_trigger( WP_REST_Request $request ): WP_REST_Response {
        $token = $request->get_param( 'token' );
        $data  = get_transient( self::TOKEN_PREFIX . $token );

        if ( false === $data ) {
            return new WP_REST_Response(
                array( 'ok' => false, 'message' => __( 'Token not found or already expired.', 'wp-curtain-raiser' ) ),
                404
            );
        }

        $this->set_token_state( $token, $data, 'open' );

        return new WP_REST_Response( array( 'ok' => true ), 200 );
    }

    /**
     * Persist a new desired curtain state on the token, preserving its
     * remaining lifetime.
     *
     * @param string $token Active token.
     * @param array  $data  Current transient payload.
     * @param string $state 'open' | 'closed'.
     */
    private function set_token_state( string $token, array $data, string $state ): void {
        $data['state']   = $state;
        $data['changed'] = time();

        $ttl = isset( $data['expires'] ) ? max( 1, (int) $data['expires'] - time() ) : 3600;
        set_transient( self::TOKEN_PREFIX . $token, $data, $ttl );
    }

    /**
     * REST arg validation: accepts only 32-character lowercase hex strings.
     *
     * @param  mixed $value
     * @return bool
     */
    public function validate_token_arg( $value ): bool {
        return is_string( $value ) && strlen( $value ) === 32 && ctype_xdigit( $value );
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    /**
     * Generate a cryptographically secure 32-character hex token.
     *
     * @return string
     */
    private function generate_token(): string {
        return bin2hex( random_bytes( 16 ) );
    }

    /**
     * Build the transient key for a given token.
     *
     * @param  string $token
     * @return string
     */
    private function transient_key( string $token ): string {
        return self::TOKEN_PREFIX . $token;
    }

    /**
     * Read the active token and its transient data.
     *
     * @return array{token:string, data:array}|false
     */
    private function get_active_token_info() {
        $token = get_option( self::ACTIVE_TOKEN_OPTION, '' );
        if ( empty( $token ) ) {
            return false;
        }

        $data = get_transient( self::TOKEN_PREFIX . $token );
        if ( false === $data ) {
            // Transient expired but option pointer still exists — clean up.
            delete_option( self::ACTIVE_TOKEN_OPTION );
            return false;
        }

        return array( 'token' => $token, 'data' => $data );
    }

    /**
     * Expire and delete the currently-active token (if any).
     */
    private function expire_active_token(): void {
        $token = get_option( self::ACTIVE_TOKEN_OPTION, '' );
        if ( ! empty( $token ) ) {
            delete_transient( self::TOKEN_PREFIX . $token );
        }
        delete_option( self::ACTIVE_TOKEN_OPTION );
    }
}
