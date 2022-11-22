'use strict';

export default function randomizedDepthFirstSearch(grid)
{
    const animations = [];
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

            const nodeBetween = grid.getNodeBetween(currentCell, randomNeighbor);
            const id = `node-${nodeBetween.row}-${nodeBetween.column}`;
            grid.changeWallStatusOfNodeTo(id, false);
            animations.push(nodeBetween);

            randomNeighbor.isVisited = true;
            visitedCells.push(randomNeighbor);
        }
    }

    return animations;
}

function checkIfUnivisted(neighbor)
{
    return neighbor.isVisited === false;
}