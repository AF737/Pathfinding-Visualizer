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
    const NODE_WEIGHT_NONE = 0;
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
    
    var algorithmDropDownButton = document.getElementById('algorithmDropDownButton');
    var algorithmDropDownMenu = document.getElementById('algorithmDropDownMenu');
    var weightDropDownButton = document.getElementById('weightDropDownButton');
    var weightDropDownMenu = document.getElementById('weightDropDownMenu');
    var lightWeightSlider = document.getElementById('lightWeightSlider');
    var normalWeightSlider = document.getElementById('normalWeightSlider');
    var heavyWeightSlider = document.getElementById('heavyWeightSlider');
    var directionsToggleButton = document.getElementById('directionsToggleButton');
    var eightDirections = false;
    var animateAlgorithmButton = document.getElementById('animateAlgorithm');
    var clearAlgorithmButton = document.getElementById('clearAlgorithm');
    var clearWallsButton = document.getElementById('clearWalls');
    var clearWeightsButton = document.getElementById('clearWeights');
    var resetBoardButton = document.getElementById('resetBoard');
    var infoBox = document.getElementById('infoBox');
    var currInfoBoxPage = document.getElementById('currInfoBoxPage');
    var infoBoxText = document.getElementById('infoBoxText');
    var skipInfoBoxButton = document.getElementById('skipInfoBoxButton');
    var prevInfoBoxButton = document.getElementById('prevInfoBoxButton');
    var nextInfoButton = document.getElementById('nextInfoBoxButton');
    var infoBoxPage = 0;
    var infoBoxVisible = true;
    var board = document.getElementById('board');
    var openInfoBoxButton = document.getElementById('openInfoBox');
    var cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');
    var cornerCutting = false;

    /* TODO:
       - Clean up code
       - Decide if className should stay or be replaced with isStart, isFinish...
        because both do the same thing */

    document.addEventListener('keydown', function(ev) {
        gridBoard.pressedKey = ev.key;
    });

    document.addEventListener('keyup', function() {
        gridBoard.pressedKey = null;
    });

    function setupAlgorithmRadioButtons() {
        let radioButtons = document.querySelectorAll('input[name="algorithmOption"]');

        for (let i = 0; i < radioButtons.length; i++) {
            radioButtons[i].addEventListener('change', function() {
                let animateButtonText = 'Animate ';

                switch(radioButtons[i].value) {
                    case 'dijkstra':
                    animateButtonText += 'Dijkstra\'s';
                    break;
                case 'aStar':
                    animateButtonText += 'A*';
                    break;
                case 'greedyBFS':
                    animateButtonText += 'Greedy';
                    break;
                case 'breadthFirstSearch':
                    animateButtonText += 'Breadth-First';
                    break;
                case 'bidirectionalDijkstra':
                    animateButtonText += 'Bi. Dijkstra\'s';
                    break;
                case 'bidirectionalAStar':
                    animateButtonText += 'Bi. A*';
                    break;
                case 'depthFirstSearch':
                    animateButtonText += 'DFS';
                    break;
                case 'jumpPointSearch':
                    animateButtonText += 'JPS';
                    break;
                }

                animateAlgorithmButton.innerHTML = animateButtonText;
                algorithmDropDownButton.style.border = '1px solid white';
            });
        }
    }

    setupAlgorithmRadioButtons();

    algorithmDropDownButton.addEventListener('click', function() {
        /* The first time clicking the button no inline style will be set (it's an empty
            string) */
        if (algorithmDropDownMenu.style.display === '' || 
                algorithmDropDownMenu.style.display === 'none') {
            algorithmDropDownMenu.style.display = 'block';
            algorithmDropDownButton.innerHTML = 'Algorithms&#9650;'
        }

        else {
            algorithmDropDownMenu.style.display = 'none';
            algorithmDropDownButton.innerHTML = 'Algorithms&#9660;'
        }
    });

    algorithmDropDownMenu.addEventListener('mouseleave', function() {
        algorithmDropDownMenu.style.display = 'none';
        algorithmDropDownButton.innerHTML = 'Algorithms&#9660;'
    });

    weightDropDownButton.addEventListener('click', function() {
        if (weightDropDownMenu.style.display === '' || 
                weightDropDownMenu.style.display === 'none') {
            weightDropDownMenu.style.display = 'block';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9650;';
        }

        else {
            weightDropDownMenu.style.display = 'none';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
        }
    });

    weightDropDownMenu.addEventListener('mouseleave', function() {
        weightDropDownMenu.style.display = 'none';
        weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
    });

    lightWeightSlider.addEventListener('input', function() {
        NODE_WEIGHT_LIGHT = parseInt(lightWeightSlider.value, 10);
        document.getElementById('lightWeightLabel').innerHTML = lightWeightSlider.value;
        
        /* Change the weight value of all lightweight nodes that are already placed on
            the grid */
        let leightWeights = document.getElementsByClassName('lightWeight');

        for (let i = 0; i < leightWeights.length; i++) {
            changeWeightOfNode(leightWeights[i].id, NODE_WEIGHT_LIGHT);
        }
    });

    normalWeightSlider.addEventListener('input', function() {
        NODE_WEIGHT_NORMAL = parseInt(normalWeightSlider.value, 10);
        document.getElementById('normalWeightLabel').innerHTML = normalWeightSlider.value;
    
        let normalWeights = document.getElementsByClassName('lightWeight');

        for (let i = 0; i < normalWeights.length; i++) {
            changeWeightOfNode(normalWeights[i].id, NODE_WEIGHT_NORMAL);
        }
    });

    heavyWeightSlider.addEventListener('input', function() {
        NODE_WEIGHT_HEAVY = parseInt(heavyWeightSlider.value, 10);
        document.getElementById('heavyWeightLabel').innerHTML = heavyWeightSlider.value;
    
        let heavyWeights = document.getElementsByClassName('heavyWeight');

        for (let i = 0; i < heavyWeights.length; i++) {
            changeWeightOfNode(heavyWeights[i].id, NODE_WEIGHT_HEAVY);
        }
    });

    clearAlgorithmButton.addEventListener('click', function() {
        removePreviousAlgorithm();
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
        removePreviousAlgorithm();
    });

    function closeInfoBox() {
        let overlays = document.getElementsByClassName('overlay');
        
        for (let i = 0; i < overlays.length; i++) {
            overlays[i].style.opacity = '1';
        }

        enableButtons();

        infoBoxVisible = false;

        infoBox.style.display = 'none';
    }

    skipInfoBoxButton.addEventListener('click', closeInfoBox);

    function updateCurrPage(currPage) {
        currInfoBoxPage.innerHTML = `${currPage + 1}/6`;
    }

    prevInfoBoxButton.addEventListener('click', function() {
        if (infoBoxPage > 0) {
            infoBoxPage--;
            updateCurrPage(infoBoxPage);
        }

        if (infoBoxPage === 0) {
            prevInfoBoxButton.disabled = true;
        }

        nextInfoButton.innerHTML = 'Next';
        displayInfoBoxText(infoBoxPage);
    });

    function nextInfoBoxPage() {
        if (infoBoxPage < 5) {
            infoBoxPage++;
            updateCurrPage(infoBoxPage);
        }

        if (infoBoxPage > 0) {
            prevInfoBoxButton.disabled = false;
        }

        displayInfoBoxText(infoBoxPage);
    }

    nextInfoButton.addEventListener('click', function() {
        if (infoBoxPage === 4) {
            nextInfoButton.innerHTML = 'Finish';
            nextInfoBoxPage();
        }

        else if (infoBoxPage === 5) {
            closeInfoBox();
        }

        else {
            nextInfoButton.innerHTML = 'Next';
            nextInfoBoxPage();
        }
    });

    function displayInfoBoxText(currentPage) {
        switch (currentPage) {
            case 0:
                infoBoxText.innerHTML = `<h2 class="h2InfoBox">Welcome to my Pathfinding
                Visualizer</h2>
                <h3 class="h3InfoBox">This project was inspired by Clément Mihailescu
                    <br/>You can check out his pathfinding visualizer 
                    <a href="https://github.com/clementmihailescu/Pathfinding-Visualizer">
                    here</a>
                </h3>
                <p class="pInfoBox">This project was created to visualize different 
                    pathfinding algorithms, but what is a that? These kinds of algorithms 
                    are used to find the shortest path between to points (here nodes 
                    on a 2d-grid). <br/>Please note that not all algorithms that are
                    listed here <strong>guarantee</strong> the shortest path. 
                    <br/>You can skip this introductory tutorial at any point by clicking 
                    the "Skip"-button. Otherwise press "Next" for more info about this project.
                </p>`

                break;
            case 1:
                infoBoxText.innerHTML = `<h2 class="h2InfoBox">Selecting an algorithm</h2>
                <h3 class="h3InfoBox">You can select an algorithm from the first dropdown menu
                    titled "Pick An Algorithm"
                </h3>
                <p class="pInfoBox">Please note that some of these algorithms are weighted 
                    while others are unweighed. <br/> <strong>Weighted</strong> 
                    algorithms allow for weights to be placed on the 2d-grid, which are harder 
                    to traverse than an empty field, but not impossible like walls. <br/> 
                    <strong>Unweighted</strong> algorithms do not allow for the 
                    placement of weights.</p>`;

                break;
            case 2:
                infoBoxText.innerHTML = `<h2 class="h2InfoBox">Info about each algorithm
                1/2</h2>
                <p class="pInfoBox">Dijkstra's algorithm (weighted): Explores all directions
                    equally and guarantees the shortest path from start to finish.
                    <br/>A* algorithm (weighted): Uses heuristics and the distance from start 
                    to each node to first explore nodes which promise a short path therefore 
                    reducing the number of nodes that need to be visited.
                    Also guarantees the shortest path. <br/>Greedy best-first search (weighted): 
                    Like A*, but it relies solely on heuristics, because it does not take the
                    distance from the start to the current node into account. It is faster than
                    A*, but does not guarantee the shortest path. <br/>Breadth-first search
                    (unweighted): Like Dijkstra, but it does not take weights into account.
                </p>`;
                
                break;
            case 3:
                infoBoxText.innerHTML = `<h2 class="h2InfoBox">Info about each algorithm
                2/2</h2>
                <p class="pInfoBox">Bidirectional Dijkstra's algorithm (weighted): Here Dijkstra's algorithm
                    begins from both the start and finsih node. The first point where both
                    algorithms meet has to be part of the connecting path therefore not
                    guaranteeing the shorest path. <br/>Bidirectional A* algorithm (weighted):
                    Again both start and finish node use A* algorithm to reach each other and
                    there is no guarantee that the found path is the shortest one. <br/>
                    Depth-first search (unweighted): It explores every chosen path until it 
                    reaches the edge of the grid without any heuristics and is therefore slow
                    and and does not guarantee the shortest path. <br/>Jump Point Search 
                    (unweighted): An improved version of the A* algorithm where instead of 
                    checking each individual neighbor the algorithm jumps into these directions
                    to see if there are any "jump points" (i.e. points next to walls) and then 
                    starts jumping from there. This algorithm also guarantees the shortest path.
                </p>`;

                break;
            case 4:
                infoBoxText.innerHTML = `<h2 class="h2InfoBox">Overview of features 1/2</h2>
                <p class="pInfoBox">Walls can be easily added by left-clicking on a tile and
                    removed by once again left-clicking on that tile. <br/>There are three
                    different weights which can be placed by left-clicking while pressing either of
                    these buttons: <span style="color: #32ccb2">Q</span>, <span style="color: #e8dd19">
                    W</span>, <span style="color: #06d314">E</span>. Their values can be adjusted 
                    individually by using the "Adjust Weights" menu and they can be removed by pressing
                    the same key and left-clicking. <br/>The start and finish node 
                    can be moved by simply left-clicking on them and then clicking the tile where you 
                    want to place them. <br/>
                </p>
                <img src="images/walls_weights_movement.gif"/>`;
                    
                break;
            case 5:
                infoBoxText.innerHTML = `<h2 class="h2InfoBox">Overview of features 2/2</h2>
                <p class="pInfoBox">Clear Algorithm: Removes the previous algorithm while leaving the
                    walls and weights in their place. <br/>Clear Walls: Removes all walls. <br/>
                    Clear Weights: Removes all weights. <br/>Reset Board: Returns the board to its
                    original look so that all walls and weights are removed and the start and finish
                    node are in their original places too.
                </p>`;

                break;
        }
    }

    var dic = {
        'algorithmButton': {
            'en': 'Algorithms&#9660;',
            'de': 'Algorithmen&#9660;'
        },
        'weightButton': {
            'en': 'Adjust Weights&#9660',
            'de': 'Gewichte Anpassen&#9660'
        },
        'animateAlgoButton': {
            'en': 'Animate',
            'de': 'Animiere'
        }
    };

    // https://stackoverflow.com/questions/42494867/i-want-to-translate-my-html-text
    var langs = ['en', 'de'];
    let ind = 0;

    function translate(lang) {
        let data = document.querySelectorAll('[data-translate]');
        
        for (let i = 0; i < data.length; i++) {
            data[i].innerHTML = dic[data[i].dataset.translate][lang];
            data[i].dataset.lang = lang;
        }
    }

    function trans() {
        ind = 1 - ind;
        let lang = langs[ind];
        translate(lang);
    }

    openInfoBoxButton.addEventListener('click', function() {
        disableButtons();
        infoBoxVisible = true;

        infoBox.style.display = 'inline';
    });

    animateAlgorithmButton.addEventListener('click', function() {
        let selectedAlgorithm = document.querySelector('input[name="algorithmOption"]:checked');
        // console.log(selectedAlgorithm.value);
        /* If no algorithm has been selected */
        if (selectedAlgorithm === null) {
            animateAlgorithmButton.innerHTML = 'Select An Algorithm';

            algorithmDropDownButton.style.border = '3px solid red';
        }

        else {
            if (directionsToggleButton.checked === true) {
                eightDirections = true;
            }

            else {
                eightDirections = false;
            }

            if (cornerCuttingToggleButton.checked === true) {
                cornerCutting = true;
            }

            else {
                cornerCutting = false;
            }

            algorithmDropDownMenu.style.display = 'none';
            algorithmDropDownButton.innerHTML = 'Animate&#9660;';
            weightDropDownMenu.style.display = 'none';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
            removePreviousAlgorithm();
            disableButtons();
            gridBoard.algoIsRunning = true;

            switch (selectedAlgorithm.value) {
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
        // console.log(eightDirections);
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
            aStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);
        
        animateAlgorithm(visitedNodes, null, shortestPath);
    }

    function animateGreedyBFS() {
        let startNode = gridBoard.nodesMatrix[START_ROW][START_COL];
        let finishNode = gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL];

        const [visitedNodes, path] = 
            greedyBFS(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

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
            bidirectionalAStar(gridBoard, startNode, finishNode, eightDirections, cornerCutting);

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

                if (i === 0) {
                    document.getElementById(`node-${currentNode.row}-${currentNode.column}`)
                        .className = 'startVisited';
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
            }, (visitedNodesFromStart.length  + shortestPath.length) * ANIMATION_SPEED);
        }

        else {
            setTimeout(function() {
                gridBoard.algoIsRunning = false;
                enableButtons();
            }, visitedNodesFromStart.length * ANIMATION_SPEED);
        }
    }

    function adjustGridDimensions() {
        //let board = document.getElementById('board');
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
        board.style.marginTop = '50px';
        board.style.gridTemplateColumns = `${Math.floor(boardWidth / 20)}`;
        board.style.gridTemplateRows = `${Math.floor(boardHeight / 20)}`;
    }

    adjustGridDimensions();

    function createGrid() {
        console.log('x');
        //let board = document.getElementById('board');
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

                if (row === START_ROW && col === START_COL) {
                    gridBoard.startIsPlaced = true;
                    newNodeClass = 'start';
                }

                else if (row === FINISH_ROW && col === FINISH_COL) {
                    gridBoard.finishIsPlaced = true;
                    newNodeClass = 'finish';
                }

                else {
                    newNodeClass = 'unvisited';
                }

                newNode = new Node(newNodeIndex, row, col, newNodeClass);
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
    }

    createGrid();

    function handleMouseDownAndEnter(ev, actualThis, mouseEvent) {
        ev.preventDefault();

        if (gridBoard.algoIsRunning === true || infoBoxVisible === true) {
            return;
        }

        if (mouseEvent === 'mouseDown') {
            gridBoard.mouseIsPressed = true;
        }

        else if (gridBoard.mouseIsPressed === false && 
            mouseEvent === 'mouseEnter') {
                return;
        }

        if (gridBoard.pressedKey === null) {
            if (gridBoard.startIsPlaced === false) {
                if (actualThis.className === 'finish' || 
                    actualThis.className === 'finishVisited' ||
                    actualThis.className === 'finishShortestPath') {
                    gridBoard.finishIsPlaced = false;
                }
                
                gridBoard.nodesMatrix[START_ROW][START_COL].class = 'unvisited';
                const [descriptor, row, col] = actualThis.id.split('-');
                START_ROW = row;
                START_COL = col;
                gridBoard.nodesMatrix[START_ROW][START_COL].class = 'start';
                actualThis.className = 'start';
                gridBoard.startIsPlaced = true;
            }

            else if (gridBoard.finishIsPlaced === false) {
                if (actualThis.className === 'start' ||
                    actualThis.className === 'startVisited' ||
                    actualThis.className === 'startShortestPath') {
                    gridBoard.startIsPlaced = false;
                }

                gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL].class = 'unvisited';
                const [descriptor, row, col] = actualThis.id.split('-');
                FINISH_ROW = row;
                FINISH_COL = col;
                gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL].class = 'finish';
                actualThis.className = 'finish';
                gridBoard.finishIsPlaced = true;
            }

            else {
                switch(actualThis.className) {
                    case 'unvisited':
                    case 'lightWeight':
                    case 'normalWeight':
                    case 'heavyWeight':
                    case 'visited':
                    case 'shortestPath':
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

                    case 'startVisited':
                        actualThis.className = 'visited';
                        gridBoard.startIsPlaced = false;

                        break;

                    case 'startShortestPath':
                        actualThis.className = 'shortestPath';
                        gridBoard.startIsPlaced = false;

                        break;

                    case 'finish':
                        actualThis.className = 'unvisited';
                        gridBoard.finishIsPlaced = false;

                        break;

                    case 'finishVisited':
                        actualThis.className = 'visited';
                        gridBoard.finishIsPlaced = false;

                        break;

                    case 'finishShortestPath':
                        actualThis.className = 'shortestPath';
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
                case 'visited':
                case 'shortestPath':
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
                case 'visited':
                case 'shortestPath':
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
                case 'visited':
                case 'shortestPath':
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

        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                console.log(gridBoard.nodesMatrix[row][col].isWall);
            }
        }
    }

    function removePreviousAlgorithm() {
        for (let row = 0; row < gridBoard.rows; row++) {
            for (let col = 0; col < gridBoard.columns; col++) {
                let node = document.getElementById(`node-${row}-${col}`);

                if (node.className === 'visited' || node.className === 'shortestPath') {
                    gridBoard.nodesMatrix[row][col].isVisited = false;
                    node.className = 'unvisited';
                }

                gridBoard.nodesMatrix[row][col].isVisited = false;
                gridBoard.nodesMatrix[row][col].distanceFromStart = Infinity;
                gridBoard.nodesMatrix[row][col].distanceFromFinish = Infinity;
                gridBoard.nodesMatrix[row][col].heuristicDistance = Infinity;
                gridBoard.nodesMatrix[row][col].totalDistance = Infinity;
                gridBoard.nodesMatrix[row][col].prevNode = null;
                gridBoard.nodesMatrix[row][col].prevNodeFromFinish = null;
                gridBoard.nodesMatrix[row][col].direction = null;
            }
        }

        gridBoard.nodesMatrix[START_ROW][START_COL].isVisited = false;
        document.getElementById(`node-${START_ROW}-${START_COL}`).className = 'start';
        gridBoard.nodesMatrix[FINISH_ROW][FINISH_COL].isVisited = false;
        document.getElementById(`node-${FINISH_ROW}-${FINISH_COL}`).className = 'finish';
        // console.log(board);
        // if (row === START_ROW && col === START_COL) {
        //     gridBoard.nodesMatrix[row][col].isVisited = false;
        //     node.className = 'start';
        // }

        // else if (row === FINISH_ROW && col === FINISH_COL) {
        //     gridBoard.nodesMatrix[row][col].isVisited = false;
        //     node.className = 'finish';
        // }
    }

    function enableButtons() {
        let dropDownButtons = document.getElementsByClassName('dropDownButton');

        for (let i = 0; i < dropDownButtons.length; i++) {
            dropDownButtons[i].disabled = false;
        }

        let menuButtons = document.getElementsByClassName('menuButton');

        for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].disabled = false;
        }
    }

    function disableButtons() {
        let dropDownButtons = document.getElementsByClassName('dropDownButton');

        for (let i = 0; i < dropDownButtons.length; i++) {
            dropDownButtons[i].disabled = true;
        }

        let menuButtons = document.getElementsByClassName('menuButton');

        for (let i = 0; i < menuButtons.length; i++) {
            menuButtons[i].disabled = true;
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