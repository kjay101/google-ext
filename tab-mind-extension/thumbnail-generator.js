// Site Thumbnail Generator for Tab Mind Extension
class SiteThumbnailGenerator {
    constructor() {
        this.thumbnailCache = new Map();
        this.defaultThumbnails = new Map();
        this.initializeDefaultThumbnails();
    }

    // Initialize default thumbnails for popular sites
    initializeDefaultThumbnails() {
        // Work sites
        this.defaultThumbnails.set('gmail.com', this.createWorkThumbnail('#EA4335', 'M'));
        this.defaultThumbnails.set('outlook.com', this.createWorkThumbnail('#0078D4', 'O'));
        this.defaultThumbnails.set('slack.com', this.createWorkThumbnail('#4A154B', 'S'));
        this.defaultThumbnails.set('teams.microsoft.com', this.createWorkThumbnail('#6264A7', 'T'));
        this.defaultThumbnails.set('zoom.us', this.createWorkThumbnail('#2D8CFF', 'Z'));
        this.defaultThumbnails.set('meet.google.com', this.createWorkThumbnail('#00AC47', 'M'));
        this.defaultThumbnails.set('github.com', this.createWorkThumbnail('#24292f', 'G'));
        this.defaultThumbnails.set('gitlab.com', this.createWorkThumbnail('#FC6D26', 'G'));

        // Social sites
        this.defaultThumbnails.set('facebook.com', this.createSocialThumbnail('#1877F2', 'F'));
        this.defaultThumbnails.set('twitter.com', this.createSocialThumbnail('#1DA1F2', 'T'));
        this.defaultThumbnails.set('x.com', this.createSocialThumbnail('#000000', 'X'));
        this.defaultThumbnails.set('instagram.com', this.createSocialThumbnail('#E4405F', 'I'));
        this.defaultThumbnails.set('linkedin.com', this.createSocialThumbnail('#0A66C2', 'in'));
        this.defaultThumbnails.set('reddit.com', this.createSocialThumbnail('#FF4500', 'R'));
        this.defaultThumbnails.set('discord.com', this.createSocialThumbnail('#5865F2', 'D'));

        // Entertainment sites
        this.defaultThumbnails.set('youtube.com', this.createEntertainmentThumbnail('#FF0000', '▶'));
        this.defaultThumbnails.set('netflix.com', this.createEntertainmentThumbnail('#E50914', 'N'));
        this.defaultThumbnails.set('spotify.com', this.createEntertainmentThumbnail('#1DB954', '♪'));
        this.defaultThumbnails.set('twitch.tv', this.createEntertainmentThumbnail('#9146FF', 'T'));
        this.defaultThumbnails.set('music.youtube.com', this.createEntertainmentThumbnail('#FF6B35', '♫'));

        // Research sites
        this.defaultThumbnails.set('wikipedia.org', this.createResearchThumbnail('#000000', 'W'));
        this.defaultThumbnails.set('stackoverflow.com', this.createResearchThumbnail('#F58025', 'SO'));
        this.defaultThumbnails.set('developer.mozilla.org', this.createResearchThumbnail('#000000', 'MDN'));
        this.defaultThumbnails.set('docs.google.com', this.createResearchThumbnail('#4285F4', 'D'));

        // Shopping sites
        this.defaultThumbnails.set('amazon.com', this.createShoppingThumbnail('#FF9900', 'A'));
        this.defaultThumbnails.set('ebay.com', this.createShoppingThumbnail('#E53238', 'E'));
        this.defaultThumbnails.set('walmart.com', this.createShoppingThumbnail('#0071CE', 'W'));
        this.defaultThumbnails.set('target.com', this.createShoppingThumbnail('#CC0000', '◉'));
    }

    // Create work-themed thumbnail
    createWorkThumbnail(color, letter) {
        return this.createSVGThumbnail(color, letter, '#FFFFFF', {
            pattern: 'linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%)',
            border: '2px solid rgba(255,255,255,0.3)'
        });
    }

    // Create social-themed thumbnail
    createSocialThumbnail(color, letter) {
        return this.createSVGThumbnail(color, letter, '#FFFFFF', {
            pattern: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
            border: '1px solid rgba(255,255,255,0.5)'
        });
    }

    // Create entertainment-themed thumbnail
    createEntertainmentThumbnail(color, symbol) {
        return this.createSVGThumbnail(color, symbol, '#FFFFFF', {
            pattern: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
            border: '2px solid rgba(255,255,255,0.4)',
            fontSize: '14px'
        });
    }

    // Create research-themed thumbnail
    createResearchThumbnail(color, text) {
        return this.createSVGThumbnail(color, text, '#FFFFFF', {
            pattern: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%)',
            border: '1px solid rgba(255,255,255,0.6)',
            fontSize: '10px'
        });
    }

    // Create shopping-themed thumbnail
    createShoppingThumbnail(color, symbol) {
        return this.createSVGThumbnail(color, symbol, '#FFFFFF', {
            pattern: 'linear-gradient(45deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)',
            border: '2px solid rgba(255,255,255,0.5)'
        });
    }

    // Core SVG thumbnail creation function
    createSVGThumbnail(bgColor, text, textColor = '#FFFFFF', options = {}) {
        const {
            pattern = '',
            border = '',
            fontSize = '12px',
            fontWeight = 'bold'
        } = options;

        const svg = `
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <style>
                        .bg { fill: ${bgColor}; }
                        .text { 
                            fill: ${textColor}; 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            font-size: ${fontSize};
                            font-weight: ${fontWeight};
                            text-anchor: middle;
                            dominant-baseline: central;
                        }
                        .pattern { 
                            fill: url(#pattern);
                        }
                    </style>
                    ${pattern ? `<pattern id="pattern" patternUnits="userSpaceOnUse" width="100%" height="100%"><rect width="100%" height="100%" fill="${pattern}"/></pattern>` : ''}
                </defs>
                <rect class="bg" width="32" height="32" rx="6" ry="6" ${border ? `stroke="${border.split(' ')[2]}" stroke-width="${border.split(' ')[0]}"` : ''}/>
                ${pattern ? '<rect class="pattern" width="32" height="32" rx="6" ry="6"/>' : ''}
                <text class="text" x="16" y="16">${text}</text>
            </svg>
        `;

        return `data:image/svg+xml;base64,${btoa(svg)}`;
    }

    // Generate thumbnail for any URL
    generateThumbnail(url, title = '') {
        try {
            const domain = new URL(url).hostname.toLowerCase().replace('www.', '');
            
            // Check if we have a cached thumbnail
            if (this.thumbnailCache.has(domain)) {
                return this.thumbnailCache.get(domain);
            }

            // Check if we have a default thumbnail for this domain
            if (this.defaultThumbnails.has(domain)) {
                const thumbnail = this.defaultThumbnails.get(domain);
                this.thumbnailCache.set(domain, thumbnail);
                return thumbnail;
            }

            // Generate custom thumbnail based on domain or title
            const thumbnail = this.createCustomThumbnail(domain, title);
            this.thumbnailCache.set(domain, thumbnail);
            return thumbnail;
        } catch (error) {
            console.log('Error generating thumbnail:', error);
            return this.createDefaultThumbnail();
        }
    }

    // Create custom thumbnail for unknown sites
    createCustomThumbnail(domain, title) {
        // Extract first letter or number from domain
        const firstChar = domain.charAt(0).toUpperCase();
        
        // Generate color based on domain hash
        const color = this.generateColorFromString(domain);
        
        // Determine category and style based on domain keywords
        const category = this.detectCategory(domain, title);
        
        switch (category) {
            case 'work':
                return this.createWorkThumbnail(color, firstChar);
            case 'social':
                return this.createSocialThumbnail(color, firstChar);
            case 'entertainment':
                return this.createEntertainmentThumbnail(color, firstChar);
            case 'research':
                return this.createResearchThumbnail(color, firstChar);
            case 'shopping':
                return this.createShoppingThumbnail(color, firstChar);
            default:
                return this.createSVGThumbnail(color, firstChar, '#FFFFFF');
        }
    }

    // Generate consistent color from string
    generateColorFromString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Generate pleasing colors
        const hue = Math.abs(hash) % 360;
        const saturation = 60 + (Math.abs(hash) % 40); // 60-100%
        const lightness = 45 + (Math.abs(hash) % 20); // 45-65%
        
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    // Detect category based on domain and title
    detectCategory(domain, title) {
        const workKeywords = ['mail', 'docs', 'drive', 'office', 'work', 'business', 'corp', 'admin'];
        const socialKeywords = ['social', 'chat', 'message', 'friend', 'community', 'forum'];
        const entertainmentKeywords = ['video', 'music', 'game', 'stream', 'watch', 'play', 'tv', 'movie'];
        const researchKeywords = ['wiki', 'docs', 'tutorial', 'learn', 'education', 'reference', 'api'];
        const shoppingKeywords = ['shop', 'store', 'buy', 'cart', 'commerce', 'market', 'sale'];

        const text = (domain + ' ' + title).toLowerCase();

        if (workKeywords.some(keyword => text.includes(keyword))) return 'work';
        if (socialKeywords.some(keyword => text.includes(keyword))) return 'social';
        if (entertainmentKeywords.some(keyword => text.includes(keyword))) return 'entertainment';
        if (researchKeywords.some(keyword => text.includes(keyword))) return 'research';
        if (shoppingKeywords.some(keyword => text.includes(keyword))) return 'shopping';

        return 'general';
    }

    // Create default fallback thumbnail
    createDefaultThumbnail() {
        return this.createSVGThumbnail('#6B7280', '?', '#FFFFFF');
    }

    // Convert SVG to PNG (for better compatibility)
    async svgToPng(svgDataUrl, size = 32) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = size;
            canvas.height = size;
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0, size, size);
                resolve(canvas.toDataURL('image/png'));
            };
            
            img.onerror = () => {
                resolve(svgDataUrl); // Fallback to SVG
            };
            
            img.src = svgDataUrl;
        });
    }

    // Get thumbnail with optional PNG conversion
    async getThumbnail(url, title = '', asPng = false) {
        const svgThumbnail = this.generateThumbnail(url, title);
        
        if (asPng) {
            return await this.svgToPng(svgThumbnail);
        }
        
        return svgThumbnail;
    }

    // Clear cache
    clearCache() {
        this.thumbnailCache.clear();
    }

    // Get cache size
    getCacheSize() {
        return this.thumbnailCache.size;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SiteThumbnailGenerator;
}

// Global instance for browser extension
if (typeof window !== 'undefined') {
    window.SiteThumbnailGenerator = SiteThumbnailGenerator;
}