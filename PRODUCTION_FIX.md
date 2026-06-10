# 🚨 Production Authentication Fix

## Problem
In production, accessing `/admin` redirects to `/login` even after successful login.

## Root Cause
Missing `NEXTAUTH_URL` environment variable in production. This is **required** for NextAuth to work correctly.

## ✅ Solution - Set Environment Variables

### If using Vercel:
1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add/update these variables:
   ```
   NEXTAUTH_URL = https://www.serenityrejuvenation.org
   AUTH_SECRET = 91d8c74ca61c5b731d1e0638c5c77a05a349d5806973f657b06c3e22031a897c
   DATABASE_URL = mongodb+srv://aimahusnain:aimahusnain@cluster0.p203yin.mongodb.net/serenityrejuvenation?retryWrites=true&w=majority
   ```
3. **Important**: Select all environments (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your application

### If using other hosting platforms:
Set the same environment variables in your hosting platform's dashboard.

## 🔍 Verify Environment Variables

After setting up, verify they're active:

### Method 1: Check via API
Create a temporary debug route at `src/app/api/debug/env/route.ts`:
```typescript
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "NOT SET",
    AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  });
}
```
Visit `https://yourdomain.com/api/debug/env` to verify.

### Method 2: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest production deployment
3. Check **Build Logs** for environment variable warnings

## 🧪 Testing After Fix

1. **Clear browser cookies** for your domain
2. **Login** with admin credentials
3. **Access `/admin`** - should stay on admin page
4. **Refresh page** - should stay logged in
5. **Open DevTools → Application → Cookies**
   - Look for `authjs.session-token` cookie
   - Verify it's set and not expired

## 🔧 Additional Cookie Configuration

I've added production cookie configuration to `src/lib/auth.config.ts`:

```typescript
cookies: {
  sessionToken: {
    name: "authjs.session-token",
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: true,  // Only sent over HTTPS in production
      domain: ".serenityrejuvenation.org"  // Works across www and non-www
    }
  }
}
```

## ⚠️ Common Issues

### Issue: "Not logged in" redirect loop persists
**Solution**: Check that `AUTH_SECRET` is identical in development and production

### Issue: Cookies not being set
**Solution**: Verify your domain matches exactly:
- If your site is `https://www.serenityrejuvenation.org`, use that
- If your site is `https://serenityrejuvenation.org` (no www), use that

### Issue: Mixed content errors
**Solution**: Ensure all URLs use HTTPS

## 📋 Quick Checklist

- [ ] `NEXTAUTH_URL` set in hosting platform
- [ ] `AUTH_SECRET` set in hosting platform
- [ ] `DATABASE_URL` set in hosting platform
- [ ] Redeployed application after setting env vars
- [ ] Tested login flow on production
- [ ] Verified cookies are set in browser

## 🚀 After Deploying

Once environment variables are set and redeployed:

1. Clear browser cookies: `serenityrejuvenation.org`
2. Visit `https://www.serenityrejuvenation.org/login`
3. Login with admin credentials
4. Should redirect to `/admin`
5. Refresh page - should stay on `/admin`

---

**Note**: Never commit actual secrets to `.env` file. Always set sensitive values in your hosting platform's environment variables.
