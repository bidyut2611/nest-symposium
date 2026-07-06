<?php
/**
 * Main plugin class for WP Curtain Raiser.
 *
 * Handles front-end curtain rendering: query-var detection, asset enqueuing,
 * and HTML output. Admin settings are managed by WP_Curtain_Raiser_Settings.
 *
 * @package WP_Curtain_Raiser
 * @since   1.0.0
 * @updated 1.1.0 — Removed jQuery dependency; animation now driven by CSS transitions.
 * @updated 1.3.0 — ARIA dialog wrapper, focus trap, live region, i18n strings.
 * @updated 1.4.0 — Gradient theme presets, countdown timer.
 * @updated 1.5.0 — PHP action/filter hooks, localized data filter.
 * @updated 1.6.0 — wcr_token query var + REST polling support.
 */

defined( 'ABSPATH' ) || exit;

class WP_Curtain_Raiser {

    // -----------------------------------------------------------------------
    // Constants
    // -----------------------------------------------------------------------

    /**
     * Built-in gradient theme presets.
     * Key = CSS slug, value = display label + from/to hex colours.
     *
     * @since 1.4.0
     * @var   array<string, array<string, string>>
     */
    public const GRADIENT_THEMES = array(
        'velvet'     => array( 'label' => 'Deep Velvet',    'from' => '#8B0000', 'to' => '#4a0000' ),
        'royal-blue' => array( 'label' => 'Royal Blue',     'from' => '#003366', 'to' => '#001a33' ),
        'forest'     => array( 'label' => 'Forest Green',   'from' => '#1a4731', 'to' => '#0d2318' ),
        'midnight'   => array( 'label' => 'Midnight Black', 'from' => '#1a1a2e', 'to' => '#0d0d16' ),
        'gold'       => array( 'label' => 'Gold',           'from' => '#b8860b', 'to' => '#7a5900' ),
        'satin-rose' => array( 'label' => 'Satin Rose',     'from' => '#8b2252', 'to' => '#4a0f2a' ),
    );

    // -----------------------------------------------------------------------
    // Properties
    // -----------------------------------------------------------------------

    /**
     * Whether the curtain should render on this request.
     * Set inside the `request` filter when curtain_ceremony=true is present.
     *
     * @var bool
     */
    private bool $show_curtain = false;

    /**
     * Reveal token from the watch URL query string (v1.6).
     * Empty string when not present.
     *
     * @since 1.6.0
     * @var   string
     */
    private string $poll_token = '';

    /**
     * Default option values. Used on activation and as fallback.
     *
     * @var array<string, mixed>
     */
    public static array $defaults = array(
        // v1.0
        'curtain_color'     => '#8B0000',
        'curtain_image_url' => '',
        'animation_speed'   => 2000,
        'rope_image_url'    => '',
        // v1.4
        'curtain_theme'     => 'custom',
        'countdown_enabled' => false,
        'countdown_target'  => '',
    );

    // -----------------------------------------------------------------------
    // Boot
    // -----------------------------------------------------------------------

    public function __construct() {
        add_filter( 'query_vars', array( $this, 'register_query_vars' ) );
        add_filter( 'request',    array( $this, 'handle_request' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
    }

    // -----------------------------------------------------------------------
    // Lifecycle
    // -----------------------------------------------------------------------

    /**
     * Runs on plugin activation.
     * Seeds the options entry with defaults (add_option is a no-op if it exists).
     */
    public static function activate(): void {
        add_option( 'wp_curtain_raiser_options', self::$defaults );
    }

    /** Runs on plugin deactivation. Options intentionally preserved. */
    public static function deactivate(): void {}

    // -----------------------------------------------------------------------
    // Query-var handling
    // -----------------------------------------------------------------------

    /**
     * Register custom query variables with WordPress.
     *
     * @param  string[] $qvars
     * @return string[]
     */
    public function register_query_vars( array $qvars ): array {
        $qvars[] = 'curtain_ceremony';
        $qvars[] = 'wcr_token';       // v1.6 — remote reveal token
        return $qvars;
    }

    /**
     * Detect curtain_ceremony=true, set show flag, remove params from request
     * so they don't affect WP's query (especially static front pages).
     *
     * @param  array<string, mixed> $request
     * @return array<string, mixed>
     */
    public function handle_request( array $request ): array {
        if ( isset( $request['curtain_ceremony'] ) && 'true' === $request['curtain_ceremony'] ) {
            $this->show_curtain = true;
            unset( $request['curtain_ceremony'] );

            // v1.6 — capture reveal token if present on the watch URL.
            if ( isset( $request['wcr_token'] ) ) {
                $raw_token = sanitize_text_field( $request['wcr_token'] );
                // Only accept well-formed 32-char hex tokens.
                if ( strlen( $raw_token ) === 32 && ctype_xdigit( $raw_token ) ) {
                    // Verify the token transient actually exists (not expired).
                    $transient_data = get_transient( 'wcr_reveal_token_' . $raw_token );
                    if ( false !== $transient_data ) {
                        $this->poll_token = $raw_token;
                    }
                }
                unset( $request['wcr_token'] );
            }
        }
        return $request;
    }

    // -----------------------------------------------------------------------
    // Assets & HTML
    // -----------------------------------------------------------------------

    /**
     * Enqueue front-end CSS/JS and register the footer HTML callback.
     * Only fires when the curtain flag is set and we're not in admin.
     */
    public function enqueue_assets(): void {
        if ( ! $this->show_curtain || is_admin() ) {
            return;
        }

        $opts = self::get_options();

        wp_enqueue_script(
            'wp-curtain-raiser',
            WP_CURTAIN_RAISER_URL . 'js/wp-curtain-raiser-public.js',
            array(),
            WP_CURTAIN_RAISER_VERSION,
            array(
                'in_footer' => true,
                'strategy'  => 'defer',
            )
        );

        // Build localized data array.
        $localized = array(
            // v1.1
            'animationSpeed'   => absint( $opts['animation_speed'] ),
            'curtainColor'     => sanitize_hex_color( $opts['curtain_color'] ) ?: '#8B0000',
            'hasImage'         => ! empty( $opts['curtain_image_url'] ),
            // v1.3
            'i18n'             => array(
                'curtainOpened' => __( 'Curtain opened', 'wp-curtain-raiser' ),
                'curtainClosed' => __( 'Curtain closed', 'wp-curtain-raiser' ),
            ),
            // v1.4
            'countdownEnabled' => (bool) $opts['countdown_enabled'],
            'countdownTarget'  => $this->countdown_target_ms( $opts ),
            'curtainTheme'     => sanitize_key( $opts['curtain_theme'] ),
            // v1.6
            'pollToken'        => $this->poll_token ?: null,
            'restUrl'          => esc_url_raw( rest_url() ),
        );

        /**
         * Filters the data object passed to wp_localize_script.
         *
         * @since 1.5.0
         * @param array $localized The data array.
         * @param array $opts      The merged options.
         */
        $localized = apply_filters( 'wp_curtain_raiser_localized_data', $localized, $opts );

        wp_localize_script( 'wp-curtain-raiser', 'wpCurtainRaiserData', $localized );

        wp_enqueue_style(
            'wp-curtain-raiser',
            WP_CURTAIN_RAISER_URL . 'css/wp-curtain-raiser-public.css',
            array(),
            WP_CURTAIN_RAISER_VERSION
        );

        add_action( 'wp_footer', array( $this, 'render_html' ) );
    }

    /**
     * Output the curtain HTML in wp_footer.
     *
     * @since 1.0.0
     * @updated 1.3.0 — Wrapped in ARIA dialog overlay with live region.
     * @updated 1.4.0 — Added countdown element when enabled.
     * @updated 1.5.0 — Added before/after action hooks.
     */
    public function render_html(): void {
        $opts = self::get_options();

        $curtain_image_url = esc_url( $opts['curtain_image_url'] );
        $curtain_color     = sanitize_hex_color( $opts['curtain_color'] ) ?: '#8B0000';
        $curtain_theme     = sanitize_key( $opts['curtain_theme'] );
        $rope_image_url    = esc_url( $opts['rope_image_url'] );

        if ( empty( $rope_image_url ) ) {
            $rope_image_url = esc_url( WP_CURTAIN_RAISER_URL . 'assets/rope.png' );
        }

        $left_panel  = $this->curtain_panel_html( $curtain_image_url, $curtain_color, 'left',  $curtain_theme );
        $right_panel = $this->curtain_panel_html( $curtain_image_url, $curtain_color, 'right', $curtain_theme );

        /**
         * Fires immediately before the curtain HTML is output.
         *
         * @since 1.5.0
         * @param array $opts Merged plugin options.
         */
        do_action( 'wp_curtain_raiser_before_html', $opts );
        ?>
        <div id="wcr-overlay"
             class="wp-curtain-overlay"
             role="dialog"
             aria-modal="true"
             aria-label="<?php echo esc_attr( $this->get_overlay_label() ); ?>">

            <?php echo $left_panel;  // Escaped inside curtain_panel_html(). ?>
            <?php echo $right_panel; // Escaped inside curtain_panel_html(). ?>

            <a href="#"
               class="wp-curtain-rope"
               role="button"
               aria-label="<?php esc_attr_e( 'Open Curtain', 'wp-curtain-raiser' ); ?>"
               aria-expanded="false">
                <img src="<?php echo esc_url( $rope_image_url ); ?>"
                     alt="<?php esc_attr_e( 'Curtain Rope', 'wp-curtain-raiser' ); ?>" />
            </a>

            <?php if ( ! empty( $opts['countdown_enabled'] ) && ! empty( $opts['countdown_target'] ) ) : ?>
            <div id="wcr-countdown"
                 class="wp-curtain-countdown"
                 aria-live="off"
                 aria-hidden="true"></div>
            <?php endif; ?>

            <div id="wcr-live"
                 class="wp-curtain-live-region"
                 role="status"
                 aria-live="polite"
                 aria-atomic="true"></div>

        </div>
        <?php
        /**
         * Fires immediately after the curtain HTML is output.
         *
         * @since 1.5.0
         * @param array $opts Merged plugin options.
         */
        do_action( 'wp_curtain_raiser_after_html', $opts );
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    /**
     * Build the HTML for one curtain panel.
     * Priority: custom image > gradient theme > solid colour.
     *
     * @since  1.0.0
     * @updated 1.4.0 — Added $theme parameter and gradient branch.
     * @updated 1.5.0 — Return value passed through wp_curtain_raiser_panel_html filter.
     *
     * @param  string $image_url Absolute URL of curtain image, or empty.
     * @param  string $color     Hex colour for solid-colour fallback.
     * @param  string $side      'left' | 'right'
     * @param  string $theme     Gradient theme slug or 'custom'.
     * @return string            Safe HTML string.
     */
    private function curtain_panel_html(
        string $image_url,
        string $color,
        string $side,
        string $theme = 'custom'
    ): string {
        $class = 'wp-curtain-' . ( 'left' === $side ? 'left' : 'right' ) . '-curtain';

        if ( ! empty( $image_url ) ) {
            // Custom image — highest priority.
            $alt  = 'left' === $side
                ? __( 'Left Curtain', 'wp-curtain-raiser' )
                : __( 'Right Curtain', 'wp-curtain-raiser' );
            $html = sprintf(
                '<div class="%s" aria-hidden="true"><img src="%s" alt="%s" /></div>',
                esc_attr( $class ),
                esc_url( $image_url ),
                esc_attr( $alt )
            );

        } elseif ( 'custom' !== $theme && array_key_exists( $theme, self::GRADIENT_THEMES ) ) {
            // Gradient theme preset.
            $html = sprintf(
                '<div class="%s wcr-theme-%s" aria-hidden="true"></div>',
                esc_attr( $class ),
                esc_attr( $theme )
            );

        } else {
            // Solid colour fallback.
            $html = sprintf(
                '<div class="%s wp-curtain-color-panel" style="background-color:%s;" aria-hidden="true"></div>',
                esc_attr( $class ),
                esc_attr( $color )
            );
        }

        /**
         * Filters the HTML for one curtain panel.
         *
         * @since 1.5.0
         * @param string $html The panel HTML string.
         * @param string $side 'left' or 'right'.
         */
        return apply_filters( 'wp_curtain_raiser_panel_html', $html, $side );
    }

    /**
     * Convert the saved countdown target to a Unix-epoch value in milliseconds.
     *
     * The target is entered (and stored) as a site-local datetime string, so
     * it must be parsed in the site's timezone. PHP's default timezone is
     * pinned to UTC by WordPress, which is why strtotime() must not be used
     * here — it would shift the reveal by the site's UTC offset.
     *
     * @since  1.6.2
     * @param  array<string, mixed> $opts Merged plugin options.
     * @return int Epoch milliseconds, or 0 when disabled/unset/unparseable.
     */
    private function countdown_target_ms( array $opts ): int {
        if ( empty( $opts['countdown_enabled'] ) || empty( $opts['countdown_target'] ) ) {
            return 0;
        }

        try {
            $target = new DateTimeImmutable( $opts['countdown_target'], wp_timezone() );
        } catch ( Exception $e ) {
            return 0;
        }

        return max( 0, $target->getTimestamp() ) * 1000;
    }

    /**
     * Returns the translated aria-label string for the overlay dialog wrapper.
     *
     * @since  1.3.0
     * @return string
     */
    private function get_overlay_label(): string {
        return __( 'Curtain overlay — pull the rope to reveal the page', 'wp-curtain-raiser' );
    }

    /**
     * Retrieve plugin options merged with defaults (safe against partial saves).
     *
     * @since  1.0.0
     * @updated 1.5.0 — Return value passed through wp_curtain_raiser_options filter.
     *
     * @return array<string, mixed>
     */
    public static function get_options(): array {
        $saved  = get_option( 'wp_curtain_raiser_options', array() );
        $merged = wp_parse_args( $saved, self::$defaults );

        /**
         * Filters the merged plugin options array.
         *
         * @since 1.5.0
         * @param array $merged Merged options (saved + defaults).
         */
        return apply_filters( 'wp_curtain_raiser_options', $merged );
    }
}
