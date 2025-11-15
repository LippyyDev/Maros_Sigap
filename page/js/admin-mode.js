// =========================
// ADMIN MODE FUNCTIONALITY
// =========================

(function() {
  'use strict';

  // Get admin mode from localStorage or default to false
  function getAdminMode() {
    const saved = localStorage.getItem('adminMode');
    return saved === 'true';
  }

  // Set admin mode
  function setAdminMode(enabled) {
    localStorage.setItem('adminMode', enabled.toString());
    document.documentElement.setAttribute('data-admin-mode', enabled ? 'on' : 'off');
    updateToggleButton(enabled);
    // Dispatch custom event for other scripts
    window.dispatchEvent(new CustomEvent('adminModeChanged', { detail: { enabled } }));
  }

  // Update toggle button appearance
  function updateToggleButton(enabled) {
    const toggleButton = document.getElementById('adminModeToggle');
    const toggleText = document.querySelector('.admin-mode-text');
    if (toggleButton && toggleText) {
      toggleText.textContent = enabled ? 'ON' : 'OFF';
      toggleButton.classList.toggle('active', enabled);
    }
  }

  // Toggle admin mode
  function toggleAdminMode() {
    const currentMode = getAdminMode();
    const newMode = !currentMode;
    setAdminMode(newMode);
  }

  // Initialize admin mode on page load
  function initAdminMode() {
    const adminMode = getAdminMode();
    setAdminMode(adminMode);
  }

  // Initialize immediately to prevent flash
  initAdminMode();

  // Add click event listener to toggle button when DOM is ready
  function setupToggleButton() {
    const toggleButton = document.getElementById('adminModeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleAdminMode);
      const adminMode = getAdminMode();
      updateToggleButton(adminMode);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupToggleButton);
  } else {
    setupToggleButton();
  }

  // Export for use in other scripts
  window.adminMode = {
    toggle: toggleAdminMode,
    set: setAdminMode,
    get: getAdminMode,
    isEnabled: getAdminMode
  };
})();

