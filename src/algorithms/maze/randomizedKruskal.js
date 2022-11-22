'use strict';

export default function randomizedKruskal(grid)
{
    const animations = [];
    /* Right and bottom wall of each cell */
    const cellWalls = [];
    /* Each set contains all cells connected to each other */
    const cellSets = [];

    for (const cell of grid.mazeCells)
    {
        /* Add right wall */
        if (grid.isOnGrid(cell.row, cell.column + 1) === true)
            cellWalls.push([cell.row, cell.column + 1, 'right']);

        /* Add bottom wall */
        if (grid.isOnGrid(cell.row + 1, cell.column) === true)
            cellWalls.push([cell.row + 1, cell.column, 'bottom']);

        cellSets.push([cell]);
    }

    while (cellWalls.length > 0)
    {
        const currWall = cellWalls[Math.floor(Math.random() * cellWalls.length)];
        cellWalls.splice(cellWalls.indexOf(currWall), 1);

        const [wallRow, wallCol, wallPosition] = currWall;

        let cellOneRow, cellOneCol, cellTwoRow, cellTwoCol;

        /* Unvisited nodes are directly left and right of the wall */
        if (wallPosition === 'right')
        {
            cellOneRow = wallRow;
            cellTwoRow = wallRow;
            cellOneCol = wallCol - 1;
            cellTwoCol = wallCol + 1;
        }

        /* Unvisited nodes are directly above and below the wall */
        else if (wallPosition === 'bottom')
        {
            cellOneRow = wallRow - 1;
            cellTwoRow = wallRow + 1;
            cellOneCol = wallCol;
            cellTwoCol = wallCol;
        }

        if (grid.isAccessibleAt(cellOneRow, cellOneCol) === true &&
            grid.isAccessibleAt(cellTwoRow, cellTwoCol) === true)
        {
            const cellOneSetNumber = getSetNumberOfCell(cellOneRow, cellOneCol, cellSets);
            const cellTwoSetNumber = getSetNumberOfCell(cellTwoRow, cellTwoCol, cellSets);
            
            /* Both cells are in different sets */
            if (cellOneSetNumber !== cellTwoSetNumber)
            {
                /* Move all the cells contained in the same set as the right
                    cell into the set where the left cell is in */
                while (cellSets[cellTwoSetNumber].length > 0)
                {
                    const cellToMove = cellSets[cellTwoSetNumber].pop();
                    cellSets[cellOneSetNumber].push(cellToMove);
                }

                /* Remove the empty set which had contained the right cell */
                cellSets.splice(cellTwoSetNumber, 1);

                const cellOne = grid.nodesMatrix[cellOneRow][cellOneCol];
                const cellTwo = grid.nodesMatrix[cellTwoRow][cellTwoCol];
                grid.removeWallBetweenMazeCells(cellOne, cellTwo);
                document.getElementById(`node-${wallRow}-${wallCol}`).className = 'unvisited';

                const cellBetween = grid.getNodeBetween(cellOne, cellTwo);
                animations.push(cellBetween);
            }
        }
    }

    return animations;
}

function getSetNumberOfCell(cellRow, cellCol, cellSets)
{
    for (let i = 0; i < cellSets.length; i++)
    {
        /* A set is made up of multiple nodes as the algorithm goes on */
        for (let j = 0; j < cellSets[i].length; j++)
        {
            /* Turn array of size 2 to string, because if the content of both
                arrays is equal then the string is too */
            if (cellRow === cellSets[i][j].row && cellCol === cellSets[i][j].column)
                return i;
        }
    }
}