'use strict';

export default function randomizedPrim(grid)
{
    const startingCell = grid.getRandomUnvisitedMazeCell();
    startingCell.isVisited = true;
    /* Frontier cells are cells that haven't been visited yet and are neighbor of a visited
        cell. The visited cells are 'in' the maze */
    const frontierCells = grid.getNeighborsOfMazeCell(startingCell).filter(checkIfUnvisited);

    while (frontierCells.length > 0)
    {
        const randomFrontierCell = frontierCells[Math.floor(Math.random() * frontierCells.length)];
        randomFrontierCell.isVisited = true;
        frontierCells.splice(frontierCells.indexOf(randomFrontierCell), 1);

        const neighbors = grid.getNeighborsOfMazeCell(randomFrontierCell);
        const newFrontierCells = neighbors.filter(checkIfUnvisited);

        /* Add the unvisited neighbors of the current frontier cell to the array */
        for (const newFrontierCell of newFrontierCells)
        {
            if (frontierCells.includes(newFrontierCell) === false)
                frontierCells.push(newFrontierCell);
        }

        /* Connect the frontier cell to a random already visited neighbor */
        const neighborsInMaze = neighbors.filter(checkIfVisited);
        const randomNeighborInMaze = neighborsInMaze[Math.floor(Math.random() * neighborsInMaze.length)];
        grid.removeWallBetweenMazeCells(randomFrontierCell, randomNeighborInMaze);
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