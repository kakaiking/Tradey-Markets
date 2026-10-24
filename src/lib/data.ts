// Shared mock data for the entire Pipsology platform

export const latestArticles = [
    { id: 1, slug: "eurusd-retests-range-support", title: "EUR/USD Retests Range Support After Sharp Losses", category: "Chart Art", tag: "chart-art", date: "Mar 5, 2026", readTime: "4 min", excerpt: "Price has retested the 1.0450 range support after a sharp 200-pip drop. Watch for bounce confirmation.", image: "/api/placeholder/400/220" },
    { id: 2, slug: "nfp-report-feb-2026", title: "Event Guide: U.S. Non-Farm Payrolls (Feb 2026)", category: "Analysis", tag: "event-guide", date: "Mar 5, 2026", readTime: "6 min", excerpt: "Consensus expects 180K jobs added. Here's how to trade the release in both bull and bear scenarios.", image: "/api/placeholder/400/220" },
    { id: 3, slug: "bitcoin-triangle-breakout", title: "Bitcoin Triangle Breakout and Retest", category: "Trading", tag: "crypto", date: "Mar 5, 2026", readTime: "3 min", excerpt: "BTC broke out of a multi-week symmetrical triangle and is now retesting the breakout level.", image: "/api/placeholder/400/220" },
    { id: 4, slug: "audchf-pullback-setup", title: "Watchlist: AUD/CHF Pullback Setup Emerges", category: "Premium", tag: "watchlist", date: "Mar 4, 2026", readTime: "5 min", excerpt: "After Australia's stronger-than-expected GDP, AUD/CHF is pulling back to key support.", image: "/api/placeholder/400/220" },
    { id: 5, slug: "strait-of-hormuz", title: "Strait of Hormuz Closure: A Global Economic Chokepoint?", category: "News", tag: "macro", date: "Mar 4, 2026", readTime: "7 min", excerpt: "What would a closure of the Strait of Hormuz mean for oil, currencies, and global trade?", image: "/api/placeholder/400/220" },
    { id: 6, slug: "missing-winning-trades", title: "5 Reasons You're Missing Winning Trade Setups", category: "Psychology", tag: "psychology", date: "Mar 4, 2026", readTime: "5 min", excerpt: "Confirmation bias, fear of loss, and over-analysis are silently costing you trades.", image: "/api/placeholder/400/220" },
];

export const calendarEvents = [
    { id: 1, time: "08:30", currency: "USD", event: "Non-Farm Payrolls", impact: "high", forecast: "182K", previous: "143K", actual: "" },
    { id: 2, time: "10:00", currency: "USD", event: "ISM Services PMI", impact: "high", forecast: "53.0", previous: "52.8", actual: "53.4" },
    { id: 3, time: "12:30", currency: "CAD", event: "Employment Change", impact: "high", forecast: "15.0K", previous: "-25.5K", actual: "" },
    { id: 4, time: "14:00", currency: "EUR", event: "ECB President Speech", impact: "medium", forecast: "—", previous: "—", actual: "" },
    { id: 5, time: "15:30", currency: "GBP", event: "Construction PMI", impact: "low", forecast: "48.5", previous: "48.1", actual: "47.9" },
];

export const forumPosts = [
    { id: 1, title: "My 6-month journey from $1K to $8K — lessons learned", category: "Trade Journals", replies: 142, views: "4.2K", timeAgo: "2h ago", author: "PipKing_EA" },
    { id: 2, title: "Does anyone else find EUR/JPY more predictable than EUR/USD?", category: "Trading Discussion", replies: 28, views: "890", timeAgo: "4h ago", author: "SwingMaster_FX" },
    { id: 3, title: "Best broker for scalping in 2026? My top 3 picks", category: "Broker Discussion", replies: 67, views: "2.1K", timeAgo: "6h ago", author: "ScalpKing247" },
    { id: 4, title: "Harmonic patterns — overhyped or genuinely useful?", category: "Trading Systems", replies: 45, views: "1.3K", timeAgo: "1d ago", author: "TraderPsych" },
];

export const courseGrades = [
    { id: "preschool", title: "Beginner", subtitle: "Complete beginner? Start here.", lessons: 6, free: true, progress: 0, color: "#22c55e" },
    { id: "kindergarten", title: "Novice", subtitle: "Brokers, analysis types & chart basics.", lessons: 3, free: true, progress: 0, color: "#22c55e" },
    { id: "elementary", title: "Intermediate", subtitle: "Core technical analysis fundamentals.", lessons: 5, free: true, progress: 0, color: "#4ade80" },
];

export const quizList = [
    {
        slug: "what-is-forex",
        title: "What is Forex?",
        questions: [
            { q: "What does 'Forex' stand for?", options: ["Foreign Exchange", "Forward Exchange", "Fiscal Exchange", "Federal Exchange"], answer: 0, explanation: "Forex is short for Foreign Exchange — the global market for trading currencies." },
            { q: "What is a 'pip' in forex trading?", options: ["A type of currency pair", "The smallest unit of price movement", "A brokerage fee", "A trading session"], answer: 1, explanation: "A pip (Percentage in Point) is the smallest standard unit of price movement in forex, usually 0.0001 for most pairs." },
            { q: "Which is the most traded currency pair in the world?", options: ["GBP/USD", "USD/JPY", "EUR/USD", "AUD/USD"], answer: 2, explanation: "EUR/USD is the world's most traded currency pair, accounting for about 23% of daily forex volume." },
            { q: "Forex trading operates:", options: ["Only on weekdays 9am-5pm EST", "24 hours a day, 5 days a week", "24 hours a day, 7 days a week", "Only during the London session"], answer: 1, explanation: "Forex trades 24/5 — from Sunday 5pm ET to Friday 5pm ET across major financial centers globally." },
        ],
        category: "Basics",
        difficulty: "Beginner",
        completions: "124K",
        score: 85
    },
    { slug: "support-resistance", title: "Support & Resistance Levels", questions: [], category: "Technical", difficulty: "Beginner", completions: "98K", score: null },
    { slug: "candlesticks-101", title: "Japanese Candlesticks 101", questions: [], category: "Technical", difficulty: "Intermediate", completions: "87K", score: null },
    { slug: "fibonacci", title: "Fibonacci Retracements", questions: [], category: "Technical", difficulty: "Intermediate", completions: "72K", score: null },
    { slug: "chart-patterns", title: "Important Chart Patterns", questions: [], category: "Technical", difficulty: "Intermediate", completions: "65K", score: null },
    { slug: "oscillators", title: "Oscillators & Momentum", questions: [], category: "Indicators", difficulty: "Intermediate", completions: "58K", score: null },
    { slug: "elliott-wave", title: "Elliott Wave Theory", questions: [], category: "Advanced", difficulty: "Advanced", completions: "41K", score: null },
    { slug: "trading-style", title: "Which Trading Style Suits You?", questions: [], category: "Lifestyle", difficulty: "Beginner", completions: "95K", score: 100 },
    { slug: "currency-codes", title: "Do You Know Your Currency Codes?", questions: [], category: "Basics", difficulty: "Beginner", completions: "112K", score: null },
    { slug: "pivot-points", title: "Pivot Points", questions: [], category: "Technical", difficulty: "Intermediate", completions: "43K", score: null },
];

export const glossaryTerms = [
    { term: "Pip", slug: "pip", category: "Basics", definition: "The smallest unit of price movement for a currency pair. For most pairs, 1 pip = 0.0001." },
    { term: "Spread", slug: "spread", category: "Trading Costs", definition: "The difference between the bid (buy) price and the ask (sell) price of a currency pair." },
    { term: "Leverage", slug: "leverage", category: "Risk Management", definition: "The use of borrowed capital to increase potential return on investment. Also amplifies losses." },
    { term: "Lot Size", slug: "lot-size", category: "Basics", definition: "Standard lot = 100,000 units. Mini lot = 10,000. Micro lot = 1,000 units of base currency." },
    { term: "Stop Loss", slug: "stop-loss", category: "Risk Management", definition: "A pending order to automatically close a trade at a pre-set loss level to limit risk." },
    { term: "Take Profit", slug: "take-profit", category: "Risk Management", definition: "An order to close a winning trade automatically when price reaches your profit target." },
    { term: "Support", slug: "support", category: "Technical Analysis", definition: "A price level where buying interest is strong enough to prevent further decline." },
    { term: "Resistance", slug: "resistance", category: "Technical Analysis", definition: "A price level where selling pressure is strong enough to prevent further price gains." },
    { term: "RSI", slug: "rsi", category: "Indicators", definition: "Relative Strength Index — a momentum oscillator measuring overbought (>70) and oversold (<30) conditions." },
    { term: "MACD", slug: "macd", category: "Indicators", definition: "Moving Average Convergence Divergence — tracks relationship between two EMAs to spot trend changes and momentum." },
    { term: "Fibonacci", slug: "fibonacci", category: "Technical Analysis", definition: "Retracement tool using key ratios (23.6%, 38.2%, 61.8%) to identify potential support/resistance levels." },
    { term: "Margin", slug: "margin", category: "Account", definition: "The minimum capital required to open and maintain a leveraged trade position." },
];

export const socialPosts = [
    { id: 1, author: "FXProTrader", handle: "@fxprotrader", avatar: "FP", verified: true, pair: "EUR/USD", direction: "SELL", entry: "1.0880", sl: "1.0920", tp: "1.0780", content: "Clean rejection at the 61.8% Fib level on the H4. Watch for a continuation lower toward 1.0780. Strong bearish momentum with MACD crossover confirmation. Risk managed at 1% of account.", likes: 847, comments: 62, time: "2h ago", outcome: "active", chartUrl: "#" },
    { id: 2, author: "CryptoKingdom", handle: "@cryptkingdom", avatar: "CK", verified: false, pair: "BTC/USD", direction: "BUY", entry: "82,400", sl: "80,000", tp: "88,500", content: "Bitcoin broke out of the descending triangle and is retesting the breakout zone. This is a high-probability long setup with a 2.5R reward. Invalidated below $80K.", likes: 1247, comments: 134, time: "4h ago", outcome: "win", chartUrl: "#" },
    { id: 3, author: "SwingMaster_R", handle: "@swingmasterR", avatar: "SM", verified: true, pair: "GBP/JPY", direction: "BUY", entry: "192.40", sl: "191.20", tp: "195.80", content: "Oversold conditions on the RSI with bullish divergence on the H1 chart. Price bounced off the ascending trendline. Targeting the swing high at 195.80.", likes: 524, comments: 38, time: "6h ago", outcome: "active", chartUrl: "#" },
];

export const brokers = [
    { id: 1, slug: "forex-com", name: "FOREX.com", rating: 4.6, minDeposit: "$100", maxLeverage: "50:1", regulation: "NFA, FCA, ASIC", spread: "0.8 pips avg", platform: "MT4, MT5, Own", type: "Market Maker", pros: ["Tight spreads", "Strong regulation", "Great research tools"], cons: ["Higher min deposit", "Limited crypto"], reviews: 843, logo: "FC" },
    { id: 2, slug: "pepperstone", name: "Pepperstone", rating: 4.8, minDeposit: "$200", maxLeverage: "500:1 (ASIC)", regulation: "FCA, ASIC, DFSA", spread: "0.0 pips (Razor)", platform: "MT4, MT5, cTrader", type: "ECN/STP", pros: ["Near-zero spreads", "Fast execution", "cTrader available"], cons: ["No US clients", "Commission on Razor"], reviews: 1204, logo: "PP" },
    { id: 3, slug: "ic-markets", name: "IC Markets", rating: 4.7, minDeposit: "$200", maxLeverage: "500:1", regulation: "ASIC, CySEC, FSA", spread: "0.0 pips (Raw)", platform: "MT4, MT5, cTrader", type: "True ECN", pros: ["Institutional-grade liquidity", "No restrictions on EAs", "Low latency servers"], cons: ["Basic research", "Not available in US"], reviews: 967, logo: "IC" },
];

export const psychologyModules = [
    { id: 1, title: "The Trader's Mindset", slug: "traders-mindset", lessons: 4, icon: "🧠", desc: "Why 90% of traders fail and what separates the 10% who succeed." },
    { id: 2, title: "Emotions & Trading", slug: "emotions", lessons: 5, icon: "😤", desc: "Understanding fear, greed, and FOMO — and how they destroy accounts." },
    { id: 3, title: "Discipline & Consistency", slug: "discipline", lessons: 4, icon: "⚡", desc: "Building the habits that keep you profitable long-term." },
    { id: 4, title: "Risk & Loss Aversion", slug: "risk-loss-aversion", lessons: 3, icon: "🛡️", desc: "Why our brains are wired to lose money and how to rewire them." },
    { id: 5, title: "Revenge Trading", slug: "revenge-trading", lessons: 3, icon: "🔥", desc: "Recognizing and breaking the cycle of revenge trades." },
    { id: 6, title: "Building Your Rules", slug: "trading-rules", lessons: 4, icon: "📋", desc: "Create an ironclad trading plan you'll actually follow." },
];

export const learningPaths = [
    { id: "scalper", title: "Scalper's Path", icon: "⚡", color: "from-blue-500 to-cyan-500", desc: "Master rapid intraday trading on the M1–M15 timeframes.", steps: ["Beginner", "Intermediate", "Market Hours", "Oscillators", "Backtester"], weeks: 3, level: "Intermediate" },
    { id: "swing", title: "Swing Trader", icon: "📊", color: "from-green-500 to-emerald-500", desc: "Capture multi-day moves using H4 and Daily chart patterns.", steps: ["Beginner", "Intermediate", "Chart Patterns", "Fibonacci", "Risk Management"], weeks: 4, level: "Beginner" },
    { id: "price-action", title: "Price Action Purist", icon: "🎯", color: "from-purple-500 to-violet-500", desc: "Trade with no indicators — pure candles, S/R, and structure.", steps: ["Beginner", "Candlesticks", "Support & Resistance", "Chart Patterns", "Multi-TF"], weeks: 5, level: "Intermediate" },
    { id: "news-trader", title: "News Trader", icon: "📰", color: "from-orange-500 to-amber-500", desc: "Trade high-impact economic events with precision entries.", steps: ["Beginner", "Fundamental Analysis", "Economic Calendar", "Trading the News", "Event Guides"], weeks: 3, level: "Beginner" },
    { id: "long-term", title: "Long-Term Investor", icon: "🏦", color: "from-yellow-500 to-gold-500", desc: "Position trading on weekly/monthly charts using macro analysis.", steps: ["Beginner", "Fundamental Analysis", "Currency Correlations", "Carry Trade", "Risk Management"], weeks: 6, level: "Advanced" },
    { id: "crypto", title: "Crypto Trader", icon: "₿", color: "from-orange-400 to-red-500", desc: "Navigate the volatile crypto markets with proven strategies.", steps: ["School of Crypto", "On-Chain Analysis", "Crypto Chart Patterns", "Risk Management", "NFT Basics"], weeks: 4, level: "Beginner" },
];

export const achievements = [
    { id: 1, title: "First Steps", icon: "🎓", desc: "Complete your first lesson", xp: 50, earned: true },

    { id: 3, title: "7-Day Streak", icon: "🔥", desc: "Study 7 days in a row", xp: 200, earned: true },
    { id: 4, title: "Trade Logger", icon: "📓", desc: "Log your first 10 trades", xp: 150, earned: false },
    { id: 5, title: "Chart Master", icon: "📈", desc: "Complete 20 backtesting sessions", xp: 300, earned: false },
    { id: 6, title: "Community Voice", icon: "💬", desc: "Make 25 forum posts", xp: 200, earned: false },
    { id: 7, title: "Pipsology Graduate", icon: "🏆", desc: "Complete all free courses", xp: 500, earned: false },
    { id: 8, title: "Idea Publisher", icon: "🌐", desc: "Post 10 trade ideas to social feed", xp: 250, earned: false },
    { id: 9, title: "Risk Guardian", icon: "🛡️", desc: "Complete Risk Management module", xp: 200, earned: true },
    { id: 10, title: "30-Day Warrior", icon: "⚡", desc: "30-day consecutive study streak", xp: 750, earned: false },

    { id: 12, title: "Top Trader", icon: "⭐", desc: "Reach top 100 on the leaderboard", xp: 1000, earned: false },
];

export const webinars = [
    { id: 1, title: "Weekly Market Outlook: NFP Week Special", host: "Alex Rivera", date: "Mon, Mar 9", time: "09:00 EST", status: "upcoming", registered: 847, image: "/api/placeholder/400/220", category: "Market Outlook" },
    { id: 2, title: "Live Trade Session: Price Action on GBP/USD", host: "Sara Chen", date: "Wed, Mar 11", time: "14:00 EST", status: "upcoming", registered: 524, image: "/api/placeholder/400/220", category: "Live Trade" },
    { id: 3, title: "AMA: From Beginner to Funded Trader in 18 Months", host: "Mike Osei", date: "Fri, Mar 13", time: "16:00 EST", status: "upcoming", registered: 1203, image: "/api/placeholder/400/220", category: "AMA" },
    { id: 4, title: "Risk Management: The Framework That Changed My Account", host: "Priya Nath", date: "Feb 28", time: "Past", status: "replay", registered: 2103, image: "/api/placeholder/400/220", category: "Education" },
    { id: 5, title: "Elliott Wave Theory in Practice — Real Trade Examples", host: "Alex Rivera", date: "Feb 21", time: "Past", status: "replay", registered: 1567, image: "/api/placeholder/400/220", category: "Technical" },
];

export const preschoolLessons: any[] = [];
export const kindergartenLessons: any[] = [];
export const elementaryLessons: any[] = [];

export const curricula: Record<string, any[]> = {
    preschool: preschoolLessons,
    kindergarten: kindergartenLessons,
    elementary: elementaryLessons,
};

export const tradingVideos = [
    {
        id: "v1",
        title: "Forex Trading for Beginners",
        description: "A complete guide to get started in Forex trading from scratch. Learn about currency pairs, pips, leverage, and how the market works.",
        videoId: "oJ9Cz6dPZw0", 
    },
    {
        id: "v2",
        title: "Price Action Trading Strategies",
        description: "Master the art of reading price charts without indicators. Learn about candlestick patterns, support/resistance, and market structure.",
        videoId: "q7J_27yZf7g",
    },
    {
        id: "v3",
        title: "Understanding Risk Management",
        description: "The most important skill in trading. Learn how to calculate position size, set stop losses, and manage your account capital effectively.",
        videoId: "_YVQN6_nkfs",
    },
    {
        id: "v4",
        title: "Trading Psychology",
        description: "Master your emotions and develop a winning mindset. Learn how to handle losses, avoid FOMO, and stay disciplined in your trading plan.",
        videoId: "54Z6Q-hN1yQ",
    },
    {
        id: "v5",
        title: "Top 5 Forex Mistakes",
        description: "Avoid the common traps that wipe out most beginner accounts. Learn why over-leveraging and revenge trading are dangerous.",
        videoId: "y7yEea5L3dE",
    }
];

export const communityEvents = [
    { id: 1, title: "Forex Basics Workshop", date: "2026-05-15", time: "10:00 AM", type: "Webinar", description: "Learn the fundamentals of forex trading in this live workshop.", impact: "medium" },
    { id: 2, title: "Market Analysis Live", date: "2026-05-20", time: "2:00 PM", type: "Live Stream", description: "Join us for a live analysis of the major currency pairs.", impact: "high" },
    { id: 3, title: "Community Meetup", date: "2026-05-25", time: "6:00 PM", type: "Networking", description: "Connect with other traders and share your experiences.", impact: "low" },
];




