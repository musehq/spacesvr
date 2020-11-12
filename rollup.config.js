import path from "path";
import { promises as fs } from "fs";
import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";
import commonjs from "@rollup/plugin-commonjs";

const root = "/"; // = process.platform === "win32" ? path.resolve("/") : "/";
const external = (id) => {
  return !id.startsWith(".") && !id.startsWith(root);
};
const extensions = [".js", ".jsx", ".ts", ".tsx", ".json"];

const getBabelOptions = ({ useESModules }, targets) => ({
  babelrc: false,
  extensions,
  exclude: "**/node_modules/**",
  runtimeHelpers: true,
  presets: [
    ["@babel/preset-env", { loose: true, modules: false, targets }],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    ["transform-react-remove-prop-types", { removeImport: true }],
    ["@babel/transform-runtime", { regenerator: false, useESModules }],
  ],
});

function targetTypings(entry, out) {
  return {
    writeBundle() {
      return fs.lstat(`dist/${out}`).catch(() => {
        return fs.writeFile(`dist/${out}.d.ts`, `export * from "./${entry}"`);
      });
    },
  };
}

function addReactImport(out) {
  return {
    writeBundle() {
      return fs.appendFile(`dist/${out}.js`, `import React from "react"`);
    },
  };
}

function createConfig(entry, out) {
  return [
    {
      input: `./src/${entry}`,
      output: { file: `dist/${out}.js`, format: "esm" },
      external,
      plugins: [
        json(),
        addReactImport(out),
        commonjs(),
        babel(
          getBabelOptions(
            { useESModules: true },
            ">1%, not dead, not ie 11, not op_mini all"
          )
        ),
        resolve({ extensions }),
        targetTypings(entry, out),
      ],
    },
    {
      input: `./src/${entry}`,
      output: { file: `dist/${out}.cjs.js`, format: "cjs" },
      external,
      plugins: [
        json(),
        commonjs(),
        babel(getBabelOptions({ useESModules: false })),
        resolve({ extensions }),
        targetTypings(entry, out),
      ],
    },
  ];
}

export default [
  ...createConfig("index", "main"),
  ...createConfig("components", "components"),
  ...createConfig("core", "core"),
  ...createConfig("effects", "effects"),
  ...createConfig("modifiers", "modifiers"),
  ...createConfig("services", "services"),
];
