'use strict';

export default function jps2(grid, startNode, finishNode) {
    const closedList = [];
    const openList = [];
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

        if (closestNode === finishNode)
        {
            // console.log(closedList);
            // return [closedList, null];
            // console.log('X');
            let currentNode = finishNode;
            console.log(finishNode);
            return [closedList, null];
            const shortestPath = getPath(grid, finishNode);
            let c = 0;
            // while (currentNode !== null && c < 30)
            // {
                // const rowChange = currentNode.direction[0];
                // const colChange = currentNode.direction[1];
                // const revRow = rowChange * -1;
                // const revCol = colChange * -1;
                // console.log(`currNode: ${currentNode}`);

                // currentNode = grid.nodesMatrix[currentNode.row + revRow][currentNode.column + revCol];

                // while (currentNode.direction === null ||
                //     currentNode.direction === [rowChange, colChange])
                // {
                //     console.log(currentNode);
                //     shortestPath.unshift(currentNode);
                //     currentNode.prevNode = grid.nodesMatrix[currentNode.row + revRow][currentNode.column + revCol];
                //     currentNode = currentNode.prevNode;
                // }
                // const prevNode = currentNode.prevNode;
                // console.log(currentNode);
                // const rowDiff = prevNode.row - currentNode.row;
                // const colDiff = prevNode.column - currentNode.column;
                // let rowChange = 0, colChange = 0;
                // console.log(prevNode);
                // if (rowDiff !== 0)
                // {
                //     rowChange = rowDiff / Math.abs(rowDiff);
                // }

                // if (colDiff !== 0)
                // {
                //     colChange = colDiff / Math.abs(colDiff);
                // }

                // while (currentNode.id !== prevNode.id)
                // {
                //     // console.log(currentNode === prevNode);
                //     // console.log('x');
                //     // console.log(prevNode);
                //     // console.log(currentNode);
                //     shortestPath.push(currentNode);
                //     currentNode = grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + colChange];
                //     // console.log('inner loop');
                //     // console.log(currentNode);
                // }

                // console.log('outer loop');
                // console.log(currentNode);

                // currentNode = prevNode;
                // console.log(currentNode);
                
                // c++;
                // currentNode = currentNode.prevNode;
            // }
            console.log(shortestPath);
            return [closedList, shortestPath];
            // return [closedList, null];
        }

        identifySuccessors(grid, closestNode, startNode, finishNode, closedList, openList);
    }

    return [closedList, null];
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

function identifySuccessors(grid, currentNode, startNode, finishNode, closedList, openList) {
    const successors = [];
    const neighbors = getNeighbors(grid, currentNode);

    for (const neighbor of neighbors) {
        // if (closedList.includes(neighbor) || neighbor.isWall === true) {
        //     continue;
        // }

        if (neighbor.isWall === true)
        {
            continue;
        }

        neighbor.distanceFromStart = currentNode.distanceFromStart + getDistance(currentNode, neighbor);
        neighbor.prevNode = currentNode;

        const rowChange = neighbor.row - currentNode.row;
        const colChange = neighbor.column - currentNode.column;
        neighbor.direction = [rowChange, colChange];

        // const jumpPoints = jump(grid, neighbor, rowChange, colChange, finishNode);

        // for (const jumpPoint of jumpPoints)
        // {
        //     if (jumpPoint === '')
        //     {
        //         continue;
        //     }

        //     jumpPoint.isJumpPoint = true;
        //     jumpPoint.distanceFromStart = getDistance(currentNode, jumpPoint);
        //     jumpPoint.heuristicDistance = getDistance(jumpPoint, finishNode);
        //     jumpPoint.totalDistance = jumpPoint.distanceFromStart + 
        //         jumpPoint.heuristicDistance;
            
        //     setPrevNodes(grid, jumpPoint, neighbor);
        //     successors.push(jumpPoint);
        // }
        const destination = jump2(grid, neighbor.row, neighbor.column, rowChange, colChange, finishNode);
        // console.log(destination);


        if (destination !== null)
        {
            const node = grid.nodesMatrix[ destination[0] ][ destination[1] ];
            // const jumpPoint = JSON.parse(JSON.stringify(node));
            const jumpPoint = node;

            if (closedList.includes(jumpPoint) === true)
                continue;

            // console.log(`${neighbor.id}, ${jumpPoint.id}`); 
            // console.log(`${neighbor.row}, ${neighbor.column}, ${jumpPoint[0]}, ${jumpPoint[1]}`);
            const shortestPath = neighbor.distanceFromStart + getDistance(neighbor, jumpPoint);
            let shortestPathFound = false;

            if (openList.includes(jumpPoint) === false)
            {
                shortestPathFound = true;
                jumpPoint.heuristicDistance = getDistance(jumpPoint, finishNode);
                openList.push(jumpPoint);
            }

            else if (shortestPath < jumpPoint.distanceFromStart)
            {
                shortestPathFound = true;
            }

            if (shortestPathFound === true)
            {
                jumpPoint.direction = [destination[2], destination[3]];
                jumpPoint.distanceFromStart = shortestPath;
                jumpPoint.totalDistance = jumpPoint.distanceFromStart + jumpPoint.heuristicDistance;
                jumpPoint.isJumpPoint = true;
                // jumpPoint.prevNode = JSON.parse(JSON.stringify(currentNode));
                jumpPoint.prevNode = neighbor;
                // setPrevNodes(grid, neighbor, jumpPoint);
                // jumpPoint.prevNode = neighbor;
            }

            // let currentNode = jumpPoint;
            // const revRow = rowChange * -1;
            // const revCol = colChange * -1;

            // while (currentNode !== neighbor)
            // {
            //     console.log(currentNode);
            //     currentNode.prevNode = grid.nodesMatrix[currentNode.row + revRow][currentNode.column + revCol];
            //     currentNode = currentNode.prevNode;
            // }
            // grid.nodesMatrix[ jumpPoint[0] ][ jumpPoint[1] ].direction = [ rowChange, colChange ];
            // successors.push(grid.nodesMatrix[ jumpPoint[0] ][ jumpPoint[1] ]);
        }
    }

    // return successors;
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

    // nextNode.prevNode = currentNode;

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

        newJumpPoints = newJumpPoints.concat(jump(grid, nextNode, 0, colChange, finishNode));
        
        if (newJumpPoints.length > 0)
        {
            newJumpPoints.push(nextNode);
            return newJumpPoints;
        }

        newJumpPoints = newJumpPoints.concat(jump(grid, nextNode, rowChange, 0, finishNode));
        
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
        if (nextNode.row - 1 < 0 || nextNode.row + 1 > grid.rows - 1 ||
            nextNode.column - 1 < 0 || nextNode.column + 1 > grid.columns - 1)
        {
            return newJumpPoints;
        }
        
        /* Horizontal movement */
        if (colChange !== 0)
        {
            /* Check directly above */
            if (grid.nodesMatrix[nextNode.row - 1][nextNode.column].isWall === true &&
                grid.nodesMatrix[nextNode.row - 1][nextNode.column + colChange].isWall === false)
            {
                newJumpPoints.push(nextNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row - 1][currentNode.column + colChange]);
                return newJumpPoints;
            }
        
            /* Check directly below */
            if (grid.nodesMatrix[nextNode.row + 1][nextNode.column].isWall === true &&
                grid.nodesMatrix[nextNode.row + 1][nextNode.column + colChange].isWall === false)
            {
                newJumpPoints.push(nextNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row + 1][currentNode.column + colChange]);
                return newJumpPoints;
            }
        }

        /* Vertical movement */
        else 
        {
            /* Check directly left */
            if (grid.nodesMatrix[nextNode.row][nextNode.column - 1].isWall === true &&
                grid.nodesMatrix[nextNode.row + rowChange][nextNode.column - 1].isWall === false)
            {
                newJumpPoints.push(nextNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row + rowChange][currentNode.column - 1]);
                return newJumpPoints;
            }

            /* Check directly right */
            if (grid.nodesMatrix[nextNode.row][nextNode.column + 1].isWall === true &&
                grid.nodesMatrix[nextNode.row + rowChange][nextNode.column + 1].isWall === false)
            {
                newJumpPoints.push(nextNode);
                // newJumpPoints.push(grid.nodesMatrix[currentNode.row + rowChange][currentNode.column - 1]);
                return newJumpPoints;
            }
        }
    }

    /* No forced neighbor was found so continue searching */
    return newJumpPoints = newJumpPoints.concat(jump(grid, nextNode, rowChange, colChange, finishNode));
}

function jump2(grid, row, col, rowChange, colChange, finishNode)
{
    if (row < 0 || row > grid.rows - 1 || col < 0 || col > grid.columns - 1)
        return null;

    if (grid.nodesMatrix[row][col].isWall === true)
        return null;

    if (grid.nodesMatrix[row][col] === finishNode)
        return [row, col, rowChange, colChange];

    const nextRow = row + rowChange;
    const nextCol = col + colChange;

    if (nextRow < 0 || nextRow > grid.rows - 1 || nextCol < 0 || nextCol > grid.columns - 1)
        return null;

    // if (grid.nodesMatrix[nextRow][nextCol].isWall === true)
    //     return null;

    // grid.nodesMatrix[nextRow][nextCol].prevNode = grid.nodesMatrix[row][col];

    if (rowChange !== 0 && colChange !== 0)
    {
        // Prevent corner cutting
        // if (grid.nodesMatrix[row - rowChange][col + colChange].isWall === true &&
        //     grid.nodesMatrix[row - rowChange][col].isWall === false &&
        //     grid.nodesMatrix[row][col + colChange].isWall === false)
        //     return [nextRow, nextCol, -rowChange, colChange];
        //     // return [nextRow, nextCol];

        // if (grid.nodesMatrix[row + rowChange][col - colChange].isWall === true &&
        //     grid.nodesMatrix[row][col - colChange].isWall === false)
        //     return [nextRow, nextCol, rowChange, -colChange];
            // return [nextRow, nextCol];
        // JPS doesn't allow for corner cutting
        // if (grid.nodesMatrix[nextRow][col].isWall === true &&
        //     grid.nodesMatrix[row][nextCol].isWall === true)
        //     return null;

        // if (grid.nodesMatrix[nextRow][col].isWall === true &&
        //     grid.nodesMatrix[row][nextCol].isWall === false &&
        //     grid.nodesMatrix[nextRow + rowChange][col].isWall === false &&
        //     grid.nodesMatrix[nextRow + rowChange][nextCol].isWall === false)
        // {
        //     return [nextRow, nextCol, rowChange, -colChange];
        // }

        // if (grid.nodesMatrix[row][nextCol].isWall === true &&
        //     grid.nodesMatrix[nextRow][col].isWall === false &&
        //     grid.nodesMatrix[row][nextCol + colChange].isWall === false &&
        //     grid.nodesMatrix[nextRow][nextCol + colChange].isWall === false)
        // {
        //     return [nextRow, nextCol, -rowChange, colChange];
        // }

        // if (grid.nodesMatrix[row][nextCol].isWall === true &&
        //     grid.nodesMatrix[row][nextCol + colChange].isWall === false)
        //     return [row, col, -rowChange, colChange];

        // if (grid.nodesMatrix[nextRow][col].isWall === true &&
        //     grid.nodesMatrix[nextRow + rowChange][col].isWall === false)
        //     return [row, col, rowChange, -colChange];

        if (grid.nodesMatrix[row - rowChange][col + colChange].isWall === false &&
            grid.nodesMatrix[row - rowChange][col].isWall === true)
            return [row, col, -rowChange, colChange];

        if (grid.nodesMatrix[row + rowChange][col - colChange].isWall === false &&
            grid.nodesMatrix[row][col - colChange].isWall === true)
            return [row, col, rowChange, -colChange];

        if (jump2(grid, row, nextCol, 0, colChange, finishNode) !== null)
            return [row, col, 0, colChange];

        if (jump2(grid, nextRow, col, rowChange, 0, finishNode) !== null)
            return [row, col, rowChange, 0];
    }

    else 
    {
        /* Moving horizontally */
        if (colChange !== 0)
        {
            if (grid.nodesMatrix[row][nextCol].isWall === true)
                return null;

            if (row + 1 > grid.rows - 1)
                return null;

            /* Check for forced neighbors above the node */
            if (grid.nodesMatrix[row + 1][col].isWall === true &&
                grid.nodesMatrix[row + 1][nextCol].isWall === false)
            {
                console.log('A');
                console.log(grid.nodesMatrix[row][col]);
                return [row, col, rowChange, colChange];
            }

            if (row - 1 < 0)
                return null;

            /* Check for forced neighbors below the node */
            if (grid.nodesMatrix[row - 1][col].isWall === true &&
                grid.nodesMatrix[row - 1][nextCol].isWall === false)
            {
                console.log('B');
                console.log(grid.nodesMatrix[row][col]);
                return [row, col, rowChange, colChange];
            }
        }

        /* Moving vertically */
        else
        {
            if (grid.nodesMatrix[nextRow][col].isWall === true)
                return null;

            if (col + 1 > grid.columns - 1)
                return null;

            /* Check for forced neighbors right of the node */
            if (grid.nodesMatrix[row][col + 1].isWall === true &&
                grid.nodesMatrix[nextRow][col + 1].isWall === false)
            {
                console.log('C');
                console.log(grid.nodesMatrix[row][col]);
                return [row, col, rowChange, colChange];
            }

            if (col - 1 < 0)
                return null;

            /* Check for forced neighbors left of the node */
            if (grid.nodesMatrix[row][col - 1].isWall === true &&
                grid.nodesMatrix[nextRow][col - 1].isWall === false)
            {
                console.log('D');
                console.log(grid.nodesMatrix[row][col]);
                return [row, col, rowChange, colChange];
            }
        }
    }

    return jump2(grid, nextRow, nextCol, rowChange, colChange, finishNode);
}

function setPrevNodes(grid, startNode, endNode)
{
    // const rowDiff = endNode.row - startNode.row;
    // const colDiff = endNode.column - startNode.column;
    // const rowStep = rowDiff / Math.abs(rowDiff);
    // const colStep = colDiff / Math.abs(colDiff);
    // let row = endNode.row, col = endNode.column;

    // while (grid.nodesMatrix[row][col] !== endNode)
    // {
    //     grid.nodesMatrix[row][col].prevNode = grid.nodesMatrix[row + rowStep][col + colStep];
    //     row += rowStep;
    //     col += colStep;
    // }
    const rowChange = startNode.direction[0];
    const colChange = startNode.direction[1];
    const revRow = rowChange * -1;
    const revCol = colChange * -1;
    let currentNode = endNode;
    // console.log(startNode);
    // console.log(endNode);
    // console.log(grid.nodesMatrix[currentNode.row + revRow][currentNode.column + revCol]);
    while (currentNode !== startNode)
    {
        currentNode.prevNode = grid.nodesMatrix[currentNode.row + revRow][currentNode.column + revCol];
        currentNode = currentNode.prevNode;
    }
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
        {
            rowChange = rowDiff / Math.abs(rowDiff);
        }

        if (colDiff !== 0)
        {
            colChange = colDiff / Math.abs(colDiff);
        }

        while (currentNode.id !== jumpPoint.id)
        {
            shortestPath.push(currentNode);
            currentNode = grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + colChange];
        }
    }

    shortestPath.push(finishNode);

    return shortestPath;
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