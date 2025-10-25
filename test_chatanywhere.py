#!/usr/bin/env python3
"""
Test script for ChatAnywhere API integration with Python
Run with: python test_chatanywhere.py
"""

import os
import json
import time
from typing import Dict, List, Tuple

# Try to import openai, provide instructions if not installed
try:
    import openai
except ImportError:
    print("❌ OpenAI package not installed!")
    print("Please install it with: pip install openai")
    print("Or: python -m pip install openai")
    exit(1)

# API Configuration
API_KEY = "sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte"
API_BASE = "https://api.chatanywhere.tech/v1"

# Available models
MODELS = {
    'claude-sonnet': 'claude-sonnet-4-5-20250929',
    'claude-thinking': 'claude-sonnet-4-5-20250929-thinking',
    'gpt-5': 'gpt-5'
}

def test_model(client: openai.OpenAI, model_key: str, model_name: str) -> Tuple[bool, str]:
    """
    Test a specific model
    
    Args:
        client: OpenAI client instance
        model_key: Short key for the model
        model_name: Full model name
        
    Returns:
        Tuple of (success: bool, message: str)
    """
    print(f"\n🔄 Testing {model_key} ({model_name})...")
    
    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Keep your response brief."},
                {"role": "user", "content": "Say hello and tell me which AI model you are in one sentence."}
            ],
            temperature=0.7,
            max_tokens=100
        )
        
        if response and response.choices:
            content = response.choices[0].message.content
            print(f"✅ {model_key} Success!")
            print(f"   Response: {content}")
            if hasattr(response, 'usage'):
                print(f"   Tokens used: {response.usage.total_tokens}")
            return True, content
        else:
            print(f"⚠️ {model_key} returned unexpected response")
            return False, "Unexpected response structure"
            
    except Exception as e:
        print(f"❌ {model_key} Failed!")
        print(f"   Error: {str(e)}")
        return False, str(e)

def test_all_models() -> Dict[str, bool]:
    """
    Test all available models
    
    Returns:
        Dictionary with model results
    """
    print('🚀 Starting ChatAnywhere API Tests')
    print('=' * 40)
    print(f'API Base: {API_BASE}')
    print(f'API Key: {API_KEY[:10]}...{API_KEY[-5:]}')
    
    # Initialize client
    client = openai.OpenAI(
        api_key=API_KEY,
        base_url=API_BASE
    )
    
    results = {}
    
    # Test each model
    for key, model in MODELS.items():
        success, message = test_model(client, key, model)
        results[key] = success
        
        # Add delay to avoid rate limiting
        time.sleep(1)
    
    return results

def print_summary(results: Dict[str, bool]) -> None:
    """
    Print test results summary
    
    Args:
        results: Dictionary with test results
    """
    print('\n' + '=' * 40)
    print('📊 Test Results Summary:')
    print('=' * 40)
    
    success_count = 0
    for key, success in results.items():
        status = '✅' if success else '❌'
        result = 'PASSED' if success else 'FAILED'
        print(f'{status} {key}: {result}')
        if success:
            success_count += 1
    
    print('\n' + '=' * 40)
    print(f'Total: {success_count}/{len(results)} models working')
    
    if success_count == len(results):
        print('🎉 All models are working correctly!')
    elif success_count > 0:
        print('⚠️ Some models are working, but not all.')
    else:
        print('❌ No models are working. Check your API key.')

def example_usage():
    """
    Show example usage of the ChatAnywhere API
    """
    print('\n' + '=' * 40)
    print('📚 Example Usage in Your Code:')
    print('=' * 40)
    
    example_code = '''
# Initialize the client
import openai

client = openai.OpenAI(
    api_key="sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte",
    base_url="https://api.chatanywhere.tech/v1"
)

# Use Claude Sonnet
response = client.chat.completions.create(
    model="claude-sonnet-4-5-20250929",
    messages=[
        {"role": "user", "content": "Hello!"}
    ]
)
print(response.choices[0].message.content)

# Use GPT-5
response = client.chat.completions.create(
    model="gpt-5",
    messages=[
        {"role": "user", "content": "Explain quantum computing"}
    ]
)
print(response.choices[0].message.content)
'''
    print(example_code)

def main():
    """
    Main function
    """
    try:
        # Run tests
        results = test_all_models()
        
        # Print summary
        print_summary(results)
        
        # Show example usage
        example_usage()
        
    except KeyboardInterrupt:
        print('\n\n⚠️ Tests interrupted by user')
    except Exception as e:
        print(f'\n❌ Fatal error: {e}')
        exit(1)

if __name__ == '__main__':
    main()
