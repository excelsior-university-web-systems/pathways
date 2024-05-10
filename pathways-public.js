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

    // Iterate through the items and group them by year
    listItems.forEach(item => {
        const match = item.id && item.id.match(yearTermPattern);
        if (match) {
            const year = `Year ${match[1]}`;
            if (!years[year]) {
                years[year] = [];
            }
            years[year].push(item);
        } else {
            const lastYear = Object.keys(years).pop();
            if (lastYear) {
                years[lastYear].push(item);
            }
        }
    });

    // Clear the sortable list
    sortableList.innerHTML = '';

    // Create a new div and ul for each year, and append to the grouped container
    Object.keys(years).forEach(year => {
        const div = document.createElement('div');
        div.className = `year-container ${year.toLowerCase().replace(' ', '-')}`;

        const ul = document.createElement('ul');
        ul.className = `year-list ${year.toLowerCase().replace(' ', '-')}`;

        years[year].forEach(item => ul.appendChild(item));

        div.appendChild(ul);
        groupedContainer.appendChild(div);
    });

    // Append the grouped container after the sortable list
    pathwayContainer.appendChild(groupedContainer);
});
