const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const app = express();
const PORT = 3000;

const getDataFromRemote = async () => {
    const URL = 'https://www.cricbuzz.com/live-cricket-scorecard/99138/';
    const response = await axios.get(URL);
    const { data } = response;
    return data;
}

const getScores = async () => {
    const html = await getDataFromRemote();
    const scores = [];
    const $ = cheerio.load(html);
    
    // Example selectors based on Cricbuzz's structure
    const matchTitle = $('h1.cb-nav-hdr').text().trim();
    const scoreContainer = $('.cb-scrs-wrp .cb-min-bat-rw');
    scoreContainer.each((_, element) => {
        const teamName = $(element).find('.cb-min-tm').text().trim();
        const score = $(element).find('.cb-text-live').text().trim();
        scores.push(`${teamName}: ${score}`);
    });

    return { matchTitle, scores };
}

app.get('/index', async (req, res) => {
    try {
        const data = await getScores();
        res.json(data);
    } catch (error) {
        console.error('Error fetching scores:', error);
        res.status(500).json({ error: 'Failed to fetch scores' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
