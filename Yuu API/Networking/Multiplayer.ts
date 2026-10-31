import { Async } from "../Async";
import { Keyboard } from "../Keyboard";
import { Peer, PeerDescription } from "./Peer";


export const Multiplayer = {
  startHosting,
  hostCompleteHandshake,
  joinHost,
  sendMessage,
}

const peers: Peer[] = [];

let hostPeer: Peer | undefined;

/**
 * Long Term Goal:
 * Creates a join code on the YuuSignalingServer and returns it
 * When players connect via the signaling server a peer connection is initialized
 * 
 * Short Term:
 * Returns the local description as a PeerDescription JSON string for a single p2p connection
 * 
 * @param isPublic determines if the multiplayer instance requires the join code 
 * @returns string join code
 */
async function startHosting(isPublic: boolean): Promise<string> {
  // Create join code on YuuSignalingServer

  hostPeer = new Peer(true);
  const localDescription = await getLocalDescriptionAsync(hostPeer);

  peers.push(hostPeer);

  return JSON.stringify(localDescription);
}

function hostCompleteHandshake() {
  if (hostPeer) {
    // this line of code is super fragile and meant for this test only
    const remoteDescription: PeerDescription = JSON.parse(Keyboard.clipboard.get());

    hostPeer.setRemoteDescription(remoteDescription.type, remoteDescription.sdp);
  }
}

/**
 * Long Term Goal:
 * The serverCode is the short join code from the signaling server
 * 
 * Short Term:
 * The serverCode is a PeerDescription in a JSON string
 * When it is done it sets the keyboard copy-paste to the local description
 * 
 * @param serverCode 
 * @returns boolean false if connection timed out
 */
async function joinHost(serverCode: string): Promise<boolean> {
  const peer = new Peer(false);

  const remoteDescription: PeerDescription = JSON.parse(serverCode);

  const didSetRemoteDescription = await setLocalDescriptionAsync(peer, remoteDescription);

  if (didSetRemoteDescription) {
    const localDescription = await getLocalDescriptionAsync(peer);
  
    Keyboard.clipboard.set(JSON.stringify(localDescription));
  
    peers.push(peer);
  
    return !(localDescription === undefined);
  }
  else {
    return false;
  }
}

function sendMessage(message: string) {
  // Temporary for testing, will need better messaging / blasting later

  peers.forEach((peer) => {
    peer.sendMessage(message);
  });
}


async function setLocalDescriptionAsync(peer: Peer, remoteDescription: PeerDescription): Promise<boolean | undefined> {
  let i = 0;
  let didSet = false;

  while ((i < 100) && (didSet === false)) {
    await Async.wait(50);

    i++;
    didSet = peer.setRemoteDescription(remoteDescription.type, remoteDescription.sdp);
  }

  return didSet;
}

async function getLocalDescriptionAsync(peer: Peer): Promise<PeerDescription | undefined> {
  let i = 0;
  let localDescription: PeerDescription | undefined;

  while ((i < 100) && (localDescription === undefined)) {
    await Async.wait(50);

    i++;
    localDescription = peer.getLocalDescription();
  }

  return localDescription;
}