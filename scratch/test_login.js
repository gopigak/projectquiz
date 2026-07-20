const https = require('https');

const postData = JSON.stringify({
  email: 'admin@quizapp.com',
  password: 'adminpassword123'
});

const req = https.request({
  hostname: 'projectquiz-six.vercel.app',
  port: 443,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': postData.length
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('BODY:');
    console.log(data);
  });
});

req.on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

req.write(postData);
req.end();
