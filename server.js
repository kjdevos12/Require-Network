const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// ⚠️ CHANGE THIS to your secret token/password
const SECURITY_TOKEN = "MySuperSecretToken123!"; 

// Holds the script and who it is meant for
let scriptQueue = { code: "", target: "ALL" };

// 1. Website UI sends the script here
app.post('/execute', (req, res) => {
    const userToken = req.headers['authorization'];

    if (userToken !== SECURITY_TOKEN) {
        return res.status(401).send({ error: "Unauthorized access." });
    }

    scriptQueue = {
        code: req.body.code,
        target: req.body.target || "ALL"
    };

    res.status(200).send({ status: "Success", message: "Script queued successfully." });
});

// 2. Roblox game fetches the script from here
app.get('/get-script', (req, res) => {
    const robloxToken = req.headers['authorization'];

    if (robloxToken !== SECURITY_TOKEN) {
        return res.status(401).send({ error: "Unauthorized access." });
    }

    // Send the current queue data
    res.status(200).send(scriptQueue);
    
    // Reset the queue so it doesn't execute repeatedly
    scriptQueue = { code: "", target: "ALL" }; 
});

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
