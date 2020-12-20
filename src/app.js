const express = require('express');

const app = express();
const port = 3000;
const podNameGenerated = process.env.HOSTNAME || "Undefined"

app.use(express.json());

var startupCountdown = process.env.STARTUP_DURATION > 0 ? process.env.STARTUP_DURATION : -1;
var livenessCountdown= -1;
var readinessCountdown = -1;

var uptime = 0;

function periodicUpdates() {
    uptime += 1;
    if (isStartupMode()) {
      startupCountdown -= 1;
    }
    if (isDemoLivenessMode()) {
        livenessCountdow -= 1;
    }
    if (isReadinessMode()) {
        readinessCountdown -= 1;
    }
}

var cancel = setInterval(periodicUpdates, 1000);

function isStartupMode() {
    return startupCountdown > -1;
}

function isDemoLivenessMode() {
    return livenessCountdown > -1;
}

function isReadinessMode() {
    return readinessCountdown > 0;
}

app.get('/', (req, res) => {
    res.send("Hello! Yes, I understand what you are saying. I'm Pod " + podNameGenerated);
});

app.get('/uptime', (req, res) => {
    res.send("Uptime: " + uptime + ", startupDuration: " + startupDuration);
});

app.get('/livez', (req, res) => {
    if (isStartupMode()) {
        res.status(500).json({
            error: "I'm either unborn or a zombie. (uptime " + uptime + " seconds)"
        });
    } else if (isDemoLivenessMode()) {
        if (livenessCountdown == 0)
            res.status(500).json({
                error: "The parasitoid has done it's dirty deed, I'm dead."
            });
        else
            res.send("I'm alive, but I have a parasitoid. Uh oh. (timeBeforeShutdown " + livenessCountdown + " seconds)");
    } else {
        res.send("I'm alive! (uptime " + uptime + " seconds)");
    }
});

app.get('/readyz', (req, res) => {
    if (isReadinessMode()) {
        res.status(500).json({
            error: "Shut the door, I'm not ready yet.",
            readinessCountdown, readinessCountdown,
            podNameGenerated, podNameGenerated
        });
    } else
        res.send("I'm ready. I'm Pod: " + podNameGenerated);
});

app.get('/diagz', (req, res) => {
    res.json({
        startupDemo: isStartupMode(),
        livenessDemo: isDemoLivenessMode(),
        uptime: uptime,
        startupCountdown: startupCountdown,
        livenessCountdown: livenessCountdown,
        readinessCountdown, readinessCountdown
    });
});

app.post('/parasitoid', (req, res) => {
    livenessCountdown = req.body.livenessCountdown;
    res.send("Queue the FBI theme music... This application will self destruct in " + livenessCountdown + " seconds.");
});

app.post('/calculate', (req, res) => {
    readinessCountdown = req.body.readinessCountdown;
    res.send("Calculating the meaning of life, I'll be done in " + readinessCountdown + " seconds.");
});


app.listen(port, () => {
    console.log(`The Kubernetes probe example app is listening at http://localhost:${port}`);
});
