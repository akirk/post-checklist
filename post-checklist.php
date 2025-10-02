<?php
/**
 * Plugin Name: Post Checklist
 * Description: Pre-publish checklist to verify categories, tags, excerpt, and featured image
 * Version: 1.0.0
 * Author: Alex Kirk
 * Text Domain: post-checklist
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function post_checklist_enqueue_editor_assets() {
	$asset_file = plugin_dir_path( __FILE__ ) . 'build/index.asset.php';

	if ( ! file_exists( $asset_file ) ) {
		return;
	}

	$asset = include $asset_file;

	wp_enqueue_script(
		'post-checklist-editor',
		plugin_dir_url( __FILE__ ) . 'build/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_enqueue_style(
		'post-checklist-editor',
		plugin_dir_url( __FILE__ ) . 'build/style-index.css',
		[],
		$asset['version']
	);
}
add_action( 'enqueue_block_editor_assets', 'post_checklist_enqueue_editor_assets' );
