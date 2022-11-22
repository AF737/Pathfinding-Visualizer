'use strict';

const WallOrientation = {
    vertical: 'vertical',
    horizontal: 'horizontal'
};

export default function recursiveDivision(grid)
{
    const animations = [];
    const possibleWallRows = [];
    const possibleWallCols = [];

    for (let row = 2; row < grid.rows - 2; row += 2)
        possibleWallRows.push(row);

    for (let col = 2; col < grid.columns - 2; col += 2)
        possibleWallCols.push(col);

    divide(grid, possibleWallRows, possibleWallCols, animations);

    return animations;
}

function divide(grid, possibleWallRows, possibleWallCols, animations)
{
    /* The current chamber consists of either one row or one column so it can't
        be divided any further. Backtrack until a room that can be divided is found */
    if (possibleWallRows.length === 0 || possibleWallCols.length === 0)
        return;

    const orientation = getWallOrientation(possibleWallRows, possibleWallCols);

    /* Create a horizontal wall with a passage in it */
    if (orientation === WallOrientation.horizontal)
    {
        const randomRow = possibleWallRows[Math.floor(Math.random() * possibleWallRows.length)];
        const startCol = possibleWallCols[0] - 1;
        const endCol = possibleWallCols[possibleWallCols.length - 1] + 1;
        /* Select a random column that won't be turned into a wall */
        let passageCol = Math.floor(Math.random() * (endCol - startCol + 1)) + startCol;

        /* Only create passages in odd numbered columns so it can't get filled up by a wall which
            can only be placed in even numbered columns */
        while (passageCol % 2 === 0)
        {
            passageCol = Math.floor((Math.random() * (endCol - startCol + 1)) + 1) + startCol;
        }

        for (let col = startCol; col <= endCol; col++)
        {
            /* Leave a passage through the wall */
            if (col === passageCol)
                continue;

            const id = `node-${randomRow}-${col}`;

            grid.changeWallStatusOfNodeTo(id, true);

            animations.push(grid.nodesMatrix[randomRow][col]);
        }

        const wallIndex = possibleWallRows.indexOf(randomRow);

        const rowsAboveWall = possibleWallRows.slice(0, wallIndex);
        const rowsBelowWall = possibleWallRows.slice(wallIndex + 1);

        divide(grid, rowsAboveWall, possibleWallCols, animations);
        divide(grid, rowsBelowWall, possibleWallCols, animations);
    }

    /* Vertical wall */
    else
    {
        const randomCol = possibleWallCols[Math.floor(Math.random() * possibleWallCols.length)];
        const startRow = possibleWallRows[0] - 1;
        const endRow = possibleWallRows[possibleWallRows.length - 1] + 1;
        let passageRow = Math.floor(Math.random() * (endRow - startRow + 1)) + startRow;

        while (passageRow % 2 === 0)
            passageRow = Math.floor((Math.random() * (endRow - startRow + 1)) + 1) + startRow;

        for (let row = startRow; row <= endRow; row++)
        {
            /* Leave a passage through the wall */
            if (row === passageRow)
                continue;

            const id = `node-${row}-${randomCol}`;

            grid.changeWallStatusOfNodeTo(id, true);

            animations.push(grid.nodesMatrix[row][randomCol]);
        }

        const wallIndex = possibleWallCols.indexOf(randomCol);

        const colsLeftOfWall = possibleWallCols.slice(0, wallIndex);
        const colsRightOfWall = possibleWallCols.slice(wallIndex + 1);

        divide(grid, possibleWallRows, colsLeftOfWall, animations);
        divide(grid, possibleWallRows, colsRightOfWall, animations);
    }
}

function getWallOrientation(possibleWallRows, possibleWallCols)
{
    const numOfRows = possibleWallRows.length;
    const numOfCols = possibleWallCols.length;

    /* Always horizontally divide chambers that are taller than they are wide */
    if (numOfRows > numOfCols)
        return WallOrientation.horizontal;
    
    else if (numOfRows < numOfCols)
        return WallOrientation.vertical;

    else
    {
        const verticalOrientation = Math.random() < 0.5;

        if (verticalOrientation === true)
            return WallOrientation.vertical;

        else
            return WallOrientation.horizontal;
    }
}