'use strict';

export default function randomizedDepthFirstSearch(grid)
{
    const visitedCells = [];
    let currentCell = grid.getRandomUnvisitedMazeCell();
    currentCell.isVisited = true;
    visitedCells.push(currentCell);

    while (visitedCells.length > 0)
    {
        currentCell = visitedCells.pop();
        const unvisitedNeighbors = grid.getNeighborsOfMazeCell(currentCell)
            .filter(checkIfUnivisted);
        
        if (unvisitedNeighbors.length > 0)
        {
            visitedCells.push(currentCell);
            const randomNeighbor = 
                unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];

            grid.removeWallBetweenMazeCells(currentCell, randomNeighbor);
            randomNeighbor.isVisited = true;
            visitedCells.push(randomNeighbor);
        }
    }
}

function checkIfUnivisted(neighbor)
{
    return neighbor.isVisited === false;
}