'use strict';

export default function jumpPointSearch(grid, startNode, finishNode) {
    const visitedNodes = [];
    visitedNodes.push(startNode);
    let jumpNodes = [];
    let initialJumpNodes = getNeighbors(grid, startNode);

    /* Setup all eight direct neighbors of the start node */
    for (let i = 0; i < initialJumpNodes.length; i++) {
        initialJumpNodes[i].direction = getDirection(startNode, initialJumpNodes[i]);
        initialJumpNodes[i].prevNode = startNode;
        initialJumpNodes[i].distanceFromStart = getDistance(startNode, initialJumpNodes[i]);
        initialJumpNodes[i].heuristicDistance = getDistance(initialJumpNodes[i], finishNode);
        initialJumpNodes[i].totalDistance = initialJumpNodes[i].distanceFromStart +
                                            initialJumpNodes[i].heuristicDistance;
    }

    jumpNodes = jumpNodes.concat(initialJumpNodes);

    while (jumpNodes.length > 0) {
        sortNodesByDistance(jumpNodes);
        
        const closestJumpNode = jumpNodes.shift();

        if (closestJumpNode.isWall === true) {
            continue;
        }

        if (closestJumpNode === finishNode) {
            let closestNode = finishNode;
            const shortestPath = [];

            /* Backtrack from start to finish to get the shortest path */
            while (closestNode !== null) {
                shortestPath.unshift(closestNode);
                closestNode = closestNode.prevNode;
            }

            return [visitedNodes, shortestPath];
        }

        jumpNodes = jumpNodes.concat(getNewJumpNodes(grid, closestJumpNode, finishNode, 
                    visitedNodes));
    }

    return [visitedNodes, null];
}

function sortNodesByDistance(jumpNodes) {
    jumpNodes.sort((firstNode, secondNode) => 
        firstNode.totalDistance - secondNode.totalDistance);
}

function getNewJumpNodes(grid, closestNode, finishNode, visitedNodes) {
    let newJumpNodes = [];
    const [rowChange, colChange] = closestNode.direction;

    if (rowChange !== 0 && colChange !== 0) {
        newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, closestNode,
                        rowChange, colChange, finishNode, visitedNodes));
    }

    else {
        newJumpNodes = newJumpNodes.concat(straightSearch(grid, closestNode,
                        rowChange, colChange, finishNode, visitedNodes));
    }

    return newJumpNodes;
}

/* Search horizontally or vertically */
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

    /* Check if the next node in the current direction is still on the grid */
    if (node.row + rowChange < 0 || node.row + rowChange > grid.rows - 1 ||
        node.column + colChange < 0 || node.column + colChange > grid.columns - 1) {
            return newJumpNodes;
    }

    const child = grid.nodesMatrix[node.row + rowChange][node.column + colChange];

    if (child.isWall === true) {
        return newJumpNodes;
    }

    child.isVisited = true;
    child.prevNode = node;
    child.distanceFromStart = node.distanceFromStart + getDistance(node, child);
    child.heuristicDistance = getDistance(child, finishNode);
    child.totalDistance = child.distanceFromStart + child.heuristicDistance;

    if (visitedNodes.includes(child) === false) {
        visitedNodes.push(child);
    }

    if (child === finishNode) {
        newJumpNodes.push(child);

        return newJumpNodes;
    }

    /* Moving vertically */
    if (rowChange !== 0) {
        /* Check if there is a wall directly left of the current node, but not its child */
        if (grid.nodesMatrix[node.row][node.column - 1].isWall === true &&
            grid.nodesMatrix[child.row][child.column - 1].isWall === false) {
                /* Add a new jump point that goes up (or down) and to the left. Then
                    create a deep copy and change its direction so that it's saved even
                    when the original node changes direction */
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [rowChange, -1];
                node.isJumpPoint = true;

                newJumpNodes.push(jumpNode);
        }

        /* Check if there is a wall directly right of the current node, but not its child */
        if (grid.nodesMatrix[node.row][node.column + 1].isWall === true &&
            grid.nodesMatrix[child.row][child.column + 1].isWall === false) {
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [rowChange, 1];
                node.isJumpPoint = true;

                newJumpNodes.push(jumpNode);
        }

        /* If a diagonal jump node has been added then also add one that goes straight up
            or down to continue searching in the direction that we originally were */
        if (newJumpNodes.length > 0) {
            const jumpNode = JSON.parse(JSON.stringify(node));
            jumpNode.direction = [rowChange, 0];
            node.isJumpPoint = true;
            
            newJumpNodes.push(jumpNode);
        }
    }

    /* Moving horizontally */
    if (colChange !== 0) {
        /* Check if there is a wall directly above the current node, but not its child */
        if (grid.nodesMatrix[node.row - 1][node.column].isWall === true &&
            grid.nodesMatrix[child.row - 1][child.column].isWall === false) {
                const jumpNode = JSON.parse(JSON.stringify(node));
                jumpNode.direction = [-1, colChange];
                node.isJumpPoint = true;
                
                newJumpNodes.push(jumpNode);
        }

        /* Check if there is a wall directly below the current node, but not its child */
        if (grid.nodesMatrix[node.row + 1][node.column].isWall === true &&
            grid.nodesMatrix[child.row + 1][child.column].isWall === false) {
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

    /* Continue searching in the same direction until a wall, the end of the grid or 
        the finish node is found */
    return newJumpNodes = newJumpNodes.concat(straightSearch(grid, child, rowChange,
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

    /* Check if the next node in the current direction is still on the grid */
    if (node.row + rowChange < 0 || node.row + rowChange > grid.rows - 1 ||
        node.column + colChange < 0 || node.column + colChange > grid.columns - 1) {
            return newJumpNodes;
    }

    const child = grid.nodesMatrix[node.row + rowChange][node.column + colChange];

    if (child.isWall === true) {
        return newJumpNodes;
    }

    child.isVisited = true;
    child.prevNode = node;
    child.distanceFromStart = node.distanceFromStart + getDirection(node, child);
    child.heuristicDistance = getDistance(child, finishNode);
    child.totalDistance = child.distanceFromStart + child.heuristicDistance;

    if (visitedNodes.includes(child) === false) {
        visitedNodes.push(child);
    }

    if (child === finishNode) {
        newJumpNodes.push(child);

        return newJumpNodes;
    }

    let horizontalSearchDone = false, verticalSearchDone = false;

    /* If there's a wall directly left or right of the current node, but not behind it then
        create a jump node at the position of the child node, but invert the vertical
        movement because that empty spot can't be reached any other way */ 
    if (grid.nodesMatrix[node.row][child.column].isWall === true &&
        grid.nodesMatrix[node.row][child.column + colChange].isWall === false &&
        grid.nodesMatrix[node.row][child.column + colChange].isVisited === false) {
            const jumpNode = JSON.parse(JSON.stringify(child));
            jumpNode.direction = [-rowChange, colChange];
            child.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* Do the same thing for above or below depending on if we move up or down */
    if (grid.nodesMatrix[child.row][node.column].isWall === true &&
        grid.nodesMatrix[child.row + rowChange][node.column].isWall === false &&
        grid.nodesMatrix[child.row + rowChange][node.column].isVisited === false) {
            const jumpNode = JSON.parse(JSON.stringify(child));
            jumpNode.direction = [rowChange, -colChange];
            child.isJumpPoint = true;

            newJumpNodes.push(jumpNode);
    }

    /* Do a horizontal search if no jump points were found */
    if (newJumpNodes.length === 0) {
        newJumpNodes = newJumpNodes.concat(straightSearch(grid, node, 0, colChange,
                        finishNode, visitedNodes));
        horizontalSearchDone = true;
    }

    /* Do a vertical search if the horizontal search didn't yield any jump points */
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

        /* Add another jump point that goes in the same direction that we were
            originally going in */
        const jumpNode = JSON.parse(JSON.stringify(node));
        jumpNode.direction = [rowChange, colChange];
        node.isJumpPoint = true;

        newJumpNodes.push(jumpNode);
    }

    /* Continue searching in the same direction until a wall, the end of the grid or 
        the finish node is found */
    return newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, child, rowChange,
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

/* Octile distance is used to check if moving diagonally has a smaller cost
    than moving in only four directions */
function getDistance(parentNode, node) {
    const rowChange = Math.abs(parentNode.row - node.row);
    const colChange = Math.abs(parentNode.column - node.column);

    return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));
}

function getDirection(parentNode, node) {
    return[node.row - parentNode.row, node.column - parentNode.column];
}