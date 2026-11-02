/**
 * Beginner curriculum seeded from the School-style outline in the product screenshots.
 * Lesson copy is original. Video IDs are public YouTube lessons checked at seed time.
 */

const V = {
    course: "https://www.youtube.com/watch?v=mEyuQVy3OHc",
    terms: "https://www.youtube.com/watch?v=aQNMF5Q5fSM",
    trade: "https://www.youtube.com/watch?v=vP9gmvxdFd8",
    orders: "https://www.youtube.com/watch?v=Era7-qY7mqg",
    start: "https://www.youtube.com/watch?v=ZwL11tUfeXg",
    foundations: "https://www.youtube.com/watch?v=_YVQN6_nkfs",
};

function card(description, question, options, correctIndex) {
    return { description, question, options, correctIndex };
}

function section(title, text, visualType, extras = {}) {
    return {
        title,
        text,
        visualType,
        videoUrl: extras.videoUrl || null,
        questionCards: extras.questionCards || [],
    };
}

function lesson(slug, title, sections) {
    return { slug, title, sections };
}

const lessons = [
    lesson("what-is-forex-trading", "What Is Forex Trading?", [
        section(
            "The market where currencies change hands",
            [
                "Forex, also called FX, is the global market for exchanging one currency for another. A tourist swapping dollars for euros at an airport is doing a tiny version of the same trade banks and funds do all day.",
                "Prices move because people, companies, and governments constantly need foreign currency. Traders try to profit when one currency strengthens or weakens against another. The market runs 24 hours a day from Sunday evening to Friday evening, following the business day from Asia through London to New York.",
            ],
            "l1-intro",
            {
                videoUrl: V.course,
                questionCards: [
                    card(
                        "Forex is the worldwide market for swapping currencies. It is open around the clock on weekdays as trading passes from Asia to Europe to North America.",
                        "What does a forex trade actually exchange?",
                        ["Shares of a company", "One currency for another", "A physical commodity only", "A government bond"],
                        1
                    ),
                    card(
                        "The retail and institutional forex week runs about 24 hours a day, five days a week, not on Saturday.",
                        "When is the forex market open?",
                        ["24 hours a day, 7 days a week", "Weekdays, 9am to 5pm in one city", "24 hours a day, 5 days a week", "Only during the London session"],
                        2
                    ),
                ],
            }
        ),
        section(
            "Speculation versus real-economy flows",
            [
                "Only a small slice of daily volume comes from travel and importing goods. Most volume is financial: banks hedging, funds positioning, and traders betting on the next move in the exchange rate.",
                "If you think the euro will rise against the dollar, you buy EUR/USD. If you are right and the rate rises, you can sell the position back at a better price. If the rate falls, the same position loses money. Direction plus position size decides the result.",
            ],
            "l2-buy-sell"
        ),
    ]),

    lesson("what-is-traded-in-forex", "What is Traded in Forex?", [
        section(
            "Currencies, not company shares",
            [
                "The product is money itself. You trade a currency's value against another currency, as a short-term trade, a longer hold, or something in between. There is no certificate for 'one unit of forex.'",
                "Majors pair the US dollar with the euro, yen, pound, Swiss franc, Canadian dollar, Australian dollar, or New Zealand dollar. Crosses drop the dollar, such as EUR/GBP. Exotics pair a major with a thinner currency, such as USD/TRY, and usually cost more to trade.",
            ],
            "l1-pairs",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "Majors include the US dollar. Crosses are two other major currencies. Exotics involve a less liquid currency and usually a wider spread.",
                        "Which pair is a major?",
                        ["EUR/GBP", "USD/TRY", "EUR/USD", "GBP/ZAR"],
                        2
                    ),
                    card(
                        "A forex position can be held for minutes or for months. The market does not force a single time horizon.",
                        "How long can a currency position be held?",
                        ["Only until the end of the trading day", "A short-term trade, a longer investment, or anything between", "At least one calendar year", "Only during news releases"],
                        1
                    ),
                ],
            }
        ),
        section(
            "What you are not trading",
            [
                "A forex ticket is not a share, a dividend, or a vote in a company. It is an agreement on an exchange rate. Some brokers offer currency ETFs or futures as well, but the lesson at the center of this course is the currency pair.",
                "Stick to liquid pairs while you learn. EUR/USD, USD/JPY, and GBP/USD have tight spreads and plenty of prices to study. Thin exotic pairs can jump and cost more on every entry and exit.",
            ],
            "l1-intro"
        ),
    ]),

    lesson("buying-and-selling-currency-pairs", "Buying And Selling Currency Pairs", [
        section(
            "You always trade two currencies",
            [
                "You cannot buy or sell a currency by itself in this market. Every quote is a pair. The first code is the base currency. The second is the quote currency. EUR/USD at 1.0850 means one euro costs 1.0850 US dollars.",
                "Buying the pair means you buy the base and sell the quote. Selling the pair means the opposite. You are long EUR/USD if you expect the euro to gain on the dollar, and short if you expect the euro to fall.",
            ],
            "l1-pairs",
            {
                videoUrl: V.trade,
                questionCards: [
                    card(
                        "In EUR/USD the euro is the base and the dollar is the quote. The price is how many dollars one euro is worth.",
                        "In GBP/USD, which currency is the base?",
                        ["USD", "GBP", "EUR", "JPY"],
                        1
                    ),
                    card(
                        "Buying a pair buys the base currency and sells the quote currency at the same time.",
                        "Buying EUR/USD means you are:",
                        ["Buying dollars and selling euros", "Buying euros and selling dollars", "Buying both currencies", "Selling both currencies"],
                        1
                    ),
                ],
            }
        ),
        section(
            "How a quote is read",
            [
                "If EUR/USD rises from 1.0850 to 1.0900, the euro bought more dollars. A long position gains. A short position loses the same move. The pair is one price, so the two currencies always move as a seesaw.",
                "Quotes are written with the codes the market already uses: EUR, USD, JPY, GBP, AUD, CAD, CHF, NZD. Learn those eight before you memorize anything else. They cover almost every beginner chart you will open.",
            ],
            "l2-buy-sell"
        ),
    ]),

    lesson("forex-market-size-and-liquidity", "Forex Market Size and Liquidity", [
        section(
            "The largest financial market",
            [
                "Foreign exchange turnover is measured in trillions of US dollars per day. Surveys from the Bank for International Settlements put daily volume around $7.5 trillion, larger than global stock trading.",
                "That size is why major pairs can absorb large orders without the price leaping on every click. Liquidity is the ability to buy or sell quickly, near the price you see. Deep liquidity is the practical benefit of a huge market.",
            ],
            "l1-scale",
            {
                videoUrl: V.course,
                questionCards: [
                    card(
                        "A widely taught BIS figure for global FX turnover is about $7.5 trillion per day. The point is the scale: trillions, not billions.",
                        "About how much is traded in foreign exchange each day?",
                        ["$7.5 billion", "$7.5 trillion", "$75 million", "$750,000"],
                        1
                    ),
                    card(
                        "Liquidity means you can enter and exit near the advertised price. Major pairs are the deepest.",
                        "Why does market size matter to a trader?",
                        ["It guarantees profits", "Deep markets are easier to enter and exit near the shown price", "It removes the spread", "It closes the market on weekends"],
                        1
                    ),
                ],
            }
        ),
        section(
            "When liquidity thins out",
            [
                "Size is not constant through the day. Volume dips between sessions and just before the weekend. Spreads often widen then, and a modest order can move price more than it would at the London open.",
                "News spikes are the other thin moment. Even in EUR/USD, a surprise rate decision can jump the price through several quotes before the book refills. Treat those minutes as expensive, not as free opportunity.",
            ],
            "l5-liquidity"
        ),
    ]),

    lesson("ways-to-trade-currencies", "How to Trade Forex: Ways to Trade Currencies", [
        section(
            "Spot, CFDs, futures, and funds",
            [
                "Spot forex is an agreement to exchange currencies at the current rate, usually settled on a rolling basis for retail accounts. Most beginners meet the market this way, through a broker's platform.",
                "A CFD is a contract that pays the difference between your entry and exit. You do not take delivery of banknotes. Futures trade on exchanges such as the CME with a standard contract size and a clearing house. Options add the right, not the obligation, to trade at a strike. Currency ETFs let you take a currency view inside a stock account.",
            ],
            "k2-platform",
            {
                videoUrl: V.start,
                questionCards: [
                    card(
                        "Retail traders usually deal in spot or CFDs with a broker. Futures are exchange-traded contracts. ETFs sit in a brokerage account like a share.",
                        "Which product is typically traded on an exchange such as the CME?",
                        ["A retail spot CFD", "A currency futures contract", "An airport cash exchange", "A broker's internal spread"],
                        1
                    ),
                    card(
                        "A CFD pays the difference between open and close. You are not shipped physical currency.",
                        "What does a forex CFD settle in?",
                        ["Delivery of cash banknotes", "The price difference on the contract", "Company shares", "A fixed coupon every quarter"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Pick the wrapper that matches the account",
            [
                "The chart of EUR/USD looks similar across products. The rules do not. Futures have exchange margin and a contract calendar. CFDs depend on your broker's financing, leverage cap, and whether the firm is regulated.",
                "Learn the price behavior here, then choose the product your country actually allows. In several regions, spot CFDs are restricted or banned for retail clients, and futures or ETFs are the legal path.",
            ],
            "k1-regulation"
        ),
    ]),

    lesson("how-a-forex-trade-works", "How Forex Trading Makes (and Loses) Money", [
        section(
            "A trade is an open bet on the rate",
            [
                "You make money if the pair moves in the direction of your position by more than the cost of the spread. You lose money if it moves the other way. There is no third outcome where both sides of the pair pay you.",
                "Example: buy EUR/USD at 1.0850 and close at 1.0870. The rate rose 20 pips in your favor. Sell at 1.0850 and buy back at 1.0830 and a short also gains 20 pips. The same 20-pip drop loses money for the buyer.",
            ],
            "l2-how-intro",
            {
                videoUrl: V.trade,
                questionCards: [
                    card(
                        "Profit comes from the exchange rate moving your way after costs. A long needs a higher price. A short needs a lower price.",
                        "A trader who sells EUR/USD profits if the rate:",
                        ["Rises", "Falls", "Stays exactly unchanged", "Only if the stock market rises"],
                        1
                    ),
                    card(
                        "Buying at 1.0850 and selling at 1.0870 is a gain of 20 pips before costs, because the rate increased.",
                        "Buy EUR/USD at 1.1000 and sell at 1.1025. Before the spread, the move is:",
                        ["25 pips against you", "25 pips in your favor", "2.5 pips in your favor", "A loss, because you bought first"],
                        1
                    ),
                ],
            }
        ),
        section(
            "The loss is the same machine in reverse",
            [
                "Leverage makes a small price change a large cash change. That is why a trade can lose money faster than the chart looks dramatic. The loss is not a fee the broker invents. It is the rate moving against the position you chose.",
                "Close the loop on every idea before you enter: where price proves you wrong, how much cash that costs, and where you will take the gain. A trade without an exit is a hope, not a position.",
            ],
            "l6-leverage"
        ),
    ]),

    lesson("when-to-buy-or-sell", "Know When to Buy or Sell a Currency Pair", [
        section(
            "What drives a currency's value",
            [
                "A currency tends to strengthen when global investors want assets denominated in it. Higher interest rates, steady growth, and demand for a country's exports can all pull money in. The opposite pushes the currency down.",
                "You buy a pair when you expect the base currency to beat the quote. You sell when you expect the base to weaken. 'The dollar is strong' is incomplete until you say strong against which currency.",
            ],
            "k3-fundamental",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "Buying the pair expresses a view that the base currency will outperform the quote currency.",
                        "You expect the yen to strengthen against the dollar. A direct way to express that is:",
                        ["Buy USD/JPY", "Sell USD/JPY", "Buy EUR/USD", "Sell GBP/USD"],
                        1
                    ),
                    card(
                        "Interest rates, growth, and capital flows are core fundamental drivers. They do not move price on a timetable you can memorize once.",
                        "Which change often supports a currency?",
                        ["The central bank cuts rates while peers hold steady", "Investors move money into that country's assets", "Exports collapse and capital leaves", "The market is closed"],
                        1
                    ),
                ],
            }
        ),
        section(
            "A reason is not an entry",
            [
                "Fundamentals tell you the story. The chart tells you whether price already agrees. Many traders form a bias from rates and data, then use a level on the chart to decide the actual buy or sell.",
                "If you have no view, you do not have to trade. Flat is a position. Forcing a buy because a session just opened is how small accounts donate the spread all week.",
            ],
            "k3-technical"
        ),
    ]),

    lesson("what-is-a-pip", "What Is a Pip in Forex?", [
        section(
            "Pips and pipettes",
            [
                "A pip is the standard step traders use to measure a move. On most pairs it is the fourth decimal place: 1.0842 to 1.0843 is one pip. On yen pairs it is the second decimal: 150.25 to 150.26 is one pip.",
                "Many brokers quote an extra digit, the pipette, which is one tenth of a pip. On EUR/USD that is the fifth decimal. A move of 1.08421 to 1.08431 is one pip, or ten pipettes. Say which unit you mean when you journal a trade.",
            ],
            "l2-pips-lots",
            {
                videoUrl: V.terms,
                questionCards: [
                    card(
                        "For most pairs a pip is 0.0001. The extra fifth digit, when shown, is a pipette.",
                        "EUR/USD moves from 1.1042 to 1.1043. That is:",
                        ["10 pips", "1 pip", "1 pipette", "100 pips"],
                        1
                    ),
                    card(
                        "Yen pairs are quoted with two decimal places for a pip, not four.",
                        "On USD/JPY, a pip is a change of:",
                        ["0.0001", "0.01", "1.00", "0.00001"],
                        1
                    ),
                ],
            }
        ),
        section(
            "A pip is not a fixed amount of money",
            [
                "The cash value of one pip depends on the pair, the quote currency, and the size of the position. On a standard lot of EUR/USD, one pip is about $10. On a micro lot it is about $0.10. The chart still moved one pip either way.",
                "Convert the result into your account currency when the quote currency is not the one you deposit. Your platform does this, but you should know the order of magnitude before you click.",
            ],
            "l2-pips-lots"
        ),
    ]),

    lesson("lot-size-in-forex", "Lot Size in Forex", [
        section(
            "Standard, mini, micro, and nano",
            [
                "A lot is the unit size of the trade. A standard lot is 100,000 units of the base currency. A mini lot is 10,000. A micro lot is 1,000. A nano lot is 100. Platforms usually show these as 1.00, 0.10, 0.01, and 0.001.",
                "Size is how you turn a pip distance into money. Ten pips on a standard EUR/USD lot is about $100. The same ten pips on a micro lot is about $1. The analysis can be identical. The account result is not.",
            ],
            "l2-pips-lots",
            {
                videoUrl: V.terms,
                questionCards: [
                    card(
                        "Standard is 100,000 of the base currency. Mini is 10,000. Micro is 1,000. Nano is 100.",
                        "How many units of base currency are in a mini lot?",
                        ["1,000", "10,000", "100,000", "100"],
                        1
                    ),
                    card(
                        "On EUR/USD a micro lot makes one pip worth roughly ten cents, about one hundredth of a standard lot.",
                        "If one pip is about $10 on a standard lot of EUR/USD, one pip on a micro lot is about:",
                        ["$10", "$1", "$0.10", "$100"],
                        2
                    ),
                ],
            }
        ),
        section(
            "Choose size from the loss, not the thrill",
            [
                "Decide the cash you can lose if the stop is hit, then back into the lot size. A wider stop needs a smaller position if the dollar risk stays the same. Doubling size because the setup 'looks obvious' doubles the loss when it fails.",
                "New accounts should live on micro or nano lots until position sizing is boring. The goal of the first months is clean process, not a screenshot of a huge winner.",
            ],
            "l6-leverage"
        ),
    ]),

    lesson("what-is-a-spread", "What is a Spread in Forex Trading?", [
        section(
            "The gap that pays a no-commission broker",
            [
                "The spread is the gap between the bid and the ask, quoted in pips. If EUR/USD is 1.08502 bid and 1.08508 ask, the spread is 0.6 pips. You buy at the higher price and sell at the lower one, so a new trade starts slightly negative.",
                "Brokers that advertise zero commission often earn that spread. Other accounts charge a commission and show a raw spread near zero. Compare the all-in cost, not the slogan. A 0.0 pip spread plus a $7 commission can cost more or less than a 0.8 pip spread with no commission, depending on size.",
            ],
            "l5-low-costs",
            {
                videoUrl: V.terms,
                questionCards: [
                    card(
                        "Spread is ask minus bid. It is a trading cost on every round turn, even when the broker shows no separate commission.",
                        "The spread is:",
                        ["Your broker's leverage cap", "The gap between the bid and the ask", "The size of a standard lot", "The interest paid on a winning trade"],
                        1
                    ),
                    card(
                        "A new position is opened at a small loss equal to the spread, before the market moves.",
                        "Why does a trade often open a fraction negative?",
                        ["The platform has a bug", "You buy at the ask and the position is marked toward the bid", "Pips only count after one hour", "Nano lots cannot be priced"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Spreads are not fixed",
            [
                "Major pairs during London and New York often show the tightest spreads. Rollover, holidays, and the minute after a data release can widen them several times over. A stop that looked safe can be filled worse if the spread gaps across it.",
                "Measure spread in pips on the pairs you actually trade, at the hour you actually trade. A strategy that needs a 3-pip target cannot pay a 2-pip spread and survive.",
            ],
            "l5-liquidity"
        ),
    ]),

    lesson("bid-and-ask-price", "Bid and Ask Price in Forex", [
        section(
            "Two prices, one pair",
            [
                "The bid is the price the market will buy the base currency from you. It is where your sell order is filled. The ask, or offer, is the price the market will sell the base currency to you. It is where your buy order is filled.",
                "Example: EUR/USD bid 1.0850, ask 1.0852. A buy is filled at 1.0852. A sell is filled at 1.0850. The two-pip gap is the spread. Charts often plot the bid, so the price you pay to get long can sit a little above the line you drew.",
            ],
            "l2-buy-sell",
            {
                videoUrl: V.trade,
                questionCards: [
                    card(
                        "You buy at the ask and sell at the bid. The ask is the higher of the two in a normal quote.",
                        "Which price do you pay when you buy a pair?",
                        ["The bid", "The ask", "The midpoint, always", "Yesterday's close"],
                        1
                    ),
                    card(
                        "Bid 1.2500 and ask 1.2503 is a spread of 3 pips on a four-decimal pair.",
                        "Bid 1.2500 and ask 1.2503. The spread is:",
                        ["0.3 pips", "3 pips", "30 pips", "1 pip"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Use the right side of the quote",
            [
                "Longs should think about the ask for entry and the bid for exit. Shorts do the reverse. Mixing them up makes a backtest look better than the live ticket.",
                "When you compare brokers, record both sides at the same second on the same pair. A pretty bid with a wide ask is an expensive buy, no matter how the advertisement is worded.",
            ],
            "l5-low-costs"
        ),
    ]),

    lesson("forex-lingo", "Forex Lingo", [
        section(
            "Words you will see every day",
            [
                "Long means you bought the pair. Short means you sold it. Flat means you have no position. Bulls expect a rise. Bears expect a fall. The handle is the big figure of a quote, such as 1.08 in 1.0850, and the rest is the rest of the price.",
                "Leverage is borrowed exposure. Margin is the deposit that supports it. A stop loss closes a loser at a preset price. A take profit closes a winner. Slippage is the difference between the price you clicked and the price you got.",
            ],
            "l1-intro",
            {
                videoUrl: V.terms,
                questionCards: [
                    card(
                        "Long is a buy of the pair. Short is a sell. Flat means no open position.",
                        "A trader who is short GBP/USD has:",
                        ["Bought pounds against dollars", "Sold pounds against dollars", "No position", "Bought both currencies"],
                        1
                    ),
                    card(
                        "Margin is the capital set aside to hold a leveraged position. Leverage is the multiple of exposure that margin supports.",
                        "Margin is best described as:",
                        ["The broker's commission", "The deposit required to keep a leveraged trade open", "Another word for a pip", "The spread on yen pairs"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Say it the way the ticket says it",
            [
                "Going long EUR/USD is not the same sentence as 'I bought dollars.' Precision keeps a journal useful. Write the pair, the direction, the size, and the price.",
                "Slang changes. The mechanics do not. If a term is not on the order ticket or the statement, you do not need it to place a safe trade.",
            ],
            "l4-retail"
        ),
    ]),

    lesson("types-of-forex-orders", "Types of Forex Orders", [
        section(
            "Market, limit, and stop",
            [
                "A market order deals now, at the best available bid or ask. It is simple and it can slip when the book is moving. A limit order waits for your price or better: a buy limit sits below the market, a sell limit sits above it.",
                "A stop-entry order waits for price to push through a level, then deals. Traders use it for breakouts. It is not the same thing as a stop loss, which is attached to a position you already have and closes it if the idea fails.",
            ],
            "k2-platform",
            {
                videoUrl: V.orders,
                questionCards: [
                    card(
                        "A market order fills as soon as possible at the current bid or ask. It does not wait for a better price.",
                        "You want to enter immediately at the current price. You use a:",
                        ["Buy limit far below the market", "Market order", "Take profit with no entry", "Nano lot"],
                        1
                    ),
                    card(
                        "A buy limit is placed below the current price and fills only if the market trades down to it.",
                        "A buy limit order is placed:",
                        ["Above the current price, to chase a rally", "Below the current price, to buy a dip", "Only after the trade is already closed", "At a random time by the broker"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Stops and targets that work while you are away",
            [
                "A stop loss caps the damage if price goes the wrong way. A take profit banks the gain at a level you chose. A trailing stop walks the stop behind price as the trade works, giving back a set distance.",
                "None of these remove gap risk. If the market reopens through your stop, the fill can be worse than the price you typed. Know that before you size the trade as if the stop were a promise.",
            ],
            "l6-margin-call"
        ),
    ]),

    lesson("order-types-cheat-sheet", "Trading Order Types Cheat Sheet", [
        section(
            "What each order is for",
            [
                "Market: use it when being in the trade matters more than a perfect price. Limit: use it when you will only deal at your number or better, and you can accept missing the trade. Stop-entry: use it when you only want in if price proves itself by trading through a level.",
                "Stop loss: define the invalidation before entry. Take profit: define the pay. Trailing stop: protect an open winner without babysitting the screen. One-cancels-the-other links two pending orders so the fill of one deletes the other.",
            ],
            "k2-platform",
            {
                videoUrl: V.orders,
                questionCards: [
                    card(
                        "A stop loss is an exit for a live position. A stop-entry is a way to open a new position after price breaks a level.",
                        "Which order is designed to close a losing position?",
                        ["Buy limit", "Stop loss", "Stop-entry above the highs", "A chart template"],
                        1
                    ),
                    card(
                        "A limit order only fills at the chosen price or a better one. That precision can mean the order never trades.",
                        "The tradeoff of a limit order is:",
                        ["It always fills instantly, at any price", "You may miss the trade if price never reaches your level", "It removes the spread", "It doubles your leverage"],
                        1
                    ),
                ],
            }
        ),
        section(
            "A small field guide",
            [
                "If you are buying: market buys the ask now, buy limit waits under price, buy stop waits above price. If you are selling: market sells the bid now, sell limit waits above price, sell stop waits below price.",
                "Write the order type next to the reason. 'Breakout, so buy stop' is a plan. 'I will decide live' is how slips and fat fingers show up in the journal.",
            ],
            "l2-buy-sell"
        ),
    ]),

    lesson("forex-demo-account", "Forex Demo Account", [
        section(
            "Practice with prices, not with rent money",
            [
                "A demo account uses live or delayed quotes and virtual funds. You place the same order types, on the same platform, and the balance moves as if the cash were real. The market does not pay you and it cannot take your savings.",
                "Use it to learn the ticket: lot size, bid and ask, stops, and how a statement looks after a week. Treat the fake balance as small. A demo funded with a million dollars teaches nothing about the position size you will actually run.",
            ],
            "k2-platform",
            {
                videoUrl: V.start,
                questionCards: [
                    card(
                        "Demo trading uses virtual funds. Losses do not leave your bank account, and wins are not withdrawable cash.",
                        "What is at risk on a demo account?",
                        ["Your deposited savings", "Virtual funds and your practice habits", "The broker's license", "A standard lot of physical euros"],
                        1
                    ),
                    card(
                        "A huge virtual balance hides bad sizing. Match the demo to the account you intend to open.",
                        "Why should demo balance resemble your real starting balance?",
                        ["Platforms reject small demos", "So position size and emotions are closer to live trading", "Spreads only exist above $1 million", "It makes every trade a winner"],
                        1
                    ),
                ],
            }
        ),
        section(
            "What a demo will not teach",
            [
                "Fills on a demo are often kinder than live fills in a news spike. You also will not feel a real loss. That is why a demo proves you can follow a process, and a small live account proves you can follow it when it stings.",
                "Move to real money only after you can explain every closed demo trade: the setup, the risk, and whether you broke your own rule. There is no prize for months of random clicking.",
            ],
            "l4-retail"
        ),
    ]),

    lesson("can-you-get-rich-trading-forex", "Can You Get Rich By Trading Forex?", [
        section(
            "Possible is not typical",
            [
                "A few people build meaningful money from trading. Most beginners lose. The market does not owe you a salary, and leverage makes it easy to turn a small account into zero before the skill shows up.",
                "Wealth here, when it happens, comes from staying solvent long enough to get competent: small risk per trade, a tested process, and years of review. Luck can hand you one month. It will not hand you a career.",
            ],
            "l6-margin-call",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "Leverage magnifies losses as well as gains. Most new traders lose money. Treat income claims as marketing.",
                        "What is a realistic view of getting rich from forex?",
                        ["A funded account is guaranteed after preschool", "It is possible and uncommon, and most beginners lose", "Profit is locked in by the spread", "Demo profits transfer to your bank"],
                        1
                    ),
                    card(
                        "Survival comes before returns. Risking a tiny slice of the account is what keeps you in the game.",
                        "What matters first if the aim is to last long enough to improve?",
                        ["The largest leverage the broker allows", "Risk small enough that a losing streak does not end the account", "Trading every session including weekends", "Copying a stranger's signals"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Replace the fantasy with a scoreboard",
            [
                "Track expectancy, not vibes: average win, average loss, and how often you follow the plan. A dull positive expectancy compounded on a small risk is the only 'get rich' path that survives contact with a statement.",
                "If you need this month's rent from the next trade, you are not trading. You are gambling with a clock. Get the living expenses from somewhere else until the account can lose for a month without changing your life.",
            ],
            "l6-leverage"
        ),
    ]),

    lesson("forex-trading-sessions", "Forex Trading Sessions", [
        section(
            "Open all day does not mean active all day",
            [
                "The week is split into four overlapping sessions: Sydney, Tokyo, London, and New York. The market does not close between them. Activity rises when a financial center's banks and companies come to work, and it fades when they leave.",
                "Approximate UTC hours: Sydney from 21:00, Tokyo from 00:00, London from 07:00, New York from 12:00, each running about eight or nine hours. The clock shifts with daylight saving, so check a session tool rather than memorizing one screenshot.",
            ],
            "l3-sessions",
            {
                videoUrl: V.course,
                questionCards: [
                    card(
                        "The four centers traders watch are Sydney, Tokyo, London, and New York. They overlap instead of running as separate markets.",
                        "Which set names the four major forex sessions?",
                        ["London, New York, Tokyo, Sydney", "Only London and New York", "Chicago, Frankfurt, Hong Kong, Dubai", "The weekend sessions"],
                        0
                    ),
                    card(
                        "Volume clusters when a major center is open. A 24-hour chart still has quiet hours.",
                        "Why can a 24-hour market still be a bad time to trade?",
                        ["The spread is always zero at night", "Liquidity and ranges drop between the busy sessions", "Pairs stop updating after Tokyo", "Orders are rejected outside New York"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Overlap is where the range usually lives",
            [
                "The London and New York overlap, roughly 12:00 to 16:00 UTC, is the busiest stretch of the day. Spreads are often tight and ranges are often wide, which is why day traders camp there.",
                "Quiet hours are not useless. They are a bad place for a strategy that needs movement, and a less bad place for one that needs calm. Match the session to the setup instead of trading the whole clock.",
            ],
            "l3-overlap"
        ),
    ]),

    lesson("tokyo-session", "When Can You Trade Forex: Tokyo Session", [
        section(
            "Where the forex day gets going",
            [
                "The Tokyo session, often called the Asian session, is where the trading day finds its first real flow after Sydney. It is the home session for yen crosses and a heavy one for AUD and NZD as Sydney's morning overlaps it.",
                "Ranges are often narrower than London. That punishes strategies that need a large intraday swing, and it suits traders who want calmer yen price action. Economic releases from Japan, Australia, and China land in this window.",
            ],
            "l3-sessions",
            {
                videoUrl: V.course,
                questionCards: [
                    card(
                        "Tokyo is the main Asian session and the natural home of yen pairs.",
                        "Which pairs usually see their most natural flow in Tokyo?",
                        ["Only GBP/CHF", "Yen pairs, plus AUD and NZD during the Sydney overlap", "US stock index futures exclusively", "No pairs, Tokyo is display-only"],
                        1
                    ),
                    card(
                        "Asian hours are often quieter than the London open. Expect smaller ranges on many dollar majors.",
                        "Compared with London, the Tokyo session is often:",
                        ["Always more volatile on EUR/USD", "Quieter, with smaller ranges", "Closed to retail traders", "The only time spreads are zero"],
                        1
                    ),
                ],
            }
        ),
        section(
            "How to use a quiet session",
            [
                "If your playbook is breakout momentum on GBP/USD, Tokyo will bore you and then charge you the spread. If you trade USD/JPY levels, this is core screen time.",
                "Mark the Asian range. London frequently uses that high and low as the first liquidity pool of the European morning. You do not have to trade Tokyo to use what Tokyo built.",
            ],
            "l5-liquidity"
        ),
    ]),

    lesson("london-session", "When Can You Trade Forex: London Session", [
        section(
            "The center of daily volume",
            [
                "London is the main hub of spot foreign exchange and handles on the order of 30 percent or more of global turnover, depending on the survey year. EUR, GBP, and CHF pairs wake up here.",
                "The open can be sharp. Price often runs the Asian high or low in the first hours, and European data plus Bank of England or ECB headlines land while this session is in full swing.",
            ],
            "l3-sessions",
            {
                videoUrl: V.trade,
                questionCards: [
                    card(
                        "London is the largest FX center by turnover and the main session for euro and pound pairs.",
                        "London's role in spot FX is best described as:",
                        ["A minor session with almost no volume", "The largest center, with a large share of daily turnover", "A stock-only session", "Open only on Fridays"],
                        1
                    ),
                    card(
                        "European data and UK or eurozone policy news are released while London is active.",
                        "Which pairs does the London session usually bring to life?",
                        ["EUR and GBP pairs", "Only crypto crosses", "None, until New York", "Exotics exclusively"],
                        0
                    ),
                ],
            }
        ),
        section(
            "Trade the open on purpose",
            [
                "The first hour is not a requirement. Spreads can be jumpy into the fix and into data. If your plan needs a settled book, wait until the opening auction of stops has printed.",
                "Liquidity is a tool. Tighter spreads in London make small targets more realistic than they are at 21:00 UTC. They do not make a bad level a good level.",
            ],
            "l3-overlap"
        ),
    ]),

    lesson("new-york-session", "When Can You Trade Forex: New York Session", [
        section(
            "The dollar's home session",
            [
                "New York overlaps London for roughly the first four hours, and that overlap is the deepest liquidity of the day. US data, Federal Reserve speakers, and equity-market flows hit the dollar pairs here.",
                "After London goes home, ranges often compress. The afternoon can trend if a morning release repriced everything, or it can drift. USD/CAD and the major dollar pairs are the natural focus.",
            ],
            "l3-overlap",
            {
                videoUrl: V.trade,
                questionCards: [
                    card(
                        "The London–New York overlap is typically the highest-volume part of the forex day.",
                        "The busiest part of the New York session is usually:",
                        ["The last hour before the weekend, always", "The overlap with London", "Sunday evening only", "When Tokyo is closed and London has not opened"],
                        1
                    ),
                    card(
                        "US releases and dollar flows dominate this window, along with USD/CAD.",
                        "New York is the primary session for:",
                        ["Ignoring the US dollar", "US data and dollar pairs", "Only Australian pairs", "Physical gold delivery"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Know when the day is actually over",
            [
                "A strategy that faded the London move sometimes gets paid in New York, and sometimes gets run over by a 12:30 UTC payrolls print. Check the calendar before you treat the afternoon as a quiet fade.",
                "Into the US close, books thin and spreads edge out. If your target is three pips, late New York is an expensive place to hunt it.",
            ],
            "l3-sessions"
        ),
    ]),

    lesson("best-times-of-day", "Best Times of Day to Trade Forex", [
        section(
            "Volatility and liquidity together",
            [
                "The useful hours are the ones with enough range to pay your target and enough depth to keep the spread small. For many day traders that is the London morning through the London–New York overlap.",
                "There is no universal best hour. A yen mean-reversion system can prefer Tokyo. A news system lives on the clock of the calendar, not the session nickname. Measure the average range of your pair by hour and keep the hours that pay after spread.",
            ],
            "l3-overlap",
            {
                videoUrl: V.course,
                questionCards: [
                    card(
                        "The best window has movement and tight spreads. For a lot of intraday dollar and European pairs, that is London into the New York overlap.",
                        "A practical 'best time' for many intraday EUR/USD traders is:",
                        ["Saturday afternoon", "London through the New York overlap", "The five minutes after a bank holiday reopens, always", "Any hour, because the spread never changes"],
                        1
                    ),
                    card(
                        "Session choice follows the pair and the strategy. Copying someone else's clock without measuring your pair is guesswork.",
                        "How should you pick your trading hours?",
                        ["Trade every hour so you miss nothing", "Match hours to your pair's range, spread, and your strategy", "Only trade when you feel excited", "Avoid London because it is too liquid"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Hours to treat carefully",
            [
                "The daily rollover, major data minutes, and the late Friday run into the weekend are when spreads widen and gaps appear. You can trade them. You cannot pretend they cost the same as a calm overlap.",
                "If you have a job, pick one window you can watch properly. A focused London open beats a phone glanced at during every session.",
            ],
            "l5-liquidity"
        ),
    ]),

    lesson("best-days-of-the-week", "Best Days of the Week to Trade Forex", [
        section(
            "The middle of the week does the work",
            [
                "Tuesday, Wednesday, and Thursday usually carry the cleanest institutional flow. The market has picked a direction after Monday's positioning, and it has not yet started the Friday flatten.",
                "Monday can be a continuation of the weekend gap or a slow rebuild of ranges. It is tradable and it is often messy. Do not assume the weekly trend reveals itself in the first Asian session.",
            ],
            "l3-sessions",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "Midweek sessions typically see the most consistent participation. Friday liquidity often fades as traders cut risk.",
                        "Which stretch is usually the most reliable for intraday flow?",
                        ["Saturday and Sunday", "Tuesday through Thursday", "Only the first Monday of the month", "Friday after lunch, always"],
                        1
                    ),
                    card(
                        "Friday afternoons often see position cutting ahead of the weekend, when the market is shut and gaps can form.",
                        "Why do many traders cut risk on Friday?",
                        ["Spreads are legally zero", "The market closes for the weekend and prices can gap on reopen", "Lots cannot be traded on Fridays", "Tokyo is the only session open"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Calendar beats the day of the week",
            [
                "A Wednesday with no data and a Wednesday with a central-bank decision are different markets. Let the calendar override the proverb about 'best days.'",
                "Your own stats matter more than a blog's. If your setup loses on Mondays for a year, stop trading Mondays. That is research. Avoiding Thursday because of a nickname is not.",
            ],
            "k3-fundamental"
        ),
    ]),

    lesson("forex-market-structure", "Forex Market Structure", [
        section(
            "No single building called the forex exchange",
            [
                "Spot FX is over the counter. Deals happen between banks, on electronic platforms, and through brokers, not on one central floor that sets an official price. That is why two brokers can show a slightly different EUR/USD at the same second.",
                "Competition among liquidity providers is what tightens the price. If one bank's quote is stale, another steps in. The quote you see is a blend your broker assembled, plus their spread.",
            ],
            "l4-major-players",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "Spot forex is decentralized. There is no single official exchange price the way there is for a listed stock.",
                        "Why can two brokers show slightly different EUR/USD prices?",
                        ["One of them is always illegal", "Spot FX is over the counter, so quotes are not a single exchange print", "Pips are random", "Only one broker is allowed to stream prices"],
                        1
                    ),
                    card(
                        "Banks and other liquidity providers compete to quote. That competition is what keeps major-pair spreads tight in liquid hours.",
                        "What keeps prices competitive in a decentralized market?",
                        ["A daily government fix that all trades must use", "Competition between liquidity providers", "Retail traders setting the bid", "The weekend auction"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Where your order actually goes",
            [
                "Some brokers pass orders to liquidity providers. Some internalize flow and take the other side. The label on the website matters less than regulation, how withdrawals work, and whether your fills look fair versus a second quote.",
                "You do not need a seat at an interbank desk to trade. You do need to know you are a customer of a broker, not a peer of a central bank.",
            ],
            "k1-broker-intro"
        ),
    ]),

    lesson("who-trades-forex", "Forex Market Players", [
        section(
            "Five groups move the price",
            [
                "Commercial and investment banks quote prices and hedge client flow. That interbank layer is the core of the market. Central banks show up when policy or the currency itself is the mission, and their orders can reset a trend.",
                "Corporations trade to pay for goods and to hedge revenue, not to scalp pips. Hedge funds and asset managers speculate or hedge portfolios. Retail traders, the individual accounts, are the smallest slice of volume and the group this course is written for.",
            ],
            "l1-participants",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "The main groups are banks, central banks, corporations, funds, and retail traders. Banks are the core of pricing.",
                        "Who sits at the center of spot FX pricing?",
                        ["Retail traders on mobile apps", "Banks and other large liquidity providers", "A single stock exchange", "Tourist cash desks"],
                        1
                    ),
                    card(
                        "Central banks trade for policy reasons. Their participation is occasional and can be large.",
                        "A central bank in the FX market is usually trying to:",
                        ["Scalp three pips on EUR/USD", "Implement policy or influence the currency", "Replace the retail spread", "Close the market every night"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Trade like the small account you are",
            [
                "You will not out-information a rates desk. You can avoid paying them tuition: liquid hours, defined risk, and no need to be in every move they create.",
                "When a central bank is in the market, spreads and slippage change character. Step aside or cut size. Heroics against official flow are how accounts end.",
            ],
            "l4-major-players"
        ),
    ]),

    lesson("retail-forex-history", "Know Your Retail Forex History", [
        section(
            "From bank lines to a phone app",
            [
                "For decades, FX was a wholesale market. Retail access grew in the late 1990s and 2000s as online brokers offered smaller lot sizes, margin, and platforms such as MetaTrader. The nano and micro lot is what made a lesson like this useful to someone without a dealing desk.",
                "That access came with a record. In several regulators' disclosures, a large majority of retail CFD accounts lose money. The history of retail FX is a history of easier access, higher leverage than stocks, and painful statements.",
            ],
            "l1-history",
            {
                videoUrl: V.start,
                questionCards: [
                    card(
                        "Retail forex scaled up when online brokers offered small lots and margin to individuals, mostly from the late 1990s onward.",
                        "What changed to let individuals trade FX without a bank dealing desk?",
                        ["Currencies were invented in 2008", "Online brokers, smaller lots, and margin", "The stock market closed", "Pipettes became illegal"],
                        1
                    ),
                    card(
                        "Regulator risk warnings exist because most retail leveraged accounts lose. The tool is newer than the outcome.",
                        "A fair reading of retail FX history is:",
                        ["Nearly every new account is profitable", "Access got easier, and most retail leveraged accounts still lose", "Leverage was banned at the start", "Only corporations were ever allowed to lose money"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Use the history as a risk rule",
            [
                "The brokers that survived are the ones clients could withdraw from. Regulation, segregated funds where the law requires them, and a boring withdrawal test matter more than a welcome bonus.",
                "You are early enough in the story to skip the famous mistakes: 500:1 as a personality, martingale after a loss, and signals sold by someone who cannot show a verified loss.",
            ],
            "l4-retail"
        ),
    ]),

    lesson("what-makes-fx-unique", "Why Trade Forex: What Makes FX Unique", [
        section(
            "A market built differently from stocks",
            [
                "FX trades as pairs, almost around the clock on weekdays, with deep liquidity in the majors and leverage that is high compared with a cash stock account. You can sell first just as easily as you buy first. There is no uptick rule and no borrow to locate.",
                "Costs on majors can be a fraction of a pip in busy hours. The same market will charge you, through spread and slippage, the moment you trade it like a casino during news. The unique part is the access. The bill still arrives.",
            ],
            "l5-liquidity",
            {
                videoUrl: V.course,
                questionCards: [
                    card(
                        "Shorting a pair is a normal order, not a special locate. Buying and selling are symmetric.",
                        "Which feature is native to forex?",
                        ["You can only buy, never sell", "Selling a pair is as straightforward as buying it", "The market is open all weekend", "Every pair pays a dividend"],
                        1
                    ),
                    card(
                        "Weekday 24-hour trading and deep major-pair liquidity are the practical reasons traders start here.",
                        "A real advantage of major FX pairs is:",
                        ["Guaranteed daily profit", "Long hours and deep liquidity", "No spread at any hour", "Prices that never gap"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Unique does not mean easy",
            [
                "Leverage is the feature that gets mis-sold as the benefit. It is optional risk. A trader who uses micro lots and a 1 percent stop is using the market's hours and liquidity, not its most dangerous setting.",
                "Choose FX if the hours fit your life and the pairs fit your interest in macro. Do not choose it because a thumbnail said the market is too big to lose in.",
            ],
            "l6-leverage"
        ),
    ]),

    lesson("forex-vs-stocks", "Forex vs. Stocks: Key Differences", [
        section(
            "No single name can corner the majors",
            [
                "A stock can be squeezed because the supply of shares is finite and a buyer can absorb it. No fund is large enough to corner the euro. Major FX is too deep, and central banks sit behind the currencies besides.",
                "Stocks give you a company, earnings, and sometimes a dividend. FX gives you a relative price between two economies. Analysis methods overlap. The thing you own does not.",
            ],
            "l1-participants",
            {
                videoUrl: V.foundations,
                questionCards: [
                    card(
                        "Major currencies are too large, and too policy-sensitive, for a private fund to corner.",
                        "Why is cornering EUR/USD unlike cornering a small stock?",
                        ["Because spreads are illegal", "The market is vast and central banks stand behind the currencies", "Because retail traders set the fixing", "Because stocks do not have prices"],
                        1
                    ),
                    card(
                        "A share is a claim on a company. A forex position is a view on one currency versus another.",
                        "A stock position and a forex position differ because:",
                        ["Only forex can fall in price", "A stock is ownership in a firm; FX is a relative currency price", "Stocks trade 24 hours and FX does not", "FX always pays a dividend"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Hours, leverage, and the tape",
            [
                "A stock exchange has an opening bell and a closing print. FX has a weekday continuum and a weekend gap. You can manage a FX position after your local stock market is dark, and you can also get hurt by a Monday gap you slept through.",
                "Regulated stock leverage is usually modest. Retail FX leverage is often much higher, which is why the same person can be a careful stock investor and a reckless FX account. The market did not change their judgment. The margin did.",
            ],
            "l5-low-costs"
        ),
    ]),

    lesson("forex-vs-futures", "Why Trade Forex: Forex vs. Futures", [
        section(
            "Same currencies, different rulebook",
            [
                "Currency futures are listed contracts with a fixed size, a central exchange, and a clearing house. Spot or CFD forex is a broker product with flexible size down to nano lots and a quote that depends on that broker's liquidity.",
                "Futures margin and fees are published by the exchange and the broker. Spot costs hide more easily inside the spread. Futures expire or roll. Retail spot positions typically roll overnight and pick up a financing charge, sometimes called the swap.",
            ],
            "k1-broker-intro",
            {
                videoUrl: V.orders,
                questionCards: [
                    card(
                        "Futures trade on an exchange with a standard contract. Retail spot size is flexible and broker-specific.",
                        "Which description fits listed currency futures?",
                        ["A private quote with any size you type", "An exchange contract with a standard size and a clearing house", "A cash exchange at an airport", "A stock dividend"],
                        1
                    ),
                    card(
                        "Overnight spot positions are financed with a swap or rollover charge. Futures are rolled when the contract month changes.",
                        "A retail spot position held overnight often incurs:",
                        ["No financing, ever", "A swap or rollover charge", "Automatic delivery of banknotes", "A stock split"],
                        1
                    ),
                ],
            }
        ),
        section(
            "Which one to learn on",
            [
                "If your country restricts CFDs, futures are the cleaner regulated path into the same currencies. If you need very small size while you learn, a regulated spot or CFD account with micro lots is easier than one standard futures contract.",
                "Do not run both until you can explain, for each, where the fee is, what happens at the session close, and how a stop is filled. The chart can look identical while the statement does not.",
            ],
            "l5-low-costs"
        ),
    ]),
];

const events = [
    {
        title: "Weekly Market Outlook",
        date: "2026-11-09",
        time: "09:00 UTC",
        type: "Webinar",
        impact: "medium",
        description: "A walk through the week’s data, the four sessions, and the two or three pairs actually worth watching.",
    },
    {
        title: "Live Session: Pips, Lots, and Position Size",
        date: "2026-11-12",
        time: "15:00 UTC",
        type: "Live Stream",
        impact: "high",
        description: "Build a position from a stop distance and a cash risk, using micro lots on EUR/USD.",
    },
    {
        title: "Order Ticket Workshop",
        date: "2026-11-18",
        time: "16:00 UTC",
        type: "Workshop",
        impact: "medium",
        description: "Market, limit, stop-entry, stop loss, and take profit, placed on a demo ticket and read back from the statement.",
    },
    {
        title: "London–New York Overlap Desk",
        date: "2026-11-24",
        time: "13:00 UTC",
        type: "Live Stream",
        impact: "high",
        description: "Screen time during the busiest hours: spreads, session highs, and when not to click.",
    },
    {
        title: "Ask Me Anything: Demo to Small Live",
        date: "2026-12-02",
        time: "17:00 UTC",
        type: "AMA",
        impact: "medium",
        description: "What to measure on a demo before the first real deposit, and what a first month of live trading should look like.",
    },
    {
        title: "Risk Clinic",
        date: "2026-12-09",
        time: "15:00 UTC",
        type: "Workshop",
        impact: "high",
        description: "Losing streaks, leverage, and the account rules that keep a beginner solvent.",
    },
    {
        title: "Year-End Liquidity Briefing",
        date: "2026-12-15",
        time: "14:00 UTC",
        type: "Webinar",
        impact: "low",
        description: "How holiday calendars thin the book, widen spreads, and change what a normal stop can do.",
    },
];

module.exports = { lessons, events };
