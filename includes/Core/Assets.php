<?php
/**
 * Assets Manager Class
 *
 * @package VanillaBuilder
 */

namespace VanillaBuilder\Core;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Assets Manager Class
 * 
 * Handles loading and management of CSS and JS assets
 */
class Assets {
    
    /**
     * Asset version for cache busting
     *
     * @var string
     */
    private string $version;
    
    /**
     * Plugin URL
     *
     * @var string
     */
    private string $plugin_url;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->version = VANILLA_BUILDER_VERSION;
        $this->plugin_url = VANILLA_BUILDER_PLUGIN_URL;
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueueAdminAssets(): void {
        // Enqueue React build files
        $this->enqueueReactAssets();
        
        // Enqueue admin CSS
        wp_enqueue_style(
            'vanilla-builder-admin',
            $this->plugin_url . 'assets/css/admin.css',
            [],
            $this->version
        );
        
        // Enqueue WordPress dependencies
        wp_enqueue_script('wp-api-fetch');
        wp_enqueue_script('wp-i18n');
        wp_enqueue_script('wp-components');
        wp_enqueue_script('wp-element');
        
        // Localize script data
        $this->localizeAdminData();
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueueFrontendAssets(): void {
        // Only load if needed (when page contains Vanilla Builder content)
        if (!$this->shouldLoadFrontendAssets()) {
            return;
        }
        
        // Enqueue frontend CSS
        wp_enqueue_style(
            'vanilla-builder-frontend',
            $this->plugin_url . 'assets/css/frontend.css',
            [],
            $this->version
        );
        
        // Enqueue frontend JS if needed
        if (get_option('vanilla_builder_load_js', true)) {
            wp_enqueue_script(
                'vanilla-builder-frontend',
                $this->plugin_url . 'assets/js/frontend.js',
                ['jquery'],
                $this->version,
                true
            );
        }
    }
    
    /**
     * Enqueue React assets
     */
    private function enqueueReactAssets(): void {
        $dist_path = $this->plugin_url . 'dist/';
        
        // Check if build files exist
        $js_file = VANILLA_BUILDER_PLUGIN_DIR . 'dist/main.js';
        $css_file = VANILLA_BUILDER_PLUGIN_DIR . 'dist/main.css';
        
        if (file_exists($js_file)) {
            wp_enqueue_script(
                'vanilla-builder-react',
                $dist_path . 'main.js',
                ['wp-element', 'wp-api-fetch', 'wp-i18n'],
                $this->getFileVersion($js_file),
                true
            );
        } else {
            // Development mode - load individual files
            $this->enqueueDevelopmentAssets();
        }
        
        if (file_exists($css_file)) {
            wp_enqueue_style(
                'vanilla-builder-react-styles',
                $dist_path . 'main.css',
                [],
                $this->getFileVersion($css_file)
            );
        }
    }
    
    /**
     * Enqueue development assets
     */
    private function enqueueDevelopmentAssets(): void {
        // In development, we might want to load from webpack dev server
        $dev_server_url = 'http://localhost:3000/';
        
        // Check if development server is running
        if ($this->isDevServerRunning()) {
            wp_enqueue_script(
                'vanilla-builder-react-dev',
                $dev_server_url . 'main.js',
                ['wp-element', 'wp-api-fetch', 'wp-i18n'],
                time(), // No caching in dev
                true
            );
        } else {
            // Show admin notice about missing build
            add_action('admin_notices', [$this, 'showBuildNotice']);
        }
    }
    
    /**
     * Localize admin data
     */
    private function localizeAdminData(): void {
        $current_user = wp_get_current_user();
        
        $data = [
            'apiUrl' => home_url('/wp-json/vanilla-builder/v1/'),
            'nonce' => wp_create_nonce('wp_rest'),
            'currentUser' => [
                'id' => $current_user->ID,
                'name' => $current_user->display_name,
                'email' => $current_user->user_email,
                'capabilities' => [
                    'edit_posts' => current_user_can('edit_posts'),
                    'manage_options' => current_user_can('manage_options'),
                ],
            ],
            'settings' => [
                'editorTheme' => get_option('vanilla_builder_editor_theme', 'light'),
                'autoSave' => get_option('vanilla_builder_auto_save', true),
                'autoSaveInterval' => get_option('vanilla_builder_auto_save_interval', 30),
                'maxRevisions' => get_option('vanilla_builder_max_revisions', 10),
            ],
            'i18n' => [
                'locale' => get_locale(),
                'textDomain' => 'vanilla-builder',
            ],
            'urls' => [
                'admin' => admin_url('admin.php?page=vanilla-builder'),
                'editor' => admin_url('admin.php?page=vanilla-builder-editor'),
                'settings' => admin_url('admin.php?page=vanilla-builder-settings'),
                'uploads' => wp_upload_dir()['baseurl'] . '/vanilla-builder/',
            ],
            'version' => $this->version,
        ];
        
        wp_localize_script(
            'vanilla-builder-react',
            'vanillaBuilderData',
            $data
        );
        
        // Set up WordPress i18n for JavaScript
        wp_set_script_translations(
            'vanilla-builder-react',
            'vanilla-builder',
            VANILLA_BUILDER_PLUGIN_DIR . 'languages'
        );
    }
    
    /**
     * Check if we should load frontend assets
     */
    private function shouldLoadFrontendAssets(): bool {
        // Check if current page/post has Vanilla Builder content
        global $post;
        
        if (!$post) {
            return false;
        }
        
        // Check post meta for Vanilla Builder usage
        $has_vanilla_content = get_post_meta($post->ID, '_vanilla_builder_enabled', true);
        
        // Check if content contains Vanilla Builder shortcodes
        $has_shortcodes = has_shortcode($post->post_content, 'vanilla_builder') ||
                         has_shortcode($post->post_content, 'vb_element');
        
        // Check if we're on a Vanilla Builder template
        $is_vanilla_template = get_post_meta($post->ID, '_vanilla_builder_template', true);
        
        return $has_vanilla_content || $has_shortcodes || $is_vanilla_template;
    }
    
    /**
     * Get file modification time for cache busting
     */
    private function getFileVersion(string $file_path): string {
        if (file_exists($file_path)) {
            return $this->version . '.' . filemtime($file_path);
        }
        
        return $this->version;
    }
    
    /**
     * Check if development server is running
     */
    private function isDevServerRunning(): bool {
        $context = stream_context_create([
            'http' => [
                'timeout' => 1,
                'ignore_errors' => true,
            ]
        ]);
        
        $result = @file_get_contents('http://localhost:3000/', false, $context);
        
        return $result !== false;
    }
    
    /**
     * Show notice about missing build files
     */
    public function showBuildNotice(): void {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        echo '<div class="notice notice-warning is-dismissible">';
        echo '<p>';
        echo esc_html__('Vanilla Builder: React build files are missing. Please run "npm run build" to compile the assets.', 'vanilla-builder');
        echo '</p>';
        echo '</div>';
    }
    
    /**
     * Register admin styles and scripts
     */
    public function registerAssets(): void {
        // Register admin styles
        wp_register_style(
            'vanilla-builder-admin',
            $this->plugin_url . 'assets/css/admin.css',
            [],
            $this->version
        );
        
        // Register frontend styles
        wp_register_style(
            'vanilla-builder-frontend',
            $this->plugin_url . 'assets/css/frontend.css',
            [],
            $this->version
        );
        
        // Register scripts
        wp_register_script(
            'vanilla-builder-admin',
            $this->plugin_url . 'assets/js/admin.js',
            ['jquery', 'wp-api-fetch'],
            $this->version,
            true
        );
    }
    
    /**
     * Get asset URL
     */
    public function getAssetUrl(string $asset_path): string {
        return $this->plugin_url . ltrim($asset_path, '/');
    }
    
    /**
     * Check if asset exists
     */
    public function assetExists(string $asset_path): bool {
        $file_path = VANILLA_BUILDER_PLUGIN_DIR . ltrim($asset_path, '/');
        return file_exists($file_path);
    }
}