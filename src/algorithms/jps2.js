'use strict';

export default function jps2(grid, startNode, finishNode) {
    const closedList = [];
    let openList = [];
    startNode.distanceFromStart = 0;
    startNode.heuristicDistance = getDistance(startNode, finishNode);
    startNode.totalDistance = startNode.distanceFromStart + startNode.heuristicDistance;
    openList.push(startNode);

    while (openList.length > 0) {
        sortNodesByDistance(openList);

        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.id === finishNode.id)
        {
            let currentNode = finishNode;
            const shortestPath = [];

            while (currentNode !== null)
            {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }
            console.log(closedList);
            return [closedList, shortestPath];
        }

        openList = openList.concat(identifySuccessors(grid, closestNode, startNode, finishNode, closedList));
    }

    return [closedList, null];
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

function identifySuccessors(grid, currentNode, startNode, finishNode, closedList) {
    const successors = [];
    const neighbors = getNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
        if (closedList.includes(neighbor) || neighbor.isWall === true) {
            continue;
        }

        const rowChange = neighbor.row - currentNode.row;
        const colChange = neighbor.column - currentNode.column;

        const jumpPoints = jump(grid, neighbor, rowChange, colChange, finishNode);

        for (const jumpPoint of jumpPoints)
        {
            if (jumpPoint === '')
            {
                continue;
            }

            jumpPoint.isJumpPoint = true;
            jumpPoint.distanceFromStart = getDistance(currentNode, jumpPoint);
            jumpPoint.heuristicDistance = getDistance(jumpPoint, finishNode);
            jumpPoint.totalDistance = jumpPoint.distanceFromStart + 
                jumpPoint.heuristicDistance;
            successors.push(jumpPoint);
        }
    }

    return successors;
}

function jump(grid, currentNode, rowChange, colChange, finishNode) 
{
    let newJumpPoints = [];

    if (currentNode.row + rowChange < 0 || currentNode.row + rowChange > grid.rows - 1 ||
        currentNode.column + colChange < 0 || currentNode.column + colChange > grid.columns - 1)
    {
        return newJumpPoints;
    }

    const nextNode = grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + colChange];
    
    if (nextNode.isWall === true) 
    {
        return newJumpPoints;
    }

    nextNode.prevNode = currentNode;

    if (nextNode.row === finishNode.row && nextNode.column === finishNode.column) 
    {
        newJumpPoints.push(nextNode);
        return newJumpPoints;
    }

    if (rowChange !== 0 && colChange !== 0) 
    {
        /* Check if there's a wall directly left or right of the next node, but not above or below
            it depending on wheter we move up or down */
        if (nextNode.row + rowChange >= 0 && nextNode.row + rowChange < grid.rows && 
            nextNode.column - colChange >= 0 && nextNode.column - colChange < grid.columns &&
            grid.nodesMatrix[nextNode.row][nextNode.column - colChange].isWall === true &&
            grid.nodesMatrix[nextNode.row + rowChange][nextNode.column - colChange].isWall === false) 
        {
            newJumpPoints.push(nextNode);
            return newJumpPoints;
        }

        /* Same check for walls directly above or below the next node */
        if (nextNode.row + colChange >= 0 && nextNode.row + colChange < grid.columns && 
            nextNode.row - rowChange >= 0 && nextNode.row - rowChange < grid.rows &&
            grid.nodesMatrix[nextNode.row - rowChange][nextNode.column].isWall === true &&
            grid.nodesMatrix[nextNode.row - rowChange][nextNode.column + colChange].isWall === false)
        {
            newJumpPoints.push(nextNode);
            return newJumpPoints;
        }

        newJumpPoints = newJumpPoints.concat(jump(grid, currentNode, 0, colChange, finishNode));
        
        if (newJumpPoints.length > 0)
        {
            newJumpPoints.push(nextNode);
            return newJumpPoints;
        }

        newJumpPoints = newJumpPoints.concat(jump(grid, currentNode, rowChange, 0, finishNode));
        
        if (newJumpPoints.length > 0)
        {
            newJumpPoints.push(nextNode);
            return newJumpPoints;
        } 
    }

    else
    {
        /* Ensures that we stay on the grid */
        // if (nextNode.row - 1 < 0 || nextNode.row + 1 > grid.rows - 1 ||
        //     nextNode.column - 1 < 0 || nextNode.column + 1 > grid.columns - 1)
        // {
        //     return newJumpPoints;
        // }
        if (currentNode.row - 1 < 0 || currentNode.row + 1 > grid.rows - 1 ||
            currentNode.column - 1 < 0 || currentNode.column + 1 > grid.columns - 1)
        {
            return newJumpPoints;
        }
        
        /* Horizontal movement */
        if (colChange !== 0)
        {
            /* Check directly above */
            if (grid.nodesMatrix[currentNode.row - 1][currentNode.column].isWall === true &&
                grid.nodesMatrix[currentNode.row - 1][currentNode.column + colChange].isWall === false)
            {
                newJumpPoints.push(currentNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row - 1][currentNode.column + colChange]);
                return newJumpPoints;
            }
        
            /* Check directly below */
            if (grid.nodesMatrix[currentNode.row + 1][currentNode.column].isWall === true &&
                grid.nodesMatrix[currentNode.row + 1][currentNode.column + colChange].isWall === false)
            {
                newJumpPoints.push(currentNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row + 1][currentNode.column + colChange]);
                return newJumpPoints;
            }
        }

        /* Vertical movement */
        else 
        {
            /* Check directly left */
            if (grid.nodesMatrix[currentNode.row][currentNode.column - 1].isWall === true &&
                grid.nodesMatrix[currentNode.row + rowChange][currentNode.column - 1].isWall === false)
            {
                newJumpPoints.push(currentNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row + rowChange][currentNode.column - 1]);
                return newJumpPoints;
            }

            /* Check directly right */
            if (grid.nodesMatrix[currentNode.row][currentNode.column + 1].isWall === true &&
                grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + 1].isWall === false)
            {
                newJumpPoints.push(currentNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row + rowChange][currentNode.column - 1]);
                return newJumpPoints;
            }
        }
    }

    /* No forced neighbor was found so continue searching */
    return newJumpPoints = newJumpPoints.concat(jump(grid, nextNode, rowChange, colChange, finishNode));
}

function getNeighbors(grid, node) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, left = false, right = false;

    if (row > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
        up = true;
    }

    if (row < grid.rows - 1) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
        down = true;
    }

    if (col > 0) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
        left = true;
    }

    if (col < grid.columns - 1) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
        right = true;
    }

    if (up === true && left === true) {
        neighbors.push(grid.nodesMatrix[row - 1][col - 1]);
    }

    if (up === true && right === true) {
        neighbors.push(grid.nodesMatrix[row - 1][col + 1]);
    }

    if (down === true && left === true) {
        neighbors.push(grid.nodesMatrix[row + 1][col - 1]);
    }

    if (down === true && right === true) {
        neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
    }

    return neighbors;
}

function getDistance(firstNode, secondNode) {
    const rowChange = Math.abs(firstNode.row - secondNode.row);
    const colChange = Math.abs(firstNode.row - secondNode.row);

    return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));
}