'use strict';

export default function eller(grid)
{
    const cellSets = [];
    let setNumber = 0;

    for (let row = 1; row < grid.rows - 1; row += 2)
    {
        const cellSetsOfRow = [];

        for (let col = 1; col < grid.columns - 1; col += 2)
        {
            const cellSet = [];
            cellSet.push(setNumber);
            cellSet.push(grid.nodesMatrix[row][col]);

            cellSetsOfRow.push(cellSet);
            setNumber++;
        }

        cellSets.push(cellSetsOfRow);
    }

    for (let row = 0; row < cellSets.length - 1; row++)
    {
        const currentCellSets = cellSets[row];
        // console.log(currentCellSets);

        for (let setIndex = 0; setIndex < currentCellSets.length - 1; setIndex++)
        {
            for (let cellIndex = 1; cellIndex < currentCellSets[setIndex].length; cellIndex++)
            {
                const currentSet = currentCellSets[setIndex];
                const currentCellSetNumber = currentSet[0];
                const currentCell = currentSet[cellIndex];

                // if (setIndex + 1 >= currentCellSets.length)
                //     break;

                /* Right neighbor didn't have the chance to be added to another set so it always
                    contains only 1 cell */
                // const rightNeighborSet = currentCellSets[setIndex + 1];
                // const rightNeighborSetNumber = rightNeighborSet[0];
                // const rightNeighborCell = rightNeighborSet[1];
                // console.log(currentCell);
                const neighbors = grid.getNeighborsOfMazeCell(currentCell);
                let rightNeighborCell = undefined;

                for (const neighbor of neighbors)
                {
                    if (isRightNeighbor(currentCell, neighbor) === true)
                    {
                        rightNeighborCell = neighbor;
                        break;
                    }
                }

                if (rightNeighborCell === undefined)
                    break;

                // console.log('neighbor: ');
                // console.log(rightNeighborCell);
                const rightNeighborSetNumber = getSetNumberOfCell(rightNeighborCell, currentCellSets);

                let addRightSet = false;

                if (Math.random() < 0.5)
                    addRightSet = true;

                if (currentCellSetNumber !== rightNeighborSetNumber && addRightSet === true)
                {
                    currentSet.push(rightNeighborCell);
                    currentCellSets.splice(setIndex + 1, 1);
                    grid.removeWallBetweenMazeCells(currentCell, rightNeighborCell);
                }
            }
        }

        const cellSetsBelow = cellSets[row + 1];
        /* All sets below only contain one cell, so just check how many cells have been moved
            to the right to get the index of the cell below */
        let indexOfSetBelow = 0;

        for (let setIndex = 0; setIndex < currentCellSets.length; setIndex++)
        {
            const currentSetNumber = currentCellSets[setIndex][0];
            let oneBottomSetAdded = false;

            for (let cellIndex = 1; cellIndex < currentCellSets[setIndex].length; cellIndex++)
            {
                let addBottomSet = false;
                const lastCellInSet = cellIndex === currentCellSets[setIndex].length - 1;

                /* Always add the cell of the set below if no cell below the current set has been added yet
                    and the current cell is the right most (last) one in the current set */
                if (oneBottomSetAdded === false && lastCellInSet === true || Math.random() < 0.5)
                {
                    addBottomSet = true;
                    oneBottomSetAdded = true;
                }

                if (addBottomSet === true)
                {
                    cellSetsBelow[indexOfSetBelow][0] = currentSetNumber;
                    const currentCell = currentCellSets[setIndex][cellIndex];
                    const neighbors = grid.getNeighborsOfMazeCell(currentCell);
                    let bottomNeighbor = undefined;

                    for (const neighbor of neighbors)
                    {
                        if (isBottomNeighbor(currentCell, neighbor) === true)
                        {
                            bottomNeighbor = neighbor;
                            break;
                        }
                    }

                    if (bottomNeighbor === undefined)
                        break;

                    // const cellBelow = cellSetsBelow[indexOfSetBelow][1];

                    grid.removeWallBetweenMazeCells(currentCell, bottomNeighbor);
                }

                indexOfSetBelow++;
            }
        }

        /* In the row below the current one add all sets with the same set number to one set */
        for (let setIndex = 0; setIndex < cellSetsBelow.length - 1; setIndex++)
        {
            const setNumberToJoinTogether = cellSetsBelow[setIndex][0];

            // let rightNeighborSetIndex = setIndex + 1;
            // const setsToRemove = [];

            for (let index = setIndex + 1; index < cellSetsBelow.length; index++)
            {
                const currSetNumber = cellSetsBelow[index][0];

                if (currSetNumber === setNumberToJoinTogether)
                {
                    const cellToMove = cellSetsBelow[index][1];
                    cellSetsBelow[setIndex].push(cellToMove);
                    cellSetsBelow.splice(index, 1);
                }

            }

            // while (cellSetsBelow[rightNeighborSetIndex][0] === currCellSetNumber)
            // {
            //     const cellToMove = cellSetsBelow[rightNeighborSetIndex][1];
            //     cellSetsBelow[setIndex].push(cellToMove);
            //     setsToRemove.push(rightNeighborSetIndex);
            //     rightNeighborSetIndex++;
            // }

            // for (const setToRemove of setsToRemove)
            //     cellSetsBelow.splice(setToRemove, 1);
        }

        console.log(cellSets);
        console.log(cellSetsBelow);

        if (row === 1)
            break;

        // console.log(cellSetsBelow);

        for (const c of cellSetsBelow)
        {
            // console.log(c[0]);
        }
        // console.log(cellSetsBelow);
        // if (row === 2)
        //     break;
    }

    return;

    for (let row = 0; row < cellSets.length; row++)
    {
        const cellSetsOfRow = cellSets[row];
        let setIndex = 0;
        
        for (const cellSet of cellSetsOfRow)
        {
            for (let i = 1; i < cellSet.length; i++)
            {
                const currCell = cellSet[i];
                const currCellSetNumber = cellSet[0];
                let setIndexOfRightNeighborSet = -1;
                
                for (const cS of cellSetsOfRow)
                {
                    for (let i = 1; i < cS.length; i++)
                    {
                        if (cS[i].row === currCell.row &&
                            cS[i].column === currCell.column + 2)
                        {
                            
                            break;
                        }
                    }
                }
                const indexOfRightNeighborSet = setIndex + 1;
                const rightNeighbor = cellSetsOfRow[indexOfRightNeighborSet][1];
                const rightNeighborSetNumber = cellSetsOfRow[indexOfRightNeighborSet][0];

                let joinAdjacentSets = false;

                if (Math.random() < 0.5)
                    joinAdjacentSets = true;

                if (currCellSetNumber !== rightNeighborSetNumber && joinAdjacentSets === true)
                {
                    for (let cellIndex = 1; cellIndex < cellSetsOfRow[indexOfRightNeighborSet].length; cellIndex++)
                    {
                        const cellToMove =  cellSetsOfRow[indexOfRightNeighborSet][cellIndex];
                        cellSetsOfRow[setIndex].push(cellToMove);
                    }

                    cellSetsOfRow.splice(indexOfRightNeighborSet, 1);

                    grid.removeWallBetweenMazeCells(currCell, rightNeighbor);
                }

                /* Move on to the set of the right neighbor, because the right neighbor wasn't added 
                    to the set of the current cell */
                else
                    setIndex++;
            }
        }

        if (row < cellSets.length - 1)
        {
            const cellSetsOfRowBelow = cellSets[row + 1];
            
            /* Go through every set in the row and randomly cells below to them (at least one cell per set) */
            for (const cellSet of cellSetsOfRow)
            {
                let numberOfSetsBelowJoined = 0;

                /* Go through every cell in the set and randomly add the cell below it to the set of the top cell */
                for (let cellIndex = 1; cellIndex < cellSet.length; cellIndex++)
                {
                    let joinSetBelow = false;

                    if (Math.random() < 0.5)
                        joinSetBelow = true;

                    if (joinSetBelow === true)
                    {
                        const cell = cellSet[cellIndex];
                        const rowOfCellBelow = cell.row + 2;
                        const colOfCellBelow = cell.column;

                        /* Find the cell in its set */
                        for (const cellSetOfRowBelow of cellSetsOfRowBelow)
                        {
                            /* The cells below haven't been randomly joined together so each set only contains one cell */
                            const onlyCellOfSet = cellSetOfRowBelow[1];

                            if (onlyCellOfSet.row === rowOfCellBelow && 
                                onlyCellOfSet.column === colOfCellBelow)
                            {
                                /* Give the cell below the same set number as the one above */
                                cellSetOfRowBelow[0] = cellSet[0];
                                grid.removeWallBetweenMazeCells(cell, onlyCellOfSet);
                                break;
                            }
                        }

                        numberOfSetsBelowJoined++;
                    }
                }

                /* Add the cell below the right most cell in the set if no cells below the set where added randomly */
                if (numberOfSetsBelowJoined === 0)
                {
                    const indexOfRightMostCellInSet = cellSet.length - 1;
                    const cell = cellSet[indexOfRightMostCellInSet];
                    const rowOfCellBelow = cell.row + 2;
                    const colOfCellBelow = cell.column;

                    /* Find the cell in its set */
                    for (const cellSetOfRowBelow of cellSetsOfRowBelow)
                    {
                        /* The cells below haven't been randomly joined together so each set only contains one cell */
                        const onlyCellOfSet = cellSetOfRowBelow[1];

                        if (onlyCellOfSet.row === rowOfCellBelow && 
                            onlyCellOfSet.column === colOfCellBelow)
                        {
                            /* Give the cell below the same set number as the one above */
                            cellSetOfRowBelow[0] = cellSet[0];
                            grid.removeWallBetweenMazeCells(cell, onlyCellOfSet);
                            break;
                        }
                    }
                }
            }
        }

        /* In the bottom most row join all cells in different cells together */
        else
        {
            const cellSetsOfRow = cellSets[row];
            console.log(cellSetsOfRow);
            let setIndex = 0;
            
            while (setIndex < cellSetsOfRow.length - 1)
            {
                const rightMostCellOfCurrSet = cellSetsOfRow[setIndex].length - 1;
                const currCell = cellSetsOfRow[setIndex][rightMostCellOfCurrSet];
                const currCellSetNumber = cellSetsOfRow[setIndex][0];
                const indexOfRightNeighborSet = setIndex + 1;
                const rightNeighbor = cellSetsOfRow[indexOfRightNeighborSet][1];
                const rightNeighborSetNumber = cellSetsOfRow[indexOfRightNeighborSet][0];

                if (currCellSetNumber !== rightNeighborSetNumber)
                {
                    for (let cellIndex = 1; cellIndex < cellSetsOfRow[indexOfRightNeighborSet].length; cellIndex++)
                    {
                        const cellToMove =  cellSetsOfRow[indexOfRightNeighborSet][cellIndex];
                        cellSetsOfRow[setIndex].push(cellToMove);
                    }

                    cellSetsOfRow.splice(indexOfRightNeighborSet, 1);

                    grid.removeWallBetweenMazeCells(currCell, rightNeighbor);
                }

                setIndex++;
            }
        }
    }

    return;

    let setIndex = 0;

    while (setIndex < cellSets.length - 1)
    {
        console.log(`${setIndex}`);
        const rightMostCellOfCurrSet = cellSets[setIndex].length - 1;
        const currCell = cellSets[setIndex][rightMostCellOfCurrSet];
        const rightNeighbor = cellSets[setIndex + 1][0];

        const currCellSetNumber = 
            getSetNumberOfCell(currCell.row, currCell.column, cellSets);
        const rightNeighborSetNumber = 
            getSetNumberOfCell(rightNeighbor.row, rightNeighbor.column, cellSets);

        /* Randomly join cells that are in separate sets and remove the
            horizontal walls between them */
        let joinAdjacentSets = false;

        if (Math.random() < 0.5)
            joinAdjacentSets = true;

        /* Both cells are in different sets */
        if (currCellSetNumber !== rightNeighborSetNumber && joinAdjacentSets === true)
        {
            /* Move all the cells contained in the same set as the right
                cell into the set where the left cell is in */
            while (cellSets[rightNeighborSetNumber].length > 0)
            {
                const cellToMove = cellSets[rightNeighborSetNumber].pop();
                cellSets[currCellSetNumber].push(cellToMove);
            }

            /* Remove the empty set which had contained the right cell */
            cellSets.splice(rightNeighborSetNumber, 1);

            grid.removeWallBetweenMazeCells(currCell, rightNeighbor);
        }

        /* Move on to the set of the right neighbor, because the right neighbor wasn't added 
            to the set of the current cell */
        else
            setIndex++;
    }

    return;

    for (let row = 3; row < grid.rows - 1; row += 2)
    {

    }
}

function isRightNeighbor(cell, neighbor)
{
    const rowDiff = neighbor.row - cell.row;
    const colDiff = neighbor.column - cell.column;

    if (rowDiff === 0 && colDiff === 2)
        return true;

    return false;
}

function isBottomNeighbor(cell, neighbor)
{
    const rowDiff = neighbor.row - cell.row;
    const colDiff = neighbor.column - cell.column;

    if (rowDiff === -2 && colDiff === 0)
        return true;

    return false;
}

function getSetNumberOfCell(cell, cellSetsOfRow)
{
    for (const cellSet of cellSetsOfRow)
    {
        const setNumber = cellSet[0];

        for (let cellIndex = 1; cellIndex < cellSet.length; cellIndex++)
        {
            const currCell = cellSet[cellIndex];

            if (currCell.row === cell.row && currCell.column === cell.column)
                return setNumber;
        }
    }
}