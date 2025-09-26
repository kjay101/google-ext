#!/usr/bin/env node

/**
 * Simple HTTP Server for Tab Mind Testing Page
 * Serves the test-links.html file publicly for easy access
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 8080;
const HOST = '0.0.0.0'; // Listen on all interfaces

// Get local IP addresses
function getLocalIPs() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    
    Object.keys(interfaces).forEach(name => {
        interfaces[name].forEach(interface => {
            if (!interface.internal && interface.family === 'IPv4') {
                ips.push(interface.address);
            }
        });
    });
    
    return ips;
}

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // Parse URL
    let urlPath = req.url === '/' ? '/test-links.html' : req.url;
    
    // Remove query parameters
    urlPath = urlPath.split('?')[0];
    
    // Construct file path
    const filePath = path.join(__dirname, urlPath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>File Not Found</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #e74c3c; }
                </style>
            </head>
            <body>
                <h1>404 - File Not Found</h1>
                <p>The file <code>${urlPath}</code> was not found.</p>
                <p><a href="/test-links.html">Go to Test Links Page</a></p>
            </body>
            </html>
        `);
        return;
    }
    
    // Get file extension and MIME type
    const ext = path.extname(filePath);
    const mimeType = mimeTypes[ext] || 'text/plain';
    
    // Set CORS headers for cross-origin access
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Server Error</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #e74c3c; }
                    </style>
                </head>
                <body>
                    <h1>500 - Server Error</h1>
                    <p>Error reading file: ${err.message}</p>
                </body>
                </html>
            `);
            return;
        }
        
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
});

server.listen(PORT, HOST, () => {
    console.log('🚀 Tab Mind Test Server Started!');
    console.log('=====================================');
    console.log(`📱 Local Access: http://localhost:${PORT}`);
    console.log(`🌐 Network Access:`);
    
    const ips = getLocalIPs();
    if (ips.length > 0) {
        ips.forEach(ip => {
            console.log(`   http://${ip}:${PORT}`);
        });
    } else {
        console.log(`   http://127.0.0.1:${PORT}`);
    }
    
    console.log('=====================================');
    console.log('📋 Available URLs:');
    console.log(`   Test Page: http://localhost:${PORT}/test-links.html`);
    console.log(`   Direct: http://localhost:${PORT}/`);
    console.log('=====================================');
    console.log('💡 Share any of the network URLs with others!');
    console.log('⚠️  Make sure Windows Firewall allows Node.js');
    console.log('🛑 Press Ctrl+C to stop the server');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
    } else {
        console.error('❌ Server error:', err.message);
    }
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 Received SIGTERM, shutting down...');
    server.close(() => {
        console.log('✅ Server stopped successfully');
        process.exit(0);
    });
});