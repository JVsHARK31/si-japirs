/**
 * Direct test of ChatAnywhere API to verify connection
 */

async function testDirectAPI() {
  console.log('🔍 Testing direct ChatAnywhere API connection...\n');

  const API_KEY = 'sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte';
  const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

  const requestBody = {
    model: 'claude-sonnet-4-5-20250929',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Respond in Indonesian language.'
      },
      {
        role: 'user',
        content: 'Halo, siapa kamu dan apa yang bisa kamu bantu?'
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  };

  console.log('📤 Request details:');
  console.log('URL:', API_URL);
  console.log('Model:', requestBody.model);
  console.log('Message:', requestBody.messages[1].content);
  console.log('\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 Response status:', response.status, response.statusText);

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Success!\n');
      console.log('AI Response:', data.choices[0].message.content);
      console.log('\nUsage:', JSON.stringify(data.usage, null, 2));
    } else {
      console.log('❌ Error from API:\n');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log('❌ Network/Connection error:\n');
    console.log(error.message);
    console.log('\nPossible issues:');
    console.log('1. Check internet connection');
    console.log('2. API might be down');
    console.log('3. Firewall/proxy blocking connection');
  }
}

// Also test other models
async function testAllModels() {
  const models = [
    'claude-sonnet-4-5-20250929',
    'claude-sonnet-4-5-20250929-thinking',
    'gpt-5'
  ];

  console.log('\n========================================');
  console.log('Testing all available models:');
  console.log('========================================\n');

  for (const model of models) {
    console.log(`\n📌 Testing ${model}...`);
    
    try {
      const response = await fetch('https://api.chatanywhere.tech/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: 'Say hello in one word' }
          ],
          max_tokens: 10
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${model}: Working - Response: "${data.choices[0].message.content}"`);
      } else {
        console.log(`❌ ${model}: Failed - ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ${model}: Connection failed - ${error.message}`);
    }
  }
}

// Run tests
console.log('🚀 ChatAnywhere API Direct Test\n');
testDirectAPI().then(() => {
  return testAllModels();
}).then(() => {
  console.log('\n✅ Test completed');
}).catch(error => {
  console.error('Fatal error:', error);
});
