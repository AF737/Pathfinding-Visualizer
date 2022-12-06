'use strict';

const Node = 
{
    unvisited: 'unvisited',
    visited: 'visited',
    start: 'start',
    finish: 'finish',
    shortestPath: 'shortestPath',
    jumpPoint: 'jumpPoint',
    visitedByPreviousAlgorithm: 'visitedByPreviousAlgorithm'
};

/* Make Node attributes immutable */
Object.freeze(Node);

export const DISABLED_COLOR = 'red';
export const BUTTON_BACKGROUND_COLOR = '#79e082';

export function enableButtons() 
{
    const dropDownButtons = document.getElementsByClassName('dropDownButton');
    const mobileOptionsButton = document.getElementById('mobileOptionsButton');
    const bars = document.getElementsByClassName('bar');

    for (const button of dropDownButtons) 
        button.disabled = false;

    const menuButtons = document.getElementsByClassName('menuButton');

    for (const button of menuButtons)
        button.disabled = false;

    mobileOptionsButton.style.pointerEvents = 'auto';

    /* The mobile menu button consists for three bars that are red when it can't
        be clicked */
    for (const bar of bars) 
        bar.style.backgroundColor = 'white';
}

export function enableButtonsMobile() 
{
    const menuButtons = document.getElementsByClassName('menuButton');
    
    for (const button of menuButtons) 
    {
        if (button.id === 'animateAlgorithm') 
            continue;

        button.disabled = false;
    }
}

export function disableButtons() 
{
    const dropDownButtons = document.getElementsByClassName('dropDownButton');
    const menuButtons = document.getElementsByClassName('menuButton');
    const mobileOptionsButton = document.getElementById('mobileOptionsButton');
    const bars = document.getElementsByClassName('bar');

    for (const button of dropDownButtons) 
        button.disabled = true;

    for (const button of menuButtons) 
        button.disabled = true;

    mobileOptionsButton.style.pointerEvents = 'none';

    for (const bar of bars) 
        bar.style.backgroundColor = DISABLED_COLOR;
}

export function resetToggleButtons() 
{
    document.getElementById('eightDirectionsToggleButton').checked = false;
    document.getElementById('cornerCuttingToggleButton').checked = false;
    document.getElementById('cornerCuttingToggleButton').disabled = true;
    document.getElementById('cornerCuttingSwitch').style.background = DISABLED_COLOR;
}

export function disableToggleButtons() 
{
    document.getElementById('eightDirectionsToggleButton').disabled = true;
    document.getElementById('directionsSwitch').style.backgroundColor = DISABLED_COLOR;
    document.getElementById('cornerCuttingToggleButton').disabled = true;
    document.getElementById('cornerCuttingSwitch').style.backgroundColor = DISABLED_COLOR;
}

export function enableEightDirections() 
{
    document.getElementById('eightDirectionsToggleButton').disabled = false;
    document.getElementById('directionsSwitch').style.backgroundColor = BUTTON_BACKGROUND_COLOR;
}

/* Used for Jump Point Search where eight directions are necessary */
export function setAndDisableEightDirections() 
{
    document.getElementById('eightDirectionsToggleButton').checked = true;
    document.getElementById('eightDirectionsToggleButton').disabled = true;
    document.getElementById('eightDirectionsToggleButton').style.backgroundColor = DISABLED_COLOR;
}

export function enableCornerCutting() 
{
    document.getElementById('cornerCuttingToggleButton').disabled = false;
    document.getElementById('cornerCuttingSwitch').style.backgroundColor = BUTTON_BACKGROUND_COLOR;
}