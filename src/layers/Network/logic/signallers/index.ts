export type SessionConfig = {
  sessionId?: string;
  sessionPassword?: string;
  world?: string;
};

export type SignallerConfig = {
  host?: string;
} & SessionConfig;

export interface Signaller {
  join: () => Promise<string[] | undefined>;
  wave: () => Promise<boolean>;
  leave: () => Promise<void>;
}
