'use strict';

export default function wilson(grid)
{
    const unvisitedCells = grid.mazeCells;
    const randomVisitedCell = grid.getRandomUnvisitedMazeCell();
    randomVisitedCell.isVisited = true;
    removeCellFromUnvisitedCells(unvisitedCells, randomVisitedCell);
    
    while (unvisitedCells.length > 0)
    {
        const startingCell = grid.getRandomUnvisitedMazeCell();
        let currCell = startingCell;
        let visitedCellFound = false;

        while (visitedCellFound === false)
        {
            const neighbors = grid.getNeighborsOfMazeCell(currCell);
            const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
            currCell.allowedDirection = getDirectionBetween(currCell, randomNeighbor);

            if (randomNeighbor.isVisited === true)
            {
                currCell = startingCell;

                while (currCell !== randomNeighbor)
                {
                    currCell.isVisited = true;
                    removeCellFromUnvisitedCells(unvisitedCells, currCell);
                    const [rowChange, colChange] = currCell.allowedDirection;
                    const neighbor = grid.nodesMatrix[currCell.row + rowChange][currCell.column + colChange];
                    grid.removeWallBetweenMazeCells(currCell, neighbor);
                    currCell = neighbor;
                }

                visitedCellFound = true;
            }

            currCell = randomNeighbor;
        }
    }
    
    for (let row = 0; row < grid.rows; row++)
    {
        for (let col = 0; col < grid.columns; col++)
        {
            grid.nodesMatrix[row][col].allowedDirection = [null, null];
        }
    }
}

function removeCellFromUnvisitedCells(unvisitedCells, cell)
{
    for (let i = 0; i < unvisitedCells.length; i++)
    {
        if (unvisitedCells[i].row === cell.row &&
            unvisitedCells[i].column === cell.column)
        {
            unvisitedCells.splice(i, 1);
            break;
        }
    }
}

function getDirectionBetween(cell, neighbor)
{
    const rowChange = neighbor.row - cell.row;
    const colChange = neighbor.column - cell.column;

    return [rowChange, colChange];
}