# Baustein Editor SCSS Library

A modular SCSS library for building modern, customizable editors with consistent styling and theming support.

## Installation

```bash
npm install baustein-editor
```

## Usage

### Basic Import
```scss
// Import everything
@use 'baustein-editor/scss' as baustein;

// Or import specific modules
@use 'baustein-editor/scss/variables' as *;
@use 'baustein-editor/scss/mixins' as *;
```

### Customizing Variables
Create a new file with your custom variables:

```scss
// _custom-variables.scss
@use 'baustein-editor/scss/variables' with (
  $primary-color: #ff0000,
  $font-family: 'Arial, sans-serif',
  $spacing-unit: 1.2rem
);
```

## Available Modules

### Variables (`_variables.scss`)
- Colors
- Typography
- Spacing
- Editor-specific variables
- Z-index layers

### Mixins (`_mixins.scss`)
- Button styles
- Input styles
- Editor container
- Responsive containers
- Focus states
- Utility mixins

### Components
- Editor core (`baustein_editor.scss`)
- Rich text editor (`tinyeditor.scss`)
- Website styles (`website_styles.scss`)

## Theme Support

### Light Theme (Default)
```scss
.baustein-editor {
  // Default light theme styles
}
```

### Dark Theme
```scss
.baustein-editor--dark {
  // Dark theme styles applied
}
```

## Responsive Design

The library includes responsive breakpoints and mobile-first design:

- Desktop: 1024px and above
- Tablet: 768px to 1023px
- Mobile: Below 768px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11 (basic support)

## Development

```bash
# Install dependencies
npm install

# Build CSS
npm run build

# Build minified CSS
npm run build:min

# Watch for changes
npm run watch
```

## License

MIT License - see LICENSE file for details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

## Support

For support, issues, or feature requests, please use the issue tracker in GitHub.