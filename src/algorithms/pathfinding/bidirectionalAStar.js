'use strict';

const Node = 
{
    start: 'start',
    finish: 'finish'
};

/* Make Node attributes immutable */
Object.freeze(Node);

export default function bidirectionalAStar(grid, startNode, finishNode) 
{
    const closedListFromStart = [];
    const closedListFromFinish = [];
    const shortestPath = [];
    startNode.distanceFromStart = 0;
    finishNode.distanceFromFinish = 0;
    const openListFromStart = [];
    const openListFromFinish = [];
    openListFromStart.push(startNode);
    openListFromFinish.push(finishNode);

    while (openListFromStart.length > 0 && openListFromFinish.length > 0) 
    {
        sortNodesByDistance(openListFromStart);
        sortNodesByDistance(openListFromFinish);
        let closestNodeFromStart = openListFromStart.shift();
        let closestNodeFromFinish = openListFromFinish.shift();
        closedListFromStart.push(closestNodeFromStart);
        closedListFromFinish.push(closestNodeFromFinish);

        while (closestNodeFromStart.isWall === true && openListFromStart.length > 0) 
            closestNodeFromStart = openListFromStart.shift();

        while (closestNodeFromFinish.isWall === true && openListFromFinish.length > 0) 
            closestNodeFromFinish = openListFromFinish.shift();

        /* If the a node from both a-star algorithms is the same then
            both algorithms have crossed paths and we can calculate the
            shortest path from start to finish through this node */
        if (closedListFromStart.includes(closestNodeFromFinish)) 
        {
            getPath(closestNodeFromFinish, shortestPath);

            return [closedListFromStart, closedListFromFinish, shortestPath];
        }

        else if (closedListFromFinish.includes(closestNodeFromStart)) 
        {
            getPath(closestNodeFromStart, shortestPath);

            return [closedListFromStart, closedListFromFinish, shortestPath];
        }

        updateNeighbors(grid, closestNodeFromStart, finishNode, openListFromStart,
            closedListFromStart, Node.start);
        updateNeighbors(grid, closestNodeFromFinish, startNode, openListFromFinish,
            closedListFromFinish, Node.finish);
    }

    /* If we exited the while loop then the start and/or finish node is completely
        surrounded by walls and thereby unreachable. Then there's no path to connect both
        nodes so return null */
    return [closedListFromStart, closedListFromFinish, shortestPath];
}

function sortNodesByDistance(openList) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

/* initNode is the node that the current a-star algorithm originated from.
    goalNode is the node that the current a-star algorithm tries to reach */
function updateNeighbors(grid, node, goalNode, openList, closedList, initNode) 
{
    const neighbors = grid.getNeighborsOfNode(node);

    for (const neighbor of neighbors) 
    {
        let shortestPathToNode = null;
        let shortestPathFound = false;

        if (closedList.includes(neighbor) === true || neighbor.isWall === true) 
            continue;

        /* Calculate the shortest path to the current node */
        if (initNode === Node.start) 
        {
            shortestPathToNode = node.distanceFromStart + neighbor.weight +
                grid.getDistanceBetween(node, neighbor);
        }

        else if (initNode === Node.finish) 
        {
            shortestPathToNode = node.distanceFromFinish + neighbor.weight +
                grid.getDistanceBetween(node, neighbor);
        }

        /* If the neighbor isn't yet in the open list then add it */
        if (openList.includes(neighbor) === false) 
        {
            /* If the element wasn't in the open list then the current path to it
                is the shortest one */
            shortestPathFound = true;
            neighbor.heuristicDistance = grid.getDistanceBetween(neighbor, goalNode);
            openList.push(neighbor);
        }

        /* If the current path to the neighbor is shorter than the previous one */
        else if (shortestPathToNode < neighbor.distanceFromFinish) 
            shortestPathFound = true;

        if (shortestPathFound === true) 
        {
            if (initNode === Node.start) 
            {
                neighbor.prevNode = node;
                /* Overwrite the longer path with the new shorter one */
                neighbor.distanceFromStart = shortestPathToNode;
                neighbor.totalDistance = neighbor.distanceFromStart + neighbor.heuristicDistance;
            }

            else if (initNode === Node.finish) 
            {
                neighbor.prevNodeFromFinish = node;
                neighbor.distanceFromFinish = shortestPathToNode;
                neighbor.totalDistance = neighbor.distanceFromFinish + neighbor.heuristicDistance;
            }
        }
    }
}

/* This path doesn't have to be the shortest one */
function getPath(startingNode, shortestPath) 
{
    let currentNode = startingNode;

    /* Backtrack from the node that both algorithms have in common to
        the start node */
    while (currentNode !== null) 
    {
        shortestPath.unshift(currentNode);
        currentNode = currentNode.prevNode;
    }
    
    /* Start from the node previous to the connecting one or the connecting 
        node would be in the array twice */
    currentNode = startingNode.prevNodeFromFinish;
    
    /* Now start to backtrack from the node that connects both algorithms
        to the finish node */
    while (currentNode !== null) 
    {
        shortestPath.push(currentNode);
        currentNode = currentNode.prevNodeFromFinish;
    }
}