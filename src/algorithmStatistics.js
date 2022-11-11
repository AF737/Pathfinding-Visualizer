'use strict';

export {algorithmStatisticsVisible, openAlgorithmStatistics, closeAlgorithmStatistics,
        collectAlgorithmStatistics};

import {enableButtons, enableButtonsMobile, disableButtons} 
        from './helperFunctions.js';
import startAlgorithmAnimation from './animateAlgorithms.js';

const tableHeaderText = ['Algorithm', 'Nodes Visited', 'Nodes Visited (*)', 
    'Shortest Path Length', 'Shortest Path Length (*)'];
const algorithmStatistics = document.getElementById('algorithmStatistics');
let algorithmStatisticsVisible = false;

function hideEmptyTableExplanation()
{
    document.getElementById('emptyTableExplanation').style.display = 'none';
}

function openAlgorithmStatistics()
{
    disableButtons();

    algorithmStatistics.visible = true;
    algorithmStatistics.style.display = 'inline';
}

function closeAlgorithmStatistics()
{
    const menuStyles = document.getElementsByClassName('menuStyle');

    for (const menuStyle of menuStyles) 
    {
        if (menuStyle.style.display === 'flex') 
            enableButtonsMobile();

        else 
            enableButtons();
    }

    algorithmStatisticsVisible = false;
    algorithmStatistics.style.display = 'none';
}

function createAlgorithmStatisticsTable(algorithmStatistics)
{
    const table = document.getElementById('algorithmStatisticsTable');
    /* Remove all content from table */
    table.innerHTML = '';
    
    const tableHeaderRow = table.insertRow();
    
    /* Create headlines for the different columns */
    for (const text of tableHeaderText)
    {
        const tableHeader = document.createElement('th');
        tableHeader.style.border = '1px solid black';
        tableHeader.style.padding = '5px';
        tableHeader.appendChild(document.createTextNode(`${text}`));
        tableHeaderRow.appendChild(tableHeader);
    }

    for (let row = 0; row < algorithmStatistics.length; row++)
    {
        const tableRow = table.insertRow();

        /* Highlight the algorithm that the user wanted to see animated */
        if (row === 0)
            /* Same background color as buttons in the top menu */
            tableRow.style.backgroundColor = 'rgba(121, 224, 130, 0.5)'; 
        
        for (let col = 0; col < algorithmStatistics[row].length; col++)
        {
            const tableData = tableRow.insertCell();

            tableData.style.border = '1px solid black';
            tableData.style.padding = '5px';
            tableData.appendChild(document.createTextNode(`${algorithmStatistics[row][col]}`));
        }
    }

    hideEmptyTableExplanation();
}

function collectAlgorithmStatistics(selectedAlgo, totalNumberOfVisitedNodes, totalNumberOfShortestPathNodes, gridBoard)
{
    const allAlgorithms = document.querySelectorAll('input[class="algorithmRadioButtons"]');
    const algorithmStatistics = [[selectedAlgo, totalNumberOfVisitedNodes, '+0%', totalNumberOfShortestPathNodes, '+0%']];
    
    for (const algorithm of allAlgorithms)
    {
        if (algorithm.value === selectedAlgo)
            continue;

        let previousIndex = null;
        let startNode;
        totalNumberOfVisitedNodes = 0;
        totalNumberOfShortestPathNodes = 0;

        for (let index = 0; index < gridBoard.finishRows.length; index++)
        {
            if (gridBoard.finishRows[index] === null)
                continue;

            if (previousIndex === null)
                startNode = gridBoard.nodesMatrix[gridBoard.startRow][gridBoard.startCol];
    
            else
                startNode = gridBoard.nodesMatrix[ gridBoard.finishRows[previousIndex] ][ gridBoard.finishCols[previousIndex] ];
    
            const finishNode = gridBoard.nodesMatrix[ gridBoard.finishRows[index] ][ gridBoard.finishCols[index] ];

            let lastFinishNode = true;

            for (let i = index + 1; i < gridBoard.finishRows.length; i++)
            {
                if (gridBoard.finishRows[i] !== null)
                {
                    lastFinishNode = false;
                    break;
                }
            }

            const onlyGetStatistics = true;
            const [timeToWait, numberOfVisitedNodes, numberOfShortestPathNodes] = 
                startAlgorithmAnimation(algorithm.value, startNode, finishNode, gridBoard, lastFinishNode, onlyGetStatistics);

            totalNumberOfVisitedNodes += numberOfVisitedNodes;
            totalNumberOfShortestPathNodes += numberOfShortestPathNodes;
            previousIndex = index;

            /* Reset all the node's attributes that have been set by the previous algorithm so that the next algorithm
                can start from scratch. Doesn't affect the visual appearence of the application so the algorithm selected
                by the user will still be displayed */
            gridBoard.resetAllNodesInternally();
        }

        algorithmStatistics.push([algorithm.value, totalNumberOfVisitedNodes, 
            calculatePercentageDifference(totalNumberOfVisitedNodes, algorithmStatistics[0][1]), 
            totalNumberOfShortestPathNodes, 
            calculatePercentageDifference(totalNumberOfShortestPathNodes, algorithmStatistics[0][3])]);
    }

    createAlgorithmStatisticsTable(algorithmStatistics);
    /* If the last algorithm is unweighted then display the weights again */
    gridBoard.restoreWeights();
}

    /* Calculate how many more or less nodes the other algorithms had to visited compared to the algorithm the user had selected.
        Do the same for the length of the shortest path */
    function calculatePercentageDifference(value, referenceValue)
    {
        if (value > referenceValue)
            return `+${parseInt((((value - referenceValue) / referenceValue) * 100), 10)}%`;
        
        else if (value < referenceValue)
            return `-${parseInt((((referenceValue - value) / referenceValue) * 100), 10)}%`;
        
        else 
            return '+0%';
    }