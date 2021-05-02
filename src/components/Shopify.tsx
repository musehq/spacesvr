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

let shop: ShopState | undefined = undefined;

export function Shopify(props: ShopifyProps) {
  const { domain, token, noCart, rights, cartModel, children } = props;

  shop = useShopifyShop({
    domain: domain,
    storefrontAccessToken: token,
    rights: rights,
  });
  // console.log(getProducts());

  return (
    <ShopContext.Provider value={shop}>
      {!noCart && <Cart cartModel={cartModel} />}
      {children}
    </ShopContext.Provider>
  );
}

export function getProduct(productId: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { products } = useContext(ShopContext);
  if (products.length === 0) return null;

  for (let i = 0; i < products.length; i++) {
    // console.log(products[i]);
    if (products[i].id === productId) return products[i];
  }

  return false;
}

export function getShop() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { cart, products } = useContext(ShopContext);
  return { cart: cart, products: products };
}

export const addToCart = (
  shop: ShopState,
  productId: string,
  variant?: number
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { cart, products } = shop;
  if (products.length === 0) return null;

  let product: Product | undefined = undefined;
  for (let i = 0; i < products.length; i++) {
    // console.log(products[i]);
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

export function clearCart() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { cart } = useContext(ShopContext);
  if (!cart) return null;
  cart.clear();
  return true;
}
