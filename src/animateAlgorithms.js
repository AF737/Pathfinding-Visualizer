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
import dijkstra from './algorithms/pathfinding/dijkstra.js';
import aStar from './algorithms/pathfinding/aStar.js';
import greedyBestFirstSearch from './algorithms/pathfinding/greedyBestFirstSearch.js';
import breadthFirstSearch from './algorithms/pathfinding/breadthFirstSearch.js';
import bidirectionalDijkstra from './algorithms/pathfinding/bidirectionalDijkstra.js';
import bidirectionalAStar from './algorithms/pathfinding/bidirectionalAStar.js';
import depthFirstSearch from './algorithms/pathfinding/depthFirstSearch.js';
import jumpPointSearch from './algorithms/pathfinding/jumpPointSearch.js';

const ANIMATION_SPEED = 10;
let eightDirectionsToggleButton = document.getElementById('eightDirectionsToggleButton');
let cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');

export default function startAlgorithmAnimation(selectedAlgorithm, startNode, finishNode, 
    gridBoard, lastFinishNode, onlyGetStatistics) 
{
    let visitedNodesFromStart = [];
    let visitedNodesFromFinish = [];
    let shortestPath = [];
    let timeToWait = 0;
    let numberOfVisitedNodes = 0;
    let numberOfShortestPathNodes = 0;
    let allowsEightDirectionalMovement = false;
    let isJumpPointSearch = false;
    
    switch (selectedAlgorithm) 
    {
        case 'dijkstra':
            gridBoard.restoreWeights();

            [visitedNodesFromStart, shortestPath] = dijkstra(gridBoard, startNode, finishNode);

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'aStar':
            gridBoard.restoreWeights();

            [visitedNodesFromStart, shortestPath] = aStar(gridBoard, startNode, finishNode);
    
            allowsEightDirectionalMovement = true;

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'greedyBestFirstSearch':
            gridBoard.restoreWeights();

            [visitedNodesFromStart, shortestPath] = greedyBestFirstSearch(gridBoard, startNode, finishNode);

            allowsEightDirectionalMovement = true;

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'breadthFirstSearch':
            /* When getting statistics the algorithms are ran in this order, so save weights of nodes for
                upcoming bidirectional Dijkstra and A*, which are weighted algorithms */
            gridBoard.saveWeightValues();

            gridBoard.removeWeights();

            [visitedNodesFromStart, shortestPath] = breadthFirstSearch(gridBoard, startNode, finishNode);

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'bidirectionalDijkstra':
            gridBoard.restoreWeights();

            [visitedNodesFromStart, visitedNodesFromFinish, shortestPath] =
                bidirectionalDijkstra(gridBoard, startNode, finishNode);

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'bidirectionalAStar':
            gridBoard.restoreWeights();

            [visitedNodesFromStart, visitedNodesFromFinish, shortestPath] =
                bidirectionalAStar(gridBoard, startNode, finishNode);

            allowsEightDirectionalMovement = true;

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard,
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'depthFirstSearch':
            gridBoard.saveWeightValues();

            gridBoard.removeWeights();

            [visitedNodesFromStart, shortestPath] = depthFirstSearch(gridBoard, startNode, finishNode);

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;

        case 'jumpPointSearch':
            gridBoard.saveWeightValues();

            gridBoard.removeWeights();

            [visitedNodesFromStart, shortestPath] = jumpPointSearch(gridBoard, startNode, finishNode);

            allowsEightDirectionalMovement = true;
            isJumpPointSearch = true;

            [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, gridBoard, 
                    allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics);
            break;
            
        default:
            break;
    }

    return [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes];
}

function animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, 
    gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode, onlyGetStatistics) 
{
    if (onlyGetStatistics === false)
    {
        for (let i = 0; i < visitedNodesFromStart.length; i++) 
        {
            setTimeout(function() 
            {
                const currentNode = visitedNodesFromStart[i];
                const nodeID = document.getElementById(`node-${currentNode.row}-${currentNode.column}`);
                
                if (i === 0)
                {
                    if (nodeID.className === Node.start) 
                        nodeID.className = Node.startVisited;

                    /* Algorithm started from finish node of previous algorithm iteration */
                    else
                        nodeID.className = Node.finishVisited;
                }

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
        if (visitedNodesFromFinish.length !== 0) 
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
                    {
                        if (nodeID.className === Node.startVisited)
                            nodeID.className = Node.startShortestPath;

                        else
                            nodeID.className = Node.finishShortestPath;
                    }

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

        /* Only enable the UI after the algorithm is done with all finish nodes */
        if (lastFinishNode === true)
        {
            /* visitedNodesFromStart and visitedNodesFromFinish always have the same length so 
                using only one of them to calculate the time until the animation's done is enough */
            if (shortestPath !== null) 
            {
                setTimeout(function() 
                {
                    gridBoard.algorithmIsRunning = false;
                    enableButtons();
                    
                    if (allowsEightDirectionalMovement === true) 
                        enableEightDirections();

                    /* Jump Point Search uses eight directions, but doesn't allow for corner
                        cutting so the extra check is necessary otherwise just enable it if
                        it was set before */
                    if ((eightDirectionsToggleButton.checked === true || 
                        cornerCuttingToggleButton.checked === true) && 
                        isJumpPointSearch === false) 
                        enableCornerCutting();
                }, (visitedNodesFromStart.length + shortestPath.length) * ANIMATION_SPEED);
            }

            /* If no shortest path was found then enable all buttons when the algorithm has
                terminated */
            else 
            {
                setTimeout(function() 
                {
                    gridBoard.algorithmIsRunning = false;
                    enableButtons();
                    
                    if (allowsEightDirectionalMovement === true) 
                        enableEightDirections();

                    if ((eightDirectionsToggleButton.checked === true || 
                        cornerCuttingToggleButton.checked === true) &&
                        isJumpPointSearch === false)
                        enableCornerCutting();
                }, visitedNodesFromStart.length * ANIMATION_SPEED);
            }
        }
    }

    let numberOfVisitedNodes = visitedNodesFromStart.length;
    let timeToWait = visitedNodesFromStart.length;
    let numberOfShortestPathNodes = 0;

    if (visitedNodesFromFinish !== null)
        numberOfVisitedNodes += visitedNodesFromFinish.length;

    if (shortestPath !== null)
    {
        timeToWait += shortestPath.length;
        numberOfShortestPathNodes = shortestPath.length;
    }

    return [(timeToWait * ANIMATION_SPEED), numberOfVisitedNodes, numberOfShortestPathNodes];
}