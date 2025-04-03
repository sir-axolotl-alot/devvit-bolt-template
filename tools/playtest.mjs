// TODO: Remove? I think our CLI has a bug with using the right path in
// child processes.
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const main = async function () {
  // Open devvit-bolt-config.json and overwrite the useMockedResponses property to false, then save the file
  const configPath = join(__dirname, '../devvit-bolt.config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  config.useMockedResponses = false;

  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('Running playtest with useMockedResponses set to false');

  execSync('npm run build', {
    stdio: 'inherit',
  });

  console.log('Running playtest on ' + config.testSubreddit);

  const devvitConfigPath = join(__dirname, '../devvit.dev.yaml');
  execSync(
    `devvit playtest ${config.testSubreddit} --config ${devvitConfigPath}`,
    {
      stdio: 'inherit',
    }
  );
};

void main();
