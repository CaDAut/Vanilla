<?php
/**
 * REST API Controller
 *
 * @package VanillaBuilder
 */

namespace VanillaBuilder\API;

use WP_REST_Controller;
use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * REST API Controller Class
 * 
 * Main controller for Vanilla Builder REST API endpoints
 */
class RestController extends WP_REST_Controller {
    
    /**
     * API namespace
     *
     * @var string
     */
    protected $namespace = 'vanilla-builder/v1';
    
    /**
     * Rest base
     *
     * @var string
     */
    protected $rest_base = 'layouts';
    
    /**
     * Constructor
     */
    public function __construct() {
        // Initialize after WordPress is fully loaded
        add_action('rest_api_init', [$this, 'registerRoutes']);
    }
    
    /**
     * Register REST API routes
     */
    public function registerRoutes(): void {
        // Layouts endpoints
        register_rest_route($this->namespace, '/' . $this->rest_base, [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getLayouts'],
                'permission_callback' => [$this, 'getLayoutsPermissionsCheck'],
                'args' => $this->getCollectionParams(),
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'createLayout'],
                'permission_callback' => [$this, 'createLayoutPermissionsCheck'],
                'args' => $this->getLayoutCreateArgs(),
            ],
        ]);
        
        register_rest_route($this->namespace, '/' . $this->rest_base . '/(?P<id>[\d]+)', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getLayout'],
                'permission_callback' => [$this, 'getLayoutPermissionsCheck'],
                'args' => [
                    'id' => [
                        'description' => __('Unique identifier for the layout.', 'vanilla-builder'),
                        'type' => 'integer',
                        'required' => true,
                    ],
                ],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'updateLayout'],
                'permission_callback' => [$this, 'updateLayoutPermissionsCheck'],
                'args' => $this->getLayoutUpdateArgs(),
            ],
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'deleteLayout'],
                'permission_callback' => [$this, 'deleteLayoutPermissionsCheck'],
                'args' => [
                    'force' => [
                        'description' => __('Force delete the layout.', 'vanilla-builder'),
                        'type' => 'boolean',
                        'default' => false,
                    ],
                ],
            ],
        ]);
        
        // Elements endpoints
        register_rest_route($this->namespace, '/elements', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getElements'],
                'permission_callback' => [$this, 'getElementsPermissionsCheck'],
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => [$this, 'createElement'],
                'permission_callback' => [$this, 'createElementPermissionsCheck'],
                'args' => $this->getElementCreateArgs(),
            ],
        ]);
        
        register_rest_route($this->namespace, '/elements/(?P<id>[\d]+)', [
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'updateElement'],
                'permission_callback' => [$this, 'updateElementPermissionsCheck'],
                'args' => $this->getElementUpdateArgs(),
            ],
            [
                'methods' => WP_REST_Server::DELETABLE,
                'callback' => [$this, 'deleteElement'],
                'permission_callback' => [$this, 'deleteElementPermissionsCheck'],
            ],
        ]);
        
        // Settings endpoint
        register_rest_route($this->namespace, '/settings', [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'getSettings'],
                'permission_callback' => [$this, 'getSettingsPermissionsCheck'],
            ],
            [
                'methods' => WP_REST_Server::EDITABLE,
                'callback' => [$this, 'updateSettings'],
                'permission_callback' => [$this, 'updateSettingsPermissionsCheck'],
                'args' => $this->getSettingsArgs(),
            ],
        ]);
    }
    
    /**
     * Get layouts
     */
    public function getLayouts(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        
        $page = $request->get_param('page') ?: 1;
        $per_page = $request->get_param('per_page') ?: 10;
        $offset = ($page - 1) * $per_page;
        
        $table_name = $wpdb->prefix . 'vb_layouts';
        
        $layouts = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_name ORDER BY created_at DESC LIMIT %d OFFSET %d",
            $per_page,
            $offset
        ));
        
        $total = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
        
        $response = new WP_REST_Response($layouts);
        $response->header('X-WP-Total', $total);
        $response->header('X-WP-TotalPages', ceil($total / $per_page));
        
        return $response;
    }
    
    /**
     * Get single layout
     */
    public function getLayout(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        
        $id = $request->get_param('id');
        $table_name = $wpdb->prefix . 'vb_layouts';
        
        $layout = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));
        
        if (!$layout) {
            return new WP_Error('layout_not_found', __('Layout not found.', 'vanilla-builder'), ['status' => 404]);
        }
        
        // Get associated elements
        $elements_table = $wpdb->prefix . 'vb_elements';
        $elements = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $elements_table WHERE layout_id = %d ORDER BY sort_order ASC",
            $id
        ));
        
        $layout->elements = $elements;
        
        return new WP_REST_Response($layout);
    }
    
    /**
     * Create layout
     */
    public function createLayout(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        
        $name = sanitize_text_field($request->get_param('name'));
        $data = $request->get_param('data') ?: '{}';
        $settings = $request->get_param('settings') ?: '{}';
        $status = sanitize_text_field($request->get_param('status')) ?: 'draft';
        
        $table_name = $wpdb->prefix . 'vb_layouts';
        
        $result = $wpdb->insert(
            $table_name,
            [
                'name' => $name,
                'data' => $data,
                'settings' => $settings,
                'status' => $status,
                'author_id' => get_current_user_id(),
            ],
            ['%s', '%s', '%s', '%s', '%d']
        );
        
        if ($result === false) {
            return new WP_Error('create_failed', __('Failed to create layout.', 'vanilla-builder'), ['status' => 500]);
        }
        
        $layout_id = $wpdb->insert_id;
        
        // Get the created layout
        $layout = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $layout_id
        ));
        
        $response = new WP_REST_Response($layout, 201);
        $response->header('Location', rest_url(sprintf('%s/%s/%d', $this->namespace, $this->rest_base, $layout_id)));
        
        return $response;
    }
    
    /**
     * Update layout
     */
    public function updateLayout(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        
        $id = $request->get_param('id');
        $table_name = $wpdb->prefix . 'vb_layouts';
        
        // Check if layout exists
        $layout = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));
        
        if (!$layout) {
            return new WP_Error('layout_not_found', __('Layout not found.', 'vanilla-builder'), ['status' => 404]);
        }
        
        $update_data = [];
        $formats = [];
        
        if ($request->has_param('name')) {
            $update_data['name'] = sanitize_text_field($request->get_param('name'));
            $formats[] = '%s';
        }
        
        if ($request->has_param('data')) {
            $update_data['data'] = $request->get_param('data');
            $formats[] = '%s';
        }
        
        if ($request->has_param('settings')) {
            $update_data['settings'] = $request->get_param('settings');
            $formats[] = '%s';
        }
        
        if ($request->has_param('status')) {
            $update_data['status'] = sanitize_text_field($request->get_param('status'));
            $formats[] = '%s';
        }
        
        if (empty($update_data)) {
            return new WP_Error('no_data', __('No data to update.', 'vanilla-builder'), ['status' => 400]);
        }
        
        $result = $wpdb->update(
            $table_name,
            $update_data,
            ['id' => $id],
            $formats,
            ['%d']
        );
        
        if ($result === false) {
            return new WP_Error('update_failed', __('Failed to update layout.', 'vanilla-builder'), ['status' => 500]);
        }
        
        // Get updated layout
        $updated_layout = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));
        
        return new WP_REST_Response($updated_layout);
    }
    
    /**
     * Delete layout
     */
    public function deleteLayout(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        
        $id = $request->get_param('id');
        $force = $request->get_param('force');
        
        $table_name = $wpdb->prefix . 'vb_layouts';
        $elements_table = $wpdb->prefix . 'vb_elements';
        
        // Check if layout exists
        $layout = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $id
        ));
        
        if (!$layout) {
            return new WP_Error('layout_not_found', __('Layout not found.', 'vanilla-builder'), ['status' => 404]);
        }
        
        // Delete associated elements
        $wpdb->delete($elements_table, ['layout_id' => $id], ['%d']);
        
        // Delete layout
        $result = $wpdb->delete($table_name, ['id' => $id], ['%d']);
        
        if ($result === false) {
            return new WP_Error('delete_failed', __('Failed to delete layout.', 'vanilla-builder'), ['status' => 500]);
        }
        
        return new WP_REST_Response(['deleted' => true, 'previous' => $layout]);
    }
    
    /**
     * Get elements
     */
    public function getElements(WP_REST_Request $request): WP_REST_Response {
        global $wpdb;
        
        $layout_id = $request->get_param('layout_id');
        $elements_table = $wpdb->prefix . 'vb_elements';
        
        $where_clause = $layout_id ? $wpdb->prepare('WHERE layout_id = %d', $layout_id) : '';
        
        $elements = $wpdb->get_results(
            "SELECT * FROM $elements_table $where_clause ORDER BY sort_order ASC"
        );
        
        return new WP_REST_Response($elements);
    }
    
    /**
     * Permission checks
     */
    public function getLayoutsPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function getLayoutPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function createLayoutPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function updateLayoutPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function deleteLayoutPermissionsCheck(): bool {
        return current_user_can('delete_posts');
    }
    
    public function getElementsPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function createElementPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function updateElementPermissionsCheck(): bool {
        return current_user_can('edit_posts');
    }
    
    public function deleteElementPermissionsCheck(): bool {
        return current_user_can('delete_posts');
    }
    
    public function getSettingsPermissionsCheck(): bool {
        return current_user_can('manage_options');
    }
    
    public function updateSettingsPermissionsCheck(): bool {
        return current_user_can('manage_options');
    }
    
    /**
     * Get collection parameters
     */
    public function getCollectionParams(): array {
        return [
            'page' => [
                'description' => __('Current page of the collection.', 'vanilla-builder'),
                'type' => 'integer',
                'default' => 1,
                'sanitize_callback' => 'absint',
            ],
            'per_page' => [
                'description' => __('Maximum number of items to be returned in result set.', 'vanilla-builder'),
                'type' => 'integer',
                'default' => 10,
                'minimum' => 1,
                'maximum' => 100,
                'sanitize_callback' => 'absint',
            ],
        ];
    }
    
    /**
     * Get layout create arguments
     */
    private function getLayoutCreateArgs(): array {
        return [
            'name' => [
                'description' => __('Layout name.', 'vanilla-builder'),
                'type' => 'string',
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'data' => [
                'description' => __('Layout data (JSON).', 'vanilla-builder'),
                'type' => 'string',
                'default' => '{}',
            ],
            'settings' => [
                'description' => __('Layout settings (JSON).', 'vanilla-builder'),
                'type' => 'string',
                'default' => '{}',
            ],
            'status' => [
                'description' => __('Layout status.', 'vanilla-builder'),
                'type' => 'string',
                'enum' => ['draft', 'published', 'private'],
                'default' => 'draft',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ];
    }
    
    /**
     * Get layout update arguments
     */
    private function getLayoutUpdateArgs(): array {
        $args = $this->getLayoutCreateArgs();
        
        // Make all fields optional for updates
        foreach ($args as &$arg) {
            unset($arg['required']);
        }
        
        return $args;
    }
    
    /**
     * Get element create arguments
     */
    private function getElementCreateArgs(): array {
        return [
            'layout_id' => [
                'description' => __('Layout ID.', 'vanilla-builder'),
                'type' => 'integer',
                'required' => true,
                'sanitize_callback' => 'absint',
            ],
            'element_type' => [
                'description' => __('Element type.', 'vanilla-builder'),
                'type' => 'string',
                'required' => true,
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'element_data' => [
                'description' => __('Element data (JSON).', 'vanilla-builder'),
                'type' => 'string',
                'required' => true,
            ],
            'parent_id' => [
                'description' => __('Parent element ID.', 'vanilla-builder'),
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
            'sort_order' => [
                'description' => __('Sort order.', 'vanilla-builder'),
                'type' => 'integer',
                'default' => 0,
                'sanitize_callback' => 'absint',
            ],
        ];
    }
    
    /**
     * Get element update arguments
     */
    private function getElementUpdateArgs(): array {
        $args = $this->getElementCreateArgs();
        
        // Make all fields optional for updates
        foreach ($args as &$arg) {
            unset($arg['required']);
        }
        
        return $args;
    }
    
    /**
     * Get settings arguments
     */
    private function getSettingsArgs(): array {
        return [
            'settings' => [
                'description' => __('Plugin settings (JSON).', 'vanilla-builder'),
                'type' => 'object',
                'required' => true,
            ],
        ];
    }
    
    /**
     * Get settings
     */
    public function getSettings(WP_REST_Request $request): WP_REST_Response {
        $settings = [
            'enabled' => get_option('vanilla_builder_enabled', true),
            'load_css' => get_option('vanilla_builder_load_css', true),
            'load_js' => get_option('vanilla_builder_load_js', true),
            'editor_theme' => get_option('vanilla_builder_editor_theme', 'light'),
            'auto_save' => get_option('vanilla_builder_auto_save', true),
            'auto_save_interval' => get_option('vanilla_builder_auto_save_interval', 30),
            'max_revisions' => get_option('vanilla_builder_max_revisions', 10),
        ];
        
        return new WP_REST_Response($settings);
    }
    
    /**
     * Update settings
     */
    public function updateSettings(WP_REST_Request $request): WP_REST_Response {
        $settings = $request->get_param('settings');
        
        $allowed_settings = [
            'vanilla_builder_enabled',
            'vanilla_builder_load_css',
            'vanilla_builder_load_js',
            'vanilla_builder_editor_theme',
            'vanilla_builder_auto_save',
            'vanilla_builder_auto_save_interval',
            'vanilla_builder_max_revisions',
        ];
        
        foreach ($settings as $key => $value) {
            $option_name = 'vanilla_builder_' . $key;
            
            if (in_array($option_name, $allowed_settings)) {
                update_option($option_name, $value);
            }
        }
        
        return new WP_REST_Response(['updated' => true]);
    }
}