const boltConfig = require("../devvit-bolt.config.json");
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const playtest = function() {
    const subreddit = boltConfig.testSubreddt;

    // Open devvit-bolt-config.json and overwrite the useMockedResponses property to false, then save the file
    const configPath = path.join(__dirname, '../devvit-bolt.config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.useMockedResponses = false;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Running playtest with useMockedResponses set to false');

    execSync('npm run build', {stdio: 'inherit'});
    console.log('Running playtest on ' + subreddit);
    execSync('devvit playtest ' + subreddit, {stdio: 'inherit'});
}

playtest()