/**
 * Test script for ChatAnywhere API integration
 * Run with: node test-chatanywhere.js
 */

const axios = require('axios');

// API Configuration
const API_KEY = 'sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte';
const API_BASE = 'https://api.chatanywhere.tech/v1';

// Available models
const MODELS = {
  'claude-sonnet': 'claude-sonnet-4-5-20250929',
  'claude-thinking': 'claude-sonnet-4-5-20250929-thinking',
  'gpt-5': 'gpt-5'
};

// Test function for each model
async function testModel(modelKey, modelName) {
  console.log(`\n🔄 Testing ${modelKey} (${modelName})...`);
  
  try {
    const response = await axios.post(
      `${API_BASE}/chat/completions`,
      {
        model: modelName,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Keep your response brief.'
          },
          {
            role: 'user',
            content: 'Say hello and tell me which AI model you are in one sentence.'
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        timeout: 30000 // 30 seconds timeout
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      console.log(`✅ ${modelKey} Success!`);
      console.log(`   Response: ${response.data.choices[0].message.content}`);
      console.log(`   Usage: ${JSON.stringify(response.data.usage)}`);
      return true;
    } else {
      console.log(`⚠️ ${modelKey} returned unexpected response structure`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${modelKey} Failed!`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${error.response.data?.error?.message || error.message}`);
    } else if (error.request) {
      console.log(`   Error: No response received (network issue)`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting ChatAnywhere API Tests');
  console.log('================================');
  console.log(`API Base: ${API_BASE}`);
  console.log(`API Key: ${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 5)}`);
  
  const results = [];
  
  // Test each model
  for (const [key, model] of Object.entries(MODELS)) {
    const success = await testModel(key, model);
    results.push({ key, model, success });
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n================================');
  console.log('📊 Test Results Summary:');
  console.log('================================');
  
  let successCount = 0;
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.key}: ${result.success ? 'PASSED' : 'FAILED'}`);
    if (result.success) successCount++;
  });
  
  console.log('\n================================');
  console.log(`Total: ${successCount}/${results.length} models working`);
  
  if (successCount === results.length) {
    console.log('🎉 All models are working correctly!');
  } else if (successCount > 0) {
    console.log('⚠️ Some models are working, but not all. Check the errors above.');
  } else {
    console.log('❌ No models are working. Please check your API key and network connection.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
