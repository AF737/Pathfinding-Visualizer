'use strict';

import randomizedDepthFirstSearch from './algorithms/maze/randomizedDepthFirstSearch.js';
import randomizedKruskal from './algorithms/maze/randomizedKruskal.js';
import randomizedPrim from './algorithms/maze/randomizedPrim.js';
import aldousBroder from './algorithms/maze/aldousBroder.js';
import huntAndKill from './algorithms/maze/huntAndKill.js';
import wilson from './algorithms/maze/wilson.js';
import sidewinder from './algorithms/maze/sidewinder.js';
import eller from './algorithms/maze/eller.js';
import recursiveDivision from './algorithms/maze/recursiveDivision.js';

export default function startMazeAnimation(selectedMaze, gridBoard)
{
    gridBoard.removeWalls();
    gridBoard.removeWeights();
    gridBoard.resetStartAndFinish();
    gridBoard.removePreviousAlgorithm();
    gridBoard.removeOneWayNodes();
    
    const animateProcess = true;
    const animationsArr = [];
    gridBoard.createMazeCells(animateProcess, animationsArr);

    let algorithmAnimation = [];
    let isRecursiveDivision = false;
    
    switch(selectedMaze)
    {
        case 'randomizedDepthFirstSearchMaze':
            algorithmAnimation = randomizedDepthFirstSearch(gridBoard);
            break;

        case 'randomizedKruskalMaze':
            algorithmAnimation = randomizedKruskal(gridBoard);
            break;

        case 'randomizedPrimMaze':
            algorithmAnimation = randomizedPrim(gridBoard);
            break;

        case 'wilsonMaze':
            algorithmAnimation = wilson(gridBoard);
            break;

        case 'aldousBroderMaze':
            algorithmAnimation = aldousBroder(gridBoard);
            break;

        case 'huntAndKillMaze':
            algorithmAnimation = huntAndKill(gridBoard);
            break;

        case 'sidewinderMaze':
            algorithmAnimation = sidewinder(gridBoard);
            break;

        case 'ellerMaze':
            algorithmAnimation = eller(gridBoard);
            break;

        case 'recursiveDivisionMaze':
            /* Remove all walls except for the outer border */
            for (let row = 1; row < gridBoard.rows - 1; row++)
            {
                for (let col = 1; col < gridBoard.columns - 1; col++)
                {
                    const id = `node-${row}-${col}`;

                    gridBoard.changeWallStatusOfNodeTo(id, false);
                    document.getElementById(id).className = 'unvisited';
                }
            }
            
            /* Remove the maze fill animation as the algorithm needs an empty maze */
            animationsArr[1].length = 0;
            isRecursiveDivision = true;
        
            algorithmAnimation = recursiveDivision(gridBoard);
            break;

        default:
            break;
    }

    animationsArr.push(algorithmAnimation);

    animateMazeAlgorithm(animationsArr, isRecursiveDivision)

    /* Maze algorithms need to mark nodes as visited so revert that */
    gridBoard.resetAllNodesInternally();
    /* Place the start and finish node in the places they were originally in when the
        board was first created, because for the maze algorithms there should only be walls
        and unvisited nodes so that they can operate correctly */
    gridBoard.resetStartAndFinish(); 
}

function animateMazeAlgorithm(animationsArr, isRecursiveDivision)
{
    let animationPartOffset = 0;

    for (let animationPart = 0; animationPart < animationsArr.length; animationPart++)
    {
        if (animationPart > 0)
            animationPartOffset += animationsArr[animationPart - 1].length;

        const animation = animationsArr[animationPart];

        for (let i = 0; i < animation.length; i++)
        {
            setTimeout(function()
            {
                const currentNode = animation[i];
                const nodeID = document.getElementById(`node-${currentNode.row}-${currentNode.column}`);
    
                /* The first two arrays contain the nodes of the outer border and the borders of each maze
                    cell in the grid. Recursive Division requires an empty grid except for the outer border
                    and then places walls inside to create the maze */
                if (isRecursiveDivision === true || animationPart < 2)
                    nodeID.className = 'wall';

                else
                    nodeID.className = 'unvisited';

            }, (animationPartOffset + i) * 5); 
        }
    }
}