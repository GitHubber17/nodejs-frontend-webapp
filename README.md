# URL Content Fetcher

A simple Node.js web app that fetches and displays the content of any URL. Built with Express.js, designed to run on Azure App Service.

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Enter a URL in the text box
2. Click **Fetch**
3. The app retrieves the page content server-side and displays it as raw text

## Deployment

The app listens on `process.env.PORT` (set automatically by Azure App Service) with a fallback to port `3000`.

### Requirements

- Node.js ≥ 18

## License

[MIT](LICENSE)
