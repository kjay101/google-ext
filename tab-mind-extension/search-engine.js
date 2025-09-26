// Enhanced search functionality for Tab Mind
class TabSearchEngine {
    constructor(popup) {
        this.popup = popup;
        this.searchResults = [];
        this.searchHistory = [];
        this.loadSearchHistory();
    }

    async performSearch(query) {
        if (!query || query.trim().length < 2) {
            return [];
        }

        const queryLower = query.toLowerCase();
        this.addToSearchHistory(query);
        
        try {
            // Search current tabs
            const currentTabsResponse = await this.popup.sendMessage({ action: 'searchTabs', query });
            const currentTabs = currentTabsResponse.success ? currentTabsResponse.data : [];

            // Search saved sessions
            const sessionTabs = await this.searchSavedSessions(queryLower);

            // Combine and rank results
            const allResults = [
                ...currentTabs.map(tab => ({ ...tab, source: 'current', priority: 1 })),
                ...sessionTabs.map(tab => ({ ...tab, source: 'session', priority: 2 }))
            ];

            // Sort by relevance
            return this.rankSearchResults(allResults, queryLower);
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    async searchSavedSessions(query) {
        const result = await chrome.storage.local.get(['settings']);
        const sessions = result.settings?.sessions || [];
        const sessionTabs = [];

        sessions.forEach(session => {
            session.tabs.forEach(tab => {
                if (this.matchesQuery(tab, query)) {
                    sessionTabs.push({
                        ...tab,
                        sessionName: session.name,
                        sessionId: session.id,
                        timestamp: session.timestamp
                    });
                }
            });
        });

        return sessionTabs;
    }

    matchesQuery(tab, query) {
        const title = (tab.title || '').toLowerCase();
        const url = (tab.url || '').toLowerCase();
        const domain = this.getDomain(tab.url).toLowerCase();

        return title.includes(query) || 
               url.includes(query) || 
               domain.includes(query);
    }

    rankSearchResults(results, query) {
        return results.sort((a, b) => {
            // Prioritize exact matches in title
            const aExactTitle = (a.title || '').toLowerCase().includes(query);
            const bExactTitle = (b.title || '').toLowerCase().includes(query);
            
            if (aExactTitle && !bExactTitle) return -1;
            if (!aExactTitle && bExactTitle) return 1;

            // Then prioritize current tabs over session tabs
            if (a.source !== b.source) {
                return a.priority - b.priority;
            }

            // Finally sort by title length (shorter = more relevant)
            return (a.title || '').length - (b.title || '').length;
        });
    }

    addToSearchHistory(query) {
        const trimmedQuery = query.trim();
        if (trimmedQuery && !this.searchHistory.includes(trimmedQuery)) {
            this.searchHistory.unshift(trimmedQuery);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep only last 10
            this.saveSearchHistory();
        }
    }

    loadSearchHistory() {
        const stored = localStorage.getItem('tabMindSearchHistory');
        this.searchHistory = stored ? JSON.parse(stored) : [];
    }

    saveSearchHistory() {
        localStorage.setItem('tabMindSearchHistory', JSON.stringify(this.searchHistory));
    }

    getSearchSuggestions(query) {
        if (!query || query.length < 2) return [];
        
        return this.searchHistory.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);
    }

    getDomain(url) {
        try {
            return new URL(url).hostname;
        } catch {
            return url || '';
        }
    }

    renderSearchResults(results) {
        if (!results || results.length === 0) {
            return `
                <div class="p-8 text-center text-gray-500">
                    <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <p>No tabs found matching your search.</p>
                    <p class="text-sm mt-2">Try searching for page titles, URLs, or domains.</p>
                </div>
            `;
        }

        return `
            <div class="p-4">
                <h3 class="text-sm font-medium text-gray-900 mb-3">
                    Search Results (${results.length})
                </h3>
                <div class="space-y-2">
                    ${results.map(tab => this.renderSearchResultItem(tab)).join('')}
                </div>
            </div>
        `;
    }

    renderSearchResultItem(tab) {
        const favicon = tab.favIconUrl || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gray"><circle cx="12" cy="12" r="10"/></svg>';
        const sourceLabel = tab.source === 'current' ? 'Open Tab' : `Session: ${tab.sessionName}`;
        const sourceColor = tab.source === 'current' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';

        return `
            <div class="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md cursor-pointer group" 
                 onclick="tabMind.handleSearchResultClick('${tab.source}', ${tab.id || 'null'}, '${tab.url}', '${tab.sessionId || ''}')">
                <img src="${favicon}" alt="" class="w-4 h-4 mr-3 flex-shrink-0" 
                     onerror="this.src='data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"gray\\"><circle cx=\\"12\\" cy=\\"12\\" r=\\"10\\"/></svg>'">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-2 mb-1">
                        <p class="text-sm font-medium text-gray-900 truncate">${tab.title || 'Untitled'}</p>
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${sourceColor}">
                            ${sourceLabel}
                        </span>
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

    renderSearchSuggestions(query) {
        const suggestions = this.getSearchSuggestions(query);
        if (suggestions.length === 0) return '';

        return `
            <div class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50">
                <div class="p-2">
                    <div class="text-xs text-gray-500 mb-2">Recent searches:</div>
                    ${suggestions.map(suggestion => `
                        <div class="px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer"
                             onclick="tabMind.selectSearchSuggestion('${suggestion}')">
                            ${suggestion}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Voice search functionality (future enhancement)
class VoiceSearch {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.onVoiceResult(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isListening = false;
            };

            this.recognition.onend = () => {
                this.isListening = false;
            };
        }
    }

    startListening() {
        if (this.recognition && !this.isListening) {
            this.isListening = true;
            this.recognition.start();
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    onVoiceResult(transcript) {
        // This would be called by the popup to handle voice search results
        if (window.tabMind) {
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = transcript;
                window.tabMind.searchQuery = transcript;
                window.tabMind.performSearch();
            }
        }
    }

    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
}

// Export for use in popup
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TabSearchEngine, VoiceSearch };
}