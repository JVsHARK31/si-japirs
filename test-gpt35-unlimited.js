/**
 * Test GPT-3.5 Turbo specifically (should have no daily limit)
 * This will help diagnose if the issue is with all models or just GPT-5
 */

const API_KEY = 'sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte';
const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

async function testGPT35Multiple() {
  console.log('🧪 Testing GPT-3.5 Turbo (Should be UNLIMITED)');
  console.log('=' .repeat(50));
  
  const testMessages = [
    'Halo, apa kabar?',
    'Jelaskan apa itu JavaScript',
    'Bagaimana cara membuat website?',
    'Apa itu React?',
    'Berikan tips belajar programming'
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < testMessages.length; i++) {
    console.log(`\n📝 Test ${i + 1}/${testMessages.length}: "${testMessages[i]}"`);
    
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
              content: 'You are a helpful assistant. Respond in Indonesian.'
            },
            {
              role: 'user',
              content: testMessages[i]
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      const data = await response.json();

      if (response.ok && data.choices) {
        console.log(`✅ Success! Response: "${data.choices[0].message.content.substring(0, 100)}..."`);
        successCount++;
      } else {
        console.log(`❌ Failed: ${data.error?.message || 'Unknown error'}`);
        failCount++;
        
        // If we hit a limit with GPT-3.5, that's a problem
        if (data.error?.message?.includes('limit')) {
          console.log('⚠️ WARNING: GPT-3.5 Turbo should not have daily limits!');
        }
      }
    } catch (error) {
      console.log(`❌ Connection error: ${error.message}`);
      failCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESULTS:');
  console.log(`✅ Successful: ${successCount}/${testMessages.length}`);
  console.log(`❌ Failed: ${failCount}/${testMessages.length}`);
  
  if (successCount === testMessages.length) {
    console.log('\n🎉 GPT-3.5 Turbo is working perfectly! Use this model for unlimited requests.');
  } else if (successCount > 0) {
    console.log('\n⚠️ GPT-3.5 Turbo is partially working. Check errors above.');
  } else {
    console.log('\n❌ GPT-3.5 Turbo is not working. Check API key or connection.');
  }
}

// Also test current API status
async function checkAPIStatus() {
  console.log('\n🔍 Checking API Status...');
  console.log('=' .repeat(50));
  
  try {
    // Test with a minimal request
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 1
      })
    });
    
    if (response.ok) {
      console.log('✅ API is accessible');
      console.log('✅ API Key is valid');
      console.log('✅ ChatAnywhere service is online');
    } else {
      const data = await response.json();
      console.log('❌ API returned error:', data.error?.message);
      
      if (response.status === 401) {
        console.log('🔑 Issue: Invalid API key');
      } else if (response.status === 429) {
        console.log('⏱️ Issue: Rate limiting');
      } else {
        console.log(`🚫 Issue: HTTP ${response.status}`);
      }
    }
  } catch (error) {
    console.log('❌ Cannot connect to API');
    console.log('Error:', error.message);
    console.log('\nPossible causes:');
    console.log('1. No internet connection');
    console.log('2. ChatAnywhere API is down');
    console.log('3. Firewall/proxy blocking');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 ChatAnywhere API Diagnostic Test');
  console.log('Testing GPT-3.5 Turbo (should be unlimited)');
  console.log('API Key:', API_KEY.substring(0, 20) + '...');
  console.log('=' .repeat(50));
  
  // First check API status
  await checkAPIStatus();
  
  // Then test GPT-3.5 multiple times
  console.log('');
  await testGPT35Multiple();
  
  console.log('\n💡 RECOMMENDATION:');
  console.log('If GPT-3.5 Turbo works, use it as the default model.');
  console.log('It has no daily limits and should always be available.');
}

// Execute tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
