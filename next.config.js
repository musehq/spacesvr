// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPlugins = require("next-compose-plugins");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const transpileModules = require("next-transpile-modules")([
  "three",
  "drei",
  "postprocessing",
  "@react-three/fiber",
  "use-cannon",
]);

module.exports = withPlugins([transpileModules]);
