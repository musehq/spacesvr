import { GroupProps } from "@react-three/fiber";
import { Image } from "../../../ideas/media/Image";
import Pane from "./Pane";
import { useNetwork } from "../../../layers";
import { useEffect, useState } from "react";
import { DropDown } from "./DropDown";

type SpeakerAccessProps = { width: number } & GroupProps;

export default function SpeakerAccess(props: SpeakerAccessProps) {
  const { width, ...rest } = props;

  const { localStream } = useNetwork();
  const [outputDevices, setOutputDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    if (!localStream) {
      console.log("no local stream!");
      return;
    }

    console.log("local stream set up!");
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      // only get inputs
      devices = devices.filter((device) => device.kind === "audiooutput");
      // remove duplicates (namely the default microphone)
      devices = devices.filter(
        (device, index) =>
          devices.findIndex((d) => d.groupId === device.groupId) === index
      );
      console.log("devices:", devices);
      setOutputDevices(devices);
    });
  }, [localStream]);

  return (
    <group name="speaker-access" {...rest}>
      <Pane width={width} height={0.1}>
        <Image
          src="/volume.png"
          scale={0.075}
          position-x={-width / 2 + 0.075 / 2 + 0.02}
        />
        <DropDown
          items={outputDevices.map((device, i) => ({
            text: device.label || `speaker ${i}`,
            value: device.deviceId,
          }))}
          width={width}
          position-y={-0.095}
          position-z={0}
        />
      </Pane>
    </group>
  );
}
