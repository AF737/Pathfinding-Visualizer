'use strict';

export {unweightedAlgorithm, NodeType};

import Board from './board.js';
import {adjustGridDimensions, createGrid} from './grid.js';
import {openInfoBox, closeInfoBox, handlePrevInfoButton, 
        handleNextInfoButton} from './infoBox.js';
import {DISABLED_COLOR, BUTTON_BACKGROUND_COLOR, disableButtons, resetToggleButtons, 
        disableToggleButtons, enableEightDirections, setAndDisableEightDirections}
        from './helperFunctions.js';
import {handleLightWeightSlider, handleNormalWeightSlider, handleHeavyWeightSlider} 
        from './weights.js';
import startAlgorithmAnimation from './animateAlgorithms.js';
import {MouseEv, handleMouseDownAndMove} from './mouseEvents.js';
import startMazeAnimation from './animateMazes.js';

let unweightedAlgorithm = false;
let pressedKey = null;

const NodeType = 
{
    wall: 'wall',
    unvisited: 'unvisited',
    visited: 'visited',
    start: 'start',
    startVisited: 'startVisited',
    startShortestPath: 'startShortestPath',
    finish: 'finish',
    finishVisited: 'finishVisited',
    finishShortestPath: 'finishShortestPath',
    shortestPath: 'shortestPath',
    lightWeight: 'lightWeight',
    normalWeight: 'normalWeight',
    heavyWeight: 'heavyWeight',
    visitedByPreviousAlgorithm: 'visitedByPreviousAlgorithm'
};

/* Make Node attributes immutable */
Object.freeze(NodeType);

const SpecialNodeKeyboardKeys =
{
    lightWeight : 'q',
    normalWeight : 'w',
    heavyWeight : 'e',
    finish : 'r',
    start: 't'
};

Object.freeze(SpecialNodeKeyboardKeys);

document.addEventListener('DOMContentLoaded', function() 
{
    const gridBoard = new Board();
    const algorithmDropDownButton = document.getElementById('algorithmDropDownButton');
    const algorithmDropDownMenu = document.getElementById('algorithmDropDownMenu');
    const weightDropDownButton = document.getElementById('weightDropDownButton');
    const weightDropDownMenu = document.getElementById('weightDropDownMenu');
    const lightWeightSlider = document.getElementById('lightWeightSlider');
    const normalWeightSlider = document.getElementById('normalWeightSlider');
    const heavyWeightSlider = document.getElementById('heavyWeightSlider');
    const eightDirectionsToggleButton = document.getElementById('eightDirectionsToggleButton');
    const animateAlgorithmButton = document.getElementById('animateAlgorithmButton');
    const clearAlgorithmButton = document.getElementById('clearAlgorithmButton');
    const clearWallsButton = document.getElementById('clearWallsButton');
    const clearWeightsButton = document.getElementById('clearWeightsButton');
    const resetBoardButton = document.getElementById('resetBoardButton');
    const skipInfoBoxButton = document.getElementById('skipInfoBoxButton');
    const prevInfoBoxButton = document.getElementById('prevInfoBoxButton');
    const nextInfoButton = document.getElementById('nextInfoBoxButton');
    const openInfoBoxButton = document.getElementById('openInfoBoxButton');
    const cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');
    const cornerCuttingSwitch = document.getElementById('cornerCuttingSwitch');
    const mazeDropDownButton = document.getElementById('mazeDropDownButton');
    const mazeDropDownMenu = document.getElementById('mazeDropDownMenu');
    const mobileOptionsButton = document.getElementById('mobileOptionsButton');
    const mobileNodeSelectionButton = document.getElementById('mobileNodeSelectionButton');
    const board = document.getElementById('board');

    /* Setup function that runs immediately */
    (function() 
    {
        setupMouseAndTouchInteractions();
        setupAlgorithmRadioButtons();
        adjustGridDimensions();
        createGrid(gridBoard);
    })();

    board.addEventListener('mousedown', function(ev) 
    {
        ev.preventDefault();

        handleMouseDownAndMove(ev, MouseEv.down, gridBoard, pressedKey);
    });

    board.addEventListener('mousemove', function(ev) 
    {
        ev.preventDefault();

        handleMouseDownAndMove(ev, MouseEv.move, gridBoard, pressedKey);
    });

    /* Set this value to false even if the user releases the left mousebutton outside
        of the grid */
    document.addEventListener('mouseup', function(ev) 
    {
        ev.preventDefault();

        gridBoard.mouseIsPressed = false;
    });

    function setupMouseAndTouchInteractions() 
    {
        ['touchstart', 'click'].forEach(function(userEvent) 
        {
            const mobileNodeOptions = document.getElementsByClassName('mobileNodeOptionButtons');

            for (const option of mobileNodeOptions)
            {
                option.addEventListener(userEvent, function(ev)
                {
                    ev.preventDefault();

                    const mobileSelectedNodeDisplay = document.getElementById('mobileSelectedNodeDisplay');
                    const color = window.getComputedStyle(option).backgroundColor;
                    mobileSelectedNodeDisplay.style.backgroundColor = color;

                    const mobileNodeSelection = document.getElementById('mobileNodeSelection');
                    mobileNodeSelection.style.display = 'none';
                    algorithmDropDownButton.disabled = false;
                    animateAlgorithmButton.disabled = false;

                    if (option.value === 'wall')
                        return;

                    for (const [key, value] of Object.entries(NodeType))
                    {
                        if (option.value === value)
                        {
                            pressedKey = key;
                            break;
                        }
                    }
                });
            }

            algorithmDropDownButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                /* Prevents touch events from triggering opening the drop down
                    menu even though the button is disabled */
                if (algorithmDropDownButton.disabled === true)
                    return;

                /* Display the menu if the button is clicked */
                if (algorithmDropDownMenu.style.display === '' || 
                    algorithmDropDownMenu.style.display === 'none') 
                {
                    algorithmDropDownMenu.style.display = 'block';
                    algorithmDropDownButton.innerHTML = 'Algorithms&#9650;'
                }
        
                /* Hide it if the button is clicked again while it's open */
                else 
                {
                    algorithmDropDownMenu.style.display = 'none';
                    algorithmDropDownButton.innerHTML = 'Algorithms&#9660;'
                }
            });

            mazeDropDownButton.addEventListener(userEvent, function(ev)
            {
                ev.preventDefault();

                /* Display the menu if the button is clicked */
                if (mazeDropDownMenu.style.display === '' || 
                    mazeDropDownMenu.style.display === 'none') 
                {
                    mazeDropDownMenu.style.display = 'block';
                    mazeDropDownButton.innerHTML = 'Create Mazes&#9650;'
                }
        
                /* Hide it if the button is clicked again while it's open */
                else 
                {
                    mazeDropDownMenu.style.display = 'none';
                    mazeDropDownButton.innerHTML = 'Create Mazes&#9660;'
                }
            });

            const mazeAlgorithmButtons = document.getElementsByClassName('mazeAlgorithmButton');

            for (const mazeAlgorithmButton of mazeAlgorithmButtons)
            {
                mazeAlgorithmButton.addEventListener(userEvent, function(ev)
                {
                    ev.preventDefault();

                    mazeDropDownMenu.style.display = 'none';
                    mazeDropDownButton.innerHTML = 'Create Mazes&#9660;'

                    /* Hide mobile menu if visible as it partially hides the grid */
                    const menuStyles = document.getElementsByClassName('menuStyle');

                    for (const menuStyle of menuStyles) 
                    {
                        if (menuStyle.style.display === 'flex') 
                        {
                            menuStyle.style.display = 'none';
                            algorithmDropDownButton.disabled = false;
                            animateAlgorithmButton.disabled = false;
                        }
                    }

                    gridBoard.removePreviousAlgorithm();
                    startMazeAnimation(mazeAlgorithmButton.value, gridBoard);
                });
            }

            clearWallsButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                gridBoard.removeWalls();
            });
        
            clearWeightsButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                gridBoard.removeWeights();
            });
        
            resetBoardButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                gridBoard.removeWalls();
                gridBoard.removeWeights();
                gridBoard.resetStartAndFinish();
                gridBoard.removePreviousAlgorithm();
            });
        
            skipInfoBoxButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();
                
                closeInfoBox();
            });
        
            prevInfoBoxButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                handlePrevInfoButton();
            });
        
            nextInfoButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                handleNextInfoButton();
            });
        
            openInfoBoxButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                openInfoBox();
            });
        
            animateAlgorithmButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                if (animateAlgorithmButton.disabled === true)
                    return;

                const selectedAlgorithm = document.querySelector('input[name="algorithmOption"]:checked');
                /* If no algorithm has been selected */
                if (selectedAlgorithm === null) 
                {
                    animateAlgorithmButton.innerHTML = 'Select An Algorithm';
                    /* Get user's attention with a red border around the dropdown menu to select
                        an algorithm */
                    algorithmDropDownButton.style.border = '3px solid red';
                }
        
                /* Only start the algorithm if both start and finish are placed */
                else if (gridBoard.startIsPlaced === false || gridBoard.finishIsPlaced === false)
                    return;

                else 
                {
                    /* Hide menus that may overlap with the grid */
                    algorithmDropDownMenu.style.display = 'none';
                    algorithmDropDownButton.innerHTML = 'Animate&#9660;';
                    weightDropDownMenu.style.display = 'none';
                    weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
                    gridBoard.removePreviousAlgorithm();
                    /* Disable all menu buttons until the algorithm is done */
                    disableButtons();
                    disableToggleButtons();
                    gridBoard.algorithmIsRunning = true;
                    
                    let index = 0;
                    let previousIndex = null;

                    animateAlgorithm(selectedAlgorithm.value, gridBoard, index, previousIndex);
                }
            });
        });
    }

    function waitForAlgorithmToComplete(timeToWait)
    {
        return new Promise(function(resolve)
        {
            setTimeout(function()
            {
                resolve('resolved');
            }, timeToWait);
        });
    }

    async function animateAlgorithm(selectedAlgo, gridBoard, index, previousIndex)
    {
        while (gridBoard.finishPositions[index] === null)
            index++;

        if (index === gridBoard.finishPositions.length)
            return;

        let startNode;

        /* First iteration of this function */
        if (previousIndex === null)
            startNode = gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol];
        /* There's more than one finish node and the first finish node has been reached so use this finish node as the start node for 
            this iteration */
        else
        {
            const [startRow, startCol] = gridBoard.finishPositions[previousIndex];
            startNode = gridBoard.nodesMatrix[startRow][startCol];
        }

        const [finishRow, finishCol] = gridBoard.finishPositions[index];
        const finishNode = gridBoard.nodesMatrix[finishRow][finishCol];

        /* Only enable the UI again after the algorithm has visited the last finish node */
        let lastFinishNode = true;

        for (let i = index + 1; i < gridBoard.finishPositions.length; i++)
        {
            /* There's still at least one finish node left that hasn't been visited yet as otherwise all values would be null */
            if (gridBoard.finishPositions[i] !== null)
            {
                lastFinishNode = false;
                break;
            }
        }

        const timeToWait = startAlgorithmAnimation(selectedAlgo, startNode, finishNode, gridBoard, lastFinishNode);
        
        gridBoard.makePreviousAlgorithmLessVisible();

        const result = await waitForAlgorithmToComplete(timeToWait);

        previousIndex = index;
        index++;

        /* Repeat algorithm until all finish nodes have been reached */
        animateAlgorithm(selectedAlgo, gridBoard, index, previousIndex);
    }

    function setupAlgorithmRadioButtons() 
    {
        const radioButtons = document.querySelectorAll('input[name="algorithmOption"]');

        for (const radioButton of radioButtons) 
        {
            radioButton.addEventListener('change', function() 
            {
                let animateButtonText = 'Animate ';

                switch(radioButton.value) 
                {
                    case 'dijkstra':
                        animateButtonText += 'Dijkstra';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        disableToggleButtons();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'aStar':
                        animateButtonText += 'A*';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        enableEightDirections();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'greedyBestFirstSearch':
                        animateButtonText += 'Greedy';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        enableEightDirections();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'breadthFirstSearch':
                        animateButtonText += 'BFS';
                        unweightedAlgorithm = true;
                        resetToggleButtons();
                        disableToggleButtons();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'bidirectionalDijkstra':
                        animateButtonText += 'Bi. Dijkstra';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        disableToggleButtons();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'bidirectionalAStar':
                        animateButtonText += 'Bi. A*';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        enableEightDirections();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'depthFirstSearch':
                        animateButtonText += 'DFS';
                        unweightedAlgorithm = true;
                        resetToggleButtons();
                        disableToggleButtons();
                        gridBoard.eightDirectionalMovement = false;
                        gridBoard.allowCornerCutting = false;
                        break;

                    case 'jumpPointSearch':
                        animateButtonText += 'JPS';
                        unweightedAlgorithm = true;
                        resetToggleButtons();
                        /* JPS only works with eight directional movement */
                        setAndDisableEightDirections();
                        gridBoard.eightDirectionalMovement = true;
                        gridBoard.allowCornerCutting = false;
                        break;

                    default:
                        break;
                }

                animateAlgorithmButton.innerHTML = animateButtonText;
                /* Remove possible 3px solid red border */
                algorithmDropDownButton.style.border = '1px solid white';
            });
        }
    }

    document.addEventListener('keydown', function(ev) 
    {
        for (const [key, value] of Object.entries(SpecialNodeKeyboardKeys))
        {
            if (ev.key === value)
            {
                pressedKey = key;
                break;
            }
        }
    });

    document.addEventListener('keyup', function(ev) 
    {
        pressedKey = null;
    });

    /* Create a new grid if the user resized the window */
    window.addEventListener('resize', function() 
    {
        adjustGridDimensions();
        createGrid(gridBoard);

        /* Drop down menu accessible by clicking on the top right button (3 bars) */
        const menuStyles = document.getElementsByClassName('menuStyle');
        /* Menu accessible by clicking on the colored square in the top left */
        const mobileNodeSelection = document.getElementById('mobileNodeSelection');

        for (const menuStyle of menuStyles) 
        {
            /* Enable buttons again when switching from mobile to desktop
                version */
            if (this.window.innerWidth > 1050)
            {
                algorithmDropDownButton.disabled = false;
                animateAlgorithmButton.disabled = false;
                menuStyle.style.display = 'none';
            }

            /* Mobile version */
            else
            {
                /* Keep buttons disabled while menu is open
                    and window is being resized */
                if (menuStyle.style.display === 'flex' ||
                    mobileNodeSelection.style.display === 'inline-block') 
                {
                    algorithmDropDownButton.disabled = true;
                    animateAlgorithmButton.disabled = true;
                }

                else if (menuStyle.style.display === 'none' &&
                    mobileNodeSelection.style.display === 'none')
                {
                    algorithmDropDownButton.disabled = false;
                    animateAlgorithmButton.disabled = false;
                }
            }
        }
    });

    eightDirectionsToggleButton.addEventListener('change', function() 
    {
        /* Allow corner cutting if eight directions is enabled */
        if (eightDirectionsToggleButton.checked === true) 
        {
            cornerCuttingToggleButton.disabled = false;
            cornerCuttingSwitch.style.backgroundColor = BUTTON_BACKGROUND_COLOR;
            gridBoard.eightDirectionalMovement = true;
        }

        /* Disallow corner cutting when eight directions is disabled */
        else 
        {
            cornerCuttingToggleButton.checked = false;
            cornerCuttingToggleButton.disabled = true;
            cornerCuttingSwitch.style.backgroundColor = DISABLED_COLOR;
            gridBoard.allowCornerCutting = false;
            gridBoard.eightDirectionalMovement = false;
        }
    });

    cornerCuttingToggleButton.addEventListener('change', function() 
    {
        if (cornerCuttingToggleButton.checked === true) 
            gridBoard.allowCornerCutting = true;

        else 
            gridBoard.allowCornerCutting = false;
    });

    /* Close the menu if the user's mouse leaves it */
    algorithmDropDownMenu.addEventListener('mouseleave', function() 
    {
        algorithmDropDownMenu.style.display = 'none';
        algorithmDropDownButton.innerHTML = 'Algorithms&#9660;'
    });

    weightDropDownButton.addEventListener('click', function() 
    {
        if (weightDropDownMenu.style.display === '' || 
            weightDropDownMenu.style.display === 'none') 
        {
            weightDropDownMenu.style.display = 'block';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9650;';
        }

        else 
        {
            weightDropDownMenu.style.display = 'none';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
        }
    });

    weightDropDownMenu.addEventListener('mouseleave', function() 
    {
        weightDropDownMenu.style.display = 'none';
        weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
    });

    lightWeightSlider.addEventListener('input', function() 
    {
        handleLightWeightSlider.call(this, gridBoard);
    });

    normalWeightSlider.addEventListener('input', function() 
    {
        handleNormalWeightSlider.call(this, gridBoard);
    });

    heavyWeightSlider.addEventListener('input', function() 
    {
        handleHeavyWeightSlider.call(this, gridBoard);
    });

    mazeDropDownMenu.addEventListener('mouseleave', function()
    {
        mazeDropDownMenu.style.display = 'none';
        mazeDropDownButton.innerHTML = 'Create Mazes&#9660;';
    });

    clearAlgorithmButton.addEventListener('click', function() 
    {
        gridBoard.removePreviousAlgorithm();
    });

    mobileOptionsButton.addEventListener('click', function(ev) 
    {
        ev.preventDefault();

        const menuStyles = document.getElementsByClassName('menuStyle');
        const mobileNodeSelection = document.getElementById('mobileNodeSelection');

        for (const menuStyle of menuStyles) 
        {
            if (menuStyle.style.display === 'flex') 
            {
                menuStyle.style.display = 'none';
                algorithmDropDownButton.disabled = false;
                animateAlgorithmButton.disabled = false;
            }

            else 
            {
                menuStyle.style.display = 'flex';
                /* Hide other menu to prevent overlap */
                mobileNodeSelection.style.display = 'none';
                algorithmDropDownButton.disabled = true;
                animateAlgorithmButton.disabled = true;
            }
        }
    });

    mobileNodeSelectionButton.addEventListener('click', function(ev)
    {
        ev.preventDefault();

        const mobileNodeSelection = document.getElementById('mobileNodeSelection');
        const menuStyles = document.getElementsByClassName('menuStyle');

        if (mobileNodeSelection.style.display === 'inline-block') 
        {
            algorithmDropDownButton.disabled = false;
            animateAlgorithmButton.disabled = false;
            mobileNodeSelection.style.display = 'none';
        }

        else 
        {
            for (const menuStyle of menuStyles)
                menuStyle.style.display = 'none';
                
            algorithmDropDownButton.disabled = true;
            animateAlgorithmButton.disabled = true;
            mobileNodeSelection.style.display = 'inline-block';
        }
    });
}); 