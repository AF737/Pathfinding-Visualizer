'use strict';

export {aStar};

function aStar(grid, startNode, finishNode) {
    /* Contains all nodes to which the shortest path is known */
    const closedList = [];
    startNode.distanceFromStart = 0;
    /* Contains all nodes where a path is known. This path may be suboptimal */
    const openList = [];
    openList.push(startNode);

    while (openList.length > 0) {
        sortNodesByDistance(openList);
        /* Remove the node with the shortest path from the start to it */
        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) {
            continue;
        }

        /* If either the start or the finish node is completely surrounded by
            walls then terminate, because no path can be found */
        if (closestNode.distanceFromStart === Infinity) {
            return [closedList, null];
        }

        if (closestNode === finishNode) {
            let currentNode = finishNode;
            const shortestPath = [];

            /* Recreate the path from the finish to the start node by going
                through the previous nodes */
            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        updateNeighbors(grid, closestNode, finishNode, openList, closedList);
    }   
}

function sortNodesByDistance(openList) {
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    openList.sort((firstNode, secondNode) => 
        firstNode.totalDistance - secondNode.totalDistance);
}

function updateNeighbors(grid, node, finishNode, openList, closedList) {
    const neighbors = getNeighbors(grid, node);

    for (const neighbor of neighbors) {
        /* Skip neighbors where the shortest path to them has already been found
            and ones that are walls */
        if (closedList.includes(neighbor) === true || neighbor.isWall === true) {
            continue;
        }

        let shortestPathToNode = node.distanceFromStart + neighbor.weight;
        let shortestPathFound = false;

        /* If the neighbor isn't yet in the open list then add it */
        if (openList.includes(neighbor) === false) {
            /* If the element wasn't in the open list then the current path to it
                is the shortest one */
            shortestPathFound = true;
            neighbor.heuristicDistance = getHeuristicDistance(neighbor, finishNode);
            openList.push(neighbor);
        }

        /* If the current path to the neighbor is shorter than the previous one */
        else if (shortestPathToNode < neighbor.distanceFromStart) {
            shortestPathFound = true;
        }

        if (shortestPathFound === true) {
            neighbor.prevNode = node;
            /* Overwrite the longer path with the new and shorter one */
            neighbor.distanceFromStart = shortestPathToNode;
            neighbor.totalDistance = neighbor.distanceFromStart + neighbor.heuristicDistance;
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

    /* Even already visited neighbors are returned, because there might be a shorter
        path to them now */
    return neighbors;
}

/* The Manhattan distance is used, because the algorithm can only move in
    four directions (up, down, left and right) */
function getHeuristicDistance(node, finishNode) {
    return (Math.abs(node.row - finishNode.row) + Math.abs(node.column - finishNode.column));

}