import { useEffect, useMemo, useState } from "react";
// @ts-ignore
import ShopifyBuy from "shopify-buy";
import { Cart, Product, ShopState } from "../types/shop";

type ShopifyClient = {
  domain: string;
  storefrontAccessToken: string;
};

export const useShopifyShop = (props: ShopifyClient): ShopState => {
  const { domain, storefrontAccessToken } = props;

  const client = useMemo(
    () => ShopifyBuy.buildClient({ domain, storefrontAccessToken }),
    [domain, storefrontAccessToken]
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [checkout, setCheckout] = useState<any>();

  useEffect(() => {
    // fetch products, cast to Product type
    client.product
      .fetchAll()
      .then((shopifyProducts: any) =>
        setProducts(shopifyToProduct(shopifyProducts))
      );

    // fetch cart id from local storage or create a new one
    const id = localStorage.getItem("muse-cart-id");
    if (id) {
      client.checkout
        .fetch(id)
        .then((shopifyCheckout: any) => setCheckout(shopifyCheckout));
    } else {
      client.checkout
        .create()
        .then((shopifyCheckout: any) => setCheckout(shopifyCheckout));
    }
  }, [client]);

  // create cart object
  const cart: Cart = {
    items: checkout ? checkout.lineItems : [],
    url: checkout?.webUrl,
    add: (id: string, quantity = 1) => {
      if (!checkout?.id) return;
      const lineItemsToAdd = { variantId: id, quantity };
      client.checkout
        .addLineItems(checkout.id, lineItemsToAdd)
        .then((newCheckout: any) => {
          localStorage.setItem("muse-cart-id", newCheckout.id);
          setCheckout(newCheckout);
        });
    },
    remove: (id: string) => {
      if (!checkout?.id) return;
      const checkoutId = checkout.id;
      client.checkout
        .removeLineItems(checkoutId, id)
        .then((newCheckout: any) => {
          localStorage.setItem("muse-cart-id", newCheckout.id);
          setCheckout(newCheckout);
        });
    },
    count: checkout?.lineItems
      ? checkout.lineItems.reduce(
          (acc: number, cur: any) => acc + cur.quantity,
          0
        )
      : 0,
    clear: () => {
      client.checkout.create().then((shopifyCheckout: any) => {
        setCheckout(shopifyCheckout);
        localStorage.setItem("muse-cart-id", shopifyCheckout.id);
      });
    },
  };

  return {
    products,
    cart,
  };
};

const shopifyToProduct = (shopifyProducts: any) =>
  shopifyProducts.map((product: any) => ({
    id: product.id,
    title: product.title,
    available: product.availableForSale,
    handle: product.handle,
    description: product.description,
    images: product.images.map((image: any) => image.src),
    variants: product.variants.map((variant: any) => ({
      id: variant.id,
      available: variant.available,
      price: variant.price,
    })),
  }));
