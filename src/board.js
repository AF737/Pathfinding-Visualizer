'use strict';

export default class Board {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.nodesMatrix = [];
        this.visitedNodes = [];
        this.shortestPath = [];
    }
}