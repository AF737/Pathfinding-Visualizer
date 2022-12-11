'use strict';

export {MouseEv, handleMouseDownAndMove};

import {unweightedAlgorithm, NodeType} from './index.js';
import {infoBoxVisible} from './infoBox.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy} 
        from './weights.js';

const MouseEv = 
{
    down: 'mouseDown',
    move: 'mouseMove'
};

/* Make MouseEv attributes immutable */
Object.freeze(MouseEv);

let previousTarget = null;

function handleMouseDownAndMove(ev, mouseEv, gridBoard, pressedKey) 
{
    /* Disable click events for buttons and the grid */
    if (gridBoard.algorithmIsRunning === true || infoBoxVisible === true) 
        return;

    if (mouseEv === MouseEv.down) 
        gridBoard.mouseIsPressed = true;

    /* The user can move the mouse without changing the tile that the mouse is
        over therefore executing this function multiple times. So do nothing after
        the first click on a tile until the user has changed it to avoid
        toggling walls, weights, start and finish constantly */
    else if (mouseEv === MouseEv.move && ev.target === previousTarget) 
        return;

    /* Prevents walls from being placed when the user's just moving his cursor
        across the board without clicking the left mouse button */
    else if (gridBoard.mouseIsPressed === false && mouseEv === MouseEv.move) 
        return;

    previousTarget = ev.target;
    
    /* Desktop version: Left-click without pressing any keyboard keys
        Mobile Version: Tapping the screen while "wall" or "start" are selected in 
                        the top left node selection menu */
    if (pressedKey === null || pressedKey === NodeType.wall) 
    {
        switch(ev.target.className) 
        {
            case NodeType.start:
            case NodeType.startShortestPath:
            case NodeType.unvisited:
            case NodeType.lightWeight:
            case NodeType.normalWeight:
            case NodeType.heavyWeight:
            case NodeType.visited:
            case NodeType.shortestPath:
                removeStartIfTarget(ev, gridBoard);
                ev.target.className = NodeType.wall;
                gridBoard.changeWallStatusOfNodeTo(ev.target.id, true);
                gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
                break;

            /* Left-clicking on a wall removes it */
            case NodeType.wall:
                ev.target.className = NodeType.unvisited;
                gridBoard.changeWallStatusOfNodeTo(ev.target.id, false);
                gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
                break;

            case NodeType.finish:
            case NodeType.finishShortestPath:
                gridBoard.clearFinishPriority(ev.target.id);
                /* Overwrite className 'unvisited' set by clearFinishPriority */
                ev.target.className = NodeType.wall;
                gridBoard.changeWallStatusOfNodeTo(ev.target.id, true);
                gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
                
                if (gridBoard.numberOfFinishNodesPlaced() === 0)
                    gridBoard.finishIsPlaced = false;
                break;
        }
    }

    /* If the user presses the key for light weights (Q)
        while left-clicking */
    else if (pressedKey === NodeType.lightWeight)
        handleWeights(ev, gridBoard, NodeType.lightWeight, nodeWeightLight);

    /* W (key) + left-click */
    else if (pressedKey === NodeType.normalWeight)
        handleWeights(ev, gridBoard, NodeType.normalWeight, nodeWeightNormal);

    /* E (key) + left-click */
    else if (pressedKey === NodeType.heavyWeight) 
        handleWeights(ev, gridBoard, NodeType.heavyWeight, nodeWeightHeavy);

    /* R (key) + left-click */
    else if (pressedKey === NodeType.finish)
    {
        if (ev.target.className === NodeType.finish ||
            ev.target.className === NodeType.finishShortestPath)
        {
            gridBoard.clearFinishPriority(ev.target.id);
    
            if (gridBoard.numberOfFinishNodesPlaced() === 0)
                gridBoard.finishIsPlaced = false;
        }

        else
        {
            removeStartIfTarget(ev, gridBoard);

            const newFinishPriority = gridBoard.addFinishPriority(ev.target.id);

            /* Maximum amount of finish nodes has been reached (99) */
            if (newFinishPriority === null)
                return;
            
            ev.target.className = NodeType.finish;
            gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
            gridBoard.changeWallStatusOfNodeTo(ev.target.id, false);
            ev.target.appendChild(newFinishPriority);

            const [descriptor, row, col] = ev.target.id.split('-');

            gridBoard.nodesMatrix[row][col].class = NodeType.finish;

            gridBoard.finishIsPlaced = true;
        }
    }

    else if (pressedKey === NodeType.start)
    {
        if (ev.target.className === NodeType.start ||
            ev.target.className === NodeType.startShortestPath)
            removeStartIfTarget(ev, gridBoard);

        else
        {
            if (ev.target.className === NodeType.finish ||
                ev.target.className === NodeType.finishShortestPath)
                gridBoard.clearFinishPriority(ev.target.id);
        
            /* Reset the old position of start to be unvisited */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                NodeType.unvisited;
            document.getElementById(`node-${gridBoard.startRow}-${gridBoard.startCol}`)
                .className = NodeType.unvisited;

            const [descriptor, row, col] = ev.target.id.split('-');
            /* Update the coordinates of start */
            gridBoard.startRow = row;
            gridBoard.startCol = col;
            /* Mark the new node as the starting point */
            gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
                NodeType.start;
            /* Color the node that is being clicked with the start color */
            ev.target.className = NodeType.start;
            gridBoard.startIsPlaced = true;
            gridBoard.changeWallStatusOfNodeTo(ev.target.id, false);
            gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
        }
    }
}

function removeFinishIfTarget(ev, gridBoard)
{
    if (ev.target.className === NodeType.finish ||
        ev.target.className === NodeType.finishShortestPath)
    {
        gridBoard.clearFinishPriority(ev.target.id);

        if (gridBoard.numberOfFinishNodesPlaced() === 0)
            gridBoard.finishIsPlaced = false;
    }
}

function removeStartIfTarget(ev, gridBoard)
{
    if (ev.target.className === NodeType.start ||
        ev.target.className === NodeType.startShortestPath)
    {
        gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol].class = 
            NodeType.unvisited;
        gridBoard.startIsPlaced = false;
        ev.target.className = NodeType.unvisited;
    }
}

function handleWeights(ev, gridBoard, weightName, weightValue)
{
    if (unweightedAlgorithm === true)
            return;

    if (ev.target.className === weightName) 
    {
        ev.target.className = NodeType.unvisited;
        gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
    }

    else 
    {
        removeFinishIfTarget(ev, gridBoard);
        removeStartIfTarget(ev, gridBoard);

        ev.target.className = weightName
        gridBoard.changeWeightOfNodeTo(ev.target.id, weightValue);
        gridBoard.changeWallStatusOfNodeTo(ev.target.id, false);
    }
}