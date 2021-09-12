require('dotenv').config(); //載入 .env的設定
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });

const app = express();

app.set('view engine', 'ejs');

//middleware 中介函式 解析urlencoded格式

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', express.static('public'));
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));


// *** 路由定義開始
app.get('/', function (req, res) {
    res.render('home', { name: 'JYO' });
    //res.send('Hello World')
});
app.get('/json-sales', function (req, res) {
    const sales = require('./data/sales');

    // console.log(sales);
    // res.send(sales);
    //res.json(sales);
    res.render('json-sales', { sales });
});

//測試querystring
app.get('/try-qs', function (req, res) {
    res.json(req.query);
});


app.post('/try-post', function (req, res) {
    res.json(req.body);
});
app.get('/try-post-form', (req, res) => {
    res.render('try-post-form');
});
app.post('/try-post-form', (req, res) => {
    res.render('try-post-form', req.body);
});
app.get('/pending', (req, res) => {
});

app.post('/try-upload', upload.single('avatar'), (req, res) => {
    res.json(req.file);
    //console.log(req.file);
});

// *** 路由定義結束

//需放在所有路由之後
app.use((req, res) => {
    res.status(404).send(`<h1>找不到頁面</h1>`)
});

let port = process.env.PORT || 3000;

app.listen(port, () => {

    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`啟動: ${port}`, Date());
});
