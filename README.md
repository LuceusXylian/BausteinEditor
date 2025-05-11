# Baustein Editor

Baustein Editor is a powerful block-based editor designed for creating, editing, and managing content in a modular way. It provides a user-friendly interface for importing, editing, moving, deleting, adding, and exporting blocks of content. This library is ideal for building customizable and dynamic content editors for web applications.

## Features

- **Block Management**: Effortlessly add, delete, move, and edit blocks.
- **Localization Support**: Built-in support for multiple languages, including English and German.
- **Drag-and-Drop Functionality**: Intuitive drag-and-drop for rearranging blocks.
- **Customizable Toolbar**: Includes a rich toolbar for text formatting and other actions.
- **Responsive Design**: Optimized for seamless performance across various screen sizes.

## Getting Started

### Library Installation

```bash
npm install baustein-editor
```

Do not forget to import the scss styles from `scss/index.scss`

### Basic Usage

Here is a simple example of how to initialize and use the Baustein Editor:

```typescript
const editor = new BausteinEditor({
    container: document.getElementById('editor-container'),
    locale: 'en',
});
```

## Localization

Baustein Editor supports multiple languages. You can specify the desired locale before initializing the editor. Currently, "en" (English) and "de" (German) are supported. To add custom locales, extend the `LOCALES` object and submit a merge request for general usage.

## Development

### Prerequisites

Ensure you have the following installed:

- [Deno](https://deno.land/) (latest version)

### Building the Project

Run the build script to compile the project:

```bash
./build.sh
```

### Running the Demo

To see the editor in action, open the `index.html` file in your browser. Alternatively, visit the [GitHub Pages Demo](https://luceusxylian.github.io/BausteinEditor/).

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
