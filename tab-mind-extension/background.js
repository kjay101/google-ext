// Tab Mind Background Service Worker
class TabMindBackground {
    constructor() {
        this.suspendedTabs = new Set();
        this.essentialDomains = new Set([
            'music.youtube.com',
            'meet.google.com',
            'zoom.us',
            'teams.microsoft.com',
            'spotify.com',
            'discord.com'
        ]);
        this.init();
    }

    init() {
        chrome.runtime.onInstalled.addListener(() => {
            console.log('Tab Mind Extension installed');
            this.initializeStorage();
        });

        chrome.tabs.onCreated.addListener((tab) => {
            this.categorizeTab(tab);
        });

        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.categorizeTab(tab);
                this.checkForSuspension(tab);
            }
        });

        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.handleTabActivation(activeInfo.tabId);
        });

        // Listen for messages from popup
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async response
        });
    }

    async initializeStorage() {
        const defaultSettings = {
            autoSuspend: true,
            suspendDelay: 30, // minutes
            categories: {},
            sessions: []
        };

        const stored = await chrome.storage.local.get(['settings']);
        if (!stored.settings) {
            await chrome.storage.local.set({ settings: defaultSettings });
        }
    }

    categorizeTab(tab) {
        if (!tab.url || tab.url.startsWith('chrome://')) return;

        const category = this.determineCategory(tab.url, tab.title);
        this.updateTabCategory(tab.id, category);
    }

    determineCategory(url, title) {
        const domain = new URL(url).hostname.toLowerCase();
        const urlLower = url.toLowerCase();
        const titleLower = (title || '').toLowerCase();

        // Work-related patterns
        if (this.isWorkRelated(domain, urlLower, titleLower)) {
            return 'Work';
        }

        // Social media patterns
        if (this.isSocialMedia(domain)) {
            return 'Social';
        }

        // Entertainment patterns
        if (this.isEntertainment(domain, urlLower)) {
            return 'Entertainment';
        }

        // Research/Education patterns
        if (this.isResearch(domain, urlLower, titleLower)) {
            return 'Research';
        }

        // Shopping patterns
        if (this.isShopping(domain, urlLower)) {
            return 'Shopping';
        }

        return 'General';
    }

    isWorkRelated(domain, url, title) {
        const workDomains = [
            'gmail.com', 'outlook.com', 'slack.com', 'teams.microsoft.com',
            'zoom.us', 'meet.google.com', 'notion.so', 'monday.com',
            'asana.com', 'trello.com', 'github.com', 'gitlab.com',
            'docs.google.com', 'office.com', 'sharepoint.com'
        ];

        const workKeywords = ['meeting', 'calendar', 'email', 'project', 'dashboard', 'admin', 'jira'];

        return workDomains.some(d => domain.includes(d)) ||
               workKeywords.some(k => title.includes(k) || url.includes(k));
    }

    isSocialMedia(domain) {
        const socialDomains = [
            'facebook.com', 'twitter.com', 'x.com', 'instagram.com',
            'linkedin.com', 'reddit.com', 'discord.com', 'telegram.org',
            'whatsapp.com', 'snapchat.com', 'tiktok.com'
        ];

        return socialDomains.some(d => domain.includes(d));
    }

    isEntertainment(domain, url) {
        const entertainmentDomains = [
            'youtube.com', 'netflix.com', 'spotify.com', 'twitch.tv',
            'hulu.com', 'disney.com', 'primevideo.com', 'hbomax.com',
            'music.apple.com', 'soundcloud.com', 'gaming.com'
        ];

        return entertainmentDomains.some(d => domain.includes(d)) ||
               url.includes('video') || url.includes('music') || url.includes('game');
    }

    isResearch(domain, url, title) {
        const researchDomains = [
            'wikipedia.org', 'scholar.google.com', 'arxiv.org',
            'stackoverflow.com', 'stackexchange.com', 'quora.com',
            'medium.com', 'dev.to', 'coursera.org', 'udemy.com',
            'khanacademy.org', 'edx.org'
        ];

        const researchKeywords = ['tutorial', 'documentation', 'docs', 'api', 'reference', 'guide', 'learn'];

        return researchDomains.some(d => domain.includes(d)) ||
               researchKeywords.some(k => title.includes(k) || url.includes(k));
    }

    isShopping(domain, url) {
        const shoppingDomains = [
            'amazon.com', 'ebay.com', 'walmart.com', 'target.com',
            'bestbuy.com', 'shop', 'store', 'buy', 'cart', 'checkout'
        ];

        return shoppingDomains.some(d => domain.includes(d)) ||
               url.includes('shop') || url.includes('buy') || url.includes('cart');
    }

    async updateTabCategory(tabId, category) {
        const categories = await this.getCategories();
        if (!categories[category]) {
            categories[category] = [];
        }

        // Remove tab from other categories
        Object.keys(categories).forEach(cat => {
            categories[cat] = categories[cat].filter(id => id !== tabId);
        });

        // Add to new category
        if (!categories[category].includes(tabId)) {
            categories[category].push(tabId);
        }

        await this.saveCategories(categories);
    }

    async getCategories() {
        const result = await chrome.storage.local.get(['settings']);
        return result.settings?.categories || {};
    }

    async saveCategories(categories) {
        const settings = await chrome.storage.local.get(['settings']);
        const updatedSettings = { ...settings.settings, categories };
        await chrome.storage.local.set({ settings: updatedSettings });
    }

    async checkForSuspension(tab) {
        if (!tab.url || tab.url.startsWith('chrome://') || tab.active) return;

        const domain = new URL(tab.url).hostname;
        if (this.essentialDomains.has(domain)) return;

        const settings = await chrome.storage.local.get(['settings']);
        if (!settings.settings?.autoSuspend) return;

        const delay = (settings.settings.suspendDelay || 30) * 60 * 1000; // Convert to milliseconds

        setTimeout(() => {
            this.suspendTab(tab.id);
        }, delay);
    }

    async suspendTab(tabId) {
        try {
            const tab = await chrome.tabs.get(tabId);
            if (tab.active || this.suspendedTabs.has(tabId)) return;

            // Store tab data before suspending
            const tabData = {
                id: tabId,
                url: tab.url,
                title: tab.title,
                favIconUrl: tab.favIconUrl
            };

            await chrome.storage.local.set({ [`suspended_${tabId}`]: tabData });
            this.suspendedTabs.add(tabId);

            // Replace tab with suspended page
            await chrome.tabs.update(tabId, {
                url: chrome.runtime.getURL('suspended.html') + `?id=${tabId}`
            });

        } catch (error) {
            console.log('Tab already closed or unavailable:', error);
        }
    }

    async handleTabActivation(tabId) {
        if (this.suspendedTabs.has(tabId)) {
            await this.restoreTab(tabId);
        }
    }

    async restoreTab(tabId) {
        const tabData = await chrome.storage.local.get([`suspended_${tabId}`]);
        const data = tabData[`suspended_${tabId}`];

        if (data) {
            await chrome.tabs.update(tabId, { url: data.url });
            await chrome.storage.local.remove([`suspended_${tabId}`]);
            this.suspendedTabs.delete(tabId);
        }
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'getTabs':
                    const tabs = await this.getAllCategorizedTabs();
                    sendResponse({ success: true, data: tabs });
                    break;

                case 'saveSession':
                    await this.saveCurrentSession(request.name);
                    sendResponse({ success: true });
                    break;

                case 'restoreSession':
                    await this.restoreSession(request.sessionId);
                    sendResponse({ success: true });
                    break;

                case 'searchTabs':
                    const searchResults = await this.searchTabs(request.query);
                    sendResponse({ success: true, data: searchResults });
                    break;

                case 'suspendTab':
                    await this.suspendTab(request.tabId);
                    sendResponse({ success: true });
                    break;

                case 'closeTab':
                    await chrome.tabs.remove(request.tabId);
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }

    async getAllCategorizedTabs() {
        const tabs = await chrome.tabs.query({});
        const categories = await this.getCategories();
        const result = {};

        // Initialize categories
        ['Work', 'Social', 'Research', 'Entertainment', 'Shopping', 'General'].forEach(cat => {
            result[cat] = [];
        });

        tabs.forEach(tab => {
            if (tab.url && !tab.url.startsWith('chrome://')) {
                let category = 'General';
                
                // Find which category this tab belongs to
                Object.keys(categories).forEach(cat => {
                    if (categories[cat].includes(tab.id)) {
                        category = cat;
                    }
                });

                // If not categorized yet, categorize now
                if (category === 'General') {
                    category = this.determineCategory(tab.url, tab.title);
                    this.updateTabCategory(tab.id, category);
                }

                result[category].push({
                    id: tab.id,
                    title: tab.title,
                    url: tab.url,
                    favIconUrl: tab.favIconUrl,
                    active: tab.active,
                    suspended: this.suspendedTabs.has(tab.id)
                });
            }
        });

        return result;
    }

    async saveCurrentSession(name) {
        const tabs = await chrome.tabs.query({});
        const sessionData = {
            id: Date.now().toString(),
            name: name || `Session ${new Date().toLocaleString()}`,
            timestamp: Date.now(),
            tabs: tabs.filter(tab => !tab.url.startsWith('chrome://')).map(tab => ({
                url: tab.url,
                title: tab.title,
                favIconUrl: tab.favIconUrl
            }))
        };

        const sessions = await this.getSessions();
        sessions.push(sessionData);
        
        const settings = await chrome.storage.local.get(['settings']);
        const updatedSettings = { ...settings.settings, sessions };
        await chrome.storage.local.set({ settings: updatedSettings });
    }

    async getSessions() {
        const result = await chrome.storage.local.get(['settings']);
        return result.settings?.sessions || [];
    }

    async restoreSession(sessionId) {
        const sessions = await this.getSessions();
        const session = sessions.find(s => s.id === sessionId);
        
        if (session) {
            for (const tab of session.tabs) {
                await chrome.tabs.create({ url: tab.url, active: false });
            }
        }
    }

    async searchTabs(query) {
        const tabs = await chrome.tabs.query({});
        const queryLower = query.toLowerCase();
        
        return tabs.filter(tab => 
            tab.title?.toLowerCase().includes(queryLower) ||
            tab.url?.toLowerCase().includes(queryLower)
        ).map(tab => ({
            id: tab.id,
            title: tab.title,
            url: tab.url,
            favIconUrl: tab.favIconUrl,
            active: tab.active
        }));
    }
}

// Initialize the background service
new TabMindBackground();