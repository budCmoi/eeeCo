const { spawn } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const projectRoot = process.cwd();
const standaloneCandidates = [
  resolve(projectRoot, '.next', 'standalone', 'frontend', 'server.js'),
  resolve(projectRoot, '.next', 'standalone', 'server.js')
];

const standaloneEntry = standaloneCandidates.find((entryPath) => existsSync(entryPath));

function spawnServer(command, args) {
  return spawn(command, args, {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit'
  });
}

const childProcess = standaloneEntry
  ? spawnServer(process.execPath, [standaloneEntry])
  : (() => {
      const nextBinary = require.resolve('next/dist/bin/next', {
        paths: [projectRoot, __dirname]
      });

      console.warn('Standalone output not found, falling back to next start.');
      return spawnServer(process.execPath, [nextBinary, 'start', ...process.argv.slice(2)]);
    })();

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    if (!childProcess.killed) {
      childProcess.kill(signal);
    }
  });
}

childProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});