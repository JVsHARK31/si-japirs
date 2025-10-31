# Si-JAPIRS Authentication Setup

This project supports multiple authentication methods through both NextAuth and Supabase.

## Authentication Providers

### 1. Google OAuth
- **Provider**: Google
- **Status**: ✅ Configured
- **Client ID**: Configured in `.env.local`
- **Sign-in Method**: OAuth 2.0

### 2. Discord OAuth
- **Provider**: Discord  
- **Status**: ✅ Configured
- **Client ID**: 1433743928795861053
- **Sign-in Method**: OAuth 2.0

### 3. Email/Password
- **Provider**: Supabase Auth
- **Status**: ✅ Configured
- **Sign-in Method**: Email & Password

## Environment Variables

All authentication credentials are configured in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://postgres:athallah310706@db.dvofigdahianevlsafpy.supabase.co:5432/postgres"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=DuVDHFQ375nlR6lera4fcydqh27NpU1A10Nx8NsEC7Y=

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Discord OAuth
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://dvofigdahianevlsafpy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Supabase Configuration

### Database Connection
- **Host**: [Your Supabase Host]
- **Port**: 5432
- **Database**: postgres
- **User**: postgres
- **Password**: [Your Database Password]

### OAuth Providers in Supabase Dashboard

To enable OAuth providers in Supabase:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/your-project-id/auth/providers)
2. Enable Google OAuth:
   - Client ID: `[Your Google Client ID]`
   - Client Secret: `[Your Google Client Secret]`
   - Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

3. Enable Discord OAuth:
   - Client ID: `[Your Discord Client ID]`
   - Client Secret: `[Your Discord Client Secret]`
   - Redirect URL: `https://dvofigdahianevlsafpy.supabase.co/auth/v1/callback`

## Authentication Flow

### NextAuth Flow (Primary)
1. User clicks "Sign in with Google/Discord"
2. NextAuth handles OAuth redirect
3. User authorizes the application
4. Callback to `/api/auth/callback/[provider]`
5. Session created and stored

### Supabase Auth Flow (Alternative)
1. User clicks "Sign in with Google/Discord"
2. Supabase Auth handles OAuth redirect
3. User authorizes the application
4. Callback to `/auth/callback`
5. Session created in Supabase

## Available Sign-in Pages

1. **Primary Sign-in Page**: `/auth/sign-in/page.tsx`
   - Uses NextAuth providers
   - Supports Google, Discord, and Credentials

2. **Enhanced Sign-in Page**: `/auth/sign-in/page-enhanced.tsx`
   - Uses Supabase Auth
   - Modern UI with animations
   - Split-screen design on desktop

3. **Sign-up Page**: `/auth/sign-up/page.tsx`
   - Uses Supabase Auth
   - Email verification required
   - Terms acceptance

## Protected Routes

The following routes require authentication:
- `/dashboard` - Main dashboard
- `/consult` - AI Consultation
- `/writer` - AI Writer
- `/research` - Research Assistant
- `/summarizer` - Text Summarizer
- `/slides` - Presentation Creator
- `/plagiarism` - Plagiarism Checker
- `/stats` - Statistics
- `/exercises` - Exercise Generator

## Testing Authentication

### Local Development
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000

3. Test sign-in methods:
   - Google OAuth: Click "Continue with Google"
   - Discord OAuth: Click "Continue with Discord"
   - Email: Use the email/password form

### Production Deployment
1. Update environment variables in your hosting platform
2. Set `NEXTAUTH_URL` to your production domain
3. Update OAuth redirect URLs in provider dashboards
4. Deploy the application

## Troubleshooting

### Common Issues

1. **OAuth Redirect Error**
   - Check redirect URLs in provider settings
   - Ensure domain is whitelisted

2. **Session Not Persisting**
   - Check `NEXTAUTH_SECRET` is set
   - Verify cookies are enabled

3. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check Supabase project is active

4. **Provider Not Working**
   - Verify client ID and secret
   - Check provider is enabled in Supabase

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use strong secrets for NEXTAUTH_SECRET**
3. **Enable email verification for signups**
4. **Implement rate limiting on auth endpoints**
5. **Use HTTPS in production**
6. **Regularly rotate OAuth secrets**
7. **Monitor authentication logs**

## Support

For issues or questions:
- Check Supabase logs: [Dashboard](https://supabase.com/dashboard/project/dvofigdahianevlsafpy)
- Review NextAuth documentation: https://next-auth.js.org/
- Contact support: support@si-japirs.com
