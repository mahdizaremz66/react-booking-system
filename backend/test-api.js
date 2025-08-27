import http from 'http';

// Test function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`Connection error for ${path}:`, err.message);
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Test the API endpoints
async function testAPI() {
  console.log('🧪 Testing Theme API Endpoints...\n');

  try {
    // Test 1: Get templates
    console.log('1. Testing GET /api/theme/templates...');
    try {
      const templatesResult = await makeRequest('/api/theme/templates');
      console.log(`Status: ${templatesResult.status}`);
      if (templatesResult.status === 200) {
        console.log(`Found ${templatesResult.data.length} templates`);
        templatesResult.data.forEach(template => {
          console.log(`  - ${template.name} (${template.id}) - ${template.isSystem ? 'System' : 'Custom'}`);
        });
      } else {
        console.log('Error:', templatesResult.data);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
    console.log('');

    // Test 2: Get theme settings
    console.log('2. Testing GET /api/theme/settings...');
    try {
      const settingsResult = await makeRequest('/api/theme/settings');
      console.log(`Status: ${settingsResult.status}`);
      if (settingsResult.status === 200) {
        console.log('Settings loaded successfully');
        console.log(`  - Languages: ${settingsResult.data.languages?.length || 0}`);
        console.log(`  - Settings: ${settingsResult.data.settings?.length || 0}`);
        console.log(`  - Links: ${settingsResult.data.links?.length || 0}`);
      } else {
        console.log('Error:', settingsResult.data);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
    console.log('');

    // Test 3: Get languages
    console.log('3. Testing GET /api/theme/languages...');
    try {
      const languagesResult = await makeRequest('/api/theme/languages');
      console.log(`Status: ${languagesResult.status}`);
      if (languagesResult.status === 200) {
        if (Array.isArray(languagesResult.data)) {
          console.log(`Found ${languagesResult.data.length} languages`);
          languagesResult.data.forEach(lang => {
            console.log(`  - ${lang.name} (${lang.code}) - ${lang.isActive ? 'Active' : 'Inactive'}`);
          });
        } else {
          console.log('Unexpected data format:', languagesResult.data);
        }
      } else {
        console.log('Error:', languagesResult.data);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }
    console.log('');

    // Test 4: Get links
    console.log('4. Testing GET /api/theme/links...');
    try {
      const linksResult = await makeRequest('/api/theme/links');
      console.log(`Status: ${linksResult.status}`);
      if (linksResult.status === 200) {
        if (Array.isArray(linksResult.data)) {
          console.log(`Found ${linksResult.data.length} links`);
          linksResult.data.forEach(link => {
            console.log(`  - ${link.type} (${link.url})`);
          });
        } else {
          console.log('Unexpected data format:', linksResult.data);
        }
      } else {
        console.log('Error:', linksResult.data);
      }
    } catch (error) {
      console.log('Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
