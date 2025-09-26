# Tab Mind – AI Tab Organizer

A powerful Chrome extension that intelligently organizes, manages, and suspends your browser tabs using AI categorization.

## Features

✨ **AI-Powered Tab Categorization**: Automatically sorts tabs into Work, Social, Research, Entertainment, Shopping, and General categories
🔍 **Smart Search**: Find tabs quickly by title, URL, or domain with real-time search suggestions
💾 **Session Management**: Save and restore complete tab sessions with one click
⚡ **Smart Tab Suspension**: Automatically suspend inactive tabs to save memory while keeping essential services active
🎨 **Clean Modern UI**: Beautiful popup dashboard built with React and Tailwind CSS
🔒 **Privacy-Friendly**: All processing happens locally with minimal permissions

## Installation Instructions

### Method 1: Developer Mode (Recommended for Testing)

1. **Download the Extension**
   - Download or clone this repository to your local machine
   - Extract files to a folder like `tab-mind-extension`

2. **Enable Developer Mode in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" in the top-right corner
   - The page will refresh and show additional options

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `tab-mind-extension` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Tab Mind – AI Tab Organizer" and click the pin icon
   - The Tab Mind icon should now appear in your toolbar

### Method 2: Build and Package

1. **Prepare the Extension**
   ```bash
   cd tab-mind-extension
   # Ensure all files are present:
   # - manifest.json
   # - background.js
   # - popup/ (folder with popup.html, popup.js)
   # - icons/ (folder with icon files)
   # - suspended.html
   # - search-engine.js
   ```

2. **Package the Extension**
   - In Chrome, go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Pack extension"
   - Select the extension root directory
   - Chrome will create a `.crx` file you can install

## Usage Guide

### Getting Started

1. **First Launch**
   - Click the Tab Mind icon in your toolbar
   - The popup will open and automatically categorize your current tabs
   - Categories include: Work, Social, Research, Entertainment, Shopping, General

2. **Tab Management**
   - **Switch to Tab**: Click any tab in the list to switch to it
   - **Suspend Tab**: Click the pause icon to manually suspend a tab
   - **Close Tab**: Click the X icon to close a tab
   - **View Categories**: Expand/collapse categories by clicking the toggle

### Key Features

#### 🏷️ **Automatic Categorization**
- Tabs are automatically sorted based on domain analysis and content detection
- Work: Gmail, Slack, GitHub, Google Docs, Teams, etc.
- Social: Facebook, Twitter, LinkedIn, Reddit, etc.
- Research: Wikipedia, Stack Overflow, documentation sites
- Entertainment: YouTube, Netflix, Spotify, gaming sites
- Shopping: Amazon, eBay, e-commerce sites

#### 🔍 **Search Functionality**
- Type in the search bar to find tabs by title or URL
- Search works across both open tabs and saved sessions
- Recent search suggestions appear as you type

#### 💾 **Session Management**
- **Save Session**: Click "Save Session" to save all current tabs
- **Restore Session**: Click "Restore" next to any saved session
- Sessions include tab titles, URLs, and timestamps

#### ⚡ **Smart Tab Suspension**
- Automatically suspends tabs after 30 minutes of inactivity (configurable)
- Essential services are never suspended:
  - YouTube Music
  - Google Meet
  - Zoom
  - Microsoft Teams
  - Spotify
  - Discord
- Suspended tabs use minimal memory but retain their state
- Click suspended tabs to instantly restore them

### Advanced Usage

#### Keyboard Shortcuts
- **Ctrl+Shift+T**: Open Tab Mind popup (if configured)
- **Click anywhere on suspended page**: Restore the tab

#### Memory Savings
- Each suspended tab saves approximately 50-100MB of RAM
- Suspension status is clearly indicated in the popup
- Tabs resume instantly when accessed

#### Search Tips
- Search by domain: type "youtube" to find all YouTube tabs
- Search by title: type keywords from page titles
- Search history: Previous searches are suggested

## Technical Details

### Architecture
- **Manifest V3**: Uses modern Chrome extension architecture
- **Background Service Worker**: Handles tab monitoring and AI categorization
- **React + Tailwind**: Modern, responsive popup interface
- **Chrome Storage API**: Stores settings and session data locally
- **IndexedDB**: Advanced storage for large datasets (future enhancement)

### Permissions Explained
- `tabs`: Required to access and manage browser tabs
- `storage`: Needed to save settings and sessions locally
- `activeTab`: Allows interaction with the currently active tab
- `background`: Enables the background service worker

### Files Structure
```
tab-mind-extension/
├── manifest.json          # Extension configuration
├── background.js          # Core tab management logic
├── popup/
│   ├── popup.html         # Popup interface
│   └── popup.js           # Popup functionality
├── icons/                 # Extension icons (16, 32, 48, 128px)
├── suspended.html         # Suspended tab replacement page
└── search-engine.js       # Enhanced search functionality
```

## Troubleshooting

### Common Issues

1. **Extension Not Loading**
   - Ensure Developer mode is enabled
   - Check that all required files are present
   - Look for errors in `chrome://extensions/`

2. **Tabs Not Categorizing**
   - Wait a few seconds after opening new tabs
   - Check the popup to see if tabs appear in "General"
   - Refresh the extension in `chrome://extensions/`

3. **Search Not Working**
   - Ensure you have tabs open to search
   - Try searching for simple terms like domain names
   - Check browser console for JavaScript errors

4. **Suspension Issues**
   - Check if auto-suspend is enabled in settings
   - Essential domains are never suspended by design
   - Active tabs are never suspended

### Performance Tips

- **Large Tab Sessions**: For 100+ tabs, categorization may take a few seconds
- **Memory Usage**: The extension itself uses minimal memory (~10-20MB)
- **Background Processing**: Categorization happens automatically without affecting browser performance

### Developer Console
- Open Developer Tools on the popup: Right-click popup → Inspect
- View background script logs: `chrome://extensions/` → Tab Mind → Background page

## Privacy & Security

- **No Data Collection**: All processing happens locally
- **No External APIs**: Tab categorization uses built-in logic (OpenAI integration optional)
- **Minimal Permissions**: Only requests essential Chrome APIs
- **Local Storage**: All data stored locally on your device

## Future Enhancements

- 🎤 **Voice Search**: Search tabs using voice commands
- 🤖 **AI Integration**: Optional OpenAI/Gemini integration for smarter categorization
- 📊 **Analytics**: Tab usage statistics and insights
- 🌙 **Dark Mode**: Theme customization options
- 📱 **Mobile Sync**: Cross-device session synchronization
- 🔧 **Advanced Rules**: Custom categorization rules

## Support

If you encounter any issues:
1. Check this README for troubleshooting steps
2. Look for errors in the Chrome Developer Console
3. Verify all files are correctly placed
4. Try disabling and re-enabling the extension

## License

This project is open source and available under the MIT License.

---

**Tab Mind – AI Tab Organizer** | Making browser tab management intelligent and effortless.