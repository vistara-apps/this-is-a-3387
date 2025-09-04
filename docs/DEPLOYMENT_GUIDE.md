# MemeSynth Deployment Guide

This guide covers deploying MemeSynth to production environments with all necessary configurations.

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with the MemeSynth repository
- Vercel account (free tier available)
- OpenAI API key or OpenRouter API key
- Supabase project (optional)

### Step 1: Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your MemeSynth repository from GitHub
4. Select the repository and click "Import"

### Step 2: Configure Environment Variables

In the Vercel project settings, add these environment variables:

#### Required Variables
```bash
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here
# OR
VITE_OPENROUTER_API_KEY=sk-or-your-openrouter-key-here
```

#### Optional Variables (for full functionality)
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Step 3: Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## 🐳 Docker Deployment

### Build and Run Locally

```bash
# Build the Docker image
docker build -t memesynth .

# Run the container
docker run -p 3000:3000 \
  -e VITE_OPENAI_API_KEY=your-key \
  -e VITE_SUPABASE_URL=your-url \
  -e VITE_SUPABASE_ANON_KEY=your-key \
  memesynth
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  memesynth:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_OPENAI_API_KEY=${VITE_OPENAI_API_KEY}
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## ☁️ AWS Deployment

### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New App" > "Host web app"
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Set Environment Variables**
   - Add the same environment variables as Vercel
   - Deploy the application

### Using EC2 with Nginx

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Configure security groups (ports 80, 443, 22)

2. **Install Dependencies**
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx
   ```

3. **Deploy Application**
   ```bash
   git clone https://github.com/vistara-apps/memesynth.git
   cd memesynth
   npm install
   npm run build
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /path/to/memesynth/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3001;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

5. **Setup SSL**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 🌐 Netlify Deployment

### Via Git Integration

1. **Connect Repository**
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Set Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables

4. **Configure Redirects**
   Create `public/_redirects`:
   ```
   /*    /index.html   200
   ```

### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## 🔧 Environment Configuration

### Development Environment

Create `.env.local`:
```bash
VITE_OPENAI_API_KEY=sk-your-dev-key
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
```

### Staging Environment

Create `.env.staging`:
```bash
VITE_OPENAI_API_KEY=sk-your-staging-key
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-staging-anon-key
```

### Production Environment

Create `.env.production`:
```bash
VITE_OPENAI_API_KEY=sk-your-prod-key
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in project details and create

### 2. Run Database Schema

Execute this SQL in the Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT,
  credits INTEGER DEFAULT 3,
  total_memes_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memes table
CREATE TABLE memes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  enhanced_prompt TEXT,
  image_url TEXT NOT NULL,
  template_used TEXT,
  is_demo BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  sharing_stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  credits_added INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address');

CREATE POLICY "Users can view own memes" ON memes
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users 
      WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    )
    OR is_public = true
  );

CREATE POLICY "Users can insert own memes" ON memes
  FOR INSERT WITH CHECK (
    user_id IN (
      SELECT id FROM users 
      WHERE wallet_address = current_setting('request.jwt.claims', true)::json->>'wallet_address'
    )
  );

-- Indexes for performance
CREATE INDEX idx_users_wallet_address ON users(wallet_address);
CREATE INDEX idx_memes_user_id ON memes(user_id);
CREATE INDEX idx_memes_created_at ON memes(created_at DESC);
CREATE INDEX idx_memes_is_public ON memes(is_public) WHERE is_public = true;
CREATE INDEX idx_payments_wallet_address ON payments(wallet_address);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
```

### 3. Configure API Keys

1. Go to Project Settings > API
2. Copy the Project URL and anon public key
3. Add them to your environment variables

## 🔐 Security Configuration

### API Key Management

1. **Never commit API keys to version control**
2. **Use environment variables for all sensitive data**
3. **Rotate API keys regularly**
4. **Use different keys for different environments**

### Content Security Policy

Add to your `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.openai.com https://openrouter.ai https://*.supabase.co;
  font-src 'self' data:;
">
```

### HTTPS Configuration

Always use HTTPS in production:

1. **Vercel/Netlify**: Automatic HTTPS
2. **Custom domains**: Use Let's Encrypt or CloudFlare
3. **AWS**: Use CloudFront with SSL certificate

## 📊 Monitoring and Analytics

### Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/react @sentry/tracing
```

Configure in `main.jsx`:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### Performance Monitoring

1. **Web Vitals**: Built into Vercel
2. **Google Analytics**: Add tracking ID to environment
3. **Custom metrics**: Use Supabase analytics table

### Health Checks

Create a health check endpoint:

```javascript
// public/health.json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **API Connection Issues**
   - Verify API keys are correct
   - Check CORS settings
   - Ensure environment variables are set

3. **Database Connection Issues**
   - Verify Supabase URL and key
   - Check RLS policies
   - Ensure tables exist

### Debug Mode

Enable debug logging:

```bash
VITE_DEBUG=true npm run dev
```

### Performance Issues

1. **Optimize images**: Use WebP format
2. **Enable compression**: Gzip/Brotli
3. **Use CDN**: CloudFlare or AWS CloudFront
4. **Lazy loading**: Implement for gallery images

## 📈 Scaling Considerations

### Database Scaling

1. **Connection pooling**: Use Supabase connection pooler
2. **Read replicas**: For high-traffic applications
3. **Caching**: Redis for frequently accessed data

### API Rate Limiting

1. **OpenAI limits**: Monitor usage and implement queuing
2. **Supabase limits**: Use connection pooling
3. **Client-side throttling**: Debounce user inputs

### CDN Configuration

1. **Static assets**: Serve from CDN
2. **Image optimization**: Use services like Cloudinary
3. **Global distribution**: Multiple edge locations

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Automated Testing

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## 📝 Post-Deployment Checklist

- [ ] Verify all environment variables are set
- [ ] Test meme generation functionality
- [ ] Check wallet connection works
- [ ] Verify social sharing buttons
- [ ] Test payment flow (if enabled)
- [ ] Check mobile responsiveness
- [ ] Verify HTTPS is working
- [ ] Test error handling
- [ ] Monitor performance metrics
- [ ] Set up alerts for downtime

## 🆘 Support

If you encounter issues during deployment:

1. Check the [troubleshooting section](#-troubleshooting)
2. Review the [GitHub Issues](https://github.com/vistara-apps/memesynth/issues)
3. Join our [Discord community](https://discord.gg/memesynth)
4. Contact support at support@memesynth.app
