function initializePathways(){
        const pathwayContainer = document.getElementById('pathwaycontainer');
        const sortableList = document.getElementById('sortable-list');

        if (!pathwayContainer || !sortableList) {
            console.error('Could not find pathwaycontainer or sortable-list');
            return;
        }

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

        // Function to safely get or create an `ul` list within an accordion body
        function getOrCreateYearAccordionBody(year) {
            const accordionId = `accordion${year.replace(' ', '')}`;
            const accordionParent = document.getElementById(accordionId);
            if (accordionParent) {
                let accordionBody = accordionParent.querySelector('.accordion-body');
                if (accordionBody) {
                    let yearUl = accordionBody.querySelector('ul');
                    if (!yearUl) {
                        yearUl = document.createElement('ul');
                        yearUl.className = `year-container ${year.toLowerCase().replace(' ', '-')}`;
                        accordionBody.appendChild(yearUl);
                    }
                    return yearUl;
                } else {
                    console.error(`Accordion body not found within ${accordionId}`);
                    return null;
                }
            } else {
                console.error(`Accordion parent ${accordionId} not found.`);
                return null;
            }
        }

        // Create and append each year and its terms/courses into the corresponding accordion body
        Object.keys(years).forEach(year => {
            const yearUl = getOrCreateYearAccordionBody(year);
            if (yearUl) {
                Object.keys(years[year]).forEach(term => {
                    const termLi = document.createElement('li');
                    termLi.className = `term ${year.toLowerCase().replace(' ', '-')} ${term.toLowerCase().replace(' ', '-')}`;
                    termLi.innerHTML = `${year} - <strong>${term}</strong>`;

                    const courseUl = document.createElement('ul');
                    courseUl.className = `course-list ${year.toLowerCase().replace(' ', '-')} ${term.toLowerCase().replace(' ', '-')}`;

                    years[year][term].forEach(item => {
                        if (item.classList.contains('course')) {
                            courseUl.appendChild(item);
                        }
                    });

                    termLi.appendChild(courseUl);
                    yearUl.appendChild(termLi);
                });
            }
        });

        // Clear the original sortable list and remove all term elements matching the pattern
        Array.from(sortableList.children).forEach(item => {
            const match = item.id && item.id.match(yearTermPattern);
            if (match) {
                item.remove();
            }
        });
        // Apply the fade-in effect to the pathway container
        pathwayContainer.classList.add('fade-in');
        pathwayContainer.classList.remove('d-none');
        setTimeout(() => {
            pathwayContainer.classList.add('show');
        }, 10); // Small delay to ensure the transition is triggered
    // ZTC
    // Function to get URL parameters
    function getUrlParameter(name) {
        try {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        } catch (error) {
            console.error('Error getting URL parameter:', error);
            return '';
        }
    }

    // Function to swap element content if URL parameter exists
    function swapElementContentIfParamExists(param, elementId, newHtml) {
        try {
            if (getUrlParameter(param)) {
                var element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = newHtml;
                } else {
                    console.warn('Element with ID', elementId, 'not found.');
                }
            }
        } catch (error) {
            console.error('Error swapping element content:', error);
        }
    }
}
