'use strict';

export default function aStar(grid, startNode, finishNode, eightDirections, cornerCutting) {
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
                through the previous nodes until the start node is reached */
            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        updateNeighbors(grid, closestNode, finishNode, openList, closedList, 
            eightDirections, cornerCutting);
    }
    
    return [closedList, null];
}

function sortNodesByDistance(openList) {
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    openList.sort((firstNode, secondNode) => 
        firstNode.totalDistance - secondNode.totalDistance);
}

function updateNeighbors(grid, node, finishNode, openList, closedList, 
    eightDirections, cornerCutting) {
    const neighbors = getNeighbors(grid, node, eightDirections, cornerCutting);

    for (const neighbor of neighbors) {
        /* Skip neighbors where the shortest path to them has already been found
            and ones that are walls */
        if (closedList.includes(neighbor) === true || neighbor.isWall === true) {
            continue;
        }

        const shortestPathToNode = node.distanceFromStart + neighbor.weight + 
            getDistance(node, neighbor);
        let shortestPathFound = false;

        /* If the neighbor isn't yet in the open list then add it */
        if (openList.includes(neighbor) === false) {
            /* If the element wasn't in the open list then the current path to it
                is the shortest one currently known */
            shortestPathFound = true;
            neighbor.heuristicDistance = getDistance(neighbor, finishNode);
            openList.push(neighbor);
        }

        /* If the current path to the neighbor is shorter than the previous one */
        else if (shortestPathToNode < neighbor.distanceFromStart) {
            shortestPathFound = true;
        }

        if (shortestPathFound === true) {
            neighbor.prevNode = node;
            /* Overwrite the longer path with the new shorter one */
            neighbor.distanceFromStart = shortestPathToNode;
            neighbor.totalDistance = neighbor.distanceFromStart + 
                neighbor.heuristicDistance;
        }
    }
}

function getNeighbors(grid, node, eightDirections, cornerCutting) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, left = false, right = false;

    if (row > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
        up = true;
    }

    if (row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
        down = true;
    }

    if (col > 0 ) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
        left = true;
    }

    if (col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
        right = true;
    }

    if (eightDirections === true) {
        if (up === true && left === true &&
            checkCornerCutting(grid, cornerCutting, row, col, -1, -1) === true) {
                neighbors.push(grid.nodesMatrix[row - 1][col - 1]);
        }

        if (up === true && right === true &&
            checkCornerCutting(grid, cornerCutting, row, col, -1, 1) === true) {
                neighbors.push(grid.nodesMatrix[row - 1][col + 1]);
        }

        if (down === true && left === true &&
            checkCornerCutting(grid, cornerCutting, row, col, 1, -1) === true) {
                neighbors.push(grid.nodesMatrix[row + 1][col - 1]);
        }

        if (down === true && right === true &&
            checkCornerCutting(grid, cornerCutting, row, col, 1, 1) === true) {
                neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
        }
    }

    /* Even already visited neighbors are returned, because there might be a shorter
        path to them now */
    return neighbors;
}

/* Octile distance is used to check if moving diagonally has a smaller cost
    than moving in only four directions */
function getDistance(firstNode, secondNode) {
    const rowChange = Math.abs(firstNode.row - secondNode.row);
    const colChange = Math.abs(firstNode.column - secondNode.column);

    return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));
}

/* Prohibit diagonal movement in that direction if there's a wall directly next to it
    vertically and horizontally and corner cutting is disabled */
function checkCornerCutting(grid, cornerCutting, row, col, rowChange, colChange) {
    if (cornerCutting === true) {
        return true;
    }

    else {
        if (grid.nodesMatrix[row + rowChange][col].isWall === true &&
            grid.nodesMatrix[row][col + colChange].isWall === true) {
                return false;
        }

        else {
            return true;
        }
    }
}