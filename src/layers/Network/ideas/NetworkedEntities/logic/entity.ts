import { useEffect, useMemo, useState } from "react";
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
  const { connections, connected, mediaConnections } = useNetwork();
  const { paused } = useEnvironment();

  const listener = useListener();
  const [ct, setCt] = useState(0);
  const rerender = () => setCt(Math.random());
  const [firstPaused, setFirstPaused] = useState(true);
  useEffect(() => setFirstPaused(paused && firstPaused), [paused, firstPaused]);

  const entities = useMemo<Entity[]>(() => [], []);

  const needsAudio = (e: Entity) => mediaConnections.has(e.id) && !e.posAudio;

  // check for a change in player list, re-render if there is a change
  useLimitedFrame(3, () => {
    if (!connected) return;

    // changed flag to trigger re-render at the end
    let changed = false;

    // remove old entities
    entities.map((e) => {
      if (!connections.has(e.id)) {
        if (e.posAudio) {
          e.posAudio.remove();
          e.posAudio = undefined;
        }
        entities.splice(entities.indexOf(e), 1);
        changed = true;
      }
    });

    // add in new entities
    for (const id of Array.from(connections.keys())) {
      if (!entities.some((e) => e.id === id)) {
        entities.push({ id, posAudio: undefined });
        changed = true;
      }
    }

    // dont run until first time unpaused to make sure audio context is running from first press
    if (!firstPaused) {
      // remove media connections streams that are no longer connected
      entities.map((e) => {
        if (!mediaConnections.has(e.id)) {
          e.posAudio?.remove();
          e.posAudio = undefined;
          changed = true;
        }
      });

      entities.filter(needsAudio).map((e) => {
        // add in new media connections if the stream is active
        const mediaConn = mediaConnections.get(e.id);
        if (!mediaConn) return;
        if (!mediaConn.remoteStream) return;
        console.log("adding audio for", e.id);

        const audioElem = document.createElement("audio");
        audioElem.srcObject = mediaConn.remoteStream; // remote is incoming, local is own voice
        audioElem.muted = true;
        audioElem.autoplay = true;
        audioElem.loop = true;
        //@ts-ignore
        audioElem.playsInline = true;

        const posAudio = new PositionalAudio(listener);
        posAudio.userData.peerId = e.id;
        posAudio.setMediaStreamSource(audioElem.srcObject);
        posAudio.setRefDistance(2);
        posAudio.setDirectionalCone(200, 290, 0.35);

        // posAudio.add(new PositionalAudioHelper(posAudio, 1));
        e.posAudio = posAudio;

        changed = true;
      });
    }

    if (changed) rerender();
  });

  return entities;
};
