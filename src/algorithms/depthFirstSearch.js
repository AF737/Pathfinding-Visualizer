'use strict';

export default function depthFirstSearch(grid, startNode, finishNode) {
    const visitedNodes = [];
    const nodesToCheck = [];
    startNode.distanceFromStart = 0;
    startNode.isVisited = true;
    visitedNodes.push(startNode);
    nodesToCheck.push(startNode);

    while (nodesToCheck.length > 0) {
        /* Always check the last node of the array, because this algorithm explores
            every direction until it meets a dead end */
        const currentNode = nodesToCheck.pop();

        if (currentNode.isWall === true) {
            continue;
        }
        
        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === finishNode) {
            let pathNode = finishNode;
            const path = [];

            /* Backtrack from finish to start node */
            while (pathNode !== null) {
                path.unshift(pathNode);
                pathNode = pathNode.prevNode;
            }

            return [visitedNodes, path];
        }

        /* Add the unvisited neighbors to the array */
        nodesToCheck.push.apply(nodesToCheck, updateUnvisitedNeighbors(grid, currentNode));
    }

    /* If we exited the while loop then the start and/or finish node is completely
        surrounded by walls and thereby unreachable. Then there's no path to connect both
        nodes so return null */
    return [visitedNodes, null];
}

function updateUnvisitedNeighbors(grid, node) {
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, node);

    /* Set the previous node of all neighbors to the node that
        we found them from so that we can backtrack from the
        finish node to the start node for the path */
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distanceFromStart = node.distanceFromStart + neighbor.weight;
        neighbor.prevNode = node;
    }

    return unvisitedNeighbors;
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