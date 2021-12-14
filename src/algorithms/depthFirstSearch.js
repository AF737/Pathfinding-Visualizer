'use strict';

export {depthFirstSearch};

function depthFirstSearch(grid, startNode, finishNode) {
    const visitedNodes = [];
    const nodesToCheck = [];
    startNode.isVisited = true;
    visitedNodes.push(startNode);
    nodesToCheck.push(startNode);

    while (nodesToCheck.length > 0) {
        const closestNode = nodesToCheck.pop();

        if (closestNode.isWall === true) {
            continue;
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

        nodesToCheck.push(getUnvisitedNeighbors(grid, closestNode));
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