# 🚀 Deployment Guide

Panduan lengkap untuk deploy **Agri-Gear Manager** ke berbagai platform.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Vercel Deployment](#vercel-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Manual VPS Deployment](#manual-vps-deployment)
6. [Database Setup](#database-setup)
7. [Post-Deployment](#post-deployment)
8. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

- Node.js 18+ installed
- Git repository access
- Supabase project setup
- Domain name (optional)

## 🌍 Environment Variables

### Required Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### Optional Variables

```env
# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Monitoring (optional)
SENTRY_DSN=https://your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project

# Email Service (future feature)
RESEND_API_KEY=your-resend-key
FROM_EMAIL=noreply@your-domain.com
```

## 🚀 Vercel Deployment (Recommended)

### Method 1: GitHub Integration

1. **Connect Repository**
   ```bash
   # Fork atau push ke GitHub repository
   git remote add origin https://github.com/username/agri-gear-manager.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select GitHub repository
   - Configure project settings

3. **Environment Variables**
   ```bash
   # Add in Vercel dashboard
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build completion
   - Visit deployed URL

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Redeploy with env vars
vercel --prod
```

### Custom Domain

```bash
# Add custom domain
vercel domains add your-domain.com
vercel domains add www.your-domain.com

# Configure DNS
# Add CNAME record: your-domain.com -> cname.vercel-dns.com
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Deployment Commands

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Update deployment
docker-compose pull
docker-compose up -d --force-recreate
```

## 🖥️ Manual VPS Deployment

### Server Requirements

- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: 1GB minimum, 2GB recommended
- **Storage**: 10GB minimum
- **CPU**: 1 core minimum

### Setup Steps

1. **Update System**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git nginx
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone Repository**
   ```bash
   cd /var/www
   sudo git clone https://github.com/username/agri-gear-manager.git
   cd agri-gear-manager
   sudo chown -R $USER:$USER .
   ```

5. **Install Dependencies**
   ```bash
   npm ci --only=production
   ```

6. **Setup Environment**
   ```bash
   cp .env.example .env.local
   nano .env.local  # Edit with your values
   ```

7. **Build Application**
   ```bash
   npm run build
   ```

8. **Setup PM2**
   ```bash
   # Create ecosystem file
   nano ecosystem.config.js
   ```

   ```javascript
   // ecosystem.config.js
   module.exports = {
     apps: [{
       name: 'agri-gear-manager',
       script: 'npm',
       args: 'start',
       cwd: '/var/www/agri-gear-manager',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

   ```bash
   # Start with PM2
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

9. **Configure Nginx**
   ```nginx
   # /etc/nginx/sites-available/agri-gear-manager
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   # Enable site
   sudo ln -s /etc/nginx/sites-available/agri-gear-manager /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

10. **Setup SSL with Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com -d www.your-domain.com
    ```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Tables**
   ```sql
   -- Run in Supabase SQL editor
   -- Tables are created automatically via migrations
   -- or manually create using provided schema
   ```

2. **Setup Row Level Security**
   ```sql
   -- Enable RLS on all tables
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
   ALTER TABLE borrowing_requests ENABLE ROW LEVEL SECURITY;
   -- ... other tables
   ```

3. **Create Policies**
   ```sql
   -- Example policy for equipment table
   CREATE POLICY "Users can view equipment" ON equipment
   FOR SELECT USING (true);

   CREATE POLICY "Admins can manage equipment" ON equipment
   FOR ALL USING (
     EXISTS (
       SELECT 1 FROM users 
       WHERE users.id = auth.uid() 
       AND users.role = 'admin'
     )
   );
   ```

4. **Setup Storage Bucket**
   ```sql
   -- Create bucket for equipment photos
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('equipment-photos', 'equipment-photos', true);
   ```

## ✅ Post-Deployment

### 1. Verify Deployment

```bash
# Check application status
curl -I https://your-domain.com

# Check API endpoints
curl https://your-domain.com/api/health
```

### 2. Create Admin User

```bash
# Register first user through UI
# Then update role in Supabase dashboard:
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### 3. Setup Monitoring

```bash
# Install monitoring tools
npm install -g @vercel/analytics
npm install sentry

# Configure alerts
```

### 4. Backup Strategy

```bash
# Automated Supabase backups (built-in)
# Additional backup script:
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### 5. Performance Optimization

```bash
# Enable gzip compression in Nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Set up CDN (Cloudflare recommended)
# Configure image optimization
```

## 🐛 Troubleshooting

### Common Issues

**1. Build Failures**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache
npm cache clean --force
rm -rf .next node_modules
npm install
```

**2. Environment Variables Not Working**
```bash
# Verify variables are set
echo $NEXT_PUBLIC_SUPABASE_URL

# Check .env.local format (no spaces around =)
VARIABLE=value
```

**3. Database Connection Issues**
```bash
# Test Supabase connection
curl -H "apikey: your-anon-key" \
     "https://your-project.supabase.co/rest/v1/users"
```

**4. Permission Errors**
```bash
# Fix file permissions
sudo chown -R $USER:$USER /var/www/agri-gear-manager
chmod -R 755 /var/www/agri-gear-manager
```

**5. SSL Certificate Issues**
```bash
# Renew Let's Encrypt certificate
sudo certbot renew --dry-run
sudo certbot renew
```

### Performance Issues

```bash
# Monitor application
pm2 monit

# Check memory usage
free -h

# Check disk space
df -h

# Optimize database
# Run in Supabase dashboard:
VACUUM ANALYZE;
```

### Rollback Strategy

```bash
# Vercel rollback
vercel rollback https://your-deployment-url.vercel.app

# PM2 rollback
git checkout previous-commit
npm run build
pm2 restart agri-gear-manager
```

## 📊 Monitoring & Alerts

### Application Monitoring

```javascript
// Add to next.config.js
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
  // Performance monitoring
  analytics: {
    id: process.env.VERCEL_ANALYTICS_ID,
  },
}
```

### Uptime Monitoring

```yaml
# .github/workflows/uptime.yml
name: Uptime Check
on:
  schedule:
    - cron: '*/5 * * * *'
jobs:
  uptime:
    runs-on: ubuntu-latest
    steps:
      - name: Check uptime
        run: |
          curl -f https://your-domain.com || exit 1
```

## 📞 Support

For deployment support:
- 📧 **Email**: [deploy-support@agri-gear-manager.com](mailto:deploy-support@agri-gear-manager.com)
- 💬 **Discord**: [Join our community](https://discord.gg/agri-gear-manager)
- 📚 **Docs**: [Deployment Wiki](https://github.com/nopianpdlh/agri-gear-manager/wiki/Deployment)

---

*Happy deploying! 🚀*
