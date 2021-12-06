'use strict';

export {dijkstra};

function dijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getUnvisitedNodes(grid);

    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) {
            return visitedNodes;
        }

        updateUnvisitedNeighbors(grid, closestNode);
    }
}

function getUnvisitedNodes(grid) {
    const unvisitedNodes = [];

    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.columns; col++) {
            unvisitedNodes.push(grid.nodesMatrix[row][col]);
        }
    }

    return unvisitedNodes;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((firstNode, secondNode) => 
        firstNode.distance - secondNode.distance);
}

function updateUnvisitedNeighbors(grid, node) {
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, node);

    for (let i = 0; i < unvisitedNeighbors.length; i++) {
        unvisitedNeighbors[i].distance = node.distance + 1;
        unvisitedNeighbors[i].prevNode = node;
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

    /* Only return the neighbors that haven't been visited yet */
    return neighbors.filter(neighbors.isVisited === false);
}