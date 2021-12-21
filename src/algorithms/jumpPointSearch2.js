'use strict';

export {jumpPointSearch2};

function jumpPointSearch2(grid, startNode, finishNode) {
    const closedList = [];
    const openList = [];
    let jumpNodes = [];
    startNode.distanceFromStart = 0;
    openList.push(startNode);
    jumpNodes.push(startNode);
    //console.log(jumpNodes.length);

    /*while (openList.length > 0) {
        sortNodesByDistance(openList);
        const closestNode = openList.shift();*/
    //while (jumpNodes.length > 0) {
    for (let i = 0; i < 5; i++) {
        sortNodesByDistance(jumpNodes);
        //console.log(jumpNodes.length);
        const closestNode = jumpNodes.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.distanceFromStart === Infinity) {
            return [openList, null];
        }

        if (closestNode === finishNode) {
            let currentNode = finishNode;
            const shortestPath = [];

            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevnode;
            }

            return [openList, shortestPath];
        }

        jumpNodes = jumpNodes.concat(updateNeighbors(grid, closestNode, startNode, finishNode, openList, closedList, jumpNodes));
        console.log(jumpNodes);
    }

    /* Just for testing purposes */
    return [openList, null];
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) => 
        firstNode.distanceFromStart - secondNode.distanceFromStart);
}

/* If we are at the start node then dont prune any neighbors and get new jump nodes
    by going in each of the eight directions and only adding jump nodes if there are
    interesting nodes
    If the array of jump nodes isnt empty then pick the best one and follow its direction
    and if you find more jump nodes then add them to the array too
    Repeat this until you found the finish node
    Backtrack by returning the array of inverting the directions of the nodes until you reach
    the start node
    Done */
function updateNeighbors(grid, node, startNode, finishNode, openList, closedList) {
    //console.log(node.distanceFromStart);
    let startingPoints = [];
    let newJumpNodes = [];

    /* If we are at the start node then we don't prune any neighbors and explore all of
        them to find new jump nodes */
    if (node === startNode) {
        startingPoints = startingPoints.concat(getNeighbors(grid, node));
    }

    /* If we are at a jump node then we only explore in the direction of that node */
    else {
        startingPoints.push(node);
    }

    /* Endlosschleife!!! */
    for (let i = 0; i < startingPoints.length; i++) {
        if (startingPoints[i].isWall === true) {
            continue;
        }

        console.log(startingPoints[i]);
        //let successors = [];

        //neighbor.prevNode = node;
        let rowChange, colChange;

        if (node === startNode) {
            startingPoints[i].isVisited = true;
            startingPoints[i].distanceFromStart = getDistance(startNode, startingPoints[i]);
            //jumpNodes.push(neighbors[i]);
            [rowChange, colChange] = getDirection(node, startingPoints[i]);
        }

        else {
            [rowChange, colChange] = startingPoints[i].direction;
        }
        //console.log(`${rowChange}, ${colChange}`);

        if (rowChange === 0 && colChange !== 0) {
            //let newJumpNodes = [];

            //while (neighbors[i].column > 1 && neighbors[i].column < (grid.columns - 2)) {
                //console.log(newJumpNodes.length);
                newJumpNodes = newJumpNodes.concat(horizontalSearch(grid, startingPoints[i], finishNode, colChange, openList));
                
                /*if (newJumpNodes === null) {
                    break;
                }*/
                //console.log(newJumpNodes);
                //jumpNodes = jumpNodes.concat(newJumpNodes);
                //successors = successors.concat(newJumpNodes);
                //console.log(`openList: ${openList.length}`);
                //neighbors[i].column += colChange;
                //closedList.push(neighbor);
            //}

            //openList = openList.concat(newJumpNodes);
        }

        else if (rowChange !== 0 && colChange === 0) {
            //let newJumpNodes = [];

            //while(neighbors[i].row > 1 && neighbors[i].row < (grid.rows - 2)) {
                newJumpNodes = newJumpNodes.concat(verticalSearch(grid, startingPoints[i], finishNode, rowChange, openList));
                
                /*if (newJumpNodes === null) {
                    break;
                }*/
                
                //jumpNodes = jumpNodes.concat(newJumpNodes);
                //successors = successors.concat(newJumpNodes);
                //neighbors[i].row += rowChange;
            //}
        }

        else if (rowChange !== 0 && colChange !== 0) {
            //let newJumpNodes = [];

            /*while(neighbors[i].row > 1 && neighbors[i].row < (grid.rows - 2) && neighbors[i].column > 1 &&
                    neighbors[i].column < (grid.columns - 2)) {*/
                newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, startingPoints[i], finishNode, rowChange, colChange, openList));
                
                /*if (newJumpNodes === null) {
                    break;
                }*/

                //jumpNodes = jumpNodes.concat(newJumpNodes);
                //successors = successors.concat(newJumpNodes);
                /*neighbors[i].row += rowChange;
                neighbors[i].column += colChange;
            }*/
        }

        /*for (const successor in successors) {
            successor.prevNode = neighbor;
        }
        
        console.log(successors);*/
    }
    //console.log(newJumpNodes);
    //console.log(openList);
    return newJumpNodes;
}

function getNeighbors(grid, node) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, right = false, left = false;

    if (row > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col]);
        up = true;
    }

    if (row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
        down = true;
    }

    if (col > 0) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
        left = true;
    }

    if (col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
        right = true;
    }

    if (up === true && right === true) {
        neighbors.push(grid.nodesMatrix[row - 1][col + 1]);
    }

    if (up === true && left === true) {
        neighbors.push(grid.nodesMatrix[row - 1][col - 1]);
    }

    if (down === true && right === true) {
        neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
    }

    if (down === true && left === true) {
        neighbors.push(grid.nodesMatrix[row + 1][col - 1]);
    }

    return neighbors;
}

function getDirection(prevNode, node) {
    return [node.row - prevNode.row, node.column - prevNode.column];
}

function horizontalSearch(grid, parentNode, finishNode, colChange, openList) {
    let newJumpNodes = [];

    if (openList.includes(parentNode) === false) {
        openList.push(parentNode);
    }

    /* If we are at the left or right edge of the grid */
    if ((parentNode.column + colChange) < 1 || 
        (parentNode.column + colChange) > (grid.columns - 2)) {
        return newJumpNodes;
    }

    const childNode = grid.nodesMatrix[parentNode.row][parentNode.column + colChange];
    
    if (childNode.isWall === true) {
        return newJumpNodes;
    }

    if (openList.includes(childNode) === false) {
        openList.push(childNode);
    }

    childNode.isVisited = true;
    childNode.prevNode = parentNode;
    childNode.distanceFromStart = parentNode.distanceFromStart + getDistance(parentNode, childNode);

    if (childNode === finishNode) {
        newJumpNodes.push(childNode);

        return newJumpNodes;
    }

    const childRow = childNode.row;
    const childCol = childNode.column;

    /* Check if the first node that we visited was the left or right edge of the grid */
    if ((childCol + colChange) < 0 || (childCol + colChange) > (grid.columns - 1)) {
        return newJumpNodes;
    }

    /* The second node from the parent node if we move in the same direction as we did
        before */
    const nextNode = grid.nodesMatrix[childRow][childCol + colChange];

    if (nextNode.isWall === true) {
        return newJumpNodes;
    }

    nextNode.isVisited = true;

    if (openList.includes(nextNode) === false) {
        openList.push(nextNode);
    }
    //let n = childNode;
    //console.log(`${parentNode.id}, ${childNode.id}, ${nextNode.id}`);
    /* If the node directly below our first visited node is a wall but the node either right
        or left of the wall is empty then we need to add our child node to the open list as there
        is no other way to reach the node behind the wall but through this current node */
    if (grid.nodesMatrix[childRow + 1][childCol].isWall === true &&
        grid.nodesMatrix[childRow + 1][nextNode.column].isWall === false) {
            /* Turn the node into a jump point by saving the direction that we have to move in
                to get to otherwise inaccessible nodes. Move diagonally from this node to reach
                the inaccessible node */
            //n.direction = [1, colChange];
            let node = JSON.parse(JSON.stringify(childNode));

            node.direction = [1, colChange];
            newJumpNodes.push(node);
            //console.log(newJumpNodes[0]);
    }

    if (grid.nodesMatrix[childRow - 1][childCol].isWall === true &&
        grid.nodesMatrix[childRow - 1][nextNode.column].isWall === false) {
            //n.direction = [-1, colChange];
            let node = JSON.parse(JSON.stringify(childNode));

            node.direction = [-1, colChange];
            newJumpNodes.push(node);
            //console.log(newJumpNodes[1]);
    }

    if (newJumpNodes.length > 0) {
        /* Only save the move straight forward if there are intersting nodes diagonally */
        //n.direction = [0, colChange];
        /* Create an empty object */
        let node = JSON.parse(JSON.stringify(childNode));

        /* Change the direction to be appropriate for the current case */
        node.direction = [0, colChange];
        /* Push the newly created object, because if we were to just push the child object then
            we would just add a reference to that object and all further objects would also alter
            this one (e.g. if we change the direction for this child node then all child nodes would
            have the same direction nullifying the usefulness of jump points) */
        newJumpNodes.push(node);

        //console.log(newJumpNodes[2]);
    }
    //console.log(newJumpNodes);
    
    //return horizontalSearch(grid, childNode, finishNode, colChange);
    //return newJumpNodes;
    //console.log(newJumpNodes);
    return newJumpNodes = newJumpNodes.concat(horizontalSearch(grid, childNode, finishNode, colChange, openList));
}

function verticalSearch(grid, parentNode, finishNode, rowChange, openList) {
    let newJumpNodes = [];

    if ((parentNode.row + rowChange) < 1 || (parentNode.row + rowChange) > (grid.rows - 2)) {
        return newJumpNodes;
    }

    if (openList.includes(parentNode) === false) {
        openList.push(parentNode);
    }
    
    const childNode = grid.nodesMatrix[parentNode.row + rowChange][parentNode.column];

    if (childNode.isWall === true) {
        return newJumpNodes;
    }

    if (openList.includes(childNode) === false) {
        openList.push(parentNode);
    }

    childNode.isVisited = true;
    childNode.prevNode = parentNode;
    childNode.distanceFromStart = parentNode.distanceFromStart + getDistance(parentNode, childNode);

    if (childNode === finishNode) {
        newJumpNodes.push(childNode);

        return newJumpNodes;
    }

    const childRow = childNode.row;
    const childCol = childNode.column;

    if ((childRow + rowChange) < 0 || (childRow + rowChange) > (grid.rows - 1)) {
        return newJumpNodes;
    }

    const nextNode = grid.nodesMatrix[childRow + rowChange][childCol];

    if (nextNode.isWall === true) {
        return newJumpNodes;
    }

    nextNode.isVisited = true;

    if (openList.includes(nextNode) === false) {
        openList.push(nextNode);
    }

    if (grid.nodesMatrix[childRow][childCol + 1].isWall === true &&
        grid.nodesMatrix[nextNode.row][childCol + 1].isWall === false) {
        //childNode.direction = [rowChange, 1];
        let node = JSON.parse(JSON.stringify(childNode));
        
        node.direction = [rowChange, 1];
        newJumpNodes.push(node);
    }

    if (grid.nodesMatrix[childRow][childCol - 1].isWall === true &&
        grid.nodesMatrix[nextNode.row][childCol - 1].isWall === false) {
        //childNode.direction = [rowChange, -1];
        let node = JSON.parse(JSON.stringify(childNode));

        node.direction = [rowChange, -1];
        newJumpNodes.push(node);
    }

    if (newJumpNodes.length > 0) {
        //childNode.direction = [rowChange, 0];
        let node = JSON.parse(JSON.stringify(childNode));

        node.direction = [rowChange, 0];
        newJumpNodes.push(node);
    }

    //return verticalSearch(grid, childNode, finishNode, rowChange);
    //return newJumpNodes;
    return newJumpNodes = newJumpNodes.concat(verticalSearch(grid, childNode, finishNode, rowChange, openList));
}

function diagonalSearch(grid, parentNode, finishNode, rowChange, colChange, openList) {
    let newJumpNodes = [];
    const parentRow = parentNode.row;
    const parentCol = parentNode.column;

    if (openList.includes(parentNode) === false) {
        openList.push(parentNode);
    }

    if ((parentRow + rowChange) < 1 || (parentRow + rowChange) > (grid.rows - 2) ||
        (parentCol + colChange) < 1 || (parentCol + colChange) > (grid.columns - 2)) {
        return newJumpNodes;
    }

    const childNode = grid.nodesMatrix[parentRow + rowChange][parentCol + colChange];

    if (childNode.isWall === true) {
        return newJumpNodes;
    }

    if (openList.includes(childNode) === false) {
        openList.push(childNode);
    }

    childNode.isVisited = true;
    childNode.prevNode = parentNode;
    childNode.distanceFromStart = parentNode.distanceFromStart + getDistance(parentNode, childNode);

    if (childNode === finishNode) {
        newJumpNodes.push(childNode);
        
        return newJumpNodes;
    }

    const childRow = childNode.row;
    const childCol = childNode.column;

    if ((childRow + rowChange) < 0 || (childRow + rowChange) > (grid.rows - 1) ||
        (childCol + colChange) < 0 || (childCol + colChange) > (grid.columns - 1)) {
        return newJumpNodes;
    }

    const nextNode = grid.nodesMatrix[childRow + rowChange][childCol + colChange];

    if (nextNode.isWall === true) {
        return newJumpNodes;
    }

    nextNode.isVisited = true;

    if (openList.includes(nextNode) === false) {
        openList.push(nextNode);
    }

    /* If there's a wall right directly left or right of our currently visited node, then
        check if the node above or below it is a wall. If it isn't then create a new jump
        point that jumps in the opposite horizontal direction as the currently visited node
        so that we have a zigzag jump from the parent node to this new node */
    if (grid.nodesMatrix[parentRow][childCol].isWall === true &&
        grid.nodesMatrix[parentRow][nextNode.column].isWall === false) {
        //childNode.direction = [rowChange, -colChange];
        let node = JSON.parse(JSON.stringify(childNode));

        node.direction = [rowChange, -colChange];
        newJumpNodes.push(node);
    }

    if (grid.nodesMatrix[childRow][parentCol].isWall === true &&
        grid.nodesMatrix[nextNode.row][parentCol].isWall === false) {
        //childNode.direction = [-rowChange, colChange];
        let node = JSON.parse(JSON.stringify(childNode));

        node.direction = [-rowChange, colChange];
        newJumpNodes.push(node);
    }

    let horDone = false;
    let vertDone = false;
    //console.log(`before horizontalSearch: ${JSON.stringify(newJumpNodes)}`);
    if (newJumpNodes.length === 0) {
        /* Create a deep copy of childNode that's disconnected from it so that any changes
            to the copy have no effect on childNode */
        let node = JSON.parse(JSON.stringify(childNode));

        while (node.column + colChange > 1 && node.column + colChange < (grid.columns - 2)) {
            const horizontalJumpNodes = horizontalSearch(grid, childNode, finishNode, colChange, openList);
            horDone = true;
            
            if (horizontalJumpNodes !== null && horizontalJumpNodes.length > 0) {
                const jumpNode = getNodeFromArray(horizontalJumpNodes, node, [0, colChange]);
        
                for (let i = 0; i < horizontalJumpNodes.length; i++) {
                    horizontalJumpNodes[i].prevNode = jumpNode;
                }
        
                newJumpNodes.push(jumpNode);
            }
            node.column += colChange;
        }
    }
    //console.log(`before verticalSearch: ${JSON.stringify(newJumpNodes)}`);
    if (newJumpNodes.length === 0) {
        const verticalJumpNodes = verticalSearch(grid, childNode, finishNode, rowChange, openList);
        vertDone = true;

        if (verticalJumpNodes !== null) {
            const jumpNode = getNodeFromArray(verticalJumpNodes, childNode, [rowChange, 0]);
    
            for (const vertNode in verticalJumpNodes) {
                vertNode.prevNode = jumpNode;
            }
    
            newJumpNodes.push(jumpNode);
        }
    }
    //console.log(`after verticalSearch: ${JSON.stringify(newJumpNodes)}`);
    if (newJumpNodes.length > 0) {
        if (horDone === false) {
            //childNode.direction = [0, colChange];
            let node = JSON.parse(JSON.stringify(childNode));

            node.direction = [0, colChange];
            newJumpNodes.push(node);
        }

        if (vertDone === false) {
            //childNode.direction = [rowChange, 0];
            let node = JSON.parse(JSON.stringify(childNode));

            node.direction = [rowChange, 0];
            newJumpNodes.push(node);
        }

        //childNode.direction = [rowChange, colChange];
        let node = JSON.parse(JSON.stringify(childNode));

        node.direction = [rowChange, colChange];
        newJumpNodes.push(node);
    }

    //return diagonalSearch(grid, childNode, finishNode, rowChange, colChange);
    //return newJumpNodes;
    return newJumpNodes = newJumpNodes.concat(diagonalSearch(grid, childNode, finishNode, rowChange, colChange, openList));
}

function getDistance(parentNode, childNode) {
    return Math.sqrt(Math.pow((parentNode.row - childNode.row), 2) +
            Math.pow((parentNode.column - childNode.column), 2));
}

function getNodeFromArray(array, node, direction) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === node && direction === node.direction) {
            return array[i];
        }
    }
}