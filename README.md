![Banner](banner.png)

# Sentimant Tool - Conversation Sentiment Analyzer

A modern web application built with Next.js and Tailwind CSS to analyze sentiment in conversation text through customizable keyword categories. The tool highlights keywords, calculates sentiment scores, and visualizes results with detailed context.

## Features

- **User Input:** Paste or type conversation text for analysis.
- **Keyword Customization:** Modify positive, negative, and multiple other sentiment categories.
- **Sentiment Analysis:** Highlights keywords by category with line numbers.
- **Statistics:** Shows word count, character count, and weighted sentiment score.
- **Visualization:** Pie chart displays sentiment distribution.
- **Keyword Tally:** Lists detected keywords with frequency and line references.
- **Paragraph Context:** Displays paragraphs containing keywords for context.
- **Local Storage:** Save and load keyword configurations.
- **Responsive UI:** Built using Tailwind CSS and Radix UI components.
- **Accessible:** Keyboard navigable with clear visual indicators.
- **Modern Tech Stack:** Next.js, React, TypeScript, Chart.js, Tailwind CSS.

## Project Structure

- **app/**: Main Next.js application files including the page component handling sentiment analysis logic.
- **components/**: Reusable UI components such as `HighlightedText`, `SentimentChart`, `KeywordTally`, `ParagraphContext`, and `UsageInstructions`.
- **lib/**: Utility files including default sentiment categories and helper functions.
- **styles/**: Global CSS styles.
- **public/**: Static assets like placeholder images.
- **package.json**: Project dependencies and scripts.

## Getting Started

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Use `npm run dev` to start the development server.
4. Open the app in your browser at `http://localhost:3000`.
5. Paste conversation text, customize keywords, and analyze sentiment.

## Technologies

- Next.js (React framework)
- TypeScript
- Tailwind CSS
- Radix UI components
- Chart.js for data visualization
- Lucide React icons

## Usage Instructions

1. Paste your conversation text into the main input area.
2. Customize keywords in the "Keywords" tab if desired.
3. Click "Analyze" to process the text.
4. View results including sentiment highlights, statistics, charts, and context.
5. Save or load your keyword configurations for future use.

## Credits

Developed by John Gallie of JTGSYSTEMS.COM in collaboration with Jointtechnologygroup.com.
