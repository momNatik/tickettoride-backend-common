export default { ShowStartInfo, LogRequest };

function ShowStartInfo(appNameEnvKey) {
  const appName = process.env[appNameEnvKey];
  console.log(`\x1b[32m${appName} is running...\x1b[0m`);
}

function LogRequest(req, res, next) {
  const now = new Date(Date.now());
  const timeString = ToPreciseTime(now);
  const message = `${req.path}`;

  console.log(`${timeString}: \x1b[33m${message}\x1b[0m`);

  next();
}

function ToPreciseTime(date) {
  return date.toISOString().substring(11, 23);
}
