'use strict';

export default class Node {
    constructor(id, row, col, currClass) {
        this.id = id;
        this.class = currClass;
        this.row = row;
        this.column = col;
        this.weight = 0;
        this.isStart = false;
        this.isFinish = false;
        this.isVisited = false;
        this.distance = Infinity;
        this.prevNode = null;
    }
}