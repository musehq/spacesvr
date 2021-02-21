export type AssetUrls = string[];

export type AssetType = "model" | "env" | "image" | null;

export interface Asset {
  url: string;
  type: AssetType;
  loaded: boolean;
  error: boolean;
  data: any;
}

export interface Assets {
  [key: string]: Asset;
}

export type LoadingState = {
  legacyLoader: boolean;
  progress: number;
  assets: Assets;
};
