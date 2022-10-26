'use strict';

export {mouseEvent, handleMouseDownAndMove};

import {unweightedAlgorithm} from './index.js';
import {infoBoxVisible} from './infoBox.js';
import {algorithmStatisticsVisible} from './algorithmStatistics.js'
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
    heavyWeight: 'e',
    finishNode: 'r'
};

Object.freeze(Key);

let previousTarget = null;

function handleMouseDownAndMove(ev, mouseEv, gridBoard) 
{
    /* Disable click events for buttons and the grid */
    if (gridBoard.algoIsRunning === true || infoBoxVisible === true || 
        algorithmStatisticsVisible === true) 
        return;

    if (mouseEv === mouseEvent.down) 
        gridBoard.mouseIsPressed = true;

    /* The user can move the mouse without changing the tile that the mouse is
        over therefore executing this function multiple times. So do nothing after
        the first click on a tile until the user has changed it to avoid
        toggling walls, weights, start and finish constantly */
    else if (mouseEv === mouseEvent.move && ev.target === previousTarget) 
        return;

    /* Prevents walls from being placed when the user's just moving his cursor
        across the board without clicking the left mouse button */
    else if (gridBoard.mouseIsPressed === false && mouseEv === mouseEvent.move) 
        return;

    previousTarget = ev.target;

    if (ev.target.className === Node.start ||
        ev.target.className === Node.startShortestPath)
            gridBoard.startIsPlaced = false;

    if ((ev.target.className === Node.finish ||
        ev.target.className === Node.finishShortestPath) &&
        gridBoard.numberOfFinishNodesPlaced() === 1)
            gridBoard.finishIsPlaced = false;

    if (gridBoard.pressedKey === null) 
    {
        if (gridBoard.startIsPlaced === false && 
            ev.target.className !== Node.start &&
            ev.target.className !== Node.startShortestPath) 
        {
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
                    gridBoard.clearFinishPriority(ev.target.id);
                    /* Overwrite className 'unvisited' set by clearFinishPriority */
                    ev.target.className = Node.wall;
                    
                    if (gridBoard.numberOfFinishNodesPlaced() === 0)
                        gridBoard.finishIsPlaced = false;
                    break;

                case Node.finishShortestPath:
                    gridBoard.clearFinishPriority(ev.target.id);
                    ev.target.className = Node.wall;

                    if (gridBoard.numberOfFinishNodesPlaced() === 0)
                        gridBoard.finishIsPlaced = false;
                    break;
            }
        }
    }

    /* If the user presses the key for light weights (Q)
        while left-clicking */
    else if (gridBoard.pressedKey === Key.lightWeight) 
    {
        if (unweightedAlgorithm === true)
            return;

        if (ev.target.className === Node.lightWeight) 
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

    /* W (key) + left-click */
    else if (gridBoard.pressedKey === Key.normalWeight) 
    {
        if (unweightedAlgorithm === true)
            return;

        if (ev.target.className === Node.normalWeight) 
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

    /* E (key) + left-click */
    else if (gridBoard.pressedKey === Key.heavyWeight) 
    {
        if (unweightedAlgorithm === true)
            return;

        if (ev.target.className === Node.heavyWeight) 
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

    /* R (key) + left-click */
    else if (gridBoard.pressedKey === Key.finishNode)
    {
        if (ev.target.className === Node.finish ||
            ev.target.className === Node.finishShortestPath)
        {
            gridBoard.clearFinishPriority(ev.target.id);
            ev.target.className = Node.unvisited;

            if (gridBoard.numberOfFinishNodesPlaced() === 0)
                gridBoard.finishIsPlaced = false;
        }

        else
        {
            const newFinishPriority = gridBoard.addFinishPriority(ev.target.id);

            /* Maximum amount of finish nodes has been reached (99) */
            if (newFinishPriority === null)
                return;
            
            ev.target.className = Node.finish;
            changeWeightOfNode(ev.target.id, NODE_WEIGHT_NONE, gridBoard);
            document.getElementById(ev.target.id).appendChild(newFinishPriority);

            const [descriptor, row, col] = ev.target.id.split('-');

            gridBoard.nodesMatrix[row][col].class = Node.finish;

            gridBoard.finishIsPlaced = true;
        }
    }
}