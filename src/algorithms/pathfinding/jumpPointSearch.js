'use strict';

export default function jumpPointSearch(grid, startNode, finishNode) 
{
    const closedList = [];
    const openList = [];
    const shortestPath = [];
    startNode.distanceFromStart = 0;
    startNode.heuristicDistance = getDistance(startNode, finishNode);
    startNode.totalDistance = startNode.distanceFromStart + startNode.heuristicDistance;
    openList.push(startNode);

    while (openList.length > 0) 
    {
        sortNodesByDistance(openList);

        const closestNode = openList.shift();
        closedList.push(closestNode);

        if (closestNode.isWall === true)
            continue;

        if (closestNode === finishNode)
        {
            let currentNode = finishNode;

            /* Recreate the path from the finish to the start node by going
                through the previous nodes until the start node is reached */
            while (currentNode !== null) 
            {
                shortestPath.unshift(currentNode);
                currentNode = currentNode.prevNode;
            }

            return [closedList, shortestPath];
        }

        identifySuccessors(grid, closestNode, finishNode, closedList, openList);
    }

    return [closedList, shortestPath];
}

function sortNodesByDistance(openList) 
{
    /* The node with the lowest total distance (distance from start to it and 
        from it to the finish node) will be the first element in the array, 
        because it's the most promising one */
    openList.sort((firstNode, secondNode) =>
        firstNode.totalDistance - secondNode.totalDistance);
}

function identifySuccessors(grid, currentNode, finishNode, closedList, openList) 
{
    const neighbors = getNeighbors(grid, currentNode);

    for (const neighbor of neighbors) 
    {
        
        if (neighbor.isWall === true || closedList.includes(neighbor) === true) 
            continue;

        neighbor.distanceFromStart = currentNode.distanceFromStart + getDistance(currentNode, neighbor);
        neighbor.prevNode = currentNode;

        const rowChange = neighbor.row - currentNode.row;
        const colChange = neighbor.column - currentNode.column;

        const destination = jump(grid, neighbor.row, neighbor.column, rowChange, colChange, finishNode);

        if (destination !== null)
        {
            const jumpPoint = grid.nodesMatrix[ destination[0] ][ destination[1] ];

            if (closedList.includes(jumpPoint) === true)
                continue;

            const shortestPath = neighbor.distanceFromStart + getDistance(neighbor, jumpPoint);
            let shortestPathFound = false;

            if (openList.includes(jumpPoint) === false)
            {
                shortestPathFound = true;
                jumpPoint.heuristicDistance = getDistance(jumpPoint, finishNode);
                openList.push(jumpPoint);
            }

            else if (shortestPath < jumpPoint.distanceFromStart)
                shortestPathFound = true;

            if (shortestPathFound === true)
            {
                jumpPoint.distanceFromStart = shortestPath;
                jumpPoint.totalDistance = jumpPoint.distanceFromStart + jumpPoint.heuristicDistance;

                if (jumpPoint.id !== neighbor.id)
                    setPrevNodes(grid, jumpPoint, neighbor);

                else
                    setPrevNodes(grid, jumpPoint, currentNode);
            }
        }
    }
}

function jump(grid, row, col, rowChange, colChange, finishNode)
{
    /* Prevent moving off the edge of the grid */
    if (grid.isAccessibleAt(row, col) === false)
        return null;

    if (grid.nodesMatrix[row][col] === finishNode)
        return [row, col];

    /* Jump diagonally */
    if (rowChange !== 0 && colChange !== 0)
    {
        /* Mark the current node as a jump point if there's either a wall or 
            an one way node whose direction isn't 'right' 
            
            Example for up and right movement (vertically mirrored for up and left,
            horizontally mirrored for down movement):
            1 
            x c
            p

            p = previous node
            c = current node
            x = wall or non traversable one way node
            */
        if (grid.isAccessibleAt(row + rowChange, col - colChange) === true &&
            grid.isAccessibleAt(row, col - colChange) === false)
            return [row, col];

        /* Example for up and right movement:
              c
            p x 2 */

        /* 2 */
        if (grid.isAccessibleAt(row - rowChange, col + colChange) === true &&
            grid.isAccessibleAt(row - rowChange, col) === false)
            return [row, col];

        /* Jump horizontally */
        if (jump(grid, row, col + colChange, 0, colChange, finishNode) !== null)
            return [row, col];

        /* Jump vertically */
        if (jump(grid, row + rowChange, col, rowChange, 0, finishNode) !== null)
            return [row, col];
    }

    else
    {
        /* Moving vertically */
        if (rowChange !== 0)
        {
            /* If the node directly right of our current node is a wall or an one
                way node whose direction isn't 'right' then return the current node
                to be a jump point. The node after the wall (or one way node)
                in horizontal direction can't be accessed by any node other than 
                jumping diagonally from this new jump point. */
            if (grid.isAccessibleAt(row + rowChange, col + 1) === true &&
                grid.isAccessibleAt(row + rowChange, col) === true && 
                grid.isAccessibleAt(row, col + 1) === false)
                return [row, col];

            if (grid.isAccessibleAt(row + rowChange, col - 1) === true &&
                grid.isAccessibleAt(row + rowChange, col) === true &&
                grid.isAccessibleAt(row, col - 1) === false)
                return [row, col];
        }

        /* Moving horizontally */
        if (colChange !== 0)
        {
            if (grid.isAccessibleAt(row + 1, col + colChange) === true &&
                grid.isAccessibleAt(row, col + colChange) === true &&
                grid.isAccessibleAt(row + 1, col) === false)
                return [row, col];

            if (grid.isAccessibleAt(row - 1, col + colChange) === true &&
                grid.isAccessibleAt(row, col + colChange) === true &&
                grid.isAccessibleAt(row - 1, col) === false)
                return [row, col];
        }
    }

    return jump(grid, row + rowChange, col + colChange, rowChange, colChange, finishNode);
}

function setPrevNodes(grid, jumpPoint, initialNode)
{
    const rowDiff = jumpPoint.row - initialNode.row;
    const colDiff = jumpPoint.column - initialNode.column;
    let rowChange = 0, colChange = 0;

    if (rowDiff !== 0)
        rowChange = rowDiff / Math.abs(rowDiff);

    if (colDiff !== 0)
        colChange = colDiff / Math.abs(colDiff);

    let currentNode = initialNode;

    while (currentNode !== jumpPoint)
    {
        const nextNode = grid.nodesMatrix[currentNode.row + rowChange][currentNode.column + colChange];
        nextNode.prevNode = currentNode;
        currentNode = nextNode;
    }
}

function getNeighbors(grid, node) 
{
    const neighbors = [];
    const row = node.row;
    const col = node.column;
    let up = false, down = false, left = false, right = false;

    const [rowDirection, colDirection] = 
        grid.nodesMatrix[row][col].allowedDirection;

    /* If current node is an one way node then only allow movement
        in the direction of the arrow */
    if (rowDirection !== null && colDirection !== null)
    {
        /* Prevent corner cutting if the one way node makes this the only option, but
            Jump Point Search doesn't allow for corner cutting */
        if (rowDirection !== 0 && colDirection !== 0 &&
            checkCornerCutting(grid, row, col, rowDirection, colDirection) === false)
            return neighbors;

        neighbors.push(grid.nodesMatrix[row + rowDirection][col + colDirection])
        return neighbors;
    }

    /* If the node is the start node */
    if (node.prevNode === null)
    {
        if (row > 0) 
        {
            neighbors.push(grid.nodesMatrix[row - 1][col]);
            up = true;
        }

        if (row < grid.rows - 1) 
        {
            neighbors.push(grid.nodesMatrix[row + 1][col]);
            down = true;
        }

        if (col > 0) 
        {
            neighbors.push(grid.nodesMatrix[row][col - 1]);
            left = true;
        }

        if (col < grid.columns - 1) 
        {
            neighbors.push(grid.nodesMatrix[row][col + 1]);
            right = true;
        }

        if (up === true && left === true &&
            checkCornerCutting(grid, row, col, -1, -1) === false)
            neighbors.push(grid.nodesMatrix[row - 1][col - 1]);

        if (up === true && right === true &&
            checkCornerCutting(grid, row, col, -1, 1) === false)
            neighbors.push(grid.nodesMatrix[row - 1][col + 1]);

        if (down === true && left === true &&
            checkCornerCutting(grid, row, col, 1, -1) === false) 
            neighbors.push(grid.nodesMatrix[row + 1][col - 1]);

        if (down === true && right === true &&
            checkCornerCutting(grid, row, col, 1, 1) === false) 
            neighbors.push(grid.nodesMatrix[row + 1][col + 1]);
    }

    /* Otherwise add neighbors based on direction of previous node of current 
        node to current node */
    else 
    {
        const prevRow = node.prevNode.row;
        const prevCol = node.prevNode.column;

        const rowDiff = row - prevRow;
        const colDiff = col - prevCol;
        let rowChange = 0, colChange = 0;
        
        if (rowDiff !== 0)
            rowChange = rowDiff / Math.abs(rowDiff);
        
        if (colDiff !== 0)
            colChange = colDiff / Math.abs(colDiff);

        const nextRow = row + rowChange;
        const nextCol = col + colChange;
        
        /* Add neighbors based on location of previous node
            in relation to current node (diagonal movement only):

            p = previous node
            c = current node
            x = wall or non traversable one way node
            Nodes 4 and 5 are only added if there are walls (or non traversable
            one way nodes) between them and the previous node. 

            Up and left (vertically mirrored for up and right):
            5 1 3           
            x c 2              
            p x 4 
            
            Down and right (vertically mirrored for down and left):
            4 x p            
            2 c x
            3 1 5 */
        if (rowChange !== 0 && colChange !== 0)
        {
            /* 1 */
            if (grid.isAccessibleAt(nextRow, col) === true)
                neighbors.push(grid.nodesMatrix[nextRow][col]);

            /* 2 */
            if (grid.isAccessibleAt(row, nextCol) === true)
                neighbors.push(grid.nodesMatrix[row][nextCol]);

            /* 3 */
            if (grid.isAccessibleAt(nextRow, nextCol) === true &&
                checkCornerCutting(grid, row, col, rowChange, colChange) === false)
                neighbors.push(grid.nodesMatrix[nextRow][nextCol]);

            /* 4 */
            if (grid.isAccessibleAt(prevRow, col) === false &&
                grid.isAccessibleAt(row, nextCol) === true)
                neighbors.push(grid.nodesMatrix[prevRow][nextCol]);

            /* 5 */
            if (grid.isAccessibleAt(row, prevCol) === false &&
                grid.isAccessibleAt(nextRow, col) === true)
                neighbors.push(grid.nodesMatrix[nextRow][prevCol]);
        }

        else
        {
            /* Horizontal movement:
                x 3
                c 1
                x 2
                
                c = current node
                x = wall or non traversable one way node 
                Node 2 is only added if there's a wall (or non traversable one way node)
                directly below the current node and if node 2 is traversable i.e. it either 
                has no one way arrow (traversable in all directions) or the allowed direction 
                is down and right */
            if (colChange !== 0)
            {
                /* Bug description: Works as intended unless arrow above or below current node
                    points in this direction (i.e. node above current node has arrow pointing 
                    straight up) */
                let accessible = false;

                /* 1 */
                if (grid.isAccessibleAt(row, nextCol) === true)
                {
                    accessible = true;
                    neighbors.push(grid.nodesMatrix[row][nextCol]);
                }

                /* 2 */
                if (grid.isOnGrid(row + 1, col) === true && 
                    accessible === true &&
                    grid.isAccessibleAt(row + 1, col) === false)
                    neighbors.push(grid.nodesMatrix[row + 1][nextCol]);

                /* 3 */
                if (grid.isOnGrid(row - 1, col) === true && 
                    accessible === true &&
                    grid.isAccessibleAt(row - 1, col) === false) 
                    neighbors.push(grid.nodesMatrix[row - 1][nextCol]);
            }

            /* Vertical movement:
                x c x
                2 1 3 
                
                c = current node
                x = wall or non traversable one way node */
            if (rowChange !== 0)
            {
                let accessible = false;

                /* 1 */
                if (grid.isAccessibleAt(nextRow, col) === true)
                {
                    accessible = true;
                    neighbors.push(grid.nodesMatrix[nextRow][col]);
                }
                
                /* 2 */
                if (grid.isOnGrid(row, col - 1) &&
                    accessible === true &&
                    grid.isAccessibleAt(row, col - 1) === false)
                    neighbors.push(grid.nodesMatrix[nextRow][col - 1]);

                /* 3 */
                if (grid.isOnGrid(row, col + 1) &&
                    accessible === true &&
                    grid.isAccessibleAt(row, col + 1) === false)
                    neighbors.push(grid.nodesMatrix[nextRow][col + 1]);
            }
        }
    }

    return neighbors;
}

/* Prohibit diagonal movement in that direction if there's a wall directly next to it
    vertically and horizontally */
function checkCornerCutting(grid, row, col, rowChange, colChange) 
{
    if (grid.isAccessibleAt(row + rowChange, col) === false &&
        grid.isAccessibleAt(row, col + colChange) === false)
        return true;

    return false;
}

/* Octile distance is used to check if moving diagonally has a smaller cost
    than moving in only four directions */
function getDistance(firstNode, secondNode) 
{
    const rowChange = Math.abs(firstNode.row - secondNode.row);
    const colChange = Math.abs(firstNode.row - secondNode.row);

    if (rowChange > colChange)
        return ((rowChange - colChange) + (Math.SQRT2 * colChange));

    else 
        return ((colChange - rowChange) + (Math.SQRT2 * rowChange));
}