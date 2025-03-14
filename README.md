# Diet Planner Pro

A modern, responsive web application for creating personalized diet plans.

## Features

- Personalized diet plan generation based on user inputs
- Dark/light mode toggle
- Responsive design for all devices
- Modern UI with Tailwind CSS

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Next-themes for dark mode
- Netlify for deployment

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd diet-planner-pro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or with Chrome auto-open
npm run chrome
```

## Deployment to Netlify

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to Netlify:
```bash
npx netlify deploy
```

### Continuous Deployment

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

3. Deploy!

## Environment Variables

Create a `.env.local` file in the root directory:

```
NEXT_PUBLIC_SITE_URL=your-site-url
```

## License

MIT 