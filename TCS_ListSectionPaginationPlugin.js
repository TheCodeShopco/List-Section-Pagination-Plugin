function findListSection() {
   let paginationMarker = document.querySelector('#paginated-list-section');
   let paginationTarget = paginationMarker.closest('section').nextElementSibling;
   return { paginationTarget, paginationMarker };
}

function createNewListPage(paginationTarget) {
    let originalList = paginationTarget.querySelector('.user-items-list-simple');
    let newListPage = originalList.cloneNode(true);
    newListPage.textContent = "";
    newListPage.style.display = 'none';
    newListPage.classList.add('list_paginated');
    paginationTarget.querySelector('.user-items-list').appendChild(newListPage);
    return newListPage;
};

function moveItemsToNewListPage() {
    let { paginationTarget, paginationMarker } = findListSection();
    let originalList = paginationTarget.querySelector('.user-items-list-simple');
    let pageItemLimit = Number(paginationMarker.attributes['data-items-per-page'].value);
    let items = Array.from(originalList.children);
    
    let remainingItems = items.slice(pageItemLimit);
    
    while (remainingItems.length > pageItemLimit) {
        let newListPage = createNewListPage(paginationTarget);
        let overflowItems = remainingItems.splice(0, pageItemLimit);
        newListPage.append(...overflowItems);
    }
    
    if (remainingItems.length > 0) {
        let newListPage = createNewListPage(paginationTarget);
        newListPage.append(...remainingItems);
    }

    addPaginationButton(paginationTarget, paginationMarker);

    paginationTarget.querySelector('.user-items-list').classList.add('list-wrapper_paginated');
    paginationTarget.querySelector('.user-items-list').style.gap = window.getComputedStyle(paginationTarget.querySelector('.user-items-list-simple')).getPropertyValue('grid-gap');
    paginationTarget.querySelector('.user-items-list-simple').classList.add('list_paginated');
}

function checkForSectionButton(paginationTarget) {
    let sectionButton = paginationTarget.querySelector('.list-section-button-container');
    if (sectionButton) {
        paginationTarget.querySelector('.user-items-list').appendChild(sectionButton);
    }
}

function addPaginationButton(paginationTarget, paginationMarker) {
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
    button.addEventListener('click', (event) => {
        event.preventDefault();
        let hiddenPages = paginationTarget.querySelectorAll('.user-items-list-simple[style*="display: none"]');
        if (hiddenPages.length > 0) {
            hiddenPages[0].style.display = 'grid';
        }
        if (hiddenPages.length <= 1) {
            buttonWrapper.style.display = 'none';
        }
    });
    paginationTarget.querySelector('.user-items-list').appendChild(buttonWrapper);
    checkForSectionButton(paginationTarget);
}

moveItemsToNewListPage();