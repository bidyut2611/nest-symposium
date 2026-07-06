<?php
/**
 * Admin Settings page for WP Curtain Raiser.
 *
 * @package WP_Curtain_Raiser
 * @since   1.0.0
 * @updated 1.4.0 — Gradient theme preset selector, countdown fields, JS toggle.
 */

defined( 'ABSPATH' ) || exit;

class WP_Curtain_Raiser_Settings {

    const OPTION_KEY    = 'wp_curtain_raiser_options';
    const OPTION_GROUP  = 'wp_curtain_raiser_group';
    const SECTION_ID    = 'wp_curtain_raiser_main_section';
    const SECTION_THEME = 'wp_curtain_raiser_theme_section';

    // -----------------------------------------------------------------------
    // Boot
    // -----------------------------------------------------------------------

    public function __construct() {
        add_action( 'admin_menu',            array( $this, 'add_menu_page' ) );
        add_action( 'admin_init',            array( $this, 'register_settings' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
    }

    // -----------------------------------------------------------------------
    // Admin menu
    // -----------------------------------------------------------------------

    public function add_menu_page(): void {
        add_options_page(
            __( 'WP Curtain Raiser', 'wp-curtain-raiser' ),
            __( 'Curtain Raiser', 'wp-curtain-raiser' ),
            'manage_options',
            'wp-curtain-raiser',
            array( $this, 'render_page' )
        );
    }

    // -----------------------------------------------------------------------
    // Settings API
    // -----------------------------------------------------------------------

    public function register_settings(): void {
        register_setting(
            self::OPTION_GROUP,
            self::OPTION_KEY,
            array(
                'sanitize_callback' => array( $this, 'sanitize_options' ),
                'default'           => WP_Curtain_Raiser::$defaults,
            )
        );

        // --- Section 1: Curtain Appearance ---
        add_settings_section(
            self::SECTION_ID,
            __( 'Curtain Appearance', 'wp-curtain-raiser' ),
            array( $this, 'render_section_description' ),
            'wp-curtain-raiser'
        );

        // Curtain style (drives visibility of colour/image fields below).
        add_settings_field(
            'curtain_theme',
            __( 'Curtain Style', 'wp-curtain-raiser' ),
            array( $this, 'render_theme_field' ),
            'wp-curtain-raiser',
            self::SECTION_ID
        );

        // Colour — hidden when a gradient preset is selected.
        add_settings_field(
            'curtain_color',
            __( 'Curtain Colour', 'wp-curtain-raiser' ),
            array( $this, 'render_color_field' ),
            'wp-curtain-raiser',
            self::SECTION_ID,
            array( 'class' => 'wcr-custom-field-row' )
        );

        // Curtain image — hidden when a gradient preset is selected.
        add_settings_field(
            'curtain_image_url',
            __( 'Curtain Image', 'wp-curtain-raiser' ),
            array( $this, 'render_image_field' ),
            'wp-curtain-raiser',
            self::SECTION_ID,
            array( 'class' => 'wcr-custom-field-row' )
        );

        // Rope image.
        add_settings_field(
            'rope_image_url',
            __( 'Pull-Rope Image', 'wp-curtain-raiser' ),
            array( $this, 'render_rope_field' ),
            'wp-curtain-raiser',
            self::SECTION_ID
        );

        // Animation speed.
        add_settings_field(
            'animation_speed',
            __( 'Open / Close Speed', 'wp-curtain-raiser' ),
            array( $this, 'render_speed_field' ),
            'wp-curtain-raiser',
            self::SECTION_ID
        );

        // --- Section 2: Countdown Timer ---
        add_settings_section(
            self::SECTION_THEME,
            __( 'Auto-Open Countdown', 'wp-curtain-raiser' ),
            array( $this, 'render_countdown_section_description' ),
            'wp-curtain-raiser'
        );

        add_settings_field(
            'countdown_enabled',
            __( 'Enable Countdown', 'wp-curtain-raiser' ),
            array( $this, 'render_countdown_enabled_field' ),
            'wp-curtain-raiser',
            self::SECTION_THEME
        );

        add_settings_field(
            'countdown_target',
            __( 'Reveal Date &amp; Time', 'wp-curtain-raiser' ),
            array( $this, 'render_countdown_target_field' ),
            'wp-curtain-raiser',
            self::SECTION_THEME
        );
    }

    // -----------------------------------------------------------------------
    // Sanitization
    // -----------------------------------------------------------------------

    public function sanitize_options( $raw ): array {
        $defaults = WP_Curtain_Raiser::$defaults;
        if ( ! is_array( $raw ) ) {
            return $defaults;
        }

        $clean = array();

        // Colour.
        $clean['curtain_color'] = isset( $raw['curtain_color'] )
            ? ( sanitize_hex_color( $raw['curtain_color'] ) ?: $defaults['curtain_color'] )
            : $defaults['curtain_color'];

        // Curtain image URL.
        $clean['curtain_image_url'] = isset( $raw['curtain_image_url'] )
            ? esc_url_raw( $raw['curtain_image_url'] )
            : '';

        // Rope image URL.
        $clean['rope_image_url'] = isset( $raw['rope_image_url'] )
            ? esc_url_raw( $raw['rope_image_url'] )
            : '';

        // Animation speed: 200–10000 ms.
        $speed                  = isset( $raw['animation_speed'] ) ? absint( $raw['animation_speed'] ) : $defaults['animation_speed'];
        $clean['animation_speed'] = max( 200, min( 10000, $speed ) );

        // v1.4 — Theme preset: whitelist.
        $valid_themes           = array_merge( array( 'custom' ), array_keys( WP_Curtain_Raiser::GRADIENT_THEMES ) );
        $raw_theme              = sanitize_key( $raw['curtain_theme'] ?? 'custom' );
        $clean['curtain_theme'] = in_array( $raw_theme, $valid_themes, true ) ? $raw_theme : 'custom';

        // v1.4 — Countdown enabled.
        $clean['countdown_enabled'] = ! empty( $raw['countdown_enabled'] );

        // v1.4 — Countdown target: must be a parseable, non-empty datetime string.
        $raw_target                = sanitize_text_field( $raw['countdown_target'] ?? '' );
        $ts                        = $raw_target ? strtotime( $raw_target ) : false;
        $clean['countdown_target'] = ( false !== $ts && $ts > 0 ) ? $raw_target : '';

        return $clean;
    }

    // -----------------------------------------------------------------------
    // Asset enqueue (admin)
    // -----------------------------------------------------------------------

    public function enqueue_admin_assets( string $hook_suffix ): void {
        if ( 'settings_page_wp-curtain-raiser' !== $hook_suffix ) {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_style(
            'wp-curtain-raiser-admin',
            WP_CURTAIN_RAISER_URL . 'css/wp-curtain-raiser-admin.css',
            array(),
            WP_CURTAIN_RAISER_VERSION
        );
    }

    // -----------------------------------------------------------------------
    // Section descriptions
    // -----------------------------------------------------------------------

    public function render_section_description(): void {
        echo '<p>' . esc_html__( 'Choose how the curtain looks — pick a built-in style, a custom colour, or your own image. The pull-rope image and animation speed are also set here.', 'wp-curtain-raiser' ) . '</p>';
    }

    public function render_countdown_section_description(): void {
        echo '<p>' . esc_html__( 'Display a live countdown timer over the curtain. When the clock reaches zero the curtain opens automatically — no one needs to pull the rope.', 'wp-curtain-raiser' ) . '</p>';
    }

    // -----------------------------------------------------------------------
    // Field renderers
    // -----------------------------------------------------------------------

    /** v1.4 — Theme preset selector. */
    public function render_theme_field(): void {
        $opts  = WP_Curtain_Raiser::get_options();
        $value = sanitize_key( $opts['curtain_theme'] );
        ?>
        <select id="curtain_theme" name="<?php echo esc_attr( self::OPTION_KEY ); ?>[curtain_theme]">
            <option value="custom" <?php selected( $value, 'custom' ); ?>>
                <?php esc_html_e( 'Custom — use colour or image below', 'wp-curtain-raiser' ); ?>
            </option>
            <?php foreach ( WP_Curtain_Raiser::GRADIENT_THEMES as $slug => $theme ) : ?>
                <option value="<?php echo esc_attr( $slug ); ?>" <?php selected( $value, $slug ); ?>>
                    <?php echo esc_html( $theme['label'] ); ?>
                </option>
            <?php endforeach; ?>
        </select>
        <p class="description">
            <?php esc_html_e( 'Pick a built-in gradient, or choose Custom to set your own colour or upload an image.', 'wp-curtain-raiser' ); ?>
        </p>
        <?php
    }

    /** Colour picker. */
    public function render_color_field(): void {
        $opts  = WP_Curtain_Raiser::get_options();
        $value = sanitize_hex_color( $opts['curtain_color'] ) ?: '#8B0000';
        ?>
        <input type="color"
               id="curtain_color"
               name="<?php echo esc_attr( self::OPTION_KEY ); ?>[curtain_color]"
               value="<?php echo esc_attr( $value ); ?>" />
        <p class="description">
            <?php esc_html_e( 'Solid fill colour used when no curtain image is selected. Defaults to dark red.', 'wp-curtain-raiser' ); ?>
        </p>
        <?php
    }

    /**
     * Returns the list of bundled curtain image options from the assets folder.
     * Keys are the plugin-relative URL; values are display labels.
     *
     * @return array<string,string>  url => label
     */
    private function get_bundled_curtain_images(): array {
        $base = WP_CURTAIN_RAISER_URL . 'assets/';
        return array(
            $base . 'frontcurtain.jpg' => __( 'Default Curtain', 'wp-curtain-raiser' ),
        );
    }

    /** Curtain image: bundled swatch picker + Media Library upload. */
    public function render_image_field(): void {
        $opts    = WP_Curtain_Raiser::get_options();
        $value   = esc_url( $opts['curtain_image_url'] );
        $bundled = $this->get_bundled_curtain_images();
        ?>
        <!-- Hidden input holds the actual URL sent to sanitize_options -->
        <input type="hidden"
               id="curtain_image_url"
               name="<?php echo esc_attr( self::OPTION_KEY ); ?>[curtain_image_url]"
               value="<?php echo esc_attr( $value ); ?>" />

        <!-- Bundled swatches -->
        <div class="wcr-image-swatches" role="radiogroup" aria-label="<?php esc_attr_e( 'Curtain image options', 'wp-curtain-raiser' ); ?>">

            <!-- "None" swatch -->
            <label class="wcr-swatch <?php echo empty( $value ) ? 'wcr-swatch--selected' : ''; ?>"
                   title="<?php esc_attr_e( 'No image (use colour/theme)', 'wp-curtain-raiser' ); ?>">
                <input type="radio"
                       class="screen-reader-text wcr-swatch-radio"
                       name="_wcr_image_swatch"
                       value=""
                       <?php checked( empty( $value ) ); ?> />
                <span class="wcr-swatch-none" aria-hidden="true">
                    <?php esc_html_e( 'None', 'wp-curtain-raiser' ); ?>
                </span>
            </label>

            <?php foreach ( $bundled as $url => $label ) : ?>
            <label class="wcr-swatch <?php echo ( $value === esc_url( $url ) ) ? 'wcr-swatch--selected' : ''; ?>"
                   title="<?php echo esc_attr( $label ); ?>">
                <input type="radio"
                       class="screen-reader-text wcr-swatch-radio"
                       name="_wcr_image_swatch"
                       value="<?php echo esc_attr( $url ); ?>"
                       <?php checked( $value, esc_url( $url ) ); ?> />
                <img src="<?php echo esc_url( $url ); ?>"
                     alt="<?php echo esc_attr( $label ); ?>"
                     class="wcr-swatch-img" />
                <span class="wcr-swatch-label"><?php echo esc_html( $label ); ?></span>
            </label>
            <?php endforeach; ?>

            <!-- Custom upload swatch — selected when a non-bundled URL is saved -->
            <?php
            $is_custom_url = ! empty( $value ) && ! array_key_exists( $value, array_map( 'esc_url', $bundled ) );
            ?>
            <label class="wcr-swatch wcr-swatch--upload <?php echo $is_custom_url ? 'wcr-swatch--selected' : ''; ?>"
                   title="<?php esc_attr_e( 'Upload or choose from Media Library', 'wp-curtain-raiser' ); ?>"
                   id="wcr-custom-swatch-label">
                <input type="radio"
                       class="screen-reader-text wcr-swatch-radio"
                       name="_wcr_image_swatch"
                       value="__custom__"
                       <?php checked( $is_custom_url ); ?> />
                <span class="wcr-swatch-upload-icon" aria-hidden="true">
                    <span class="dashicons dashicons-upload"></span>
                </span>
                <span class="wcr-swatch-label"><?php esc_html_e( 'Custom', 'wp-curtain-raiser' ); ?></span>
            </label>
        </div>

        <!-- Custom URL row — only visible when Custom swatch is selected -->
        <div id="wcr-custom-url-row" class="wcr-custom-url-row" style="<?php echo $is_custom_url ? '' : 'display:none;'; ?>margin-top:8px;">
            <input type="text"
                   id="wcr_custom_image_text"
                   value="<?php echo esc_attr( $is_custom_url ? $value : '' ); ?>"
                   class="regular-text"
                   placeholder="https://..." />
            <button type="button"
                    class="button wp-curtain-raiser-media-btn"
                    data-target="curtain_image_url"
                    data-text-source="wcr_custom_image_text"
                    data-title="<?php esc_attr_e( 'Select Curtain Image', 'wp-curtain-raiser' ); ?>"
                    data-button="<?php esc_attr_e( 'Use this image', 'wp-curtain-raiser' ); ?>">
                <?php esc_html_e( 'Choose Image', 'wp-curtain-raiser' ); ?>
            </button>
            <?php if ( $is_custom_url ) : ?>
            <div class="wp-curtain-raiser-thumb">
                <img src="<?php echo esc_url( $value ); ?>" alt="" style="max-height:80px;margin-top:8px;" />
            </div>
            <?php endif; ?>
        </div>

        <p class="description" style="margin-top:8px;">
            <?php esc_html_e( 'Choose a bundled image, upload your own, or leave on None to use the colour or gradient above.', 'wp-curtain-raiser' ); ?>
        </p>
        <?php
    }

    /** Rope image with Media Library picker. */
    public function render_rope_field(): void {
        $opts  = WP_Curtain_Raiser::get_options();
        $value = esc_url( $opts['rope_image_url'] );
        ?>
        <input type="text"
               id="rope_image_url"
               name="<?php echo esc_attr( self::OPTION_KEY ); ?>[rope_image_url]"
               value="<?php echo esc_attr( $value ); ?>"
               class="regular-text"
               placeholder="https://..." />
        <button type="button"
                class="button wp-curtain-raiser-media-btn"
                data-target="rope_image_url"
                data-title="<?php esc_attr_e( 'Select Pull-Rope Image', 'wp-curtain-raiser' ); ?>"
                data-button="<?php esc_attr_e( 'Use this image', 'wp-curtain-raiser' ); ?>">
            <?php esc_html_e( 'Choose Image', 'wp-curtain-raiser' ); ?>
        </button>
        <p class="description">
            <?php esc_html_e( 'The pull-rope guests click to open the curtain. Leave blank to use the bundled rope.', 'wp-curtain-raiser' ); ?>
        </p>
        <?php if ( ! empty( $value ) ) : ?>
            <div class="wp-curtain-raiser-thumb">
                <img src="<?php echo esc_url( $value ); ?>" alt="" style="max-height:80px;margin-top:8px;" />
            </div>
        <?php endif; ?>
        <?php
    }

    /** Animation speed range slider. */
    public function render_speed_field(): void {
        $opts  = WP_Curtain_Raiser::get_options();
        $speed = absint( $opts['animation_speed'] );
        ?>
        <input type="range"
               id="animation_speed"
               name="<?php echo esc_attr( self::OPTION_KEY ); ?>[animation_speed]"
               value="<?php echo esc_attr( (string) $speed ); ?>"
               min="200" max="5000" step="100"
               oninput="document.getElementById('animation_speed_display').textContent=this.value+' ms'" />
        <span id="animation_speed_display"><?php echo esc_html( $speed . ' ms' ); ?></span>
        <p class="description">
            <?php esc_html_e( 'How long the curtain takes to fully open or close. Drag left for snappier, right for more dramatic.', 'wp-curtain-raiser' ); ?>
        </p>
        <?php
    }

    /** v1.4 — Countdown enable checkbox. */
    public function render_countdown_enabled_field(): void {
        $opts = WP_Curtain_Raiser::get_options();
        ?>
        <label>
            <input type="checkbox"
                   id="countdown_enabled"
                   name="<?php echo esc_attr( self::OPTION_KEY ); ?>[countdown_enabled]"
                   value="1"
                   <?php checked( ! empty( $opts['countdown_enabled'] ) ); ?> />
            <?php esc_html_e( 'Show a countdown clock on the curtain and open it automatically when the timer reaches zero', 'wp-curtain-raiser' ); ?>
        </label>
        <?php
    }

    /** v1.4 — Countdown target datetime-local input. */
    public function render_countdown_target_field(): void {
        $opts  = WP_Curtain_Raiser::get_options();
        // Convert stored value to datetime-local format (YYYY-MM-DDTHH:MM).
        $raw   = $opts['countdown_target'];
        $value = '';
        if ( $raw ) {
            $ts    = strtotime( $raw );
            $value = $ts ? date( 'Y-m-d\TH:i', $ts ) : '';
        }
        ?>
        <input type="datetime-local"
               id="countdown_target"
               name="<?php echo esc_attr( self::OPTION_KEY ); ?>[countdown_target]"
               value="<?php echo esc_attr( $value ); ?>"
               class="regular-text" />
        <p class="description">
            <?php esc_html_e( 'The curtain opens automatically at this date and time. Uses your WordPress site timezone.', 'wp-curtain-raiser' ); ?>
        </p>
        <?php
    }

    // -----------------------------------------------------------------------
    // Page renderer
    // -----------------------------------------------------------------------

    public function render_page(): void {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        $preview_url = esc_url( add_query_arg( 'curtain_ceremony', 'true', home_url( '/' ) ) );
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Curtain Raiser', 'wp-curtain-raiser' ); ?></h1>
            <p class="description"><?php esc_html_e( 'Configure the look and behaviour of your ceremony curtain. Save, then preview below.', 'wp-curtain-raiser' ); ?></p>

            <form method="post" action="options.php">
                <?php
                settings_fields( self::OPTION_GROUP );
                do_settings_sections( 'wp-curtain-raiser' );
                submit_button( __( 'Save Changes', 'wp-curtain-raiser' ) );
                ?>
            </form>

            <hr />

            <h2><?php esc_html_e( 'Preview &amp; Share', 'wp-curtain-raiser' ); ?></h2>
            <p>
                <?php esc_html_e( 'Open the curtain experience in a new tab to check your settings, or copy the URL below to share with your audience.', 'wp-curtain-raiser' ); ?>
            </p>
            <p>
                <a href="<?php echo esc_url( $preview_url ); ?>"
                   class="button button-primary"
                   target="_blank"
                   rel="noopener noreferrer">
                    <?php esc_html_e( 'Preview Curtain ↗', 'wp-curtain-raiser' ); ?>
                </a>
            </p>
            <p class="description">
                <?php
                printf(
                    /* translators: %s: the trigger URL */
                    esc_html__( 'Audience URL: %s', 'wp-curtain-raiser' ),
                    '<code>' . esc_html( $preview_url ) . '</code>'
                );
                ?>
            </p>

            <hr />

            <h2><?php esc_html_e( 'Quick Start', 'wp-curtain-raiser' ); ?></h2>
            <ol>
                <li>
                    <?php
                    printf(
                        /* translators: %s: query param */
                        esc_html__( 'Add %s to any page URL to show the curtain.', 'wp-curtain-raiser' ),
                        '<code>?curtain_ceremony=true</code>'
                    );
                    ?>
                </li>
                <li><?php esc_html_e( 'Share that URL with your attendees — they will see the closed curtain on load.', 'wp-curtain-raiser' ); ?></li>
                <li><?php esc_html_e( 'Attendees pull the rope to open the curtain themselves, or&hellip;', 'wp-curtain-raiser' ); ?></li>
                <li>
                    <?php
                    printf(
                        /* translators: %s: link to remote control page */
                        esc_html__( '&hellip;use the %s to open all curtains at once from here in the dashboard.', 'wp-curtain-raiser' ),
                        '<a href="' . esc_url( admin_url( 'tools.php?page=wcr-remote' ) ) . '">' . esc_html__( 'Curtain Remote', 'wp-curtain-raiser' ) . '</a>'
                    );
                    ?>
                </li>
            </ol>
        </div>

        <script>
        ( function () {
            // --- v1.4: Show/hide custom colour+image fields based on theme selector ---
            var themeSelect  = document.getElementById( 'curtain_theme' );
            var customRows   = document.querySelectorAll( '.wcr-custom-field-row' );

            function toggleCustomFields() {
                var isCustom = themeSelect.value === 'custom';
                customRows.forEach( function ( row ) {
                    row.style.display = isCustom ? '' : 'none';
                } );
            }

            if ( themeSelect ) {
                themeSelect.addEventListener( 'change', toggleCustomFields );
                toggleCustomFields(); // Run on page load.
            }

            // --- Curtain image swatch picker ---
            var swatchHidden  = document.getElementById( 'curtain_image_url' );
            var customUrlRow  = document.getElementById( 'wcr-custom-url-row' );
            var customTextIn  = document.getElementById( 'wcr_custom_image_text' );

            document.querySelectorAll( '.wcr-swatch-radio' ).forEach( function ( radio ) {
                radio.addEventListener( 'change', function () {
                    // Update all swatch selected states.
                    document.querySelectorAll( '.wcr-swatch' ).forEach( function ( sw ) {
                        sw.classList.remove( 'wcr-swatch--selected' );
                    } );
                    radio.closest( '.wcr-swatch' ).classList.add( 'wcr-swatch--selected' );

                    if ( radio.value === '__custom__' ) {
                        // Show custom URL row, sync text → hidden.
                        if ( customUrlRow )  customUrlRow.style.display = '';
                        if ( swatchHidden )  swatchHidden.value = customTextIn ? customTextIn.value : '';
                    } else {
                        // Bundled or None: hide custom row, write value straight to hidden.
                        if ( customUrlRow )  customUrlRow.style.display = 'none';
                        if ( swatchHidden )  swatchHidden.value = radio.value;
                    }
                } );
            } );

            // Keep hidden in sync when admin types in the custom text box.
            if ( customTextIn && swatchHidden ) {
                customTextIn.addEventListener( 'input', function () {
                    swatchHidden.value = customTextIn.value;
                } );
            }

            // --- Media Library picker ---
            document.querySelectorAll( '.wp-curtain-raiser-media-btn' ).forEach( function ( btn ) {
                btn.addEventListener( 'click', function () {
                    var targetId   = btn.dataset.target;      // hidden input id
                    var textSrcId  = btn.dataset.textSource;  // visible text input id (optional)
                    var frame = wp.media( {
                        title:    btn.dataset.title,
                        button:   { text: btn.dataset.button },
                        multiple: false,
                        library:  { type: 'image' }
                    } );
                    frame.on( 'select', function () {
                        var url = frame.state().get( 'selection' ).first().toJSON().url;
                        // Write to hidden input.
                        var hiddenEl = document.getElementById( targetId );
                        if ( hiddenEl ) hiddenEl.value = url;
                        // Mirror to visible text input if specified.
                        if ( textSrcId ) {
                            var textEl = document.getElementById( textSrcId );
                            if ( textEl ) textEl.value = url;
                        }
                        // Ensure the "Custom" swatch is selected & row visible.
                        var customRadio = document.querySelector( '.wcr-swatch-radio[value="__custom__"]' );
                        if ( customRadio && ! customRadio.checked ) {
                            customRadio.checked = true;
                            customRadio.dispatchEvent( new Event( 'change' ) );
                        }
                    } );
                    frame.open();
                } );
            } );
        } )();
        </script>
        <?php
    }
}
