# 🚀 FOCUSROOM - COMPLETE DEPLOYMENT GUIDE

Deploy FocusRoom to production in 15 minutes!

---

## 📋 **PREREQUISITES**

✅ GitHub account  
✅ Gemini API key (https://makersuite.google.com/app/apikey)  
✅ BrowserPod API key (from hackathon)  
✅ Railway account (https://railway.app) - for backend  
✅ Vercel account (https://vercel.com) - for frontend  

---

## 🎯 **DEPLOYMENT OVERVIEW**

```
Backend  → Railway   → https://focusroom-api.up.railway.app
Frontend → Vercel    → https://focusroom.vercel.app
```

---

## 📦 **STEP 1: PREPARE YOUR CODE**

### 1.1 Create GitHub Repository

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit - FocusRoom v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/focusroom.git
git push -u origin main
```

### 1.2 Project Structure Should Be:

```
focusroom/
├── backend/
│   ├── agents/
│   ├── routes/
│   ├── services/
│   ├── server.js          ← Use server-production.js
│   ├── package.json       ← Use backend-package-production.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js     ← Use vite.config-production.js
├── .gitignore
└── README.md
```

---

## 🔧 **STEP 2: DEPLOY BACKEND (Railway)**

### 2.1 Create New Project

1. Go to https://railway.app
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `focusroom` repository
5. Railway will auto-detect Node.js

### 2.2 Configure Root Directory

Railway might detect the wrong directory. Fix it:

1. Click **Settings**
2. Set **Root Directory** to `backend`
3. Set **Start Command** to `npm start`

### 2.3 Add Environment Variables

Click **Variables** tab and add:

```bash
NODE_ENV=production
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
BROWSERPOD_API_KEY=your_browserpod_api_key_here
BROWSERPOD_URL=https://api.browserpod.io
FRONTEND_URL=https://focusroom.vercel.app
```

⚠️ **IMPORTANT:** Update `FRONTEND_URL` after deploying frontend!

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Railway will give you a URL like: `https://focusroom-production.up.railway.app`

### 2.5 Test Backend

```bash
curl https://your-backend-url.railway.app/api/health
```

Should return:
```json
{
  "status": "focused",
  "message": "FocusRoom API is running",
  "services": {
    "gemini": true,
    "browserpod": true
  }
}
```

✅ **Backend deployed!** Copy your Railway URL.

---

## 🎨 **STEP 3: DEPLOY FRONTEND (Vercel)**

### 3.1 Update API URL in Frontend

Create `frontend/.env.production`:

```bash
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Example:**
```bash
VITE_API_URL=https://focusroom-production.up.railway.app/api
```

### 3.2 Commit Changes

```bash
git add frontend/.env.production
git commit -m "Add production API URL"
git push
```

### 3.3 Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.4 Add Environment Variables

In Vercel project settings:

```bash
VITE_API_URL=https://your-backend-url.railway.app/api
```

### 3.5 Deploy

1. Click **Deploy**
2. Wait 2-3 minutes
3. Vercel gives you: `https://focusroom.vercel.app`

✅ **Frontend deployed!**

---

## 🔄 **STEP 4: UPDATE BACKEND CORS**

Now that you have your Vercel URL:

### 4.1 Update Railway Environment

Go back to Railway → Variables:

```bash
FRONTEND_URL=https://focusroom.vercel.app
```

### 4.2 Redeploy Backend

Railway auto-redeploys when you change variables.

---

## 🔑 **STEP 5: UPDATE BROWSERPOD API KEY**

### 5.1 Generate Production API Key

1. Go to https://console.browserpod.io/keys
2. Click **"Generate New API Key"**
3. Fill in:
   - **Name:** `FocusRoom Production`
   - **Allowed Origin:** `https://your-backend-url.railway.app`

### 5.2 Update Railway

Replace the old BrowserPod key with the new production key.

---

## ✅ **STEP 6: TEST EVERYTHING**

### 6.1 Test Deployed App

Visit: `https://focusroom.vercel.app`

**Test Checklist:**
- ✅ Landing page loads
- ✅ Can input text
- ✅ Processing works (Gemini AI)
- ✅ URL extraction works (BrowserPod)
- ✅ Hyperfocus Mode works
- ✅ Text-to-speech works
- ✅ Pomodoro timer works

### 6.2 Test Backend API

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Content processing
curl -X POST https://your-backend.railway.app/api/content/process \
  -H "Content-Type: application/json" \
  -d '{"text":"The brain is amazing."}'
```

---

## 🎯 **CUSTOM DOMAIN (OPTIONAL)**

### Backend (Railway)

1. Go to Railway → Settings → Domains
2. Click **"Generate Domain"** or **"Custom Domain"**
3. Follow DNS setup instructions

### Frontend (Vercel)

1. Go to Vercel → Settings → Domains
2. Add your domain (e.g., `focusroom.com`)
3. Update DNS records as shown
4. SSL certificate auto-generates

---

## 🐛 **TROUBLESHOOTING**

### Backend Won't Start

**Check Railway logs:**
```bash
# In Railway dashboard → Deployments → View Logs
```

**Common issues:**
- Missing environment variables
- Wrong root directory
- Port binding issues (Railway sets PORT automatically)

### Frontend Can't Connect to Backend

**Check:**
1. `VITE_API_URL` is correct in Vercel
2. Backend CORS allows your Vercel domain
3. Backend is actually running (health check)

### BrowserPod Errors

**Check:**
1. API key is for production (not localhost)
2. Allowed origin matches Railway URL exactly
3. Include `https://` in allowed origin

### "Module not found" Errors

**In Railway:**
```bash
# Make sure root directory is set to "backend"
```

**In Vercel:**
```bash
# Make sure root directory is set to "frontend"
```

---

## 🔄 **CONTINUOUS DEPLOYMENT**

Both Railway and Vercel auto-deploy on `git push`:

```bash
# Make changes
git add .
git commit -m "Update feature X"
git push

# Railway auto-deploys backend
# Vercel auto-deploys frontend
```

---

## 📊 **MONITORING**

### Railway Metrics

- **Deployments:** See deploy history
- **Logs:** Real-time server logs  
- **Metrics:** CPU, Memory, Network

### Vercel Analytics

- **Traffic:** Page views, unique visitors
- **Performance:** Load times, Core Web Vitals
- **Errors:** Runtime errors in production

---

## 💰 **COSTS**

**Railway:**
- Free tier: $5/month credits
- Hobby plan: $5/month
- Estimated usage: ~$3-5/month

**Vercel:**
- Free tier: Unlimited deploys
- Pro: $20/month (if needed)
- Estimated: FREE for hackathon

**Total:** ~$0-5/month 💸

---

## 🎉 **YOU'RE LIVE!**

Your app is now:
- ✅ Deployed globally
- ✅ Auto-scaling
- ✅ HTTPS secured
- ✅ CI/CD enabled
- ✅ Production-ready

**Share your links:**
- Frontend: `https://focusroom.vercel.app`
- API: `https://focusroom-api.railway.app`

---

## 📝 **FINAL CHECKLIST**

Before the hackathon demo:

- [ ] Test all features on production
- [ ] Verify API keys work
- [ ] Check mobile responsiveness
- [ ] Test with multiple URLs
- [ ] Prepare demo script
- [ ] Share links with team
- [ ] Screenshot working app
- [ ] Test text-to-speech in browser
- [ ] Verify Pomodoro timer
- [ ] Practice 2-minute pitch

---

## 🚨 **EMERGENCY ROLLBACK**

If production breaks:

**Railway:**
1. Go to Deployments
2. Click previous working deployment
3. Click "Redeploy"

**Vercel:**
1. Go to Deployments
2. Find working deployment
3. Click three dots → "Promote to Production"

---

## 🎯 **ALTERNATIVE PLATFORMS**

### Backend Alternatives:
- **Render:** https://render.com (similar to Railway)
- **Fly.io:** https://fly.io (global edge deployment)
- **Heroku:** https://heroku.com (classic PaaS)

### Frontend Alternatives:
- **Netlify:** https://netlify.com (similar to Vercel)
- **Cloudflare Pages:** https://pages.cloudflare.com (fast CDN)
- **GitHub Pages:** Free but no SSR

---

## 💡 **PRO TIPS**

1. **Use Railway Starter Plan** ($5/month) for better performance
2. **Add custom domain** for professional demo
3. **Enable Vercel Analytics** to show traffic during demo
4. **Set up monitoring** to catch issues before judges test
5. **Have backup deployment** on different platform
6. **Test on mobile** - judges might test on phones
7. **Clear browser cache** before demo
8. **Disable browser extensions** during demo

---

## 🏆 **DEMO DAY CHECKLIST**

- [ ] App loads in < 3 seconds
- [ ] Works on Chrome, Safari, Firefox
- [ ] Mobile responsive
- [ ] All features working
- [ ] API keys active
- [ ] No console errors
- [ ] HTTPS working
- [ ] Fast text-to-speech
- [ ] Smooth animations
- [ ] Example content ready

---

**Need help?** Check:
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- GitHub Issues: Create one in your repo

**YOU'RE READY TO WIN! 🏆🧠✨**
