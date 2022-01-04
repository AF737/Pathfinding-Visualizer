'use strict';

export default class Board {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.nodesMatrix = [];
        this.visitedNodes = [];
        this.shortestPath = [];
        this.mouseIsPressed = false;
        this.pressedKey = null;
        this.startIsPlaced = false;
        this.finishIsPlaced = false;
        this.algoIsRunning = false;
    }
}