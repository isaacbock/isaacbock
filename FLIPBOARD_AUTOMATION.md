# Flip Board Image Generation

This repository includes an automated GitHub Action that generates a PNG image of the flip board every 4 hours.

## How it Works

The GitHub Action:

1. **Runs every 4 hours** using a cron schedule (`0 */4 * * *`)
2. **Sets up a headless browser** using Puppeteer
3. **Loads the flip board page** and waits for data to load
4. **Waits for animations to complete** (approximately 8 seconds)
5. **Takes a screenshot** of just the flip board component
6. **Overwrites the same file** (`flipboard.png`) for consistent URL access

## Consistent URL Access

The image is always available at the same URL:

```
https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/flipboard.png
```

This allows you to hardcode the URL in other applications, websites, or documentation without worrying about changing filenames.

## Manual Trigger

You can manually trigger the image generation by:

1. Going to the **Actions** tab in your GitHub repository
2. Selecting **Generate Flip Board Image**
3. Clicking **Run workflow**

## Files Created

- `.github/workflows/generate-flipboard-image.yml` - The GitHub Action workflow
- `flipboard.png` - The generated flip board image (overwritten each time)

## Triggers

The action runs automatically when:

- **Every 4 hours** (scheduled)
- **Manual trigger** via GitHub Actions UI
- **Code changes** to flip board files (`js/app.js`, `css/flipboard.css`, `index.html`)

## Image Details

- **Resolution**: 1200x800 with 2x device scale factor (high DPI)
- **Format**: PNG with background
- **Content**: Just the flip board component (not the full page)
- **Data**: Always uses the latest data from the Nomad List API
- **Filename**: Always `flipboard.png` (never changes)

## Troubleshooting

If the action fails:

1. Check the **Actions** tab for error logs
2. Ensure the API endpoint is accessible
3. Verify the flip board loads correctly on the live site

The action includes proper error handling and timeouts to handle network issues gracefully.
