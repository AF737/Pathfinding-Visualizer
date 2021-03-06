'use strict';

export const NODE_WEIGHT_NONE = 0;
export let nodeWeightLight = 15;
export let nodeWeightNormal = 30;
export let nodeWeightHeavy = 45;

export function handleLightWeightSlider() 
{
    /* Ensures that the value's read as a decimal number */
    nodeWeightLight = parseInt(this.value, 10);
    document.getElementById('lightWeightLabel').innerHTML = this.value;
    
    /* Change the weight value of all lightweight nodes that are already placed on
        the grid */
    let lightWeights = document.getElementsByClassName('lightWeight');

    for (const lightWeight of lightWeights) 
        changeWeightOfNode(lightWeight.id, nodeWeightLight, gridBoard);
}

export function handleNormalWeightSlider() 
{
    nodeWeightNormal = parseInt(this.value, 10);
    document.getElementById('normalWeightLabel').innerHTML = this.value;

    let normalWeights = document.getElementsByClassName('normalWeight');

    for (const normalWeight of normalWeights) 
        changeWeightOfNode(normalWeight.id, nodeWeightNormal, gridBoard);
}

export function handleHeavyWeightSlider() 
{
    nodeWeightHeavy = parseInt(this.value, 10);
    document.getElementById('heavyWeightLabel').innerHTML = this.value;

    let heavyWeights = document.getElementsByClassName('heavyWeight');

    for (const heavyWeight of heavyWeights) 
        changeWeightOfNode(heavyWeight.id, nodeWeightHeavy, gridBoard);
}

export function changeWeightOfNode(id, newWeight, gridBoard)
{
    const [descriptor, row, col] = id.split('-');

    gridBoard.nodesMatrix[row][col].weight = newWeight;
}

export function removeWeights(gridBoard) 
{
    for (let row = 0; row < gridBoard.rows; row++) 
    {
        for (let col = 0; col < gridBoard.columns; col++) 
        {
            if (gridBoard.nodesMatrix[row][col].weight !== NODE_WEIGHT_NONE) 
            {
                changeWeightOfNode(`node-${row}-${col}`, NODE_WEIGHT_NONE, gridBoard);
                document.getElementById(`node-${row}-${col}`)
                    .className = 'unvisited';
            }
        }
    }
}