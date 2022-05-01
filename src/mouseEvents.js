'use strict';

export {mouseEvent, handleMouseDownAndMove};

import {infoBoxVisible} from './infoBox.js';
import {changeWallStatus} from './helperFunctions.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy, 
        changeWeightOfNode} from './weights.js';

const mouseEvent = 
{
    down: 'mouseDown',
    move: 'mouseMove'
};

/* Make mouseEvent attributes immutable */
Object.freeze(mouseEvent);

const Node = 
{
    wall: 'wall',
    visited: 'visited',
    unvisited: 'unvisited',
    lightWeight: 'lightWeight',
    normalWeight: 'normalWeight',
    heavyWeight: 'heavyWeight',
    shortestPath: 'shortestPath',
    jumpPoint: 'jumpPoint',
    start: 'start',
    startShortestPath: 'startShortestPath',
    finish: 'finish',
    finishShortestPath: 'finishShortestPath'
};

Object.freeze(Node);

const Key = 
{
    lightWeight: 'q',
    normalWeight: 'w',
    heavyWeight: 'e'
};

Object.freeze(Key);

let previousTarget = null;

function handleMouseDownAndMove(ev, mouseEv, gridBoard) 
{
    /* Disable click events for buttons and the grid */
    if (gridBoard.algoIsRunning === true || infoBoxVisible === true) 
        return;

    if (mouseEv === mouseEvent.down) 
        gridBoard.mouseIsPressed = true;

    /* The user can move the mouse without changing the tile that the mouse is
        over therefore executing this function multiple times. We do nothing after
        the first click on each tile until the user has changed it to avoid
        toggling walls, weights, start and finish constantly */
    else if (mouseEv === mouseEvent.move && ev.target === previousTarget) 
        return;

    /* Prevents walls from being placed when the user's just moving his cursor
        across the board without clicking the left mouse button */
    else if (gridBoard.mouseIsPressed === false && mouseEv === mouseEvent.move) 
        return;

    previousTarget = ev.target;

    if (gridBoard.pressedKey === null) 
    {
        if (gridBoard.startIsPlaced === false) 
        {
            /* If start is placed where finish was */
            if (ev.target.className === Node.finish ||
                ev.target.className === Node.finishShortestPath) 
                    gridBoard.finishIsPlaced = false;
            
            /* Reset the old position of start to be unvisited */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                Node.unvisited;
            const [descriptor, row, col] = ev.target.id.split('-');
            /* Update the coordinates of start */
            gridBoard.startRow = row;
            gridBoard.startCol = col;
            /* Mark the new node as the starting point */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                Node.start;
            /* Color the node that is being clicked with the start color */
            ev.target.className = Node.start;
            gridBoard.startIsPlaced = true;
        }

        /* If finish is placed where start was */
        else if (gridBoard.finishIsPlaced === false) 
        {
            if (ev.target.className === Node.start ||
                ev.target.className === Node.startShortestPath) 
                    gridBoard.startIsPlaced = false;

            gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol].class = 
                Node.unvisited;
            const [descriptor, row, col] = ev.target.id.split('-');
            gridBoard.finishRow = row;
            gridBoard.finishCol = col;
            gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol].class = 
                Node.finish;
            ev.target.className = Node.finish;
            gridBoard.finishIsPlaced = true;
        }

        else 
        {
            switch(ev.target.className) 
            {
                /* Simple left-click creates a wall */
                case Node.unvisited:
                case Node.lightWeight:
                case Node.normalWeight:
                case Node.heavyWeight:
                case Node.visited:
                case Node.shortestPath:
                case Node.jumpPoint:
                    ev.target.className = Node.wall;
                    changeWallStatus(ev.target.id, true, gridBoard);
                    changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
                    break;

                /* Left-clicking on a wall removes it */
                case Node.wall:
                    ev.target.className = Node.unvisited;
                    changeWallStatus(ev.target.id, false, gridBoard);
                    break;

                /* Start is removed and will be placed at the next node clicked at */
                case Node.start:
                    ev.target.className = Node.unvisited;
                    gridBoard.startIsPlaced = false;
                    break;

                /* If start is clicked after the algorithm's done */
                case Node.startShortestPath:
                    ev.target.className = Node.shortestPath;
                    gridBoard.startIsPlaced = false;
                    break;

                case Node.finish:
                    ev.target.className = Node.unvisited;
                    gridBoard.finishIsPlaced = false;
                    break;

                case Node.finishShortestPath:
                    ev.target.className = Node.shortestPath;
                    gridBoard.finishIsPlaced = false;
                    break;
            }
        }
    }

    /* If the user presses the key for light weights (default: q) 
        while left-clicking */
    else if (gridBoard.pressedKey === Key.lightWeight) 
    {
        if (ev.target.className == Node.lightWeight) 
        {
            ev.target.className = Node.unvisited;
            changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
        }

        else 
        {
            ev.target.className = Node.lightWeight;
            changeWeightOfNode(ev.target.id, nodeWeightLight, gridBoard);
        }
    }

    else if (gridBoard.pressedKey === Key.normalWeight) 
    {
        if (ev.target.className == Node.normalWeight) 
        {
            ev.target.className = Node.unvisited;
            changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
        }

        else 
        {
            ev.target.className = Node.normalWeight;
            changeWeightOfNode(ev.target.id, nodeWeightNormal, gridBoard);
        }
    }

    else if (gridBoard.pressedKey === Key.heavyWeight) 
    {
        if (ev.target.className == Node.heavyWeight) 
        {
            ev.target.className = Node.unvisited;
            changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
        }

        else 
        {
            ev.target.className = Node.heavyWeight;
            changeWeightOfNode(ev.target.id, nodeWeightHeavy, gridBoard);
        }
    }
}