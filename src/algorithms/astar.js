'use strict';

export {astar};

function astar(grid, startNode, finishNode) {
    const visitedNodes = [];
    startNode.distance = 0;
    const unvisitedNodes = getUnvisitedNodes(grid);

    while (unvisitedNodes.length > 0) {
        /*sortNodesByDistance(unvisitedNodes, finishNode);
        const closestNode = unvisitedNodes.shift();*/
        let closestNode = sortNodesByDistance(unvisitedNodes, finishNode);
        //console.log(closestNode.distance);

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

        updateUnvisitedNeighbors(grid, closestNode, finishNode);
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

function sortNodesByDistance(unvisitedNodes, finishNode) {
    /*unvisitedNodes.sort((firstNode, secondNode) =>
        firstNode.distance - secondNode.distance);*/
    let currentClosest = unvisitedNodes[0];
    let index = 0;

    for (let i = 1; i < unvisitedNodes.length; i++) {
        if (currentClosest.distance > unvisitedNodes[i].distance) {
            currentClosest = unvisitedNodes[i];
            index = i;
        }

        else if (currentClosest.distance === unvisitedNodes[i].distance) {
            if (getHeuristicDistance(currentClosest, finishNode)
                > getHeuristicDistance(unvisitedNodes[i], finishNode)) {
                    currentClosest = unvisitedNodes[i];
                    index = i;
                }
        }
    }
    
    unvisitedNodes.splice(index, 1);

    return currentClosest;
}

function updateUnvisitedNeighbors(grid, node, finishNode) {
    const unvisitedNeighbors = getUnvisitedNeighbors(grid, node);

    for (const neighbor of unvisitedNeighbors) {
        const heuristicDistance = getHeuristicDistance(neighbor, finishNode);
        neighbor.distance = node.distance + neighbor.weight + heuristicDistance;
        //neighbor.distance = neighbor.weight + heuristicDistance;
        neighbor.prevNode = node;
        //console.log(neighbor);
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
    return neighbors;
}

function checkUnvisited(neighbor) {
    return neighbor.isVisited === false;
}

function getHeuristicDistance(node, finishNode) {
    return (Math.abs(node.row - finishNode.row) + 
            Math.abs(node.column - finishNode.column));
}