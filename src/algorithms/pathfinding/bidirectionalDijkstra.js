'use strict';

const Node = 
{
    start: 'start',
    finish: 'finish'
};

/* Make Node attributes immutable */
Object.freeze(Node);

export default function bidirectionalDijkstra(grid, startNode, finishNode) 
{
    const visitedNodesFromStart = [];
    const visitedNodesFromFinish = [];
    const shortestPath = [];
    startNode.distanceFromStart = 0;
    finishNode.distanceFromFinish = 0;
    const unvisitedNodesFromStart = getUnvisitedNodes(grid);
    const unvisitedNodesFromFinish = getUnvisitedNodes(grid);

    while (unvisitedNodesFromStart.length > 0 && unvisitedNodesFromFinish.length > 0) 
    {
        sortNodesByDistanceFromStart(unvisitedNodesFromStart);
        sortNodesByDistanceFromFinish(unvisitedNodesFromFinish);
        let closestNodeFromStart = unvisitedNodesFromStart.shift();
        let closestNodeFromFinish = unvisitedNodesFromFinish.shift();
        
        /* We can't use continue because then we would lose the value of
            closestNodeFromFinish as it's removed from the array */
        while (closestNodeFromStart.isWall === true && unvisitedNodesFromStart.length > 0)
            closestNodeFromStart = unvisitedNodesFromStart.shift();

        while (closestNodeFromFinish.isWall === true && unvisitedNodesFromFinish.length > 0)
            closestNodeFromFinish = unvisitedNodesFromFinish.shift();

        /* If either the start or the finish node is completely surrounded by
            walls then terminate, because no path can be found */
        if (closestNodeFromStart.distanceFromStart === Infinity
            || closestNodeFromFinish.distanceFromFinish === Infinity)
            return [visitedNodesFromStart, visitedNodesFromFinish, shortestPath];

        closestNodeFromStart.isVisited = true;
        visitedNodesFromStart.push(closestNodeFromStart);
        closestNodeFromFinish.isVisited = true;
        visitedNodesFromFinish.push(closestNodeFromFinish);

        /* If the current node has already been visited by the other
            dijkstra algorithm then a path can connect start and finish
            node through the current node */
        if (visitedNodesFromStart.includes(closestNodeFromFinish)) 
        {
            getPath(closestNodeFromFinish, shortestPath);

            return [visitedNodesFromStart, visitedNodesFromFinish, shortestPath];
        }

        else if (visitedNodesFromFinish.includes(closestNodeFromStart)) 
        {
            getPath(closestNodeFromStart, shortestPath)

            return [visitedNodesFromStart, visitedNodesFromFinish, shortestPath];
        }

        updateUnvisitedNeighbors(grid, closestNodeFromStart, Node.start);
        updateUnvisitedNeighbors(grid, closestNodeFromFinish, Node.finish);
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

function sortNodesByDistanceFromStart(unvisitedNodesFromStart) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    unvisitedNodesFromStart.sort((firstNode, secondNode) =>
        firstNode.distanceFromStart - secondNode.distanceFromStart);
}

function sortNodesByDistanceFromFinish(unvisitedNodesFromFinish) 
{
    unvisitedNodesFromFinish.sort((firstNode, secondNode) =>
        firstNode.distanceFromFinish - secondNode.distanceFromFinish);
}

/* initNode is the node that the current dijkstra algorithm originated from */
function updateUnvisitedNeighbors(grid, node, initNode)
{
    const neighbors = grid.getNeighborsOfNode(node).filter(checkIfUnvisited);

    for (const neighbor of neighbors) 
    {
        if (initNode === Node.start) 
        {
            neighbor.distanceFromStart = node.distanceFromStart + neighbor.weight +
                grid.getDistanceBetween(node, neighbor);
            neighbor.prevNode = node;
        }

        /* A second prev node is needed because one of the two dijkstra's algorithms
            would overwrite the prevNode parameter and we would therefore lose the
            chain of nodes leading to the other initial node (either the start or 
            finish node would be unreachable) */
        else if (initNode === Node.finish) 
        {
            neighbor.distanceFromFinish = node.distanceFromFinish + neighbor.weight +
                grid.getDistanceBetween(node, neighbor);
            neighbor.prevNodeFromFinish = node;
        }
    }
}

function checkIfUnvisited(neighbor) 
{
    return neighbor.isVisited === false;
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