import { spawn } from 'child_process';
import open from 'open';
import { fileURLToPath } from 'url';
import path from 'path';

// The port to use for Next.js
const NEXT_PORT = 3001;

// Start the Next.js server
console.log('Starting Next.js development server...');
const nextServer = spawn('npx', ['next', 'dev', '-p', NEXT_PORT.toString()], {
  stdio: 'inherit',
  shell: true
});

// Wait for Next.js to start before launching Live Server
setTimeout(async () => {
  try {
    console.log('Starting Live Server...');
    
    // Use VS Code's Live Server extension if available
    // This will open live-server.html which will redirect to the Next.js app
    const liveServerProcess = spawn('npx', ['live-server', '--port=5500', '--browser=chrome', 'live-server.html'], {
      stdio: 'inherit',
      shell: true
    });
    
    console.log('Live Server started on port 5500');
    console.log('Opening live-server.html which will redirect to your Next.js app');
    
    liveServerProcess.on('close', (code) => {
      console.log(`Live Server process exited with code ${code}`);
      nextServer.kill();
      process.exit(code);
    });
    
  } catch (error) {
    console.error('Failed to start Live Server:', error);
    console.log(`Please install live-server globally with: npm install -g live-server`);
    console.log(`Or manually open http://localhost:${NEXT_PORT} in your browser.`);
  }
}, 3000); // Wait 3 seconds for Next.js to start

// Handle exit
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  nextServer.kill();
  process.exit();
});

nextServer.on('close', (code) => {
  console.log(`Next.js server process exited with code ${code}`);
  process.exit(code);
}); 