const KEY = "spacesvr-ice-servers";

// 24 hours
const EXPIRE_TIME = 24 * 60 * 60 * 1000;

type IceStorage = {
  iceServers: RTCIceServer[];
  time: number;
};

const storeLocalIceServers = (servers: RTCIceServer[]) => {
  const store: IceStorage = { iceServers: servers, time: new Date().getTime() };
  localStorage.setItem(KEY, JSON.stringify(store));
};

const getLocalIceServers = (): RTCIceServer[] | undefined => {
  const str = localStorage.getItem(KEY);
  if (!str) return undefined;
  try {
    const res = JSON.parse(str) as IceStorage;
    // clear if expired
    if (new Date().getTime() - res.time > EXPIRE_TIME) {
      localStorage.removeItem(KEY);
      return undefined;
    }
    return res.iceServers;
  } catch (err) {
    return undefined;
  }
};

export const getMuseIceServers = async (
  host = "https://muse-web.onrender.com"
): Promise<RTCIceServer[] | undefined> => {
  const local = getLocalIceServers();
  if (local) return local;

  try {
    const res = await fetch(`${host}/sessions/get_ice`);
    const json = await res.json();
    const servers = json.iceServers as RTCIceServer[];
    storeLocalIceServers(servers);
    return servers;
  } catch (err) {
    console.error("failed to fetch ice servers", err);
    return undefined;
  }
};
