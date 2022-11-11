'use strict';

export default function breadthFirstSearch(grid, startNode, finishNode) 
{
    const visitedNodes = [];
    startNode.distanceFromStart = 0;
    const unvisitedNodes = getUnivistedNodes(grid);

    while (unvisitedNodes.length > 0) 
    {
        sortNodesByDistanceFromStart(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        if (closestNode.isWall === true) 
            continue;

        if (closestNode.distanceFromStart === Infinity)
            return [visitedNodes, null];

        closestNode.isVisited = true;
        visitedNodes.push(closestNode);

        if (closestNode === finishNode) 
        {
            let currentNode = closestNode;
            let shortestPath = [];

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

function getUnivistedNodes(grid) 
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
    const unvisitedNeighbors = grid.getNeighborsOfNode(node).filter(checkIfUnvisited);

    for (const neighbor of unvisitedNeighbors) 
    {
        neighbor.distanceFromStart = node.distanceFromStart + node.weight +
            grid.getDistanceBetween(node, neighbor);
        neighbor.prevNode = node;
    }
}

function checkIfUnvisited(neighbor) 
{
    return neighbor.isVisited === false;
}

/* Checks if traversal from the current node to it's neighbor is allowed. */
function checkIfDirectionIsAllowed(grid, row, col, rowChange, colChange)
{
    /* Allowed direction of neighbor */
    const [rowDirection, colDirection] = 
        grid.nodesMatrix[row + rowChange][col + colChange].allowedDirection;

    /* Neighboring node allows all traversal directions */
    if (rowDirection === null && colDirection === null)
        return true;

    /* Move from node to neighbor is the move allowed by the neighbor's direction attribute */
    if (rowDirection === rowChange && colDirection === colChange)
        return true;

    /* Otherwise prevent traversal */
    return false;
}