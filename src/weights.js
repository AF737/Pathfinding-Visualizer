'use strict';

export {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy, 
        handleLightWeightSlider, handleNormalWeightSlider, handleHeavyWeightSlider,
        changeWeightOfNode, removeWeights};

const NODE_WEIGHT_NONE = 0;
let nodeWeightLight = 15;
let nodeWeightNormal = 30;
let nodeWeightHeavy = 45;

function handleLightWeightSlider() {
    nodeWeightLight = parseInt(this.value, 10);
    document.getElementById('lightWeightLabel').innerHTML = this.value;
    
    /* Change the weight value of all lightweight nodes that are already placed on
        the grid */
    let leightWeights = document.getElementsByClassName('lightWeight');

    for (let i = 0; i < leightWeights.length; i++) {
        changeWeightOfNode(leightWeights[i].id, nodeWeightLight, gridBoard);
    }
}

function handleNormalWeightSlider() {
    nodeWeightNormal = parseInt(this.value, 10);
    document.getElementById('normalWeightLabel').innerHTML = this.value;

    let normalWeights = document.getElementsByClassName('lightWeight');

    for (let i = 0; i < normalWeights.length; i++) {
        changeWeightOfNode(normalWeights[i].id, nodeWeightNormal, gridBoard);
    }
}

function handleHeavyWeightSlider() {
    nodeWeightHeavy = parseInt(this.value, 10);
    document.getElementById('heavyWeightLabel').innerHTML = this.value;

    let heavyWeights = document.getElementsByClassName('heavyWeight');

    for (let i = 0; i < heavyWeights.length; i++) {
        changeWeightOfNode(heavyWeights[i].id, nodeWeightHeavy, gridBoard);
    }
}

function changeWeightOfNode(id, newWeight, gridBoard) {
    const [descriptor, row, col] = id.split('-');

    gridBoard.nodesMatrix[row][col].weight = newWeight;
}

function removeWeights(gridBoard) {
    for (let row = 0; row < gridBoard.rows; row++) {
        for (let col = 0; col < gridBoard.columns; col++) {
            if (gridBoard.nodesMatrix[row][col].weight !== NODE_WEIGHT_NONE) {
                changeWeightOfNode(`node-${row}-${col}`, NODE_WEIGHT_NONE);
                document.getElementById(`node-${row}-${col}`).className = 'unvisited';
            }
        }
    }
}