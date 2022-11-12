import { GroupProps } from "@react-three/fiber";
import { Image } from "../../../ideas/media/Image";
import Pane from "./Pane";
import { useNetwork } from "../../../layers/Network/logic/network";
import { useCallback, useEffect, useState } from "react";
import { DropDown } from "./DropDown";
import { Spinning, Switch } from "../../../ideas";
import VoiceLevels from "./VoiceLevels";
import { Text } from "@react-three/drei";
import Request from "./Request";

type MicAccessProps = {
  width: number;
} & GroupProps;

export default function MicAccess(props: MicAccessProps) {
  const { width, ...rest } = props;

  const { localStream, setInputDevice } = useNetwork();
  const [inputDevices, setInputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [mute, setMute] = useState(false);
  const permissionGranted = !!localStream;

  const refreshDevices = useCallback(() => {
    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      devices = devices.filter((device) => device.kind === "audioinput");
      devices = devices.filter(
        (device, index) =>
          devices.findIndex((d) => d.groupId === device.groupId) === index
      );
      setInputDevices(devices);
    });
  }, []);

  useEffect(() => {
    if (localStream) refreshDevices();
  }, [localStream, refreshDevices]);

  useEffect(() => {
    if (!navigator.mediaDevices) return;
    navigator.mediaDevices.ondevicechange = () => refreshDevices();
  }, [refreshDevices]);

  useEffect(() => {
    const id = localStream?.getTracks()[0].getSettings().deviceId;
    setLoading(!!selectedDevice && selectedDevice !== id);
  }, [localStream, selectedDevice]);

  useEffect(() => {
    if (!localStream) return;
    localStream.getAudioTracks()[0].enabled = !mute;
  }, [localStream, mute]);

  return (
    <group name="mic-access" {...rest}>
      <Pane width={width} height={0.1}>
        <Image
          src={
            mute || !permissionGranted
              ? "https://d27rt3a60hh1lx.cloudfront.net/icons/microphone-off.ktx2"
              : "https://d27rt3a60hh1lx.cloudfront.net/icons/microphone.ktx2"
          }
          scale={0.075}
          position-x={-width / 2 + 0.075 / 2 + 0.04}
        />
        <group position-x={width / 2 - 0.075 / 2 - 0.04}>
          {loading ||
            (!permissionGranted && (
              <Spinning ySpeed={0} zSpeed={2}>
                <Image
                  src="https://d27rt3a60hh1lx.cloudfront.net/icons/loader.ktx2"
                  scale={0.075}
                />
              </Spinning>
            ))}
          {!loading && <VoiceLevels position-x={-0.01} />}
        </group>
        {permissionGranted && (
          <group position-y={-0.095}>
            <Switch
              value={mute}
              onChange={setMute}
              scale={0.4}
              position-x={0.07}
            />
            <Text
              fontSize={0.035}
              anchorX="right"
              position-x={-0.01}
              color="black"
            >
              mute
            </Text>
          </group>
        )}
        {permissionGranted && (
          <DropDown
            position-y={-0.15}
            value={localStream?.getTracks()[0].getSettings().deviceId}
            items={inputDevices.map((device, i) => ({
              text: device.label || `microphone ${i}`,
              value: device.deviceId,
            }))}
            width={width}
            position-z={0}
            onChange={(item) => {
              setInputDevice(item.value);
              setSelectedDevice(item.value);
            }}
          />
        )}
        {!permissionGranted && (
          <Request position-y={-0.125} position-z={0.15} width={width} />
        )}
      </Pane>
    </group>
  );
}
