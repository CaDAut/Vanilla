<?php
/**
 * Main Plugin Class
 *
 * @package VanillaBuilder
 */

namespace VanillaBuilder\Core;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Main Plugin Class
 * 
 * Singleton pattern implementation for the main plugin functionality
 */
class Plugin {
    
    /**
     * Plugin instance
     *
     * @var Plugin|null
     */
    private static ?Plugin $instance = null;
    
    /**
     * Assets manager instance
     *
     * @var Assets|null
     */
    private ?Assets $assets = null;
    
    /**
     * Get plugin instance
     *
     * @return Plugin
     */
    public static function getInstance(): Plugin {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        
        return self::$instance;
    }
    
    /**
     * Constructor - Private to enforce singleton
     */
    private function __construct() {
        $this->init();
    }
    
    /**
     * Initialize the plugin
     */
    private function init(): void {
        // Initialize core components
        $this->assets = new Assets();
        
        // Hook into WordPress
        add_action('init', [$this, 'onInit']);
        add_action('admin_menu', [$this, 'addAdminMenu']);
        add_action('rest_api_init', [$this, 'initRestApi']);
        
        // Load text domain
        add_action('plugins_loaded', [$this, 'loadTextDomain']);
        
        // Enqueue admin assets
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
        
        // Add custom post type support
        add_action('init', [$this, 'registerPostTypes']);
    }
    
    /**
     * Initialize on WordPress init
     */
    public function onInit(): void {
        // Register custom post types and taxonomies
        $this->registerPostTypes();
        
        // Initialize admin interface
        if (is_admin()) {
            $this->initAdmin();
        }
        
        // Initialize frontend
        if (!is_admin()) {
            $this->initFrontend();
        }
    }
    
    /**
     * Load plugin text domain
     */
    public function loadTextDomain(): void {
        load_plugin_textdomain(
            'vanilla-builder',
            false,
            dirname(VANILLA_BUILDER_PLUGIN_BASENAME) . '/languages'
        );
    }
    
    /**
     * Add admin menu
     */
    public function addAdminMenu(): void {
        add_menu_page(
            __('Vanilla Builder', 'vanilla-builder'),
            __('Vanilla Builder', 'vanilla-builder'),
            'manage_options',
            'vanilla-builder',
            [$this, 'renderAdminPage'],
            'dashicons-layout',
            30
        );
        
        add_submenu_page(
            'vanilla-builder',
            __('Editor', 'vanilla-builder'),
            __('Editor', 'vanilla-builder'),
            'edit_posts',
            'vanilla-builder-editor',
            [$this, 'renderEditorPage']
        );
        
        add_submenu_page(
            'vanilla-builder',
            __('Settings', 'vanilla-builder'),
            __('Settings', 'vanilla-builder'),
            'manage_options',
            'vanilla-builder-settings',
            [$this, 'renderSettingsPage']
        );
    }
    
    /**
     * Initialize REST API
     */
    public function initRestApi(): void {
        // Initialize REST controllers
        $controllers = [
            'VanillaBuilder\\API\\RestController',
        ];
        
        foreach ($controllers as $controller) {
            if (class_exists($controller)) {
                $instance = new $controller();
                $instance->registerRoutes();
            }
        }
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueueAdminAssets($hook): void {
        // Only load on our admin pages
        if (strpos($hook, 'vanilla-builder') === false) {
            return;
        }
        
        if ($this->assets) {
            $this->assets->enqueueAdminAssets();
        }
    }
    
    /**
     * Register custom post types
     */
    public function registerPostTypes(): void {
        // Register layout post type
        register_post_type('vb_layout', [
            'label' => __('Layouts', 'vanilla-builder'),
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => false,
            'capability_type' => 'post',
            'supports' => ['title', 'editor'],
            'show_in_rest' => true,
            'rest_base' => 'vb-layouts',
        ]);
        
        // Register element post type
        register_post_type('vb_element', [
            'label' => __('Elements', 'vanilla-builder'),
            'public' => false,
            'show_ui' => false,
            'capability_type' => 'post',
            'supports' => ['title', 'editor'],
            'show_in_rest' => true,
            'rest_base' => 'vb-elements',
        ]);
    }
    
    /**
     * Initialize admin interface
     */
    private function initAdmin(): void {
        // Admin-specific initialization
        if (class_exists('VanillaBuilder\\Admin\\Pages')) {
            new \VanillaBuilder\Admin\Pages();
        }
    }
    
    /**
     * Initialize frontend
     */
    private function initFrontend(): void {
        // Frontend-specific initialization
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueueFrontendAssets(): void {
        if ($this->assets) {
            $this->assets->enqueueFrontendAssets();
        }
    }
    
    /**
     * Render admin page
     */
    public function renderAdminPage(): void {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Vanilla Builder', 'vanilla-builder') . '</h1>';
        echo '<p>' . esc_html__('Welcome to Vanilla Builder - the powerful drag-and-drop page builder for WordPress.', 'vanilla-builder') . '</p>';
        echo '<div id="vanilla-builder-admin-root"></div>';
        echo '</div>';
    }
    
    /**
     * Render editor page
     */
    public function renderEditorPage(): void {
        echo '<div class="wrap">';
        echo '<div id="vanilla-builder-editor-root"></div>';
        echo '</div>';
    }
    
    /**
     * Render settings page
     */
    public function renderSettingsPage(): void {
        echo '<div class="wrap">';
        echo '<h1>' . esc_html__('Vanilla Builder Settings', 'vanilla-builder') . '</h1>';
        echo '<div id="vanilla-builder-settings-root"></div>';
        echo '</div>';
    }
    
    /**
     * Get plugin version
     *
     * @return string
     */
    public function getVersion(): string {
        return VANILLA_BUILDER_VERSION;
    }
    
    /**
     * Get plugin URL
     *
     * @return string
     */
    public function getPluginUrl(): string {
        return VANILLA_BUILDER_PLUGIN_URL;
    }
    
    /**
     * Get plugin directory
     *
     * @return string
     */
    public function getPluginDir(): string {
        return VANILLA_BUILDER_PLUGIN_DIR;
    }
}