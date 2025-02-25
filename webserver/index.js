const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express()

app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

require('./router')(app)

app.listen(3001, (err) => {
  if (err) { console.log(err) }
  else {console.log('Server started at port http://localhost:3001')}
})