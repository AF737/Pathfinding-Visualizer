'use strict';

export const NODE_WEIGHT_NONE = 0;
export let nodeWeightLight = 15;
export let nodeWeightNormal = 30;
export let nodeWeightHeavy = 45;

export function handleLightWeightSlider(gridBoard) 
{
    /* Ensures that the value's read as a decimal number */
    nodeWeightLight = parseInt(this.value, 10);
    document.getElementById('lightWeightLabel').innerHTML = this.value;
    
    /* Change the weight value of all lightweight nodes that are already placed on
        the grid */
    const lightWeights = document.getElementsByClassName('lightWeight');

    for (const lightWeight of lightWeights) 
        gridBoard.changeWeightOfNodeTo(lightWeight.id, nodeWeightLight);
}

export function handleNormalWeightSlider(gridBoard) 
{
    nodeWeightNormal = parseInt(this.value, 10);
    document.getElementById('normalWeightLabel').innerHTML = this.value;

    const normalWeights = document.getElementsByClassName('normalWeight');

    for (const normalWeight of normalWeights) 
        gridBoard.changeWeightOfNodeTo(normalWeight.id, nodeWeightNormal);
}

export function handleHeavyWeightSlider(gridBoard) 
{
    nodeWeightHeavy = parseInt(this.value, 10);
    document.getElementById('heavyWeightLabel').innerHTML = this.value;

    const heavyWeights = document.getElementsByClassName('heavyWeight');

    for (const heavyWeight of heavyWeights) 
        gridBoard.changeWeightOfNodeTo(heavyWeight.id, nodeWeightHeavy);
}