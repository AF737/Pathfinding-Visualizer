'use strict';

import {NodeType} from './index.js';
import {NODE_WEIGHT_NONE} from './weights.js'
import randomizedDepthFirstSearch from './algorithms/maze/randomizedDepthFirstSearch.js';
import randomizedKruskal from './algorithms/maze/randomizedKruskal.js';
import randomizedPrim from './algorithms/maze/randomizedPrim.js';
import aldousBroder from './algorithms/maze/aldousBroder.js';
import huntAndKill from './algorithms/maze/huntAndKill.js';
import wilson from './algorithms/maze/wilson.js';
import sidewinder from './algorithms/maze/sidewinder.js';
import eller from './algorithms/maze/eller.js';
import recursiveDivision from './algorithms/maze/recursiveDivision.js';

const Animation = 
{
    outerBorder: [],
    cellCreation: [],
    algorithm: []
};

export default function startMazeAnimation(selectedMaze, gridBoard)
{
    gridBoard.removeWalls();
    gridBoard.removeWeights();
    gridBoard.resetStartAndFinish();
    gridBoard.removePreviousAlgorithm();

    Animation.outerBorder = getOuterBorderAnimation(gridBoard);
    Animation.cellCreation = getCellCreationAnimation(gridBoard);
    let isRecursiveDivision = false;
    
    switch(selectedMaze)
    {
        case 'randomizedDepthFirstSearchMaze':
            Animation.algorithm = randomizedDepthFirstSearch(gridBoard);
            break;

        case 'randomizedKruskalMaze':
            Animation.algorithm = randomizedKruskal(gridBoard);
            break;

        case 'randomizedPrimMaze':
            Animation.algorithm = randomizedPrim(gridBoard);
            break;

        case 'wilsonMaze':
            Animation.algorithm = wilson(gridBoard);
            break;

        case 'aldousBroderMaze':
            Animation.algorithm = aldousBroder(gridBoard);
            break;

        case 'huntAndKillMaze':
            Animation.algorithm = huntAndKill(gridBoard);
            break;

        case 'sidewinderMaze':
            Animation.algorithm = sidewinder(gridBoard);
            break;

        case 'ellerMaze':
            Animation.algorithm = eller(gridBoard);
            break;

        case 'recursiveDivisionMaze':
            /* Remove all walls except for the outer border */
            for (let row = 1; row < gridBoard.rows - 1; row++)
            {
                for (let col = 1; col < gridBoard.columns - 1; col++)
                {
                    const id = `node-${row}-${col}`;

                    gridBoard.changeWallStatusOfNodeTo(id, false);
                    document.getElementById(id).className = NodeType.unvisited;
                }
            }
            
            /* Remove the maze fill animation as the algorithm needs an empty maze */
            Animation.cellCreation.length = 0;
            isRecursiveDivision = true;
        
            Animation.algorithm = recursiveDivision(gridBoard);
            break;

        default:
            break;
    }

    animateMazeAlgorithm(isRecursiveDivision)

    /* Maze algorithms need to mark nodes as visited so revert that */
    gridBoard.resetAllNodesInternally();
    /* Place the start and finish node in the places they were originally in when the
        board was first created, because for the maze algorithms there should only be walls
        and unvisited nodes so that they can operate correctly */
    gridBoard.resetStartAndFinish(); 
}

function animateMazeAlgorithm(isRecursiveDivision)
{
    let animationDelay = 0;
    let animationSpeed = 5;
    let divisor = 1;

    for (const [key, nodesArr] of Object.entries(Animation)) 
    {
        /* The first two parts are animated twice as fast so reduce the starting delay by 
            half to avoid a gap in animation between the outer border/cell creation and maze
            generation algorithm */
        if (key === 'algorithm')
        {
            animationSpeed *= 2;
            divisor *= 2;
        }

        for (let i = 0; i < nodesArr.length; i++)
        {
            setTimeout(function()
            {
                const node = nodesArr[i];
                const nodeID = document.getElementById(`node-${node.row}-${node.column}`);
                
                if (isRecursiveDivision === true || key !== 'algorithm')
                    nodeID.className = NodeType.wall;

                else
                    nodeID.className = NodeType.unvisited;

            }, ((animationDelay / divisor) + i) * animationSpeed);
        }
        
        animationDelay += nodesArr.length;
    }
}

function getOuterBorderAnimation(gridBoard)
{
    const animation = [];

    /* Create top and bottom border around the grid */
    for (let row = 0; row < gridBoard.rows; row += gridBoard.rows - 1)
    {
        for (let col = 0; col < gridBoard.columns; col++)
        { 
            gridBoard.nodesMatrix[row][col].class = NodeType.wall;

            const id = `node-${row}-${col}`;
            gridBoard.changeWallStatusOfNodeTo(id, true);
            gridBoard.changeWeightOfNodeTo(id, NODE_WEIGHT_NONE);

            animation.push(gridBoard.nodesMatrix[row][col]);
        }
    }

    /* Create a border at the left and right most columns */
    for (let col = 0; col < gridBoard.columns; col += gridBoard.columns - 1)
    {
        for (let row = 0; row < gridBoard.rows; row++)
        {
            const id = `node-${row}-${col}`;
            gridBoard.changeWallStatusOfNodeTo(id, true);
            gridBoard.changeWeightOfNodeTo(id, NODE_WEIGHT_NONE);

            animation.push(gridBoard.nodesMatrix[row][col]);
        }
    }

    return animation;
}

function getCellCreationAnimation(gridBoard)
{
    const animation = [];
    const nodeOffsets = [[0, 0], [0, 1], [1, 0], [1, 1]];
    gridBoard.mazeCells.length = 0;

    for (let row = 1; row < gridBoard.rows - 1; row += 2)
    {
        for (let col = 1; col < gridBoard.columns - 1; col += 2)
        {
            const cellNodeIDs = [];

            for (const nodeOffset of nodeOffsets)
                cellNodeIDs.push(`node-${row + nodeOffset[0]}-${col + nodeOffset[1]}`);

            for (let i = 0; i < cellNodeIDs.length; i++)
            {
                const [descriptor, row, col] = cellNodeIDs[i].split('-');

                if (i === 0)
                    gridBoard.mazeCells.push(gridBoard.nodesMatrix[row][col]);

                else
                {
                    gridBoard.changeWallStatusOfNodeTo(cellNodeIDs[i], true);
                    gridBoard.changeWeightOfNodeTo(cellNodeIDs[i], NODE_WEIGHT_NONE);

                    animation.push(gridBoard.nodesMatrix[row][col]);
                }
            }
        }
    }

    return animation;
}