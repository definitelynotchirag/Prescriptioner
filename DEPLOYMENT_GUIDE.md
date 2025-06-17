# Prescriptioner App Deployment Guide

## ✅ Completed Setup

### 1. Environment Variables Configuration

#### Server Environment (`/server/.env`)
✅ Already configured for production deployment with:
- MongoDB Atlas connection
- Google OAuth credentials and redirect URIs
- AWS S3 configuration
- CORS origins for production domains
- Render deployment URLs

#### Client Environment (`/client/.env`)
✅ Updated with proper configuration:
```env
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_GOOGLE_CLIENT_ID=495171980207-d5n0p7v6ubb315cssm8d93pm31i3pqoi.apps.googleusercontent.com
# Firebase config included
```

### 2. Frontend API Configuration

✅ **Created centralized API configuration** (`/client/src/config/api.js`):
```javascript
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
export { API_BASE_URL };
```

✅ **Updated all components** to use dynamic API base URL:
- `App.js` - 1 endpoint updated
- `prescriptiondashboard.jsx` - 6 endpoints updated
- `dashboard.jsx` - 4 endpoints updated
- `Calendar.jsx` - 3 endpoints updated
- `prescription.jsx` - 3 endpoints updated
- `GoogleAuthLogin.js` - 2 endpoints updated
- `GoogleAuthSignup.js` - 1 endpoint updated
- `signup.js` - 1 endpoint updated
- `login.js` - 1 endpoint updated
- `GoogleOAuthCallback.js` - 1 endpoint updated
- `MedicationForm.js` - 1 endpoint updated
- `MedicationList.js` - 1 endpoint updated

**Total: 24 API endpoints converted from hardcoded localhost URLs to dynamic configuration**

## 🚀 Deployment Steps

### For Development
1. **Start Backend Server:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm install
   npm start
   ```

### For Production Deployment

#### Option 1: Deploy to Render (Recommended - Backend already configured)

**Backend (already configured):**
- Your server/.env already has Render URLs configured
- Deploy server folder to Render
- Environment variables are already set up

**Frontend:**
1. Update client/.env for production:
   ```env
   REACT_APP_API_BASE_URL=https://your-render-backend-url.onrender.com
   ```

2. Build the app:
   ```bash
   cd client
   npm run build
   ```

3. Deploy the `build` folder to:
   - Render Static Site
   - Netlify
   - Vercel
   - AWS S3 + CloudFront

#### Option 2: Deploy to Vercel

**Backend:**
1. Create `vercel.json` in server folder:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "index.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "/" }]
   }
   ```

**Frontend:**
1. Update client/.env:
   ```env
   REACT_APP_API_BASE_URL=https://your-vercel-backend.vercel.app
   ```

#### Option 3: Deploy to Heroku

**Backend:**
1. Create `Procfile` in server folder:
   ```
   web: node index.js
   ```

**Frontend:**
1. Update client/.env:
   ```env
   REACT_APP_API_BASE_URL=https://your-heroku-app.herokuapp.com
   ```

## 🔧 Environment Variables for Production

### For Backend (.env)
```env
# Database
MONGODB_URI=mongodb+srv://your-atlas-connection-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/oauth2callback

# AWS
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-s3-bucket

# CORS
CORS_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Port
PORT=3001
```

### For Frontend (.env)
```env
# Production API URL
REACT_APP_API_BASE_URL=https://your-backend-domain.com

# Google OAuth (same as backend)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Firebase
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
```

## 📝 Important Notes

1. **Build Status:** ✅ Production build successful
2. **API Endpoints:** ✅ All 24 endpoints updated to use dynamic URLs
3. **Environment Variables:** ✅ All configured for both development and production
4. **CORS Configuration:** ✅ Server already configured for production domains

## 🔍 Quick Test Commands

```bash
# Test development build
cd client && npm start

# Test production build
cd client && npm run build

# Serve production build locally
npx serve -s build -l 3000
```

## 🎯 Next Steps

1. Choose your deployment platform
2. Update `REACT_APP_API_BASE_URL` in client/.env to your production backend URL
3. Deploy backend first, then frontend
4. Update Google OAuth redirect URIs in Google Console to match production URLs
5. Test all functionality in production environment

Your app is now fully configured for deployment! 🚀
