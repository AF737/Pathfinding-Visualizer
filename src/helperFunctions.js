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
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const bars = document.getElementsByClassName('bar');

    for (const button of dropDownButtons) 
        button.disabled = false;

    const menuButtons = document.getElementsByClassName('menuButton');

    for (const button of menuButtons) 
        button.disabled = false;

    mobileMenuButton.style.pointerEvents = 'auto';

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
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const bars = document.getElementsByClassName('bar');

    for (const button of dropDownButtons) 
        button.disabled = true;

    for (const button of menuButtons) 
        button.disabled = true;

    mobileMenuButton.style.pointerEvents = 'none';

    for (const bar of bars) 
        bar.style.backgroundColor = DISABLED_COLOR;
}

export function changeWallStatus(id, newWallStatus, gridBoard) 
{
    const [descriptor, row, col] = id.split('-');
    
    gridBoard.nodesMatrix[row][col].isWall = newWallStatus;
}

export function removeWalls(gridBoard) 
{
    for (let row = 0; row < gridBoard.rows; row++) 
    {
        for (let col = 0; col < gridBoard.columns; col++) 
        {
            if (gridBoard.isAccessibleAt(row, col) === false) 
            {
                gridBoard.nodesMatrix[row][col].isWall = false;
                document.getElementById(`node-${row}-${col}`).className = Node.unvisited;
            } 
        }
    }
}

export function removePreviousAlgorithm(gridBoard) 
{
    for (let row = 0; row < gridBoard.rows; row++) 
    {
        for (let col = 0; col < gridBoard.columns; col++) {
            const node = document.getElementById(`node-${row}-${col}`);

            /* Leave start, finish, walls and weights as they are */
            if (node.className === Node.visited || node.className === Node.shortestPath ||
                node.className === Node.jumpPoint || 
                node.className === Node.visitedByPreviousAlgorithm)
                    node.className = Node.unvisited;

            resetNode(row, col, gridBoard);
        }
    }
    
    document.getElementById(`node-${gridBoard.startRow}-${gridBoard.startCol}`)
        .className = Node.start;

    for (let i = 0; i < gridBoard.finishRows.length; i++)
        document.getElementById(`node-${gridBoard.finishRows[i]}-${gridBoard.finishCols[i]}`)
            .className = Node.finish;
}

export function makePreviousAlgorithmLessVisible(gridBoard)
{
    for (let row = 0; row < gridBoard.rows; row++)
    {
        for (let col = 0; col < gridBoard.columns; col++)
        {
            const node = document.getElementById(`node-${row}-${col}`);

            if (node.className === Node.visited || node.className === Node.jumpPoint)
                node.className = Node.visitedByPreviousAlgorithm;

            resetNode(row, col, gridBoard);
        }
    }
}

function resetNode(row, col, gridBoard)
{
    /* Reset each element in the nodesMatrix so that the next algorithm
    can start from scratch */
    gridBoard.nodesMatrix[row][col].isVisited = false;
    gridBoard.nodesMatrix[row][col].distanceFromStart = Infinity;
    gridBoard.nodesMatrix[row][col].distanceFromFinish = Infinity;
    gridBoard.nodesMatrix[row][col].heuristicDistance = Infinity;
    gridBoard.nodesMatrix[row][col].totalDistance = Infinity;
    gridBoard.nodesMatrix[row][col].prevNode = null;
    gridBoard.nodesMatrix[row][col].prevNodeFromFinish = null;
    gridBoard.nodesMatrix[row][col].direction = null;
    gridBoard.nodesMatrix[row][col].isJumpPoint = false;
}

/* Place start and finish at their original positions from when the grid was first
    created */
export function resetStartAndFinish(gridBoard) 
{
    let finishRow, finishCol;

    if (gridBoard.startIsPlaced === true)
        document.getElementById(`node-${gridBoard.startRow}-${gridBoard.startCol}`)
            .className = Node.unvisited;
    
    gridBoard.removeAllFinishNodes();
    
    if (gridBoard.columns >= gridBoard.rows) 
    {
        gridBoard.startRow = Math.floor(gridBoard.rows / 2);
        gridBoard.startCol = Math.floor(gridBoard.columns / 4);
        finishRow = Math.floor(gridBoard.rows / 2);
        finishCol = Math.floor((gridBoard.columns / 4) * 3);
    }

    /* Place them under each other for the mobile version */
    else 
    {
        gridBoard.startRow = Math.floor(numOfRows / 4);
        gridBoard.startCol = Math.floor(numOfCols / 2);
        finishRow = Math.floor((numOfRows / 4) * 3);
        finishCol = Math.floor(numOfCols / 2);
    }

    const finishNode = `node-${finishRow}-${finishCol}`;
    
    document.getElementById(`node-${gridBoard.startRow}-${gridBoard.startCol}`)
        .className = Node.start;
    document.getElementById(finishNode).className = Node.finish;

    document.getElementById(finishNode).appendChild(gridBoard.addFinishPriority(finishNode));
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