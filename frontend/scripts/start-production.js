const { spawn } = require('node:child_process');
const { cpSync, existsSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

const projectRoot = process.cwd();
const bindHost = process.env.HOST ?? process.env.BIND_HOST ?? '0.0.0.0';
const standaloneCandidates = [
  resolve(projectRoot, '.next', 'standalone', 'frontend', 'server.js'),
  resolve(projectRoot, '.next', 'standalone', 'server.js')
];

const standaloneEntry = standaloneCandidates.find((entryPath) => existsSync(entryPath));

function ensureStandaloneArtifacts(entryPath) {
  const standaloneRoot = dirname(entryPath);
  const staticSource = resolve(projectRoot, '.next', 'static');
  const staticTarget = resolve(standaloneRoot, '.next', 'static');
  const publicSource = resolve(projectRoot, 'public');
  const publicTarget = resolve(standaloneRoot, 'public');

  if (existsSync(staticSource)) {
    cpSync(staticSource, staticTarget, {
      recursive: true,
      force: true
    });
  }

  if (existsSync(publicSource)) {
    cpSync(publicSource, publicTarget, {
      recursive: true,
      force: true
    });
  }
}

function spawnServer(command, args) {
  return spawn(command, args, {
    cwd: projectRoot,
    env: {
      ...process.env,
      HOST: bindHost,
      HOSTNAME: bindHost
    },
    stdio: 'inherit'
  });
}

const childProcess = standaloneEntry
  ? (() => {
      ensureStandaloneArtifacts(standaloneEntry);
      return spawnServer(process.execPath, [standaloneEntry]);
    })()
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