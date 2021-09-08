require('dotenv').config(); //載入 .env的設定
const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.send('Hello World')
})
let port = process.env.PORT || 3000;

app.listen(port, () => {

    console.log(`啟動: ${port}`, Date());
});
