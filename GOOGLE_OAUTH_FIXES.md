# Google OAuth Troubleshooting Guide

## ✅ **Fixes Applied:**

### **1. Dynamic Redirect URIs**
- ✅ Frontend now uses `window.location.origin + "/oauth2callback"`
- ✅ Backend accepts redirectUri from request instead of hardcoded value
- ✅ OAuth2Client redirectUri is set dynamically per request

### **2. JWT Token Format**
- ✅ Fixed JWT token field mismatch (`userId` → `id`)
- ✅ Backend now generates tokens compatible with autoLogin route

### **3. Redirect URI Configuration**
- ✅ GoogleAuthLogin component updated
- ✅ GoogleAuthSignup component updated
- ✅ GoogleOAuthCallback component updated

## 🔧 **Testing Steps:**

### **Development (localhost:3000):**
1. Make sure both servers are running:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend  
   cd client && npm start
   ```

2. Visit http://localhost:3000
3. Click "Login with Google" or "Sign up with Google"
4. Complete Google OAuth flow
5. Should redirect back to localhost:3000/oauth2callback
6. Should then redirect to /dashboard with user logged in

### **Production:**
1. Update Google Cloud Console with production redirect URIs:
   ```
   Authorized JavaScript origins:
   - https://your-domain.com
   
   Authorized redirect URIs:
   - https://your-domain.com/oauth2callback
   ```

## 🐛 **Debugging:**

### **Check Browser Console:**
- Look for any JavaScript errors
- Check network requests to /api/auth/google-callback
- Verify token is being stored in localStorage

### **Check Server Logs:**
- Look for "Received Google OAuth callback" message
- Check if tokens are being received from Google
- Verify user creation/login process

### **Common Issues:**

1. **Blank Screen**: Usually means redirect URI mismatch
   - Check Google Cloud Console settings
   - Verify frontend and backend are using same redirect URI

2. **No Token**: JWT generation or storage issue
   - Check server logs for token generation
   - Verify localStorage.setItem is being called

3. **500 Error**: Usually authentication/authorization issue
   - Check Google credentials in server environment
   - Verify Google client secret is set

## 🔗 **Key URLs:**
- Development: http://localhost:3000/oauth2callback
- Production: https://your-domain.com/oauth2callback

Both should be added to Google Cloud Console!
