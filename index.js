require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Location = require('./models/Location'); // 引入Location模型
const parseSMS = require('./parseSMS'); // 引入SMS解析函数

const app = express();
const PORT = process.env.PORT || 3000;

// 连接到MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Server is running');
});

// 接收位置数据的POST请求
app.post('/location', (req, res) => {
  const data = req.body; // 假设直接从body中获取位置数据
  const newLocation = new Location(data);

  newLocation.save()
    .then(() => res.send({ message: 'Location data saved.' }))
    .catch(err => res.status(500).send({ error: 'Failed to save location data.' }));
});

// 处理SMS消息
app.post('/sms', (req, res) => {
  const content = req.body.Body; // SMS内容
  console.log(`Received an SMS message: ${content}`);
  const data = parseSMS(content);
  console.log(`Parsed data: ${JSON.stringify(data)}`);

  if (data) {
    const newLocation = new Location(data);
    newLocation.save()
      .then(() => {
        console.log('SMS location data saved.');
        res.type('text/xml');
        res.send('<Response><Message>Location data saved.</Message></Response>');
      })
      .catch(err => {
        console.error('Failed to save SMS location data:', err);
        res.type('text/xml');
        res.send('<Response><Message>Error saving location data.</Message></Response>');
      });
  } else {
    console.log('Failed to parse SMS content.');
    res.type('text/xml');
    res.send('<Response><Message>Invalid location data format.</Message></Response>');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
