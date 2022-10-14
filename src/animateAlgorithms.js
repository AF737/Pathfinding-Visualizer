'use strict';

const Node = 
{
    unvisited: 'unvisited',
    visited: 'visited',
    start: 'start',
    startVisited: 'startVisited',
    startShortestPath: 'startShortestPath',
    finish: 'finish',
    finishVisited: 'finishVisited',
    finishShortestPath: 'finishShortestPath',
    shortestPath: 'shortestPath',
    jumpPoint: 'jumpPoint',
    visitedByPreviousAlgorithm: 'visitedByPreviousAlgorithm'
};

/* Make Node attributes immutable */
Object.freeze(Node);

import {enableButtons, enableEightDirections, enableCornerCutting} 
        from './helperFunctions.js';
import dijkstra from './algorithms/dijkstra.js';
import aStar from './algorithms/aStar.js';
import greedyBestFirstSearch from './algorithms/greedyBestFirstSearch.js';
import breadthFirstSearch from './algorithms/breadthFirstSearch.js';
import bidirectionalDijkstra from './algorithms/bidirectionalDijkstra.js';
import bidirectionalAStar from './algorithms/bidirectionalAStar.js';
import depthFirstSearch from './algorithms/depthFirstSearch.js';
import jumpPointSearch from './algorithms/jumpPointSearch.js';
import {eightDirections, cornerCutting} from './index.js';
import {removeWeights} from './weights.js';

const ANIMATION_SPEED = 10;
let eightDirectionsToggleButton = document.getElementById('eightDirectionsToggleButton');
let cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');

export default function startAlgorithmAnimation(selectedAlgorithm, startNode, finishNode, gridBoard) 
{
    let visitedNodes, visitedNodesFromFinish, shortestPath, path;
    let timeToWait = 0;

    switch (selectedAlgorithm) 
    {
        case 'dijkstra':
            [visitedNodes, shortestPath] = dijkstra(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, false, false);
            break;
        case 'aStar':
            [visitedNodes, shortestPath] = 
                aStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);
    
            timeToWait = animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, true, false);
            break;
        case 'greedyBestFirstSearch':
            [visitedNodes, path] = 
                greedyBestFirstSearch(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

            timeToWait = animateAlgorithm(visitedNodes, null, path, gridBoard, true, false);
            break;
        case 'breadthFirstSearch':
            removeWeights(gridBoard);

            [visitedNodes, shortestPath] = breadthFirstSearch(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, false, false);
            break;
        case 'bidirectionalDijkstra':
            visitedNodesFromStart, visitedNodesFromFinish, path =
                bidirectionalDijkstra(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path, gridBoard, false, false);
            break;
        case 'bidirectionalAStar':
            visitedNodesFromStart, visitedNodesFromFinish, path =
                bidirectionalAStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

            timeToWait = animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path, gridBoard, true, false);
            break;
        case 'depthFirstSearch':
            removeWeights(gridBoard);

            [visitedNodesFromStart, path] = depthFirstSearch(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(visitedNodesFromStart, null, path, gridBoard, false, false);
            break;
        case 'jumpPointSearch':
            removeWeights(gridBoard);

            [visitedNodesFromStart, shortestPath] = jumpPointSearch(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(visitedNodesFromStart, null, shortestPath, gridBoard, false, true);
            break;
        default:
            break;
    }

    return timeToWait;
}

function animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, 
    gridBoard, allowEightDirections, jumpPointSearch) 
{
    for (let i = 0; i < visitedNodesFromStart.length; i++) 
    {
        setTimeout(function() 
        {
            const currentNode = visitedNodesFromStart[i];
            const nodeID = document.getElementById(`node-${currentNode.row}-${currentNode.column}`);
            
            if (i === 0) 
                nodeID.className = Node.startVisited;

            else if (currentNode.isJumpPoint === true) 
                nodeID.className = Node.jumpPoint;

            else if (nodeID.className !== Node.shortestPath && 
                    nodeID.className !== Node.startShortestPath &&
                    nodeID.className !== Node.finishShortestPath && 
                    nodeID.className !== Node.start &&
                    nodeID.className !== Node.finish) 
                nodeID.className = Node.visited;
        }, i * ANIMATION_SPEED);
    }

    /* Used for bidirectional search algorithms */
    if (visitedNodesFromFinish !== null) 
    {
        for (let i = 0; i < visitedNodesFromFinish.length; i++) 
        {
            setTimeout(function() 
            {
                const currentNode = visitedNodesFromFinish[i];
                const nodeID = document.getElementById(`node-${currentNode.row}-${currentNode.column}`);
                
                if (i === 0) 
                    nodeID.className = Node.finishVisited;

                else if (nodeID.className !== Node.shortestPath && 
                        nodeID.className !== Node.startShortestPath &&
                        nodeID.className !== Node.finishShortestPath && 
                        nodeID.className !== Node.start &&
                        nodeID.className !== Node.finish)
                    nodeID.className = Node.visited;
            }, i * ANIMATION_SPEED);
        }
    }

    if (shortestPath !== null) 
    {
        for (let i = 0; i < shortestPath.length; i++) 
        {
            setTimeout(function() 
            {
                const currentNode = shortestPath[i];
                const nodeID = document.getElementById(`node-${currentNode.row}-${currentNode.column}`);

                if (i === 0) 
                    nodeID.className = Node.startShortestPath;

                else if (i === shortestPath.length - 1)
                    nodeID.className = Node.finishShortestPath;

                else if (nodeID.className !== Node.shortestPath &&
                        nodeID.className !== Node.startShortestPath &&
                        nodeID.className !== Node.finishShortestPath &&
                        nodeID.className !== Node.start &&
                        nodeID.className !== Node.finish)
                    nodeID.className = Node.shortestPath;
            }, (visitedNodesFromStart.length + i) * ANIMATION_SPEED);
        }
    }

    /* visitedNodesFromStart and visitedNodesFromFinish always have the same length so 
        using only one of them to calculate the time until the animation's done is enough */
    if (shortestPath !== null) 
    {
        setTimeout(function() 
        {
            gridBoard.algoIsRunning = false;
            enableButtons();

            if (allowEightDirections === true) 
                enableEightDirections();

            /* Jump Point Search uses eight directions, but doesn't allow for corner
                cutting so the extra check is necessary otherwise just enable it if
                it was set before */
            if ((eightDirectionsToggleButton.checked === true || 
                cornerCuttingToggleButton.checked === true) && 
                jumpPointSearch === false) 
                enableCornerCutting();
        }, (visitedNodesFromStart.length + shortestPath.length) * ANIMATION_SPEED);
    }

    /* If no shortest path was found then enable all buttons when the algorithm has
        terminated */
    else 
    {
        setTimeout(function() 
        {
            gridBoard.algoIsRunning = false;
            enableButtons();
            
            if (allowEightDirections === true) 
                enableEightDirections();

            if ((eightDirectionsToggleButton.checked === true || 
                cornerCuttingToggleButton.checked === true) &&
                jumpPointSearch === false)
                enableCornerCutting();
        }, visitedNodesFromStart.length * ANIMATION_SPEED);
    }

    if (shortestPath === null)
        return (visitedNodesFromStart.length * ANIMATION_SPEED);

    else 
        return ((visitedNodesFromStart.length + shortestPath.length)) * ANIMATION_SPEED;
}