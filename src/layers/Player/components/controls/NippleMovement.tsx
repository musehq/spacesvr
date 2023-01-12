import { useRef, useEffect, MutableRefObject } from "react";
import { Global, css } from "@emotion/react";
import { Vector3 } from "three";
import nipplejs, { JoystickManager } from "nipplejs";
import { useEnvironment } from "../../../Environment";

type NippleMovementProps = {
  direction: MutableRefObject<Vector3>;
};

/**
 * NippleMovement gives the player a direction to move by taking
 * input from a nipple (joystick).
 *
 * Direction is stored as a Vector3 with the following format
 *    x: left/right movement, + for right
 *    y: forward/back movement, + for forwards
 *    z: up/down movement, + for up
 *
 * @param props
 * @constructor
 */
const NippleMovement = (props: NippleMovementProps) => {
  const { direction } = props;

  const nipple = useRef<JoystickManager>();
  const nippleContainer = useRef<HTMLElement>();
  const { containerRef } = useEnvironment();

  useEffect(() => {
    if (containerRef.current) {
      nippleContainer.current = document.createElement("div");
      nippleContainer.current.style.position = "fixed";
      nippleContainer.current.style.left = "0";
      nippleContainer.current.style.bottom = "0";
      nippleContainer.current.style.width = "40%";
      nippleContainer.current.style.maxWidth = "160px";
      nippleContainer.current.style.height = "25%";
      nippleContainer.current.style.height = "160px";
      nippleContainer.current.style.zIndex = "5";
      // add class identifier to nippleContainer to identify touchEvents
      nippleContainer.current.classList.add("nipple-container");
      containerRef.current.appendChild(nippleContainer.current);

      nipple.current = nipplejs.create({
        zone: nippleContainer.current,
        mode: "static",
        position: { left: "50%", top: "50%" },
        color: "#fff",
        size: 120,
        restOpacity: 0.75,
      });

      nipple.current.on("move", (evt, data) => {
        // i kinda pulled 60 out of my ass tbh
        const x = (data.distance / 60) * Math.cos(data.angle.radian);
        const z = (-data.distance / 60) * Math.sin(data.angle.radian);
        direction.current.set(x, 0, z);
      });

      nipple.current.on("end", () => {
        direction.current.set(0, 0, 0);
      });

      nippleContainer.current.addEventListener("touchstart", (ev) => {
        ev.preventDefault();
      });

      return () => {
        if (nipple.current) nipple.current.destroy();
      };
    }
  }, []);

  const nippleStyles = css`
    .nipple-container > * > .front,
    .nipple-container > * > .back {
      background: radial-gradient(white, white 64%, black 86%) !important;
    }
  `;

  return <Global styles={nippleStyles} />;
};

export default NippleMovement;
