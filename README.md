# Pipsology 💱

A premium Forex education platform built with Next.js 15, React 19, and Tailwind CSS. Pipsology provides a comprehensive curriculum from beginner (Preschool) to professional (Graduation), complete with interactive quizzes, market analysis tools, and a community focus.

## ✨ Features

- **School of Pipsology**: 11 levels of education with structured lessons.
- **Interactive Quizzes**: Test your knowledge after every module.
- **Forexpedia**: Comprehensive reference library for trading terms.
- **MarketVision™**: Real-time market analysis and event guides (Mockup).
- **Social Feed**: Shared trade ideas and community sentiment.
- **Broker Comparisons**: Unbiased reviews of top forex brokers.
- **Psychology Modules**: Master the mental game of trading.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kakaiking/Pipsology.git
   cd TradeyMarkets
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3001/](http://localhost:3001/) with your browser to see the result.

## 📦 Deployment

This project is configured for **Static Site Generation (SSG)** and is ready to be hosted on **GitHub Pages**.

To build the project:
```bash
npm run build
```
The static files will be generated in the `out/` directory.

### GitHub Actions

The repository includes a GitHub Action in `.github/workflows/deploy.yml` that automatically deploys the site to GitHub Pages whenever you push to the `main` branch.

**To enable deployment:**
1. Push your changes to GitHub.
2. Go to your repository settings on GitHub.
3. Navigate to **Pages**.
4. Under **Build and deployment > Source**, select **GitHub Actions**.

## 📂 Project Structure

- `src/app/`: Next.js App Router pages and layouts.
- `src/components/`: Reusable React components.
- `src/lib/`: Shared data, types, and utility functions.
- `public/`: Static assets like images and icons.

---

Built with ❤️ by Pipsology Team.
