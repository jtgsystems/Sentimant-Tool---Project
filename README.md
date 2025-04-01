# Enhanced Conversation Sentiment Analyzer

This project provides a single-page web application for analyzing the sentiment of conversation text based on user-defined keywords.

## Features

*   **Text Input:** Paste conversation text into the provided textarea.
*   **Customizable Keywords:** Define comma-separated lists of positive and negative keywords. Default lists are provided.
*   **Sentiment Analysis:**
    *   Highlights positive (green) and negative (red) keywords within the input text.
    *   Calculates and displays statistics:
        *   Word Count
        *   Character Count
        *   Positive Keyword Matches
        *   Negative Keyword Matches
        *   Overall Sentiment Score (Positive Matches - Negative Matches)
*   **Visualization:** Displays a doughnut chart showing the distribution of positive, negative, and neutral sentiment (based on keyword counts).
*   **Keyword Tally:** Lists the specific positive and negative keywords found in the text and their frequency.
*   **Controls:**
    *   `Submit`: Analyze the current text and keywords.
    *   `Reset`: Clear input text and restore default keywords.
    *   `Clear Input`: Clear only the input text area.
    *   `Save Config`: Save the current positive/negative keyword lists to the browser's local storage.
    *   `Load Config`: Load previously saved keyword lists from local storage.

## Files

*   `sentimant tool- PERFECT.html`: The main application file. Contains HTML structure, Tailwind CSS styling, and JavaScript logic.
*   `sentimant tool-trial-v2-trial.html`: Likely an experimental or development version.
*   `sentimant tool-trial.html`: Another trial or earlier version.

## Usage

1.  Open `sentimant tool- PERFECT.html` in a web browser.
2.  Paste the conversation text into the input area.
3.  (Optional) Modify the positive and negative keyword lists.
4.  Click "Submit" to analyze the text.
5.  View the highlighted text, statistics, chart, and keyword tallies.
6.  Use "Save Config" and "Load Config" to manage keyword sets.

## Technologies Used

*   HTML
*   Tailwind CSS (via CDN)
*   JavaScript (vanilla)
*   Chart.js (via CDN)