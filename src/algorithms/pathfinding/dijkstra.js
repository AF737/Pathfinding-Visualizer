'use strict';

export default function dijkstra(grid, startNode, finishNode) 
{
    const visitedNodes = [];
    const shortestPath = [];
    startNode.distanceFromStart = 0;
    const unvisitedNodes = getUnvisitedNodes(grid);

    while (unvisitedNodes.length > 0) 
    {
        sortNodesByDistanceFromStart(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();

        if (closestNode.isWall === true) 
            continue;

        /* Either the start node or the finish node is completely surrounded
            by walls and no path can connect them */
        if (closestNode.distanceFromStart === Infinity) 
            return [visitedNodes, shortestPath];

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) 
        {
            let currentNode = finishNode;
            
            /* Recreate the path from the finish to the start node by going
                through the previous nodes */
            while (currentNode !== null) 
            {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [visitedNodes, shortestPath];
        }

        updateUnvisitedNeighbors(grid, closestNode);
    }
}

function getUnvisitedNodes(grid) 
{
    const unvisitedNodes = [];

    for (let row = 0; row < grid.rows; row++) 
    {
        for (let col = 0; col < grid.columns; col++) 
            unvisitedNodes.push(grid.nodesMatrix[row][col]);
    }

    return unvisitedNodes;
}

function sortNodesByDistanceFromStart(unvisitedNodes) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    unvisitedNodes.sort((firstNode, secondNode) => 
        firstNode.distanceFromStart - secondNode.distanceFromStart);
}

function updateUnvisitedNeighbors(grid, node) 
{
    const unvisitedNeighbors = grid.getNeighborsOfNode(node).filter(checkIfUnvisited)

    for (const neighbor of unvisitedNeighbors) 
    {
        neighbor.distanceFromStart = node.distanceFromStart + neighbor.weight +
            grid.getDistanceBetween(node, neighbor);
        neighbor.prevNode = node;
    }
}

function checkIfUnvisited(neighbor) 
{
    return neighbor.isVisited === false;
}