'use strict';

import {enableButtons, enableEightDirections, enableCornerCutting} 
        from './helperFunctions.js';
import dijkstra from './algorithms/dijkstra.js';
import aStar from './algorithms/aStar.js';
import greedyBFS from './algorithms/greedyBestFirstSearch.js';
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
    switch (selectedAlgorithm) 
    {
        case 'dijkstra':
            animateDijkstra(startNode, finishNode, gridBoard);
            break;
        case 'aStar':
            animateAStar(startNode, finishNode, gridBoard);
            break;
        case 'greedyBFS':
            animateGreedyBFS(startNode, finishNode, gridBoard);
            break;
        case 'breadthFirstSearch':
            animateBreadthFirstSearch(startNode, finishNode, gridBoard);
            break;
        case 'bidirectionalDijkstra':
            animateBidirectionalDijkstra(startNode, finishNode, gridBoard);
            break;
        case 'bidirectionalAStar':
            animateBidirectionalAStar(startNode, finishNode, gridBoard);
            break;
        case 'depthFirstSearch':
            animateDepthFirstSearch(startNode, finishNode, gridBoard);
            break;
        case 'jumpPointSearch':
            animateJumpPointSearch(startNode, finishNode, gridBoard);
            break;
        default:
            break;
    }
}

function animateDijkstra(startNode, finishNode, gridBoard) 
{
    const [visitedNodes, shortestPath] = 
        dijkstra(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, false, false);
}

function animateAStar(startNode, finishNode, gridBoard) 
{
    const [visitedNodes, shortestPath] = 
        aStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);
    
    animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, true, false);
}

function animateGreedyBFS(startNode, finishNode, gridBoard) 
{
    const [visitedNodes, path] = 
        greedyBFS(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

    animateAlgorithm(visitedNodes, null, path, gridBoard, true, false);
}

function animateBreadthFirstSearch(startNode, finishNode, gridBoard) 
{
    removeWeights(gridBoard);

    const [visitedNodes, shortestPath] = 
        breadthFirstSearch(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, false, false);
}

function animateBidirectionalDijkstra(startNode, finishNode, gridBoard) 
{
    const [visitedNodesFromStart, visitedNodesFromFinish, path] =
        bidirectionalDijkstra(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path, 
        gridBoard, false, false);
}

function animateBidirectionalAStar(startNode, finishNode, gridBoard) 
{
    const [visitedNodesFromStart, visitedNodesFromFinish, path] =
        bidirectionalAStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

    animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path, 
        gridBoard, true, false);
}

function animateDepthFirstSearch(startNode, finishNode, gridBoard) 
{
    removeWeights(gridBoard);

    const [visitedNodesFromStart, path] = 
        depthFirstSearch(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodesFromStart, null, path, gridBoard, false, false);
}

function animateJumpPointSearch(startNode, finishNode, gridBoard) 
{
    removeWeights(gridBoard);

    const [visitedNodesFromStart, shortestPath] = 
        jumpPointSearch(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodesFromStart, null, shortestPath, gridBoard,
        false, true);
}

function animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, 
    gridBoard, allowEightDirections, jumpPointSearch) 
{
    for (let i = 0; i < visitedNodesFromStart.length; i++) 
    {
        setTimeout(function() 
        {
            const currentNode = visitedNodesFromStart[i];

            if (i === 0) 
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'startVisited';

            else if (currentNode.isJumpPoint === true) 
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'jumpPoint';

            else 
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'visited';
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
                
                if (i === 0) 
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'finishVisited';

                else 
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'visited';
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

                if (i === 0) 
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'startShortestPath';

                else if (i === shortestPath.length - 1) 
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'finishShortestPath';

                else 
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'shortestPath';
            }, (visitedNodesFromStart.length + i) * ANIMATION_SPEED);
        }
    }

    /* visitedNodesFromStart and visitedNodesFromFinish always have the same length so 
        taking the first one to calculate the time until the animation's done is enough */
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
}