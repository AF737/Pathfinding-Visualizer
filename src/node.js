'use strict';

export default class Node 
{
    constructor(id, row, col, currClass) 
    {
        this.id = id;
        this.class = currClass;
        this.row = row;
        this.column = col;
        this.weight = 0;
        this.isVisited = false;
        this.isWall = false;
        this.distanceFromStart = Infinity;
        this.distanceFromFinish = Infinity;
        this.heuristicDistance = Infinity;
        this.totalDistance = Infinity;
        this.prevNode = null;
        /* Used for bidirectional algorithms */
        this.prevNodeFromFinish = null;
        this.isJumpPoint = false;
        this.allowedDirection = [null, null];
    }
}