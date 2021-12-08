'use strict';

export {dijkstra};

function dijkstra(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getUnvisitedNodes(grid);

    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.distance === Infinity) {
            return [visitedNodes, null];
        }

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) {
            let currentNode = finishNode;
            const shortestPath = [];
            
            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [visitedNodes, shortestPath];
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

    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + neighbor.weight;
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

    /* Only return the neighbors that haven't been visited yet */
    return neighbors.filter(checkUnvisited);
}

function checkUnvisited(neighbor) {
    return neighbor.isVisited === false;
}

/*function shortestPath(finishNode) {
    let currentNode = finishNode;
    const shortestPath = [];
    while (currentNode !== null) {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.prevNode;
    }
    return shortestPath;
}*/