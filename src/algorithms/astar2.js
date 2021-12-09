'use strict';

export {astar2};

function astar2(grid, startNode, finishNode) {
    const closedList = [];
    startNode.distance = 0;
    const openList = [];
    openList.push(startNode);

    while (openList.length > 0) {
        sortNodesByDistance(openList);
        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.distance === Infinity) {
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

        const neighbors = getNeighbors(grid, closestNode);

        for (const neighbor of neighbors) {
            if (closedList.includes(neighbor) === true || neighbor.isWall === true) {
                continue;
            }

            let bestG = closestNode.distance + neighbor.weight - getHeuristic(closestNode, finishNode);
            let bestGFound = false;

            if (openList.includes(neighbor) === false) {
                bestGFound = true;
                neighbor.heuristic = getHeuristic(neighbor, finishNode);
                openList.push(neighbor);
            }

            else if (bestG < (neighbor.distance - getHeuristic(neighbor, finishNode))) {
                bestGFound = true;
            }

            if (bestGFound === true) {
                neighbor.prevNode = closestNode;
                neighbor.distance = bestG + neighbor.heuristic;
            }
        }
    }   
}

function getNeighbors(grid, node) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;

    if (row > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
    }

    if (row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
    }

    if (col > 0 ) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
    }

    if (col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
    }

    return neighbors;
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) => firstNode.distance - secondNode.distance);
}

function getHeuristic(node, finishNode) {
    return (Math.abs(node.row - finishNode.row) + Math.abs(node.column - finishNode.column));
}