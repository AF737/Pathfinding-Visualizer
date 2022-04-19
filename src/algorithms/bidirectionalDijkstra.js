'use strict';

export default function bidirectionalDijkstra(grid, startNode, finishNode) {
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
        
        /* We can't use continue because then we would lose the value of
            closestNodeFromFinish as it's removed from the array */
        while (closestNodeFromStart.isWall === true
                && unvisitedNodesFromStart.length > 0) {
            closestNodeFromStart = unvisitedNodesFromStart.shift();
        }

        while (closestNodeFromFinish.isWall === true
                && unvisitedNodesFromFinish.length > 0) {
            closestNodeFromFinish = unvisitedNodesFromFinish.shift();
        }

        /* If either the start or the finish node is completely surrounded by
            walls then terminate, because no path can be found */
        if (closestNodeFromStart.distanceFromStart === Infinity
            || closestNodeFromFinish.distanceFromFinish === Infinity) {
                return [visitedNodesFromStart, visitedNodesFromFinish, null];
        }

        closestNodeFromStart.isVisited = true;
        visitedNodesFromStart.push(closestNodeFromStart);
        closestNodeFromFinish.isVisited = true;
        visitedNodesFromFinish.push(closestNodeFromFinish);

        /* If the current node has already been visited by the other
            dijkstra algorithm then a path can connect start and finish
            node through the current node */
        if (visitedNodesFromStart.includes(closestNodeFromFinish)) {
            const path = getPath(closestNodeFromFinish);

            return [visitedNodesFromStart, visitedNodesFromFinish, path];
        }

        else if (visitedNodesFromFinish.includes(closestNodeFromStart)) {
            const path = getPath(closestNodeFromStart)

            return [visitedNodesFromStart, visitedNodesFromFinish, path];
        }

        updateUnvisitedNeighbors(grid, closestNodeFromStart, 'start');
        updateUnvisitedNeighbors(grid, closestNodeFromFinish, 'finish');
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

/* initNode is the node that the current dijkstra algorithm originated from */
function updateUnvisitedNeighbors(grid, node, initNode) {
    const neighbors = getUnvisitedNeighbors(grid, node);

    for (const neighbor of neighbors) {
        if (initNode === 'start') {
            neighbor.distanceFromStart = node.distanceFromStart + neighbor.weight +
                getDistance(node, neighbor);
            neighbor.prevNode = node;
        }

        /* A second prev node is needed because one of the two dijkstra's algorithms
            would overwrite the prevNode parameter and we would therefore lose the
            chain of nodes leading to the other initial node (either the start or 
            finish node would be unreachable) */
        else if (initNode === 'finish') {
            neighbor.distanceFromFinish = node.distanceFromFinish + neighbor.weight +
                getDistance(node, neighbor);
            neighbor.prevNodeFromFinish = node;
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

    /* Only return unvisited neighbors */
    return neighbors.filter(checkUnvisited);
}

function checkUnvisited(neighbor) {
    return neighbor.isVisited === false;
}

/* Manhattan distance */
function getDistance(parentNode, node) {
    return (Math.abs(parentNode.row - node.row) +
            Math.abs(parentNode.column - node.column));
}

/* This path doesn't have to be the shortest one */
function getPath(startingNode) {
    let currentNode = startingNode;
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