<?php
/**
 * WP-CLI commands for WP Curtain Raiser.
 *
 * Registers the `wp curtain-raiser` top-level command with three sub-commands:
 *   status       — display current plugin options as a table
 *   preview-url  — output a curtain-ceremony URL for quick testing
 *   reset        — restore all options to factory defaults
 *
 * @package WP_Curtain_Raiser
 * @since   1.5.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Manage WP Curtain Raiser settings from the command line.
 *
 * ## EXAMPLES
 *
 *     # Show current plugin settings
 *     $ wp curtain-raiser status
 *
 *     # Get a preview URL
 *     $ wp curtain-raiser preview-url
 *
 *     # Reset all settings to defaults (prompts for confirmation)
 *     $ wp curtain-raiser reset
 *
 *     # Reset without confirmation prompt
 *     $ wp curtain-raiser reset --yes
 */
class WP_Curtain_Raiser_CLI {

    // -----------------------------------------------------------------------
    // status
    // -----------------------------------------------------------------------

    /**
     * Display current plugin options as a formatted table.
     *
     * ## EXAMPLES
     *
     *     $ wp curtain-raiser status
     *     +--------------------+----------+
     *     | Option             | Value    |
     *     +--------------------+----------+
     *     | curtain_color      | #8B0000  |
     *     | curtain_image_url  |          |
     *     | animation_speed    | 2000     |
     *     | rope_image_url     |          |
     *     | curtain_theme      | custom   |
     *     | countdown_enabled  | false    |
     *     | countdown_target   |          |
     *     +--------------------+----------+
     *
     * @when after_wp_load
     */
    public function status(): void {
        $opts = WP_Curtain_Raiser::get_options();

        $rows = array();
        foreach ( $opts as $key => $value ) {
            $rows[] = array(
                'Option' => $key,
                'Value'  => is_bool( $value ) ? ( $value ? 'true' : 'false' ) : (string) $value,
            );
        }

        \WP_CLI\Utils\format_items( 'table', $rows, array( 'Option', 'Value' ) );
    }

    // -----------------------------------------------------------------------
    // preview-url
    // -----------------------------------------------------------------------

    /**
     * Output a URL with ?curtain_ceremony=true appended to the home URL.
     *
     * ## EXAMPLES
     *
     *     $ wp curtain-raiser preview-url
     *     https://example.com/?curtain_ceremony=true
     *
     * @subcommand preview-url
     * @when after_wp_load
     */
    public function preview_url(): void {
        $url = add_query_arg( 'curtain_ceremony', 'true', home_url( '/' ) );
        WP_CLI::line( $url );
    }

    // -----------------------------------------------------------------------
    // reset
    // -----------------------------------------------------------------------

    /**
     * Reset all plugin options to factory defaults.
     *
     * ## OPTIONS
     *
     * [--yes]
     * : Skip the confirmation prompt.
     *
     * ## EXAMPLES
     *
     *     # With confirmation prompt
     *     $ wp curtain-raiser reset
     *     Reset all WP Curtain Raiser settings to defaults? [y/n] y
     *     Success: WP Curtain Raiser settings reset to defaults.
     *
     *     # Skip prompt
     *     $ wp curtain-raiser reset --yes
     *     Success: WP Curtain Raiser settings reset to defaults.
     *
     * @when after_wp_load
     */
    public function reset( array $args, array $assoc_args ): void {
        WP_CLI::confirm( 'Reset all WP Curtain Raiser settings to defaults?', $assoc_args );

        update_option( 'wp_curtain_raiser_options', WP_Curtain_Raiser::$defaults );

        WP_CLI::success( 'WP Curtain Raiser settings reset to defaults.' );
    }
}
