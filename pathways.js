
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
    // Listen for click events on buttons with the class 'option-course' within 'options-list'
    const optionButtons = document.querySelectorAll('.options-list .option-course');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Find the closest parent with the class '.course'
            const courseElement = this.closest('.course');
            // Extract text from the first and second span within the clicked button
            const spans = this.querySelectorAll('span');
            const courseIDText = spans[0].textContent;
            const courseNameText = spans[1].textContent;
            // Update the '.courseid' and '.course-name' elements within the same '.course' parent
            const courseIDElement = courseElement.querySelector('.courseid');
            const courseNameElement = courseElement.querySelector('.course-name');
            if (courseIDElement && courseNameElement) {
                courseIDElement.textContent = courseIDText;
                courseNameElement.textContent = courseNameText;
            }
            // Close the modal in which the button was clicked
            // Assuming Bootstrap 5 is used, as indicated by data-bs-toggle attributes
            const modalElement = courseElement.closest('.modal');
            if (modalElement) {
                var modalInstance = bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        });
    });
});
