# Enhanced Conversation Sentiment Analyzer

This project provides a single-page web application for analyzing the sentiment of conversation text based on user-defined keywords.

## Features

*   **Text Input:** Paste conversation text into the provided textarea.
*   **Customizable Keywords:** Define comma-separated lists of positive and negative keywords. Default lists are provided.
*   **Sentiment Analysis:**
    *   Highlights keywords based on their category (Positive, Negative, Confused, etc.) within the input text, prepending each line with its number.
*   Calculates and displays statistics:
*   Word Count
*   Character Count
*   Overall Sentiment Score (calculated based on weighted keyword categories).
*   **Visualization:** Displays a pie chart showing the distribution of detected sentiment categories.
*   **Keyword Tally:** Lists the specific keywords found, their frequency, and the line numbers where they appear. Tally sections for categories with no detected keywords are hidden.
*   **Paragraph Context:** Displays the full paragraphs where keywords were detected.
*   **Controls:**
    *   `Submit`: Analyze the current text and keywords.
    *   `Reset`: Clear input text and restore default keywords.
    *   `Clear Input`: Clear only the input text area.
    *   `Save Config`: Save the current positive/negative keyword lists to the browser's local storage.
    *   `Load Config`: Load previously saved keyword lists from local storage.

## Files

*   `sentimant tool- PERFECT.html`: The main application file. Contains HTML structure, Tailwind CSS styling, and JavaScript logic.
*   `sentimant tool-trial-v2-trial.html`: An enhanced version with multiple sentiment categories, paragraph context, and line number details.
*   `sentimant tool-trial.html`: Another trial or earlier version.

## Usage

1.  Open `sentimant tool- PERFECT.html` in a web browser.
2.  Paste the conversation text into the input area.
3.  (Optional) Modify the positive and negative keyword lists.
4.  (Optional, for `sentimant tool-trial-v2-trial.html`) Modify keyword lists for various sentiment categories.
5.  Click "Submit" to analyze the text.
6.  View the highlighted text (with line numbers), statistics, chart, keyword tallies (with line numbers), and paragraph context.
76.  Use "Save Config" and "Load Config" to manage keyword sets.

## Technologies Used

*   HTML
*   Tailwind CSS (via CDN)
*   JavaScript (vanilla)
*   Chart.js (via CDN)

## Credits

This project was created by John Gallie of JTGSYSTEMS.COM in association with Jointtechnologygroup.com.