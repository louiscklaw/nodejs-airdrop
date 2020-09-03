const url = require('url');
const chalk = require('chalk');
const address = require('address');


function foobar (protocol, host, port, pathname = '/') {
  const formatUrl = hostname =>
  url.format({
    protocol,
    hostname,
    port,
    pathname,
  });
const prettyPrintUrl = hostname =>
  url.format({
    protocol,
    hostname,
    port: chalk.bold(port),
    pathname,
  });

const isUnspecifiedHost = host === '0.0.0.0' || host === '::';
let prettyHost, lanUrlForConfig, lanUrlForTerminal;
if (isUnspecifiedHost) {
  prettyHost = 'localhost';
  try {
    // This can only return an IPv4 address
    lanUrlForConfig = address.ip();
    if (lanUrlForConfig) {
      // Check if the address is a private ip
      // https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
      if (
        /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(
          lanUrlForConfig
        )
      ) {
        // Address is private, format it for later use
        lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig);
      } else {
        // Address is not private, so we will discard it
        lanUrlForConfig = undefined;
      }
    }
  } catch (_e) {
    // ignored
  }
} else {
  prettyHost = host;
}
const localUrlForTerminal = prettyPrintUrl(prettyHost);
const localUrlForBrowser = formatUrl(prettyHost);
return {
  lanUrlForConfig,
  lanUrlForTerminal,
  localUrlForTerminal,
  localUrlForBrowser,
};
}
function printInstructions(appName, urls, useYarn,folder) {
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser\nYou are editing the folder at the location ${chalk.bold(folder)}`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(
      `  ${chalk.bold('Local:')}            ${urls.localUrlForTerminal}`
    );
    console.log(
      `  ${chalk.bold('On Your Network:')}  ${urls.lanUrlForTerminal}`
    );
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();

}

module.exports = {
  printNetowrkInstructrion: (port,f) => {printInstructions("Airdropjs",foobar("http","0.0.0.0",port),false,f);}
}
