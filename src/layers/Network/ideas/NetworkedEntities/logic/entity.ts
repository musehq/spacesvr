import { useEffect, useMemo, useRef, useState } from "react";
import { useLimitedFrame } from "../../../../../logic/limiter";
import { useNetwork } from "../../../logic/network";
import { PositionalAudio } from "three";
import { useListener } from "./resources";
import { useEnvironment } from "../../../../Environment";
import { PositionalAudioHelper } from "three/examples/jsm/helpers/PositionalAudioHelper";

type Entity = {
  id: string;
  posAudio: PositionalAudio | undefined;
};

export const useEntities = (): Entity[] => {
  const { connections, connected, voiceStreams } = useNetwork();
  const { paused } = useEnvironment();

  const listener = useListener();
  const [ct, setCt] = useState(0);
  const rerender = () => setCt(Math.random());
  const [firstPaused, setFirstPaused] = useState(true);
  useEffect(() => setFirstPaused(paused && firstPaused), [paused, firstPaused]);

  const entities = useMemo<Entity[]>(() => [], []);

  const sameIds = (ids1: string[], ids2: string[]) =>
    ids1.sort().join(",") === ids2.sort().join(",");

  // check for a change in player list, re-render if there is a change
  const connectionIds = useRef<string[]>([]);
  const voiceIds = useRef<string[]>([]);
  useLimitedFrame(6, () => {
    if (!connected) return;

    // check for changes in connections
    if (!sameIds(connectionIds.current, Array.from(connections.keys()))) {
      connectionIds.current = Array.from(connections.keys());

      // remove entities that are no longer connected
      entities.map((e) => {
        if (!connectionIds.current.includes(e.id)) {
          entities.splice(entities.indexOf(e), 1);
        }
      });

      // add in new entities
      for (const id of connectionIds.current) {
        if (!entities.some((e) => e.id === id)) {
          entities.push({ id, posAudio: undefined });
        }
      }

      rerender();
    }

    // dont run until first time unpaused to make sure audio context is running from first press
    if (
      !firstPaused &&
      !sameIds(voiceIds.current, Array.from(voiceStreams.keys()))
    ) {
      voiceIds.current = Array.from(voiceStreams.keys());

      // remove voice streams that are no longer connected
      entities.map((e) => {
        if (!voiceIds.current.includes(e.id)) {
          e.posAudio?.remove();
          e.posAudio = undefined;
        }
      });

      // add in new voice streams
      for (const id of voiceIds.current) {
        const entity = entities.find((e) => e.id === id);
        if (!entity) continue;

        const stream = voiceStreams.get(id)!;
        if (!stream) continue;

        const audioElem = document.createElement("audio");
        audioElem.srcObject = stream;
        audioElem.muted = true;
        audioElem.autoplay = true;
        audioElem.loop = true;
        //@ts-ignore
        audioElem.playsinline = true;

        const posAudio = new PositionalAudio(listener);
        posAudio.userData.peerId = id;
        posAudio.setMediaStreamSource(stream);
        posAudio.setRefDistance(2);
        posAudio.setDirectionalCone(200, 290, 0.2);
        posAudio.setVolume(0.6);

        // posAudio.add(new PositionalAudioHelper(posAudio, 1));
        entity.posAudio = posAudio;
      }

      rerender();
    }
  });

  return entities;
};
