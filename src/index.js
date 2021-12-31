'use strict';

import Node from './node.js';
import Board from './board.js';
import {dijkstra} from './algorithms/dijkstra.js';
import {aStar} from './algorithms/aStar.js';
import {greedyBFS} from './algorithms/greedyBFS.js';
import {breadthFirstSearch} from './algorithms/breadthFirstSearch.js';
import {bidirectionalDijkstra} from './algorithms/bidirectionalDijkstra.js';
import {bidirectionalAStar} from './algorithms/bidirectionalAStar.js';
import {depthFirstSearch} from './algorithms/depthFirstSearch.js';
import {jumpPointSearch2} from './algorithms/jumpPointSearch2.js';

document.addEventListener('DOMContentLoaded', function() {
    var dijkstraButton = document.getElementById('dijkstra');
    var gridBoard = new Board();
    var START_COL, START_ROW, FINISH_COL, FINISH_ROW;
    var ORIG_START_COL, ORIG_START_ROW, ORIG_FINISH_COL, ORIG_FINISH_ROW;
    const ANIMATION_SPEED = 10;
    const NODE_WEIGHT_NONE = 1;
    var NODE_WEIGHT_LIGHT = 15;
    var NODE_WEIGHT_NORMAL = 30;
    var NODE_WEIGHT_HEAVY = 45;
    var aStarButton = document.getElementById('astar');
    var greedyBFSButton = document.getElementById('greedyBFS');
    var breadthFirstSearchButton = document.getElementById('breadthFirstSearch');
    var bidirectionalDijkstraButton = document.getElementById('bidirectionalDijkstra');
    var bidirectionalAStarButton = document.getElementById('bidirectionalAStar');
    var depthFirstSearchButton = document.getElementById('depthFirstSearch');
    var jumpPointSearchButton = document.getElementById('jumpPointSearch');
    
    var lightWeightSlider = document.getElementById('lightWeightSlider');
    var normalWeightSlider = document.getElementById('normalWeightSlider');
    var heavyWeightSlider = document.getElementById('heavyWeightSlider');
    var directionsToggleButton = document.getElementById('directionsToggleButton');
    var eightDirections = false;
    var animateAlgorithmButton = document.getElementById('animateAlgorithm');
    var clearWallsButton = document.getElementById('clearWalls');
    var clearWeightsButton = document.getElementById('clearWeights');
    var resetBoardButton = document.getElementById('resetBoard');

    /* TODO:
       - Clean up code
       - Decide if className should stay or be replaced with isStart, isFinish...
        because both do the same thing */

    document.addEventListener('keydown', function(ev) {
        gridBoard.pressedKey = ev.key;
    });

    document.addEventListener('keyup', function(ev) {
        gridBoard.pressedKey = null;
    });

    lightWeightSlider.addEventListener('input', function() {
        NODE_WEIGHT_LIGHT = parseInt(lightWeightSlider.value, 10);
        document.getElementById('lightWeightLabel').innerHTML = lightWeightSlider.value;
    });

    normalWeightSlider.addEventListener('input', function() {
        NODE_WEIGHT_NORMAL = parseInt(normalWeightSlider.value, 10);
        document.getElementById('normalWeightLabel').innerHTML = normalWeightSlider.value;
    });

    heavyWeightSlider.addEventListener('input', function() {
        NODE_WEIGHT_HEAVY = parseInt(heavyWeightSlider.value, 10);
        document.getElementById('heavyWeightLabel').innerHTML = heavyWeightSlider.value;
    });

    clearWallsButton.addEventListener('click', function() {
        removeWalls();
    });

    clearWeightsButton.addEventListener('click', function() {
        removeWeights();
    });

    resetBoardButton.addEventListener('click', function() {
        removeWalls();
        removeWeights();
        resetStartAndFinish();
    });

    animateAlgorithmButton.addEventListener('click', function() {
        let selectedAlgorihtm = document.querySelector('input[name="algorithmOption"]:checked');
        
        /* If no algorithm has been selected */
        if (selectedAlgorihtm === null) {
            animateAlgorithmButton.innerHTML = 'Select An Algorithm';
        }

        else {
            if (directionsToggleButton.checked === true) {
                eightDirections = true;
            }

            else {
                eightDirections = false;
            }

            removePreviousAlgorithm();

            switch (selectedAlgorihtm.value) {
                case 'dijkstra':
                    animateDijkstra();
                    break;
                case 'aStar':
                    animateAStar();
                    break;
                case 'greedyBFS':
                    animateGreedyBFS();
                    break;
                case 'breadthFirstSearch':
                    animateBreadthFirstSearch();
                    break;
                case 'bidirectionalDijkstra':
                    animateBidirectionalDijkstra();
                    break;
                case 'bidirectionalAStar':
                    animateBidirectionalAStar();
                    break;
                case 'depthFirstSearch':
                    animateDepthFirstSearch();
                    break;
                case 'jumpPointSearch':
                    animateJumpPointSearch();
                    break;
            }
        }
    });

    function animateDijkstra() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];
        console.log(eightDirections);
        const [visitedNodes, shortestPath] = 
            dijkstra(gridBoard, startNode, finishNode);
        //const shortestP = shortestPath(finishNode);
        //console.log(visitedNodes);
        animateAlgorithm(visitedNodes, null, shortestPath);
    }

    function animateAStar() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];
        
        const [visitedNodes, shortestPath] = 
            aStar(gridBoard, startNode, finishNode, eightDirections);
        animateAlgorithm(visitedNodes, null, shortestPath);
    }

    function animateGreedyBFS() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodes, path] = 
            greedyBFS(gridBoard, startNode, finishNode);
        animateAlgorithm(visitedNodes, null, path);
    }

    function animateBreadthFirstSearch() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        removeWeights();

        const [visitedNodes, shortestPath] = 
            breadthFirstSearch(gridBoard, startNode, finishNode);
        animateAlgorithm(visitedNodes, null, shortestPath);
    }

    function animateBidirectionalDijkstra() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodesFromStart, visitedNodesFromFinish, path] =
            bidirectionalDijkstra(gridBoard, startNode, finishNode);
            
            animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path);
    }

    function animateBidirectionalAStar() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodesFromStart, visitedNodesFromFinish, path] =
            bidirectionalAStar(gridBoard, startNode, finishNode);

            animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, path);
    }

    function animateDepthFirstSearch() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        removeWeights();

        const [visitedNodesFromStart, path] = 
            depthFirstSearch(gridBoard, startNode, finishNode);

        animateAlgorithm(visitedNodesFromStart, null, path);
    }

    function animateJumpPointSearch() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        removeWeights();

        const [visitedNodesFromStart, shortestPath] = 
        jumpPointSearch2(gridBoard, startNode, finishNode);

        animateAlgorithm(visitedNodesFromStart, null, shortestPath);
    }

    function animateAlgorithm(visitedNodesFromStart, visitedNodesFromFinish, shortestPath) {
        for (let i = 0; i < visitedNodesFromStart.length; i++) {
            setTimeout(function() {
                const currentNode = visitedNodesFromStart[i];
                //console.log(currentNode);
                document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                    .className = 'visited';
            }, i * ANIMATION_SPEED);
        }

        if (visitedNodesFromFinish !== null) {
            for (let i = 0; i < visitedNodesFromFinish.length; i++) {
                setTimeout(function() {
                    const currentNode = visitedNodesFromFinish[i];
                    //console.log(currentNode);
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'visited';
                }, i * ANIMATION_SPEED);
            }
        }

        if (shortestPath !== null) {
            for (let i = 0; i < shortestPath.length; i++) {
                setTimeout(function() {
                    const currentNode = shortestPath[i];
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'shortestPath';
                }, (visitedNodesFromStart.length + i) * ANIMATION_SPEED);
            }
        }
    }

    function adjustGridDimensions() {
        let board = document.getElementById('board');
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        let boardWidth = windowWidth - 100 - 
            (windowWidth % 100);
        let boardHeight = windowHeight - 200 -
            (windowHeight % 100);

        board.style.width = `${boardWidth}px`;
        board.style.height = `${boardHeight}px`;
        board.style.marginLeft = `${(windowWidth - 
            boardWidth) / 2}px`;
        /* board.style.marginTop = `${(windowHeight - 
            boardHeight) / 2}px`; */
        board.style.marginTop = `50px`;
        board.style.gridTemplateColumns = `${Math.floor(boardWidth / 20)}`;
        board.style.gridTemplateRows = `${Math.floor(boardHeight / 20)}`;
    }

    adjustGridDimensions();

    function createGrid() {
        console.log('x');
        let board = document.getElementById('board');
        console.log(board.style.width);
        let boardWidth = parseInt(board.style.width, 10);
        let boardHeight = parseInt(board.style.height, 10);
        let numOfCols = Math.floor(boardWidth / 20);
        let numOfRows = Math.floor(boardHeight / 20);

        gridBoard.rows = numOfRows;
        gridBoard.columns = numOfCols;

        START_ROW = ORIG_START_ROW = Math.floor(numOfRows / 2);
        START_COL = ORIG_START_COL = Math.floor(numOfCols / 4);
        FINISH_ROW = ORIG_FINISH_ROW = Math.floor(numOfRows / 2);
        FINISH_COL = ORIG_FINISH_COL = Math.floor((numOfCols / 4) * 3);

        console.log(`${boardWidth}, ${boardHeight}`);
        for (let row = 0; row < numOfRows; row++) {
            const newGridArr = [];
            for (let col = 0; col < numOfCols; col++) {
                let newNodeIndex = `${row}-${col}`, newNodeClass, newNode;
                let isStart = false;
                let isFinish = false;

                if (row === START_ROW && col === START_COL) {
                    gridBoard.startIsPlaced = true;
                    newNodeClass = 'start';
                    isStart = true;
                }

                else if (row === FINISH_ROW && col === FINISH_COL) {
                    gridBoard.finishIsPlaced = true;
                    newNodeClass = 'finish';
                    isFinish = true;
                }

                else {
                    newNodeClass = 'unvisited';
                }

                newNode = new Node(newNodeIndex, row, col, newNodeClass, isStart, isFinish);
                // gridBoard.nodesMatrix.push(newNode);
                newGridArr.push(newNode);

                let newNodeDiv = document.createElement('div');
                newNodeDiv.id = `node-${newNodeIndex}`;
                newNodeDiv.className = `${newNodeClass}`;
                // console.log(newNodeDiv);
                // newNodeDiv.push(newNode);
                /* CSS Grid Layout starts indexing at 1 instead of 0 */
                newNodeDiv.style.gridRow = `${row + 1}`;
                newNodeDiv.style.gridColumn = `${col + 1}`;

                newNodeDiv.addEventListener('mousedown', function(ev) {
                    handleMouseDownAndEnter(ev, this, 'mouseDown');
                });

                newNodeDiv.addEventListener('mouseenter', function(ev) {
                    handleMouseDownAndEnter(ev, this, 'mouseEnter');
                });

                newNodeDiv.addEventListener('mouseup', function(ev) {
                    ev.preventDefault();

                    gridBoard.mouseIsPressed = false;
                });

                // console.log(newNodeDiv);
                board.appendChild(newNodeDiv);
                
            }
            gridBoard.nodesMatrix.push(newGridArr);
        }
        //console.log(gridBoard);
    }

    createGrid();

    function handleMouseDownAndEnter(ev, actualThis, mouseEvent) {
        ev.preventDefault();

        if (mouseEvent === 'mouseDown') {
            gridBoard.mouseIsPressed = true;
        }

        else if (gridBoard.mouseIsPressed === false && 
            mouseEvent === 'mouseEnter') {
                return;
        }

        if (gridBoard.pressedKey === null) {
            if (gridBoard.startIsPlaced === false) {
                if (actualThis.className === 'finish') {
                    gridBoard.finishIsPlaced = false;
                }
                
                const [descriptor, row, col] = actualThis.id.split('-');
                START_ROW = row;
                START_COL = col;
                actualThis.className = 'start';
                gridBoard.startIsPlaced = true;
            }

            else if (gridBoard.finishIsPlaced === false) {
                if (actualThis.className === 'start') {
                    gridBoard.startIsPlaced = false;
                }

                const [descriptor, row, col] = actualThis.id.split('-');
                FINISH_ROW = row;
                FINISH_COL = col;
                actualThis.className = 'finish';
                gridBoard.finishIsPlaced = true;
            }

            else {
                switch(actualThis.className) {
                    case 'unvisited':
                    case 'lightWeight':
                    case 'normalWeight':
                    case 'heavyWeight':
                        actualThis.className = 'wall';
                        changeWallStatus(actualThis.id, true);
                        changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                        break;

                    case 'wall':
                        actualThis.className = 'unvisited';
                        changeWallStatus(actualThis.id, false);

                        break;

                    case 'start':
                        actualThis.className = 'unvisited';
                        gridBoard.startIsPlaced = false;

                        break;

                    case 'finish':
                        actualThis.className = 'unvisited';
                        gridBoard.finishIsPlaced = false;

                        break;
                }
            }
        }

        else if (gridBoard.pressedKey === 'q') {
            switch(actualThis.className) {
                case 'unvisited':
                case 'wall':
                case 'normalWeight':
                case 'heavyWeight':
                    actualThis.className = 'lightWeight';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_LIGHT);

                    break;

                case 'lightWeight':
                    actualThis.className = 'unvisited';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;
            }
        }

        else if (gridBoard.pressedKey === 'w') {
            switch(actualThis.className) {
                case 'unvisited':
                case 'wall':
                case 'lightWeight':
                case 'heavyWeight':
                    actualThis.className = 'normalWeight';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NORMAL);

                    break;
                
                case 'normalWeight':
                    actualThis.className = 'unvisited';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;
            }
        }

        else if (gridBoard.pressedKey === 'e') {
            switch(actualThis.className) {
                case 'unvisited':
                case 'wall':
                case 'lightWeight':
                case 'normalWeight':
                    actualThis.className = 'heavyWeight';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_HEAVY);

                    break;

                case 'heavyWeight':
                    actualThis.className = 'unvisited';
                    changeWeightOfNode(actualThis.id, NODE_WEIGHT_NONE);

                    break;
            }
        }
    }

    function changeWeightOfNode(id, newWeight) {
        const [descriptor, row, col] = id.split('-');

        gridBoard.nodesMatrix[row][col].weight = newWeight;
    }

    function removeWeights() {
        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                if (gridBoard.nodesMatrix[row][col].weight !== NODE_WEIGHT_NONE) {
                    changeWeightOfNode(`node-${row}-${col}`, NODE_WEIGHT_NONE);
                    document.getElementById(`node-${row}-${col}`).className = 'unvisited';
                }
            }
        }
    }

    function changeWallStatus(id, newWallStatus) {
        const [descriptor, row, col] = id.split('-');
        
        gridBoard.nodesMatrix[row][col].isWall = newWallStatus;
    }

    function removeWalls() {
        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                if (gridBoard.nodesMatrix[row][col].isWall === true) {
                    gridBoard.nodesMatrix[row][col].isWall = false;
                    document.getElementById(`node-${row}-${col}`).className = 'unvisited';
                } 
            }
        }
    }

    function removePreviousAlgorithm() {
        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                let node = document.getElementById(`node-${row}-${col}`);

                if (row === START_ROW && col === START_COL) {
                    gridBoard.nodesMatrix[row][col].isVisited = false;
                    node.className = 'start';
                }

                else if (row === FINISH_ROW && col === FINISH_COL) {
                    gridBoard.nodesMatrix[row][col].isVisited = false;
                    node.className = 'finish';
                }

                else if (node.className === 'visited' || node.className === 'shortestPath') {
                    gridBoard.nodesMatrix[row][col].isVisited = false;
                    node.className = 'unvisited';
                }
            }
        }
    }

    function resetStartAndFinish() {
        document.getElementById(`node-${START_ROW}-${START_COL}`).className = 'unvisited';
        document.getElementById(`node-${FINISH_ROW}-${FINISH_COL}`).className = 'unvisited';
        START_ROW = ORIG_START_ROW;
        START_COL = ORIG_START_COL;
        FINISH_ROW = ORIG_FINISH_ROW;
        FINISH_COL = ORIG_FINISH_COL;
        document.getElementById(`node-${START_ROW}-${START_COL}`).className = 'start';
        document.getElementById(`node-${FINISH_ROW}-${FINISH_COL}`).className = 'finish';
    }
}); 