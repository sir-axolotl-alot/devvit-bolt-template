import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async function () {
  const boltConfig = JSON.parse(
    await import('../devvit-bolt.config.json', { assert: { type: 'json' } })
  ).default;
  const subreddit = boltConfig.testSubreddt;

  // Open devvit-bolt-config.json and overwrite the useMockedResponses property to false, then save the file
  const configPath = join(__dirname, '../devvit-bolt.config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  config.useMockedResponses = false;
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Running playtest with useMockedResponses set to false');

  execSync('npm run build', { stdio: 'inherit' });
  console.log('Running playtest on ' + subreddit);
  execSync('devvit playtest ' + subreddit + '--config ../devvit.dev.yaml', {
    stdio: 'inherit',
  });
};

void main();
