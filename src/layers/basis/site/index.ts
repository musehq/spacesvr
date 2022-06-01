import { World } from "../world";

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
