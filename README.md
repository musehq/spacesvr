<br/>
<br/>
<p align="center">
    <img width="500" src="https://d27rt3a60hh1lx.cloudfront.net/spacesvr/spacesvr.png" alt="logo" />
</p>
<h3 align="center">
     spacesvr
</h3>
<h5 align="center">
     A standardized reality for the future of the 3D Web.
</h5>

<div align="center">

[![Version](https://img.shields.io/npm/v/spacesvr?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@react-three/drei)
[![Downloads](https://img.shields.io/npm/dt/spacesvr.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@react-three/drei)
[![Discord Shield](https://img.shields.io/discord/610733384804859934?style=flat&colorA=000000&colorB=000000&label=discord&logo=discord&logoColor=ffffff)](https://discord.gg/nFHrmUbaz5)

</div>

<p align="center">
    <a href="https://muse.place?utm_source=npmjs">www.muse.place</a> · <a href="https://spacesvr.io/">demo</a> · <a href="https://discord.gg/nFHrmUbaz5">discord</a>
<p>
<p align="center">
<a href="https://muse.place?utm_source=npmjs&utm_campaign=logo">
    <img width="50" src="https://d27rt3a60hh1lx.cloudfront.net/images/muselogogray.png" alt="logo" />
</a>
</p>

<br/>
<br/>
<br/>
<br/>
<hr/>

## About

The mission of spacesvr is to organize and implement the standards for experiencing 3D content on the web in the same way that there exists standards for experiencing 2D content with HTML/CSS/JS.

spacesvr is designed to empower the artist. Instead of worrying about file structures or basic functionality like cross-device compatability, artists should spend their time telling their story. As such, consumption is optimized for simplicity, and the organization provides a framework to tell stories.

spacesvr is actively maintained by [Muse](https://www.muse.place?utm_source=npmjs&utm_campaign=learn_more), a YC-backed startup that provides tooling for visually building worlds. Muse's mission is to accelerate the adoption of 3D websites by increasing their accessibility, both for the end user and for the creator. Muse is completely built on spacesvr.

## Quick Start

- [Visit the codesandbox](https://codesandbox.io/s/e9w29) to instantly play with the package
- [Clone the starter repo](https://github.com/spacesvr/spacesvr-starter) to start using with Next.js
- [Sign up for muse](https://www.muse.place?utm_source=npmjs&utm_campaign=no_code) to build using our no-code editor

## Develop

You could set up the framework in your sleep. Just import the package

```bash
yarn add spacesvr #or npm install spacesvr
```

and copy/paste 9 lines of code

```tsx
import { StandardReality, LostWorld } from "spacesvr";

function World() {
  return (
    <StandardReality>
      <LostWorld /> // an example world with a floor, skybox, and fog
    </StandardReality>
  );
}
```

_this is the starting point for [this demo](https://spacesvr.io)_

<br/>

From this point, your creations will be built by directly using the following technologies:

- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber), the most important to learn
- [@react-three/drei](https://github.com/pmndrs/drei), a repository of components and utilities
- [@react-three/cannon](https://github.com/pmndrs/use-cannon), for physics
- [@react-spring/three](https://github.com/pmndrs/react-spring#readme), for animations

Under the hood and mostly abstracted away are the following technologies:

- [three.js](https://github.com/mrdoob/three.js/), an abstract 3D API for the web
- [@react-three/xr](https://github.com/pmndrs/react-xr), for any VR-specific interactions
- [peerjs](https://github.com/peers/peerjs), for networking

## Folder Structure

_the following are each a fundamental unit and their own folder at the top level of spacesvr, with the pattern recursively re-appearing throughout the repository_

**ideas** are the fundamental building blocks of your world. They are the 3D the equivalent of HTML Elements. They are implemented as React components.

**layers** (of reality) offer new functionality to the world. They are implemented using a React container component, a context, and a corresponding hook.

**logic** offers functions to be used when composing your world. They are implemented as individually exported functions and hooks.

**realities** define how the player experiences your world. They are comparable in function to a browser. They are implemented as a React container component and composed of an ordering of layers.

**tools** offer the player affordances in your world. They are the 3D equivalent of a browser toolbar. They are implemented using a Layer for fundamental state a modifier for registry.

**worlds** are sets of ideas. They are the actual content of your site. They are implemented as compositions of ideas.

<br/>
<br/>
<br/>
<br/>

<hr/>

## Realities

#### Standard Reality

The Standard Reality defines the standard experiencing the 3D web. The layers provided are, in order: Environment, Physics, Player, Toolbelt, Network, Visual. Additionally, it provides an infinite ground to walk on that can be disabled.

```tsx
<StandardReality
    environmentProps={{...}} // props to be passed to the environment layer
    physicsProps={{...}} // props to be passed to the physics layer
    playerProps={{...}} // props to be passed to the player layer
    networkProps={{...}} // props to be passed to network layer
    disableGround={true} // disable ground in case you want your own
/>
```

## Layers

#### Environment Layer

_The base layer that abstracts away the DOM, allowing you to think only in 3D_

```tsx
type EnvironmentProps = {
  name?: string; // set the name of your environment, shows up in the pause menu
  pauseMenu?: ReactNode; // for you to provide a custom pause menu
  loadingScreen?: ReactNode; // for you to provide a custom loading screen
  dev?: boolean; // hides the pause menu, useful while switching between world and IDE
  canvasProps?: Partial<ContainerProps>; // to edit the r3f canvas props
};
```

```tsx
const environmentState = useEnvironment();

type EnvironmentState = {
  name: string;
  paused: boolean;
  setPaused: (p: boolean) => void;
  device: DeviceState; // the current device being used by the player: xr, mobile, or desktop
  containerRef: MutableRefObject<HTMLDivElement | null>;
};
```

#### Physics Layer

_Provides a default physics configuration_

```tsx
import { PhysicsProps as ProviderProps } from "@react-three/cannon";
type PhysicsProps = ProviderProps;
```

#### Player Layer

_Provides a user-controlled entity with a standardized set of controls that work cross-platform (VR/Mobile/Desktop)_

```tsx
type PlayerProps = {
  pos?: number[]; // initial player position
  rot?: number; // initial player rotation (radians along Y axis)
  speed?: number; // player movement speed
  controls?: {
    disableGyro?: boolean; // used to disable gyroscope prompt on mobile
  };
};
```

```tsx
const playerState = usePlayer();

type PlayerState = {
  position: PlayerVec; //.get() and .set() for position
  velocity: PlayerVec; //.get() and .set() for velocity
  controls: PlayerControls; //.lock() and .unlock() for stopping player movement
  raycaster: Raycaster; // reference to player's raycaster
};
```

#### Toolbelt Layer

_Provides a layer of UX to offer user interaction with the world._

```tsx
type ToolbeltProps = {
  showOnSpawn?: boolean; // whether to show the toolbelt on spawn, default true
};
```

```tsx
const toolbelt = useToolbelt();

type ToolbeltState = {
  tools: Tool[];
  activeTool?: Tool;
  hide: () => void;
  next: () => void;
  prev: () => void;
  show: () => void;
  activeIndex: number | undefined;
  setActiveIndex: (i: number) => void;
  direction: Direction;
};
```

#### Network Layer

_Provides multiplayer out-of-the-box. Muse provides signalling servers and [STUN/TURN](https://www.twilio.com/docs/stun-turn/faq#faq-what-is-nat) servers for everyone :)._

```tsx
type NetworkProps = {
  autoconnect?: boolean; // whether to automatically attempt a p2p connection, false by default
  disableEntities?: boolean; // whether to hide users from seeing each other, in case you want to implement yourself
  iceServers?: RTCIceServer[]; // set of ice servers to use (recommended for production!!)
  host?: string; // signalling host url, uses Muse's servers by default
  sessionId?: string; // if you know the session id you want to use, enter it here
  worldName?: string; // the worldname to hash your signal peers by, by default set to the path name
  voice?: boolean; // whether to enable spatial voice chat, false by default
};
```

```tsx
const networkState = useNetwork();

type NetworkState = {
  connected: boolean; // whether the user has established connection with signalling server
  connect: (config?: ConnectionConfig) => Promise<void>; // when autoconnect is off, use this to manually connect
  connections: Map<string, DataConnection>; // reference to active peer connections
  disconnect: () => void;
  voice: boolean; // whether voice is enabled
  setVoice: (v: boolean) => void; // enable/disable voice
  mediaConnections: Map<string, MediaConnection>; // reference to active media connections
  useChannel: <Data = any, State = any>(
    id: string,
    type: ChannelType,
    reducer: Reducer<Data, State>
  ) => Channel<Data, State>; // set up a data channel to standardize communication between peers
};
```

## Tools

#### Camera Tool

A tool that gives the user a camera to take pictures with. To add to your toolbelt simply add it into the World.

```tsx
<StandardReality>
  <Camera />
</StandardReality>
```

#### Walkie Talkie Tool

A tool to configure your microphone settings. Automatically added if voice chat is enabled in the network layer.

## Ideas

### _types of ideas_

- [basis/](#basis) for visualizations of fundamental metaphysics
- [environment/](#environment) for setting up the environment
- [media/](#media) for importing common media types
- [mediated/](#mediated) for some basic art assets
- [modifiers/](#modifiers) for modifying other ideas. they don't render anything themselves
- [ui/](#ui) for guiding and interacting with the user

---

### basis/

#### VisualIdea

Visualize an Idea

```tsx
<VisualIdea idea={new Idea()} />
```

#### VisualSite

Visualize a Site

```tsx
<VisualSite idea={new Site()} />
```

#### VisualWorld

Visualize a World

```tsx
<VisualWorld idea={new World()} />
```

---

### environment/

#### Background

Set the background color of your space

```tsx
<Background color="blue" />
```

#### Fog

Add fog to your scene.

```tsx
<Fog color="white" near={10} far={100} />
```

#### InfinitePlane

Adds an infinite plane to walk on (added by default with the Environment Layer)

```tsx
<InfinitePlane
  height={-0.0001} // offset a slight amount
  size={[100, 100]}
  visible={false}
/>
```

---

### media/

#### Audio

A positional audio component that will play the passed in audio url. Handles media playback rules for Safari, iOS, etc.

```tsx
<Audio
  url="https://link-to-your-audio.mp3"
  position={[0, 4, 0]}
  volume={1}
  rollOff={1}
  dCone={new Vector3(coneInnerAngle, coneOuterAngle, coneOuterGain)} // defaults should be fine
  fftSize={128}
/>
```

#### HDRI

Set the scene background to an hdr file. You can find free hdr files here: https://hdrihaven.com/

```tsx
<HDRI
  src="https://link-to-your-hdri.hdr"
  disableBackground={false} // used to disable visual hdr (skybox)
  disableEnvironment={false} // used to disable environment map
/>
```

#### Image

Quickly add an image to your scene

```tsx
<Image
  src="https://link-to-your-image.png"
  size={1} // size, default normalized to longest side = 1
  framed // adds a frame
/>
```

#### Model

Quickly add a GLTF/GLB model to your scene. Will handle Suspense, KTX2, Draco, Meshopt. Clones the gltf scene so the same file can be re-used.

```tsx
<Model
  src="https://link-to-your-model.glb"
  center // whether to center the model so its bounds are centered on its origin, default false
  normalize // whether to normalize the model to a height/width/depth of 1, default false
/>
```

#### Video

Add a video file to your space with positional audio. Handles media playback rules for Safari, iOS, etc.

```tsx
<Video
  src="https://link-to-your-video.mp4"
  size={1} // size, default normalized to longest side = 1
  volume={1}
  muted // mutes the video
  framed // adds a frame
/>
```

---

### mediated/

#### Frame

Builds a frame to showcase media, especially images.

width: number;
height: number;
thickness?: number;
material?: Material;
innerFrameMaterial?: Material;

```tsx
<Frame
  width={1}
  height={1}
  thickness={0.1} // optional, default 0.1
  material={new MeshBasicMaterial({ color: "red" })} // optional, default is a black MeshStandardMaterial
  innerFrameMaterial={new MeshBasicMaterial({ color: "blue" })} // optional, default is no inner frame
/>
```

#### LostFloor

An infinite floor styled to the Lost World.

```tsx
<LostFloor />
```

---

### modifiers/

#### Collidable

Enables colliders for its children either by a named collider mesh or using all meshes and capping collective triangle count to triLimit prop.

```tsx
<Collidable
  triLimit={1000} // max number of triangles before it uses bvh
  enabled={true}
  hideCollisionMeshes={false} // set visible to false on meshes used for collision
/>
```

#### Interactable

Makes its children react to onclick and on hover methods

```tsx
<Interactable
  onClick={() => console.log("Ive been clicked!")}
  onHovered={() => console.log("Ive been hovered!")}
  onUnHovered={() => console.log("Ive been unhovered?")}
>
  <Stuff />
</Interactable>
```

#### Tool

Turns its children into a tool, automatically registers it with the Tool Layer.

```tsx
<Tool
  name="My Tool" // name used for identification
  pos={[0, 0]} // where the tool should be positioned in screen space, x:[-1, 1], y:[-1, 1]
  face={true} // whether the tool should face the user, default true
  pinY={false} // whether the tool should be pinned on the screen space y so user can look up and down
  range={0} // how far from the cursor the tool will stay without moving left or ight, along the x screen space axis, measured in degrees
  orderIndex={0} // the order in which the tool should be rendered relative to other orders, default 0, sorts low to high
  onSwitch={(enabled: boolean) => {}} // callback for when active tool switches, passes whether the given tool is enabled
>
  <Stuff />
</Tool>
```

#### Anchor

Makes its children link out to when clicked. handles leaving vr session.

```tsx
<Anchor
  href="https://link-to-your-website.com"
  target="_blank" // optional, default is _self
>
  <Stuff />
</Anchor>
```

#### FacePlayer

Turns its children into a billboard, always facing the camera.

```tsx
<FacePlayer enabled={true} lockX={false} lockY={false} lockZ={false} />
```

#### Floating

Lazily floats its children.

```tsx
<Floating height={0.2} speed={1} />
```

#### LookAtPlayer

Makes its children face the player, but with easing.

```tsx
<LookAtPlayer enabled={true} />
```

#### Spinning

Makes its children spin

```tsx
<Spinning xSpeed={0} ySpeed={1} zSpeed={0} />
```

#### Visual Effect

Adds a render pass to the Visual Layer's render pipeline. Use to add postprocessing.

```tsx
<VisualEffect
  index={1} // the order in which the effects are applied, sorts low to high
>
  <unrealBloomPass args={[new Vector2(256, 256), 0.1, 0.01, 0.95]} />
</VisualEffect>
```

---

### ui/

#### TextInput

A text input component made to mimic an HTML input element. Supports all shortcuts, drag to select, shift click, double/triple click.

```tsx
const [text, setText] = useState("");

<TextInput
  type="text" // text | password | number, default is text
  value={text} // control the input value
  onChange={setText} // optional onChange function
  onSubmit={(s: string) => console.log(s)} // optional onSubmit function, called when enter is pressed
  onFocus={() => console.log("focused")} // optional onFocus function
  onBlur={() => console.log("blurred")} // optional onBlur function
  font={"https://link-to-your-font.ttf"} // optional font
  fontSize={0.1} // font size, default 0.1
  width={1} // width, default 1
  placeholder="Enter your name" // optional placeholder text
/>;
```

#### Arrow

An arrow icon

```tsx
<Arrow dark={false} />
```

#### Button

A simple button

```tsx
<Button
  onClick={() => console.log("Ive been clicked!")}
  font="https://link-to-your-font.ttf" // optional font, default is Quicksand
  fontSize={0.1} // font size, default 0.05
  maxWidth={1} // max width, default no max width
  textColor="red" // text color, default black
  color="green" // button color, default white
  outline={false} // whether to show an outline, default true
  outlineColor="#9f9f9f" // outline color, default white
>
  Click me!
</Button>
```

#### Key

A Keyboard Key that responds to the corresponding key press. Useful for tutorials.

```tsx
<Key
  keyCode="a"
  keyPress={["a, A"]} // optional, default is keyCode, but in case there are multiple keys to look for
  onPressed={(evt) => console.log("Ive been pressed!")} // optional callback when key is pressed
/>
```

#### Switch

A boolean switch

```tsx
const [value, setValue] = useState(false);

<Switch
  value={value} // control the switch value
  onChange={setValue} // optional onChange function
/>;
```
