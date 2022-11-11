'use strict';

export default function huntAndKill(grid)
{
    const unvisitedCells = grid.mazeCells;
    let currCell = grid.getRandomUnvisitedMazeCell();
    currCell.isVisited = true;
    removeCellFromUnvisitedCells(unvisitedCells, currCell);

    while (unvisitedCells.length > 0)
    {
        const unvisitedNeighbors = 
            grid.getNeighborsOfMazeCell(currCell).filter(checkIfUnvisited);

        if (unvisitedNeighbors.length === 0)
        {
            for (const unvisitedCell of unvisitedCells)
            {
                const cell = grid.nodesMatrix[unvisitedCell.row][unvisitedCell.column];
                const visitedNeighbors = grid.getNeighborsOfMazeCell(cell).filter(checkIfVisited);
                
                if (visitedNeighbors.length > 0)
                {
                    const randomVisitedNeighbor = 
                        visitedNeighbors[Math.floor(Math.random() * visitedNeighbors.length)];
                    grid.removeWallBetweenMazeCells(cell, randomVisitedNeighbor);
                    cell.isVisited = true;
                    removeCellFromUnvisitedCells(unvisitedCells, cell);
                    currCell = cell;
                    break;
                }
            }
        }

        else
        {
            const randomUnvisitedNeighbor = 
                unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];

            grid.removeWallBetweenMazeCells(currCell, randomUnvisitedNeighbor);
            randomUnvisitedNeighbor.isVisited = true;
            removeCellFromUnvisitedCells(unvisitedCells, randomUnvisitedNeighbor);
            currCell = randomUnvisitedNeighbor;
        }
    }
}

function checkIfUnvisited(neighbor)
{
    return neighbor.isVisited === false;
}

function checkIfVisited(neighbor)
{
    return neighbor.isVisited === true;
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