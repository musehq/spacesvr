<br/>
<br/>
<p align="center">
    <img width="500" src="https://imgur.com/GkZtmMI.jpg" alt="logo" />
</p>
<h3 align="center">
     Spaces VR
</h3>
<h5 align="center">
     Sleek, powerful front-end framework for quickly creating cross-platform VR Websites.
</h5>
<p align="center">
    <a href="https://muse.place/muse">muse.place/muse</a> · <a href="https://discord.gg/nFHrmUbaz5">discord</a>
<p>
<br/>
<br/>
<br/>
<br/>

<p align="center">
    <a href="https://codesandbox.io/s/nifty-yalow-409u5?hidenavigation=1&theme=dark">
        <img width="274" src="https://i.imgur.com/1wxYJa8.gif" />
    </a>
</p>
<h5 align="center">
    click on the examples above to view the source
</h5>

# Index

[![Version](https://img.shields.io/npm/v/spacesvr?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@react-three/drei)
[![Downloads](https://img.shields.io/npm/dt/spacesvr.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@react-three/drei)
[![Discord Shield](https://img.shields.io/discord/610733384804859934?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=ffffff)](https://discord.gg/nFHrmUbaz5)

<ul>
    <li><a href="#quick-start">Quick Start</a></li>
    <li><a href="#faq">Guide</a></li>
    <li>
        <a href="#documentation">Documentation</a>
        <ul>
            <li><a href="#environments">Environments</a></li>
            <li><a href="#components">Components</a></li>
            <li><a href="#modifiers">Modifiers</a></li>
        </ul>
    </li>
    <li><a href="#examples">Examples</a></li>
</ul>

# Quick Start

#### codesandbox

Visit [this code sandbox](https://codesandbox.io/s/polished-meadow-erzku?fontsize=14&hidenavigation=1&theme=dark) to instantly play with the package

#### npm

You could set up the framework in your sleep. Just import the package

```bash
npm install spacesvr
# or
yarn add spacesvr
```

and copy/paste 9 lines of code

```jsx
import { StandardEnvironment, Logo } from "spacesvr";

const App = () => {
  return (
    <StandardEnvironment>
      <Logo floating rotating />
    </StandardEnvironment>
  );
};
```

# Guide

#### the environment component.

The main functionality comes from the `Environment` components which provide variations of...

- a player with a control scheme
- post processing
- physics
- default components
- loading menu
- pause menu

Under the hood it enables cannon physics and react-three-fiber code with a canvas. All you have
to do is wrap your [react-three-fiber](https://github.com/react-spring/react-three-fiber)
code in an environment and you will be able to navigate your space on mobile and desktop!

### assets

The `Environment` component comes out of the box with a loader and a loading overlay, using
Drei's `useProgress` hook.

However, this hook is unreliable for 3D files, especially with iOS and Safari. So if you want to ensure your assets are loaded correctly, pass an array
of asset urls to the `assets` prop in the `Environment` component and use the `useAsset` hook
to retrieve the data from that asset. Currently supported assets are `hdr, png, jpg, glb, gltf`.

```jsx
<StandardEnvironment assets={["https://link-to-model.glb", "https://link-to-texture.png"]}>
    <Suspense fallback={null}>
        <Model />
    </Suspense>
</StandardEnvironment>

// in <Model/>
const Model = () =>
    const asset = useAsset("https://link-to-model.glb");
    return <primitive object={asset.data.scene} />
}
```

#### the useEnvironment Hook.

The `useEnvironment` hook is your direct access to the environment state. It can be used anywhere
inside an `Environment` component and gives you an `EnvironmentState`, defined as:

```jsx
{
  type: Environment; // the type of environment, { STANDARD, TRACK }
  paused: boolean; // whether the pointer lock controls are engaged
  setPaused: (p: boolean, overlay?: string) => void; // set the paused state, along with overlay
  player: PlayerRef;
  overlay: string | null; // null if no overlay enabled or string with id of currenly open overlay
  containerRef: MutableRefObject<HTMLDivElement | null>; // ref to html container (parent of Canvas)
  container: HTMLDivElement | null;
  events: EnvironmentEvent[];
  setPlayer: (p: PlayerRef) => void;
  addEvent: (name: string, callback: (...args: any[]) => void) => void;
}
```

#### modifiers.

Modifiers, add functionality to any 3d component in different ways. For example, the `Floating`
modifier will make its children steadily float up and down. Perfect for quickly adding
animations to components!

```jsx
<Floating height={2} speed={2}>
  <mesh>
    <sphereBufferGeometry args={[1]} />
    <meshStandardMaterial color="white" />
  </mesh>
</Floating>
```

# Documentation

## Environments

#### Standard Environment

The Standard Environment defines the following:

- 2 unit tall player with WASD movement and pointer lock controls on desktop, joystick and drag controls on mobile
- Physics enabled, ground plane at y=0
- Custom loading menu
- Custom pause menu

```jsx
<StandardEnvironment
    canvasProps={{...}} // props to be passed along to the r3f canvas
    physicsProps={{...}} // props to be passed along to cannon.js
    player={{
        pos: new Vector3(INIT_X, INIT_Y, INIT_Z),  // initial position
        rot: 0,  // initial rotation,
        speed: 3.2 // meters per second (~1.4 walking, ~2.2 jogging)
    }}
/>
```

#### Keyframe Environment

The Keyframe Environment defines the following:

- 1 unit tall floating player
- Move with Arrow Keys, A/D movement, or Onscreen Arrows
- Drag Controls, Gryro Controls with Mobile Drag as fallback
- Physics enabled, ground plane at y=0
- Custom loading menu
- No pause menu

```jsx
<KeyframeEnvironment
    canvasProps={{...}} // props to be passed along to the r3f canvas
    physicsProps={{...}} // props to be passed along to cannon.js
    player={{
        pos: new Vector3(INIT_X, INIT_Y, INIT_Z),  // initial position
        rot: Math.PI / 2,  // initial rotation,
    }}
    keyframes={[
        { label: "home", position: new Vector3(0, 2, 5) },
        { label: "about", position: new Vector3(1, 2, 6), scale: 1.5 }
    ]} // keyframes to travel between
/>
```

## Components

#### Arrow

An arrow icon

```jsx
<Arrow dark={true} />
```

#### Audio

A positional audio component that will play the passed in audio url. Handles media playback rules for Safari, iOS, etc.

```jsx
<Audio url="https://link-to-your-audio.mp3" position={[0, 4, 0]} volume={1} />
```

#### Background

Easily set the background color of your space

```jsx
<Background color="blue" />
```

#### Fog

Add fog to your scene. Required rather than attaching to parent since direct parent is `<Physics />`

```jsx
<Fog color="blue" near={10} far={100} />
```

#### HDRI

Set the scene background to an hdr file. You can find free hdr files here: https://hdrihaven.com/

```jsx
<HDRI
  src="https://link-to-your-hdri.hdr"
  hideBackground={false} // set to true to only apply radiance
/>
```

#### Image

Quickly add an image to your scene

```jsx
<Image
  src="https://link-to-your-image.png"
  size={1} // size, default normalized to longest side = 1
  framed // adds a frame
  material={THREE.Material} // custom material for the frame
/>
```

#### Idea

Pure Idea, Unmediated

```jsx
<Idea
  size={1}
  vAlign="bottom" // top, center, bottom
  perception // 0-1, how perceptive idea is
/>
```

#### Text

A 3D text component with a default font of Myriad Pro. Custom fonts need to be converted to
a json file, which can be done here: https://gero3.github.io/facetype.js/. Note: this is
expensive, so if you want a lot of text look at Drei's Text component, extended from
Troika-3d-Text.

```jsx
<Text
  text="Hello Space"
  vAlign="center" // vertical align relative to the y component
  hAlign="center" // horizontal align relative to the x component
  size={1} // scale
  color="#000000" // color
  font={"https://your-font-file.json"} // default is Myriad Pro
  material={THREE.Material} // custom material to pass in
/>
```

#### Video

Add a video file to your space with positional audio. Handles media playback rules for Safari, iOS, etc.

```jsx
<Video
  src="https://link-to-your-video.mp4"
  size={1} // size, default normalized to longest side = 1
  volume={1}
  muted // mutes the video
  framed // adds a frame
  material={THREE.Material} // custom material for the frame
/>
```

## Modifiers

#### Floating

Makes its children float up and down

```jsx
<Floating
  height={1} // the height it should float
  speed={1} // just eyeball it
>
  <Stuff />
</Floating>
```

#### Spinning

Makes its children spin

```jsx
<Spinning
  xSpeed={0} // speed to spin around axis
  ySpeed={1} // y axis is 1 by default
  zSpeed={0} // 0 = no spin on axis
>
  <Stuff />
</Spinning>
```

#### Interactable

Makes its children react to onclick and on hover methods

```jsx
<Interactable
  onClick={() => console.log("Ive been clicked!")}
  onHovered={() => console.log("Ive been hovered!")}
  onUnHovered={() => console.log("Ive been unhovered?")}
>
  <Stuff />
</Interactable>
```

# Examples

<p align="center">
    <a href="https://spaces.gallery/chad">
        <img width="274" src="https://aws1.discourse-cdn.com/standard17/uploads/threejs/original/2X/a/a10b799e732840e53648103104c24e699fb96edc.gif" />
    </a>
</p>

_These examples were made as we were building the framework so the code is outdated_
