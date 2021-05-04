import { createContext, useContext } from "react";
import { ShopState } from "../types/shop";

export const ShopContext = createContext<ShopState>({} as ShopState);

export function useShop() {
  return useContext(ShopContext);
}
