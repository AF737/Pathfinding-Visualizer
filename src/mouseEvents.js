'use strict';

export {handleMouseDownAndEnter};
import {infoBoxVisible} from './infoBox.js';
import {changeWallStatus} from './helperFunctions.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy, 
    changeWeightOfNode} from './weights.js';

function handleMouseDownAndEnter(mouseEvent, gridBoard) {
    /* Disable click events while an algorithm is running or the info box is up */
    if (gridBoard.algoIsRunning === true || infoBoxVisible === true) {
        return;
    }

    if (mouseEvent === 'mouseDown') {
        gridBoard.mouseIsPressed = true;
    }

    /* Prevents walls from being placed when the user's just moving his cursor
        across the board without clicking the left mouse button */
    else if (gridBoard.mouseIsPressed === false && 
        mouseEvent === 'mouseEnter') {
            return;
    }

    if (gridBoard.pressedKey === null) {
        if (gridBoard.startIsPlaced === false) {
            /* If start is placed where finish was */
            if (this.className === 'finish' || 
                this.className === 'finishVisited' ||
                this.className === 'finishShortestPath') {
                gridBoard.finishIsPlaced = false;
            }
            
            /* Reset the old position of start to be unvisited */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                'unvisited';
            const [descriptor, row, col] = this.id.split('-');
            /* Update the coordinates of start */
            gridBoard.startRow = row;
            gridBoard.startCol = col;
            /* Mark the new node as the starting point */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                'start';
            /* Color the node that is being clicked with the start color */
            this.className = 'start';
            gridBoard.startIsPlaced = true;
        }

        /* If finish is placed where start was */
        else if (gridBoard.finishIsPlaced === false) {
            if (this.className === 'start' ||
                this.className === 'startVisited' ||
                this.className === 'startShortestPath') {
                gridBoard.startIsPlaced = false;
            }

            gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol].class = 
                'unvisited';
            const [descriptor, row, col] = this.id.split('-');
            gridBoard.finishRow = row;
            gridBoard.finishCol = col;
            gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol].class = 
                'finish';
            this.className = 'finish';
            gridBoard.finishIsPlaced = true;
        }

        /* Any node except for start and finish */
        else {
            switch(this.className) {
                /* Simple left-click creates a wall at this node */
                case 'unvisited':
                case 'lightWeight':
                case 'normalWeight':
                case 'heavyWeight':
                case 'visited':
                case 'shortestPath':
                case 'jumpPoint':
                    this.className = 'wall';
                    changeWallStatus(this.id, true, gridBoard);
                    changeWeightOfNode(this.id, NODE_WEIGHT_NONE, gridBoard);
                    break;

                /* Left-clicking on a wall removes it */
                case 'wall':
                    this.className = 'unvisited';
                    changeWallStatus(this.id, false, gridBoard);
                    break;

                /* Start is removed and will be placed at the next node clicked at */
                case 'start':
                    this.className = 'unvisited';
                    gridBoard.startIsPlaced = false;
                    break;

                case 'startVisited':
                    this.className = 'visited';
                    gridBoard.startIsPlaced = false;
                    break;

                /* If start is clicked after the algorithm's done */
                case 'startShortestPath':
                    this.className = 'shortestPath';
                    gridBoard.startIsPlaced = false;
                    break;

                case 'finish':
                    this.className = 'unvisited';
                    gridBoard.finishIsPlaced = false;
                    break;

                case 'finishVisited':
                    this.className = 'visited';
                    gridBoard.finishIsPlaced = false;
                    break;

                case 'finishShortestPath':
                    this.className = 'shortestPath';
                    gridBoard.finishIsPlaced = false;
                    break;
            }
        }
    }

    /* If the user presses "q" while left-clicking */
    else if (gridBoard.pressedKey === 'q') {
        switch(this.className) {
            /* Change the current node to be a light weight one */
            case 'unvisited':
            case 'wall':
            case 'normalWeight':
            case 'heavyWeight':
            case 'visited':
            case 'shortestPath':
            case 'jumpPoint':
                this.className = 'lightWeight';
                changeWeightOfNode(this.id, nodeWeightLight, gridBoard);
                break;

            /* Reset a light weight node to be a normal one */
            case 'lightWeight':
                this.className = 'unvisited';
                changeWeightOfNode(this.id, NODE_WEIGHT_NONE, gridBoard);
                break;
        }
    }

    else if (gridBoard.pressedKey === 'w') {
        switch(this.className) {
            case 'unvisited':
            case 'wall':
            case 'lightWeight':
            case 'heavyWeight':
            case 'visited':
            case 'shortestPath':
            case 'jumpPoint':
                this.className = 'normalWeight';
                changeWeightOfNode(this.id, nodeWeightNormal, gridBoard);
                break;
            
            case 'normalWeight':
                this.className = 'unvisited';
                changeWeightOfNode(this.id, NODE_WEIGHT_NONE, gridBoard);
                break;
        }
    }

    else if (gridBoard.pressedKey === 'e') {
        switch(this.className) {
            case 'unvisited':
            case 'wall':
            case 'lightWeight':
            case 'normalWeight':
            case 'visited':
            case 'shortestPath':
            case 'jumpPoint':
                this.className = 'heavyWeight';
                changeWeightOfNode(this.id, nodeWeightHeavy, gridBoard);
                break;

            case 'heavyWeight':
                this.className = 'unvisited';
                changeWeightOfNode(this.id, NODE_WEIGHT_NONE, gridBoard);
                break;
        }
    }
}