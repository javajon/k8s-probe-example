const express = require('express')
const app = express()
const port = 3000
const startupDuration = process.env.STARTUP_DURATION || 0;

var uptime = 0
function incrementUptime() {
  uptime += 1;
}

var cancel = setInterval(incrementUptime, 1000);

function isStartupMode() {
  return startupDuration > 0
}

app.get('/', (req, res) => {
  res.send("Hello! Yes, I understand what you are saying.")
})

app.get('/uptime', (req, res) => {
  res.send("Uptime: " + uptime + ", startupDuration: " + startupDuration)
})

app.get('/livez', (req, res) => {
  if (isStartupMode() && uptime < startupDuration) {
      res.status(500).json({ error: "I'm either unborn or a zombie. (uptime " + uptime + " seconds)"})   
  }
  else {
    res.send("I'm alive! (uptime " + uptime + " seconds)")
  }
})

app.get('/readyz', (req, res) => {
  res.status(500).json({ error: "Shut the door, I'm not ready yet. (uptime " + uptime + " seconds)"})   
  // res.send("I'm ready!")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
