import { Idea } from "./idea";
import { HexColorString, Vector3 } from "three";

type RefNode = {
  id: string;
  props: any;
  children?: RefNode[];
};

type RefTree = RefNode[];

/**
 * a world is a set of ideas
 */
export class World {
  id: string;
  predecessor?: string;
  dataUrl?: string;
  upToDate: boolean;
  tree: RefTree;
  creatorIds: number[];

  constructor() {
    return this;
  }

  getIdea(): Idea {
    return new Idea().setFromCreation(
      hashStringToRange(JSON.stringify(this.tree || this.id), 3),
      0.3 + 0.7 * hashStringToRange(this.id),
      0.8
    );
  }

  getAxiom(): Idea {
    const str = JSON.stringify(this.tree || this.id);
    const strHash = new Array(10)
      .fill(1)
      .map(() => str)
      .join("");
    return new Idea().setFromCreation(
      hashStringToRange(strHash, 15),
      0.3 + 0.7 * hashStringToRange(strHash, 10),
      0.8
    );
  }

  getUpNorm(): Vector3 {
    // 4 digit long hex values
    const x = parseInt(this.id.split("-")[1], 16) / Math.pow(16, 4);
    const y = parseInt(this.id.split("-")[2], 16) / Math.pow(16, 4);
    const z = parseInt(this.id.split("-")[3], 16) / Math.pow(16, 4);
    return new Vector3(x, y, z).normalize();
  }

  getRange(): number {
    const r = parseInt(this.id.split("-")[0], 16) / Math.pow(16, 8);
    return 0.3 + 0.7 * r;
  }

  getHex(): HexColorString {
    return this.getIdea().getHex();
  }
}

const AVG_CHAR_VAL = 100; // each char is roughly 100, so loop every ~50 chars

const hashStringToRange = (str: string, loop = 8): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }
  const scaledLoop = loop * AVG_CHAR_VAL;
  return (count % scaledLoop) / scaledLoop;
};
