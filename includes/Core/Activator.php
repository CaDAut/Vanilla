<?php
/**
 * Plugin Activator Class
 *
 * @package VanillaBuilder
 */

namespace VanillaBuilder\Core;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Plugin Activator Class
 * 
 * Handles plugin activation, deactivation, and uninstall
 */
class Activator {
    
    /**
     * Plugin activation
     */
    public static function activate(): void {
        // Check requirements
        self::checkRequirements();
        
        // Create database tables
        self::createTables();
        
        // Set default options
        self::setDefaultOptions();
        
        // Create upload directories
        self::createDirectories();
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Set activation flag
        add_option('vanilla_builder_activated', true);
        
        // Record activation time
        add_option('vanilla_builder_activation_time', current_time('timestamp'));
    }
    
    /**
     * Plugin deactivation
     */
    public static function deactivate(): void {
        // Clear scheduled events
        wp_clear_scheduled_hook('vanilla_builder_cleanup');
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Remove activation flag
        delete_option('vanilla_builder_activated');
    }
    
    /**
     * Plugin uninstall
     */
    public static function uninstall(): void {
        // Check if we should preserve data
        $preserve_data = get_option('vanilla_builder_preserve_data', false);
        
        if (!$preserve_data) {
            // Drop database tables
            self::dropTables();
            
            // Remove options
            self::removeOptions();
            
            // Remove upload directories
            self::removeDirectories();
            
            // Remove user meta
            self::removeUserMeta();
        }
        
        // Clear all caches
        wp_cache_flush();
    }
    
    /**
     * Check plugin requirements
     */
    private static function checkRequirements(): void {
        // Check PHP version
        if (version_compare(PHP_VERSION, '8.0', '<')) {
            wp_die(
                esc_html__('Vanilla Builder requires PHP 8.0 or higher.', 'vanilla-builder'),
                esc_html__('Plugin Activation Error', 'vanilla-builder'),
                ['back_link' => true]
            );
        }
        
        // Check WordPress version
        if (version_compare(get_bloginfo('version'), '6.0', '<')) {
            wp_die(
                esc_html__('Vanilla Builder requires WordPress 6.0 or higher.', 'vanilla-builder'),
                esc_html__('Plugin Activation Error', 'vanilla-builder'),
                ['back_link' => true]
            );
        }
        
        // Check required PHP extensions
        $required_extensions = ['json', 'mbstring'];
        foreach ($required_extensions as $extension) {
            if (!extension_loaded($extension)) {
                wp_die(
                    sprintf(
                        esc_html__('Vanilla Builder requires the %s PHP extension.', 'vanilla-builder'),
                        $extension
                    ),
                    esc_html__('Plugin Activation Error', 'vanilla-builder'),
                    ['back_link' => true]
                );
            }
        }
    }
    
    /**
     * Create database tables
     */
    private static function createTables(): void {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Layouts table
        $layouts_table = $wpdb->prefix . 'vb_layouts';
        $layouts_sql = "CREATE TABLE $layouts_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            name varchar(255) NOT NULL,
            data longtext NOT NULL,
            settings longtext,
            status varchar(20) DEFAULT 'draft',
            author_id bigint(20) unsigned NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY author_id (author_id),
            KEY status (status),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        // Elements table
        $elements_table = $wpdb->prefix . 'vb_elements';
        $elements_sql = "CREATE TABLE $elements_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            layout_id mediumint(9) NOT NULL,
            element_type varchar(50) NOT NULL,
            element_data longtext NOT NULL,
            parent_id mediumint(9) DEFAULT NULL,
            sort_order int(11) DEFAULT 0,
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY layout_id (layout_id),
            KEY element_type (element_type),
            KEY parent_id (parent_id),
            KEY sort_order (sort_order)
        ) $charset_collate;";
        
        // Element revisions table
        $revisions_table = $wpdb->prefix . 'vb_element_revisions';
        $revisions_sql = "CREATE TABLE $revisions_table (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            element_id mediumint(9) NOT NULL,
            element_data longtext NOT NULL,
            revision_note varchar(255),
            created_at datetime DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY element_id (element_id),
            KEY created_at (created_at)
        ) $charset_collate;";
        
        require_once ABSPATH . 'wp-admin/includes/upgrade.php';
        
        dbDelta($layouts_sql);
        dbDelta($elements_sql);
        dbDelta($revisions_sql);
        
        // Update database version
        add_option('vanilla_builder_db_version', '1.0.0');
    }
    
    /**
     * Set default options
     */
    private static function setDefaultOptions(): void {
        $default_options = [
            'vanilla_builder_enabled' => true,
            'vanilla_builder_load_css' => true,
            'vanilla_builder_load_js' => true,
            'vanilla_builder_editor_theme' => 'light',
            'vanilla_builder_max_revisions' => 10,
            'vanilla_builder_auto_save' => true,
            'vanilla_builder_auto_save_interval' => 30, // seconds
            'vanilla_builder_preserve_data' => false,
        ];
        
        foreach ($default_options as $option_name => $default_value) {
            add_option($option_name, $default_value);
        }
    }
    
    /**
     * Create upload directories
     */
    private static function createDirectories(): void {
        $upload_dir = wp_upload_dir();
        $vanilla_dir = $upload_dir['basedir'] . '/vanilla-builder';
        
        $directories = [
            $vanilla_dir,
            $vanilla_dir . '/templates',
            $vanilla_dir . '/exports',
            $vanilla_dir . '/cache',
        ];
        
        foreach ($directories as $dir) {
            if (!file_exists($dir)) {
                wp_mkdir_p($dir);
                
                // Add index.php for security
                $index_file = $dir . '/index.php';
                if (!file_exists($index_file)) {
                    file_put_contents($index_file, '<?php // Silence is golden');
                }
            }
        }
    }
    
    /**
     * Drop database tables
     */
    private static function dropTables(): void {
        global $wpdb;
        
        $tables = [
            $wpdb->prefix . 'vb_layouts',
            $wpdb->prefix . 'vb_elements',
            $wpdb->prefix . 'vb_element_revisions',
        ];
        
        foreach ($tables as $table) {
            $wpdb->query("DROP TABLE IF EXISTS $table");
        }
        
        delete_option('vanilla_builder_db_version');
    }
    
    /**
     * Remove plugin options
     */
    private static function removeOptions(): void {
        $options = [
            'vanilla_builder_enabled',
            'vanilla_builder_load_css',
            'vanilla_builder_load_js',
            'vanilla_builder_editor_theme',
            'vanilla_builder_max_revisions',
            'vanilla_builder_auto_save',
            'vanilla_builder_auto_save_interval',
            'vanilla_builder_preserve_data',
            'vanilla_builder_activation_time',
        ];
        
        foreach ($options as $option) {
            delete_option($option);
        }
    }
    
    /**
     * Remove upload directories
     */
    private static function removeDirectories(): void {
        $upload_dir = wp_upload_dir();
        $vanilla_dir = $upload_dir['basedir'] . '/vanilla-builder';
        
        if (file_exists($vanilla_dir)) {
            self::removeDirectory($vanilla_dir);
        }
    }
    
    /**
     * Remove user meta
     */
    private static function removeUserMeta(): void {
        global $wpdb;
        
        $meta_keys = [
            'vanilla_builder_preferences',
            'vanilla_builder_last_used',
        ];
        
        foreach ($meta_keys as $meta_key) {
            $wpdb->delete(
                $wpdb->usermeta,
                ['meta_key' => $meta_key]
            );
        }
    }
    
    /**
     * Recursively remove directory
     */
    private static function removeDirectory(string $dir): bool {
        if (!is_dir($dir)) {
            return false;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            if (is_dir($path)) {
                self::removeDirectory($path);
            } else {
                unlink($path);
            }
        }
        
        return rmdir($dir);
    }
}