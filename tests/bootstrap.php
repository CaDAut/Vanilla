<?php
/**
 * PHPUnit Bootstrap File
 *
 * @package VanillaBuilder
 */

// Define test environment
define('VANILLA_BUILDER_TESTING', true);

// Load Composer autoloader
if (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require_once dirname(__DIR__) . '/vendor/autoload.php';
}

// Define WordPress test constants
define('WP_TESTS_PHPUNIT_POLYFILLS_PATH', dirname(__DIR__) . '/vendor/phpunit/phpunit/');

// WordPress test bootstrap would go here
// For now, we'll just mock the basic WordPress functions needed for testing

if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1) {
        // Mock implementation
        return true;
    }
}

if (!function_exists('add_filter')) {
    function add_filter($hook, $callback, $priority = 10, $accepted_args = 1) {
        // Mock implementation
        return true;
    }
}

if (!function_exists('__')) {
    function __($text, $domain = 'default') {
        return $text;
    }
}

if (!function_exists('esc_html__')) {
    function esc_html__($text, $domain = 'default') {
        return htmlspecialchars($text);
    }
}

if (!function_exists('plugin_dir_path')) {
    function plugin_dir_path($file) {
        return dirname($file) . '/';
    }
}

if (!function_exists('plugin_dir_url')) {
    function plugin_dir_url($file) {
        return 'http://localhost/wp-content/plugins/' . basename(dirname($file)) . '/';
    }
}

if (!function_exists('plugin_basename')) {
    function plugin_basename($file) {
        return basename(dirname($file)) . '/' . basename($file);
    }
}

if (!defined('ABSPATH')) {
    define('ABSPATH', '/tmp/');
}

// Define plugin constants for testing
define('VANILLA_BUILDER_VERSION', '1.0.0');
define('VANILLA_BUILDER_PLUGIN_FILE', dirname(__DIR__) . '/vanilla-builder.php');
define('VANILLA_BUILDER_PLUGIN_DIR', dirname(__DIR__) . '/');
define('VANILLA_BUILDER_PLUGIN_URL', 'http://localhost/wp-content/plugins/vanilla-builder/');
define('VANILLA_BUILDER_PLUGIN_BASENAME', 'vanilla-builder/vanilla-builder.php');