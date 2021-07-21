// @ts-ignore
import * as culori from "culori";
import { BackendWorld } from "../types/world";
import { Idea } from "./idea";

/**
 * an world is a set of ideas
 */
export class World {
  id: string;
  userId: number;
  name: string;
  slug?: string;
  predecessor?: string;
  dataUrl?: string;
  upToDate: boolean;

  constructor() {
    return this;
  }

  setFromBackendWorld(backendWorld: BackendWorld) {
    this.id = backendWorld.id;
    this.userId = backendWorld.user_id;
    this.name = backendWorld.name;
    this.slug = backendWorld.slug;
    this.predecessor = backendWorld.predecessor;
    this.dataUrl = backendWorld.data_url;
    this.upToDate = backendWorld.up_to_date;

    return this;
  }

  getIdea(): Idea {
    return new Idea().setFromCreation(
      hashStringToRange(this.slug || this.dataUrl || "come on son", 3),
      hashStringToRange(this.id),
      0.96
    );
  }

  getHex(): string {
    return this.getIdea().getHex();
  }
}

const AVG_CHAR_VAL = 100; // each char is roughly 100, so loop every ~50 chars
const GLOBAL_SEED = Math.random() * 900;

const hashStringToRange = (str: string, loop = 8): number => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    count += str.substr(i, 1).charCodeAt(0);
  }
  const scaledLoop = loop * AVG_CHAR_VAL;
  return ((GLOBAL_SEED + count) % scaledLoop) / scaledLoop;
};
