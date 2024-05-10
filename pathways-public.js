document.addEventListener('DOMContentLoaded', function() {
    const pathwayContainer = document.getElementById('pathwaycontainer');
    const sortableList = document.getElementById('sortable-list');

    if (!pathwayContainer || !sortableList) {
        console.error('Could not find pathwaycontainer or sortable-list');
        return;
    }

    // Create a container for all the year groups
    const groupedContainer = document.createElement('div');
    groupedContainer.id = 'year-groups';

    // Retrieve all the list items from the sortable list
    const listItems = Array.from(sortableList.children);

    // Regular expression to match terms
    const yearTermPattern = /year(\d+)term(\d+)/i;

    // Create an object to hold each year's terms
    const years = {};

    // Iterate through the items and group them by year and term
    listItems.forEach(item => {
        const match = item.id && item.id.match(yearTermPattern);
        if (match) {
            const year = `Year ${match[1]}`;
            const term = `Term ${match[2]}`;

            if (!years[year]) {
                years[year] = {};
            }
            if (!years[year][term]) {
                years[year][term] = [];
            }

            years[year][term].push(item);
        } else if (item.classList.contains('course')) {
            // Place the course item in the last available year and term
            const lastYear = Object.keys(years).pop();
            if (lastYear) {
                const lastTerm = Object.keys(years[lastYear]).pop();
                years[lastYear][lastTerm].push(item);
            }
        }
    });

    // Clear the sortable list
    sortableList.innerHTML = '';

    // Create a new div and ul for each year, and append to the grouped container
    Object.keys(years).forEach(year => {
        const yearDiv = document.createElement('div');
        yearDiv.className = `year-container ${year.toLowerCase().replace(' ', '-')}`;

        Object.keys(years[year]).forEach(term => {

            const courseUl = document.createElement('ul');
            courseUl.className = `course-list ${year.toLowerCase().replace(' ', '-')} ${term.toLowerCase().replace(' ', '-')}`;

            years[year][term].forEach(item => {
                if (item.classList.contains('course')) {
                    courseUl.appendChild(item);
                } else {
                    termLi.appendChild(item);
                }
            });

            termLi.appendChild(courseUl);
            yearDiv.appendChild(termLi);
        });

        groupedContainer.appendChild(yearDiv);
    });

    // Append the grouped container after the sortable list
    pathwayContainer.appendChild(groupedContainer);
});
