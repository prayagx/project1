import { spawn } from 'child_process';
import open from 'open';
import { fileURLToPath } from 'url';
import path from 'path';

// The port to use
const PORT = 3001;

// Start the Next.js server
const nextServer = spawn('npx', ['next', 'dev', '-p', PORT.toString()], {
  stdio: 'inherit',
  shell: true
});

// Wait a moment for the server to start, then open Chrome
setTimeout(async () => {
  try {
    console.log(`Opening app in Chrome at http://localhost:${PORT}`);
    
    // Different approach to open Chrome based on platform
    // This is more reliable across different OS versions
    if (process.platform === 'darwin') {
      // macOS
      await open(`http://localhost:${PORT}`, { app: { name: 'google chrome' } });
    } else if (process.platform === 'win32') {
      // Windows
      await open(`http://localhost:${PORT}`, { app: { name: 'chrome' } });
    } else {
      // Linux or other
      await open(`http://localhost:${PORT}`, { app: ['google-chrome', 'chrome', 'chromium'] });
    }
    
    console.log('Browser launched successfully!');
  } catch (error) {
    console.error('Failed to open browser:', error);
    console.log(`Please manually open http://localhost:${PORT} in your browser.`);
  }
}, 3000); // Wait 3 seconds before opening the browser

// Handle exit
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  nextServer.kill();
  process.exit();
});

nextServer.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
}); 