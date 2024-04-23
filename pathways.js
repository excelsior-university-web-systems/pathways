
// DRAGGABLE FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function () {
  // Add a specific class to the first 'term' item to mark it as non-draggable
  var firstTerm = document.querySelector('.term');
  if (firstTerm) {
    firstTerm.classList.add('first-term'); // Use a unique class to identify the first term
  }
  // Initialize Sortable with the updated filter to exclude '.first-term'
  new Sortable(document.getElementById('sortable-list'), {
    filter: '.course, .first-term', // Now also preventing the first 'term' from being draggable.
    onMove: function(evt) {
      const dragged = evt.dragged;
      const related = evt.related;
      const willInsertAfter = evt.willInsertAfter;
      if (dragged.classList.contains('term')) {
        const items = Array.from(document.getElementById('sortable-list').children);
        const draggedIndex = items.indexOf(dragged);
        let newIndex = items.indexOf(related) + (willInsertAfter ? 1 : 0);
        let prevTermIndex = newIndex - 1;
        let nextTermIndex = newIndex;
        while (prevTermIndex > 0 && !items[prevTermIndex].classList.contains('term')) {
          prevTermIndex--;
        }
        while (nextTermIndex < items.length - 1 && !items[nextTermIndex].classList.contains('term')) {
          nextTermIndex++;
        }
        if (items[prevTermIndex] && items[prevTermIndex].classList.contains('term') && prevTermIndex > draggedIndex) {
          return false;
        }
        if (items[nextTermIndex] && items[nextTermIndex].classList.contains('term') && nextTermIndex < draggedIndex) {
          return false;
        }
      }
      return true;
    },
    animation: 150,
  });
});
// CHECKED COURSE VISIBILITY
document.addEventListener('DOMContentLoaded', function() {
  function toggleCoursesVisibility() {
    const isHidden = document.getElementById('toggleCourseVisibility').checked;
    const toggleLabel = document.getElementById('toggleLabel');
    if (isHidden) {
      toggleLabel.textContent = "Show Completed";
    } else {
      toggleLabel.textContent = "Hide Completed";
    }
    const courses = document.querySelectorAll('.course');
    let hiddenCount = 0;
    courses.forEach(course => {
      if (course.querySelector('input[type="checkbox"]').checked) {
        if (isHidden) {
          course.classList.add('hidden');
          hiddenCount++;
        } else {
          course.classList.remove('hidden');
        }
      } else {
        course.classList.remove('hidden');
      }
    });
    const hiddenCourseCountElement = document.getElementById('hiddenCourseCount');
    if (hiddenCourseCountElement) {
      if (hiddenCount > 0) {
        hiddenCourseCountElement.textContent = ` (${hiddenCount})`;
      } else {
        hiddenCourseCountElement.textContent = ``; // Set text to empty if no courses are hidden
      }
    } else {
      console.error('The element #hiddenCourseCount does not exist in the DOM.');
    }
  }
  // Attach the visibility toggle function to changes on the master toggle and each course checkbox
  document.getElementById('toggleCourseVisibility').addEventListener('change', toggleCoursesVisibility);
  document.querySelectorAll('.course input[type="checkbox"]').forEach(courseCheckbox => {
    courseCheckbox.addEventListener('change', toggleCoursesVisibility);
  });
});
// JUMP TO YEAR MENU
document.addEventListener('DOMContentLoaded', function() {
  const jumpToYearBtn = document.querySelector('#jumpToYearContainer > button');
  const yearMenu = document.querySelector('#jumpToYearContainer > ul');
  const jumpToYearContainer = document.getElementById('jumpToYearContainer'); // Ensure this is defined
  // Function to toggle dropdown and update aria-expanded
  function toggleDropdown() {
    yearMenu.classList.toggle('show');
    updateAriaExpanded(); // Update immediately after toggle
  }
  // Function to set aria-expanded attribute based on visibility of the menu
  function updateAriaExpanded() {
    const isShown = yearMenu.classList.contains('show');
    jumpToYearBtn.setAttribute('aria-expanded', isShown.toString());
  }
  // Initialize the aria-expanded attribute based on the initial state
  updateAriaExpanded();
  // Bind toggle functionality and update aria-expanded on button click
  jumpToYearBtn.addEventListener('click', toggleDropdown);
  // Hide the menu when a sub-item is clicked
  yearMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      yearMenu.classList.remove('show');
      updateAriaExpanded();
    }
  });
  // Hide the menu when clicking outside of it
  document.addEventListener('click', function(e) {
    if (!jumpToYearContainer.contains(e.target)) {
      yearMenu.classList.remove('show');
      updateAriaExpanded();
    }
  }, true);
});
// NAVIGATION STICKY SHADOW
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', function() {
    var stickyElement = document.getElementById('pathwaynav');
    if (!stickyElement) return; // Safeguard against null reference
    var stickyRect = stickyElement.getBoundingClientRect();
    if (stickyRect.top <= 0) {
      stickyElement.classList.add('sticky-shadow');
    } else {
      stickyElement.classList.remove('sticky-shadow');
    }
  });
});
// SELECT ALTERNATIVE COURSE OPTION
document.addEventListener('DOMContentLoaded', function() {
    // Find all elements with the class .options-list
    const optionsLists = document.querySelectorAll('.options-list');
    // Attach a click event listener to each options-list
    optionsLists.forEach(optionsList => {
        optionsList.addEventListener('click', function(event) {
            // Check if the clicked element or its parents is a button
            if (event.target.closest('button')) return; // Ignore the click if it's on a button or within a button
            // Check if the clicked element is within an <li>
            let clickedLi = event.target.closest('li');
            if (!clickedLi) return; // Do nothing if the click was not inside a list item
            // Get the spans from the clicked list item
            let spans = clickedLi.querySelectorAll('span');
            if (spans.length < 2) return; // Ensure there are at least two spans
            // Update the .accordion-item .courseid and .course-name elements
            let courseidElement = document.querySelector('.accordion-item .courseid');
            let coursenameElement = document.querySelector('.accordion-item .course-name');
            if (courseidElement && coursenameElement) {
                courseidElement.textContent = spans[0].textContent; // First span is course ID
                coursenameElement.textContent = spans[1].textContent; // Second span is course name
            }
            // Find the .card-body within the clicked li and copy its content
            let cardBody = clickedLi.querySelector('.card-body');
            if (cardBody) {
                let accordionBody = document.querySelector('.accordion-item .accordion-body');
                if (accordionBody) {
                    accordionBody.innerHTML = cardBody.innerHTML; // Replace the accordion content with new content

                    // Trigger the modal-footer button when changes are made
                    let modalFooterButton = document.querySelector('.modal-footer button');
                    if (modalFooterButton) {
                        modalFooterButton.click(); // Simulate a click on the modal footer button
                    }
                }
            }
        });
    });
});


