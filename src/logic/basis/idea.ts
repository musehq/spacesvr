// @ts-ignore
import * as culori from "culori";
import { HexColorString } from "three";

/**
 * an idea is the fundamental substrate of reality.
 */
export class Idea {
  // identifiers
  id: string;
  name: string;

  // mediation
  mediation: number; // [0, 1)
  specificity: number; // [0, 1]
  utility: number; // [0, 1]

  constructor(m = 0, s = 0, u = 0.5) {
    this.setFromCreation(m, s, u);
    return this;
  }

  setFromCreation(m = 0, s = 0, u = 0.5) {
    this.mediation = m;
    this.specificity = s;
    this.utility = u;

    return this;
  }

  setFromHex(hex: string) {
    const color = culori.oklch(culori.rgb(hex));

    if (!color) {
      console.warn("idea :: setFromHex - invalid hex color");
      return this;
    }

    this.mediation = color.h / 360;
    this.specificity = color.c / 0.322;
    this.utility = color.l;

    return this;
  }

  updateFromText(text: string) {
    const len = text.length;
    this.mediation = hashStringToRange(text);
    this.specificity = (1 - (len == 0 ? 1 : 1 / len)) * 0.5;

    return this;
  }

  setUtility(utility: number) {
    this.utility = utility;

    return this;
  }

  getHex(): HexColorString {
    const fixedColor = culori.rgb({
      mode: "oklch",
      l: this.utility,
      c: this.specificity * 0.322,
      h: this.mediation * 360,
    });

    return culori.formatHex(fixedColor);
  }

  getOpposite(): Idea {
    const newM =
      this.mediation + 0.5 > 1 ? this.mediation - 0.5 : this.mediation + 0.5;
    const newS = this.specificity;

    const newU = 0.5 - (this.utility - 0.5);
    return new Idea().setFromCreation(newM, newS, newU);
  }

  clone(): Idea {
    return new Idea(this.mediation, this.specificity, this.utility);
  }
}

const AVG_CHAR_VAL = 100; // each char is roughly 100, so loop every ~50 chars

const hashStringToRange = (str: string, loop = 20): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }
  const scaledLoop = loop * AVG_CHAR_VAL;
  return (count % scaledLoop) / scaledLoop;
};

const wrapNumber = (num: number, range = 10) => {
  return (num % range) / range;
};
