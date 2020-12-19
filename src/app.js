const express = require('express');
const app = express();
const port = 3000;
const startupDuration = process.env.STARTUP_DURATION || 0;

app.use(express.json());

var timeBeforeShutdown = -1;
var uptime = 0;

function periodicUpdates() {
  uptime += 1;
  if (isDemoLivenessMode()) {
    timeBeforeShutdown -= 1;
  }
}

var cancel = setInterval(periodicUpdates, 1000);

function isDemoLivenessMode() {
  return timeBeforeShutdown > -1;
}

function isStartupMode() {
  return startupDuration > 0;
}

app.get('/', (req, res) => {
  res.send("Hello! Yes, I understand what you are saying.");
});

app.get('/uptime', (req, res) => {
  res.send("Uptime: " + uptime + ", startupDuration: " + startupDuration);
});

app.get('/livez', (req, res) => {
  if (isStartupMode() && uptime < startupDuration) {
    res.status(500).json({ error: "I'm either unborn or a zombie. (uptime " + uptime + " seconds)"}); 
  }
  else if (isDemoLivenessMode()) {
    if (startupDuration == 0)
       res.status(500).json({ error: "The parasitoid has done it's deed, I'm dead."});
    else
       res.send("I'm alive, but I have a parasitoid. Uh oh. (timeBeforeShutdown " + timeBeforeShutdown + " seconds)");
  }
  else {
    res.send("I'm alive! (uptime " + uptime + " seconds)");
  }
});

app.get('/readyz', (req, res) => {
  res.status(500).json({ error: "Shut the door, I'm not ready yet. (uptime " + uptime + " seconds)"});
  // res.send("I'm ready!")
});

app.post('/parasitoid', (req, res) => {
  timeBeforeShutdown = req.body.time;
  res.send("Queue the FBI theme music... This application will self destruct in " + timeBeforeShutdown + " seconds.");
});

app.listen(port, () => {
  console.log(`The Kubernetes probe example app is listening at http://localhost:${port}`);
});
