import React from "react";
import Peer from "peerjs";

type NetworkedProps = {
  host: string;
  port: number;
  path: string;
};

export const Networked = (props: NetworkedProps) => {
  const peer = new Peer({
    host: props.host,
    port: props.port,
    path: props.path,
  });

  return null;
};
