import { World } from "./world";

type RefNode = {
  id: string;
  props: any;
  children?: RefNode[];
};

type RefTree = RefNode[];

/**
 * A site is just a delivery method of a world.
 */
export class Site {
  id: string;
  slug: string;
  name: string;
  owner: number;
  world: World;

  constructor() {
    return this;
  }
}
