'use strict';

import randomizedDepthFirstSearch from './algorithms/maze/randomizedDepthFirstSearch.js';
import randomizedKruskal from './algorithms/maze/randomizedKruskal.js';
import randomizedPrim from './algorithms/maze/randomizedPrim.js';
import aldousBroder from './algorithms/maze/aldousBroder.js';
import huntAndKill from './algorithms/maze/huntAndKill.js';
import wilson from './algorithms/maze/wilson.js';

export default function startMazeAnimation(selectedMaze, gridBoard)
{
    gridBoard.removeWalls();
    gridBoard.removeWeights();
    gridBoard.resetStartAndFinish();
    gridBoard.removePreviousAlgorithm();
    gridBoard.removeOneWayNodes();
    gridBoard.createMazeCells();
    
    switch(selectedMaze)
    {
        case 'randomizedDepthFirstSearchMaze':
            randomizedDepthFirstSearch(gridBoard);
            break;

        case 'randomizedKruskalMaze':
            randomizedKruskal(gridBoard);
            break;

        case 'randomizedPrimMaze':
            randomizedPrim(gridBoard);
            break;

        case 'wilsonMaze':
            wilson(gridBoard);
            break;

        case 'aldousBroderMaze':
            aldousBroder(gridBoard);
            break;

        case 'huntAndKillMaze':
            huntAndKill(gridBoard);
            break;

        default:
            break;
    }

    /* Maze algorithms need to mark nodes as visited so revert that */
    gridBoard.resetAllNodesInternally();
    /* Place the start and finish node in the places they were originally in when the
        board was first created, because for the maze algorithms there should only be walls
        and unvisited nodes so that they can operate correctly */
    gridBoard.resetStartAndFinish(); 
}