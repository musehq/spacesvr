import { useMemo, useState } from "react";
import { useLimitedFrame } from "../../../../../logic/limiter";
import { useNetwork } from "../../../logic/network";
import { PositionalAudio } from "three";
import { useListener } from "./resources";

type Entity = {
  id: string;
  posAudio: PositionalAudio | undefined;
};

export const useEntities = (): Entity[] => {
  const { connections, connected, voiceStreams } = useNetwork();

  const listener = useListener();
  const [ct, setCt] = useState(0);
  const rerender = () => setCt(Math.random());

  const entities = useMemo<Entity[]>(() => [], []);

  const sameIds = (ids1: string[], ids2: string[]) =>
    ids1.sort().join(",") === ids2.sort().join(",");

  // check for a change in player list, re-render if there is a change
  const [connectionIds, setConnectionIds] = useState<string[]>([]);
  const [voiceIds, setVoiceIds] = useState<string[]>([]);
  useLimitedFrame(6, () => {
    if (!connected) return;

    // check for changes in connections
    const locConnectionIds = Array.from(connections.keys());
    if (!sameIds(connectionIds, locConnectionIds)) {
      setConnectionIds(locConnectionIds);

      // remove entities that are no longer connected
      entities.map((e) => {
        if (!locConnectionIds.includes(e.id)) {
          entities.splice(entities.indexOf(e), 1);
        }
      });

      // add in new entities
      for (const id of locConnectionIds) {
        if (!entities.some((e) => e.id === id)) {
          entities.push({ id, posAudio: undefined });
        }
      }

      rerender();
    }

    const locVoiceIds = Array.from(voiceStreams.keys());
    if (!sameIds(voiceIds, locVoiceIds)) {
      setVoiceIds(locVoiceIds);

      // remove voice streams that are no longer connected
      entities.map((e) => {
        if (!locVoiceIds.includes(e.id)) {
          e.posAudio?.remove();
          e.posAudio = undefined;
        }
      });

      // add in new voice streams
      for (const id of locVoiceIds) {
        if (!entities.some((e) => e.id === id)) {
          entities.push({ id, posAudio: undefined });
        }

        const entity = entities.find((e) => e.id === id)!;

        const stream = voiceStreams.get(id)!;

        const audioElem = document.createElement("audio");
        audioElem.autoplay = true;
        audioElem.srcObject = stream;
        audioElem.muted = true;
        const posAudio = new PositionalAudio(listener);
        posAudio.userData.peerId = id;
        posAudio.setMediaStreamSource(audioElem.srcObject);
        posAudio.setRefDistance(2);
        posAudio.setDirectionalCone(150, 230, 0.2);
        entity.posAudio = posAudio;
      }

      rerender();
    }
  });

  return entities;
};
