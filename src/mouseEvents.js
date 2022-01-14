'use strict';

export {handleMouseDownAndEnter};
import {infoBoxVisible} from './infoBox.js';
import {changeWallStatus} from './helperFunctions.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy, 
    changeWeightOfNode} from './weights.js';

function handleMouseDownAndEnter(ev, mouseEvent, gridBoard) {
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
            if (this.className === 'finish' || 
                this.className === 'finishVisited' ||
                this.className === 'finishShortestPath') {
                gridBoard.finishIsPlaced = false;
            }
            
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                'unvisited';
            const [descriptor, row, col] = this.id.split('-');
            gridBoard.startRow = row;
            gridBoard.startCol = col;
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                'start';
            this.className = 'start';
            gridBoard.startIsPlaced = true;
        }

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

        else {
            switch(this.className) {
                case 'unvisited':
                case 'lightWeight':
                case 'normalWeight':
                case 'heavyWeight':
                case 'visited':
                case 'shortestPath':
                    this.className = 'wall';
                    changeWallStatus(this.id, true, gridBoard);
                    changeWeightOfNode(this.id, NODE_WEIGHT_NONE, gridBoard);
                    break;

                case 'wall':
                    this.className = 'unvisited';
                    changeWallStatus(this.id, false, gridBoard);
                    break;

                case 'start':
                    this.className = 'unvisited';
                    gridBoard.startIsPlaced = false;
                    break;

                case 'startVisited':
                    this.className = 'visited';
                    gridBoard.startIsPlaced = false;
                    break;

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

    else if (gridBoard.pressedKey === 'q') {
        switch(this.className) {
            case 'unvisited':
            case 'wall':
            case 'normalWeight':
            case 'heavyWeight':
            case 'visited':
            case 'shortestPath':
                this.className = 'lightWeight';
                changeWeightOfNode(this.id, nodeWeightLight, gridBoard);
                break;

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