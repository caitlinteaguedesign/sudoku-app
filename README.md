# Sudoku Helper App
An app to help people solve sudoku puzzles from print media by reducing user cognitive load. I hope to achieve this by:
1. Show player missing numbers from a region
2. Highlight player mistakes

### Missing Numbers
It can be hard to read a sudoku puzzle. A player sees the numbers present but then must work backwards to recall what's NOT on the grid already. If a row reads 4,8,2,7,6,9, the player often has to count off 1 through 9 to determine what's missing [1,3,5]. When doing puzzles by hand, writing down this information in the margins can quickly become messy. This app will keep track of what numbers have been played already in any given region, and the user may view this information as needed.

### Highlight Mistakes
Not to be confused with telling the player if they entered an incorrect answer in a sudoku square. Sometimes in the course of play you can make an error against your own plays, like even after checking for conflicts realizing in later rounds you accidentally placed the same number twice in a region.