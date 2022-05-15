'use strict';

export default class Board 
{
    constructor(rows, columns) 
    {
        this.rows = rows;
        this.columns = columns;
        this.startRow = null;
        this.startCol = null;
        this.finishRow = null;
        this.finishCol = null;
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
}