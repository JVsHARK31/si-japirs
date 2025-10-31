/**
 * Authentication Setup Test Script
 * This script verifies that all authentication configurations are properly set up
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}===========================================`);
console.log('   Si-JAPIRS Authentication Setup Test');
console.log(`===========================================${colors.reset}\n`);

// Test environment variables
console.log(`${colors.blue}1. Checking Environment Variables...${colors.reset}`);

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'DISCORD_CLIENT_ID',
  'DISCORD_CLIENT_SECRET',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let envCheckPassed = true;
requiredEnvVars.forEach(varName => {
  if (process.env[varName]) {
    // Mask sensitive values
    const value = varName.includes('SECRET') || varName.includes('KEY') || varName.includes('PASSWORD')
      ? '***' + process.env[varName].slice(-4)
      : process.env[varName].slice(0, 30) + '...';
    console.log(`  ${colors.green}✓${colors.reset} ${varName}: ${value}`);
  } else {
    console.log(`  ${colors.red}✗${colors.reset} ${varName}: NOT SET`);
    envCheckPassed = false;
  }
});

console.log('');

// Test Supabase connection
console.log(`${colors.blue}2. Testing Supabase Connection...${colors.reset}`);

async function testSupabase() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by checking auth settings
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    console.log(`  ${colors.green}✓${colors.reset} Supabase connection successful`);
    console.log(`  ${colors.green}✓${colors.reset} Project URL: ${supabaseUrl}`);
    
    return true;
  } catch (error) {
    console.log(`  ${colors.red}✗${colors.reset} Supabase connection failed: ${error.message}`);
    return false;
  }
}

// Test database connection
console.log(`${colors.blue}3. Testing Database Configuration...${colors.reset}`);

function testDatabaseUrl() {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl) {
    try {
      const url = new URL(dbUrl.replace('postgresql://', 'http://'));
      console.log(`  ${colors.green}✓${colors.reset} Database Host: ${url.hostname}`);
      console.log(`  ${colors.green}✓${colors.reset} Database Port: ${url.port || '5432'}`);
      console.log(`  ${colors.green}✓${colors.reset} Database Name: ${url.pathname.slice(1)}`);
      console.log(`  ${colors.green}✓${colors.reset} Database User: ${url.username}`);
      return true;
    } catch (error) {
      console.log(`  ${colors.red}✗${colors.reset} Invalid DATABASE_URL format`);
      return false;
    }
  } else {
    console.log(`  ${colors.red}✗${colors.reset} DATABASE_URL not set`);
    return false;
  }
}

// Test OAuth configurations
console.log(`\n${colors.blue}4. OAuth Providers Configuration...${colors.reset}`);

function testOAuthProviders() {
  const providers = [
    {
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      expectedIdFormat: /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/
    },
    {
      name: 'Discord',
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      expectedIdFormat: /^\d+$/
    }
  ];

  let allValid = true;
  
  providers.forEach(provider => {
    console.log(`\n  ${colors.cyan}${provider.name} OAuth:${colors.reset}`);
    
    if (provider.clientId) {
      if (provider.expectedIdFormat && !provider.expectedIdFormat.test(provider.clientId)) {
        console.log(`    ${colors.yellow}⚠${colors.reset} Client ID format might be incorrect`);
      } else {
        console.log(`    ${colors.green}✓${colors.reset} Client ID: ${provider.clientId.slice(0, 20)}...`);
      }
    } else {
      console.log(`    ${colors.red}✗${colors.reset} Client ID not set`);
      allValid = false;
    }
    
    if (provider.clientSecret) {
      console.log(`    ${colors.green}✓${colors.reset} Client Secret: ***${provider.clientSecret.slice(-4)}`);
    } else {
      console.log(`    ${colors.red}✗${colors.reset} Client Secret not set`);
      allValid = false;
    }
  });
  
  return allValid;
}

// Run all tests
async function runTests() {
  console.log('');
  const dbTestPassed = testDatabaseUrl();
  const oauthTestPassed = testOAuthProviders();
  const supabaseTestPassed = await testSupabase();
  
  console.log(`\n${colors.cyan}===========================================`);
  console.log('              Test Summary');
  console.log(`===========================================${colors.reset}`);
  
  const allPassed = envCheckPassed && dbTestPassed && oauthTestPassed && supabaseTestPassed;
  
  if (allPassed) {
    console.log(`\n${colors.green}✅ All authentication tests passed!${colors.reset}`);
    console.log('\nYour authentication setup is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Navigate to: http://localhost:3000/auth/sign-in');
    console.log('3. Test sign-in with Google and Discord');
  } else {
    console.log(`\n${colors.red}❌ Some tests failed!${colors.reset}`);
    console.log('\nPlease check the following:');
    console.log('1. All environment variables are properly set in .env.local');
    console.log('2. OAuth credentials are correct');
    console.log('3. Supabase project is active and configured');
    console.log('4. Database connection string is valid');
  }
  
  console.log(`\n${colors.cyan}===========================================${colors.reset}\n`);
}

// Execute tests
runTests().catch(error => {
  console.error(`${colors.red}Test execution failed:${colors.reset}`, error);
  process.exit(1);
});
