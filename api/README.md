# Turm20 Upload API

Node.js/Express API for uploading videos to Cloudflare R2 from the admin panel.

## Deployment to Render

### 1. Create Web Service on Render

1. Go to [render.com](https://render.com) → Dashboard → New → Web Service
2. Connect your GitHub repo `arminisa95/turm20new`
3. Configure:
   - **Name**: `turm20-upload` (or any name)
   - **Runtime**: Node
   - **Build Command**: `cd api && npm install`
   - **Start Command**: `cd api && npm start`
   - **Plan**: Free (or your existing plan)

### 2. Environment Variables

Add these in Render Dashboard → Environment:

```
R2_ENDPOINT=https://73103fc8449ead587aec56ddb303777a.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key_here
R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
R2_BUCKET_NAME=turm20
R2_PUBLIC_URL=https://pub-xxxxxxxxxx.r2.dev  (your R2.dev subdomain)
ADMIN_SECRET=your_random_secret_string_here
PORT=3000
```

**Get R2 credentials:**
- Cloudflare Dashboard → R2 → Manage R2 API Tokens → Create API Token
- OR: R2 → Access Keys → Create Access Key

**ADMIN_SECRET**: Any random string you choose (same one you'll enter in admin panel when uploading)

### 3. Update Admin Panel

After deploying, copy your Render URL (e.g., `https://turm20-upload.onrender.com`) and update in `admin/index.html`:

```javascript
const UPLOAD_API = 'https://turm20-upload.onrender.com';
```

Then commit and push the change.

## API Endpoints

- `POST /upload` - Upload file to R2 (requires `Authorization: Bearer {ADMIN_SECRET}` header)
- `GET /` - Health check

## File Size Limit

500MB per file (configurable in `server.js`)
