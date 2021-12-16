'use strict';

export {jumpPointSearch2};

function jumpPointSearch2(grid, startNode, finishNode) {
    const closedList = [];
    const openList = [];
    startNode.distanceFromStart = 0;
    openList.push(startNode);

    while (openList.length > 0) {
        sortNodesByDistance(openList);
        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.distanceFromStart === Infinity) {
            return [closedList, null];
        }

        if (closestNode === finishNode) {
            let currentNode = finishNode;
            const shortestPath = [];

            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevnode;
            }

            return [closedList, shortestPath];
        }

        updateNeighbors(grid, closestNode, finishNode, openList, closedList);
    }

    /* Just for testing purposes */
    return [closedList, null];
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) => 
        firstNode.distanceFromStart - secondNode.distanceFromStart);
}

function updateNeighbors(grid, node, finishNode, openList, closedList) {
    const neighbors = getNeighbors(grid, node);

    for (const neighbor of neighbors) {
        if (neighbor.isWall === true) {
            continue;
        }

        //let successors = [];

        neighbor.prevNode = node;
        neighbor.isVisited = true;
        const [rowChange, colChange] = getDirection(node, neighbor);
        //console.log(`${rowChange}, ${colChange}`);

        if (rowChange === 0 && colChange !== 0) {
            let newJumpNodes = [];

            while (newJumpNodes.length === 0 && neighbor.column > 1 && neighbor.column < (grid.columns - 2)) {
                console.log(newJumpNodes.length);
                newJumpNodes = horizontalSearch(grid, neighbor, finishNode, colChange, openList);
                //console.log(newJumpNodes);
                openList = openList.concat(newJumpNodes);
                //successors = successors.concat(newJumpNodes);
                //console.log(`openList: ${openList.length}`);
                neighbor.column += colChange;
            }

            //openList = openList.concat(newJumpNodes);
        }

        else if (rowChange !== 0 && colChange === 0) {
            let newJumpNodes = [];

            while(newJumpNodes.length === 0 && neighbor.row > 1 && neighbor.row < (grid.rows - 2)) {
                newJumpNodes = verticalSearch(grid, neighbor, finishNode, rowChange. openList);
                openList = openList.concat(newJumpNodes);
                //successors = successors.concat(newJumpNodes);
                neighbor.row += rowChange;
            }
        }

        else if (rowChange !== 0 && colChange !== 0) {
            let newJumpNodes = [];

            while(newJumpNodes.length === 0 && neighbor.row > 1 && neighbor.row < (grid.rows - 2) && neighbor.column > 1 &&
                    neighbor.column < (grid.columns - 2)) {
                newJumpNodes = diagonalSearch(grid, neighbor, finishNode, rowChange, colChange, openList);
                openList = openList.concat(newJumpNodes);
                //successors = successors.concat(newJumpNodes);
                neighbor.row += rowChange;
                neighbor.column += colChange;
            }
        }

        /*for (const successor in successors) {
            successor.prevNode = neighbor;
        }

        console.log(successors);*/
    }

    console.log(openList);
}

function getNeighbors(grid, node) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, right = false, left = false;

    if (row > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
        up = true;
    }

    if (row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
        down = true;
    }

    if (col > 0) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
        left = true;
    }

    if (col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
        right = true;
    }

    if (up === true && right === true) {
        neighbors.push(grid.nodesMatrix[row - 1][col + 1]);
    }

    if (up === true && left === true) {
        neighbors.push(grid.nodesMatrix[row - 1][col - 1]);
    }

    if (down === true && right === true) {
        neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
    }

    if (down === true && left === true) {
        neighbors.push(grid.nodesMatrix[row + 1][col - 1]);
    }

    return neighbors;
}

function getDirection(prevNode, node) {
    return [node.row - prevNode.row, node.column - prevNode.column];
}

function horizontalSearch(grid, parentNode, finishNode, colChange, openList) {
    const newJumpNodes = [];

    /* If we are at the left or right edge of the grid */
    if (parentNode.column + colChange < 1 || 
        parentNode.column + colChange > (grid.columns - 2)) {
        return newJumpNodes;
    }

    const childNode = grid.nodesMatrix[parentNode.row][parentNode.column + colChange];
    
    if (childNode.isWall === true) {
        return newJumpNodes;
    }

    childNode.isVisited = true;
    childNode.prevNode = parentNode;
    childNode.distanceFromStart = parentNode.distanceFromStart + getDistance(parentNode, childNode);
    openList.push(childNode);

    if (childNode === finishNode) {
        newJumpNodes.push(childNode);

        return newJumpNodes;
    }

    const childRow = childNode.row;
    const childCol = childNode.column;

    /* Check if the first node that we visited was the left or right edge of the grid */
    if (childCol + colChange < 0 || childCol + colChange > (grid.columns - 1)) {
        return newJumpNodes;
    }

    /* The second node from the parent node if we move in the same direction as we did
        before */
    const nextNode = grid.nodesMatrix[childRow][childCol + colChange];
    nextNode.isVisited = true;
    openList.push(nextNode);
    //console.log(`${parentNode.id}, ${childNode.id}, ${nextNode.id}`);
    /* If the node directly below our first visited node is a wall but the node either right
        or left of the wall is empty then we need to add our child node to the open list as there
        is no other way to reach the node behind the wall but through this current node */
    if (grid.nodesMatrix[childRow + 1][childCol].isWall === true &&
        grid.nodesMatrix[childRow + 1][nextNode.column].isWall === false) {
            /* Turn the node into a jump point by saving the direction that we have to move in
                to get to otherwise inaccessible nodes. Move diagonally from this node to reach
                the inaccessible node */
            childNode.direction = [1, colChange];
            newJumpNodes.push(childNode);
    }

    if (grid.nodesMatrix[childRow - 1][childCol].isWall === true &&
        grid.nodesMatrix[childRow - 1][nextNode.column].isWall === false) {
            childNode.direction = [-1, colChange];
            newJumpNodes.push(childNode);
    }

    if (newJumpNodes.length > 0) {
        /* Only save the move straight forward if there are intersting nodes diagonally */
        childNode.direction = [0, colChange];
        newJumpNodes.push(childNode);
    }
    
    //return horizontalSearch(grid, childNode, finishNode, colChange);
    return newJumpNodes;
}

function verticalSearch(grid, parentNode, finishNode, rowChange, openList) {
    const newJumpNodes = [];

    if ((parentNode.row + rowChange) < 1 || (parentNode.row + rowChange) > (grid.rows - 2)) {
        return newJumpNodes;
    }

    const childNode = grid.nodesMatrix[parentNode.row + rowChange][parentNode.column];

    if (childNode.isWall === true) {
        return newJumpNodes;
    }

    childNode.isVisited = true;
    childNode.prevNode = parentNode;
    childNode.distanceFromStart = parentNode.distanceFromStart + getDistance(parentNode, childNode);
    openList.push(childNode);

    if (childNode === finishNode) {
        newJumpNodes.push(childNode);

        return newJumpNodes;
    }

    const childRow = childNode.row;
    const childCol = childNode.column;

    if ((childRow + rowChange) < 0 || (childRow + rowChange) > (grid.rows - 1)) {
        return newJumpNodes;
    }

    const nextNode = grid.nodesMatrix[childRow + rowChange][childCol];
    nextNode.isVisited = true;
    openList.push(nextNode);

    if (grid.nodesMatrix[childRow][childCol + 1].isWall === true &&
        grid.nodesMatrix[nextNode.row][childCol + 1].isWall === false) {
        childNode.direction = [rowChange, 1];
        newJumpNodes.push(childNode);
    }

    if (grid.nodesMatrix[childRow][childCol - 1].isWall === true &&
        grid.nodesMatrix[nextNode.row][childCol - 1].isWall === false) {
        childNode.direction = [rowChange, -1];
        newJumpNodes.push(childNode);
    }

    if (newJumpNodes.length > 0) {
        childNode.direction = [rowChange, 0];
        newJumpNodes.push(childNode);
    }

    //return verticalSearch(grid, childNode, finishNode, rowChange);
    return newJumpNodes;
}

function diagonalSearch(grid, parentNode, finishNode, rowChange, colChange, openList) {
    const newJumpNodes = [];
    const parentRow = parentNode.row;
    const parentCol = parentNode.column;

    if ((parentRow + rowChange) < 1 || (parentRow + rowChange) > (grid.rows - 2) ||
        (parentCol + colChange) < 1 || (parentCol + colChange) > (grid.columns - 2)) {
        return newJumpNodes;
    }

    const childNode = grid.nodesMatrix[parentRow + rowChange][parentCol + colChange];

    if (childNode.isWall === true) {
        return newJumpNodes;
    }

    childNode.isVisited = true;
    childNode.prevNode = parentNode;
    childNode.distanceFromStart = parentNode.distanceFromStart + getDistance(parentNode, childNode);
    openList.push(childNode);

    if (childNode === finishNode) {
        newJumpNodes.push(childNode);
        
        return newJumpNodes;
    }

    const childRow = childNode.row;
    const childCol = childNode.column;

    if ((childRow + rowChange) < 0 || (childRow + rowChange) > (grid.rows - 1) ||
        (childCol + colChange) < 0 || (childCol + colChange) > (grid.columns - 1)) {
        return newJumpNodes;
    }

    const nextNode = grid.nodesMatrix[childRow + rowChange][childCol + colChange];
    nextNode.isVisited = true;
    openList.push(nextNode);

    /* If there's a wall right directly left or right of our currently visited node, then
        check if the node above or below it is a wall. If it isn't then create a new jump
        point that jumps in the opposite horizontal direction as the currently visited node
        so that we have a zigzag jump from the parent node to this new node */
    if (grid.nodesMatrix[parentRow][childCol].isWall === true &&
        grid.nodesMatrix[parentRow][nextNode.column].isWall === false) {
        childNode.direction = [rowChange, -colChange];
        newJumpNodes.push(childNode);
    }

    if (grid.nodesMatrix[childRow][parentCol].isWall === true &&
        grid.nodesMatrix[nextNode.column][parentCol].isWall === false) {
        childNode.direction = [-rowChange, colChange];
        newJumpNodes.push(childNode);
    }

    let horDone = false;
    let vertDone = false;

    if (newJumpNodes.length === 0) {
        const horizontalJumpNodes = horizontalSearch(grid, childNode, finishNode, colChange, openList);
        horDone = true;

        if (horizontalJumpNodes.length > 0) {
            const jumpNode = getNodeFromArray(horizontalJumpNodes, childNode, [0, colChange]);
    
            for (horNode in horizontalJumpNodes) {
                horNode.prevNode = jumpNode;
            }
    
            newJumpNodes.push(jumpNode);
        }
    }

    if (newJumpNodes.length === 0) {
        const verticalJumpNodes = verticalSearch(grid, childNode, finishNode, rowChange, openList);
        vertDone = true;

        if (verticalJumpNodes.length > 0) {
            const jumpNode = getNodeFromArray(verticalJumpNodes, childNode, [rowChange, 0]);
    
            for (vertNode in verticalJumpNodes) {
                vertNode.prevNode = jumpNode;
            }
    
            newJumpNodes.push(jumpNode);
        }
    }

    if (newJumpNodes.length > 0) {
        if (horDone === false) {
            childNode.direction = [0, colChange];
            newJumpNodes.push(childNode);
        }

        if (vertDone === false) {
            childNode.direction = [rowChange, 0];
            newJumpNodes.push(childNode);
        }

        childNode.direction = [rowChange, colChange];
        newJumpNodes.push(childNode);
    }

    //return diagonalSearch(grid, childNode, finishNode, rowChange, colChange);
    return newJumpNodes;
}

function getDistance(parentNode, childNode) {
    return Math.sqrt(Math.pow((parentNode.row - childNode.row), 2) +
            Math.pow((parentNode.column - childNode.column), 2));
}

function getNodeFromArray(array, node, direction) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === node && direction === node.direction) {
            return array[i];
        }
    }
}