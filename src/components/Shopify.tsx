import { ReactNode } from "react";
import { useShopifyShop } from "../core";
import Cart from "./Cart";
import { ShopContext } from "../core/contexts/shopify";

type ShopifyProps = {
  domain: string;
  token: string;
  children?: ReactNode | ReactNode[];
  cart?: ReactNode;
};

export function Shopify(props: ShopifyProps) {
  const { domain, token, cart, children } = props;

  const shop = useShopifyShop({
    domain: domain,
    storefrontAccessToken: token,
  });

  return (
    <ShopContext.Provider value={shop}>
      {cart && <Cart />}
      {children}
    </ShopContext.Provider>
  );
}
