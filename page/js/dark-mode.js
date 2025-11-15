// =========================
// DARK MODE FUNCTIONALITY
// =========================

(function() {
  'use strict';

  // Get theme from localStorage or default to light
  function getTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  // Set theme
  function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcon(theme);
  }

  // Update toggle icon based on theme
  function updateToggleIcon(theme) {
    const toggleIcon = document.querySelector('.dark-mode-icon');
    if (toggleIcon) {
      toggleIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // Initialize theme on page load
  function initTheme() {
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
    // Update icon after a short delay to ensure DOM is ready
    setTimeout(() => updateToggleIcon(theme), 0);
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Initialize immediately to prevent flash
  initTheme();

  // Add click event listener to toggle button when DOM is ready
  function setupToggleButton() {
    const toggleButton = document.getElementById('darkModeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
      // Update icon once button is found
      const theme = getTheme();
      updateToggleIcon(theme);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggleButton);
  } else {
    setupToggleButton();
  }

  // Export for use in other scripts if needed
  window.darkMode = {
    toggle: toggleTheme,
    set: setTheme,
    get: getTheme
  };
})();

