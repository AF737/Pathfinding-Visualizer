'use strict';

import {NodeType} from './index.js';
import {NODE_WEIGHT_NONE, nodeWeightLight, nodeWeightNormal, nodeWeightHeavy}
        from './weights.js'

export default class Board 
{
    constructor(rows, columns) 
    {
        this.rows = rows;
        this.columns = columns;
        this.startRow = null;
        this.startCol = null;
        this.finishPositions = [];
        this.nodesMatrix = [];
        this.mouseIsPressed = false;
        this.startIsPlaced = false;
        this.finishIsPlaced = false;
        this.algorithmIsRunning = false;
        this.eightDirectionalMovement = false;
        this.allowCornerCutting = false;
        this.mazeCells = [];
    }

    getNeighborsOfMazeCell(cell)
    {
        const row = cell.row;
        const col = cell.column;
        /* Each cell is consists of 2x2 nodes and the only node that isn't a wall in a cell
            is the top right node and the nodes directly around it are walls */
        const neighborsOffsets = [[0, -2], [2, 0], [0, 2], [-2, 0]];
        const neighbors = [];

        for (const offset of neighborsOffsets)
        {
            const rowOffset = offset[0];
            const colOffset = offset[1];

            if (this.isOnGrid(row + rowOffset, col + colOffset) === true)
                neighbors.push(this.nodesMatrix[row + rowOffset][col + colOffset]);
        }

        return neighbors;
    }

    getRandomUnvisitedMazeCell()
    {
        /* MazeCellCoordinates only contains the top right node of a 2x2 cell,
        because it's the only node that isn't a wall */
        const cell = this.mazeCells[Math.floor(Math.random() * this.mazeCells.length)];

        return this.nodesMatrix[cell.row][cell.column];
    }

    isWallBetweenMazeCells(cell, neighbor)
    {
        const wallRowOffset = (neighbor.row - cell.row) / 2;
        const wallColOffset = (neighbor.column - cell.column) / 2;
        
        return this.nodesMatrix[cell.row + wallRowOffset][cell.column + wallColOffset].isWall;
    }

    removeWallBetweenMazeCells(cell, neighbor)
    {
        const wallRowOffset = (neighbor.row - cell.row) / 2;
        const wallColOffset = (neighbor.column - cell.column) / 2;
        const id = `node-${cell.row + wallRowOffset}-${cell.column + wallColOffset}`;

        this.changeWallStatusOfNodeTo(id, false);
        document.getElementById(id).className = NodeType.unvisited;
    }

    getNodeBetween(node, neighbor)
    {
        const rowOffset = (neighbor.row - node.row) / 2;
        const colOffset = (neighbor.column - node.column) / 2;

        return this.nodesMatrix[node.row + rowOffset][node.column + colOffset];
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

    getNeighborsOfNode(node)
    {
        const row = node.row;
        const col = node.column;
        const neighborsOffset = [[0, -1], [1, 0], [0, 1], [-1, 0], 
                                [-1, -1], [-1, 1], [1, 1], [1, -1]]
        const neighbors = [];

        for (const offset of neighborsOffset)
        {
            const rowOffset = offset[0];
            const colOffset = offset[1];

            /* Don't add diagonal neighbor if only movement in four directions is allowed */
            if (rowOffset !== 0 && colOffset !== 0 && 
                this.eightDirectionalMovement === false)
                continue;

            /* Skip nodes that aren't on the grid or are walls */
            if (this.isAccessibleAt(row + rowOffset, col + colOffset) === false)
                continue;

            const neighbor = this.nodesMatrix[row + rowOffset][col + colOffset]

            if (this.cuttingCornerBetween(node, neighbor) === true &&
                this.allowCornerCutting === false)
                continue;

            neighbors.push(neighbor)
        }

        return neighbors;
    }

    cuttingCornerBetween(node, neighbor)
    {
        if (this.isAccessibleAt(neighbor.row, node.column) === false &&
            this.isAccessibleAt(node.row, neighbor.column) === false)
            return true;

        return false;
    }

    getDistanceBetween(firstNode, secondNode)
    {
        /* Octile distance: Move diagonally for the smaller offset, because the cost
            is only sqrt(2) = 1.414 instead of 2 and then of the rest of the way to
            the second node in a straight line */
        if (this.eightDirectionalMovement === true)
        {
            const rowChange = Math.abs(firstNode.row - secondNode.row);
            const colChange = Math.abs(firstNode.column - secondNode.column);

            if (rowChange > colChange)
                return ((rowChange - colChange) + (Math.SQRT2 * colChange));

            else 
                return ((colChange - rowChange) + (Math.SQRT2 * rowChange));
        }

        /* Manhattan distance: Distance between two nodes is calculated by
            connecting them with an L-shape path */
        return (Math.abs(firstNode.row - secondNode.row) + 
            Math.abs(firstNode.column - secondNode.column));
    }

    changeWallStatusOfNodeTo(id, newWallStatus) 
    {
        const [descriptor, row, col] = id.split('-');
        
        this.nodesMatrix[row][col].isWall = newWallStatus;
    }

    removeWalls() 
    {
        for (let row = 0; row < this.rows; row++) 
        {
            for (let col = 0; col < this.columns; col++) 
            {
                if (this.isAccessibleAt(row, col) === false) 
                {
                    this.nodesMatrix[row][col].isWall = false;
                    document.getElementById(`node-${row}-${col}`)
                        .className = NodeType.unvisited;
                } 
            }
        }
    }

    changeWeightOfNodeTo(id, newWeight)
    {
        const [descriptor, row, col] = id.split('-');

        this.nodesMatrix[row][col].weight = newWeight;
    }

    removeWeights() 
    {
        for (let row = 0; row < this.rows; row++) 
        {
            for (let col = 0; col < this.columns; col++) 
            {
                if (this.nodesMatrix[row][col].weight !== NODE_WEIGHT_NONE) 
                {
                    this.changeWeightOfNodeTo(`node-${row}-${col}`, NODE_WEIGHT_NONE);
                    document.getElementById(`node-${row}-${col}`).className = NodeType.unvisited;
                }
            }
        }
    }

    removePreviousAlgorithm() 
    {
        for (let row = 0; row < this.rows; row++) 
        {
            for (let col = 0; col < this.columns; col++) 
            {
                const node = document.getElementById(`node-${row}-${col}`);

                switch(this.nodesMatrix[row][col].weight)
                {
                    case nodeWeightLight:
                        node.className = NodeType.lightWeight;
                        break;

                    case nodeWeightNormal:
                        node.className = NodeType.normalWeight;
                        break;

                    case nodeWeightHeavy:
                        node.className = NodeType.heavyWeight;
                        break;

                    case NODE_WEIGHT_NONE:
                        /* Leave start, finish and walls as they are */
                        if (node.className === NodeType.visited || 
                            node.className === NodeType.shortestPath ||
                            node.className === NodeType.visitedByPreviousAlgorithm)
                                node.className = NodeType.unvisited;
                        break;
                }

                this.resetNode(row, col);
            }
        }
        
        document.getElementById(`node-${this.startRow}-${this.startCol}`)
            .className = NodeType.start;

        for (let i = 0; i < this.finishPositions.length; i++)
        {
            if (this.finishPositions[i] === null)
                continue;
             
            const [row, col] = this.finishPositions[i];
            document.getElementById(`node-${row}-${col}`).className = NodeType.finish;
        }
    }

    resetAllNodesInternally()
    {
        for (let row = 0; row < this.rows; row++)
        {
            for (let col = 0; col < this.columns; col++)
                this.resetNode(row, col);
        }
    }

    makePreviousAlgorithmLessVisible()
    {
        for (let row = 0; row < this.rows; row++)
        {
            for (let col = 0; col < this.columns; col++)
            {
                const node = document.getElementById(`node-${row}-${col}`);

                if (node.className === NodeType.visited)
                    node.className = NodeType.visitedByPreviousAlgorithm;

                this.resetNode(row, col);
            }
        }
    }

    resetNode(row, col)
    {
        /* Reset each element in the nodesMatrix so that the next algorithm
        can start from scratch */
        this.nodesMatrix[row][col].isVisited = false;
        this.nodesMatrix[row][col].distanceFromStart = Infinity;
        this.nodesMatrix[row][col].distanceFromFinish = Infinity;
        this.nodesMatrix[row][col].heuristicDistance = Infinity;
        this.nodesMatrix[row][col].totalDistance = Infinity;
        this.nodesMatrix[row][col].prevNode = null;
        this.nodesMatrix[row][col].prevNodeFromFinish = null;
        this.nodesMatrix[row][col].direction = null;
        this.nodesMatrix[row][col].isJumpPoint = false;
    }

    /* Place start and finish at their original positions from when the grid was first
        created */
    resetStartAndFinish() 
    {
        let finishRow, finishCol;
        
        if (this.startIsPlaced === true)
            document.getElementById(`node-${this.startRow}-${this.startCol}`)
                .className = NodeType.unvisited;
        
        this.removeAllFinishNodes();
        
        /* Place them next to each other for the desktop version */
        if (this.columns >= this.rows) 
        {
            this.startRow = Math.floor(this.rows / 2);
            this.startCol = Math.floor(this.columns / 4);
            finishRow = Math.floor(this.rows / 2);
            finishCol = Math.floor((this.columns / 4) * 3);
        }

        /* Place them under each other for the mobile version */
        else 
        {
            this.startRow = Math.floor(this.rows / 4);
            this.startCol = Math.floor(this.columns / 2);
            finishRow = Math.floor((this / 4) * 3);
            finishCol = Math.floor(this / 2);
        }

        const finishNode = `node-${finishRow}-${finishCol}`;
        
        document.getElementById(`node-${this.startRow}-${this.startCol}`)
            .className = NodeType.start;
        document.getElementById(finishNode).className = NodeType.finish;

        document.getElementById(finishNode).appendChild(this.addFinishPriority(finishNode));

        this.startIsPlaced = true;
        this.finishIsPlaced = true;
    }

    addFinishPriority(id)
    {
        const newFinishPriority = document.createElement('p');
        /* Fill empty indices before adding new ones */
        let emptyPriority = this.finishPositions.indexOf(null);

        /* No empty index was found */
        if (emptyPriority === -1)
        {
            /* All priorites between 1 and 99 are taken */
            if (this.numberOfFinishNodesPlaced() === 99)
                return null;
            /* New priority will have the highest value */
            else
                emptyPriority = this.finishPositions.length;
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
        this.finishPositions[emptyPriority] = [row, col];

        return newFinishPriority;
    }

    clearFinishPriority(id)
    {
        const node = document.getElementById(id);

        node.removeChild(node.firstElementChild);
        node.className = NodeType.unvisited;

        const [descriptor, row, col] = id.split('-');
        let index = 0;
        
        for (let i = 0; i < this.finishPositions.length; i++)
        {
            if (this.finishPositions[i] === null)
                continue;

            const [currRow, currCol] = this.finishPositions[i];

            if (currRow === row && currCol === col)
            {
                index = i;
                break;
            }
        }
        
        this.finishPositions[index] = null;
    }

    numberOfFinishNodesPlaced()
    {
        let numOfFinishNodes = 0;

        for (let i = 0; i < this.finishPositions.length; i++)
        {
            if (this.finishPositions[i] !== null)
                numOfFinishNodes++;
        }

        return numOfFinishNodes;
    }

    removeAllFinishNodes()
    {
        for (let i = 0; i < this.finishPositions.length; i++)
        {
            if (this.finishPositions[i] !== null)
            {   
                const [row, col] = this.finishPositions[i];
                this.clearFinishPriority(`node-${row}-${col}`);
            }
        }

        this.finishPositions.length = 0;
    }
}