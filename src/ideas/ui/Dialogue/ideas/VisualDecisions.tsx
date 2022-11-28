import { Decision } from "../logic/types";
import { useEffect, useMemo, useState } from "react";
// @ts-ignore
import { Text as TextImpl } from "troika-three-text";
import { Triplet } from "@react-three/cannon";
import { Idea } from "../../../../logic/basis";
import { Button } from "../../../../ideas/ui/Button";
import { FacePlayer } from "../../../../ideas/modifiers/FacePlayer";

type DecisionProps = {
  decisions: Decision[];
  width: number;
  setCurKey: (key: string) => void;
};

export default function VisualDecisions(props: DecisionProps) {
  const { decisions, setCurKey, width } = props;

  const FONT_FILE =
    "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";
  const FONT_SIZE = 0.05;
  const OUTLINE_WIDTH = FONT_SIZE * 0.1;
  const PADDING_Y = 0.065;
  const SPACING_Y = 0.015;
  const SPACING_X = 0.08;
  const PADDING_X = 0.025;

  const [dimMap] = useState(() => new Map<string, { w: number; h: number }>());
  const [ready, setReady] = useState(false);

  // for every new set of values, generate a new text object and store width
  // keep ready state in sync with whether all values have been measured
  useEffect(() => {
    if (decisions.every((d) => dimMap.has(d.name))) return;
    setReady(false);
    for (const decision of decisions) {
      if (dimMap.has(decision.name)) continue;
      setReady(false);
      const t = new TextImpl();
      t.text = decision.name;
      t.font = FONT_FILE;
      t.fontSize = FONT_SIZE;
      t.maxWidth = width;
      t.outlineWidth = OUTLINE_WIDTH;
      t.sync(() => {
        const { blockBounds } = t.textRenderInfo;
        const w = blockBounds[2] - blockBounds[0];
        const h = blockBounds[3] - blockBounds[1];
        dimMap.set(decision.name, { w, h });
        if (decisions.every((d) => dimMap.has(d.name))) setReady(true);
      });
    }
  }, [decisions, dimMap, FONT_SIZE, FONT_FILE, width, OUTLINE_WIDTH]);

  const objValues = useMemo(() => {
    type Line = { y: number; decisions: Decision[] };
    const lines: Line[] = [];
    let thisLineWidth = 0;
    let thisLineIndex = 0;
    let y = -FONT_SIZE;
    let lastHei = 0;

    // calculate lines and y positions
    for (const decision of decisions) {
      const wid =
        (dimMap.get(decision.name)?.w || 0) + PADDING_X * 2 + SPACING_X;
      const hei = dimMap.get(decision.name)?.h || 0;

      if (thisLineWidth + wid <= width) {
        if (!lines[thisLineIndex]) lines.push({ y, decisions: [] });
        lines[thisLineIndex].decisions.push(decision);
        lastHei = hei;
        thisLineWidth += wid;
      } else {
        // by default, overflow means new line
        thisLineIndex++;
        const hei = dimMap.get(decision.name)?.h || 0;
        y -= lastHei / 2 + SPACING_Y + PADDING_Y + hei / 2;

        if (hei > FONT_SIZE + OUTLINE_WIDTH * 2) {
          // if it's taller than one line, force it to be on its own line
          lines.push({ y, decisions: [decision] });
          y -= hei / 2 + PADDING_Y + SPACING_Y;
          thisLineIndex++;
          thisLineWidth = 0;
          lastHei = hei;
        } else {
          // add to this new line
          lines.push({ y, decisions: [decision] });
          thisLineWidth += wid;
          lastHei = hei;
        }
      }
    }

    // from lines, calculate x positions by centering each decision within its line
    type ObjEntry = { decision: Decision; position: Triplet };
    const objMap: ObjEntry[] = [];
    for (const line of lines) {
      const lineObjMap: ObjEntry[] = [];
      // place each decision in the center then shift left
      let x = 0;
      for (const decision of line.decisions) {
        const wid = dimMap.get(decision.name)?.w || 0;
        x -= wid / 2;
        lineObjMap.push({ decision, position: [x, line.y, 0] });
        x -= wid / 2 + PADDING_X * 2 + SPACING_X;
      }
      // shift all decisions in the line to the right
      const lineWid = -x - PADDING_X * 2 - SPACING_X;
      const shift = lineWid / 2;
      for (const obj of lineObjMap) {
        obj.position[0] += shift;
      }
      objMap.push(...lineObjMap);
    }

    return objMap;
  }, [decisions, dimMap, width, ready]);

  const [offset] = useState(Math.random());
  const ideaMap = useMemo(() => {
    const map = new Map<string, Idea>();
    for (const decision of decisions) {
      const m = (offset + decisions.indexOf(decision) / decisions.length) % 1;
      const s = 0.7;
      map.set(decision.name, new Idea(m, s, decision.utility || 0.8));
    }
    return map;
  }, [decisions, offset]);

  if (!ready) return null;

  return (
    <>
      {objValues.map(({ decision, position }, i) => (
        <group
          key={decision.name + i + position.toString()}
          position={position}
        >
          <FacePlayer>
            <Button
              font={FONT_FILE}
              fontSize={FONT_SIZE}
              maxWidth={width}
              idea={ideaMap.get(decision.name)}
              onClick={() => {
                if (decision.onClick) decision.onClick();
                if (decision.nextKey) setCurKey(decision.nextKey || "");
              }}
            >
              {decision.name}
            </Button>
          </FacePlayer>
        </group>
      ))}
    </>
  );
}
