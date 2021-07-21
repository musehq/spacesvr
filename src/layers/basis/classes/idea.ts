// @ts-ignore
import * as culori from "culori";
import { NpmDependencies, Schema } from "../types/idea";

/**
 * an idea is the fundamental atom of the ideal reality.
 * everything is an idea, whether the idea is accurately visualized or not.
 */
export class Idea {
  // definition
  id: string;
  props: any;

  // aliases
  name: string;

  // size
  schema: Schema;
  npm_dependencies: NpmDependencies;

  // thought
  difference: string;
  predecessor: string;

  // mediation
  mediation: number; // [0, 1)
  specificity: number; // [0, 1]
  utility: number; // [0, 1]

  constructor() {
    this.setFromCreation();
    return this;
  }

  setFromCreation(m = 0, s = 0, u = 0.5) {
    this.mediation = m;
    this.specificity = s;
    this.utility = u;

    return this;
  }

  getHex(): string {
    const fixedColor = culori.rgb({
      mode: "oklch",
      l: this.utility,
      c: this.specificity * 0.322,
      h: this.mediation * 360,
    });

    return culori.formatHex(fixedColor);
  }

  getOpposite(): Idea {
    const newM = (this.mediation + 0.5) % 1;
    return new Idea().setFromCreation(newM, this.specificity, this.utility);
  }
}

const AVG_CHAR_VAL = 100; // each char is roughly 100, so loop every ~50 chars
const GLOBAL_SEED = Math.random() * 900;

const hashStringToRange = (str: string, loop = 20): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }
  const scaledLoop = loop * AVG_CHAR_VAL;
  return ((GLOBAL_SEED + count) % scaledLoop) / scaledLoop;
};

const wrapNumber = (num: number, range = 10) => {
  return (num % range) / range;
};
