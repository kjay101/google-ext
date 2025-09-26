// Settings and Configuration Management
class TabMindSettings {
    constructor() {
        this.defaultSettings = {
            autoSuspend: true,
            suspendDelay: 30, // minutes
            essentialDomains: [
                'music.youtube.com',
                'meet.google.com',
                'zoom.us',
                'teams.microsoft.com',
                'spotify.com',
                'discord.com'
            ],
            categories: {},
            sessions: [],
            theme: 'light',
            notifications: true,
            searchHistory: []
        };
    }

    async getSettings() {
        const result = await chrome.storage.local.get(['settings']);
        return { ...this.defaultSettings, ...result.settings };
    }

    async updateSettings(newSettings) {
        const currentSettings = await this.getSettings();
        const updatedSettings = { ...currentSettings, ...newSettings };
        await chrome.storage.local.set({ settings: updatedSettings });
        return updatedSettings;
    }

    async resetSettings() {
        await chrome.storage.local.set({ settings: this.defaultSettings });
        return this.defaultSettings;
    }

    async addEssentialDomain(domain) {
        const settings = await this.getSettings();
        if (!settings.essentialDomains.includes(domain)) {
            settings.essentialDomains.push(domain);
            await this.updateSettings(settings);
        }
    }

    async removeEssentialDomain(domain) {
        const settings = await this.getSettings();
        settings.essentialDomains = settings.essentialDomains.filter(d => d !== domain);
        await this.updateSettings(settings);
    }

    async exportSettings() {
        const settings = await this.getSettings();
        const exportData = {
            settings: settings,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        return JSON.stringify(exportData, null, 2);
    }

    async importSettings(importData) {
        try {
            const data = JSON.parse(importData);
            if (data.settings) {
                await chrome.storage.local.set({ settings: data.settings });
                return true;
            }
        } catch (error) {
            console.error('Failed to import settings:', error);
        }
        return false;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabMindSettings;
}