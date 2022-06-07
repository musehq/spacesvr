export type RefNode = {
  id: string;
  props: any;
  children?: RefNode[];
};

export type RefTree = RefNode[];
