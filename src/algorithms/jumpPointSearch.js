'use strict';

export default function jumpPointSearch(grid, startNode, finishNode) 
{
    const closedList = [];
    const openList = [];
    startNode.distanceFromStart = 0;
    startNode.heuristicDistance = getDistance(startNode, finishNode);
    startNode.totalDistance = startNode.distanceFromStart + startNode.heuristicDistance;
    openList.push(startNode);

    while (openList.length > 0) 
    {
        sortNodesByDistance(openList);

        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true)
            continue;

        if (closestNode === finishNode)
        {
            const shortestPath = getPath(grid, finishNode);

            return [closedList, shortestPath];
        }

        identifySuccessors(grid, closestNode, finishNode, closedList, openList);
    }

    return [closedList, null];
}

function sortNodesByDistance(openList) 
{
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

function identifySuccessors(grid, currentNode, finishNode, closedList, openList) 
{
    const neighbors = getNeighbors(grid, currentNode);

    for (const neighbor of neighbors) 
    {
        if (neighbor.isWall === true)
            continue;

        neighbor.distanceFromStart = currentNode.distanceFromStart + getDistance(currentNode, neighbor);
        neighbor.prevNode = currentNode;

        const rowChange = neighbor.row - currentNode.row;
        const colChange = neighbor.column - currentNode.column;
        neighbor.direction = [rowChange, colChange];

        const destination = jump(grid, neighbor.row, neighbor.column, rowChange, colChange, finishNode);

        if (destination !== null)
        {
            const node = grid.nodesMatrix[ destination[0] ][ destination[1] ];
            const jumpPoint = node;

            if (closedList.includes(jumpPoint) === true)
                continue;

            const shortestPath = neighbor.distanceFromStart + getDistance(neighbor, jumpPoint);
            let shortestPathFound = false;

            if (openList.includes(jumpPoint) === false)
            {
                shortestPathFound = true;
                jumpPoint.heuristicDistance = getDistance(jumpPoint, finishNode);
                openList.push(jumpPoint);
            }

            else if (shortestPath < jumpPoint.distanceFromStart)
                shortestPathFound = true;

            if (shortestPathFound === true)
            {
                jumpPoint.direction = [destination[2], destination[3]];
                jumpPoint.distanceFromStart = shortestPath;
                jumpPoint.totalDistance = jumpPoint.distanceFromStart + jumpPoint.heuristicDistance;
                jumpPoint.isJumpPoint = true;
                jumpPoint.prevNode = neighbor;
            }
        }
    }
}

function jump(grid, row, col, rowChange, colChange, finishNode)
{
    if (row < 0 || row > grid.rows - 1 || col < 0 || col > grid.columns - 1)
        return null;

    if (grid.nodesMatrix[row][col].isWall === true)
        return null;

    if (grid.nodesMatrix[row][col] === finishNode)
        return [row, col];

    const nextRow = row + rowChange;
    const nextCol = col + colChange;

    if (nextRow < 0 || nextRow > grid.rows - 1 || nextCol < 0 || nextCol > grid.columns - 1)
        return null;

    if (rowChange !== 0 && colChange !== 0)
    {
        /* Prevent corner cutting */
        if (grid.nodesMatrix[row + rowChange][col].isWall === true &&
            grid.nodesMatrix[row][col + colChange].isWall === true)
            return null;

        /* Check if there's a wall directly below (when moving up) or above
            (when moving down) the current node, but not left (when moving left)
            or right (when moving right) of the wall. Return current node as a 
            jump point, because that's the only way to access the empty node */
        if (grid.nodesMatrix[row - rowChange][col + colChange].isWall === false &&
            grid.nodesMatrix[row - rowChange][col].isWall === true)
            return [row, col];

        /* Check if there's a wall directly left (when moving right) or right
            (when moving left) the current node, but not above (when moving up)
            or below (when moving down) of the wall */
        if (grid.nodesMatrix[row + rowChange][col - colChange].isWall === false &&
            grid.nodesMatrix[row][col - colChange].isWall === true)
            return [row, col];

        if (grid.nodesMatrix[row][col + colChange].isWall === true)

        if (jump(grid, row, nextCol, 0, colChange, finishNode) !== null)
            return [row, col];

        if (jump(grid, nextRow, col, rowChange, 0, finishNode) !== null)
            return [row, col];
    }

    else 
    {
        /* Moving horizontally */
        if (colChange !== 0)
        {
            if (row + 1 > grid.rows - 1)
                return null;

            /* Check for forced neighbors above the node */
            if (grid.nodesMatrix[row + 1][col].isWall === true &&
                grid.nodesMatrix[row + 1][nextCol].isWall === false)
                return [row, col];

            if (row - 1 < 0)
                return null;

            /* Check for forced neighbors below the node */
            if (grid.nodesMatrix[row - 1][col].isWall === true &&
                grid.nodesMatrix[row - 1][nextCol].isWall === false)
                return [row, col];
        }

        /* Moving vertically */
        else
        {
            if (col + 1 > grid.columns - 1)
                return null;

            /* Check for forced neighbors right of the node */
            if (grid.nodesMatrix[row][col + 1].isWall === true &&
                grid.nodesMatrix[nextRow][col + 1].isWall === false)
                return [row, col];

            if (col - 1 < 0)
                return null;

            /* Check for forced neighbors left of the node */
            if (grid.nodesMatrix[row][col - 1].isWall === true &&
                grid.nodesMatrix[nextRow][col - 1].isWall === false)
                return [row, col];
        }
    }

    return jump(grid, nextRow, nextCol, rowChange, colChange, finishNode);
}

function getPath(grid, finishNode)
{
    let currentNode = finishNode;
    const jumpPoints = [];
    const shortestPath = [];

    while (currentNode !== null)
    {
        jumpPoints.unshift(currentNode);
        currentNode = currentNode.prevNode;
    }

    currentNode = jumpPoints.shift();

    while (jumpPoints.length > 0)
    {
        const jumpPoint = jumpPoints.shift();
        const rowDiff = jumpPoint.row - currentNode.row;
        const colDiff = jumpPoint.column - currentNode.column;
        let rowChange = 0, colChange = 0;

        if (rowDiff !== 0)
            rowChange = rowDiff / Math.abs(rowDiff);

        if (colDiff !== 0)
            colChange = colDiff / Math.abs(colDiff);

        while (currentNode.id !== jumpPoint.id)
        {
            shortestPath.push(currentNode);
            currentNode = grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + colChange];
        }
    }

    shortestPath.push(finishNode);

    return shortestPath;
}

function getNeighbors(grid, node) 
{
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, left = false, right = false;

    if (row > 0) 
    {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
        up = true;
    }

    if (row < grid.rows - 1) 
    {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
        down = true;
    }

    if (col > 0) 
    {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
        left = true;
    }

    if (col < grid.columns - 1) 
    {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
        right = true;
    }

    if (up === true && left === true &&
        checkCornerCutting(grid, row, col, -1, -1) === false)
        neighbors.push(grid.nodesMatrix[row - 1][col - 1]);

    if (up === true && right === true &&
        checkCornerCutting(grid, row, col, -1, 1) === false)
        neighbors.push(grid.nodesMatrix[row - 1][col + 1]);

    if (down === true && left === true &&
        checkCornerCutting(grid, row, col, 1, -1) === false) 
        neighbors.push(grid.nodesMatrix[row + 1][col - 1]);

    if (down === true && right === true &&
        checkCornerCutting(grid, row, col, 1, 1) === false) 
        neighbors.push(grid.nodesMatrix[row + 1][col + 1]);

    return neighbors;
}

/* Prohibit diagonal movement in that direction if there's a wall directly next to it
    vertically and horizontally */
function checkCornerCutting(grid, row, col, rowChange, colChange) 
{
    if (grid.nodesMatrix[row + rowChange][col].isWall === true &&
        grid.nodesMatrix[row][col + colChange].isWall === true)
        return true;

    else
        return false;
}

/* Octile distance is used to check if moving diagonally has a smaller cost
    than moving in only four directions */
function getDistance(firstNode, secondNode) 
{
    const rowChange = Math.abs(firstNode.row - secondNode.row);
    const colChange = Math.abs(firstNode.row - secondNode.row);

    return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));
}