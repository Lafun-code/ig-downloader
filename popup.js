/**
 * @file popup.js
 * @description Handles the logic for the extension's popup window.
 * It manages the toggle switch and saves its state to chrome.storage.
 */

// Wait for the popup's HTML to fully load
document.addEventListener('DOMContentLoaded', () => {
  
  // Get the elements from the popup
  const toggleSwitch = document.getElementById('toggleSwitch');
  const statusText = document.getElementById('statusText');
  const statusIndicator = document.getElementById('statusIndicator');

  // Function to update the popup's UI based on the state
  function updatePopupUI(isEnabled) {
    toggleSwitch.checked = isEnabled;
    if (isEnabled) {
      statusText.textContent = "Active"; // "Aktif" -> "Active"
      statusText.classList.add('active');
      statusIndicator.classList.add('active');
    } else {
      statusText.textContent = "Disabled"; // "Kapalı" -> "Disabled"
      statusText.classList.remove('active');
      statusIndicator.classList.remove('active');
    }
  }

  // 1. On Popup Load: Get the current state from storage
  chrome.storage.sync.get(['isExtensionEnabled'], (result) => {
    // Default to 'true' (enabled) if it's the first time
    const isEnabled = result.isExtensionEnabled ?? true; 
    updatePopupUI(isEnabled);
  });

  // 2. On Toggle Change: Save the new state to storage
  toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({ isExtensionEnabled: isEnabled }, () => {
      // After saving, update the UI immediately
      updatePopupUI(isEnabled);
      console.log(`Extension state set to: ${isEnabled}`);
    });
  });
});