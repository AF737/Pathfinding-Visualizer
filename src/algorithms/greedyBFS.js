'use strict';

export {greedyBFS};

function greedyBFS(grid, startNode, finishNode) {
    const visitedNodes = [];
    const nodesToCheck = [];
    startNode.heuristicDistance = getHeuristicDistance(startNode, finishNode);
    nodesToCheck.push(startNode);

    while (nodesToCheck.length > 0) {
        sortNodesByDistance(nodesToCheck);
        const closestNode = nodesToCheck.shift();
        
        if (closestNode.isWall === true) {
            continue;
        }

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) {
            let currentNode = finishNode;
            const path = [];

            while (currentNode !== null) {
                path.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [visitedNodes, path];
        }

        updateUnvisitedNeighbors(grid, closestNode, finishNode, nodesToCheck);
    }

    /* If we exited the while loop then the start and/or finish node is completely
        surrounded by walls and thereby unreachable. Then there's no path to connect both
        nodes so return null */
    return [visitedNodes, null];
}

function sortNodesByDistance(nodesToCheck) {
    /* The node with the estimated shortest path to the finish node will be at
        the first place of this array */
    nodesToCheck.sort((firstNode, secondNode) =>
        firstNode.heuristicDistance - secondNode.heuristicDistance);
}

function updateUnvisitedNeighbors(grid, node, finishNode, nodesToCheck) {
    const neighbors = getUnvisitedNeighbors(grid, node);

    for (const neighbor of neighbors) {
        neighbor.isVisited = true;
        /* Takes the weight of the current node into account */
        neighbor.heuristicDistance = neighbor.weight + getHeuristicDistance(neighbor, finishNode);
        neighbor.prevNode = node;
        nodesToCheck.push(neighbor);
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

    /* Only retun the neighbors that haven't been visited yet */
    return neighbors.filter(checkUnvisited);
}

function checkUnvisited(neighbor) {
    return neighbor.isVisited === false;
}

/* The Manhattan distance is used, because the algorithm can only move in
    four directions (up, down, left and right) */
function getHeuristicDistance(node, finishNode) {
    return (Math.abs(node.row - finishNode.row) + Math.abs(node.column - finishNode.column));
}