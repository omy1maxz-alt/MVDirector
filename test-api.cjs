const https = require('https');

function check(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(url, res.statusCode, data));
  });
}

check('https://api.kie.ai/api/v1/generate/record-info?taskId=123');
check('https://api.kie.ai/api/v1/generate/get-music-details?taskId=123');
check('https://api.kie.ai/api/v1/generate/task-info?taskId=123');
