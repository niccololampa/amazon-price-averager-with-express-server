const express = require('express');
const cors = require('cors');
const app = express()
const port = 8000

app.use(cors());

app.get('/amazon-average', (req, res) => {
  console.log(req.query.item);
  res.send({data: 1})

})

app.listen(port, () => {
  console.log(`Amazon average server listening on port ${port}`)
})
