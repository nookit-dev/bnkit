export type WebRTCConfig = {
    iceServers?: RTCIceServer[];
  };
  
  export type WebRTCFactoryMethods = keyof ReturnType<typeof createWebRTCFactory>;
  
  export function createWebRTCFactory({
    defaultConfig,
  }: {
    defaultConfig?: WebRTCConfig;
  }) {
    const configuration: RTCConfiguration = {
      iceServers: defaultConfig?.iceServers || [],
    };
  
    function createPeerConnection(
      customConfig?: RTCConfiguration
    ): RTCPeerConnection {
      const peerConnection = new RTCPeerConnection({
        ...configuration,
        ...customConfig,
      });
      return peerConnection;
    }
  
    function createOffer(
      peerConnection: RTCPeerConnection
    ): Promise<RTCSessionDescriptionInit> {
      return peerConnection.createOffer().then((offer) => {
        return peerConnection.setLocalDescription(offer).then(() => offer);
      });
    }
  
    function createAnswer(
      peerConnection: RTCPeerConnection
    ): Promise<RTCSessionDescriptionInit> {
      return peerConnection.createAnswer().then((answer) => {
        return peerConnection.setLocalDescription(answer).then(() => answer);
      });
    }
  
    function setRemoteDescription(
      peerConnection: RTCPeerConnection,
      description: RTCSessionDescriptionInit
    ): Promise<void> {
      return peerConnection.setRemoteDescription(description);
    }
  
    return {
      createPeerConnection,
      createOffer,
      createAnswer,
      setRemoteDescription,
    };
  }
  