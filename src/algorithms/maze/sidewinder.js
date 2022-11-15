'use strict';

export default function sidewinder(grid)
{
    /* Contains all the cells in the current row that are connected 
        horizontally. Cells get added as long as right walls are removed.
        If no right wall is removed the remove a top wall from a random
        cell in this set */
    const runSet = []
    const unvisitedCells = grid.mazeCells;
    let currCell = unvisitedCells[0];

    /* Can't create remove a wall top of the current cell in the
        top most row so always remove the wall on the right */
    for (const cell of unvisitedCells)
    {
        if (cell.row == 1)
        {
            grid.removeWallBetweenMazeCells(currCell, cell);
            currCell = cell;
        }
    }

    for (let row = 3; row < grid.rows - 1; row += 2)
    {
        const cellsInCurrentRow = [];

        for (let i = 0; i < unvisitedCells.length; i++)
        {
            if (unvisitedCells[i].row === row)
                cellsInCurrentRow.push(unvisitedCells[i]);
        }

        let currCellIndex = 0;
        currCell = cellsInCurrentRow[currCellIndex];
        runSet.push(currCell);
        const lastCell = cellsInCurrentRow[cellsInCurrentRow.length - 1];

        while(currCell !== lastCell)
        {
            let removeRightWall = false;

            /* Randomly decide whether or not to remove the right wall */
            if (Math.random() < 0.5)
                removeRightWall = true;

            if (removeRightWall === true)
            {
                currCellIndex++;
                const nextCell = cellsInCurrentRow[currCellIndex];
                grid.removeWallBetweenMazeCells(currCell, nextCell);
                currCell = nextCell;
                runSet.push(nextCell);
            }

            else
            {
                const randomCell = runSet[Math.floor(Math.random() * runSet.length)];
                const neighbors = grid.getNeighborsOfMazeCell(randomCell);

                for (const neighbor of neighbors)
                {
                    if (isNorthNeighbor(randomCell, neighbor) === true)
                    {
                        grid.removeWallBetweenMazeCells(randomCell, neighbor);
                        /* Clear the run set */
                        runSet.length = 0;
                        /* Add the right neighbor of the current cell to the run set */
                        currCellIndex++;
                        const nextCell = cellsInCurrentRow[currCellIndex];
                        currCell = nextCell;
                        runSet.push(nextCell);
                        break;
                    }
                }
            }
        }

        /* Right most cell of the row, so remove a random top wall from a cell in the run set */
        const randomCell = runSet[Math.floor(Math.random() * runSet.length)];
        const neighbors = grid.getNeighborsOfMazeCell(randomCell);

        for (const neighbor of neighbors)
        {
            if (isNorthNeighbor(randomCell, neighbor) === true)
            {
                grid.removeWallBetweenMazeCells(randomCell, neighbor);
                /* Clear the run set */
                runSet.length = 0;
                break;
            }
        }
    }
}

function isNorthNeighbor(cell, neighbor)
{
    const rowDiff = neighbor.row - cell.row;
    const colDiff = neighbor.column - cell.column;

    if (rowDiff === -2 && colDiff === 0)
        return true;

    return false;
}