'use strict';

export {eightDirections, cornerCutting};
import Board from './board.js';
import {adjustGridDimensions, createGrid} from './grid.js';
import {openInfoBox, closeInfoBox, handlePrevInfoButton, 
        handleNextInfoButton, mobileFriendlyInfoBox} from './infoBox.js';
import {disableButtons, removeWalls, resetToggleButtons, disableToggleButtons,
        enableDirections, removePreviousAlgorithm, resetStartAndFinish, 
        setAndDisableDirections} from './helperFunctions.js';
import {handleLightWeightSlider, handleNormalWeightSlider, handleHeavyWeightSlider, 
        removeWeights} from './weights.js';
import {animateDijkstra, animateAStar, animateGreedyBFS, animateBreadthFirstSearch,
        animateBidirectionalDijkstra, animateBidirectionalAStar, animateDepthFirstSearch, 
        animateJumpPointSearch} from './animateAlgorithms.js';

let eightDirections = false, cornerCutting = false;

document.addEventListener('DOMContentLoaded', function() {
    let gridBoard = new Board();
    let algorithmDropDownButton = document.getElementById('algorithmDropDownButton');
    let algorithmDropDownMenu = document.getElementById('algorithmDropDownMenu');
    let weightDropDownButton = document.getElementById('weightDropDownButton');
    let weightDropDownMenu = document.getElementById('weightDropDownMenu');
    let lightWeightSlider = document.getElementById('lightWeightSlider');
    let normalWeightSlider = document.getElementById('normalWeightSlider');
    let heavyWeightSlider = document.getElementById('heavyWeightSlider');
    let directionsToggleButton = document.getElementById('directionsToggleButton');
    let animateAlgorithmButton = document.getElementById('animateAlgorithm');
    let clearAlgorithmButton = document.getElementById('clearAlgorithm');
    let clearWallsButton = document.getElementById('clearWalls');
    let clearWeightsButton = document.getElementById('clearWeights');
    let resetBoardButton = document.getElementById('resetBoard');
    let skipInfoBoxButton = document.getElementById('skipInfoBoxButton');
    let prevInfoBoxButton = document.getElementById('prevInfoBoxButton');
    let nextInfoButton = document.getElementById('nextInfoBoxButton');
    let openInfoBoxButton = document.getElementById('openInfoBox');
    let cornerCuttingToggleButton = document.getElementById('cornerCuttingToggleButton');
    let cornerCuttingSwitch = document.getElementById('cornerCuttingSwitch');
    let mobileMenuButton = document.getElementById('mobileMenuButton');

    function setup() {
        setupMouseAndTouchInteractions();
        setupAlgorithmRadioButtons();
        adjustGridDimensions();
        createGrid(gridBoard);
    }

    setup();

    function setupMouseAndTouchInteractions() {
        ['touchstart', 'click'].forEach(function(userEvent) {
            algorithmDropDownButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                /* Display the menu if the button is clicked */
                if (algorithmDropDownMenu.style.display === '' || 
                        algorithmDropDownMenu.style.display === 'none') {
                    algorithmDropDownMenu.style.display = 'block';
                    algorithmDropDownButton.innerHTML = 'Algorithms&#9650;'
                }
        
                /* Hide it if the button is clicked again while it's open */
                else {
                    algorithmDropDownMenu.style.display = 'none';
                    algorithmDropDownButton.innerHTML = 'Algorithms&#9660;'
                }
            });

            clearWallsButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                removeWalls(gridBoard);
            });
        
            clearWeightsButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                removeWeights(gridBoard);
            });
        
            resetBoardButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                removeWalls(gridBoard);
                removeWeights(gridBoard);
                resetStartAndFinish(gridBoard);
                removePreviousAlgorithm(gridBoard);
            });
        
            skipInfoBoxButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();
                
                closeInfoBox();
            });
        
            prevInfoBoxButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                handlePrevInfoButton();
            });
        
            nextInfoButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                handleNextInfoButton();
            });
        
            openInfoBoxButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                if (userEvent === 'touchstart') {
                    mobileFriendlyInfoBox();
                }

                openInfoBox();
            });
        
            animateAlgorithmButton.addEventListener(userEvent, function(ev) {
                ev.preventDefault();

                let selectedAlgorithm = document.querySelector('input[name="algorithmOption"]:checked');
                /* If no algorithm has been selected */
                if (selectedAlgorithm === null) {
                    animateAlgorithmButton.innerHTML = 'Select An Algorithm';
                    /* Get user's attention with a red border around the dropdown menu to select
                        an algorithm */
                    algorithmDropDownButton.style.border = '3px solid red';
                }
        
                /* Only start the algorithm if both start and finish are placed */
                else if (gridBoard.startIsPlaced === false || gridBoard.finishIsPlaced === false) {
                    return;
                }
        
                else {
                    algorithmDropDownMenu.style.display = 'none';
                    algorithmDropDownButton.innerHTML = 'Animate&#9660;';
                    weightDropDownMenu.style.display = 'none';
                    weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
                    removePreviousAlgorithm(gridBoard);
                    /* Disable all menu buttons until the algorithm is done */
                    disableButtons();
                    disableToggleButtons();
                    gridBoard.algoIsRunning = true;
        
                    let startNode = gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol];
                    let finishNode = gridBoard.nodesMatrix[gridBoard.finishRow][gridBoard.finishCol];
        
                    switch (selectedAlgorithm.value) {
                        case 'dijkstra':
                            animateDijkstra(startNode, finishNode, gridBoard);
                            break;
                        case 'aStar':
                            animateAStar(startNode, finishNode, gridBoard);
                            break;
                        case 'greedyBFS':
                            animateGreedyBFS(startNode, finishNode, gridBoard);
                            break;
                        case 'breadthFirstSearch':
                            animateBreadthFirstSearch(startNode, finishNode, gridBoard);
                            break;
                        case 'bidirectionalDijkstra':
                            animateBidirectionalDijkstra(startNode, finishNode, gridBoard);
                            break;
                        case 'bidirectionalAStar':
                            animateBidirectionalAStar(startNode, finishNode, gridBoard);
                            break;
                        case 'depthFirstSearch':
                            animateDepthFirstSearch(startNode, finishNode, gridBoard);
                            break;
                        case 'jumpPointSearch':
                            animateJumpPointSearch(startNode, finishNode, gridBoard);
                            break;
                    }
                }
            });
        });
    }

    function setupAlgorithmRadioButtons() {
        let radioButtons = document.querySelectorAll('input[name="algorithmOption"]');

        for (let i = 0; i < radioButtons.length; i++) {
            radioButtons[i].addEventListener('change', function() {
                let animateButtonText = 'Animate ';

                switch(radioButtons[i].value) {
                    case 'dijkstra':
                        animateButtonText += 'Dijkstra';
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'aStar':
                        animateButtonText += 'A*';
                        resetToggleButtons();
                        enableDirections();
                        break;
                    case 'greedyBFS':
                        animateButtonText += 'Greedy';
                        resetToggleButtons();
                        enableDirections();
                        break;
                    case 'breadthFirstSearch':
                        animateButtonText += 'BFS';
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'bidirectionalDijkstra':
                        animateButtonText += 'Bi. Dijkstra';
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'bidirectionalAStar':
                        animateButtonText += 'Bi. A*';
                        resetToggleButtons();
                        enableDirections();
                        break;
                    case 'depthFirstSearch':
                        animateButtonText += 'DFS';
                        resetToggleButtons();
                        disableToggleButtons();
                        break;
                    case 'jumpPointSearch':
                        animateButtonText += 'JPS';
                        resetToggleButtons();
                        setAndDisableDirections();
                        break;
                }

                animateAlgorithmButton.innerHTML = animateButtonText;
                /* The border was 3px solid red if no radio button was selected and
                    the "Animate" button was pressed */
                algorithmDropDownButton.style.border = '1px solid white';
            });
        }
    }

    document.addEventListener('keydown', function(ev) {
        gridBoard.pressedKey = ev.key;
    });

    document.addEventListener('keyup', function() {
        gridBoard.pressedKey = null;
    });

    /* Create a new grid if the user resized the window */
    window.addEventListener('resize', function() {
        adjustGridDimensions();
        createGrid(gridBoard);
    });

    directionsToggleButton.addEventListener('change', function() {
        /* Allow "corner cutting" if "eight directions" is enabled */
        if (directionsToggleButton.checked === true) {
            cornerCuttingToggleButton.disabled = false;
            cornerCuttingSwitch.style.backgroundColor = '#79e082';
            eightDirections = true;
        }

        /* Disallow "corner cutting" when "eight directions" is disabled */
        else {
            cornerCuttingToggleButton.checked = false;
            cornerCuttingToggleButton.disabled = true;
            cornerCuttingSwitch.style.backgroundColor = 'red';
            cornerCutting = false;
            eightDirections = false;
        }
    });

    cornerCuttingToggleButton.addEventListener('change', function() {
        if (cornerCuttingToggleButton.checked === true) {
            cornerCutting = true;
        }

        else {
            cornerCutting = false;
        }
    });

    /* Close the menu if the user's mouse leaves it */
    algorithmDropDownMenu.addEventListener('mouseleave', function() {
        algorithmDropDownMenu.style.display = 'none';
        algorithmDropDownButton.innerHTML = 'Algorithms&#9660;'
    });

    weightDropDownButton.addEventListener('click', function() {
        if (weightDropDownMenu.style.display === '' || 
                weightDropDownMenu.style.display === 'none') {
            weightDropDownMenu.style.display = 'block';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9650;';
        }

        else {
            weightDropDownMenu.style.display = 'none';
            weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
        }
    });

    weightDropDownMenu.addEventListener('mouseleave', function() {
        weightDropDownMenu.style.display = 'none';
        weightDropDownButton.innerHTML = 'Adjust Weights&#9660;';
    });

    lightWeightSlider.addEventListener('input', function() {
        /* The prototype function "call" passes "this" to the function 
            handleLightWeightSlider (here lightWeightSlider) */
        handleLightWeightSlider.call(this);
    });

    normalWeightSlider.addEventListener('input', function() {
        handleNormalWeightSlider.call(this);
    });

    heavyWeightSlider.addEventListener('input', function() {
        handleHeavyWeightSlider.call(this);
    });

    clearAlgorithmButton.addEventListener('click', function() {
        removePreviousAlgorithm(gridBoard);
    });

    mobileMenuButton.addEventListener('touchstart', function(ev) {
        /* Prevent mouse events from being created for touch events */
        ev.preventDefault();

        const menuStyles = document.getElementsByClassName('menuStyle');

        for (const menuStyle of menuStyles) {
            if (menuStyle.style.display === 'flex') {
                menuStyle.style.display = 'none';
                algorithmDropDownButton.disabled = false;
                animateAlgorithmButton.disabled = false;
            }

            else {
                menuStyle.style.display = 'flex';
                algorithmDropDownButton.disabled = true;
                animateAlgorithmButton.disabled = true;
            }
        }
    });
}); 