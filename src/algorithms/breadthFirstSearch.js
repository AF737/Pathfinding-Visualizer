'use strict';

export {breadthFirstSearch};

function breadthFirstSearch(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.distanceFromStart = 0;
    const unvisitedNodes = getUnivistedNodes(grid);

    while (unvisitedNodes.length > 0) {
        sortNodesByDistanceFromStart(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.distanceFromStart === Infinity) {
            return [visitedNodes, null];
        }

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) {
            let currentNode = closestNode;
            let shortestPath = [];

            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [visitedNodes, shortestPath];
        }

        updateUnvisitedNeighbors(grid, closestNode);
    }
}

function getUnivistedNodes(grid) {
    const unvisitedNodes = [];

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.columns; col++) {
            unvisitedNodes.push(grid.nodesMatrix[row][col]);
        }
    }

    return unvisitedNodes;
}

function sortNodesByDistanceFromStart(unvisitedNodes) {
    unvisitedNodes.sort((firstNode, secondNode) =>
        firstNode.distanceFromStart - secondNode.distanceFromStart);
}

function updateUnvisitedNeighbors(grid, node) {
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, node);

    for (const neighbor of unvisitedNeighbors) {
        neighbor.distanceFromStart = node.distanceFromStart + node.weight +
            getDistance(node, neighbor);
        neighbor.prevNode = node;
    }
}

function getUnvisitedNeighbors(grid, node) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;

    if (row > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
    }

    if (row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
    }

    if (col > 0) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
    }

    if (col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
    }

    return neighbors.filter(checkUnvisited);
}

function checkUnvisited(neighbor) {
    return neighbor.isVisited === false;
}

/* Manhattan distance */
function getDistance(parentNode, node) {
    return (Math.abs(parentNode.row - node.row) + 
            Math.abs(parentNode.column - node.column));
}