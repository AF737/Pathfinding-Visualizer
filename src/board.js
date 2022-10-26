'use strict';

export default class Board 
{
    constructor(rows, columns) 
    {
        this.rows = rows;
        this.columns = columns;
        this.startRow = null;
        this.startCol = null;
        this.finishRows = [];
        this.finishCols = [];
        this.nodesMatrix = [];
        this.mouseIsPressed = false;
        this.pressedKey = null;
        this.startIsPlaced = false;
        this.finishIsPlaced = false;
        this.algoIsRunning = false;
    }

    isOnGrid(row, col)
    {
        if (row >= 0 && row <= this.rows - 1 &&
            col >= 0 && col <= this.columns - 1)
            return true;
        
        return false;
    }

    isAccessibleAt(row, col)
    {
        if (this.isOnGrid(row, col) === false ||
            this.nodesMatrix[row][col].isWall === true)
            return false;
        
        return true;
    }

    addFinishPriority(id)
    {
        const newFinishPriority = document.createElement('p');
        /* Fill empty indices before adding new ones */
        let emptyPriority = this.finishRows.indexOf(null);

        /* No empty index was found */
        if (emptyPriority === -1)
        {
            /* All priorites between 1 and 99 are taken */
            if (this.finishRows.length === 99)
                return null;
            /* New priority will have the highest value */
            else
                emptyPriority = this.finishRows.length;
        }

        newFinishPriority.id = `finish-priority-${emptyPriority + 1}`;
        newFinishPriority.className = 'finishPriority';
        /* Ignore clicks on text (priority value) so that the  node underneath it 
            can respond accordingly */
        newFinishPriority.style.pointerEvents = 'none';
        newFinishPriority.style.fontSize = '14 px';
        newFinishPriority.style.color = 'white';
        newFinishPriority.innerHTML = `${emptyPriority + 1}`;
        
        const [descriptor, row, col] = id.split('-');
        this.finishRows[emptyPriority] = row;
        this.finishCols[emptyPriority] = col;
        
        return newFinishPriority;
    }

    clearFinishPriority(id)
    {
        const node = document.getElementById(id);

        node.removeChild(node.firstElementChild);
        node.className = 'unvisited';

        const [descriptor, row, col] = id.split('-');
        const index = this.finishRows.indexOf(row);
        
        if (index !== -1)
        {
            this.finishRows[index] = null;
            this.finishCols[index] = null;
        }
    }

    numberOfFinishNodesPlaced()
    {
        return this.finishRows.length;
    }

    removeAllFinishNodes()
    {
        for (let i = 0; i < this.finishRows.length; i++)
        {
            if (this.finishRows[i] !== null)
                this.clearFinishPriority(`node-${this.finishRows[i]}-${this.finishCols[i]}`)
        }

        this.finishRows.length = 0;
        this.finishCols.length = 0;
    }
}