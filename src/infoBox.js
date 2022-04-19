'use strict';

export {infoBoxVisible, openInfoBox, closeInfoBox, handlePrevInfoButton, 
        handleNextInfoButton, mobileFriendlyInfoBox};
        
import {enableButtons, enableButtonsMobile, disableButtons} 
        from './helperFunctions.js';

const LAST_INFOBOX_PAGE = 7;
let infoBoxPage = 0;
let infoBoxVisible = true;
let prevInfoBoxButton = document.getElementById('prevInfoBoxButton');
let nextInfoBoxButton = document.getElementById('nextInfoBoxButton');
let currInfoBoxPage = document.getElementById('currInfoBoxPage');
let infoBoxText = document.getElementById('infoBoxText');
let infoBox = document.getElementById('infoBox');

function mobileFriendlyInfoBox() {
    infoBox.style.width = '100vw';
    infoBox.style.height = '80vh';
    infoBox.style.top = '10vh';
    infoBox.style.left = '0';
    infoBox.style.transform = 'translate(0, 0)';
}

function openInfoBox() {
    disableButtons();
    infoBoxVisible = true;

    infoBox.style.display = 'inline';
}

function closeInfoBox() {
    let overlays = document.getElementsByClassName('overlay');
    
    /* Remove the white overlay of the background */
    for (let i = 0; i < overlays.length; i++) {
        overlays[i].style.opacity = '1';
    }

    /* In the mobile version if the user closes the info box while the 
        menu's open then don't enable the algorithm dropdown menu and 
        animate algorithm button in the upper bar */
    const menuStyles = document.getElementsByClassName('menuStyle');

    for (const menuStyle of menuStyles) {
        if (menuStyle.style.display === 'flex') {
            enableButtonsMobile();
        }

        else {
            enableButtons();
        }
    }

    infoBoxVisible = false;

    infoBox.style.display = 'none';
}

function updateCurrPage(currPage) {
    currInfoBoxPage.innerHTML = 
        `${currPage + 1}/${LAST_INFOBOX_PAGE + 1}`;
}

function handlePrevInfoButton() {
    if (infoBoxPage > 0) {
        infoBoxPage--;
        updateCurrPage(infoBoxPage);
    }

    else if (infoBoxPage === 0) {
        prevInfoBoxButton.disabled = true;
    }

    nextInfoBoxButton.innerHTML = 'Next';
    displayInfoBoxText(infoBoxPage);
}

function handleNextInfoButton() {
    if (infoBoxPage === (LAST_INFOBOX_PAGE - 1)) {
        nextInfoBoxButton.innerHTML = 'Finish';
        nextInfoBoxPage();
    }

    else if (infoBoxPage === LAST_INFOBOX_PAGE) {
        closeInfoBox();
    }

    else {
        nextInfoBoxButton.innerHTML = 'Next';
        nextInfoBoxPage();
    }
}

function nextInfoBoxPage() {
    if (infoBoxPage < (LAST_INFOBOX_PAGE)) {
        infoBoxPage++;
        updateCurrPage(infoBoxPage);
    }

    if (infoBoxPage > 0) {
        prevInfoBoxButton.disabled = false;
    }

    displayInfoBoxText(infoBoxPage);
}

function displayInfoBoxText(currentPage) {
    switch (currentPage) {
        case 0:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">Welcome to my Pathfinding
            Visualizer</h2>
            <p class="pInfoBox">This project was created to visualize different 
                pathfinding algorithms, but what is a that? These kinds of algorithms 
                are used to find the shortest path between two points (here nodes 
                on a 2d-grid). <br/>Please note that not all algorithms that are
                listed here <strong>guarantee</strong> the shortest path. 
                <br/>You can skip this introductory tutorial at any point by clicking 
                the "Skip"-button. Otherwise press "Next" for more info about this project.
            </p>`
            break;
        case 1:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">Selecting an algorithm</h2>
            <h3 class="h3InfoBox">You can select an algorithm from the first dropdown menu
                titled "Pick An Algorithm"
            </h3>
            <p class="pInfoBox">Please note that some of these algorithms are weighted 
                while others are unweighed. <br/><strong>Weighted</strong> 
                algorithms allow for weights to be placed on the 2d-grid, which are harder 
                to traverse than an empty field, but not impossible like walls. <br/> 
                <strong>Unweighted</strong> algorithms do not allow for the 
                placement of weights.
            </p>`;
            break;
        case 2:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">The algorithms 1/2</h2>
            <p class="pInfoBox"><strong>Dijkstra's algorithm (weighted):</strong> Explores 
                all directions equally and guarantees the shortest path from start to finish.
                <br/><strong>A* algorithm (weighted):</strong> Uses heuristics to explore the 
                most promising nodes first, therefore speeding up the search process. Also 
                guarantees the shortest path. <br/><strong>Greedy best-first search (weighted):
                </strong> Like A*, but it relies solely on heuristics, making it faster than A*, 
                but more prone to errors and not guaranteeing the shortest path. <br/>
                <strong>Breadth-first search (unweighted):</strong> Like Dijkstra, but it does 
                not take weights into account.
            </p>`;
            break;
        case 3:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">The algorithms 2/2</h2>
            <p class="pInfoBox"><strong>Bidirectional Dijkstra's algorithm (weighted):</strong>
                Like Dijkstra's, but the search starts from both start and finish simultaneously. 
                It does not guarantee the shortest path. <br/>
                <strong>Bidirectional A* algorithm (weighted):</strong> Again both start and finish
                node use A* algorithm to reach each other and there is no guarantee that the found 
                path is the shortest one. <br/><strong>Depth-first search (unweighted):</strong> It 
                explores every chosen path until it reaches the edge of the grid without any 
                heuristics and is therefore slow and and does not guarantee the shortest path. 
                <br/><strong>Jump Point Search (unweighted):</strong> An improved version of the A*
                algorithm where instead of checking each individual neighbor the algorithm jumps 
                into these directions to see if there are any "jump points" (i.e. points next to 
                walls) and then starts jumping from there. This algorithm also guarantees the 
                shortest path.
            </p>`;
            break;
        case 4:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">Overview of features 1/2</h2>
            <p class="pInfoBox">Walls can be easily added by left-clicking on a tile and
                removed by clicking on it again. <br/>The start and finish node can be moved
                by simply left-clicking on them and then clicking the tile where you want to 
                place them. <br/><span style="color: red;">The following does <strong>NOT</strong> 
                work in the mobile version:</span><br/>There are three different weights 
                which can be placed by left-clicking while pressing either of these buttons: 
                <span style="color: #32ccb2;">Q</span>, <span style="color: #e8dd19;">
                W</span>, <span style="color: #06d314;">E</span>. Their values can be 
                adjusted individually by using the "Adjust Weights" menu and they can be 
                removed by pressing the same key and left-clicking.
            </p>
            <img src="images/walls_weights_movement.gif" id="movementGif"/>`;
            break;
        case 5:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">Overview of features 2/2</h2>
            <p class="pInfoBox">Clear Algorithm: Removes the previous algorithm while leaving the
                walls and weights in their place. <br/>Clear Walls: Removes all walls. <br/>
                Clear Weights: Removes all weights. <br/>Reset Board: Returns the board to its
                original look so that all walls and weights are removed and the start and finish
                node are in their original places too.
            </p>`;
            break;
        case 6:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">Diagonal movement</h2>
            <p class="pInfoBox">Algorithms that use heuristics allow you to switch between two types
                of movement by clicking the switch "Four Directions". <br/><strong>"Four Directions"
                </strong> allows the start node to move up, down, left and right, while <strong>"Eight 
                Directions" </strong> adds four diagonal directions to the mix. The algorithms that 
                can make use of this feature are: A*, Greedy Best-First Search and Bidirectional A*.
                <br/><br/>
            </p>
            <img src="images/directions.png" id="directionsImg"/>`;
            break;
        case 7:
            infoBoxText.innerHTML = `<h2 class="h2InfoBox">Cutting corners</h2>
            <p class="pInfoBox"><strong>"Corner cutting"</strong> only works when the allowed directions
                are set to <strong>"Eight Directions"</strong>. This setting allows the red square to
                squeeze itself through non-existent spaces when moving diagonally. Please see the video 
                below for an illustration.
            </p>
            <img src="images/corner_cutting.gif" id="cornerCuttingGif"/>`;
            break;
    }
}