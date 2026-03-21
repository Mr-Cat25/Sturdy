const fs = require('fs');
const path = require('path');
const appJson = require('./app.json');

function loadMobileExpoEnv() {
  const envPath = path.join(__dirname, '.env');

  if (!fs.existsSync(envPath)) {
    return;
  }

  const contents = fs.readFileSync(envPath, 'utf8');

  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const equalsIndex = trimmed.indexOf('=');

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();

    if (!key.startsWith('EXPO_PUBLIC_')) {
      continue;
    }

    process.env[key] = trimmed.slice(equalsIndex + 1).trim();
  }
}

loadMobileExpoEnv();

module.exports = appJson.expo;