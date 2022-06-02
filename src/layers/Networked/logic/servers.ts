export const getIceServers = (): RTCIceServer[] => {
  return [
    {
      urls: "stun:global.stun.twilio.com:3478?transport=udp",
    },
    {
      credential: "BusqJgPdVK7IxQzsUrWCmqSf38/zSSCzw2de4ryKWcM=",
      urls: "turn:global.turn.twilio.com:3478?transport=udp",
      username:
        "31e536e1c3e69577987d5435d5a1cfc829173f941306a4f36dbedabd46ece5f3",
    },
    {
      credential: "BusqJgPdVK7IxQzsUrWCmqSf38/zSSCzw2de4ryKWcM=",
      urls: "turn:global.turn.twilio.com:3478?transport=tcp",
      username:
        "31e536e1c3e69577987d5435d5a1cfc829173f941306a4f36dbedabd46ece5f3",
    },
    {
      credential: "BusqJgPdVK7IxQzsUrWCmqSf38/zSSCzw2de4ryKWcM=",
      urls: "turn:global.turn.twilio.com:443?transport=tcp",
      username:
        "31e536e1c3e69577987d5435d5a1cfc829173f941306a4f36dbedabd46ece5f3",
    },
  ];
};
