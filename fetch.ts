import fs from 'fs';
fetch('https://cloud.google.com/blog/products/ai-machine-learning/ultimate-prompting-guide-for-nano-banana')
  .then(r => r.text())
  .then(t => {
    fs.writeFileSync('page.html', t);
    console.log('Done');
  });
