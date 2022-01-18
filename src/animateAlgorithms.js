'use strict';

export {animateDijkstra, animateAStar, animateGreedyBFS, animateBreadthFirstSearch,
        animateBidirectionalDijkstra, animateBidirectionalAStar, 
        animateDepthFirstSearch, animateJumpPointSearch};
import {enableButtons, enableDirections, enableCornerCutting} 
        from './helperFunctions.js';
import {dijkstra} from './algorithms/dijkstra.js';
import {aStar} from './algorithms/aStar.js';
import {greedyBFS} from './algorithms/greedyBFS.js';
import {breadthFirstSearch} from './algorithms/breadthFirstSearch.js';
import {bidirectionalDijkstra} from './algorithms/bidirectionalDijkstra.js';
import {bidirectionalAStar} from './algorithms/bidirectionalAStar.js';
import {depthFirstSearch} from './algorithms/depthFirstSearch.js';
import {jumpPointSearch3} from './algorithms/jumpPointSearch3.js';
import {eightDirections, cornerCutting} from './index.js';
import {removeWeights} from './weights.js';

const ANIMATION_SPEED = 10;
let directionsToggleButton = document.getElementById('directionsToggleButton');
let cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');

function animateDijkstra(startNode, finishNode, gridBoard) {
    const [visitedNodes, shortestPath] = 
        dijkstra(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, false, false);
}

function animateAStar(startNode, finishNode, gridBoard) {
    const [visitedNodes, shortestPath] = 
        aStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);
    
    animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, true, false);
}

function animateGreedyBFS(startNode, finishNode, gridBoard) {
    const [visitedNodes, path] = 
        greedyBFS(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

    animateAlgorithm(visitedNodes, null, path, gridBoard, true, false);
}

function animateBreadthFirstSearch(startNode, finishNode, gridBoard) {
    removeWeights(gridBoard);

    const [visitedNodes, shortestPath] = 
        breadthFirstSearch(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodes, null, shortestPath, gridBoard, false, false);
}

function animateBidirectionalDijkstra(startNode, finishNode, gridBoard) {
    const [visitedNodesFromStart, visitedNodesFromFinish, path] =
        bidirectionalDijkstra(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path, 
        gridBoard, false, false);
}

function animateBidirectionalAStar(startNode, finishNode, gridBoard) {
    const [visitedNodesFromStart, visitedNodesFromFinish, path] =
        bidirectionalAStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

    animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path, 
        gridBoard, true, false);
}

function animateDepthFirstSearch(startNode, finishNode, gridBoard) {
    removeWeights(gridBoard);

    const [visitedNodesFromStart, path] = 
        depthFirstSearch(gridBoard, startNode, finishNode);

    animateAlgorithm(visitedNodesFromStart, null, path, gridBoard, false, false);
}

function animateJumpPointSearch(startNode, finishNode, gridBoard) {
    removeWeights(gridBoard);

    const [visitedNodesFromStart, shortestPath] = 
    jumpPointSearch3(gridBoard, startNode, finishNode, gridBoard);

    animateAlgorithm(visitedNodesFromStart, null, shortestPath, gridBoard,
        false, true);
}

function animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath, 
    gridBoard, allowEightDirections, jumpPointSearch) {
    for (let i = 0; i < visitedNodesFromStart.length; i++) {
        setTimeout(function() {
            const currentNode = visitedNodesFromStart[i];

            if (i === 0) {
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'startVisited';
            }

            else if (currentNode.isJumpPoint === true) {
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'jumpPoint';
            }

            else {
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'visited';
            }
        }, i * ANIMATION_SPEED);
    }

    if (visitedNodesFromFinish !== null) {
        for (let i = 0; i < visitedNodesFromFinish.length; i++) {
            setTimeout(function() {
                const currentNode = visitedNodesFromFinish[i];
                
                if (i === 0) {
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'finishVisited';
                }

                else {
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'visited';
                }
            }, i * ANIMATION_SPEED);
        }
    }

    if (shortestPath !== null) {
        for (let i = 0; i < shortestPath.length; i++) {
            setTimeout(function() {
                const currentNode = shortestPath[i];

                if (i === 0) {
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'startShortestPath';
                }

                else if (i === shortestPath.length - 1) {
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'finishShortestPath';
                }

                else {
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'shortestPath';
                }
            }, (visitedNodesFromStart.length + i) * ANIMATION_SPEED);
        }
    }

    /* Allow the user to edit the board and use the buttons once the algorithm is done.
        The arrays visitedNodesFromStart/...Finish both always have the same length so
        they both take the same time to animate, so it's enough to use the length of
        visitedNodesFromStart which is never null */
    if (shortestPath !== null) {
        setTimeout(function() {
            gridBoard.algoIsRunning = false;
            enableButtons();
            // enableToggleButtons();
            if (allowEightDirections === true) {
                enableDirections();
            }

            if ((directionsToggleButton.checked === true || 
                cornerCuttingToggleButton.checked === true) && 
                jumpPointSearch === false) {
                enableCornerCutting();
            }
        }, (visitedNodesFromStart.length + shortestPath.length) * ANIMATION_SPEED);
    }

    else {
        setTimeout(function() {
            gridBoard.algoIsRunning = false;
            enableButtons();
            // enableToggleButtons();
            if (allowEightDirections === true) {
                enableDirections();
            }

            if ((directionsToggleButton.checked === true || 
                cornerCuttingToggleButton.checked === true) &&
                jumpPointSearch === false) {
                enableCornerCutting();
            }
        }, visitedNodesFromStart.length * ANIMATION_SPEED);
    }
}