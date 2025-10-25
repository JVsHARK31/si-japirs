/**
 * Test real chat functionality with ChatAnywhere API
 */

const API_KEY = 'sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte';
const API_URL = 'https://api.chatanywhere.tech/v1/chat/completions';

// Test conversations with different models
const testConversations = [
  {
    model: 'gpt-5',
    name: 'GPT-5',
    messages: [
      { role: 'user', content: 'Jelaskan konsep machine learning dalam 2 paragraf' }
    ]
  },
  {
    model: 'gpt-4o',
    name: 'GPT-4o',
    messages: [
      { role: 'user', content: 'Apa perbedaan antara AI dan Machine Learning?' }
    ]
  },
  {
    model: 'deepseek-r1',
    name: 'DeepSeek R1',
    messages: [
      { role: 'user', content: 'Jika 2x + 5 = 15, berapakah nilai x?' }
    ]
  },
  {
    model: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    messages: [
      { role: 'user', content: 'Buatkan outline untuk skripsi tentang aplikasi mobile' }
    ]
  }
];

async function testChat(test) {
  console.log(`\n🤖 Testing ${test.name} (${test.model})`);
  console.log('📝 Question:', test.messages[0].content);
  console.log('⏳ Waiting for response...\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: test.model,
        messages: [
          {
            role: 'system',
            content: 'Kamu adalah asisten AI yang membantu mahasiswa. Jawab dalam bahasa Indonesia dengan jelas dan informatif.'
          },
          ...test.messages
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await response.json();

    if (response.ok && data.choices && data.choices.length > 0) {
      console.log('✅ SUCCESS - Real AI Response:');
      console.log('────────────────────────────────');
      console.log(data.choices[0].message.content);
      console.log('────────────────────────────────');
      console.log(`Tokens used: ${data.usage?.total_tokens || 'N/A'}`);
      return true;
    } else {
      console.log('❌ FAILED');
      console.log('Error:', data.error?.message || 'Unknown error');
      return false;
    }
  } catch (error) {
    console.log('❌ CONNECTION ERROR');
    console.log('Error:', error.message);
    return false;
  }
}

async function testMultiTurn() {
  console.log('\n\n🔄 Testing Multi-turn Conversation with GPT-5');
  console.log('═══════════════════════════════════════════════\n');

  const conversation = [
    { role: 'system', content: 'Kamu adalah asisten AI yang membantu dalam pembelajaran. Jawab dalam bahasa Indonesia.' }
  ];

  const turns = [
    'Halo, siapa kamu?',
    'Bisakah kamu membantu saya memahami konsep database?',
    'Apa itu normalisasi database?',
    'Berikan contoh sederhana normalisasi'
  ];

  for (let i = 0; i < turns.length; i++) {
    console.log(`\n👤 User ${i + 1}: ${turns[i]}`);
    conversation.push({ role: 'user', content: turns[i] });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: conversation,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();

      if (response.ok && data.choices && data.choices.length > 0) {
        const aiResponse = data.choices[0].message.content;
        console.log(`🤖 AI: ${aiResponse.substring(0, 200)}${aiResponse.length > 200 ? '...' : ''}`);
        conversation.push({ role: 'assistant', content: aiResponse });
      } else {
        console.log('❌ Error:', data.error?.message || 'Unknown error');
        break;
      }
    } catch (error) {
      console.log('❌ Connection error:', error.message);
      break;
    }

    // Small delay between turns
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function runAllTests() {
  console.log('🚀 ChatAnywhere Real Chat Test');
  console.log('═══════════════════════════════\n');
  console.log('Testing real conversations with different models...');

  let successCount = 0;
  
  // Test each model
  for (const test of testConversations) {
    const success = await testChat(test);
    if (success) successCount++;
    
    // Delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Test multi-turn conversation
  await testMultiTurn();

  // Summary
  console.log('\n\n📊 TEST SUMMARY');
  console.log('═══════════════════════════════');
  console.log(`✅ Successful tests: ${successCount}/${testConversations.length}`);
  
  if (successCount === testConversations.length) {
    console.log('🎉 All models are working with real AI responses!');
    console.log('✨ Chat feature is fully functional!');
  } else if (successCount > 0) {
    console.log('⚠️ Some models are working. Check errors above.');
  } else {
    console.log('❌ No models are responding. Check API configuration.');
  }
}

// Run the tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
