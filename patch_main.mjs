import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');

const injection = `// Polyfill for HTMLMediaElement.play() to suppress AbortError and NotAllowedError unhandled rejections
const originalPlay = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function() {
  const promise = originalPlay.apply(this, arguments);
  if (promise !== undefined) {
    promise.catch(error => {
      if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
        // Suppress expected DOM exceptions from unhandledrejection
        return;
      }
      // Re-throw other errors
      throw error;
    });
  }
  return promise;
};

// Polyfill for process`;

code = code.replace('// Polyfill for process', injection);
fs.writeFileSync('src/main.tsx', code);
