document.addEventListener('DOMContentLoaded', function () {
  // DRAGGABLE FUNCTIONALITY
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

// CHECKED COURSE VISIBILITY
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

  // JUMP TO YEAR MENU
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

// NAVIGATION STICKY SHADOW
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

    // SELECT ALTERNATIVE COURSE OPTION
    // Listen for click events on buttons with the class 'options'
    const optionButtons = document.querySelectorAll('.options');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
          // ADD COUNT SENTENCE IN OPTIONS MODAL
          const optionsList = this.closest('.course').querySelector('.options-list');
          if (optionsList) {
              // Get all 'li' elements except the first one
              const listItems = optionsList.querySelectorAll('li:not(:first-child)');
              // Count the 'li' elements
              const count = listItems.length;
              // Find the '.options-count' span and update its content
              const optionsCountSpan = this.closest('.course').querySelector('.options-count');
              if (optionsCountSpan) {
                  if (count === 1) {
                      optionsCountSpan.textContent = 'There is one alternative for this requirement.';
                  } else {
                      optionsCountSpan.textContent = `There are ${count} alternatives for this requirement`;
                  }
              }
          }
          // COMPARE COURSE OPTIONS TO SELECTED COURSES, ADD OR REMOVE DISABLED AS APPROPRIATE
            const courseElement = this.closest('.course');
           // const optionsList = courseElement.querySelector('.options-list');
            const courseIds = Array.from(document.querySelectorAll('#sortable-list .courseid'))
                                  .map(courseid => courseid.textContent.trim()); // Get all course IDs from sortable list
            // Iterate over each option-course within the options list
            optionsList.querySelectorAll('.option-course').forEach(option => {
                const spanText = option.querySelector('span').textContent; // Get the course ID from the first span of the option-course
                const tooltipLinkHtml = '<a data-toggle="tooltip" title="This course is already selected."><i class="fa-solid fa-triangle-exclamation"></i></a>';
                const existingTooltip = option.querySelector('a[data-toggle="tooltip"]');
                if (courseIds.includes(spanText) && !existingTooltip) {
                      option.insertAdjacentHTML('beforeend', tooltipLinkHtml); // Add tooltip
                } else {
                    if (existingTooltip) {
                      existingTooltip.parentNode.removeChild(existingTooltip); // Remove tooltip
                  }
                }
            });
          });
        });

    // COURSE OPTIONS
    // Listen for click events on buttons with the class 'option-course' within 'options-list'
      const courseOptionButtons = document.querySelectorAll('.options-list .option-course');
      courseOptionButtons.forEach(button => {
          button.addEventListener('click', function() {
              // Find the closest parent with the class '.course'
              const courseElement = this.closest('.course');
              // Extract text from the first and second span within the clicked button
              const spans = this.querySelectorAll('span');
              const courseIDText = spans[0].textContent;
              const courseNameText = spans[1].textContent;
              // Get the ID from the data-bs-target attribute of the collapse button related to this option
              const collapseButton = this.nextElementSibling;
              const collapseId = collapseButton.getAttribute('data-bs-target');
              // Correctly select the card body within the specified collapsible element
              const cardBodyElement = document.querySelector(collapseId + ' .card.card-body');
              if (cardBodyElement) {
                  const courseDetails = cardBodyElement.innerHTML;
                  const courseIDElement = courseElement.querySelector('.courseid');
                  const courseNameElement = courseElement.querySelector('.course-name');
                  const courseDetailsElement = courseElement.querySelector('.course-details');
                  if (courseIDElement && courseNameElement && courseDetailsElement) {
                      courseIDElement.textContent = courseIDText;
                      courseNameElement.textContent = courseNameText;
                      courseDetailsElement.innerHTML = courseDetails;
                  }
              } else {
                  console.error('Card body element not found for collapse ID:', collapseId);
              }
              // Add animation effect on the clicked option course
              this.classList.add('flash-animation');
              // COLLAPSE ALL DESCRIPTIONS WHEN MODAL IS CLOSED
              const modals = document.querySelectorAll('.modal');
              modals.forEach(modal => {
                  // Listen for the modal closing event
                  modal.addEventListener('hide.bs.modal', function() {
                      // Find all expanded collapsible elements within this modal
                      const expandedItems = modal.querySelectorAll('.collapse.show');
                      // Collapse each expanded item
                      expandedItems.forEach(item => {
                          const collapseInstance = new bootstrap.Collapse(item, {
                              toggle: false // This option disables toggling: it won't toggle to shown if it's already hidden
                          });
                          collapseInstance.hide(); // Explicitly hide the collapsible element
                      });
                  });
              // CLOSE MODAL WHEN OPTION IS CLICKED
              const modalElement = this.closest('.modal');
              if (modalElement) {
                  var modalInstance = bootstrap.Modal.getInstance(modalElement);
                  if (modalInstance) {
                      modalInstance.hide();
                  }
              }
          });
          // Remove animation class after it completes
          button.addEventListener('animationend', () => {
            button.classList.remove('flash-animation');
        });
      });
  });

});