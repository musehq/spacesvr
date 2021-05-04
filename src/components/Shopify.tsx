import { createContext, ReactNode, useContext } from "react";
import { useShopifyShop, ShopState, Product } from "../core";
import Cart from "./Cart";

export const ShopContext = createContext<ShopState>({} as ShopState);

type ShopifyProps = {
  domain: string;
  token: string;
  children?: ReactNode;
  noCart?: boolean;
  rights?: string;
  cartModel?: ReactNode;
};

export function Shopify(props: ShopifyProps) {
  const { domain, token, noCart, rights, cartModel, children } = props;

  const shop = useShopifyShop({
    domain: domain,
    storefrontAccessToken: token,
    rights: rights,
  });

  return (
    <ShopContext.Provider value={shop}>
      {!noCart && <Cart cartModel={cartModel} />}
      {children}
    </ShopContext.Provider>
  );
}

export function useProduct(productId: string) {
  const { products } = useContext(ShopContext);
  if (products.length === 0) return null;

  return products.find((prod) => prod.id === productId);
}

export function useShop() {
  return useContext(ShopContext);
}

export const addToCart = (
  shop: ShopState,
  productId: string,
  variant?: number
) => {
  const { cart, products } = shop;
  if (products.length === 0) return null;

  let product: Product | undefined = undefined;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id === productId) product = products[i];
  }

  // @ts-ignore
  if (
    product !== undefined &&
    product.variants[variant ? variant : 0].available
  ) {
    // @ts-ignore
    cart.add(product.variants[variant ? variant : 0].id);
    return true;
  }
  return false;
};
