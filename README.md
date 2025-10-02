# Post Checklist

A WordPress plugin that adds pre-publish checklist panels to help ensure your posts are ready for publication.

## Features

The plugin adds suggestion panels in the pre-publish sidebar when you click "Publish" on a post:

- **Category Check** - Suggests assigning a meaningful category if only the default category is assigned (except when default is "Uncategorized", where Gutenberg's native panel handles it)
- **Internal Links** - Prompts to add at least one internal link to help with SEO and content discovery
- **Excerpt** - Reminds you to add an excerpt for SEO meta descriptions (og:description) with guidance on optimal character count (150-160 characters)
- **Featured Image** - Suggests setting a featured image for social media shares (og:image) and post listings

## Installation

### From Release

1. Download the latest `post-checklist.zip` from the [Releases page](../../releases)
2. Go to WordPress Admin → Plugins → Add New → Upload Plugin
3. Upload the zip file and activate

### Manual Installation

1. Clone this repository into your `wp-content/plugins` directory
2. Run `npm install` to install dependencies
3. Run `npm run build` to build the assets
4. Activate the plugin in WordPress Admin → Plugins

## Development

### Requirements

- Node.js 20+
- npm

### Building

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build and watch for changes
npm start
```

### Project Structure

- `post-checklist.php` - Main plugin file
- `src/` - Source JavaScript and SCSS files
- `build/` - Compiled assets (generated, not in git)
- `.github/workflows/` - GitHub Actions for automated releases

## Creating a Release

1. Update version in `post-checklist.php`
2. Commit your changes
3. Create and push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
4. GitHub Actions will automatically build and create a release with the plugin zip file

## How It Works

The plugin uses WordPress's `PluginPrePublishPanel` component to add custom panels to the pre-publish sidebar. Each panel:

- Only appears when its specific condition is not met
- Uses the same state management pattern as Gutenberg's built-in panels
- Provides actionable guidance on what to add/fix

The panels won't hide if you start making changes within them (e.g., adding an excerpt), ensuring a smooth user experience.

## License

GPL-2.0-or-later

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
