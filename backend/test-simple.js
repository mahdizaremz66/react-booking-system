import http from 'http';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: body });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });
}

async function testSimple() {
  console.log('🧪 Testing basic server connectivity...\n');

  try {
    // Test root endpoint
    console.log('1. Testing GET /...');
    const rootResult = await makeRequest('/');
    console.log(`Status: ${rootResult.status}`);
    console.log(`Response: ${rootResult.data}`);
    console.log('');

    // Test API root
    console.log('2. Testing GET /api...');
    const apiResult = await makeRequest('/api');
    console.log(`Status: ${apiResult.status}`);
    console.log(`Response: ${apiResult.data}`);
    console.log('');

    // Test theme endpoint
    console.log('3. Testing GET /api/theme...');
    const themeResult = await makeRequest('/api/theme');
    console.log(`Status: ${themeResult.status}`);
    console.log(`Response: ${themeResult.data}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimple();
