const http = require('http');
const https = require('https');

const url = 'http://localhost:5000/api/health';
const client = url.startsWith('https') ? https : http;

const req = client.get(url, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('BODY snippet:');
    console.log(data.substring(0, 1000));
  });
});

req.on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

req.end();
