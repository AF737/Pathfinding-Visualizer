'use strict';

export default class Node {
    constructor(id, currClass) {
        this.id = id;
        this.class = currClass;
        this.weight = 0;
        this.isStart = null;
        this.isFinish = null;
        this.distance = Infinity;
    }
}