<?php
/**
 * Plugin Name: Vanilla Builder
 * Plugin URI: https://github.com/CaDAut/Vanilla
 * Description: A powerful drag-and-drop page builder for WordPress with React integration.
 * Version: 1.0.0
 * Author: CaDAut
 * Author URI: https://github.com/CaDAut
 * License: GPL v3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: vanilla-builder
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.4
 * Requires PHP: 8.0
 * Network: false
 *
 * @package VanillaBuilder
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('VANILLA_BUILDER_VERSION', '1.0.0');
define('VANILLA_BUILDER_PLUGIN_FILE', __FILE__);
define('VANILLA_BUILDER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('VANILLA_BUILDER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('VANILLA_BUILDER_PLUGIN_BASENAME', plugin_basename(__FILE__));

// Require Composer autoloader
if (file_exists(VANILLA_BUILDER_PLUGIN_DIR . 'vendor/autoload.php')) {
    require_once VANILLA_BUILDER_PLUGIN_DIR . 'vendor/autoload.php';
}

// Main plugin initialization
function vanilla_builder_init() {
    // Check PHP version
    if (version_compare(PHP_VERSION, '8.0', '<')) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-error"><p>';
            echo __('Vanilla Builder requires PHP 8.0 or higher. Please update your PHP version.', 'vanilla-builder');
            echo '</p></div>';
        });
        return;
    }

    // Check WordPress version
    if (version_compare(get_bloginfo('version'), '6.0', '<')) {
        add_action('admin_notices', function() {
            echo '<div class="notice notice-error"><p>';
            echo __('Vanilla Builder requires WordPress 6.0 or higher. Please update your WordPress installation.', 'vanilla-builder');
            echo '</p></div>';
        });
        return;
    }

    // Initialize the plugin
    if (class_exists('VanillaBuilder\\Core\\Plugin')) {
        VanillaBuilder\Core\Plugin::getInstance();
    }
}

// Hook into plugins_loaded to ensure WordPress is fully loaded
add_action('plugins_loaded', 'vanilla_builder_init');

// Activation hook
register_activation_hook(__FILE__, function() {
    if (class_exists('VanillaBuilder\\Core\\Activator')) {
        VanillaBuilder\Core\Activator::activate();
    }
});

// Deactivation hook
register_deactivation_hook(__FILE__, function() {
    if (class_exists('VanillaBuilder\\Core\\Activator')) {
        VanillaBuilder\Core\Activator::deactivate();
    }
});

// Uninstall hook
register_uninstall_hook(__FILE__, function() {
    if (class_exists('VanillaBuilder\\Core\\Activator')) {
        VanillaBuilder\Core\Activator::uninstall();
    }
});