import { useEffect, useMemo, useState } from "react";
import { GroupProps, useThree } from "@react-three/fiber";
import { AudioAnalyser, PositionalAudio, Vector3, AudioListener } from "three";

type AudioProps = {
  url: string;
  dCone?: Vector3;
  rollOff?: number;
  volume?: number;
  setAudioAnalyser?: (aa: AudioAnalyser) => void;
  fftSize?: 64 | 128 | 256 | 512 | 1024;
} & GroupProps;

export function Audio(props: AudioProps) {
  const {
    url,
    dCone = new Vector3(180, 230, 0.1),
    rollOff = 1,
    volume = 1,
    setAudioAnalyser,
    fftSize = 128,
    ...rest
  } = props;

  const [speaker, setSpeaker] = useState<PositionalAudio>();
  const camera = useThree((state) => state.camera);

  const audio = useMemo(() => {
    const a = document.createElement("audio");
    a.src = url;
    a.autoplay = false;
    a.preload = "auto";
    a.crossOrigin = "Anonymous";
    a.loop = true;
    return a;
  }, []);

  useEffect(() => {
    const setupAudio = () => {
      if (!audio.paused && !speaker) {
        const listener = new AudioListener();
        camera.add(listener);

        const speak = new PositionalAudio(listener);
        speak.setMediaElementSource(audio);
        speak.setRefDistance(0.75);
        speak.setRolloffFactor(rollOff);
        speak.setVolume(volume);
        speak.setDirectionalCone(dCone.x, dCone.y, dCone.z);

        if (setAudioAnalyser) {
          setAudioAnalyser(new AudioAnalyser(speak, fftSize));
        }

        setSpeaker(speak);
      }
    };

    const playAudio = () => audio.play().then(() => setupAudio());

    if (audio) {
      audio.setAttribute("src", url);
      audio.play().then(() => setupAudio());
      document.addEventListener("click", playAudio);
      return () => {
        document.removeEventListener("click", playAudio);
      };
    }
  }, [speaker, audio, url]);

  useEffect(() => {
    if (!speaker) return;

    speaker.setRolloffFactor(rollOff);
    speaker.setVolume(volume);
    speaker.setDirectionalCone(dCone.x, dCone.y, dCone.z);
  }, [dCone, rollOff, volume]);

  return (
    <group name="spacesvr-audio" {...rest}>
      {speaker && <primitive object={speaker} />}
    </group>
  );
}
