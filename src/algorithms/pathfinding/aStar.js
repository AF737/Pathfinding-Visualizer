'use strict';

export default function aStar(grid, startNode, finishNode) 
{
    /* Contains all nodes to which the shortest path is known */
    const closedList = [];
    const shortestPath = [];
    startNode.distanceFromStart = 0;
    /* Contains all nodes where a path is known. This path may be suboptimal */
    const openList = [];
    openList.push(startNode);

    while (openList.length > 0) 
    {
        sortNodesByDistance(openList);
        /* Remove the node with the shortest path from the start to it */
        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) 
            continue;

        /* If either the start or the finish node is completely surrounded by
            walls then terminate, because no path can be found */
        if (closestNode.distanceFromStart === Infinity) 
            return [closedList, shortestPath];

        if (closestNode === finishNode) 
        {
            let currentNode = finishNode;

            /* Recreate the path from the finish to the start node by going
                through the previous nodes until the start node is reached */
            while (currentNode !== null) 
            {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        updateNeighbors(grid, closestNode, finishNode, openList, closedList);
    }
    
    return [closedList, shortestPath];
}

function sortNodesByDistance(openList) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    openList.sort((firstNode, secondNode) => 
        firstNode.totalDistance - secondNode.totalDistance);
}

function updateNeighbors(grid, node, finishNode, openList, closedList) 
{
    const neighbors = grid.getNeighborsOfNode(node);

    for (const neighbor of neighbors) 
    {
        /* Skip neighbors where the shortest path to them has already been found
            and ones that are walls */
        if (closedList.includes(neighbor) === true || neighbor.isWall === true) 
            continue;
        

        const shortestPathToNode = node.distanceFromStart + neighbor.weight + 
            grid.getDistanceBetween(node, neighbor);
        let shortestPathFound = false;

        /* If the neighbor isn't yet in the open list then add it */
        if (openList.includes(neighbor) === false) 
        {
            /* If the element wasn't in the open list then the current path to it
                is the shortest one currently known */
            shortestPathFound = true;
            neighbor.heuristicDistance = grid.getDistanceBetween(neighbor, finishNode);
            openList.push(neighbor);
        }

        /* If the current path to the neighbor is shorter than the previous one */
        else if (shortestPathToNode < neighbor.distanceFromStart)
            shortestPathFound = true;

        if (shortestPathFound === true) 
        {
            neighbor.prevNode = node;
            /* Overwrite the longer path with the new shorter one */
            neighbor.distanceFromStart = shortestPathToNode;
            neighbor.totalDistance = neighbor.distanceFromStart + 
                neighbor.heuristicDistance;
        }
    }
}