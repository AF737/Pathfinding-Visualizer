'use strict';

export default function depthFirstSearch(grid, startNode, finishNode) 
{
    const visitedNodes = [];
    const nodesToCheck = [];
    startNode.distanceFromStart = 0;
    nodesToCheck.push(startNode);

    while (nodesToCheck.length > 0) 
    {
        /* Always check the last node of the array, because this algorithm explores
            every direction until it meets a dead end */
        const currentNode = nodesToCheck.pop();

        if (currentNode.isWall === true || currentNode.isVisited === true)
            continue;
        
        currentNode.isVisited = true;
        visitedNodes.push(currentNode);

        if (currentNode === finishNode) 
        {
            let pathNode = finishNode;
            const path = [];

            /* Backtrack from finish to start node */
            while (pathNode !== null) 
            {
                path.unshift(pathNode);
                pathNode = pathNode.prevNode;
            }

            return [visitedNodes, path];
        }

        /* Add the unvisited neighbors to the array */
        updateUnvisitedNeighbors(grid, currentNode, nodesToCheck);
    }

    /* If we exited the while loop then the start and/or finish node is completely
        surrounded by walls and thereby unreachable. Then there's no path to connect both
        nodes so return null */
    return [visitedNodes, null];
}

function updateUnvisitedNeighbors(grid, node, nodesToCheck) 
{
    const unvisitedNeighbors = grid.getNeighborsOfNode(node).filter(checkIfUnvisited);

    /* Set the previous node of all neighbors to the node that
        we found them from so that we can backtrack from the
        finish node to the start node for the path */
    for (const neighbor of unvisitedNeighbors) 
    {
        neighbor.distanceFromStart = node.distanceFromStart + neighbor.weight;
        neighbor.prevNode = node;
        nodesToCheck.push(neighbor);
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