
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
        hiddenCourseCountElement.textContent = `X`; // Set text to empty if no courses are hidden
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
function toggleDropdown() {
  const jumpToYearBtn = document.querySelector('#jumpToYearContainer > button');
  const yearMenu = document.querySelector('#jumpToYearContainer > ul');
  const jumpToYearContainer = document.getElementById('jumpToYearContainer');
  // Directly update aria-expanded and toggle visibility
  function toggleMenuVisibility() {
    const isCurrentlyShown = yearMenu.classList.contains('show');
    yearMenu.classList.toggle('show');
    jumpToYearBtn.setAttribute('aria-expanded', (!isCurrentlyShown).toString());
  }
  // Hide the menu when a sub-item is clicked
  yearMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      yearMenu.classList.remove('show');
      jumpToYearBtn.setAttribute('aria-expanded', 'false');
    }
  });
  // Hide the menu when clicking outside of it
  document.addEventListener('click', function(e) {
    if (!jumpToYearContainer.contains(e.target)) {
      yearMenu.classList.remove('show');
      jumpToYearBtn.setAttribute('aria-expanded', 'false');
    }
  }, true);
}
toggleDropdown(); // Ensure to call the function
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
