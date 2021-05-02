import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useState } from "react";
import { Interactable, getProduct, addToCart, useShop } from "spacesvr";

const WIDTH = 1;
const HEIGHT = 0.15;
const PADDING_Y = 0.035;
const PADDING_X = 0.02;

const TITLE_FONT = {
  fontSize: 0.025,
  color: "black",
  anchorX: "left",
  textAlign: "left",
};

const SUB_FONT = {
  fontSize: 0.02,
  color: "black",
  anchorY: "top",
  anchorX: "left",
  textAlign: "left",
};

const Kiosk = (props) => {
  const { width, productName, productId, ...restProps } = props;

  const CART_WIDTH = HEIGHT * 0.5;
  const TEXT_WIDTH = WIDTH - CART_WIDTH - PADDING_X * 3;

  const product = getProduct(productId);
  const shop = useShop();
  const { cart } = shop;

  const [variantIndex, setVariantIndex] = useState(0);

  const variant =
    product && product.variants.length ? product.variants[variantIndex] : null;

  const handleClick = () => {
    addToCart(shop, product.id);
  };

  return (
    <group {...restProps} name="control">
      <group rotation-x={-Math.PI * 0.13}>
        <group position-y={HEIGHT / 2} name="content">
          <mesh position-z={-0.026}>
            <boxBufferGeometry args={[WIDTH, HEIGHT, 0.05]} />
            <meshStandardMaterial color="white" side={THREE.DoubleSide} />
          </mesh>
          {/* @ts-ignore */}
          <Text
            name="title"
            {...TITLE_FONT}
            position-y={HEIGHT / 2 - PADDING_Y}
            position-x={-WIDTH / 2 + PADDING_X}
            maxWidth={TEXT_WIDTH}
          >
            {productName ? productName : product ? product.title : "Loading..."}
          </Text>
          {/* @ts-ignore */}
          <Text
            name="subtitle"
            {...SUB_FONT}
            position-y={0.025}
            position-x={-WIDTH / 2 + PADDING_X}
            maxWidth={TEXT_WIDTH}
          >
            {variant
              ? `$${variant.price}${variant.available ? "" : " - OUT OF STOCK"}`
              : "Loading..."}
          </Text>
          <group
            name="add-to-cart"
            position-x={WIDTH / 2 - CART_WIDTH / 2 - PADDING_X}
            position-y={0.01}
          >
            <Interactable onClick={handleClick}>
              <mesh>
                <boxBufferGeometry args={[CART_WIDTH, CART_WIDTH, 0.02]} />
                <meshStandardMaterial
                  color={variant && variant.available ? "red" : "gray"}
                />
              </mesh>
            </Interactable>
            {/* @ts-ignore */}
            <Text
              fontSize={0.07}
              color="white"
              textAlign="center"
              anchorY="middle"
              anchorX="center"
              position-z={0.021}
            >
              {variant && variant.available ? "+" : "x"}
            </Text>
          </group>
        </group>
      </group>
    </group>
  );
};

export default Kiosk;
