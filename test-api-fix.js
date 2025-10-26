/**
 * Test script to verify ChatAnywhere API is working with the fallback key
 */

const API_KEY = 'sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte';
const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

async function testAPI() {
  console.log('🔍 Testing ChatAnywhere API with fallback key...\n');
  console.log('API Key:', API_KEY.substring(0, 20) + '...');
  console.log('API URL:', API_URL);
  console.log('=' .repeat(50));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant. Answer in one short sentence.'
          },
          {
            role: 'user',
            content: 'Say "API is working!" if you can receive this message.'
          }
        ],
        temperature: 0.7,
        max_tokens: 50
      })
    });

    const data = await response.json();

    if (response.ok && data.choices) {
      console.log('\n✅ SUCCESS!');
      console.log('API Response:', data.choices[0].message.content);
      console.log('\n💡 The API key is working correctly!');
      return true;
    } else {
      console.log('\n❌ API Error:');
      console.log('Status:', response.status);
      console.log('Error:', data.error?.message || 'Unknown error');
      
      if (response.status === 401) {
        console.log('\n⚠️ API Key is invalid or expired');
        console.log('Please check the API key or get a new one');
      }
      return false;
    }
  } catch (error) {
    console.log('\n❌ Connection Error:');
    console.log(error.message);
    console.log('\nPossible causes:');
    console.log('1. No internet connection');
    console.log('2. API service is down');
    console.log('3. Firewall blocking connection');
    return false;
  }
}

// Test environment variables
function checkEnvironment() {
  console.log('\n📋 Environment Check:');
  console.log('=' .repeat(50));
  
  const envVars = {
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
    'NEXT_PUBLIC_OPENAI_API_KEY': process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    'OPENAI_API_BASE': process.env.OPENAI_API_BASE,
    'NEXT_PUBLIC_OPENAI_API_BASE': process.env.NEXT_PUBLIC_OPENAI_API_BASE
  };

  Object.entries(envVars).forEach(([key, value]) => {
    if (value) {
      console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${key}: NOT SET`);
    }
  });
}

// Run tests
async function runTests() {
  console.log('🚀 ChatAnywhere API Configuration Test');
  console.log('Testing API connection and environment setup');
  console.log('=' .repeat(50));

  // Check environment first
  checkEnvironment();

  // Test API
  console.log('\n🔄 Testing API Connection...');
  console.log('=' .repeat(50));
  
  const apiWorking = await testAPI();

  console.log('\n' + '=' .repeat(50));
  console.log('📊 SUMMARY:');
  
  if (apiWorking) {
    console.log('✅ API is working correctly');
    console.log('✅ The fallback configuration is functional');
    console.log('\n🎉 The chat feature should work now!');
  } else {
    console.log('❌ API is not working');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Check if the API key is valid');
    console.log('2. Ensure internet connection is working');
    console.log('3. Try again in a few moments');
    console.log('4. Contact support if issue persists');
  }
}

// Execute
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
