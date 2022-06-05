export type SessionConfig = {
  sessionId?: string;
  world?: string;
};

export type SignallerConfig = {
  host?: string;
} & SessionConfig;

export type ICEConfig = {
  iceServers?: RTCIceServer[];
};

export type ConnectionConfig = SessionConfig & SignallerConfig & ICEConfig;

export interface Signaller {
  join: () => Promise<string[] | undefined>;
  wave: () => Promise<boolean>;
  leave: () => Promise<void>;
}
