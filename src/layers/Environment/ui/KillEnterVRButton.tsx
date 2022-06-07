import { useEffect } from "react";

export default function KillEnterVRButton() {
  useEffect(() => {
    let elem = document.getElementById("VRButton");
    if (!elem) {
      const elems = document.getElementsByTagName("a");
      for (const el of elems) {
        if (el.style.zIndex == "999" && el.innerText.includes("XR")) {
          elem = el;
          break;
        }
      }
    }
    if (elem) {
      elem.remove();
    }
  }, []);

  return null;
}
