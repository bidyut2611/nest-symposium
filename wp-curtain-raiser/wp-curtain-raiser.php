<?php
/**
 * Plugin Name: Curtain Raiser for Inaugural Ceremony
 * Plugin URI:  https://wordpress.org/plugins/wp-curtain-raiser/
 * Description: Adds an animated curtain-raiser overlay to your WordPress site for inaugural ceremonies. Trigger via ?curtain_ceremony=true.
 * Version:     1.6.2
 * Author:      Team Peenak
 * Author URI:  https://www.peenak.com/
 * License:     GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-curtain-raiser
 * Domain Path: /languages
 *
 * @package WP_Curtain_Raiser
 * @since   1.0.0
 * @updated 1.1.0 — Removed jQuery dependency; animation now driven by CSS transitions.
 * @updated 1.3.0 — ARIA dialog wrapper, focus trap, live region, i18n strings.
 * @updated 1.4.0 — Gradient theme presets, countdown timer, new settings fields.
 * @updated 1.5.0 — PHP action/filter hooks, DOM custom events, WP-CLI command.
 * @updated 1.6.0 — Remote reveal: one-time tokens, REST polling, Tools admin page.
 */

defined( 'ABSPATH' ) || exit;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
define( 'WP_CURTAIN_RAISER_VERSION', '1.6.2' );
define( 'WP_CURTAIN_RAISER_FILE',    __FILE__ );
define( 'WP_CURTAIN_RAISER_DIR',     plugin_dir_path( __FILE__ ) );
define( 'WP_CURTAIN_RAISER_URL',     plugin_dir_url( __FILE__ ) );

// ---------------------------------------------------------------------------
// Includes
// ---------------------------------------------------------------------------
require_once WP_CURTAIN_RAISER_DIR . 'includes/class-wp-curtain-raiser.php';
require_once WP_CURTAIN_RAISER_DIR . 'includes/class-wp-curtain-raiser-settings.php';
require_once WP_CURTAIN_RAISER_DIR . 'includes/class-wp-curtain-raiser-remote.php';

// v1.5 — WP-CLI command (only loaded in CLI context to avoid overhead on web requests).
if ( defined( 'WP_CLI' ) && WP_CLI ) {
    require_once WP_CURTAIN_RAISER_DIR . 'includes/class-wp-curtain-raiser-cli.php';
    WP_CLI::add_command( 'curtain-raiser', 'WP_Curtain_Raiser_CLI' );
}

// ---------------------------------------------------------------------------
// Lifecycle hooks  (must be registered at file scope, not inside other hooks)
// ---------------------------------------------------------------------------
register_activation_hook(   WP_CURTAIN_RAISER_FILE, array( 'WP_Curtain_Raiser', 'activate' ) );
register_deactivation_hook( WP_CURTAIN_RAISER_FILE, array( 'WP_Curtain_Raiser', 'deactivate' ) );
// Uninstall is handled by uninstall.php

// ---------------------------------------------------------------------------
// i18n — load bundled translations from /languages.
// Required for the shipped hi_IN / mr_IN files: WordPress' automatic
// translation loading only checks wp-content/languages/plugins/ (language
// packs), never a plugin's own Domain Path. Hooked on `init` because
// WP 6.7+ warns when a textdomain is loaded earlier.
// ---------------------------------------------------------------------------
add_action( 'init', static function () {
    load_plugin_textdomain(
        'wp-curtain-raiser',
        false,
        dirname( plugin_basename( WP_CURTAIN_RAISER_FILE ) ) . '/languages'
    );
} );

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
add_action( 'plugins_loaded', static function () {
    new WP_Curtain_Raiser();
    new WP_Curtain_Raiser_Settings();
    new WP_Curtain_Raiser_Remote();
} );
