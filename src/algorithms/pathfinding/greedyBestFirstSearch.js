'use strict';

export default function greedyBestFirstSearch(grid, startNode, finishNode) 
{
    const visitedNodes = [];
    const nodesToCheck = [];
    const shortestPath = [];
    startNode.heuristicDistance = grid.getDistanceBetween(startNode, finishNode);
    nodesToCheck.push(startNode);

    while (nodesToCheck.length > 0) 
    {
        sortNodesByDistance(nodesToCheck);
        const closestNode = nodesToCheck.shift();
        
        if (closestNode.isWall === true) 
            continue;

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) 
        {
            let currentNode = finishNode;

            /* Backtrack the path from finish node to start node */
            while (currentNode !== null) 
            {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }
            
            return [visitedNodes, shortestPath];
        }

        updateUnvisitedNeighbors(grid, closestNode, finishNode, nodesToCheck, visitedNodes);
    }

    /* If we exited the while loop then the start and/or finish node is completely
        surrounded by walls and thereby unreachable. Then there's no path to connect both
        nodes so return null */
    return [visitedNodes, shortestPath];
}

/* The node with the estimated shortest path to the finish node will be at
    the first place of this array */
function sortNodesByDistance(nodesToCheck) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    nodesToCheck.sort((firstNode, secondNode) =>
        firstNode.heuristicDistance - secondNode.heuristicDistance);
}

function updateUnvisitedNeighbors(grid, node, finishNode, nodesToCheck, visitedNodes) 
{
    const neighbors = grid.getNeighborsOfNode(node).filter(checkIfUnvisited);

    for (const neighbor of neighbors) 
    {
        if (nodesToCheck.includes(neighbor) === true || visitedNodes.includes(neighbor) === true)
            continue;

        neighbor.isVisited = true;
        neighbor.heuristicDistance = neighbor.weight + grid.getDistanceBetween(neighbor, finishNode);
        neighbor.prevNode = node;
        nodesToCheck.push(neighbor);
    }
}

function checkIfUnvisited(neighbor) 
{
    return neighbor.isVisited === false;
}