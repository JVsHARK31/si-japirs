# ChatAnywhere AI Integration Guide

## Overview
Si-JAPIRS now uses ChatAnywhere API with support for three powerful AI models.

## Available Models

### 1. Claude Sonnet 4.5 (`claude-sonnet-4-5-20250929`)
- **Best for:** General academic tasks, writing, and research
- **Features:** Fast responses, comprehensive knowledge
- **Use case:** Default model for most academic consultations

### 2. Claude Sonnet 4.5 Thinking (`claude-sonnet-4-5-20250929-thinking`)
- **Best for:** Complex reasoning and problem-solving
- **Features:** Enhanced reasoning capabilities with step-by-step thinking
- **Use case:** Mathematical problems, logic puzzles, complex analysis

### 3. GPT-5 (`gpt-5`)
- **Best for:** Advanced generation and creative tasks
- **Features:** Latest generation capabilities
- **Use case:** Creative writing, advanced research synthesis

## Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
# ChatAnywhere API Configuration
OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
OPENAI_API_BASE=https://api.chatanywhere.tech/v1
```

### Alternative Python Configuration
If you want to use the API in Python:

```python
import openai

client = openai.OpenAI(
    api_key="sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte",
    base_url="https://api.chatanywhere.tech/v1"
)

# Example usage
response = client.chat.completions.create(
    model="claude-sonnet-4-5-20250929",  # or other models
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "Hello!"}
    ]
)
```

## Features

### Model Selection
- Users can switch between models in real-time through the UI
- Model selection is available in the AI Consultation page
- The system remembers the last selected model during the session

### Error Handling
The system includes comprehensive error handling for:
- Invalid API keys
- Rate limiting
- Network issues
- Service unavailability
- Invalid model selection

### API Response Validation
All API responses are validated to ensure:
- Valid response structure
- Presence of required fields
- Proper error messages for debugging

## Usage in the Application

### For Users
1. Navigate to the AI Consultation page
2. Select your preferred AI model from the dropdown
3. Choose the consultation mode (General, ELI5, or Academic)
4. Start chatting!

### For Developers

#### Using the AI Client
```typescript
import { aiClient } from '@/lib/ai-client'

// Set a specific model
aiClient.setModel('claude-thinking')

// Get available models
const models = aiClient.getAvailableModels()

// Make a chat completion
const response = await aiClient.chatCompletion({
  messages: [
    { role: 'user', content: 'Your question here' }
  ],
  mode: 'general',
  model: 'gpt-5'  // optional, uses default if not specified
})
```

#### API Endpoints

**Get Available Models:**
```http
GET /api/ai/models
Authorization: Required (user must be logged in)
```

**Set Current Model:**
```http
POST /api/ai/models
Content-Type: application/json
Authorization: Required

{
  "model": "claude-sonnet" | "claude-thinking" | "gpt-5"
}
```

**Chat Completion:**
```http
POST /api/ai/chat
Content-Type: application/json
Authorization: Required

{
  "messages": [
    {"role": "user", "content": "Your message"}
  ],
  "mode": "general" | "eli5" | "academic",
  "model": "claude-sonnet" | "claude-thinking" | "gpt-5"  // optional
}
```

## Troubleshooting

### Common Issues and Solutions

1. **"Invalid API key" error**
   - Verify the OPENAI_API_KEY in your .env.local file
   - Ensure the key is active and has proper permissions

2. **"Rate limit exceeded" error**
   - The API has usage limits
   - Wait a moment before trying again
   - Consider implementing request queuing

3. **"Model not found" error**
   - Ensure you're using one of the supported models
   - Check for typos in model names

4. **Connection timeout**
   - Check your internet connection
   - The API has a 60-second timeout for responses
   - For long responses, consider implementing streaming

## Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables for all sensitive data
   - Rotate keys regularly

2. **Rate Limiting**
   - Implement client-side rate limiting to prevent abuse
   - Monitor usage to stay within API limits

3. **Input Validation**
   - All user inputs are validated before sending to API
   - Maximum message length is enforced
   - Special characters are properly escaped

## Future Enhancements

- [ ] Add streaming support for real-time responses
- [ ] Implement conversation history with model tracking
- [ ] Add model performance metrics
- [ ] Create model comparison features
- [ ] Add support for custom fine-tuned models

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in the browser console
3. Check the API status at ChatAnywhere
4. Contact support with detailed error information

---

Last Updated: October 2025
Version: 1.0.0
