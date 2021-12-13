'use strict';

export {bidirectionalDijkstra};

function bidirectionalDijkstra(grid, startNode, finishNode) {
    const visitedNodesFromStart = [];
    const visitedNodesFromFinish = [];
    startNode.distanceFromStart = 0;
    finishNode.distanceFromFinish = 0;
    const unvisitedNodesFromStart = getUnvisitedNodes(grid);
    const unvisitedNodesFromFinish = getUnvisitedNodes(grid);

    while (unvisitedNodesFromStart.length > 0 &&
            unvisitedNodesFromFinish.length > 0) {
        sortNodesByDistanceFromStart(unvisitedNodesFromStart);
        sortNodesByDistanceFromFinish(unvisitedNodesFromFinish);
        let closestNodeFromStart = unvisitedNodesFromStart.shift();
        let closestNodeFromFinish = unvisitedNodesFromFinish.shift();
        
        while (closestNodeFromStart.isWall === true) {
            closestNodeFromStart = unvisitedNodesFromStart.shift();
        }

        while (closestNodeFromFinish.isWall === true) {
            closestNodeFromFinish = unvisitedNodesFromFinish.shift();
        }

        if (closestNodeFromStart.distanceFromStart === Infinity
            || closestNodeFromFinish.distanceFromFinish === Infinity) {
                return [visitedNodesFromStart, visitedNodesFromFinish, null];
        }

        closestNodeFromStart.isVisited = true;
        visitedNodesFromStart.push(closestNodeFromStart);
        closestNodeFromFinish.isVisited = true;
        visitedNodesFromFinish.push(closestNodeFromFinish);

        for (const elem of visitedNodesFromStart) {
            if (elem === closestNodeFromFinish) {
                let currentNode = closestNodeFromStart;
                const shortestPath = [];

                while (currentNode !== null) {
                    shortestPath.unshift(closestNodeFromStart);
                    currentNode = currentNode.prevNode;
                }

                currentNode = closestNodeFromFinish;

                while (currentNode !== null) {
                    shortestPath.push(currentNode);
                    currentNode = currentNode.prevNode;
                }

                return [visitedNodesFromStart, visitedNodesFromFinish, shortestPath];
            }
        }

        updateUnvisitedNeighbors(grid, closestNodeFromStart);
        updateUnvisitedNeighbors(grid, closestNodeFromFinish);
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

function sortNodesByDistanceFromStart(unvisitedNodesFromStart) {
    unvisitedNodesFromStart.sort((firstNode, secondNode) =>
        firstNode.distanceFromStart - secondNode.distanceFromStart);
}

function sortNodesByDistanceFromFinish(unvisitedNodesFromFinish) {
    unvisitedNodesFromFinish.sort((firstNode, secondNode) =>
        firstNode.distanceFromFinish - secondNode.distanceFromFinish);
}

function updateUnvisitedNeighbors(grid, node) {
    const neighbors = getUnvisitedNeighbors(grid, node);

    for (const neighbor of neighbors) {
        if (node.distanceFromStart !== Infinity) {
            neighbor.distanceFromStart = node.distanceFromStart + neighbor.weight;
            neighbor.prevNode = node;
        }

        else if (node.distanceFromFinish !== Infinity) {
            neighbor.distanceFromFinish = node.distanceFromFinish + neighbor.weight;
            neighbor.prevNode = node;
        }
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