'use strict';

export {handleMouseDownAndMove};

import {infoBoxVisible} from './infoBox.js';
import {changeWallStatus} from './helperFunctions.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy, 
        changeWeightOfNode} from './weights.js';

let previousTarget = null;

function handleMouseDownAndMove(ev, mouseEvent, gridBoard) {
    /* Disable click events for buttons and the grid */
    if (gridBoard.algoIsRunning === true || infoBoxVisible === true) {
        return;
    }

    if (mouseEvent === 'mouseDown') {
        gridBoard.mouseIsPressed = true;
    }

    /* The user can move the mouse without changing the tile that the mouse is
        over therefore executing this function multiple times. We do nothing after
        the first click on each tile until the user has changed it to avoid
        toggling walls, weights, start and finish constantly */
    else if (mouseEvent === 'mouseMove' && ev.target === previousTarget) {
        return;
    }

    /* Prevents walls from being placed when the user's just moving his cursor
        across the board without clicking the left mouse button */
    else if (gridBoard.mouseIsPressed === false && mouseEvent === 'mouseMove') {
        return;
    }

    previousTarget = ev.target;

    if (gridBoard.pressedKey === null) {
        if (gridBoard.startIsPlaced === false) {
            /* If start is placed where finish was */
            if (ev.target.className === 'finish' || 
                ev.target.className === 'finishVisited' ||
                ev.target.className === 'finishShortestPath') {
                    gridBoard.finishIsPlaced = false;
            }
            
            /* Reset the old position of start to be unvisited */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                'unvisited';
            const [descriptor, row, col] = ev.target.id.split('-');
            /* Update the coordinates of start */
            gridBoard.startRow = row;
            gridBoard.startCol = col;
            /* Mark the new node as the starting point */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                'start';
            /* Color the node that is being clicked with the start color */
            ev.target.className = 'start';
            gridBoard.startIsPlaced = true;
        }

        /* If finish is placed where start was */
        else if (gridBoard.finishIsPlaced === false) {
            if (ev.target.className === 'start' ||
                ev.target.className === 'startVisited' ||
                ev.target.className === 'startShortestPath') {
                    gridBoard.startIsPlaced = false;
            }

            gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol].class = 
                'unvisited';
            const [descriptor, row, col] = ev.target.id.split('-');
            gridBoard.finishRow = row;
            gridBoard.finishCol = col;
            gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol].class = 
                'finish';
            ev.target.className = 'finish';
            gridBoard.finishIsPlaced = true;
        }

        else {
            switch(ev.target.className) {
                /* Simple left-click creates a wall */
                case 'unvisited':
                case 'lightWeight':
                case 'normalWeight':
                case 'heavyWeight':
                case 'visited':
                case 'shortestPath':
                case 'jumpPoint':
                    ev.target.className = 'wall';
                    changeWallStatus(ev.target.id, true, gridBoard);
                    changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
                    break;

                /* Left-clicking on a wall removes it */
                case 'wall':
                    ev.target.className = 'unvisited';
                    changeWallStatus(ev.target.id, false, gridBoard);
                    break;

                /* Start is removed and will be placed at the next node clicked at */
                case 'start':
                    ev.target.className = 'unvisited';
                    gridBoard.startIsPlaced = false;
                    break;

                case 'startVisited':
                    ev.target.className = 'visited';
                    gridBoard.startIsPlaced = false;
                    break;

                /* If start is clicked after the algorithm's done */
                case 'startShortestPath':
                    ev.target.className = 'shortestPath';
                    gridBoard.startIsPlaced = false;
                    break;

                case 'finish':
                    ev.target.className = 'unvisited';
                    gridBoard.finishIsPlaced = false;
                    break;

                case 'finishVisited':
                    ev.target.className = 'visited';
                    gridBoard.finishIsPlaced = false;
                    break;

                case 'finishShortestPath':
                    ev.target.className = 'shortestPath';
                    gridBoard.finishIsPlaced = false;
                    break;
            }
        }
    }

    /* If the user presses the "q" key while left-clicking */
    else if (gridBoard.pressedKey === 'q') {
        switch(ev.target.className) {
            /* Change the current node to be a light weight one */
            case 'unvisited':
            case 'wall':
            case 'normalWeight':
            case 'heavyWeight':
            case 'visited':
            case 'shortestPath':
            case 'jumpPoint':
                ev.target.className = 'lightWeight';
                changeWeightOfNode(ev.target.id, nodeWeightLight, gridBoard);
                break;

            /* Reset a light weight node to be a normal one */
            case 'lightWeight':
                ev.target.className = 'unvisited';
                changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
                break;
        }
    }

    else if (gridBoard.pressedKey === 'w') {
        switch(ev.target.className) {
            case 'unvisited':
            case 'wall':
            case 'lightWeight':
            case 'heavyWeight':
            case 'visited':
            case 'shortestPath':
            case 'jumpPoint':
                ev.target.className = 'normalWeight';
                changeWeightOfNode(ev.target.id, nodeWeightNormal, gridBoard);
                break;
            
            case 'normalWeight':
                ev.target.className = 'unvisited';
                changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
                break;
        }
    }

    else if (gridBoard.pressedKey === 'e') {
        switch(ev.target.className) {
            case 'unvisited':
            case 'wall':
            case 'lightWeight':
            case 'normalWeight':
            case 'visited':
            case 'shortestPath':
            case 'jumpPoint':
                ev.target.className = 'heavyWeight';
                changeWeightOfNode(ev.target.id, nodeWeightHeavy, gridBoard);
                break;

            case 'heavyWeight':
                ev.target.className = 'unvisited';
                changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
                break;
        }
    }
}