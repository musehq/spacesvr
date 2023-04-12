import { GroupProps, useFrame } from "@react-three/fiber";
import { useNetwork } from "../../../layers/Network/logic/network";
import { useEffect, useRef, useState } from "react";
import { CanvasTexture } from "three";

export default function VoiceLevels(props: GroupProps) {
  const { localStream } = useNetwork();

  const [analyser, setAnalyser] = useState<AnalyserNode | undefined>();
  const [canvas] = useState(document.createElement("canvas"));
  const [dataArray] = useState(new Uint8Array(128));
  const canvasTexture = useRef<CanvasTexture>(null);

  useEffect(() => {
    if (!localStream) return;

    // @ts-ignore
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    analyser.smoothingTimeConstant = 0.8;
    const source = audioCtx.createMediaStreamSource(localStream);
    source.connect(analyser);
    setAnalyser(analyser);
  }, [localStream]);

  useFrame(() => {
    const canvasCtx = canvas.getContext("2d");
    if (!analyser || !canvasCtx || !canvasTexture.current) return;
    canvasTexture.current.needsUpdate = true;

    analyser.getByteFrequencyData(dataArray);
    analyser.smoothingTimeConstant = 0.85;

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    // canvasCtx.fillStyle = "#20C20E";
    // canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.fillStyle = "rgb(0, 0, 0)";

    const buckets = 6;
    const spacing = 4;
    const height = 20;
    const sliceWidth = canvas.width / buckets - spacing;

    let x = 0;
    for (let b = 0; b < buckets; b++) {
      const base_perc = 0.2;
      const realY =
        ((dataArray[b] / 256.0) * (1 - base_perc) + base_perc) * canvas.height;
      let y = 0;
      while (y < realY) {
        const nextY = Math.min(y + height, realY);
        canvasCtx.fillRect(x, canvas.height - y, sliceWidth, height);
        y = nextY + spacing;
      }

      x += sliceWidth + spacing;
    }
  });

  if (!localStream) return null;

  return (
    <group name="voice-levels" {...props}>
      <mesh>
        <planeGeometry args={[0.095, 0.075]} />
        <meshStandardMaterial transparent>
          <canvasTexture
            // minFilter={LinearFilter}
            ref={canvasTexture}
            args={[canvas]}
            attach="map"
          />
        </meshStandardMaterial>
      </mesh>
    </group>
  );
}
