let config = {
    testEnvironment: "node",
    moduleNameMapper: {
      "^@lib/(.*)$": "<rootDir>/lib/$1"
    }
}

if (process.versions.node > "8.0.0") {
    // disable babel for node > 8, which has native support for async/await
    config = Object.assign(config, { transform: {} });
}

module.exports = config;
