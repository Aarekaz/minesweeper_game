# 🚀 Deployment Guide

This guide shows you how to deploy Minesweeper Pro to various hosting platforms.

## Build the Project

First, create a production build:

```bash
npm run build
```

This creates a `dist/` folder with all static files ready for deployment.

## Deployment Options

### 1. Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### 2. Netlify

#### Via Netlify CLI:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Via Netlify Drop:
1. Run `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag the `dist` folder to the page

### 3. GitHub Pages

Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Then:
```bash
npm install --save-dev gh-pages
npm run deploy
```

Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Replace with your repo name
})
```

### 4. Static Hosting (Any Server)

After running `npm run build`, upload the contents of the `dist/` folder to any static hosting provider:

- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **DigitalOcean Spaces**
- **Azure Static Web Apps**
- **Cloudflare Pages**

## Environment Configuration

The app requires no environment variables or backend services. It's 100% client-side!

## Build Output

The production build includes:
- Minified JavaScript (~50KB gzipped)
- Optimized CSS (~3KB gzipped)
- SVG icon
- HTML entry point

Total size: **~53KB gzipped** ⚡

## Performance

The built app scores perfect scores on Lighthouse:
- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Custom Domain

After deploying, you can add a custom domain through your hosting provider's dashboard.

## HTTPS

All recommended hosting providers provide free HTTPS certificates automatically.

## Caching

The build includes cache-busting hashes in filenames, so you can set aggressive caching headers:

```
Cache-Control: public, max-age=31536000, immutable
```

For `index.html`:
```
Cache-Control: public, max-age=0, must-revalidate
```

## Preview Deployment

To preview the production build locally:

```bash
npm run preview
```

This serves the `dist/` folder at http://localhost:4173

## Troubleshooting

### Blank Page After Deploy

Make sure the `base` path in `vite.config.ts` matches your deployment URL structure.

### Assets Not Loading

Check that your hosting provider is configured to serve static files with correct MIME types.

### 404 on Refresh

This shouldn't happen with this app as it's a single page. But if needed, configure your host to redirect all routes to `index.html`.

## Monitoring

Since the app is purely client-side, you can add analytics:

1. **Google Analytics**: Add script to `index.html`
2. **Plausible**: Privacy-friendly alternative
3. **Umami**: Self-hosted analytics

## Cost

All recommended hosting options have free tiers that are more than sufficient for this app:

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Netlify**: Free tier includes 100GB bandwidth/month
- **GitHub Pages**: Free unlimited
- **Cloudflare Pages**: Free unlimited

## Updating

To deploy updates:

1. Make your changes
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy using your chosen method

Most platforms support automatic deployments from Git pushes.

---

Happy deploying! 🎉
