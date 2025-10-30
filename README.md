# H. Emre's IG Downloader

A powerful browser extension that allows you to download Instagram Reels, Stories, and Posts directly from your browser.

![Version](https://img.shields.io/badge/version-4.6-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

- **Download Reels** - Save Instagram Reels with original quality
- **Download Stories** - Download both images and videos from Stories
- **Download Posts** - Save regular Instagram posts (images and videos)
- **One-Click Download** - Simple button interface integrated into Instagram
- **High Quality** - Downloads media in original quality
- **Auto-Detection** - Automatically detects content type and shows relevant download button
- **Safe & Secure** - No data collection, works locally in your browser

## 🚀 Installation

### Chrome/Edge/Brave

1. Extract the ZIP file to a folder
2. Open your browser and go to `chrome://extensions/`
3. Enable **"Developer mode"** in the top right
4. Click **"Load unpacked"** and select the extracted folder
5. The extension is now installed and ready to use!

### Firefox

1. Open Firefox and go to `about:addons`
2. Click the gear icon and select **"Install Add-on From File"**
3. Select the downloaded XPI file
4. The extension is now installed!

## 📖 How to Use

### Downloading Reels
1. Navigate to any Instagram Reel
2. A **"Download Reel"** button will appear in the top-right corner
3. Click the button to download the Reel

### Downloading Stories
1. Open any Instagram Story
2. A **"Download Story"** button will appear in the top-right corner
3. Click the button to download the Story (image or video)

### Downloading Posts
1. Go to any Instagram Post (single image/video)
2. A **"Download Post"** button will appear in the top-right corner
3. Click the button to download the Post

## 🛠️ Technical Details

- **Technology**: Pure JavaScript (ES6+)
- **Browser Support**: Chrome, Firefox, Edge, Brave
- **Manifest Version**: V3 (Chrome), V2 (Firefox)
- **Permissions**: 
  - `activeTab` - Access current Instagram tab
  - `downloads` - Download media files
  - `storage` - Save extension settings

## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript
- Modern browser with developer tools

### 🐛 Troubleshooting
- Common Issues
- Download button not appearing:

- !! Refresh the Instagram page !!

- Ensure you're on a supported page (Reel, Story, or Post)
- Check if the extension is enabled in browser settings
- Downloads not starting:
- Check your browser's download settings
- Ensure no pop-up blockers are interfering
- Verify you have sufficient storage space
- Extension not working:
- Restart your browser
- Reinstall the extension
- Check the browser console for errors (F12)
