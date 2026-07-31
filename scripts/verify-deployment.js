import http from 'http';
import https from 'https';

const targetUrl = process.env.APP_URL || 'http://localhost:3000';
const expectedCommit = process.env.EXPECTED_SHA || null;

console.log(`[DevOps Verification] Checking deployment health at: ${targetUrl}/api/health`);

const client = targetUrl.startsWith('https') ? https : http;

const req = client.get(`${targetUrl}/api/health`, (res) => {
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.error(`[DevOps Failure] Health check returned HTTP ${res.statusCode}`);
        process.exit(1);
      }

      const data = JSON.parse(body);
      console.log(`[DevOps Success] API Health Status: ${data.status}`);
      console.log(`[DevOps Success] API Version: ${data.version}`);
      console.log(`[DevOps Success] Backend Commit SHA: ${data.commitSha}`);
      console.log(`[DevOps Success] Server Uptime: ${data.uptime} seconds`);

      if (expectedCommit && data.commitSha !== 'latest' && data.commitSha !== expectedCommit) {
        console.warn(`[DevOps Warning] Backend commit (${data.commitSha}) does not match expected (${expectedCommit}). Redeployment may still be propagating.`);
      } else {
        console.log(`[DevOps Verified] Live deployment is in sync with latest code!`);
      }
      process.exit(0);
    } catch (err) {
      console.error(`[DevOps Failure] Unable to parse response: ${err.message}`);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error(`[DevOps Failure] Health check request failed: ${err.message}`);
  process.exit(1);
});

req.setTimeout(10000, () => {
  console.error('[DevOps Failure] Health check timed out after 10 seconds.');
  req.destroy();
  process.exit(1);
});
