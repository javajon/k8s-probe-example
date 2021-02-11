const express = require("express");

const app = express();
const port = 3000;
const podNameGenerated = process.env.HOSTNAME || "Undefined";

app.use(express.json());

var startupCountdown = (process.env.STARTUP_DURATION > 0 ? process.env.STARTUP_DURATION : -1);
var livenessCountdown = -1;
var readinessCountdown = -1;

var uptime = 0;

function periodicUpdates() {
    uptime++;
    startupCountdown = startupCountdown >= 0 ? --startupCountdown : startupCountdown;
    livenessCountdown = livenessCountdown > 0 ? --livenessCountdown : livenessCountdown;
    readinessCountdown = readinessCountdown > 0 ? --readinessCountdown : readinessCountdown;
}

var cancel = setInterval(periodicUpdates, 1000);

function isStartupMode() {
    return startupCountdown > -1;
}

function isLivenessMode() {
    return livenessCountdown > -1;
}

function isReadinessMode() {
    return readinessCountdown > -1;
}

app.get("/", (req, res) => {
    res.json({
        message: "Hello! Yes, I understand what you are saying.",
        podNameGenerated: podNameGenerated
    });
});

app.get("/uptime", (req, res) => {
    res.json({
        uptime: uptime
    });
});

app.get("/livez", (req, res) => {
    if (isStartupMode()) {
        res.status(500).json({
            error: "I'm either unborn or a zombie. (uptime " + uptime + " seconds)"
        });
    } else if (isLivenessMode()) {
        if (livenessCountdown == 0) {
            res.status(500).json({
                error: "The parasitoid has done it's dirty deed, I'm dead.",
                livenessCountdown, livenessCountdown,
                podNameGenerated, podNameGenerated
            });
        } else {
            res.status(200).json({
                message: "I'm alive, but I have a parasitoid. Uh oh.",
                livenessCountdown, livenessCountdown,
                podNameGenerated, podNameGenerated
            });
        }
    } else {
        res.status(200).json({
            message: "I'm alive.",
            uptime, uptime,
            podNameGenerated, podNameGenerated
        });
    }
});

app.get("/readyz", (req, res) => {
    if (readinessCountdown > 0) {
        res.status(500).json({
            error: "Shut the door, I'm busy!",
            readinessCountdown, readinessCountdown,
            podNameGenerated, podNameGenerated
        });
    } else {
        res.status(200).json({
            message: "I'm ready!",
            podNameGenerated, podNameGenerated
        });
    }
});

app.get("/diagz", (req, res) => {
    res.status(200).json({
        startupDemo: isStartupMode(),
        livenessDemo: isLivenessMode(),
        uptime: uptime,
        startupCountdown: startupCountdown,
        livenessCountdown: livenessCountdown,
        readinessCountdown, readinessCountdown
    });
});

app.post("/parasitoid", (req, res) => {
    livenessCountdown = req.body.livenessCountdown;
    res.json({
        message: "Queue the FBI theme music... This application will self destruct in a few seconds",
        livenessCountdown, livenessCountdown
    });
});

app.post('/calculate', (req, res) => {
    readinessCountdown = req.body.readinessCountdown;
    res.json({
        message: "Calculating the meaning of life, I'll be done in a few seconds",
        readinessCountdown, readinessCountdown
    });
});


app.listen(port, () => {
    console.log(`The Kubernetes probe example app is listening at http://localhost:${port}`);
});
