# 🔧 Git Setup & Repository Push Guide

## 📋 Prerequisites

You'll need to install Git first since it's not currently available on your system.

### Step 1: Install Git

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Download the latest version
   - Run the installer with default settings

2. **Verify Installation:**
   ```bash
   git --version
   ```

### Step 2: Configure Git (First Time Setup)

```bash
# Set your name and email (use your actual details)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Optional: Set default branch name to 'main'
git config --global init.defaultBranch main
```

## 🚀 Push to Repository

### Option A: Create New GitHub Repository

1. **Go to GitHub.com**
   - Login to your account
   - Click "New" or "+" → "New repository"
   - Name it: `tab-mind-extension`
   - Description: `AI-powered Chrome extension for intelligent tab organization`
   - Make it **Public** (so others can test)
   - Don't initialize with README (we already have files)

2. **Initialize Local Repository:**
   ```bash
   cd "c:\Users\kjay\Desktop\google chrome\tab-mind-extension"
   git init
   git add .
   git commit -m "Initial commit: Tab Mind AI Tab Organizer Chrome Extension"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/tab-mind-extension.git
   git push -u origin main
   ```

### Option B: Use Existing Repository

If you already have a repository:

```bash
cd "c:\Users\kjay\Desktop\google chrome\tab-mind-extension"
git init
git add .
git commit -m "Add Tab Mind Chrome Extension with custom thumbnails"
git remote add origin YOUR_REPO_URL
git push -u origin main
```

## 📁 Repository Structure

Your repository will include:

```
tab-mind-extension/
├── .gitignore                  # Git ignore rules
├── README.md                   # Main documentation
├── QUICK-START.md             # Installation guide
├── TESTING-GUIDE.md           # Testing instructions
├── THUMBNAILS-FEATURE.md      # Thumbnail feature docs
├── manifest.json              # Extension manifest
├── background.js              # Background service worker
├── popup/
│   ├── popup.html            # Popup interface
│   └── popup.js              # Popup functionality
├── icons/                    # Extension icons
├── thumbnail-generator.js    # Custom thumbnail system
├── search-engine.js         # Advanced search
├── settings.js              # Settings management
├── suspended.html           # Suspended tab page
├── test-links.html          # Testing page
├── serve-test-page.js       # Web server
└── package.json             # Node.js config
```

## 🌐 GitHub Features You'll Get

### 1. **Public Demo URL**
Once pushed, your test page will be available at:
```
https://YOUR_USERNAME.github.io/tab-mind-extension/test-links.html
```

### 2. **Release Packages**
Create releases with .zip downloads:
- Go to repository → Releases → Create new release
- Upload packaged extension files
- Users can download and install easily

### 3. **Issue Tracking**
Users can report bugs and request features

### 4. **Collaboration**
Others can contribute improvements

## 🎯 After Pushing

### Enable GitHub Pages (for public demo):

1. Go to repository → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: "main" / "root"
4. Save

Your test page will be live at:
`https://YOUR_USERNAME.github.io/tab-mind-extension/test-links.html`

### Create a Release:

1. Go to repository → Releases → Create new release
2. Tag: `v1.0.0`
3. Title: `Tab Mind v1.0.0 - AI Tab Organizer`
4. Description:
   ```markdown
   ## 🎉 Tab Mind - AI Tab Organizer v1.0.0

   First release of the Tab Mind Chrome extension with:

   ✅ AI-powered tab categorization
   ✅ Custom site thumbnails
   ✅ Smart tab suspension
   ✅ Session save/restore
   ✅ Advanced search functionality
   ✅ Modern popup interface

   ### 📥 Installation:
   1. Download the source code
   2. Extract to a folder
   3. Open Chrome → Extensions → Load unpacked
   4. Select the extracted folder

   ### 🧪 Test the features:
   Visit our [testing page](https://YOUR_USERNAME.github.io/tab-mind-extension/test-links.html)
   ```

## 🔧 Quick Commands Reference

```bash
# Check status
git status

# Add new/modified files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

## 🚨 Important Notes

1. **Extension Security**: Don't commit private keys or sensitive data
2. **File Size**: GitHub has 100MB file limit (your extension is well under this)
3. **Public Repository**: Anyone can see your code (good for open source!)
4. **Updates**: Push updates with descriptive commit messages

## 📞 Need Help?

If you encounter any issues:
1. Check that Git is properly installed
2. Verify your GitHub credentials
3. Make sure you're in the correct directory
4. Check that the repository URL is correct

---

**Ready to push? Install Git first, then follow the commands above!** 🚀