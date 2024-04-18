
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
function toggleCoursesVisibility() {
  // Get the state of the master toggle
  const isHidden = document.getElementById('toggleCourseVisibility').checked;

  // Get the label element
  const toggleLabel = document.getElementById('toggleLabel');

  // Update the label text based on the toggle state
  if (isHidden) {
    toggleLabel.textContent = "Show Completed ";
  } else {
    toggleLabel.textContent = "Hide Completed ";
  }

  // Get all course items
  const courses = document.querySelectorAll('.course');
  let hiddenCount = 0; // Initialize a counter for hidden courses as 0
  courses.forEach(course => {
    // For each course, check if its checkbox is checked
    if (course.querySelector('input[type="checkbox"]').checked) {
      // Toggle 'hidden' class based on the master toggle's state
      if (isHidden) {
        course.classList.add('hidden');
        hiddenCount++; // Increment the hidden counter
      } else {
        course.classList.remove('hidden');
      }
    } else {
      // Ensure course is visible if its checkbox is not checked
      course.classList.remove('hidden');
    }
  });
  // Update the hidden course count in the span
  const hiddenCourseCountElement = document.getElementById('hiddenCourseCount');
  if (hiddenCount > 0) {
    hiddenCourseCountElement.textContent = ` (${hiddenCount})`;
  } else {
    hiddenCourseCountElement.textContent = ''; // Set text to empty if no courses are hidden
  }
}
// Attach the visibility toggle function to changes on the master toggle and each course checkbox
document.getElementById('toggleCourseVisibility').addEventListener('change', toggleCoursesVisibility);
document.querySelectorAll('.course input[type="checkbox"]').forEach(courseCheckbox => {
  courseCheckbox.addEventListener('change', toggleCoursesVisibility);
});
// JUMP TO YEAR MENU
function toggleDropdown() {
  const jumpToYearBtn = document.querySelector('#jumpToYearContainer > button');
  const yearMenu = document.querySelector('#jumpToYearContainer > ul');
  // Function to set aria-expanded attribute based on visibility of the menu
function updateAriaExpanded() {
  // Check if the menu is currently shown
  const isShown = yearMenu.classList.contains('show');
  // Set aria-expanded attribute based on menu visibility
  jumpToYearBtn.setAttribute('aria-expanded', isShown.toString());
}
// Toggle menu visibility and aria-expanded on button click
jumpToYearBtn.onclick = function() {
  yearMenu.classList.toggle('show');
  // Delay the update of aria-expanded to ensure class changes have taken effect
  setTimeout(() => {
    updateAriaExpanded();
  }, 0);
};
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
}
// NAVIGATION STICKY SHADOW
window.addEventListener('scroll', function() {
  var stickyElement = document.getElementById('pathwaynav');
  var stickyRect = stickyElement.getBoundingClientRect();
  var stickyActivateHeight = stickyElement.offsetTop; // Height at which sticky is activated
  // Check if the sticky element has moved from its original position
  if (stickyRect.top <= 0) {
    stickyElement.classList.add('sticky-shadow');
  } else {
    stickyElement.classList.remove('sticky-shadow');
  }
});
