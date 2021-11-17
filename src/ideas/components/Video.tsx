import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import Frame from "../misc/Frame";
import { DoubleSide, Material, sRGBEncoding, Vector2 } from "three";

type Props = JSX.IntrinsicElements["group"] & {
  src: string;
  size?: number;
  framed?: boolean;
  muted?: boolean;
  volume?: number;
  frameMaterial?: Material;
  frameWidth?: number;
};

export const Video = (props: Props) => {
  const {
    src,
    size = 1,
    framed,
    muted,
    volume = 1,
    frameMaterial,
    frameWidth = 1,
  } = props;

  const camera = useThree((state) => state.camera);

  const listener = useRef<THREE.AudioListener>();
  const [speaker, setSpeaker] = useState<THREE.PositionalAudio>();
  const [dims, setDims] = useState<Vector2 | null>();

  const video = useMemo(() => {
    const v = document.createElement("video");
    // @ts-ignore
    v.playsInline = true;
    v.crossOrigin = "Anonymous";
    v.loop = true;
    v.src = src;
    v.autoplay = false;
    v.muted = muted ? muted : false;
    return v;
  }, []);

  useEffect(() => {
    const setupAudio = () => {
      if (!muted && !video.paused && !speaker) {
        const listener = new THREE.AudioListener();
        camera.add(listener);

        const speak = new THREE.PositionalAudio(listener);
        speak.setMediaElementSource(video);
        speak.setRefDistance(0.75);
        speak.setRolloffFactor(1);
        speak.setVolume(volume);
        speak.setDirectionalCone(180, 230, 0.1);

        setSpeaker(speak);
      }
    };

    const playVideo = () => {
      video
        .play()
        .then(() => setDims(new Vector2(video.videoWidth, video.videoHeight)));

      setupAudio();
    };

    if (video) {
      video.play().then(() => {
        setDims(new Vector2(video.videoWidth, video.videoHeight));
        setupAudio();
      });
      document.addEventListener("click", playVideo);
      return () => {
        document.removeEventListener("click", playVideo);
      };
    }
  }, [speaker, video, muted]);

  useEffect(() => {
    return () => {
      if (listener.current) {
        camera.remove(listener.current);
        listener.current.clear();
        listener.current = undefined;
      }
      if (speaker) {
        speaker.clear();
        speaker.disconnect();
        setSpeaker(undefined);
      }
      if (video) {
        video.pause();
        video.remove();
      }
    };
  }, []);

  if (!dims || !video) {
    return null;
  }

  const max = Math.max(dims.x, dims.y);
  const width = (dims.x / max) * size;
  const height = (dims.y / max) * size;

  return (
    <group {...props}>
      <mesh>
        <planeBufferGeometry attach="geometry" args={[width, height]} />
        <meshBasicMaterial side={DoubleSide}>
          <videoTexture attach="map" args={[video]} encoding={sRGBEncoding} />
        </meshBasicMaterial>
      </mesh>
      {speaker && <primitive object={speaker} />}
      {framed && (
        <Frame
          width={width}
          height={height}
          thickness={frameWidth}
          material={frameMaterial}
        />
      )}
    </group>
  );
};
