import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "react-three-fiber";
import { Vector2 } from "three";
import { Group } from "three";
import { useEnvironment } from "../core";

type VideoProps = JSX.IntrinsicElements["group"] & {
  src: string;
  ratio: [number, number];
  sizeScale: number;
  framed?: boolean;
  muted?: boolean;
  doubleSided?: boolean;
};

const frameWidth = 0.3;
const frameDepth = 0.1;
const borderThickness = 0.2;
const borderDepth = 0.2;
const meshOffset = 0.0005;

export const Video = (props: VideoProps) => {
  const {
    src,
    sizeScale,
    ratio,
    framed,
    position,
    rotation,
    muted,
    doubleSided,
  } = props;

  const { camera, scene } = useThree();
  const { container, paused } = useEnvironment();
  const group = useRef<Group>();

  // video state
  const videoRef = useRef<HTMLVideoElement>();
  const textureRef = useRef<THREE.VideoTexture>();
  const [texReady, setTexReady] = useState(false);

  // audio refs
  const listener = useRef<THREE.AudioListener>();
  const speaker = useRef<THREE.PositionalAudio>();

  useFrame(() => {
    if (!texReady && videoRef?.current && videoRef?.current?.currentTime > 0) {
      setTexReady(true);
    }
  });

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.8,
        metalness: 0.05,
      }),
    []
  );

  // sizing
  const normalizedRatio = new Vector2(ratio[0], ratio[1]).normalize();
  const width = normalizedRatio.x * sizeScale;
  const height = normalizedRatio.y * sizeScale;

  // video textures use effect
  useEffect(() => {
    if (container && !videoRef.current) {
      // build video dom element
      const video = document.createElement("video");
      const source = document.createElement("source");
      source.src = src;
      video.loop = true;
      //@ts-ignore
      video.playsInline = true;
      video.crossOrigin = "anonymous";
      video.preload = "auto";
      video.autoplay = false;
      video.muted = muted || false;
      video.style.position = "absolute";
      video.style.opacity = "0";
      video.style.pointerEvents = "none";
      video.style.visibility = "hidden";

      // add to parent container
      container.appendChild(video);
      video.appendChild(source);

      // create video texture
      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.format = THREE.RGBFormat;
      texture.matrixAutoUpdate = false;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      videoRef.current = video;
      textureRef.current = texture;

      return () => {
        video.pause();
        video.remove();
        videoRef.current = undefined;

        texture.dispose();
        textureRef.current = undefined;

        if (speaker.current) {
          speaker.current.disconnect();
          speaker.current = undefined;
        }
        if (listener.current) {
          camera.remove(listener.current);
        }

        setTexReady(false);
      };
    }
  }, [container, videoRef?.current]);

  // audio useeffect
  useEffect(() => {
    if (!muted && !paused && camera && videoRef.current && !speaker.current) {
      listener.current = new THREE.AudioListener();
      camera.add(listener.current);

      speaker.current = new THREE.PositionalAudio(listener.current);
      speaker.current.setMediaElementSource(videoRef.current);
      speaker.current.setRefDistance(0.75);
      speaker.current.setRolloffFactor(1);
      speaker.current.setVolume(1);
      speaker.current.setDirectionalCone(180, 230, 0.1);
      if (position) {
        // @ts-ignore due to bad types, it's an array though
        speaker.current.position.set(position[0], position[1], position[2]);
      }
      if (rotation) {
        // @ts-ignore due to bad types, it's an array though
        speaker.current.rotation.set(rotation[0], rotation[1], rotation[2]);
      }

      scene.add(speaker.current);
    }
  }, [videoRef.current, camera, speaker.current, listener.current, paused]);

  // play video if player closes menu
  useEffect(() => {
    if (!paused && videoRef.current && videoRef.current.paused) {
      videoRef.current.play();
    }
  }, [paused]);

  return (
    <group {...props}>
      <group ref={group}>
        {texReady && (
          <mesh>
            <planeBufferGeometry attach="geometry" args={[width, height]} />
            <meshStandardMaterial
              attach="material"
              map={textureRef.current}
              side={doubleSided ? THREE.DoubleSide : undefined}
            />
          </mesh>
        )}
        {framed && (
          <>
            {!doubleSided && (
              <mesh position-z={[-0.1 - meshOffset]} material={material}>
                <boxBufferGeometry
                  attach="geometry"
                  args={[width + frameWidth, height + frameWidth, frameDepth]}
                />
              </mesh>
            )}
            {/* top */}
            <mesh
              position-y={height / 2 + frameWidth / 2 - borderThickness / 2}
              material={material}
            >
              <boxBufferGeometry
                attach="geometry"
                args={[width + frameWidth, borderThickness, borderDepth]}
              />
            </mesh>
            {/* bottom */}
            <mesh
              position-y={-height / 2 - frameWidth / 2 + borderThickness / 2}
              material={material}
            >
              <boxBufferGeometry
                attach="geometry"
                args={[width + frameWidth, borderThickness, borderDepth]}
              />
            </mesh>
            {/* left */}
            <mesh
              position-x={-width / 2 - frameWidth / 2 + borderThickness / 2}
              material={material}
            >
              <boxBufferGeometry
                attach="geometry"
                args={[borderThickness, height + frameWidth, borderDepth]}
              />
            </mesh>
            {/* right */}
            <mesh
              position-x={width / 2 + frameWidth / 2 - borderThickness / 2}
              material={material}
            >
              <boxBufferGeometry
                attach="geometry"
                args={[borderThickness, height + frameWidth, borderDepth]}
              />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
};
