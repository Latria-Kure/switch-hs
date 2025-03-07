# Switch Header/Source

A VS Code extension that allows you to quickly switch between related file pairs, similar to the "Switch Header/Source" functionality in other IDEs but with customizable file path patterns.

## Features

- Switch between related file pairs with a keyboard shortcut (Alt+O by default)
- Define custom file pairs using configurable patterns
- Supports variables like `{workspaceFolder}`, `{fileBasename}`, `{fileBasenameNoExtension}`, and `{fileExtension}`
- Option to create missing files when switching

## Configuration

You can configure file pairs in your VS Code settings:

```json
"switch-hs.filePairs": [
  {
    "name": "C/C++ Header/Source",
    "patterns": [
      "{workspaceFolder}/src/{fileBasenameNoExtension}.c",
      "{workspaceFolder}/include/{fileBasenameNoExtension}.h"
    ]
  },
  {
    "name": "Cython Source/Header",
    "patterns": [
      "{workspaceFolder}/src/{fileBasenameNoExtension}.pyx",
      "{workspaceFolder}/inc/{fileBasenameNoExtension}.pxd"
    ]
  }
]
```

Each file pair consists of:
- `name`: A descriptive name for the file pair
- `patterns`: An array of file path patterns that form a cycle

## Pattern Variables

The following variables are available for use in file path patterns:

- `{workspaceFolder}`: The path of the workspace folder
- `{fileBasename}`: The current file's name with extension (e.g., "file.c")
- `{fileBasenameNoExtension}`: The current file's name without extension (e.g., "file")
- `{fileExtension}`: The current file's extension without the dot (e.g., "c")

## Usage

1. Open a file that matches one of your configured patterns
2. Press Alt+O (or your custom keybinding)
3. The extension will switch to the corresponding file in the pair
4. If the target file doesn't exist, you'll be prompted to create it

## License

MIT 