#!/usr/bin/env node

/**
 * Tab Mind Extension - Testing and Installation Script
 * This script helps test and install the Tab Mind Chrome extension
 */

console.log('🚀 Tab Mind - AI Tab Organizer');
console.log('================================');

// Check if we're in the right directory
const fs = require('fs');
const path = require('path');

function checkFile(filename, description) {
    const exists = fs.existsSync(filename);
    console.log(`${exists ? '✅' : '❌'} ${description}: ${filename}`);
    return exists;
}

function checkDirectory() {
    console.log('\n📁 Checking Extension Files...');
    
    let allFilesPresent = true;
    
    // Essential files
    allFilesPresent &= checkFile('manifest.json', 'Manifest V3 Configuration');
    allFilesPresent &= checkFile('background.js', 'Background Service Worker');
    allFilesPresent &= checkFile('popup/popup.html', 'Popup HTML');
    allFilesPresent &= checkFile('popup/popup.js', 'Popup JavaScript');
    allFilesPresent &= checkFile('suspended.html', 'Suspended Tab Page');
    allFilesPresent &= checkFile('search-engine.js', 'Search Engine');
    allFilesPresent &= checkFile('settings.js', 'Settings Manager');
    
    // Icon files
    console.log('\n🎨 Checking Icon Files...');
    allFilesPresent &= checkFile('icons/icon16.svg', '16px Icon');
    allFilesPresent &= checkFile('icons/icon32.svg', '32px Icon');
    allFilesPresent &= checkFile('icons/icon48.svg', '48px Icon');
    allFilesPresent &= checkFile('icons/icon128.svg', '128px Icon');
    
    return allFilesPresent;
}

function validateManifest() {
    console.log('\n📝 Validating Manifest...');
    
    try {
        const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
        
        console.log(`✅ Extension Name: ${manifest.name}`);
        console.log(`✅ Version: ${manifest.version}`);
        console.log(`✅ Manifest Version: ${manifest.manifest_version}`);
        console.log(`✅ Permissions: ${manifest.permissions.join(', ')}`);
        
        return true;
    } catch (error) {
        console.log(`❌ Manifest validation failed: ${error.message}`);
        return false;
    }
}

function displayInstallationInstructions() {
    console.log('\n🔧 Installation Instructions:');
    console.log('1. Open Chrome browser');
    console.log('2. Navigate to chrome://extensions/');
    console.log('3. Enable "Developer mode" in the top-right corner');
    console.log('4. Click "Load unpacked"');
    console.log('5. Select this folder: tab-mind-extension');
    console.log('6. Pin the extension icon to your toolbar');
    console.log('7. Click the Tab Mind icon to start organizing your tabs!');
}

function displayFeatures() {
    console.log('\n✨ Features Ready:');
    console.log('🤖 AI-powered tab categorization');
    console.log('🔍 Smart search functionality');
    console.log('💾 Session save/restore');
    console.log('⚡ Smart tab suspension');
    console.log('🎨 Modern popup interface');
    console.log('🔒 Privacy-friendly (local processing)');
}

function displayTestingTips() {
    console.log('\n🧪 Testing Tips:');
    console.log('• Open different types of websites to test categorization');
    console.log('• Try searching for tabs using the search bar');
    console.log('• Save a session and restore it');
    console.log('• Let tabs sit idle to test auto-suspension');
    console.log('• Check the developer console for any errors');
}

// Main execution
function main() {
    const filesOk = checkDirectory();
    const manifestOk = validateManifest();
    
    if (filesOk && manifestOk) {
        console.log('\n🎉 Extension is ready for installation!');
        displayFeatures();
        displayInstallationInstructions();
        displayTestingTips();
        
        console.log('\n💡 Tip: Check the Chrome Developer Console for detailed logs');
        console.log('📚 Read README.md for comprehensive documentation');
    } else {
        console.log('\n❌ Some files are missing or invalid. Please check the extension structure.');
    }
}

// Run if this script is executed directly
if (require.main === module) {
    main();
}

module.exports = { checkDirectory, validateManifest };