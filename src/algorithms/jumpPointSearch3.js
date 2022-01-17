'use strict';

export {jumpPointSearch3};

function jumpPointSearch3(grid, startNode, finishNode) {
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
            finishNode, visitedNodes));
    }

    return [visitedNodes, null];
}

function sortNodesByDistance(jumpNodes) {
    jumpNodes.sort((firstNode, secondNode) => 
        firstNode.totalDistance - secondNode.totalDistance);
}

function getNewJumpNodes(grid, closestNode, startNode, finishNode, visitedNodes) {
    let initialJumpNodes = [];
    let newJumpNodes = [];

    if (closestNode === startNode) {
        initialJumpNodes = getNeighbors(grid, startNode);

        for (let i = 0; i < initialJumpNodes.length; i++) {
            initialJumpNodes[i].direction = getDirection(startNode, initialJumpNodes[i]);
            initialJumpNodes[i].prevNode = startNode;
        }
    }

    else {
        initialJumpNodes.push(closestNode);
    }
    
    for (let i = 0; i < initialJumpNodes.length; i++) {
        if (initialJumpNodes[i].isWall === true) {
            continue;
        }

        const [rowChange, colChange] = initialJumpNodes[i].direction;

        if (rowChange !== 0 && colChange !== 0) {
            newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, initialJumpNodes[i],
                            rowChange, colChange, finishNode, visitedNodes));
        }

        else {
            newJumpNodes = newJumpNodes.concat(straightSearch(grid, initialJumpNodes[i],
                            rowChange, colChange, finishNode, visitedNodes));
        }
    }

    return newJumpNodes;
}

/* Search horizontally and vertically */
function straightSearch(grid, node, rowChange, colChange, finishNode, visitedNodes) {
    let newJumpNodes = [];

    if (node.isWall === true) {
        return newJumpNodes;
    }

    node.isVisited = true;

    if (visitedNodes.includes(node) === false) {
        visitedNodes.push(node);
    }

    if (node === finishNode) {
        newJumpNodes.push(node);

        return newJumpNodes;
    }

    if (node.row + rowChange < 0 || node.row + rowChange > grid.rows - 1 ||
        node.column + colChange < 0 || node.column + colChange > grid.columns - 1) {
            return newJumpNodes;
    }

    const firstChild = grid.nodesMatrix[node.row + rowChange][node.column + colChange];

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

    if (rowChange !== 0) {
        /* Check if there is a wall left of the first child, but not the second child */
        if (grid.nodesMatrix[node.row][node.column - 1].isWall === true &&
            grid.nodesMatrix[firstChild.row][firstChild.column - 1].isWall === false) {
                /* Add a new jump point that goes up (or down) and to the left. Then
                    create a deep copy and change its direction so that firstChild isn't
                    impacted */
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [rowChange, -1];
                node.isJumpPoint = true;

                newJumpNodes.push(jumpNode);
        }

        /* Same thing for the right side */
        if (grid.nodesMatrix[node.row][node.column + 1].isWall === true &&
            grid.nodesMatrix[firstChild.row][firstChild.column + 1].isWall === false) {
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [rowChange, 1];
                node.isJumpPoint = true;

                newJumpNodes.push(jumpNode);
        }

        /* If a diagonal jump node has been added then also add one that goes straight up
            or down to continue searching in the direction that we originally came from */
        if (newJumpNodes.length > 0) {
            const jumpNode = JSON.parse(JSON.stringify(node));
            jumpNode.direction = [rowChange, 0];
            node.isJumpPoint = true;
            
            newJumpNodes.push(jumpNode);
        }
    }

    if (colChange !== 0) {
        /* Check above the two nodes */
        if (grid.nodesMatrix[node.row - 1][node.column].isWall === true &&
            grid.nodesMatrix[firstChild.row - 1][firstChild.column].isWall === false) {
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [-1, colChange];
                node.isJumpPoint = true;
                
                newJumpNodes.push(jumpNode);
        }

        /* Check below the two nodes */
        if (grid.nodesMatrix[node.row + 1][node.column].isWall === true &&
            grid.nodesMatrix[firstChild.row + 1][firstChild.column].isWall === false) {
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [1, colChange];
                node.isJumpPoint = true;

                newJumpNodes.push(jumpNode);
        }

        if (newJumpNodes.length > 0) {
            const jumpNode = JSON.parse(JSON.stringify(node));
            jumpNode.direction = [0, colChange];
            node.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
        }
    }

    return newJumpNodes = newJumpNodes.concat(straightSearch(grid, firstChild, rowChange,
                            colChange, finishNode, visitedNodes));
}

function diagonalSearch(grid, node, rowChange, colChange, finishNode, visitedNodes) {
    let newJumpNodes = [];

    if (node.isWall === true) {
        return newJumpNodes;
    }

    node.isVisited = true;

    if (visitedNodes.includes(node) === false) {
        visitedNodes.push(node);
    }

    if (node === finishNode) {
        newJumpNodes.push(node);

        return newJumpNodes;
    }

    if (node.row + rowChange < 0 || node.row + rowChange > grid.rows - 1 ||
        node.column + colChange < 0 || node.column + colChange > grid.columns - 1) {
            return newJumpNodes;
    }

    const firstChild = grid.nodesMatrix[node.row + rowChange][node.column + colChange];

    if (firstChild.isWall === true) {
        return newJumpNodes;
    }

    firstChild.isVisited = true;
    firstChild.prevNode = node;
    firstChild.distanceFromStart = node.distanceFromStart + getDirection(node, firstChild);
    firstChild.heuristicDistance = getDistance(firstChild, finishNode);
    firstChild.totalDistance = firstChild.distanceFromStart + firstChild.heuristicDistance;

    if (visitedNodes.includes(firstChild) === false) {
        visitedNodes.push(firstChild);
    }

    if (firstChild === finishNode) {
        newJumpNodes.push(firstChild);

        return newJumpNodes;
    }

    let horizontalSearchDone = false, verticalSearchDone = false;

    /* If there's a wall directly left or right of the current node, but not behind it then
        create a jump node by in the direction and then going in the reverse horizontal
        direction creating a zigzag line */ 
    if (grid.nodesMatrix[node.row][firstChild.column].isWall === true &&
        grid.nodesMatrix[node.row][firstChild.column + colChange].isWall === false &&
        grid.nodesMatrix[node.row][firstChild.column + colChange].isVisited === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [-rowChange, colChange];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* Do the same thing for above and below */
    if (grid.nodesMatrix[firstChild.row][node.column].isWall === true &&
        grid.nodesMatrix[firstChild.row + rowChange][node.column].isWall === false &&
        grid.nodesMatrix[firstChild.row + rowChange][node.column].isVisited === false) {
            const jumpNode = JSON.parse(JSON.stringify(firstChild));
            jumpNode.direction = [rowChange, -colChange];
            firstChild.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    if (newJumpNodes.length === 0) {
        newJumpNodes = newJumpNodes.concat(straightSearch(grid, node, 0, colChange,
                        finishNode, visitedNodes));
        horizontalSearchDone = true;
    }

    if (newJumpNodes.length === 0) {
        newJumpNodes = newJumpNodes.concat(straightSearch(grid, node, rowChange, 0,
                        finishNode, visitedNodes));
        verticalSearchDone = true;
    }

    if (newJumpNodes.length > 0) {
        if (horizontalSearchDone === false) {
            const jumpNode = JSON.parse(JSON.stringify(node));
            jumpNode.direction = [0, colChange];
            node.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
        }

        if (verticalSearchDone === false) {
            const jumpNode = JSON.parse(JSON.stringify(node));
            jumpNode.direction = [rowChange, 0];
            node.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
        }

        const jumpNode = JSON.parse(JSON.stringify(node));
        jumpNode.direction = [rowChange, colChange];
        node.isJumpPoint = true;

        newJumpNodes.push(jumpNode);
    }

    return newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, firstChild, rowChange,
                            colChange, finishNode, visitedNodes));
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