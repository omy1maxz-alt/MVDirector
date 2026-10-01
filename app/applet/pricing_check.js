const https = require('https');
https.get('https://ai.google.dev/pricing', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const text = data.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
    const imagenIndex = text.toLowerCase().indexOf('imagen 3');
    if (imagenIndex !== -1) {
      console.log(text.substring(imagenIndex - 200, imagenIndex + 500));
    } else {
        console.log("Imagen not found. Searching for 'image generation'");
        const imgIndex = text.toLowerCase().indexOf('image generation');
        if (imgIndex !== -1) {
          console.log(text.substring(imgIndex - 200, imgIndex + 500));
        }
    }
  });
});
