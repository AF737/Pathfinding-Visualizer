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
}