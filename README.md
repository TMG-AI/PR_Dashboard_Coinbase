# Coinbase PR Command Center

A production-grade, enterprise PR monitoring dashboard for Coinbase (and white-label clients) built with Next.js, TypeScript, Tailwind CSS, and Google Sheets integration.

## Features
- Real-time PR/social monitoring with Google Sheets API integration
- Advanced filtering, drill-down, and interactive charts
- Crisis alert management and executive reporting
- White-label and client branding support
- Mobile-optimized, responsive, and accessible
- Ready for Vercel deployment

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/pr_dashboard.git
cd pr_dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
- Copy `.env.example` to `.env.local` and fill in your credentials:
```
cp .env.example .env.local
```
- Set your Google Sheets API key and Sheet ID.
- Set branding and app name as needed.

### 4. Google Sheets Integration
- Your Google Sheet must have these columns: `timestamp, platform, content, sentiment_score, reach, author_handle, publication, headline, alert_level`
- Share the sheet with your API service account if needed.
- The dashboard will fetch and parse this data for all visualizations.

### 5. Development
```bash
npm run dev
```

### 6. Production Build & Deployment
```bash
npm run build
npm start
```
- Or deploy instantly to Vercel (recommended):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/your-org/pr_dashboard)

## Environment Variables
See `.env.example` for all required variables:
- `GOOGLE_SHEETS_API_KEY` - Your Google Sheets API key
- `GOOGLE_SHEETS_SHEET_ID` - The ID of your Google Sheet
- `NEXT_PUBLIC_APP_NAME` - App name for branding
- `NEXT_PUBLIC_CLIENT_NAME` - Client/company name

## API Documentation
- All data is fetched from Google Sheets using the Sheets API.
- See `utils/googleSheets.ts` for integration details.

## Customization & White-Label
- Edit `config/clientConfig.ts` to change branding, colors, logo, and alert thresholds.
- Supports multiple clients and white-label deployments.

## Error Handling & Monitoring
- Connection status is shown in the header.
- API errors fallback to cached data and show user-friendly messages.
- Error boundaries and retry logic included for production.

## License
MIT
