'use strict';

export {bidirectionalAStar};

function bidirectionalAStar(grid, startNode, finishNode, eightDirections, cornerCutting) {
    const closedListFromStart = [];
    const closedListFromFinish = [];
    startNode.distanceFromStart = 0;
    finishNode.distanceFromFinish = 0;
    const openListFromStart = [];
    const openListFromFinish = [];
    openListFromStart.push(startNode);
    openListFromFinish.push(finishNode);

    while (openListFromStart.length > 0 &&
            openListFromFinish.length > 0) {
        sortNodesByDistance(openListFromStart);
        sortNodesByDistance(openListFromFinish);
        let closestNodeFromStart = openListFromStart.shift();
        let closestNodeFromFinish = openListFromFinish.shift();
        closedListFromStart.push(closestNodeFromStart);
        closedListFromFinish.push(closestNodeFromFinish);

        while (closestNodeFromStart.isWall === true
                && openListFromStart.length > 0) {
            closestNodeFromStart = openListFromStart.shift();
        }

        while (closestNodeFromFinish.isWall === true
                && openListFromFinish.length > 0) {
            closestNodeFromFinish = openListFromFinish.shift();
        }

        /* If the a node from both a-star algorithms is the same then
            both algorithms have crossed paths and we can calculate the
            shortest path from start to finish through this node */
        if (closedListFromStart.includes(closestNodeFromFinish)) {
            const path = getPath(closestNodeFromFinish);

            return [closedListFromStart, closedListFromFinish, path];
        }

        else if (closedListFromFinish.includes(closestNodeFromStart)) {
            const path = getPath(closestNodeFromStart);

            return [closedListFromStart, closedListFromFinish, path];
        }

        updateNeighbors(grid, closestNodeFromStart, finishNode, openListFromStart,
            closedListFromStart, 'start', eightDirections, cornerCutting);
        updateNeighbors(grid, closestNodeFromFinish, startNode, openListFromFinish,
            closedListFromFinish, 'finish', eightDirections, cornerCutting);
    }

    /* If we exited the while loop then the start and/or finish node is completely
        surrounded by walls and thereby unreachable. Then there's no path to connect both
        nodes so return null */
    return [closedListFromStart, closedListFromFinish, null];
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

/* initNode describes the node from which the algorithm originally started
    (i.e. start or finish node). goalNode describes the goal from the current
    starting node (i.e. for start node that would be the finish node and vice
    versa) */
function updateNeighbors(grid, node, goalNode, openList, closedList, initNode, 
    eightDirections, cornerCutting) {
    const neighbors = getNeighbors(grid, node, eightDirections, cornerCutting);

    for (const neighbor of neighbors) {
        let shortestPathToNode = null;
        let shortestPathFound = false;

        if (closedList.includes(neighbor) === true || neighbor.isWall === true) {
            continue;
        }

        /* Calculate the shortest path to the current node */
        if (initNode === 'start') {
            shortestPathToNode = node.distanceFromStart + neighbor.weight +
                getDistance(node, neighbor);
        }

        else if (initNode === 'finish') {
            shortestPathToNode = node.distanceFromFinish + neighbor.weight +
                getDistance(node, neighbor);
        }

        /* I fthe neighbor isn't yet in the open list then add it */
        if (openList.includes(neighbor) === false) {
            /* If the element wasn't in the open list then the current path to it
                is the shortest one */
            shortestPathFound = true;
            neighbor.heuristicDistance = getDistance(neighbor, goalNode);
            openList.push(neighbor);
        }

        /* If the current path to the neighbor is shorter than the previous one */
        else if (shortestPathToNode < neighbor.distanceFromFinish) {
            shortestPathFound = true;
        }

        if (shortestPathFound === true) {
            if (initNode === 'start') {
                neighbor.prevNode = node;
                /* Overwrite the longer path with the new and shorter one */
                neighbor.distanceFromStart = shortestPathToNode;
                neighbor.totalDistance = neighbor.distanceFromStart + neighbor.heuristicDistance;
            }

            else if (initNode === 'finish') {
                neighbor.prevNodeFromFinish = node;
                neighbor.distanceFromFinish = shortestPathToNode;
                neighbor.totalDistance = neighbor.distanceFromFinish + neighbor.heuristicDistance;
            }
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

    if (col > 0) {
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

function getDistance(node, goalNode) {
    //return (Math.abs(node.row - goalNode.row) + Math.abs(node.column - goalNode.column));
    const rowChange = Math.abs(node.row - goalNode.row);
    const colChange = Math.abs(node.column - goalNode.column);

    return ((rowChange + colChange) + ((Math.SQRT2 - 2) * Math.min(rowChange, colChange)));
}

/* Prohibit diagonal movement if there's a wall directly left or right and above or below
    (depending on the movement direction) the current node and corner cutting is disabled.
    Otherwise allow the move */
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

function getPath(startingNode) {
    let currentNode = startingNode;
    /* It's called path instead of shortest path, because the path
        that connects the start node with the common one and the
        common one to the finish node doesn't have to be the
        shortest path */
    const path = [];

    /* Backtrack from the node that both algorithms have in common to
        the start node */
    while (currentNode !== null) {
        path.unshift(currentNode);
        currentNode = currentNode.prevNode;
    }
    
    /* Start from the node previous to the connecting one or the connecting 
        node would be in the array twice */
    currentNode = startingNode.prevNodeFromFinish;
    
    /* Now start to backtrack from the node that connects both algorithms
        to the finish node */
    while (currentNode !== null) {
        path.push(currentNode);
        currentNode = currentNode.prevNodeFromFinish;
    }

    return path;
}