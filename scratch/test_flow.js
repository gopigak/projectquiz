const https = require('https');

const email = 'newuser' + Math.floor(Math.random() * 100000) + '@gmail.com';
const password = 'password123';
const name = 'New User';

const request = (path, method, body) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = https.request({
      hostname: 'projectquiz-tau.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      console.log(`\n--> ${method} ${path}`);
      console.log(`Status Code: ${res.statusCode}`);
      let resBody = '';
      res.on('data', (chunk) => resBody += chunk);
      res.on('end', () => {
        console.log('Response Body:', resBody);
        resolve({ statusCode: res.statusCode, body: resBody });
      });
    });

    req.on('error', (e) => {
      console.error(e);
      reject(e);
    });

    if (body) {
      req.write(postData);
    }
    req.end();
  });
};

async function run() {
  console.log('Testing flow on Vercel...');
  
  // 1. Try to Login with new credentials (should fail with 401)
  console.log('\nStep 1: Logging in with non-existent user...');
  await request('/api/auth/login', 'POST', { email, password });
  
  // 2. Sign up with these credentials (should succeed with 201)
  console.log('\nStep 2: Signing up...');
  await request('/api/auth/signup', 'POST', { name, email, password });
  
  // 3. Try to Login with these credentials now (should succeed with 200)
  console.log('\nStep 3: Logging in with registered user...');
  await request('/api/auth/login', 'POST', { email, password });
}

run();
