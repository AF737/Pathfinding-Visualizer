'use strict';

export {eightDirections, cornerCutting, unweightedAlgorithm};

import Board from './board.js';
import {adjustGridDimensions, createGrid} from './grid.js';
import {openInfoBox, closeInfoBox, handlePrevInfoButton, 
        handleNextInfoButton} from './infoBox.js';
import {DISABLED_COLOR, BUTTON_BACKGROUND_COLOR, disableButtons, removeWalls, resetToggleButtons, disableToggleButtons,
        enableEightDirections, removePreviousAlgorithm, resetStartAndFinish, 
        setAndDisableEightDirections} from './helperFunctions.js';
import {handleLightWeightSlider, handleNormalWeightSlider, handleHeavyWeightSlider, 
        removeWeights} from './weights.js';
import startAlgorithmAnimation from './animateAlgorithms.js';
import {mouseEvent, handleMouseDownAndMove} from './mouseEvents.js';

let eightDirections = false, cornerCutting = false, unweightedAlgorithm = false;

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
    const animateAlgorithmButton = document.getElementById('animateAlgorithm');
    const clearAlgorithmButton = document.getElementById('clearAlgorithm');
    const clearWallsButton = document.getElementById('clearWalls');
    const clearWeightsButton = document.getElementById('clearWeights');
    const resetBoardButton = document.getElementById('resetBoard');
    const skipInfoBoxButton = document.getElementById('skipInfoBoxButton');
    const prevInfoBoxButton = document.getElementById('prevInfoBoxButton');
    const nextInfoButton = document.getElementById('nextInfoBoxButton');
    const openInfoBoxButton = document.getElementById('openInfoBox');
    const cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');
    const cornerCuttingSwitch = document.getElementById('cornerCuttingSwitch');
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const board = document.getElementById('board');

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

        handleMouseDownAndMove(ev, mouseEvent.down, gridBoard);
    });

    board.addEventListener('mousemove', function(ev) 
    {
        ev.preventDefault();

        handleMouseDownAndMove(ev, mouseEvent.move, gridBoard);
    });

    board.addEventListener('mouseup', function(ev) 
    {
        ev.preventDefault();

        gridBoard.mouseIsPressed = false;
    });

    function setupMouseAndTouchInteractions() 
    {
        ['touchstart', 'click'].forEach(function(userEvent) 
        {
            algorithmDropDownButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

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

            clearWallsButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                removeWalls(gridBoard);
            });
        
            clearWeightsButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                removeWeights(gridBoard);
            });
        
            resetBoardButton.addEventListener(userEvent, function(ev) 
            {
                ev.preventDefault();

                removeWalls(gridBoard);
                removeWeights(gridBoard);
                resetStartAndFinish(gridBoard);
                removePreviousAlgorithm(gridBoard);
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
                    removePreviousAlgorithm(gridBoard);
                    /* Disable all menu buttons until the algorithm is done */
                    disableButtons();
                    disableToggleButtons();
                    gridBoard.algoIsRunning = true;
        
                    const startNode = gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol];
                    const finishNode = gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol];
        
                    startAlgorithmAnimation(selectedAlgorithm.value, startNode, finishNode, gridBoard);
                }
            });
        });
    }

    function setupAlgorithmRadioButtons() 
    {
        const radioButtons = document.querySelectorAll('input[name="algorithmOption"]');

        for (let i = 0; i < radioButtons.length; i++) {
            radioButtons[i].addEventListener('change', function() 
            {
                let animateButtonText = 'Animate ';

                switch(radioButtons[i].value) 
                {
                    case 'dijkstra':
                        animateButtonText += 'Dijkstra';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'aStar':
                        animateButtonText += 'A*';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        enableEightDirections();
                        break;
                    case 'greedyBestFirstSearch':
                        animateButtonText += 'Greedy';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        enableEightDirections();
                        break;
                    case 'breadthFirstSearch':
                        animateButtonText += 'BFS';
                        unweightedAlgorithm = true;
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'bidirectionalDijkstra':
                        animateButtonText += 'Bi. Dijkstra';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'bidirectionalAStar':
                        animateButtonText += 'Bi. A*';
                        unweightedAlgorithm = false;
                        resetToggleButtons();
                        enableEightDirections();
                        break;
                    case 'depthFirstSearch':
                        animateButtonText += 'DFS';
                        unweightedAlgorithm = true;
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'jumpPointSearch':
                        animateButtonText += 'JPS';
                        unweightedAlgorithm = true;
                        resetToggleButtons();
                        /* JPS only works with eight directional movement */
                        setAndDisableEightDirections();
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
        gridBoard.pressedKey = ev.key;
    });

    document.addEventListener('keyup', function() 
    {
        gridBoard.pressedKey = null;
    });

    /* Create a new grid if the user resized the window */
    window.addEventListener('resize', function() 
    {
        adjustGridDimensions();
        createGrid(gridBoard);
    });

    eightDirectionsToggleButton.addEventListener('change', function() 
    {
        /* Allow corner cutting if eight directions is enabled */
        if (eightDirectionsToggleButton.checked === true) 
        {
            cornerCuttingToggleButton.disabled = false;
            cornerCuttingSwitch.style.backgroundColor = BUTTON_BACKGROUND_COLOR;
            eightDirections = true;
        }

        /* Disallow corner cutting when eight directions is disabled */
        else 
        {
            cornerCuttingToggleButton.checked = false;
            cornerCuttingToggleButton.disabled = true;
            cornerCuttingSwitch.style.backgroundColor = DISABLED_COLOR;
            cornerCutting = false;
            eightDirections = false;
        }
    });

    cornerCuttingToggleButton.addEventListener('change', function() 
    {
        if (cornerCuttingToggleButton.checked === true) 
            cornerCutting = true;

        else 
            cornerCutting = false;
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
        handleLightWeightSlider.call(this);
    });

    normalWeightSlider.addEventListener('input', function() 
    {
        handleNormalWeightSlider.call(this);
    });

    heavyWeightSlider.addEventListener('input', function() 
    {
        handleHeavyWeightSlider.call(this);
    });

    clearAlgorithmButton.addEventListener('click', function() 
    {
        removePreviousAlgorithm(gridBoard);
    });

    mobileMenuButton.addEventListener('click', function(ev) 
    {
        ev.preventDefault();

        const menuStyles = document.getElementsByClassName('menuStyle');

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
                algorithmDropDownButton.disabled = true;
                animateAlgorithmButton.disabled = true;
            }
        }
    });
}); 