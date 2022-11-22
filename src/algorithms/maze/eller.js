'use strict';

export default function eller(grid)
{
    const animations = [];
    const sets = [];
    let setNumber = 0;

    for (let row = 1; row < grid.rows - 1; row += 2)
    {
        const setsOfRow = [];

        for (let col = 1; col < grid.columns - 1; col += 2)
        {
            setsOfRow.push([setNumber, grid.nodesMatrix[row][col]]);
            setNumber++;
        }

        sets.push(setsOfRow);
    }

    for (let row = 0; row < sets.length; row++)
    {
        const currSets = sets[row];
        const lastRow = row === sets.length - 1;

        for (let setIndex = 0; setIndex < currSets.length - 1; setIndex++)
        {
            const currSetNumber = currSets[setIndex][0];
            const currCell = currSets[setIndex][1];
            const rightNeighborSetNumber = currSets[setIndex + 1][0];
            const rightNeighborCell = currSets[setIndex + 1][1];
            const joinSets = Math.random() < 0.5;

            /* In the last row join all sets with different set numbers together */
            if (currSetNumber !== rightNeighborSetNumber && (lastRow === true || joinSets === true))
            {
                /* Remove the wall between two distinct sets */
                grid.removeWallBetweenMazeCells(currCell, rightNeighborCell);

                const nodeBetween = grid.getNodeBetween(currCell, rightNeighborCell);
                animations.push(nodeBetween);

                /* Add all cells from the right set to the current one by changing
                    their set number therefore joining both sets together */
                for (let setInd = setIndex + 1; setInd < currSets.length; setInd++)
                {
                    const setNumberToCompare = currSets[setInd][0];

                    if (setNumberToCompare === rightNeighborSetNumber)
                        currSets[setInd][0] = currSetNumber;
                }
            }
        }

        /* Can't create passages to cells below if the last row is the current one */
        if (lastRow === true)
            break;

        /* Create random passages to cells below the sets of the current row */
        const setsBelow = sets[row + 1];
        const setsAlreadyDone = [];

        for (let setIndex = 0; setIndex < currSets.length; setIndex++)
        {
            let numOfCellsInCurrSet = 1;
            const currSetNumber = currSets[setIndex][0];

            if (setsAlreadyDone.includes(currSetNumber) === true)
                continue;

            setsAlreadyDone.push(currSetNumber);

            if (setIndex < currSets.length - 1)
            {
                for (let setInd = setIndex + 1; setInd < currSets.length; setInd++)
                {
                    if (currSets[setInd][0] === currSetNumber)
                        numOfCellsInCurrSet++;
                }
            }

            let oneBottomWallRemoved = false;

            for (let cellOffset = 0; cellOffset < numOfCellsInCurrSet; cellOffset++)
            {
                const removeBottomWall = Math.random() < 0.5;
                const setOnlyHasOneCell = numOfCellsInCurrSet === 1;

                /* Always remove bottom wall of the right most cell in a set if no bottom
                    wall in that set has been removed yet. Also always remove the bottom
                    wall if the set only has one cell */
                if (removeBottomWall === true ||
                    setOnlyHasOneCell === true ||
                    (cellOffset === numOfCellsInCurrSet - 1 && oneBottomWallRemoved === false))
                {
                    const currCell = currSets[setIndex + cellOffset][1];
                    const cellBelow = grid.nodesMatrix[currCell.row + 2][currCell.column];

                    setsBelow[setIndex + cellOffset][0] = currSetNumber;
                    grid.removeWallBetweenMazeCells(currCell, cellBelow);

                    const nodeBetween = grid.getNodeBetween(currCell, cellBelow);
                    animations.push(nodeBetween);

                    oneBottomWallRemoved = true;
                }
            }
        }
    }

    return animations;
}