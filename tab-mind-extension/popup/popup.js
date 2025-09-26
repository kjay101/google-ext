// Tab Mind Popup Application
class TabMindPopup {
    constructor() {
        this.tabs = {};
        this.sessions = [];
        this.searchQuery = '';
        this.searchResults = [];
        this.searchEngine = null;
        this.voiceSearch = null;
        this.init();
    }

    init() {
        this.initSearchEngine();
        this.initThumbnailGenerator();
        this.loadTabs();
        this.loadSessions();
        this.render();
        this.setupEventListeners();
    }

    initSearchEngine() {
        // Initialize search engine (would load from search-engine.js in real implementation)
        this.searchEngine = {
            performSearch: async (query) => {
                try {
                    const response = await this.sendMessage({ action: 'searchTabs', query });
                    return response.success ? response.data : [];
                } catch (error) {
                    console.error('Search failed:', error);
                    return [];
                }
            }
        };
    }

    initThumbnailGenerator() {
        // Initialize thumbnail generator for custom site icons
        this.thumbnailGenerator = new SiteThumbnailGenerator();
    }

    async loadTabs() {
        try {
            const response = await this.sendMessage({ action: 'getTabs' });
            if (response.success) {
                this.tabs = response.data;
                this.render();
            }
        } catch (error) {
            console.error('Failed to load tabs:', error);
        }
    }

    async loadSessions() {
        try {
            const result = await chrome.storage.local.get(['settings']);
            this.sessions = result.settings?.sessions || [];
            this.render();
        } catch (error) {
            console.error('Failed to load sessions:', error);
        }
    }

    sendMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, resolve);
        });
    }

    render() {
        const root = document.getElementById('popup-root');
        root.innerHTML = this.getHTML();
    }

    getHTML() {
        return `
            <div class="min-h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                <!-- Header -->
                <div class="bg-white shadow-sm border-b border-gray-200 p-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <h1 class="text-lg font-semibold text-gray-900">Tab Mind</h1>
                        </div>
                        <div class="flex space-x-2">
                            <button id="save-session-btn" class="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                                Save Session
                            </button>
                            <button id="refresh-btn" class="px-3 py-1 bg-gray-500 text-white text-sm rounded-md hover:bg-gray-600 transition-colors">
                                Refresh
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="p-4 bg-white border-b border-gray-200">
                    <div class="relative">
                        <input 
                            type="text" 
                            id="search-input"
                            placeholder="Search tabs by title or URL..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value="${this.searchQuery}"
                        >
                        <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
                        </svg>
                    </div>
                </div>

                <!-- Main Content -->
                <div class="flex-1 overflow-y-auto">
                    ${this.searchQuery ? this.renderSearchResults() : this.renderCategories()}
                </div>

                <!-- Sessions Panel -->
                ${this.sessions.length > 0 ? this.renderSessions() : ''}
            </div>
        `;
    }

    renderCategories() {
        const categories = Object.keys(this.tabs);
        if (categories.length === 0) {
            return `
                <div class="p-8 text-center text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p class="mt-2">No tabs found. Open some tabs to see them organized!</p>
                </div>
            `;
        }

        return categories.map(category => {
            const categoryTabs = this.tabs[category] || [];
            if (categoryTabs.length === 0) return '';

            const categoryColors = {
                'Work': 'bg-blue-100 text-blue-800 border-blue-200',
                'Social': 'bg-pink-100 text-pink-800 border-pink-200',
                'Research': 'bg-green-100 text-green-800 border-green-200',
                'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
                'Shopping': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                'General': 'bg-gray-100 text-gray-800 border-gray-200'
            };

            const colorClass = categoryColors[category] || categoryColors['General'];

            return `
                <div class="p-4 border-b border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <span class="px-2 py-1 text-xs font-medium rounded-full border ${colorClass}">
                                ${category}
                            </span>
                            <span class="text-sm text-gray-500">(${categoryTabs.length})</span>
                        </div>
                        <button class="text-xs text-gray-500 hover:text-gray-700" onclick="tabMind.toggleCategory('${category}')">
                            ${this.isCategoryCollapsed(category) ? 'Expand' : 'Collapse'}
                        </button>
                    </div>
                    <div class="space-y-2 ${this.isCategoryCollapsed(category) ? 'hidden' : ''}">
                        ${categoryTabs.map(tab => this.renderTabItem(tab)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderTabItem(tab) {
        // Generate custom thumbnail if favicon is missing or generic
        let favicon = tab.favIconUrl;
        if (!favicon || favicon.includes('default') || favicon.includes('generic')) {
            favicon = this.thumbnailGenerator.generateThumbnail(tab.url, tab.title);
        }
        
        return `
            <div class="tab-item flex items-center p-2 bg-white rounded-lg border border-gray-200 hover:shadow-md cursor-pointer group" data-tab-id="${tab.id}">
                <img src="${favicon}" alt="" class="w-6 h-6 mr-3 flex-shrink-0 rounded" onerror="this.src='${this.thumbnailGenerator.createDefaultThumbnail()}'" style="min-width: 24px; min-height: 24px;">
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">${tab.title || 'Untitled'}</p>
                    <p class="text-xs text-gray-500 truncate">${this.getDomain(tab.url)}</p>
                </div>
                <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    ${tab.suspended ? 
                        '<span class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">Suspended</span>' : 
                        tab.active ? '<span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>' : ''
                    }
                    <button onclick="tabMind.switchToTab(${tab.id})" class="p-1 text-gray-400 hover:text-blue-600" title="Switch to tab">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <button onclick="tabMind.suspendTab(${tab.id})" class="p-1 text-gray-400 hover:text-yellow-600" title="Suspend tab">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                    <button onclick="tabMind.closeTab(${tab.id})" class="p-1 text-gray-400 hover:text-red-600" title="Close tab">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    renderSearchResults() {
        if (!this.searchResults || this.searchResults.length === 0) {
            return `
                <div class="p-8 text-center text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p>No tabs found matching "${this.searchQuery}"</p>
                    <p class="text-sm mt-2">Try searching for page titles, URLs, or domains.</p>
                </div>
            `;
        }

        return `
            <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-3">
                    Search Results for "${this.searchQuery}" (${this.searchResults.length})
                </h3>
                <div class="space-y-2">
                    ${this.searchResults.map(tab => this.renderSearchResultItem(tab)).join('')}
                </div>
            </div>
        `;
    }

    renderSearchResultItem(tab) {
        // Generate custom thumbnail for search results too
        let favicon = tab.favIconUrl;
        if (!favicon || favicon.includes('default') || favicon.includes('generic')) {
            favicon = this.thumbnailGenerator.generateThumbnail(tab.url, tab.title);
        }
        
        return `
            <div class="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md cursor-pointer group" onclick="tabMind.switchToTab(${tab.id})">
                <img src="${favicon}" alt="" class="w-6 h-6 mr-3 flex-shrink-0 rounded" onerror="this.src='${this.thumbnailGenerator.createDefaultThumbnail()}'" style="min-width: 24px; min-height: 24px;">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                        <p class="text-sm font-medium text-gray-900 truncate">${tab.title || 'Untitled'}</p>
                        ${tab.active ? '<span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Active</span>' : ''}
                    </div>
                    <p class="text-xs text-gray-500 truncate">${this.getDomain(tab.url)}</p>
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                    </svg>
                </div>
            </div>
        `;
    }

    renderSessions() {
        return `
            <div class="border-t border-gray-200 bg-gray-50">
                <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-900 mb-3">Saved Sessions</h3>
                    <div class="space-y-2">
                        ${this.sessions.slice(0, 3).map(session => `
                            <div class="flex items-center justify-between p-2 bg-white rounded border">
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">${session.name}</p>
                                    <p class="text-xs text-gray-500">${session.tabs.length} tabs • ${this.formatDate(session.timestamp)}</p>
                                </div>
                                <button onclick="tabMind.restoreSession('${session.id}')" class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600">
                                    Restore
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                this.performSearch();
            });
        }

        // Save session button
        const saveSessionBtn = document.getElementById('save-session-btn');
        if (saveSessionBtn) {
            saveSessionBtn.addEventListener('click', () => this.saveSession());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.loadTabs());
        }
    }

    async performSearch() {
        if (this.searchQuery.trim()) {
            try {
                this.searchResults = await this.searchEngine.performSearch(this.searchQuery);
            } catch (error) {
                console.error('Search failed:', error);
                this.searchResults = [];
            }
        } else {
            this.searchResults = [];
        }
        this.render();
    }

    async saveSession() {
        const name = prompt('Enter session name:');
        if (name) {
            try {
                await this.sendMessage({ action: 'saveSession', name });
                this.loadSessions();
                this.showNotification('Session saved successfully!');
            } catch (error) {
                console.error('Failed to save session:', error);
                this.showNotification('Failed to save session', 'error');
            }
        }
    }

    async restoreSession(sessionId) {
        try {
            await this.sendMessage({ action: 'restoreSession', sessionId });
            this.showNotification('Session restored successfully!');
        } catch (error) {
            console.error('Failed to restore session:', error);
            this.showNotification('Failed to restore session', 'error');
        }
    }

    async switchToTab(tabId) {
        try {
            await chrome.tabs.update(tabId, { active: true });
            const tab = await chrome.tabs.get(tabId);
            await chrome.windows.update(tab.windowId, { focused: true });
            window.close();
        } catch (error) {
            console.error('Failed to switch to tab:', error);
        }
    }

    async suspendTab(tabId) {
        try {
            await this.sendMessage({ action: 'suspendTab', tabId });
            this.loadTabs();
            this.showNotification('Tab suspended');
        } catch (error) {
            console.error('Failed to suspend tab:', error);
        }
    }

    async closeTab(tabId) {
        try {
            await this.sendMessage({ action: 'closeTab', tabId });
            this.loadTabs();
            this.showNotification('Tab closed');
        } catch (error) {
            console.error('Failed to close tab:', error);
        }
    }

    toggleCategory(category) {
        const collapsed = this.getCollapsedCategories();
        if (collapsed.includes(category)) {
            const index = collapsed.indexOf(category);
            collapsed.splice(index, 1);
        } else {
            collapsed.push(category);
        }
        this.saveCollapsedCategories(collapsed);
        this.render();
    }

    isCategoryCollapsed(category) {
        return this.getCollapsedCategories().includes(category);
    }

    getCollapsedCategories() {
        return JSON.parse(localStorage.getItem('collapsedCategories') || '[]');
    }

    saveCollapsedCategories(collapsed) {
        localStorage.setItem('collapsedCategories', JSON.stringify(collapsed));
    }

    getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleDateString();
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white text-sm z-50 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize the popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tabMind = new TabMindPopup();
});