// ---- MAIN PLUGIN FUNCTION ---- //

// Helper function to detect targeting code block and find list section //

function findListSection() {
   let paginationMarker = document.querySelector('#paginated-list-section');
   let paginationTarget = paginationMarker.closest('section').nextElementSibling;
   return { paginationTarget, paginationMarker };
}

// Helper function to create a new 'page' full of items //

function createNewListPage(paginationTarget) {
    let originalList = paginationTarget.querySelector('.user-items-list-simple');
    let newListPage = originalList.cloneNode(true);
    newListPage.textContent = "";
    newListPage.style.display = 'none';
    newListPage.classList.add('list_paginated');
    paginationTarget.querySelector('.user-items-list').appendChild(newListPage);
    return newListPage;
};

// Helper function that checks if the user has enabled the additional button for the section and moves it to the bottom of the lists //

function checkForSectionButton(paginationTarget) {
    let sectionButton = paginationTarget.querySelector('.list-section-button-container');
    if (sectionButton) {
        paginationTarget.querySelector('.user-items-list').appendChild(sectionButton);
    }
}

// Helper function that creates the pagination button, along with its event listener, and adds it to the bottom of the lists //

function addPaginationButton(paginationTarget, paginationMarker) {
    
    // Creating the button and applying the correct styles and text //

    let buttonWrapper = document.createElement('div');
    buttonWrapper.id = 'list_pagination-button-wrapper';
    if (paginationTarget.querySelector('.user-items-list').getAttribute('data-layout-width') === 'inset') {
        buttonWrapper.style.maxWidth = '1400px';
    }
    let button = document.createElement('a');
    button.id = 'list_pagination-button';
    buttonWrapper.appendChild(button);
    let buttonPosition = paginationMarker.getAttribute('data-pagination-button-position') || 'center';
    if (buttonPosition === 'left') {
        buttonWrapper.style.justifyContent = 'flex-start';
    } else if (buttonPosition === 'right') {
        buttonWrapper.style.justifyContent = 'flex-end';
    } else {
        buttonWrapper.style.justifyContent = 'center';
    }
    let buttonStyle = paginationMarker.getAttribute('data-pagination-button-style') || 'primary';
    if (buttonStyle === 'secondary') {
        button.className = 'sqs-block-button-element--large sqs-button-element--secondary sqs-block-button-element';
    } else if (buttonStyle === 'tertiary') {
        button.className = 'sqs-block-button-element--small sqs-button-element--tertiary sqs-block-button-element';
    } else {
        button.className = 'sqs-block-button-element--medium sqs-button-element--primary sqs-block-button-element';
    } 
    let buttonText = paginationMarker.getAttribute('data-pagination-button-text') || 'View More';
    button.textContent = buttonText;

    // Creating and adding the event listner to the button //

    button.addEventListener('click', (event) => {
        // Prevents the button from clicking through //
        event.preventDefault();
        // Finding the list of pages that are hidden //
        let hiddenPages = paginationTarget.querySelectorAll('.user-items-list-simple[style*="display: none"]');
        // If there are hidden pages, display the first one //
        if (hiddenPages.length > 0) {
            hiddenPages[0].style.display = 'grid';
        }
        // If there are no hidden pages, hide the button //
        if (hiddenPages.length <= 1) {
            buttonWrapper.style.display = 'none';
        }
    });

    // Appending the button to the end of the list //

    paginationTarget.querySelector('.user-items-list').appendChild(buttonWrapper);

    // Calling the helper function to sort out the additional button if its there //

    checkForSectionButton(paginationTarget);
}

// Main function that creates the pagination for the list section //

function createPagination() {

    // Finds the list section and the code block target //

    let { paginationTarget, paginationMarker } = findListSection();

    // Finds the whole list of items //

    let originalList = paginationTarget.querySelector('.user-items-list-simple');
    let items = Array.from(originalList.children);

    // Finds the amount of items per page and gets a list of remaining items left after the first page has been filled //

    let pageItemLimit = Number(paginationMarker.attributes['data-items-per-page'].value);
    let remainingItems = items.slice(pageItemLimit);
    
    // While there are more items remaining than the limit per page, create a new page and append the items to it //
    
    while (remainingItems.length > pageItemLimit) {
        // Creates a new page for items to fill //
        let newListPage = createNewListPage(paginationTarget);
        // Defines a list of the first 'x' items to fill the new page //
        let overflowItems = remainingItems.splice(0, pageItemLimit);
        // Appends the items to the new page //
        newListPage.append(...overflowItems);
    }
    
    // If there are still items left after the while loop, create a new page and append the remaining items to it //
    
    if (remainingItems.length > 0) {
        let newListPage = createNewListPage(paginationTarget);
        newListPage.append(...remainingItems);
    }

    // Adds the pagination button to the bottom of the lists //

    addPaginationButton(paginationTarget, paginationMarker);

    // Applies CSS styles to the relevant items //

    paginationTarget.querySelector('.user-items-list').classList.add('list-wrapper_paginated');
    paginationTarget.querySelector('.user-items-list').style.gap = window.getComputedStyle(paginationTarget.querySelector('.user-items-list-simple')).getPropertyValue('grid-gap');
    paginationTarget.querySelector('.user-items-list-simple').classList.add('list_paginated');
}

// Calling the function at the end of page load //

document.addEventListener('DOMContentLoaded', createPagination);