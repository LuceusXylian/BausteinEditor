# Baustein Editor

Baustein Editor is a block-based editor designed for creating, editing, and managing content in a modular way. It provides a user-friendly interface for importing, editing, moving, deleting, adding, and exporting blocks of content. This library is ideal for building customizable and dynamic content editors for web applications.

## Features

- **Block Management**: Add, delete, move, and edit blocks with ease.
- **Localization**: Supports multiple languages (e.g., English and German).
- **Drag-and-Drop**: Intuitive drag-and-drop functionality for rearranging blocks.
- **Customizable Toolbar**: Includes a toolbar for text formatting and other actions.
- **Responsive Design**: Works seamlessly across different screen sizes.

## Usage

### Importing the Library

Import the required modules from the [JavaScript Registry (JSR)](https://jsr.io):

```typescript
import { BausteinEditor } from '@xylian/bausteineditor';
```

### Example

Here is a basic example of how to initialize and use the Baustein Editor:

```typescript
const editor = new BausteinEditor({
    container: document.getElementById('editor-container'),
    locale: 'en',
});
```

## Localization

Baustein Editor supports multiple languages. You can switch between locales using the `select_locale` method:

```typescript
LOCALES.select_locale('de'); // Switch to German
```

## Development

### Prerequisites

- [Deno](https://deno.land/) (latest version)

### Building the Project

Run the build script to compile the project:

```bash
./build.sh
```

### Running the Demo

Open the `index.html` file in your browser to see the editor in action.  
Or open in Github Page: https://luceusxylian.github.io/BausteinEditor/

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
