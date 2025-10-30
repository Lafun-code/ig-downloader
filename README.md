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

1. Download the latest release from the [Releases page](https://github.com/yourusername/hemre-ig-downloader/releases)
2. Extract the ZIP file to a folder
3. Open your browser and go to `chrome://extensions/`
4. Enable **"Developer mode"** in the top right
5. Click **"Load unpacked"** and select the extracted folder
6. The extension is now installed and ready to use!

### Firefox

1. Download the XPI file from the [Releases page](https://github.com/yourusername/hemre-ig-downloader/releases)
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select **"Install Add-on From File"**
4. Select the downloaded XPI file
5. The extension is now installed!

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

## 📁 Project Structure
hemre-ig-downloader/
├── manifest.json # Extension manifest
├── content.js # Main content script
├── background.js # Background service worker
├── popup/
│ ├── popup.html # Extension popup
│ ├── popup.js # Popup functionality
│ └── popup.css # Popup styles
└── README.md # This file

## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript
- Modern browser with developer tools

### Building from Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hemre-ig-downloader.git
cd hemre-ig-downloader


## 🔧 Development

### Prerequisites
- Basic knowledge of JavaScript
- Modern browser with developer tools

### Building from Source

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hemre-ig-downloader.git
cd hemre-ig-downloader
