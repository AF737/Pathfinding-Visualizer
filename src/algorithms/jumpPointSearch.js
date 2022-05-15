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
            let currentNode = finishNode;
            const shortestPath = [];

            /* Recreate the path from the finish to the start node by going
                through the previous nodes until the start node is reached */
            while (currentNode !== null) 
            {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        identifySuccessors(grid, closestNode, finishNode, closedList, openList);
    }

    return [closedList, null];
}

function sortNodesByDistance(openList) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

function identifySuccessors(grid, currentNode, finishNode, closedList, openList) 
{
    const neighbors = getNeighbors(grid, currentNode);

    for (const neighbor of neighbors) 
    {
        
        if (neighbor.isWall === true || closedList.includes(neighbor) === true) 
            continue;

        neighbor.distanceFromStart = currentNode.distanceFromStart + getDistance(currentNode, neighbor);
        neighbor.prevNode = currentNode;

        const rowChange = neighbor.row - currentNode.row;
        const colChange = neighbor.column - currentNode.column;

        const destination = jump(grid, neighbor.row, neighbor.column, rowChange, colChange, finishNode);

        if (destination !== null)
        {
            const jumpPoint = grid.nodesMatrix[ destination[0] ][ destination[1] ];

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
                jumpPoint.distanceFromStart = shortestPath;
                jumpPoint.totalDistance = jumpPoint.distanceFromStart + jumpPoint.heuristicDistance;
                jumpPoint.isJumpPoint = true;

                if (jumpPoint.id !== neighbor.id)
                    setPrevNodes(grid, jumpPoint, neighbor);

                else
                    setPrevNodes(grid, jumpPoint, currentNode);
            }
        }
    }
}

function jump(grid, row, col, rowChange, colChange, finishNode)
{
    if (grid.isAccessibleAt(row, col) === false)
        return null;

    if (grid.nodesMatrix[row][col] === finishNode)
        return [row, col];

    if (rowChange !== 0 && colChange !== 0)
    {
        if (grid.isAccessibleAt(row + rowChange, col - colChange) === true &&
            grid.isAccessibleAt(row, col - colChange) === false)
            return [row, col];

        if (grid.isAccessibleAt(row - rowChange, col + colChange) === true &&
            grid.isAccessibleAt(row - rowChange, col) === false)
            return [row, col];

        if (jump(grid, row, col + colChange, 0, colChange, finishNode) !== null)
            return [row, col];

        if (jump(grid, row + rowChange, col, rowChange, 0, finishNode) !== null)
            return [row, col];
    }

    else
    {
        if (rowChange !== 0)
        {
            if (grid.isAccessibleAt(row + rowChange, col + 1) === true &&
                grid.isAccessibleAt(row, col + 1) === false &&
                grid.isAccessibleAt(row + rowChange, col) === true)
                return [row, col];

            if (grid.isAccessibleAt(row + rowChange, col - 1) === true &&
                grid.isAccessibleAt(row, col - 1) === false &&
                grid.isAccessibleAt(row + rowChange, col) === true)
                return [row, col];
        }

        else
        {
            if (grid.isAccessibleAt(row + 1, col + colChange) === true &&
                grid.isAccessibleAt(row + 1, col) === false &&
                grid.isAccessibleAt(row, col + colChange) === true)
                return [row, col];

            if (grid.isAccessibleAt(row - 1, col + colChange) === true &&
                grid.isAccessibleAt(row - 1, col) === false &&
                grid.isAccessibleAt(row, col + colChange) === true)
                return [row, col];
        }
    }

    return jump(grid, row + rowChange, col + colChange, rowChange, colChange, finishNode);
}

function setPrevNodes(grid, jumpPoint, initialNode)
{
    const rowDiff = jumpPoint.row - initialNode.row;
    const colDiff = jumpPoint.column - initialNode.column;
    let rowChange = 0, colChange = 0;

    if (rowDiff !== 0)
        rowChange = rowDiff / Math.abs(rowDiff);

    if (colDiff !== 0)
        colChange = colDiff / Math.abs(colDiff);

    let currentNode = initialNode;
    while (currentNode !== jumpPoint)
    {
        const nextNode = grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + colChange];
        nextNode.prevNode = currentNode;
        currentNode = nextNode;
    }
}

function getNeighbors(grid, node) 
{
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, left = false, right = false;

    if (node.prevNode === null)
    {
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
    }

    else 
    {
        const prevRow = node.prevNode.row;
        const prevCol = node.prevNode.column;

        const rowDiff = row - prevRow;
        const colDiff = col - prevCol;
        let rowChange = 0, colChange = 0;
        
        if (rowDiff !== 0)
            rowChange = rowDiff / Math.abs(rowDiff);
        
        if (colDiff !== 0)
            colChange = colDiff / Math.abs(colDiff);

        const nextRow = row + rowChange;
        const nextCol = col + colChange;
        
        if (rowChange !== 0 && colChange !== 0)
        {
            if (grid.isAccessibleAt(nextRow, col) === true)
                neighbors.push(grid.nodesMatrix[nextRow][col]);

            if (grid.isAccessibleAt(row, nextCol) === true)
                neighbors.push(grid.nodesMatrix[row][nextCol]);

            if (grid.isAccessibleAt(nextRow, nextCol) === true &&
                checkCornerCutting(grid, row, col, rowChange, colChange) === false)
                neighbors.push(grid.nodesMatrix[nextRow][nextCol]);

            if (grid.isAccessibleAt(prevRow, col) === false &&
                grid.isAccessibleAt(row, nextCol) === true)
                neighbors.push(grid.nodesMatrix[prevRow][nextCol]);

            if (grid.isAccessibleAt(row, prevCol) === false &&
                grid.isAccessibleAt(nextRow, col) === true)
                neighbors.push(grid.nodesMatrix[nextRow][prevCol]);
        }

        else
        {
            if (colChange !== 0)
            {
                let accessible = false;

                if (grid.isAccessibleAt(row, nextCol) === true)
                {
                    accessible = true;
                    neighbors.push(grid.nodesMatrix[row][nextCol]);
                }

                if (grid.isOnGrid(row + 1, col) === true && 
                    grid.isAccessibleAt(row + 1, col) === false &&
                    accessible === true)
                    neighbors.push(grid.nodesMatrix[row + 1][nextCol]);

                if (grid.isOnGrid(row - 1, col) === true && 
                    grid.isAccessibleAt(row - 1, col) === false &&
                    accessible === true)
                    neighbors.push(grid.nodesMatrix[row - 1][nextCol]);
            }

            else
            {
                let accessible = false;

                if (grid.isAccessibleAt(nextRow, col) === true)
                {
                    accessible = true;
                    neighbors.push(grid.nodesMatrix[nextRow][col]);
                }
                
                if (grid.isOnGrid(row, col - 1) &&
                    grid.isAccessibleAt(row, col - 1) === false &&
                    accessible === true)
                    neighbors.push(grid.nodesMatrix[nextRow][col - 1]);

                if (grid.isOnGrid(row, col + 1) &&
                    grid.isAccessibleAt(row, col + 1) === false &&
                    accessible === true)
                    neighbors.push(grid.nodesMatrix[nextRow][col + 1]);
            }
        }
    }

    return neighbors;
}

/* Prohibit diagonal movement in that direction if there's a wall directly next to it
    vertically and horizontally */
function checkCornerCutting(grid, row, col, rowChange, colChange) 
{
    if (grid.isAccessibleAt(row + rowChange, col) === false &&
        grid.isAccessibleAt(row, col + colChange) === false)
        return true;

    return false;
}

/* Octile distance is used to check if moving diagonally has a smaller cost
    than moving in only four directions */
function getDistance(firstNode, secondNode) 
{
    const rowChange = Math.abs(firstNode.row - secondNode.row);
    const colChange = Math.abs(firstNode.row - secondNode.row);

    if (rowChange > colChange)
        return ((rowChange - colChange) + (Math.SQRT2 * colChange));

    else 
        return ((colChange - rowChange) + (Math.SQRT2 * rowChange));
}