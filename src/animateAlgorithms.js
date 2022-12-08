'use strict';

import {NodeType} from './index.js';
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

const Animation = 
{
    visitedNodesFromStart: [],
    visitedNodesFromFinish: [],
    shortestPath: []
};

const ANIMATION_SPEED = 10;
const eightDirectionsToggleButton = document.getElementById('eightDirectionsToggleButton');

export default function startAlgorithmAnimation(selectedAlgorithm, startNode, finishNode, 
    gridBoard, lastFinishNode) 
{
    let timeToWait = 0;
    let allowsEightDirectionalMovement = false;
    let isJumpPointSearch = false;

    Animation.visitedNodesFromStart.length = 0;
    Animation.visitedNodesFromFinish = 0;
    Animation.shortestPath = 0;
    
    switch (selectedAlgorithm) 
    {
        case 'dijkstra':
            [Animation.visitedNodesFromStart, Animation.shortestPath] = 
                dijkstra(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'aStar':
            [Animation.visitedNodesFromStart, Animation.shortestPath] = 
                aStar(gridBoard, startNode, finishNode);
    
            allowsEightDirectionalMovement = true;

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'greedyBestFirstSearch':
            [Animation.visitedNodesFromStart, Animation.shortestPath] = 
                greedyBestFirstSearch(gridBoard, startNode, finishNode);

            allowsEightDirectionalMovement = true;

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'breadthFirstSearch':
            gridBoard.removeWeights();

            [Animation.visitedNodesFromStart, Animation.shortestPath] = 
                breadthFirstSearch(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'bidirectionalDijkstra':
            [Animation.visitedNodesFromStart, Animation.visitedNodesFromFinish, Animation.shortestPath] =
                bidirectionalDijkstra(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'bidirectionalAStar':
            [Animation.visitedNodesFromStart, Animation.visitedNodesFromFinish, Animation.shortestPath] =
                bidirectionalAStar(gridBoard, startNode, finishNode);

            allowsEightDirectionalMovement = true;

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'depthFirstSearch':
            gridBoard.removeWeights();

            [Animation.visitedNodesFromStart, Animation.shortestPath] = 
                depthFirstSearch(gridBoard, startNode, finishNode);

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;

        case 'jumpPointSearch':
            gridBoard.removeWeights();

            [Animation.visitedNodesFromStart, Animation.shortestPath] = 
                jumpPointSearch(gridBoard, startNode, finishNode);

            allowsEightDirectionalMovement = true;
            isJumpPointSearch = true;

            timeToWait = animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, 
                lastFinishNode);
            break;
            
        default:
            break;
    }

    return timeToWait;
}

function animateAlgorithm(gridBoard, allowsEightDirectionalMovement, isJumpPointSearch, lastFinishNode) 
{
    for (const [animationName, nodesToAnimate] of Object.entries(Animation))
    {
        let animationDelay = 0;

        if (animationName === 'shortestPath')
            animationDelay = Animation.visitedNodesFromStart.length;
        
        for (let i = 0; i < nodesToAnimate.length; i++)
        {
            setTimeout(function()
            {
                const node = nodesToAnimate[i];
                const nodeID = document.getElementById(`node-${node.row}-${node.column}`);

                if (animationName === 'shortestPath')
                {
                    switch (nodeID.className)
                    {
                        case NodeType.startVisited:
                            nodeID.className = NodeType.startShortestPath;
                            break;

                        case NodeType.finishVisited:
                            nodeID.className = NodeType.finishShortestPath;
                            break;
                    
                        case NodeType.visited:
                        case NodeType.visitedByPreviousAlgorithm:
                        case NodeType.lightWeight:
                        case NodeType.normalWeight:
                        case NodeType.heavyWeight:
                            nodeID.className = NodeType.shortestPath;
                            break;
                    }
                }

                else
                {
                    switch(nodeID.className)
                    {
                        case NodeType.start:
                            nodeID.className = NodeType.startVisited;
                            break;

                        case NodeType.finish:
                            nodeID.className = NodeType.finishVisited;
                            break;

                        case NodeType.unvisited:
                        case NodeType.lightWeight:
                        case NodeType.normalWeight:
                        case NodeType.heavyWeight:
                            nodeID.className = NodeType.visited;
                            break;
                    }
                }
            }, (animationDelay + i) * ANIMATION_SPEED);
        }
    }

    const timeToWait = (Animation.visitedNodesFromStart.length + Animation.shortestPath.length) * ANIMATION_SPEED;

    /* Only enable the UI after the algorithm is done with all finish nodes */
    if (lastFinishNode === true)
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
            if (eightDirectionsToggleButton.checked === true && 
                isJumpPointSearch === false) 
                enableCornerCutting();
        }, timeToWait);
    }

    return timeToWait;
}