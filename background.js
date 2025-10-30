/**
 * Listens for a 'download' message from the content script.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download") {
    console.log(`Download request received for: ${request.filename}`);
    
    // Use the chrome.downloads API to trigger a download
    chrome.downloads.download({
      url: request.url,
      filename: request.filename 
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed:", chrome.runtime.lastError.message);
      } else {
        console.log("Download started with ID:", downloadId);
      }
    });
    
    // Return true to indicate you will send an asynchronous response.
    return true; 
  }
});