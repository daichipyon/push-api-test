
const webPush = require('web-push');
require('dotenv').config()

webPush.setVapidDetails(
  "https://example.com/",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);


//Expressを用いて、サーバーを構築する
const express = require('express');
const app = express();

// サーバーの起動確認用のエンドポイント
app.get('/hoge', (req, res) => {
  res.send('Hello World!');
});

// 静的なファイルを配信するためのエンドポイントを作成する
app.use(express.static('public'));

//通知を送信するためのエンドポイントを作成する
app.post('/notify', express.json(), (req, res) => {
  const subscription = req.body.subscription;
  res.sendStatus(201);

  console.log(subscription)
  console.log(req.body.delay)

  const payload = JSON.stringify({
    title: 'Push Notification',
    body: 'Push Notification from server',
  });

  setTimeout(() => {
    webPush.sendNotification(subscription, payload)
      .catch(err => console.error(err));
  }, req.body.delay);

});

// サーバーを起動する
app.listen(5500, () => {
  console.log('server start');
});