<?php
/**
 * Uninstall handler for WP Curtain Raiser.
 *
 * Runs when a user deletes the plugin from the WordPress admin.
 * Removes all data stored by the plugin so no orphaned rows are left behind.
 *
 * @package WP_Curtain_Raiser
 * @since   1.0.0
 * @updated 1.6.0 — Added cleanup for remote-control token data.
 */

// Security: abort if this file is called directly (not via WP uninstall flow).
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Remove the plugin settings row.
delete_option( 'wp_curtain_raiser_options' );

// v1.6 — Remove active reveal token and its transient.
$active_token = get_option( 'wcr_active_token', '' );
if ( ! empty( $active_token ) ) {
    delete_transient( 'wcr_reveal_token_' . $active_token );
}
delete_option( 'wcr_active_token' );
