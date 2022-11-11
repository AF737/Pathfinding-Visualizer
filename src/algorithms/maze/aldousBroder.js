'use strict';

export default function aldousBroder(grid)
{
    let numOfUnvisitedCells = grid.mazeCells.length;

    let currCell = grid.getRandomUnvisitedMazeCell();
    currCell.isVisited = true;
    numOfUnvisitedCells--;

    while (numOfUnvisitedCells > 0)
    {
        const neighbors = grid.getNeighborsOfMazeCell(currCell);
        /* Make random neighbor the new current cell */
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];

        if (randomNeighbor.isVisited === false)
        {
            grid.removeWallBetweenMazeCells(currCell, randomNeighbor);
            randomNeighbor.isVisited = true;
            numOfUnvisitedCells--;
        }

        currCell = randomNeighbor;
    }
}