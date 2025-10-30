/**
 * @file content.js
 * @description H. Emre's IG Downloader (v4.6 - Fixed All Issues)
 */

console.log("--- H. EMRE'S IG DOWNLOADER v4.6 (All Issues Fixed) Started ---");

let globalDownloadButton = null;
let isExtensionEnabled = true;
let currentUrl = window.location.pathname;
let cachedMasterJson = null;

// =================================================================
// 1. MASTER JSON & DATA LOGIC (FIXED)
// =================================================================

/**
 * Finds and parses the single, massive JSON data blob embedded in the page.
 * @returns {Object|null} The parsed JSON data object or null.
 */
function findMasterJson() {
    if (cachedMasterJson) {
        return cachedMasterJson;
    }

    const scripts = document.querySelectorAll('script');
    for (const script of scripts) {
        const scriptText = script.textContent;
        if (scriptText.includes('xdt_api__v1__feed__reels_media') || 
            scriptText.includes('xdt_api__v1__clips__home__connection_v2')) {
            try {
                const data = JSON.parse(scriptText);
                
                // Try multiple possible paths for maximum compatibility
                const pathsToTry = [
                    data.require?.[0]?.[3]?.[0],
                    data.require?.[0]?.[3]?.[1],
                    data.require?.[0]?.[2]?.[0],
                    data.require?.[0]?.[2]?.[1]
                ];
                
                for (const path of pathsToTry) {
                    if (path && path.__bbox) {
                        cachedMasterJson = path;
                        return cachedMasterJson;
                    }
                }
            } catch (e) {
                console.warn("JSON parse error in script:", e);
                continue;
            }
        }
    }
    console.error("CRITICAL: Could not find the Master JSON data script blob.");
    return null;
}

/**
 * Extracts the Reels data from the master JSON blob.
 * @param {Object} masterJson - The parsed JSON from findMasterJson().
 * @returns {Array|null} The array of Reel "edges".
 */
function getReelsEdges(masterJson) {
    try {
        // Multiple possible paths for reels data
        const paths = [
            masterJson.__bbox.require?.[0]?.[3]?.[1]?.__bbox?.result?.data?.xdt_api__v1__clips__home__connection_v2?.edges,
            masterJson.__bbox.require?.[0]?.[3]?.[0]?.__bbox?.result?.data?.xdt_api__v1__clips__home__connection_v2?.edges,
            masterJson.__bbox.require?.[0]?.[2]?.[1]?.__bbox?.result?.data?.xdt_api__v1__clips__home__connection_v2?.edges
        ];
        
        for (const edges of paths) {
            if (edges) return edges;
        }
        return null;
    } catch (e) {
        console.error("Could not extract Reels data from Master JSON.", e);
        return null;
    }
}

/**
 * Extracts the Stories data from the master JSON blob.
 * @param {Object} masterJson - The parsed JSON from findMasterJson().
 * @returns {Array|null} The array of Story "reels_media" nodes.
 */
function getStoriesMedia(masterJson) {
    try {
        // CORRECTED: Stories and Reels are in DIFFERENT paths
        const paths = [
            masterJson.__bbox.require?.[0]?.[3]?.[0]?.__bbox?.result?.data?.xdt_api__v1__feed__reels_media?.reels_media,
            masterJson.__bbox.require?.[0]?.[2]?.[0]?.__bbox?.result?.data?.xdt_api__v1__feed__reels_media?.reels_media,
            masterJson.__bbox.require?.[0]?.[3]?.[1]?.__bbox?.result?.data?.xdt_api__v1__feed__reels_media?.reels_media
        ];
        
        for (const media of paths) {
            if (media) return media;
        }
        return null;
    } catch (e) {
        console.log("Could not extract Stories data from Master JSON (this is normal if not on a story page).");
        return null;
    }
}

// =================================================================
// 2. DOWNLOAD HANDLERS (IMPROVED)
// =================================================================

/**
 * Handles downloading the currently visible Reel.
 */
function handleReelDownload() {
    try {
        console.log("Reel download requested.");
        const activeOverlay = findActiveElement('div[role="presentation"]');
        if (!activeOverlay) { 
            alert("Refresh the Page PLS F5"); 
            return; 
        }

        const audioLinkElement = activeOverlay.querySelector('a[href*="/reels/audio/"]');
        if (!audioLinkElement) { 
            alert("Videonun ses ID'si bulunamadı. Farklı bir reel deneyin."); 
            return; 
        }

        const audioId = audioLinkElement.href.split('/').filter(Boolean).pop();
        if (!audioId) { 
            alert("Ses ID'si ayrıştırılamadı."); 
            return; 
        }

        const masterJson = findMasterJson();
        if (!masterJson) { 
            alert("Refresh the Page PLS F5"); 
            return; 
        }

        const allReelsData = getReelsEdges(masterJson);
        if (!allReelsData) { 
            alert("Refresh the Page PLS F5"); 
            return; 
        }

        const videoNode = allReelsData.find(edge => {
            const media = edge.node.media;
            if (!media || !media.clips_metadata) return false;
            
            const musicInfo = media.clips_metadata.music_info?.music_asset_info?.audio_cluster_id;
            const originalInfo = media.clips_metadata.original_sound_info?.audio_asset_id;
            
            return musicInfo === audioId || originalInfo === audioId;
        });

        if (!videoNode) { 
            alert(`Video not found (Audio ID: ${audioId}). Refresh the Page PLS F5`); 
            return; 
        }

        const reelCode = videoNode.node.media.code;
        const videoUrl = videoNode.node.media.video_versions[0].url;
        const correctedUrl = videoUrl.replace(/\\u0026/g, '&');
        const filename = `reel_${reelCode}.mp4`;
        
        sendDownloadRequest(correctedUrl, filename);
    } catch (error) {
        console.error("Reel download error:", error);
        alert("Error: " + error.message);
    }
}

/**
 * Handles downloading the media from a Post page.
 */
function handlePostDownload() {
    try {
        console.log("Post download requested.");
        let mediaUrl = null;
        let fileExtension = 'jpg';
        
        // Multiple selectors for better compatibility
        const selectors = [
            'article video',
            'main article video',
            'video[style*="object-fit"]',
            'div[role="main"] video'
        ];

        for (const selector of selectors) {
            const videoElement = document.querySelector(selector);
            if (videoElement && videoElement.src) {
                mediaUrl = videoElement.src;
                fileExtension = 'mp4';
                break;
            }
        }

        if (!mediaUrl) {
            // Look for images
            const imgSelectors = [
                'article img[style*="object-fit"]',
                'main article img',
                'div[role="main"] img',
                'img[data-testid="user-avatar"]'
            ];

            for (const selector of imgSelectors) {
                const imgElement = document.querySelector(selector);
                if (imgElement && imgElement.src && !imgElement.src.includes('data:image')) {
                    mediaUrl = imgElement.src;
                    fileExtension = 'jpg';
                    break;
                }
            }
        }

        if (mediaUrl) {
            const postCode = window.location.pathname.split('/')[2] || 'instagram_post';
            const filename = `post_${postCode}.${fileExtension}`;
            sendDownloadRequest(mediaUrl, filename);
        } else {
            alert("Bu gönderide indirilecek bir medya (video/fotoğraf) bulunamadı. Bu bir galeri (carousel) olabilir, henüz desteklenmiyor.");
        }
    } catch (error) {
        console.error("Post download error:", error);
        alert("Gönderi indirme sırasında bir hata oluştu: " + error.message);
    }
}

/**
 * Handles downloading the currently visible Story. (FIXED)
 */
function handleStoryDownload() {
    try {
        console.log("Story download requested.");

        const masterJson = findMasterJson();
        if (!masterJson) { 
            alert("Refresh the Page PLS F5"); 
            return; 
        }

        const allStoriesData = getStoriesMedia(masterJson);
        if (!allStoriesData) {
            alert("Refresh the Page PLS F5");
            return;
        }

        const urlParts = window.location.pathname.split('/').filter(Boolean);
        let storyItem = null;
        let username = null;
        let mediaPk = null;

        if (urlParts.length === 2 && urlParts[0] === 'stories') {
            username = urlParts[1];
            mediaPk = "first_story";
            console.log(`Looking for FIRST story from user: ${username}`);
            
            const userStoryTray = allStoriesData.find(reel => 
                reel.user && reel.user.username === username
            );
            
            if (userStoryTray && userStoryTray.items && userStoryTray.items.length > 0) {
                storyItem = userStoryTray.items[0];
            }
        } else if (urlParts.length >= 3 && urlParts[0] === 'stories') {
            username = urlParts[1];
            mediaPk = urlParts[2];
            console.log(`Looking for story PK: ${mediaPk} from user: ${username}`);
            
            const userStoryTray = allStoriesData.find(reel => 
                reel.user && reel.user.username === username
            );
            
            if (userStoryTray && userStoryTray.items) {
                storyItem = userStoryTray.items.find(item => item.pk === mediaPk);
            }
        } else {
            alert("Refresh the Page PLS F5 (Format: /stories/username/...)");
            return;
        }

        if (!storyItem) {
            alert(`Refresh the Page PLS F5 (Kullanıcı: ${username}, ID: ${mediaPk})`);
            return;
        }

        let mediaUrl = null;
        let fileExtension = 'jpg';

        if (storyItem.video_versions && storyItem.video_versions.length > 0) {
            mediaUrl = storyItem.video_versions[0].url;
            fileExtension = 'mp4';
            console.log("Story video found in JSON!");
        } else if (storyItem.image_versions2 && storyItem.image_versions2.candidates.length > 0) {
            // Get the highest quality image
            const candidates = storyItem.image_versions2.candidates;
            mediaUrl = candidates.reduce((best, current) => 
                (best.width * best.height) > (current.width * current.height) ? best : current
            ).url;
            fileExtension = 'jpg';
            console.log("Story image found in JSON!");
        }

        if (mediaUrl) {
            const filename = `story_${username}_${storyItem.pk}.${fileExtension}`;
            sendDownloadRequest(mediaUrl, filename);
        } else {
            alert("Refresh the Page PLS F5");
        }
    } catch (error) {
        console.error("Story download error:", error);
        alert("Hikaye indirme sırasında bir hata oluştu: " + error.message);
    }
}

/**
 * Finds the currently active element based on a selector.
 */
function findActiveElement(selector) {
    try {
        const allElements = document.querySelectorAll(selector);
        const viewportCenterY = window.innerHeight / 2;
        
        for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.top < viewportCenterY && rect.bottom > viewportCenterY) {
                return el;
            }
        }
        return null;
    } catch (error) {
        console.error("Error finding active element:", error);
        return null;
    }
}

/**
 * Sends the final download request to the background script.
 */
function sendDownloadRequest(url, filename) {
    try {
        console.log(`Sending download request for: ${filename}`);
        chrome.runtime.sendMessage({
            action: "download",
            url: url,
            filename: filename
        });
    } catch (error) {
        console.error("Error sending download request:", error);
        alert("İndirme işlemi sırasında hata: " + error.message);
    }
}

// =================================================================
// 4. BUTTON & URL MANAGEMENT (Position Fixed)
// =================================================================

function handleGlobalDownloadClick() {
  currentUrl = window.location.pathname; 
  if (currentUrl.startsWith('/reels/')) {
    handleReelDownload();
  } else if (currentUrl.startsWith('/p/')) {
    handlePostDownload();
  } else if (currentUrl.startsWith('/stories/')) {
    handleStoryDownload();
  }
}

/**
 * Shows/hides and POSITIONS the global button based on URL and state.
 */
function updateButtonVisibility() {
  currentUrl = window.location.pathname;
  if (!globalDownloadButton) return;

  const isReels = currentUrl.startsWith('/reels/');
  const isPost = currentUrl.startsWith('/p/');
  const isStory = currentUrl.startsWith('/stories/');

  if (isExtensionEnabled && (isReels || isPost || isStory)) {
    globalDownloadButton.style.display = 'block';
    globalDownloadButton.style.right = '20px'; // Sağdan 20px
    
    if (isReels) {
      globalDownloadButton.innerText = 'Download Reel';
      globalDownloadButton.style.top = '30px'; // 20px'ten 30px'e
    } else if (isPost) {
      globalDownloadButton.innerText = 'Download Post';
      globalDownloadButton.style.top = '80px'; // 70px'ten 80px'e
    } else if (isStory) {
      globalDownloadButton.innerText = 'Download Story';
      globalDownloadButton.style.top = '60px'; // 20px'ten 30px'e
    }
    
  } else {
    // Diğer tüm sayfalarda (Ana sayfa vs.) gizle
    globalDownloadButton.style.display = 'none';
  }
}

function injectGlobalButton() {
  if (document.getElementById('he-global-download-button')) return;
  globalDownloadButton = document.createElement('button');
  globalDownloadButton.id = 'he-global-download-button';
  globalDownloadButton.addEventListener('click', handleGlobalDownloadClick, true);
  document.body.appendChild(globalDownloadButton);
  console.log("Global download button (v4.7) injected.");
  updateButtonVisibility();
}

// =================================================================
// 4. IMPROVED EVENT HANDLING
// =================================================================

function handleUrlChange() {
    cachedMasterJson = null; // Clear cache on URL change
    setTimeout(updateButtonVisibility, 500);
}

// Initialize
chrome.storage.sync.get(['isExtensionEnabled'], (result) => {
    isExtensionEnabled = result.isExtensionEnabled ?? true;
    injectGlobalButton();
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.isExtensionEnabled) {
        isExtensionEnabled = changes.isExtensionEnabled.newValue;
        updateButtonVisibility();
    }
});

// Modern URL change detection
if (typeof Navigation !== 'undefined' && window.navigation) {
    window.navigation.addEventListener('navigatesuccess', handleUrlChange);
} else {
    // Fallback for older browsers
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            handleUrlChange();
        }
    }).observe(document, { subtree: true, childList: true });
}

// Also listen for history changes
window.addEventListener('popstate', handleUrlChange);