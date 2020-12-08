const {
  addWebpackAlias,
  removeModuleScopePlugin,
  babelInclude,
  override,
} = require("customize-cra");
const path = require("path");

const { exec } = require("child_process");
exec(`node ${__dirname}/server/app.js`);

module.exports = (config, env) => {
  config.resolve.extensions = [
    ...config.resolve.extensions,
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
  ];
  return override(
    removeModuleScopePlugin(),
    babelInclude([path.resolve("src"), path.resolve("../src")]),
    addWebpackAlias({
      spacesvr: path.resolve("../src/"),
      react: path.resolve("node_modules/react"),
      "react-dom": path.resolve("node_modules/react-dom"),
    })
  )(config, env);
};
