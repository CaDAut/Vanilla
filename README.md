# Vanilla Builder

A powerful drag-and-drop page builder for WordPress with React integration.

## Features

- **Drag & Drop Interface**: Intuitive visual editor with real-time preview
- **React Components**: Modern React-based frontend with hooks and context
- **Element Library**: Pre-built elements including text, images, buttons, and containers
- **Responsive Design**: Mobile-first approach with responsive editing
- **Real-time Editing**: See changes instantly as you build
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Auto-save**: Automatic saving with configurable intervals
- **Theme Support**: Light and dark theme options
- **REST API**: Complete API for layouts and elements management
- **WordPress Integration**: Native WordPress admin integration

## Requirements

- **WordPress**: 6.0 or higher
- **PHP**: 8.0 or higher
- **Node.js**: 16.0 or higher (for development)
- **NPM**: 8.0 or higher (for development)

## Installation

1. Clone or download the plugin to your WordPress plugins directory:
   ```bash
   cd wp-content/plugins/
   git clone https://github.com/CaDAut/Vanilla.git vanilla-builder
   ```

2. Install PHP dependencies:
   ```bash
   cd vanilla-builder
   composer install
   ```

3. Install Node.js dependencies:
   ```bash
   npm install
   ```

4. Build the frontend assets:
   ```bash
   npm run build
   ```

5. Activate the plugin in your WordPress admin panel.

## Development

### Prerequisites

Make sure you have the following installed:
- Node.js 16+
- NPM 8+
- PHP 8.0+
- Composer

### Setup

1. Install dependencies:
   ```bash
   composer install
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. For watch mode during development:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run build` - Build production assets
- `npm run dev` - Build development assets with watch mode
- `npm run start` - Start webpack dev server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run test` - Run tests
- `npm run clean` - Clean build directory

### Project Structure

```
vanilla-builder/
├── includes/                 # PHP backend
│   ├── Core/                # Core plugin classes
│   ├── Admin/               # WordPress admin integration
│   ├── API/                 # REST API endpoints
│   ├── Database/            # Database models and migrations
│   └── Services/            # Business logic services
├── src/                     # React frontend
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React contexts
│   ├── utils/               # Utility functions
│   └── styles/              # CSS styles
├── assets/                  # Static assets
├── dist/                    # Built assets (generated)
├── tests/                   # Test files
└── languages/               # Translation files
```

## Usage

### Basic Usage

1. Go to **Vanilla Builder** in your WordPress admin menu
2. Click **Editor** to create a new layout
3. Drag elements from the sidebar to the canvas
4. Configure element properties in the properties panel
5. Save your layout

### Creating Layouts

1. **Add Elements**: Drag components from the sidebar to the canvas
2. **Edit Properties**: Select an element and modify its properties in the right panel
3. **Move Elements**: Drag elements around the canvas to reposition them
4. **Delete Elements**: Select an element and press Delete or use the element controls
5. **Undo/Redo**: Use Ctrl+Z/Ctrl+Y or the toolbar buttons

### Available Elements

- **Text**: Paragraphs, headings, and formatted text
- **Image**: Responsive images with alt text and lazy loading
- **Button**: Call-to-action buttons with customizable styles
- **Container**: Layout containers for organizing content

### Keyboard Shortcuts

- `Ctrl+Z` / `Cmd+Z` - Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z` - Redo
- `Ctrl+S` / `Cmd+S` - Save
- `Ctrl+D` / `Cmd+D` - Duplicate selected element
- `Delete` - Delete selected element
- `Escape` - Deselect element

## API Reference

### REST API Endpoints

The plugin provides a REST API for managing layouts and elements:

#### Layouts
- `GET /wp-json/vanilla-builder/v1/layouts` - Get all layouts
- `POST /wp-json/vanilla-builder/v1/layouts` - Create a new layout
- `GET /wp-json/vanilla-builder/v1/layouts/{id}` - Get a specific layout
- `PUT /wp-json/vanilla-builder/v1/layouts/{id}` - Update a layout
- `DELETE /wp-json/vanilla-builder/v1/layouts/{id}` - Delete a layout

#### Elements
- `GET /wp-json/vanilla-builder/v1/elements` - Get elements
- `POST /wp-json/vanilla-builder/v1/elements` - Create an element
- `PUT /wp-json/vanilla-builder/v1/elements/{id}` - Update an element
- `DELETE /wp-json/vanilla-builder/v1/elements/{id}` - Delete an element

#### Settings
- `GET /wp-json/vanilla-builder/v1/settings` - Get plugin settings
- `PUT /wp-json/vanilla-builder/v1/settings` - Update plugin settings

## Configuration

### Plugin Settings

Access plugin settings via **Vanilla Builder** > **Settings** in the WordPress admin:

- **Editor Theme**: Light or dark theme
- **Auto Save**: Enable/disable automatic saving
- **Auto Save Interval**: Time between auto-saves (seconds)
- **Max Revisions**: Maximum number of revisions to keep
- **Load Frontend CSS**: Include plugin styles on frontend
- **Load Frontend JS**: Include plugin scripts on frontend

### Developer Configuration

You can modify the default settings in `includes/Core/Activator.php`:

```php
$default_options = [
    'vanilla_builder_enabled' => true,
    'vanilla_builder_editor_theme' => 'light',
    'vanilla_builder_auto_save' => true,
    'vanilla_builder_auto_save_interval' => 30,
    // ... other options
];
```

## Testing

### Running Tests

```bash
# PHP tests
composer test

# JavaScript tests
npm test
```

### Writing Tests

- PHP tests go in the `tests/` directory
- JavaScript tests use Jest and React Testing Library
- Follow the existing test patterns and naming conventions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run the test suite: `npm test && composer test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

### Coding Standards

- **PHP**: Follow WordPress coding standards
- **JavaScript**: Use ESLint configuration provided
- **CSS**: Use BEM methodology where applicable
- **Git**: Use conventional commit messages

## License

This project is licensed under the GPL v3 or later. See the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [GitHub Wiki](https://github.com/CaDAut/Vanilla/wiki)
- **Issues**: [GitHub Issues](https://github.com/CaDAut/Vanilla/issues)
- **Discussions**: [GitHub Discussions](https://github.com/CaDAut/Vanilla/discussions)

## Changelog

### Version 1.0.0
- Initial release
- Basic drag-and-drop functionality
- Element library (text, image, button, container)
- WordPress admin integration
- REST API endpoints
- Auto-save functionality
- Undo/redo system
- Theme support (light/dark)
- Responsive design

## Roadmap

- [ ] Advanced styling options
- [ ] More element types
- [ ] Template library
- [ ] Import/export functionality
- [ ] Advanced responsive controls
- [ ] Animation support
- [ ] Third-party integrations
- [ ] Performance optimizations