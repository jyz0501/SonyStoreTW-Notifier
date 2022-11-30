const request = require('request');
const TelegramBot = require('node-telegram-bot-api');


/* Telegram Bot Settings */
const customerID = '';
const access_token = '';
const bot = new TelegramBot(token, {polling: false});

/* Runtime Settings */
const interval = 30000;
const timeBias = 30000;

/* Watch Tower */
const itemList = [
    {
        name: 'ilce_7c',
        spec: '',
    },
    {
        name: 'ilce_7m4',
        spec: '',
    },
];

function runRequest(item) {
    let options = {
        url: `https://www.sonystyle.com.cn/products/ilc/${item.name}/${item.spec}.html`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        }
    }
    request(options, function (error, response, body) {
        let time = new Date();

        if (!response || response.statusCode !== 200) {
            console.log('Failed to get response');
            console.log(time, item.name, error, response.statusCode, body);
            return;
        }

        if (body.includes('放入购物车', 0)) {
            console.log(time, item.name, 'On stuck!!');
            bot.sendMessage(customerID, `${item.name} has stock`);
        } else {
            console.log(time, item.name, 'Out of stuck!');
        }
    });
}

function checkItemsStatus() {
    for (let index in itemList) {
        runRequest(itemList[index]);
    }
};

function runLoop() {
    setTimeout(() => {
        checkItemsStatus();
        runLoop();
    }, (interval+Math.random()*timeBias));
}

runLoop();
