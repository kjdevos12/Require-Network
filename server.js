const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// ⚠️ CHANGE THIS! Choose a secure password/token for your game
const SECURITY_TOKEN = "MySuperSecretToken123!"; 

let scriptQueue = "";

// 1. Website sends the script here
app.post('/execute', (req, res) => {
    const userToken = req.headers['authorization'];

    // Verify the secret token matches
    if (userToken !== SECURITY_TOKEN) {
        return res.status(401).send({ error: "Unauthorized access." });
    }

    scriptQueue = req.body.code;
    res.status(200).send({ status: "Success", message: "Script queued." });
});

// 2. Roblox game fetches the script from here
app.get('/get-script', (req, res) => {
    const robloxToken = req.headers['authorization'];

    // Verify the Roblox script has the secret token
    if (robloxToken !== SECURITY_TOKEN) {
        return res.status(401).send({ error: "Unauthorized access." });
    }

    res.status(200).send({ code: scriptQueue });
    scriptQueue = ""; // Clear queue after delivering it
});

// Start the server
const listener = app.listen(process.env.PORT || 3000, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
