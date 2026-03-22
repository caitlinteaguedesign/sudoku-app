# Sudoku Checker App

An app to help people solve sudoku puzzles from print media by reducing user cognitive load. Goal achieved by:

1. Showing player missing numbers from a region
2. Highlighting player mistakes

## Detailed Explanations

### Missing Numbers

It can be hard to read a sudoku puzzle. A player sees the numbers present but then must work backwards to recall what's NOT on the grid already. If a row reads 4,8,2,7,6,9, the player often has to count off 1 through 9 to determine what's missing [1,3,5]. When doing puzzles by hand, writing down this information in the margins can quickly become messy. This app keeps track of what numbers have been played already in any given region, and the user may toggle this information visible and hidden as needed.

### Highlight Mistakes

Not to be confused with telling the player if they entered an incorrect _answer_ in a sudoku square. This app does not store the solution to any of the puzzles. Instead, if you have a region selected, the color of the region will change to yellow as soon as it it detects a duplicate number. This helps user identify unintentional mistakes.

## Development

In this directory, you can run:

### `npm run superinstall`

Installs project locally for both root and client directory. Uses `npm ci` and requires a `package-lock.json` to run.

### `npm run dev`

Runs both server and client in development mode.

### `npm run superclean`

Deletes `node_modules` and `build` folders and their contents (Windows CLI) in both the project root and client. Helpful for running a fresh install of dependencies, `npm i` or `npm ci` if a `package-lock.json` is present.
