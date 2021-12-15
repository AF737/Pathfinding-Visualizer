'use strict';

/* https://web.archive.org/web/20140310022652/https://zerowidth.com/2013/05/05/jump-point-search-explained.html 
    http://users.cecs.anu.edu.au/~dharabor/data/papers/harabor-grastien-aaai11.pdf 
    https://www.gamedev.net/tutorials/programming/artificial-intelligence/jump-point-search-fast-a-pathfinding-for-uniform-cost-grids-r4220/ */

/* No weights */
    function jumpPointSearch(grid, startNode, finishNode) {
    const closedList = [];
    startNode.distanceFromStart = 0;
    const openList = [];
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
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        //updateNeighbors(grid, closestNode, finishNode, openList, closedList);
        calculateJump(grid, closestNode, finishNode, openList, closedList);
    }
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

function horizontalSearch(grid, node, finishNode, direction) {
    let currentNode = grid.nodesMatrix[node.row][node.column];
    let currentRow = currentNode.row;
    let currentCol = currentNode.column;

    while (currentCol > 0 && currentCol < grid.columns) {
        currentCol += direction;
        currentNode = grid.nodesMatrix[currentRow][currentCol];
        currentNode.distance += currentNode.weight;
        currentNode.heuristicDistance = getHeuristicDistance(currentNode, finishNode);
        currentNode.totalDistance = currentNode.distance +
            currentNode.heuristicDistance;
        currentNode.prevNode = node;

        if (direction === 1) {
            currentNode.direction = 'right';
        }

        else if (direction === -1){
            currentNode.direction = 'left';
        }

        grid.nodesMatrix[currentRow][currentCol] = currentNode;

        if (currentNode === finishNode) {
            return finishNode;
        }

        let predecessorNode = grid.nodesMatrix[currentRow][currentCol + direction];
        let predecessorRow = predecessorNode.row;
        let predecessorCol = predecessorNode.column;
        let nodesToCheck = [];

        if (predecessorCol < 0 || predecessorCol > grid.columns) {
            return null;
        }

        /* Above the current node is a wall */
        if (grid.nodesMatrix[currentRow - 1][currentCol].isWall === true &&
            grid.nodesMatrix[predecessorRow - 1][predecessorCol].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        /* Below the current node is a wall */
        if (grid.nodesMatrix[currentRow + 1][currentCol].isWall === true &&
            grid.nodesMatrix[predecessorRow + 1][predecessorCol].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        if (nodesToCheck.length > 0) {
            return nodesToCheck;
        }

        else {
            return null;
        }
    }
}

function verticalSearch(grid, node, finishNode, direction) {
    let currentNode = node;
    let currentRow = currentNode.row;
    let currentCol = currentNode.column;

    while (currentRow > 0 && currentRow < grid.rows) {
        currentRow += direction;
        currentNode = grid.nodesMatrix[currentRow][currentCol];
        currentNode.distance += currentNode.weight;
        currentNode.heuristicDistance = getHeuristicDistance(currentNode, finishNode);
        currentNode.totalDistance = currentNode.distance + 
            currentNode.heuristicDistance;
        currentNode.prevNode = node;
        
        if (direction === 1) {
            currentNode.direction = 'down';
        }

        else if (direction === -1) {
            currentNode.direction = 'up';
        }

        grid.nodesMatrix[currentRow][currentCol] = currentNode;

        if (currentNode === finishNode) {
            return finishNode;
        }

        let predecessorNode = grid.nodesMatrix[currentRow + direction][currentCol];
        let predecessorRow = predecessorNode.row;
        let predecessorCol = predecessorNode.column;
        let nodesToCheck = [];

        if (grid.nodesMatrix[currentRow][currentCol - 1].isWall === true &&
            grid.nodesMatrix[predecessorRow][predecessorCol - 1].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        if (grid.nodesMatrix[currentRow][currentCol + 1].isWall === true &&
            grid.nodesMatrix[predecessorRow][predecessorCol + 1].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        if (nodesToCheck.length > 0) {
            return nodesToCheck;
        }

        else {
            return null;
        }
    }
}

/* Euclidean distance because we can move in eight directions */
function getHeuristicDistance(node, finishNode) {
    return Math.sqrt(Math.pow((node.row - finishNode.row), 2) +
                    (Math.pow((node.column - finishNode.column), 2)));
}

function calculateJump(grid, node, finishNode, openList, closedList) {
    const neighbors = [];
    let direction = null;
    const prevNode = node.prevNode;

    /* This only happens if the node is the start node (i.e. first iteration of JPS) */
    if (prevNode === null) {
        neighbors = getNeighbors(grid, node, direction);
    }

    else if (prevNode !== null) {
        if (prevNode.row < node.row) {
            if (prevNode.column === node.column) {
                direction = 'right';
            }

            else if (prevNode.column > node.column) {
                direction = 'up-right';
            }

            else {
                direction = 'down-right';
            }
        }

        else if (prevNode.row === node.row) {
            if (prevNode.column > node.column) {
                direction = 'up';
            }

            else {
                direction = 'down';
            }
        }

        else {
            if (prevNode.column === node.column) {
                direction = 'left';
            }

            else if (prevNode.column < node.column) {
                direction = 'up-left';
            }

            else {
                direction = 'down-left';
            }
        }

        neighbors = getNeighbors(grid, node, direction);

        while (neighbors.isWall === false && neighbors.row > 0 &&
                neighbors.row < grid.rows && neighbors.column > 0 &&
                neighbors.column < grid.columns) {
            neighbors.push(getNeighbors(grid, neighbors, direction));
        }
    }
}

function getNeighbors(grid, node, direction) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;

    if (direction === 'up' || row > 0) {
        neighbors.push(grid.nodesMatix[row - 1][col]);
    }

    if (direction === 'down' || row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
    }

    if (direction === 'left' || col > 0) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
    }

    if (direction === 'right' || col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
    }

    /* Left upper node */
    if (direction === 'up-left' || (row > 0 && col > 0)) {
        neighbors.push(grid.nodesMatrix[row - 1][col - 1]);
    }

    /* Right upper node */
    if (direction === 'up-right' || (row > 0 && col < (grid.columns - 1))) {
        neighbors.push(grid.nodesMatrix[row - 1][col + 1]);
    }

    /* Right lower node */
    if (direction === 'down-right' || (row < (grid.rows - 1) && col < (grid.columns - 1))) {
        neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
    }

    /* Left lower node */
    if (direction === 'down-left' || (row < (grid.rows - 1) && col > 0)) {
        neighbors.push(grid.nodesMatrix[row + 1][col - 1]);
    }

    return neighbors;
}