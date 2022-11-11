'use strict';

export {mouseEvent, handleMouseDownAndMove};

import {unweightedAlgorithm} from './index.js';
import {infoBoxVisible} from './infoBox.js';
import {algorithmStatisticsVisible} from './algorithmStatistics.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy} 
        from './weights.js';

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
    finishShortestPath: 'finishShortestPath',
    onlyUpTraversal: 'onlyUpTraversal',
    onlyLeftTraversal: 'onlyLeftTraversal',
    onlyDownTraversal: 'onlyDownTraversal',
    onlyRightTraversal: 'onlyRightTraversal',
    removeOneWayTraversal: 'removeOneWayTraversal'
};

Object.freeze(Node);

const oneWayNodeArrowImgFilePath = '/images/oneWayNodeArrow.png';

let previousTarget = null;

function handleMouseDownAndMove(ev, mouseEv, gridBoard, PlaceSpecialNodes) 
{
    /* Disable click events for buttons and the grid */
    if (gridBoard.algorithmIsRunning === true || infoBoxVisible === true || 
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

    const keys = Object.keys(PlaceSpecialNodes);
    const specialNodesToPlace = [];

    for (const key of keys)
    {
        if (PlaceSpecialNodes[key] === true)
            specialNodesToPlace.push(key);
    }

    /* Removing an one way arrow doesn't change the node so it doesn't remove start */
    if ((ev.target.className === Node.start ||
        ev.target.className === Node.startShortestPath) && 
        specialNodesToPlace.includes(Node.removeOneWayTraversal) === false)
            gridBoard.startIsPlaced = false;

    if ((ev.target.className === Node.finish ||
        ev.target.className === Node.finishShortestPath) &&
        gridBoard.numberOfFinishNodesPlaced() === 1)
            gridBoard.finishIsPlaced = false;

    if (specialNodesToPlace.length === 0) 
    {
        if (gridBoard.startIsPlaced === false && 
            ev.target.className !== Node.start &&
            ev.target.className !== Node.startShortestPath) 
        {
            /* Remove finish node if it's the target */
            if (ev.target.className === Node.finish ||
                ev.target.className === Node.finishShortestPath)
                gridBoard.clearFinishPriority(ev.target.id);

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
                    /* Remove one way arrow, because these nodes don't have a special class */
                    ev.target.innerHTML = '';
                    ev.target.className = Node.wall;
                    gridBoard.changeWallStatusOfNodeTo(ev.target.id, true);
                    gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
                    break;

                /* Left-clicking on a wall removes it */
                case Node.wall:
                    ev.target.className = Node.unvisited;
                    gridBoard.changeWallStatusOfNodeTo(ev.target.id, false);
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

    /* If the user presses the key for light weights (1)
        while left-clicking */
    else if (specialNodesToPlace.includes(Node.lightWeight) === true) 
    {
        if (unweightedAlgorithm === true)
            return;

        if (ev.target.className === Node.lightWeight) 
        {
            ev.target.className = Node.unvisited;
            gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
        }

        else 
        {
            removeFinishIfTarget(ev, gridBoard);

            ev.target.className = Node.lightWeight;
            gridBoard.changeWeightOfNodeTo(ev.target.id, nodeWeightLight);
        }
    }

    /* 2 (key) + left-click */
    else if (specialNodesToPlace.includes(Node.normalWeight) === true) 
    {
        if (unweightedAlgorithm === true)
            return;

        if (ev.target.className === Node.normalWeight) 
        {
            ev.target.className = Node.unvisited;
            gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
        }

        else 
        {
            removeFinishIfTarget(ev, gridBoard);

            ev.target.className = Node.normalWeight;
            gridBoard.changeWeightOfNodeTo(ev.target.id, nodeWeightNormal);
        }
    }

    /* 3 (key) + left-click */
    else if (specialNodesToPlace.includes(Node.heavyWeight) === true) 
    {
        if (unweightedAlgorithm === true)
            return;

        if (ev.target.className === Node.heavyWeight) 
        {
            ev.target.className = Node.unvisited;
            gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
        }

        else 
        {
            removeFinishIfTarget(ev, gridBoard);

            ev.target.className = Node.heavyWeight;
            gridBoard.changeWeightOfNodeTo(ev.target.id, nodeWeightHeavy);
        }
    }

    /* E (key) + left-click */
    else if (specialNodesToPlace.includes(Node.finish) === true)
    {
        if (ev.target.className === Node.finish ||
            ev.target.className === Node.finishShortestPath)
        {
            gridBoard.clearFinishPriority(ev.target.id);
    
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
            gridBoard.changeWeightOfNodeTo(ev.target.id, NODE_WEIGHT_NONE);
            gridBoard.changeWallStatusOfNodeTo(ev.target.id, false);
            ev.target.appendChild(newFinishPriority);

            const [descriptor, row, col] = ev.target.id.split('-');

            gridBoard.nodesMatrix[row][col].class = Node.finish;

            gridBoard.finishIsPlaced = true;
        }
    }

    /* W (key) + left-click */
    else if (specialNodesToPlace.includes(Node.onlyUpTraversal) === true)
    {
        // const [prevDescriptor, prevRow, prevCol] = previousTarget.id.split('-');
        // const [descriptor, row, col] = ev.target.id.split('-');
        // const rowChange = row - prevRow;
        // const colChange = col - prevCol;

        // const canvas = document.createElement('canvas');
        // const ctx = canvas.getContext('2d');
        // ctx.lineWidth = 3;
        // ctx.beginPath();
        // ctx.arc(9, 9, 3, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.moveTo(9, 9);
        // ctx.lineTo(18, 9);
        // ctx.stroke();

        // ev.target.appendChild(canvas);

        removeFinishIfTarget(ev, gridBoard);

        /* Node doesn't contain an arrow yet */
        if (ev.target.firstChild === null)
        {
            const img = document.createElement('img');
            img.src = oneWayNodeArrowImgFilePath;
            img.style.pointerEvents = 'none';
            
            if (specialNodesToPlace.includes(Node.onlyLeftTraversal) === true)
            {
                img.style.transform = 'rotate(315deg)';
                gridBoard.changeAllowedDirectionOfNode(ev.target.id, -1, -1);
            }

            else if (specialNodesToPlace.includes(Node.onlyRightTraversal) === true)
            {
                img.style.transform = 'rotate(45deg)';
                gridBoard.changeAllowedDirectionOfNode(ev.target.id, -1, 1, gridBoard);
            }

            else 
            {
                img.style.transform = 'rotate(0deg)';
                gridBoard.changeAllowedDirectionOfNode(ev.target.id, -1, 0, gridBoard);
            }

            ev.target.appendChild(img);
            ev.target.className = Node.unvisited;
        }
    }

    /* S (key) + left-click */
    else if (specialNodesToPlace.includes(Node.onlyDownTraversal) === true)
    {
        removeFinishIfTarget(ev, gridBoard);

        if (ev.target.firstChild === null)
        {
            const img = document.createElement('img');
            img.src = oneWayNodeArrowImgFilePath;
            img.style.pointerEvents = 'none';

            if (specialNodesToPlace.includes(Node.onlyLeftTraversal) === true)
            {
                img.style.transform = 'rotate(225deg)';
                gridBoard.changeAllowedDirectionOfNode(ev.target.id, 1, -1);
            }

            else if (specialNodesToPlace.includes(Node.onlyRightTraversal) === true)
            {
                img.style.transform = 'rotate(135deg)';
                gridBoard.changeAllowedDirectionOfNode(ev.target.id, 1, 1);
            }

            else
            {
                img.style.transform = 'rotate(180deg)';
                gridBoard.changeAllowedDirectionOfNode(ev.target.id, 1, 0);
            }

            ev.target.appendChild(img);
            ev.target.className = Node.unvisited;
        }
    }

    /* A (key) + left-click and neither W nor S are pressed */
    else if (specialNodesToPlace.includes(Node.onlyLeftTraversal) === true)
    {
        removeFinishIfTarget(ev, gridBoard);

        if (ev.target.firstChild === null)
        {
            const img = document.createElement('img');
            img.src = oneWayNodeArrowImgFilePath;
            img.style.pointerEvents = 'none';
            img.style.transform = 'rotate(270deg)';

            gridBoard.changeAllowedDirectionOfNode(ev.target.id, 0, -1);

            ev.target.appendChild(img);
            ev.target.className = Node.unvisited;
        }
    }

    /* D (key) + left-click and neither W nor S are pressed */
    else if (specialNodesToPlace.includes(Node.onlyRightTraversal) === true)
    {
        removeFinishIfTarget(ev, gridBoard);

        if (ev.target.firstChild === null)
        {
            const img = document.createElement('img');
            img.src = oneWayNodeArrowImgFilePath;
            img.style.pointerEvents = 'none';
            img.style.transform = 'rotate(90deg)';

            gridBoard.changeAllowedDirectionOfNode(ev.target.id, 0, 1);

            ev.target.appendChild(img);
            ev.target.className = Node.unvisited;
        }
    }

    /* Q (key) + left-click */
    else if (specialNodesToPlace.includes(Node.removeOneWayTraversal) === true)
    {
        /* Only remove one way arrows */
        if ((ev.target.className === Node.unvisited ||
            ev.target.className === Node.visited ||
            ev.target.className === Node.shortestPath ||
            ev.target.className === Node.jumpPoint) && 
            ev.target.firstChild !== null)
        {
            ev.target.innerHTML = '';
            gridBoard.changeAllowedDirectionOfNode(ev.target.id, null, null);
        }
    }
}

function removeFinishIfTarget(ev, gridBoard)
{
    if (ev.target.className === Node.finish ||
        ev.target.className === Node.finishShortestPath)
    {
        gridBoard.clearFinishPriority(ev.target.id);

        if (gridBoard.numberOfFinishNodesPlaced() === 0)
            gridBoard.finishIsPlaced = false;
    }
}