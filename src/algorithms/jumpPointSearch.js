'use strict';

export default function jumpPointSearch(grid, startNode, finishNode) 
{
    console.log('new');
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
            console.log(finishNode);
            const shortestPath = getPath(grid, finishNode);
            // const shortestPath = null;

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
    console.log('current node');
    console.log(currentNode);
    if (currentNode.class !== 'start')
        console.log(currentNode.prevNode.id);
    console.log('x');
    for (const neighbor of neighbors) 
    {
        console.log(neighbor);
        
        if (neighbor.isWall === true || closedList.includes(neighbor) === true) 
            continue;

        neighbor.distanceFromStart = currentNode.distanceFromStart + getDistance(currentNode, neighbor);
        neighbor.prevNode = currentNode;

        const rowChange = neighbor.row - currentNode.row;
        const colChange = neighbor.column - currentNode.column;
        console.log(`${rowChange}, ${colChange}`);

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
                    jumpPoint.prevNode = neighbor;

                else
                    jumpPoint.prevNode = currentNode;
            }

            console.log('jump point');
            console.log(jumpPoint);
        }
    }
}

// function jump(grid, row, col, rowChange, colChange, finishNode)
// {
//     if (grid.isOnGrid(row, col) === false)
//         return null;

//     if (grid.isAccessibleAt(row, col) === false)
//         return null;

//     if (grid.nodesMatrix[row][col] === finishNode)
//         return [row, col];

//     if (rowChange !== 0 && colChange !== 0 && ((row === 0 || row === grid.rows - 1)
//         || (col === 0 || col === grid.columns - 1)))
//     {
//         const horizontalJumpPoint = jump(grid, row, col, 0, colChange, finishNode);

//         if (horizontalJumpPoint !== null)
//             return horizontalJumpPoint;

//         const verticalJumpPoint = jump(grid, row, col, rowChange, 0, finishNode);

//         if (verticalJumpPoint !== null)
//             return verticalJumpPoint;
//     }

//     const nextRow = row + rowChange;
//     const nextCol = col + colChange;

//     if (grid.isOnGrid(nextRow, nextCol) === false)
//         return null;

//     if (rowChange !== 0 && colChange !== 0)
//     {
//         /* Prevent corner cutting */
//         if (grid.nodesMatrix[nextRow][col].isWall === true &&
//             grid.nodesMatrix[row][nextCol].isWall === true)
//             return null;

//         const prevRow = row - rowChange;
//         const prevCol = col - colChange;

//         /* Check if there's a wall directly below (when moving up) or above
//             (when moving down) the current node, but not left (when moving left)
//             or right (when moving right) of the wall. Return current node as a 
//             jump point, because that's the only way to access the empty node */
//         if (grid.nodesMatrix[prevRow][nextCol].isWall === false &&
//             grid.nodesMatrix[row][nextCol].isWall === false &&
//             grid.nodesMatrix[prevRow][col].isWall === true)
//             return [row, col];

//         /* Check if there's a wall directly left (when moving right) or right
//             (when moving left) the current node, but not above (when moving up)
//             or below (when moving down) of the wall */
//         if (grid.nodesMatrix[nextRow][prevCol].isWall === false &&
//             grid.nodesMatrix[nextRow][col].isWall === false &&
//             grid.nodesMatrix[row][nextCol].isWall === true)
//             return [row, col];

//         const horizontalJumpPoint = jump(grid, row, col, 0, colChange, finishNode);

//         if (horizontalJumpPoint !== null)
//             return horizontalJumpPoint;

//         const verticalJumpPoint = jump(grid, row, col, rowChange, 0, finishNode);

//         if (verticalJumpPoint !== null)
//             return verticalJumpPoint;
//     }

//     else 
//     {
//         /* Moving horizontally */
//         if (colChange !== 0)
//         {
//             // if (row + 1 > grid.rows - 1)
//             //     return null;

//             /* Check for forced neighbors above the node */
//             if (row + 1 <= grid.rows - 1 &&
//                 grid.nodesMatrix[row + 1][col].isWall === true &&
//                 grid.nodesMatrix[row + 1][nextCol].isWall === false)
//                 return [row, col];

//             // if (row - 1 < 0)
//             //     return null;

//             /* Check for forced neighbors below the node */
//             if (row - 1 >= 0 &&
//                 grid.nodesMatrix[row - 1][col].isWall === true &&
//                 grid.nodesMatrix[row - 1][nextCol].isWall === false)
//                 return [row, col];
//         }

//         /* Moving vertically */
//         else
//         {
//             // if (col + 1 > grid.columns - 1)
//             //     return null;

//             /* Check for forced neighbors right of the node */
//             if (col + 1 <= grid.columns - 1 &&
//                 grid.nodesMatrix[row][col + 1].isWall === true &&
//                 grid.nodesMatrix[nextRow][col + 1].isWall === false)
//                 return [row, col];

//             // if (col - 1 < 0)
//             //     return null;

//             /* Check for forced neighbors left of the node */
//             if (col - 1 >= 0 &&
//                 grid.nodesMatrix[row][col - 1].isWall === true &&
//                 grid.nodesMatrix[nextRow][col - 1].isWall === false)
//                 return [row, col];
//         }
//     }

//     return jump(grid, nextRow, nextCol, rowChange, colChange, finishNode);
// }

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

function getPath(grid, finishNode)
{
    let currentNode = finishNode;
    const jumpPoints = [];
    const shortestPath = [];
    let c = 0;
    while (currentNode !== null && c < 100)
    {
        c++;
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

        console.log('F');
        while (currentNode.id !== jumpPoint.id)
        {
            shortestPath.push(currentNode);
            console.log(`${currentNode.row}, ${currentNode.column}`);
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

    // return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));

    if (rowChange > colChange)
        return ((rowChange - colChange) + (Math.SQRT2 * colChange));

    else 
        return ((colChange - rowChange) + (Math.SQRT2 * rowChange));
}