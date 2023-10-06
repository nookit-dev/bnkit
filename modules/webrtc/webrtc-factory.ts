export type WebRTCConfig = {
  iceServers?: RTCIceServer[];
};

export type WebRTCFactoryMethods = keyof ReturnType<typeof createWebRTCFactory>;

/**
 * Creates a WebRTC factory object with methods to create peer connections, offers, answers, and set remote descriptions.
 * @param defaultConfig - Optional default configuration for the WebRTC factory.
 * @returns An object with methods to create peer connections, offers, answers, and set remote descriptions.
 */
export function createWebRTCFactory({
  defaultConfig,
}: {
  defaultConfig?: WebRTCConfig;
}) {
  const configuration: RTCConfiguration = {
    iceServers: defaultConfig?.iceServers || [],
  };

  /**
   * Creates a new RTCPeerConnection object with the given custom configuration.
   * @param customConfig - Optional custom configuration for the RTCPeerConnection object.
   * @returns A new RTCPeerConnection object.
   */
  function createPeerConnection(
    customConfig?: RTCConfiguration
  ): RTCPeerConnection {
    const peerConnection = new RTCPeerConnection({
      ...configuration,
      ...customConfig,
    });
    return peerConnection;
  }

  /**
   * Creates a new offer and sets it as the local description for the given RTCPeerConnection object.
   * @param peerConnection - The RTCPeerConnection object to create the offer for.
   * @returns A promise that resolves with the created offer.
   */
  function createOffer(
    peerConnection: RTCPeerConnection
  ): Promise<RTCSessionDescriptionInit> {
    return peerConnection.createOffer().then((offer) => {
      return peerConnection.setLocalDescription(offer).then(() => offer);
    });
  }

  /**
   * Creates a new answer and sets it as the local description for the given RTCPeerConnection object.
   * @param peerConnection - The RTCPeerConnection object to create the answer for.
   * @returns A promise that resolves with the created answer.
   */
  function createAnswer(
    peerConnection: RTCPeerConnection
  ): Promise<RTCSessionDescriptionInit> {
    return peerConnection.createAnswer().then((answer) => {
      return peerConnection.setLocalDescription(answer).then(() => answer);
    });
  }

  /**
   * Sets the remote description for the given RTCPeerConnection object.
   * @param peerConnection - The RTCPeerConnection object to set the remote description for.
   * @param description - The remote description to set.
   * @returns A promise that resolves when the remote description has been set.
   */
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
