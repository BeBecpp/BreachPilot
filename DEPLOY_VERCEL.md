# Deploy BreachPilot to Vercel

This repository includes a Vercel-ready live demo.

## Fast path with GitHub import

1. Push this folder to a public GitHub repository.
2. Open Vercel and choose **Add New Project**.
3. Import the GitHub repo.
4. Keep the default framework setting as **Other** or **Static**.
5. Deploy.

Vercel will serve:

- `/index.html` as the dashboard
- `/api/investigate` as a Node serverless function
- `/style.css` and `/app.js` as static assets

## CLI path

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

## Important note about Splunk MCP

The Vercel deployment runs the polished public demo with bundled synthetic security data. Real Splunk MCP mode usually belongs in the local Python runtime because Splunk Enterprise and MCP credentials are commonly private/local.

For judging, use the Vercel URL as a public live demo and the README local instructions to show the real Splunk MCP integration path.
