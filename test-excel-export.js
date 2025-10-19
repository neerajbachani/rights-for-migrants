/**
 * Test script for Excel export functionality
 * Run with: node test-excel-export.js
 * 
 * Prerequisites:
 * 1. Development server running on localhost:3000
 * 2. At least one form submission in the database
 * 3. Admin credentials: admin@rightsformigrants.org / admin123
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, options);
    return {
      ok: response.ok,
      status: response.status,
      headers: response.headers,
      data: response.ok ? await response.json() : await response.text(),
      buffer: response.ok && options.expectBuffer ? await response.arrayBuffer() : null
    };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { ok: false, error: error.message };
  }
}

async function getAuthToken() {
  console.log('🔐 Getting admin authentication token...');
  
  const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@rightsformigrants.org',
      password: 'admin123'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get auth token: ${response.status} - ${response.data}`);
  }

  if (!response.data.success || !response.data.token) {
    throw new Error('Login response missing token');
  }

  console.log('✅ Successfully obtained auth token');
  return response.data.token;
}

async function testExcelExport(token, filters = {}) {
  console.log('📊 Testing Excel export...');
  
  // Build query string
  const queryParams = new URLSearchParams();
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
  
  const queryString = queryParams.toString();
  const url = `${BASE_URL}/api/admin/forms/export${queryString ? '?' + queryString : ''}`;
  
  console.log(`📤 Requesting export from: ${url}`);
  
  const response = await makeRequest(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    expectBuffer: true
  });

  if (!response.ok) {
    console.error(`❌ Export failed: ${response.status} - ${response.data}`);
    return false;
  }

  // Check response headers
  const contentType = response.headers.get('content-type');
  const contentDisposition = response.headers.get('content-disposition');
  
  console.log(`📋 Content-Type: ${contentType}`);
  console.log(`📋 Content-Disposition: ${contentDisposition}`);
  
  if (!contentType.includes('spreadsheetml.sheet')) {
    console.error('❌ Invalid content type for Excel file');
    return false;
  }

  if (!contentDisposition || !contentDisposition.includes('attachment')) {
    console.error('❌ Missing or invalid content disposition header');
    return false;
  }

  // Save the file
  const filename = contentDisposition.match(/filename="([^"]+)"/)?.[1] || 'export.xlsx';
  const buffer = Buffer.from(response.buffer);
  
  try {
    fs.writeFileSync(filename, buffer);
    console.log(`✅ Excel file saved as: ${filename} (${buffer.length} bytes)`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to save file: ${error.message}`);
    return false;
  }
}

async function testErrorCases(token) {
  console.log('🚫 Testing error cases...');
  
  // Test without auth token
  console.log('Testing without auth token...');
  const noAuthResponse = await makeRequest(`${BASE_URL}/api/admin/forms/export`);
  if (noAuthResponse.status === 401) {
    console.log('✅ Correctly rejected request without auth token');
  } else {
    console.log('❌ Should have rejected request without auth token');
  }

  // Test with invalid status
  console.log('Testing with invalid status filter...');
  const invalidStatusResponse = await makeRequest(`${BASE_URL}/api/admin/forms/export?status=invalid`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (invalidStatusResponse.status === 400) {
    console.log('✅ Correctly rejected invalid status filter');
  } else {
    console.log('❌ Should have rejected invalid status filter');
  }

  // Test with invalid token
  console.log('Testing with invalid token...');
  const invalidTokenResponse = await makeRequest(`${BASE_URL}/api/admin/forms/export`, {
    headers: { 'Authorization': 'Bearer invalid-token' }
  });
  if (invalidTokenResponse.status === 401) {
    console.log('✅ Correctly rejected invalid token');
  } else {
    console.log('❌ Should have rejected invalid token');
  }
}

async function runTests() {
  console.log('🧪 Starting Excel Export API Tests\n');
  
  try {
    // Get auth token
    const token = await getAuthToken();
    
    // Test basic export
    console.log('\n📊 Test 1: Basic export (all submissions)');
    await testExcelExport(token);
    
    // Test filtered export
    console.log('\n📊 Test 2: Export with status filter');
    await testExcelExport(token, { status: 'new' });
    
    // Test date range export
    console.log('\n📊 Test 3: Export with date range');
    await testExcelExport(token, { 
      dateFrom: '2024-01-01', 
      dateTo: '2024-12-31' 
    });
    
    // Test error cases
    console.log('\n🚫 Test 4: Error cases');
    await testErrorCases(token);
    
    console.log('\n🎉 All tests completed!');
    console.log('\n📁 Check the generated Excel files in the current directory');
    
  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
    process.exit(1);
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ with built-in fetch support');
  console.log('💡 Alternatively, install node-fetch: npm install node-fetch');
  process.exit(1);
}

runTests();