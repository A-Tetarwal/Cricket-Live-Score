const axios = require('axios');
const cheerio = require('cheerio');
const notifier = require('node-notifier');

const getDataFromRemote = async () => {
    const URL = 'https://www.cricbuzz.com/cricket-match/live-scores';
    const response = await axios.get(URL);
    const {data} = response;
    return data;
}

const getScores = async () => {
    const html = await getDataFromRemote();
    const scores = [];
    const $ = cheerio.load(html);
    $('a.cb-lv-scrs-well-live').each(function (_, element){
        const scoreContainer = $(element).children().children();
        const score = $(scoreContainer).text();
        scores.push(score);
        console.log('score', score);
    })
    return scores;
}

const notify = async () => {
    const scores = await getScores();
    for (let i = 0; i < scores.length; i++) {
        notifier.notify({
            title: 'CricketLive',
            message: scores[i]
        })
    }
}

setInterval(() => {
    notify();
}, 3000)