const express = require('express')
const app = express()
const port = 3000
const startupDuration = process.env.STARTUP_DURATION || 0;

var uptime = 0
function incrementUptime() {
  uptime += 1;
}

var cancel = setInterval(incrementUptime, 1000);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/uptime', (req, res) => {
  res.send("Uptime: " + uptime + "startupDuration: " + startupDuration)
})

app.get('/readyz', (req, res) => {

  // In Startup mode
  if (startupDuration > 0) {
    if (uptime > startupDuration)
       res.send("I'm ready!")
    else
      res.status(500).json({ error: "Shut the door, I'm not ready yet"})   
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})