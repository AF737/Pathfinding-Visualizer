'use strict';

export {jumpPointSearch3};

function jumpPointSearch3(grid, startNode, finishNode, cornerCutting) {
    const visitedNodes = [];
    visitedNodes.push(startNode);
    let jumpNodes = [];
    startNode.distanceFromStart = 0;
    startNode.heuristicDistance = getDistance(startNode, finishNode);
    startNode.totalDistance = startNode.distanceFromStart + startNode.heuristicDistance;
    jumpNodes.push(startNode);

    while (jumpNodes.length > 0) {
        sortNodesByDistance(jumpNodes);
        
        const closestJumpNode = jumpNodes.shift();

        if (closestJumpNode.isWall === true) {
            continue;
        }

        if (closestJumpNode === finishNode) {
            let closestNode = finishNode;
            const shortestPath = [];

            while (closestNode !== null) {
                shortestPath.unshift(closestNode);
                closestNode = closestNode.prevNode;
            }

            return [visitedNodes, shortestPath];
        }

        jumpNodes = jumpNodes.concat(getNewJumpNodes(grid, closestJumpNode, startNode, 
            finishNode, visitedNodes, cornerCutting));
    }

    return [visitedNodes, null];
}

function sortNodesByDistance(jumpNodes) {
    jumpNodes.sort((firstNode, secondNode) => 
        firstNode.totalDistance - secondNode.totalDistance);
}

function getNewJumpNodes(grid, closestNode, startNode, finishNode, visitedNodes, cornerCutting) {
    const initialJumpNodes = [];
    let newJumpNodes = [];

    if (closestNode === startNode) {
        const neighbors = getNeighbors(grid, startNode);

        for (let i = 0; i < neighbors.length; i++) {
            if (neighbors[i].isWall === true) {
                continue;
            }

            const jumpNode = JSON.parse(JSON.stringify(startNode));
            jumpNode.direction = getDirection(startNode, neighbors[i]);

            initialJumpNodes.push(jumpNode);
        }
    }

    else {
        initialJumpNodes.push(closestNode);
    }
    
    for (let i = 0; i < initialJumpNodes.length; i++) {
        const [rowChange, colChange] = initialJumpNodes[i].direction;

        if (rowChange !== 0 && colChange === 0) {
            newJumpNodes = newJumpNodes.concat(verticalSearch(grid, initialJumpNodes[i], 
                rowChange, finishNode, visitedNodes));
        }

        else if (rowChange === 0 && colChange !== 0) {
            newJumpNodes = newJumpNodes.concat(horizontalSearch(grid, initialJumpNodes[i],
                colChange, finishNode, visitedNodes));
        }

        else {
            newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, initialJumpNodes[i],
                rowChange, colChange, finishNode, visitedNodes, cornerCutting));
        }
    }

    return newJumpNodes;
}

function verticalSearch(grid, node, rowChange, finishNode, visitedNodes) {
    let newJumpNodes = [];

    /* Check if the next node in that direction is still on the grid */
    if (node.row + rowChange < 0 || node.row + rowChange > (grid.rows - 1)) {
        return newJumpNodes;
    }

    const firstChild = grid.nodesMatrix[node.row + rowChange][node.column];

    if (firstChild.isWall === true) {
        return newJumpNodes;
    }

    firstChild.isVisited = true;
    firstChild.prevNode = node;
    firstChild.distanceFromStart = node.distanceFromStart + getDistance(node, firstChild);
    firstChild.heuristicDistance = getDistance(firstChild, finishNode);
    firstChild.totalDistance = firstChild.distanceFromStart + firstChild.heuristicDistance;

    if (visitedNodes.includes(firstChild) === false) {
        visitedNodes.push(firstChild);
    }

    if (firstChild === finishNode) {
        newJumpNodes.push(firstChild);

        return newJumpNodes;
    }

    if (firstChild.row + rowChange < 0 || firstChild.row + rowChange > (grid.rows - 1)) {
        return newJumpNodes;
    }

    const secondChild = grid.nodesMatrix[firstChild.row + rowChange][firstChild.column];

    if (secondChild.isWall === true) {
        return newJumpNodes;
    }

    secondChild.isVisited = true;
    secondChild.prevNode = firstChild;
    secondChild.distanceFromStart = firstChild.distanceFromStart + 
        getDistance(firstChild, secondChild);
    secondChild.heuristicDistance = getDistance(secondChild, finishNode);
    secondChild.totalDistance = secondChild.distanceFromStart + secondChild.heuristicDistance;

    if (visitedNodes.includes(secondChild) === false) {
        visitedNodes.push(secondChild);
    }

    if (secondChild === finishNode) {
        newJumpNodes.push(secondChild);

        return newJumpNodes;
    }

    /* Check if there is a wall left of the first child, but not the second child */
    if (grid.nodesMatrix[firstChild.row][firstChild.column - 1].isWall === true &&
        grid.nodesMatrix[secondChild.row][secondChild.column - 1].isWall === false) {
            /* Add a new jump point that goes up (or down) and to the left. Then
                create a deep copy and change its direction so that firstChild isn't
                impacted */
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [rowChange, -1];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* Same thing for the right side */
    if (grid.nodesMatrix[firstChild.row][firstChild.column + 1].isWall === true &&
        grid.nodesMatrix[secondChild.row][secondChild.column + 1].isWall === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [rowChange, 1];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* If a diagonal jump node has been added then also add one that goes straight up
        or down to continue searching in the direction that we originally came from */
    if (newJumpNodes.length > 0) {
        const jumpNode = JSON.parse(JSON.stringify(firstChild));
        jumpNode.direction = [rowChange, 0];
        firstChild.isJumpPoint = true;
        
        newJumpNodes.push(jumpNode);
    }

    /* Continue searching the same direction using the current child as the new starting
        point */
    return newJumpNodes = newJumpNodes.concat(verticalSearch(grid, firstChild, rowChange,
        finishNode, visitedNodes));
}

function horizontalSearch(grid, node, colChange, finishNode, visitedNodes) {
    let newJumpNodes = [];

    if (node.column + colChange < 0 || node.column + colChange > (grid.columns - 1)) {
        return newJumpNodes;
    }

    const firstChild = grid.nodesMatrix[node.row][node.column + colChange];

    if (firstChild.isWall === true) {
        return newJumpNodes;
    }

    firstChild.isVisited = true;
    firstChild.prevNode = node;
    firstChild.distanceFromStart = node.distanceFromStart + getDistance(node, firstChild);
    firstChild.heuristicDistance = getDistance(firstChild, finishNode);
    firstChild.totalDistance = firstChild.distanceFromStart + firstChild.heuristicDistance;

    if (visitedNodes.includes(firstChild) === false) {
        visitedNodes.push(firstChild);
    }

    if (firstChild === finishNode) {
        newJumpNodes.push(finishNode);

        return newJumpNodes;
    }

    if (firstChild.column + colChange < 0 || 
        firstChild.column + colChange > (grid.columns - 1)) {
            return newJumpNodes;
    }

    const secondChild = grid.nodesMatrix[firstChild.row][firstChild.column + colChange];

    if (secondChild.isWall === true) {
        return newJumpNodes;
    }

    secondChild.isVisited = true;
    secondChild.prevNode = firstChild;
    secondChild.distanceFromStart = firstChild.distanceFromStart + 
        getDistance(firstChild, secondChild);
    secondChild.heuristicDistance = getDistance(secondChild, finishNode);
    secondChild.totalDistance = secondChild.distanceFromStart + secondChild.heuristicDistance;

    if (visitedNodes.includes(secondChild) === false) {
        visitedNodes.push(secondChild);
    }

    if (secondChild === finishNode) {
        newJumpNodes.push(secondChild);

        return newJumpNodes;
    }

    /* Check above the two nodes */
    if (grid.nodesMatrix[firstChild.row - 1][firstChild.column].isWall === true &&
        grid.nodesMatrix[secondChild.row - 1][secondChild.column].isWall === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [-1, colChange];
            firstChild.isJumpPoint = true;
            
            newJumpNodes.push(jumpNode);
    }

    /* Check below the two nodes */
    if (grid.nodesMatrix[firstChild.row + 1][firstChild.column].isWall === true &&
        grid.nodesMatrix[secondChild.row + 1][secondChild.column].isWall === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [1, colChange];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    if (newJumpNodes.length > 0) {
        const jumpNode = JSON.parse(JSON.stringify(firstChild));
        jumpNode.direction = [0, colChange];
        firstChild.isJumpPoint = true;

        newJumpNodes.push(jumpNode);
    }

    return newJumpNodes = newJumpNodes.concat(horizontalSearch(grid, firstChild, colChange,
        finishNode, visitedNodes));
}

function diagonalSearch(grid, node, rowChange, colChange, finishNode, visitedNodes, cornerCutting) {
    let newJumpNodes = [];

    if (node.row + rowChange < 0 || node.row + rowChange > (grid.rows - 1) ||
        node.column + colChange < 0 || node.column + colChange > (grid.columns - 1)) {
            return newJumpNodes;
    }

    const firstChild = grid.nodesMatrix[node.row + rowChange][node.column + colChange];

    if (firstChild.isWall === true) {
        return newJumpNodes;
    }

    /* Disallow corner cutting */
    if (cornerCutting === false && 
        grid.nodesMatrix[node.row + rowChange][node.column].isWall === true &&
        grid.nodesMatrix[node.row][node.column + colChange].isWall === true) {
            return newJumpNodes;
        }

    firstChild.isVisited = true;
    firstChild.prevNode = node;
    firstChild.distanceFromStart = node.distanceFromStart + getDistance(node, firstChild);
    firstChild.heuristicDistance = getDistance(firstChild, finishNode);
    firstChild.totalDistance = firstChild.distanceFromStart + firstChild.heuristicDistance;

    if (visitedNodes.includes(firstChild) === false) {
        visitedNodes.push(firstChild);
    }

    if (firstChild === finishNode) {
        newJumpNodes.push(firstChild);

        return newJumpNodes;
    }

    if (firstChild.row + rowChange < 0 || firstChild.row + rowChange > (grid.rows - 1) ||
        firstChild.column + colChange < 0 || firstChild.column + colChange > (grid.columns - 1)) {
            return newJumpNodes;
    }

    const secondChild = grid.nodesMatrix[firstChild.row + rowChange][firstChild.column + colChange];

    /* This can create a problem when the jump point is located at a position like this:
        +---+---+---+---+ j = jump point, x = impassable walls, we are moving up and to the
        | x | x | x |x/2| right so secondChild(where "x/2" stands) will be a wall therefore
        +---+---+---+---+ we will add no new jump point
        | x | x | 1 |   |
        +---+---+---+---+
        |   | j |   |   |
        +---+---+---+---+ */
    // if (secondChild.isWall === true) {
    // return newJumpNodes;
    // }

    if (secondChild.isWall === false) {
        secondChild.isVisited = true;
        secondChild.prevNode = firstChild;
        secondChild.distanceFromStart = firstChild.distanceFromStart + 
            getDistance(firstChild, secondChild);
        secondChild.heuristicDistance = getDistance(secondChild, finishNode);
        secondChild.totalDistance = secondChild.distanceFromStart + secondChild.heuristicDistance;

        if (visitedNodes.includes(secondChild) === false) {
            visitedNodes.push(secondChild);
        }

        if (secondChild === finishNode) {
            newJumpNodes.push(secondChild);

            return newJumpNodes;
        }
    }

    let horizontalSearchDone = false, verticalSearchDone = false;

    /* If there's a wall directly left or right of the current node, but not behind it then
        create a jump node by in the direction and then going in the reverse horizontal
        direction creating a zigzag line */
    if (grid.nodesMatrix[node.row][firstChild.column].isWall === true &&
        grid.nodesMatrix[node.row][secondChild.column].isWall === false &&
        grid.nodesMatrix[node.row][secondChild.column].isVisited === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [-rowChange, colChange];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* Do the same thing for above and below */
    if (grid.nodesMatrix[firstChild.row][node.column].isWall === true &&
        grid.nodesMatrix[secondChild.row][node.column].isWall === false &&
        grid.nodesMatrix[secondChild.row][node.column].isVisited === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [rowChange, -colChange];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* Do a horizontal search if no jump points were found */
    // if (newJumpNodes.length === 0) {
        newJumpNodes = newJumpNodes.concat(horizontalSearch(grid, firstChild, colChange, finishNode, visitedNodes));
        horizontalSearchDone = true;
    // }

    /* If the horizontal search didn't end in a new jump node then do a vertical search */
    // if (newJumpNodes.length === 0) {
        newJumpNodes = newJumpNodes.concat(verticalSearch(grid, firstChild, rowChange, finishNode, visitedNodes));
        verticalSearchDone = true;
    // }

    if (newJumpNodes.length > 0) {
        /* If there was no horizontal search then add a jump point for that */
        if (horizontalSearchDone === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [0, colChange];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
        }

        if (verticalSearchDone === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [rowChange, 0];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
        }

        /* Add a jump point that goes in the same direction that we came from */
        const jumpNode = JSON.parse(JSON.stringify(firstChild));
        jumpNode.direction = [rowChange, colChange];
        firstChild.isJumpPoint = true;

        newJumpNodes.push(jumpNode);
    }

    return newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, firstChild, rowChange, colChange, finishNode, visitedNodes));
}

function getNeighbors(grid, startNode) {
    const neighbors = [];
    let up = false, down = false, left = false, right = false;
    const row = startNode.row;
    const col = startNode.column;

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

function getDistance(parentNode, node) {
    const rowChange = Math.abs(parentNode.row - node.row);
    const colChange = Math.abs(parentNode.column - node.column);

    return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));
}

function getDirection(parentNode, node) {
    const direction = [];
    direction.push(node.row - parentNode.row);
    direction.push(node.column - parentNode.column);

    return direction;
}