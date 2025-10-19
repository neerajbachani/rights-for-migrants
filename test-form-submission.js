// Manual test for form submission API
// Run with: node test-form-submission.js

const BASE_URL = 'http://localhost:3000';

async function testFormSubmission() {
  console.log('Testing Form Submission API...\n');

  // Test 1: Valid submission
  console.log('Test 1: Valid form submission');
  try {
    const response = await fetch(`${BASE_URL}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a test message for the form submission.'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Valid submission test completed\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 2: Invalid email
  console.log('Test 2: Invalid email format');
  try {
    const response = await fetch(`${BASE_URL}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email',
        message: 'This is a test message.'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Invalid email test completed\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Missing required fields
  console.log('Test 3: Missing required fields');
  try {
    const response = await fetch(`${BASE_URL}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe'
        // Missing email and message
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Missing fields test completed\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Rate limiting (multiple submissions)
  console.log('Test 4: Rate limiting (6 rapid submissions)');
  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch(`${BASE_URL}/api/forms/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Test User ${i}`,
          email: `test${i}@example.com`,
          message: `Test message number ${i}`
        })
      });

      const data = await response.json();
      console.log(`Submission ${i} - Status:`, response.status, 'Success:', data.success);
      
      if (response.status === 429) {
        console.log('Rate limit triggered as expected');
        break;
      }
    } catch (error) {
      console.log(`❌ Submission ${i} Error:`, error.message);
    }
  }
  console.log('✅ Rate limiting test completed\n');

  // Test 5: Invalid JSON
  console.log('Test 5: Invalid JSON');
  try {
    const response = await fetch(`${BASE_URL}/api/forms/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid json'
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Invalid JSON test completed\n');
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  testFormSubmission().catch(console.error);
}

module.exports = { testFormSubmission };