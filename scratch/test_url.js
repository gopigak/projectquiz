const https = require('https');

const postData = JSON.stringify({
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User'
});

const makePost = (path) => {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'projectquiz-tau.vercel.app',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    }, (res) => {
      console.log(`POST ${path}`);
      console.log(`Status Code: ${res.statusCode}`);
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        console.log('Body:', body);
        console.log('------------------');
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error(e);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
};

async function run() {
  await makePost('/api/auth/login');
  await makePost('/api/auth/signup');
}

run();
