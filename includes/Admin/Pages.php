<?php
/**
 * Admin Pages Class
 *
 * @package VanillaBuilder
 */

namespace VanillaBuilder\Admin;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Admin Pages Class
 * 
 * Handles admin page functionality and rendering
 */
class Pages {
    
    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_init', [$this, 'init']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAssets']);
    }
    
    /**
     * Initialize admin pages
     */
    public function init(): void {
        // Add settings sections and fields
        $this->registerSettings();
        
        // Add admin notices
        add_action('admin_notices', [$this, 'showAdminNotices']);
    }
    
    /**
     * Register plugin settings
     */
    private function registerSettings(): void {
        // General settings section
        add_settings_section(
            'vanilla_builder_general',
            __('General Settings', 'vanilla-builder'),
            [$this, 'renderGeneralSectionDescription'],
            'vanilla-builder-settings'
        );
        
        // Editor settings section
        add_settings_section(
            'vanilla_builder_editor',
            __('Editor Settings', 'vanilla-builder'),
            [$this, 'renderEditorSectionDescription'],
            'vanilla-builder-settings'
        );
        
        // Performance settings section
        add_settings_section(
            'vanilla_builder_performance',
            __('Performance Settings', 'vanilla-builder'),
            [$this, 'renderPerformanceSectionDescription'],
            'vanilla-builder-settings'
        );
        
        // Register individual settings
        $this->registerIndividualSettings();
    }
    
    /**
     * Register individual settings
     */
    private function registerIndividualSettings(): void {
        $settings = [
            // General settings
            [
                'id' => 'vanilla_builder_enabled',
                'title' => __('Enable Vanilla Builder', 'vanilla-builder'),
                'callback' => [$this, 'renderCheckboxField'],
                'section' => 'vanilla_builder_general',
                'args' => [
                    'option_name' => 'vanilla_builder_enabled',
                    'description' => __('Enable or disable the Vanilla Builder plugin.', 'vanilla-builder'),
                ],
            ],
            [
                'id' => 'vanilla_builder_load_css',
                'title' => __('Load Frontend CSS', 'vanilla-builder'),
                'callback' => [$this, 'renderCheckboxField'],
                'section' => 'vanilla_builder_general',
                'args' => [
                    'option_name' => 'vanilla_builder_load_css',
                    'description' => __('Load Vanilla Builder CSS on the frontend.', 'vanilla-builder'),
                ],
            ],
            
            // Editor settings
            [
                'id' => 'vanilla_builder_editor_theme',
                'title' => __('Editor Theme', 'vanilla-builder'),
                'callback' => [$this, 'renderSelectField'],
                'section' => 'vanilla_builder_editor',
                'args' => [
                    'option_name' => 'vanilla_builder_editor_theme',
                    'options' => [
                        'light' => __('Light', 'vanilla-builder'),
                        'dark' => __('Dark', 'vanilla-builder'),
                    ],
                    'description' => __('Choose the editor theme.', 'vanilla-builder'),
                ],
            ],
            [
                'id' => 'vanilla_builder_auto_save',
                'title' => __('Auto Save', 'vanilla-builder'),
                'callback' => [$this, 'renderCheckboxField'],
                'section' => 'vanilla_builder_editor',
                'args' => [
                    'option_name' => 'vanilla_builder_auto_save',
                    'description' => __('Automatically save changes while editing.', 'vanilla-builder'),
                ],
            ],
            [
                'id' => 'vanilla_builder_auto_save_interval',
                'title' => __('Auto Save Interval', 'vanilla-builder'),
                'callback' => [$this, 'renderNumberField'],
                'section' => 'vanilla_builder_editor',
                'args' => [
                    'option_name' => 'vanilla_builder_auto_save_interval',
                    'min' => 10,
                    'max' => 300,
                    'step' => 5,
                    'description' => __('Auto save interval in seconds.', 'vanilla-builder'),
                ],
            ],
            
            // Performance settings
            [
                'id' => 'vanilla_builder_max_revisions',
                'title' => __('Max Revisions', 'vanilla-builder'),
                'callback' => [$this, 'renderNumberField'],
                'section' => 'vanilla_builder_performance',
                'args' => [
                    'option_name' => 'vanilla_builder_max_revisions',
                    'min' => 1,
                    'max' => 50,
                    'step' => 1,
                    'description' => __('Maximum number of revisions to keep per layout.', 'vanilla-builder'),
                ],
            ],
        ];
        
        foreach ($settings as $setting) {
            register_setting('vanilla-builder-settings', $setting['args']['option_name']);
            
            add_settings_field(
                $setting['id'],
                $setting['title'],
                $setting['callback'],
                'vanilla-builder-settings',
                $setting['section'],
                $setting['args']
            );
        }
    }
    
    /**
     * Render general section description
     */
    public function renderGeneralSectionDescription(): void {
        echo '<p>' . esc_html__('Configure general Vanilla Builder settings.', 'vanilla-builder') . '</p>';
    }
    
    /**
     * Render editor section description
     */
    public function renderEditorSectionDescription(): void {
        echo '<p>' . esc_html__('Configure editor behavior and appearance.', 'vanilla-builder') . '</p>';
    }
    
    /**
     * Render performance section description
     */
    public function renderPerformanceSectionDescription(): void {
        echo '<p>' . esc_html__('Configure performance-related settings.', 'vanilla-builder') . '</p>';
    }
    
    /**
     * Render checkbox field
     */
    public function renderCheckboxField(array $args): void {
        $option_name = $args['option_name'];
        $value = get_option($option_name, true);
        $description = $args['description'] ?? '';
        
        echo '<label>';
        echo '<input type="checkbox" name="' . esc_attr($option_name) . '" value="1" ' . checked(1, $value, false) . ' />';
        echo ' ' . esc_html($description);
        echo '</label>';
    }
    
    /**
     * Render select field
     */
    public function renderSelectField(array $args): void {
        $option_name = $args['option_name'];
        $value = get_option($option_name, '');
        $options = $args['options'] ?? [];
        $description = $args['description'] ?? '';
        
        echo '<select name="' . esc_attr($option_name) . '">';
        foreach ($options as $option_value => $option_label) {
            echo '<option value="' . esc_attr($option_value) . '" ' . selected($option_value, $value, false) . '>';
            echo esc_html($option_label);
            echo '</option>';
        }
        echo '</select>';
        
        if ($description) {
            echo '<p class="description">' . esc_html($description) . '</p>';
        }
    }
    
    /**
     * Render number field
     */
    public function renderNumberField(array $args): void {
        $option_name = $args['option_name'];
        $value = get_option($option_name, 0);
        $min = $args['min'] ?? 0;
        $max = $args['max'] ?? 100;
        $step = $args['step'] ?? 1;
        $description = $args['description'] ?? '';
        
        echo '<input type="number" name="' . esc_attr($option_name) . '" value="' . esc_attr($value) . '"';
        echo ' min="' . esc_attr($min) . '" max="' . esc_attr($max) . '" step="' . esc_attr($step) . '" />';
        
        if ($description) {
            echo '<p class="description">' . esc_html($description) . '</p>';
        }
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueueAssets($hook): void {
        // Only load on our admin pages
        if (strpos($hook, 'vanilla-builder') === false) {
            return;
        }
        
        wp_enqueue_style('wp-color-picker');
        wp_enqueue_script('wp-color-picker');
        
        // Enqueue custom admin styles
        wp_enqueue_style(
            'vanilla-builder-admin-pages',
            VANILLA_BUILDER_PLUGIN_URL . 'assets/css/admin-pages.css',
            ['wp-color-picker'],
            VANILLA_BUILDER_VERSION
        );
    }
    
    /**
     * Show admin notices
     */
    public function showAdminNotices(): void {
        // Check if plugin is properly configured
        if (!get_option('vanilla_builder_enabled', true)) {
            return;
        }
        
        // Show welcome notice for new installations
        if (get_option('vanilla_builder_activated', false)) {
            $this->showWelcomeNotice();
            delete_option('vanilla_builder_activated');
        }
        
        // Show update notices
        $this->showUpdateNotices();
    }
    
    /**
     * Show welcome notice
     */
    private function showWelcomeNotice(): void {
        echo '<div class="notice notice-success is-dismissible">';
        echo '<p>';
        echo sprintf(
            esc_html__('Welcome to Vanilla Builder! %sGet started by creating your first layout%s.', 'vanilla-builder'),
            '<a href="' . esc_url(admin_url('admin.php?page=vanilla-builder-editor')) . '">',
            '</a>'
        );
        echo '</p>';
        echo '</div>';
    }
    
    /**
     * Show update notices
     */
    private function showUpdateNotices(): void {
        $current_version = get_option('vanilla_builder_version', '0.0.0');
        
        if (version_compare($current_version, VANILLA_BUILDER_VERSION, '<')) {
            echo '<div class="notice notice-info is-dismissible">';
            echo '<p>';
            echo sprintf(
                esc_html__('Vanilla Builder has been updated to version %s. %sView changelog%s.', 'vanilla-builder'),
                VANILLA_BUILDER_VERSION,
                '<a href="#" target="_blank">',
                '</a>'
            );
            echo '</p>';
            echo '</div>';
            
            // Update version option
            update_option('vanilla_builder_version', VANILLA_BUILDER_VERSION);
        }
    }
    
    /**
     * Get admin page capability requirement
     */
    public function getRequiredCapability(string $page = ''): string {
        $capabilities = [
            'vanilla-builder' => 'manage_options',
            'vanilla-builder-editor' => 'edit_posts',
            'vanilla-builder-settings' => 'manage_options',
        ];
        
        return $capabilities[$page] ?? 'manage_options';
    }
    
    /**
     * Check if current user can access admin page
     */
    public function canAccessPage(string $page = ''): bool {
        return current_user_can($this->getRequiredCapability($page));
    }
}