# Production Setup for Serenity Rejuvenation

## Environment Variables Required

Your production deployment MUST have these environment variables configured:

### Authentication
```
AUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"
```

### Database
```
DATABASE_URL="your-production-database-url"
```

## Important Notes

### AUTH_SECRET
- This is CRITICAL for JWT token validation
- Generate a secure random string for production
- Can be generated with: `openssl rand -base64 32`
- MUST be the same as local development if sharing sessions

### NEXTAUTH_URL
- Required for production deployments
- Set to your production domain (e.g., `https://serenityrejuvenation.com`)
- Include the protocol (https://)
- Do NOT include trailing slash

## Platform-Specific Setup

### Vercel
Set environment variables in Project Settings > Environment Variables:
- `AUTH_SECRET`
- `NEXTAUTH_URL` (auto-set by Vercel, but verify)
- `DATABASE_URL`

### Other Platforms
Ensure all three environment variables are set in your hosting platform's dashboard.

## Testing After Deployment

1. Clear your browser cookies for the domain
2. Try logging in with admin credentials
3. Verify you're redirected to `/admin` and stay logged in
4. Check browser console for any errors

## Common Issues

### "Redirect Loop" or "Not Logged In"
- Check `AUTH_SECRET` is set in production
- Check `NEXTAUTH_URL` matches your domain exactly
- Clear browser cookies and try again
- Check browser DevTools > Application > Cookies for session cookie

### Session Not Persisting
- Verify `NEXTAUTH_URL` is set correctly
- Check that cookies are being set (should see `authjs.session-token` cookie)
- Ensure `AUTH_SECRET` matches between server and client

## Updated Files (Recent Changes)

- `src/middleware.ts` - Improved authentication flow with proper role checks
- `src/lib/auth.config.ts` - Simplified to avoid conflicts with middleware
- `src/lib/auth.ts` - Fixed callback configuration
- `src/app/login/page.tsx` - Added redirect parameter handling
- `.env` - Added NEXTAUTH_URL with production placeholder
