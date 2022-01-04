'use strict';

/* https://web.archive.org/web/20140310022652/https://zerowidth.com/2013/05/05/jump-point-search-explained.html 
    http://users.cecs.anu.edu.au/~dharabor/data/papers/harabor-grastien-aaai11.pdf 
    https://www.gamedev.net/tutorials/programming/artificial-intelligence/jump-point-search-fast-a-pathfinding-for-uniform-cost-grids-r4220/ */

/* No weights */
    function jumpPointSearch(grid, startNode, finishNode) {
    const closedList = [];
    startNode.distanceFromStart = 0;
    const openList = [];
    openList.push(startNode);

    while (openList.length > 0) {
        sortNodesByDistance(openList);
        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true) {
            continue;
        }

        if (closestNode.distanceFromStart === Infinity) {
            return [closedList, null];
        }

        if (closestNode === finishNode) {
            let currentNode = finishNode;
            const shortestPath = [];

            while (currentNode !== null) {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        //updateNeighbors(grid, closestNode, finishNode, openList, closedList);
        //calculateJump(grid, closestNode, finishNode, openList, closedList);
        identifySuccessors(grid, closestNode, startNode);
    }
}

function sortNodesByDistance(openList) {
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

/* Return an array with the successors instead */
function identifySuccessors(grid, node, startNode) {
    const neighbors = [];

    if (node === startNode) {
        neighbors = getNeighbors(grid, node);
    }

    if (node.prevNode !== null) {
        const [rowChange, colChange] = getDirection(node, node.prevNode);

        /* Vertical movement */
        if (rowChange !== 0 && colChange === 0) {
            neighbors = verticalJump(grid, node);
        }

        /* Horizontal movement */
        if (rowChange === 0 && colChange !== 0) {
            neighbors = horizontalJump(grid, node);
        }

        /* Diagonal movement (i.e. up and left, up and right, down and left, down and right) */
        else if (rowChange !== 0 && colChange !== 0) {
            let tempArr = null;
            tempArr = horizontalJump(grid, node);

            if (tempArr !== null) {
                neighbors = neighbors.concat(tempArr);
            }

            tempArr = null;
            tempArr = verticalJump(grid, node);

            if (tempArr !== null) {
                neighbors = neighbors.concat(tempArr);
            }

            /* Node two diagonal moves from the initial node */
            const secondSuccessor = grid.nodesMatrix[node.row + (2 * rowChange)][node.column + (2 * colChange)];
           
            if (secondSuccessor.isWall === false) {
                neighbors.push(secondSuccessor);
            }
        }
    }
}

function identifySuccessors2(grid, node, startNode, finishNode) {
    const successors = [];
    const neighbors = getNeighbors(grid, node);
    neighbors = pruneNeighbors(grid, node, neighbors);

    for (const neighbor of neighbors) {
        const newSuccessor = jump(grid, node, neighbor, startNode, finishNode);
        successors.push(newSuccessor);
    }

    return successors;
}

function pruneNeighbors(grid, node, neighbors) {
    const prunedNeighbors = [];

    for (const neighbor of neighbors) {
        if (neighbor.isWall === true) {
            continue;
        }

        const [rowChange, colChange] = getDirection(neighbor, node);

        /* We move either straight up or down */
        if (rowChange !== 0 && colChange === 0) {
            const handledNeighbors = handleVerticalNeighbors(grid, neighbor);
            prunedNeighbors = prunedNeighbors.concat(handledNeighbors);
        }

        /* We move either straight left or right */
        else if (rowChange === 0 && colChange !== 0) {
            const handledNeighbors = handleHorizontalNeighbors(grid, neighbor);
            prunedNeighbors = prunedNeighbors.concat(handledNeighbors);
        }

        /* We move diagonally */
        else if (rowChange !== 0 && colChange !== 0) {
            /* This variable prevents the node that's one step further in the current direction
                to be added twice, because if there's a wall to the left or right of our current
                node then we will add the node either above or below it, which can be the diagonal
                node */
            let diagonalNodeAdded = false;

            /* If there's a wall directly right of the currently inspected neighbor */
            if (grid.nodesMatrix[neighbor.row][neighbor.column + 1].isWall === true) {
                /* Add node that's directly above or below the wall depending on wether we move
                    diagonally up or down */
                diagonalNodeAdded = true;
                prunedNeighbors.push(grid.nodesMatrix[neighbor.row + rowChange][neighbor.column + 1]);
            }

            /* If there's a wall directly left of the currently inspected neighbor */
            if (grid.nodesMatrix[neighbor.row][neighbor.column - 1].isWall === true) {
                diagonalNodeAdded = true;
                prunedNeighbors.push(grid.nodesMatrix[neighbor.row + rowChange][neighbor.column - 1]);
            }
            
            /* Only add the node directly right of our current visited node if we are moving to the
                right and if it isn't a wall */
            if (grid.nodesMatrix[neighbor.row][neighbor.column + colChange].isWall === false) {
                prunedNeighbors.push(grid.nodesMatrix[neighbor.row][neighbor.column + colChange]);
            }

            /* Only add the node directly above our current visited node if we are moving up
                and if isn't a wall */
            if (grid.nodesMatrix[neighbor.row + rowChange][neighbor.column].isWall === false) {
                prunedNeighbors.push(grid.nodesMatix[neighbor.row + rowChange][neighbor.column]);
            }

            /* Add the node that's the next node if we take another step in the same direction that we
                already did to get from the initial node to the neighbor, but only if it hasn't been added
                before because there were no walls directly left or right of our current node */
            if (diagonalNodeAdded === false) {
                if (grid.nodesMatrix[neighbor.row + rowChange][neighbor.column + colChange].isWall === false) {
                    prunedNeighbors.push(grid.nodesMatrix[neighbor.row + rowChange][neighbor.column + colChange]);
                }
            }
        }
    }

    return prunedNeighbors;
}

function handleVerticalNeighbors(grid, neighbor) {
    const handledNeighbors = [];

    /* If there's a wall directly right to our currently inspected neighbor */
    if (grid.nodesMatrix[neighbor.row][neighbor.column + 1].isWall === true) {
        /* Add the element that's directly above (if we are moving up) or below
            (if we are moving down) the wall */
        handledNeighbors.push(grid.nodesMatrix[neighbor.row + rowChange][neighbor.column + 1]);
    }

    /* If there's a wall directly left to our currently inspected neighbor */
    if (grid.nodesMatrix[neighbor.row][neighbor.column - 1].isWall === true) {
        handledNeighbors.push(grid.nodesMatrix[neighbor.row + rowChange][neighbor.column - 1]);
    }

    /* Add the neighbor itself to the pruned neighbors for further inspection */
    handledNeighbors.push(grid.nodesMatrix[neighbor.row][neighbor.column]);

    return handledNeighbors;
}

function handleHorizontalNeighbors(grid, neighbor) {
    const handledNeighbors = [];

    /* If there's a wall directly above our currently inspected neighbor */
    if (grid.nodesMatrix[neighbor.row - 1][neighbor.column].isWall === true) {
        handledNeighbors.push(grid.nodesMatrix[neighbor.row - 1][neighbor.column + colChange]);
    }

    /* If there's a wall directly below our currently inspected neighbor */
    if (grid.nodesMatrix[neighbor.row + 1][neighbor.column].isWall === true) {
        handledNeighbors.push(grid.nodesMatrix[neighbor.row + 1][neighbor.column + colChange]);
    }

    handledNeighbors.push(grid.nodesMatrix[neighbor.row][neighbor.column]);

    return handledNeighbors;
}

function getDistance(node, neighbor) {
    return Math.sqrt(Math.pow((node.row - neighbor.row), 2) + Math.pow((node.column - neighbor.column), 2));
}

function getDirection(node, prevNode) {
    return [node.row - prevNode.row, node.column - prevNode.column];
}

function verticalJump(grid, node) {
    const successors = [];
    const successorNode = grid.nodesMatrix[node.row + rowChange][node.column];
    const sucRow = successorNode.row;
    const sucCol = successorNode.column;

    if (successorNode.isWall === true) {
        return null;
    }

    /* If the node directly right of the successor is a wall then we need to also consider
        the node a row higher, because through our current node is the fastest way to reach
        that node starting from our parent */
    if (grid.nodesMatrix[sucRow][sucCol + 1].isWall === true) {
        successors.push(grid.nodesMatrix[sucRow + rowChange][sucCol + 1]);
    }

    /* Node directly left of the successor */
    if (grid.nodesMatrix[sucRow][sucCol - 1].isWall === true) {
        successors.push(grid.nodesMatrix[sucRow + rowChange][sucCol - 1]);
    }

    return successors;
}

function horizontalJump(grid, node) {
    const successors = [];
    const successorNode = grid.nodesMatrix[node.row][node.column + colChange];
    const sucRow = successorNode.row;
    const sucCol = successorNode.column;

    if (successorNode.isWall === true) {
        return null;
    }

    /* Node directly above the successor */
    if (grid.nodesMatrix[sucRow + 1][sucCol].isWall === true) {
        successors.push(grid.nodesMatrix[sucRow + 1][sucCol + colChange]);
    }
    
    /* If the node directly below the successor is a wall then the node diagonal down
        is a successor (either down and left in the case of movement to the left (colChange
        is negative) or down and right in the case of movement to the right (colChange is positive)) */
    if (grid.nodesMatrix[sucRow - 1][sucCol].isWall === true) {
        successors.push(grid.nodesMatrix[sucRow - 1][sucCol + colChange]);
    }

    return successors;
}

function horizontalSearch(grid, node, finishNode, direction) {
    let currentNode = grid.nodesMatrix[node.row][node.column];
    let currentRow = currentNode.row;
    let currentCol = currentNode.column;

    while (currentCol > 0 && currentCol < grid.columns) {
        currentCol += direction;
        currentNode = grid.nodesMatrix[currentRow][currentCol];
        currentNode.distance += currentNode.weight;
        currentNode.heuristicDistance = getHeuristicDistance(currentNode, finishNode);
        currentNode.totalDistance = currentNode.distance +
            currentNode.heuristicDistance;
        currentNode.prevNode = node;

        if (direction === 1) {
            currentNode.direction = 'right';
        }

        else if (direction === -1){
            currentNode.direction = 'left';
        }

        grid.nodesMatrix[currentRow][currentCol] = currentNode;

        if (currentNode === finishNode) {
            return finishNode;
        }

        let predecessorNode = grid.nodesMatrix[currentRow][currentCol + direction];
        let predecessorRow = predecessorNode.row;
        let predecessorCol = predecessorNode.column;
        let nodesToCheck = [];

        if (predecessorCol < 0 || predecessorCol > grid.columns) {
            return null;
        }

        /* Above the current node is a wall */
        if (grid.nodesMatrix[currentRow - 1][currentCol].isWall === true &&
            grid.nodesMatrix[predecessorRow - 1][predecessorCol].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        /* Below the current node is a wall */
        if (grid.nodesMatrix[currentRow + 1][currentCol].isWall === true &&
            grid.nodesMatrix[predecessorRow + 1][predecessorCol].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        if (nodesToCheck.length > 0) {
            return nodesToCheck;
        }

        else {
            return null;
        }
    }
}

function verticalSearch(grid, node, finishNode, direction) {
    let currentNode = node;
    let currentRow = currentNode.row;
    let currentCol = currentNode.column;

    while (currentRow > 0 && currentRow < grid.rows) {
        currentRow += direction;
        currentNode = grid.nodesMatrix[currentRow][currentCol];
        currentNode.distance += currentNode.weight;
        currentNode.heuristicDistance = getHeuristicDistance(currentNode, finishNode);
        currentNode.totalDistance = currentNode.distance + 
            currentNode.heuristicDistance;
        currentNode.prevNode = node;
        
        if (direction === 1) {
            currentNode.direction = 'down';
        }

        else if (direction === -1) {
            currentNode.direction = 'up';
        }

        grid.nodesMatrix[currentRow][currentCol] = currentNode;

        if (currentNode === finishNode) {
            return finishNode;
        }

        let predecessorNode = grid.nodesMatrix[currentRow + direction][currentCol];
        let predecessorRow = predecessorNode.row;
        let predecessorCol = predecessorNode.column;
        let nodesToCheck = [];

        if (grid.nodesMatrix[currentRow][currentCol - 1].isWall === true &&
            grid.nodesMatrix[predecessorRow][predecessorCol - 1].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        if (grid.nodesMatrix[currentRow][currentCol + 1].isWall === true &&
            grid.nodesMatrix[predecessorRow][predecessorCol + 1].isWall === false) {
                nodesToCheck.push(currentNode);
        }

        if (nodesToCheck.length > 0) {
            return nodesToCheck;
        }

        else {
            return null;
        }
    }
}

/* Euclidean distance because we can move in eight directions */
function getHeuristicDistance(node, finishNode) {
    return Math.sqrt(Math.pow((node.row - finishNode.row), 2) +
                    (Math.pow((node.column - finishNode.column), 2)));
}

function calculateJump(grid, node, finishNode, openList, closedList) {
    const neighbors = [];
    let direction = null;
    const prevNode = node.prevNode;

    /* This only happens if the node is the start node (i.e. first iteration of JPS) */
    if (prevNode === null) {
        neighbors = getNeighbors(grid, node, direction);
    }

    else if (prevNode !== null) {
        if (prevNode.row < node.row) {
            if (prevNode.column === node.column) {
                direction = 'right';
            }

            else if (prevNode.column > node.column) {
                direction = 'up-right';
            }

            else {
                direction = 'down-right';
            }
        }

        else if (prevNode.row === node.row) {
            if (prevNode.column > node.column) {
                direction = 'up';
            }

            else {
                direction = 'down';
            }
        }

        else {
            if (prevNode.column === node.column) {
                direction = 'left';
            }

            else if (prevNode.column < node.column) {
                direction = 'up-left';
            }

            else {
                direction = 'down-left';
            }
        }

        neighbors = getNeighbors(grid, node, direction);

        while (neighbors.isWall === false && neighbors.row > 0 &&
                neighbors.row < grid.rows && neighbors.column > 0 &&
                neighbors.column < grid.columns) {
            neighbors.push(getNeighbors(grid, neighbors, direction));
        }
    }
}

function getNeighbors(grid, node) {
    const neighbors = [];
    const row = node.row;
    const col = node.column;

    if (row > 0) {
        neighbors.push(grid.nodesMatix[row - 1][col]);
    }

    if (row < (grid.rows - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col]);
    }

    if (col > 0) {
        neighbors.push(grid.nodesMatrix[row][col - 1]);
    }

    if (col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row][col + 1]);
    }

    /* Left upper node */
    if (row > 0 && col > 0) {
        neighbors.push(grid.nodesMatrix[row - 1][col - 1]);
    }

    /* Right upper node */
    if (row > 0 && col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row - 1][col + 1]);
    }

    /* Right lower node */
    if (row < (grid.rows - 1) && col < (grid.columns - 1)) {
        neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
    }

    /* Left lower node */
    if (row < (grid.rows - 1) && col > 0) {
        neighbors.push(grid.nodesMatrix[row + 1][col - 1]);
    }

    return neighbors;
}