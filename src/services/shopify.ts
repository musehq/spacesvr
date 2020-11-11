import { useEffect, useState } from "react";
// @ts-ignore
import ShopifyBuy from "shopify-buy";

type ShopifyProps = {
  domain: string;
  token: string;
};

export const useShopify = (props: ShopifyProps) => {
  const { domain, token } = props;
  const client = ShopifyBuy.buildClient({
    domain: domain,
    storefrontAccessToken: token,
  });
  const [products, setProducts] = useState();
  const [checkout, setCheckout] = useState();
  const [checkoutOpen, setCheckoutOpen] = useState("false");

  useEffect(() => {
    if (!products && !checkout) {
      client.product
        .fetchAll()
        // @ts-ignore
        .then((shopifyProducts) => setProducts(shopifyProducts));
      client.checkout
        .create()
        // @ts-ignore
        .then((shopifyCheckout) => setCheckout(shopifyCheckout));
    }
  }, [products, checkout]);

  return {
    client,
    products,
    checkout,
    setCheckout,
    checkoutOpen,
    setCheckoutOpen,
  };
};
