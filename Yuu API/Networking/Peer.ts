import { arrayUtils } from "../ArrayUtils";
import { jsonUtils } from "../JsonUtils";
import { Events } from "../Events";
import { registerStart } from "../RegisterStart";


type PeerState = 'New' | 'Initializing' | 'ReadyForRemoteDescription' | 'Connecting' | 'Connected' | 'Disconnected' | 'Closed' | 'Failed';

export type PeerDescription = {
  type: string;
  sdp: string;
}

type PacketDescription = {
  msgID: number,
  index: number,
  totalCount: number,
  message: string,
}

let callbackID = 0;

export class Peer {
  id: number;
  isRemoteDescriptionSet: boolean = false;
  createOfferOnInitialization: boolean;
  sendMessagesTo = new Map<number, (message: string) => void>();

  constructor(createOffer: boolean) {
    this.id = -2;
    this.createOfferOnInitialization = createOffer;

    // Temporary way of seeing messages from connected peers
    this.receiveMessages((message) => { console.log(this.id + ': ' + message); })

    peers.push(this);
  }

  createOffer() {
    if (this.id > -1) {
      Godot.networking.rtcPeer.createOffer(this.id);
    }
  }

  getLocalDescription(): PeerDescription | undefined {
    if (this.id > -1) {
      return Godot.networking.rtcPeer.getLocalDescription(this.id);
    }
  }

  /**
   * Set the remote description
   * @param type from PeerDescription
   * @param sdp  from PeerDescription
   * @returns boolean true if set
   */
  setRemoteDescription(type: string, sdp: string): boolean {
    if (this.id > -1) {
      Godot.networking.rtcPeer.setRemoteDescription(this.id, type, sdp);

      this.isRemoteDescriptionSet = true;
    }

    return this.isRemoteDescriptionSet;
  }

  getState(): PeerState {
    if (this.id === -2) {
      return 'Initializing';
    }
    else if (!this.isRemoteDescriptionSet) {
      return 'ReadyForRemoteDescription';
    }
    else if (this.id > -1) {
      const state = Godot.networking.rtcPeer.state(this.id);

      if (state) {
        return state;
      }
    }

    return 'Closed';
  }

  sendMessage(message: string) {
    if (this.id > -1 && this.getState() === 'Connected') {
      console.log('Message Sent From: ' + this.id + ': ' + message);
      Godot.networking.rtcPeer.sendText(this.id, message);
    }
    else {
      console.log(this.id + ': failed to send message (invalid id or state not "Connected"');
    }
  }

  /**
   * Subscribe a function to receive messages
   * @param func to call when a message is received
   * @returns id that can be used to unsubscribe
   */
  receiveMessages(func: (message: string) => void): number {
    callbackID++;

    this.sendMessagesTo.set(callbackID, func);

    return callbackID;
  }

  /**
  * Using the id returned by receiveMessages, you can unsubscribe
  * @param id to unsubscribe
  * @returns true if the id existed and has been removed, or false if the id does not exist.
  */
  unsubscribe(id: number): boolean {
    return this.sendMessagesTo.delete(id);
  }

  close() {
    if (this.id > -1) {
      Godot.networking.rtcPeer.close(this.id);

      this.id = -1;

      arrayUtils.removeItemFromArray(peers, this);
    }
  }
}


const peers: Peer[] = [];

registerStart(start);
function start() {
  Events.onUpdate(onUpdate);
}

function onUpdate(deltaTime: number) {
  peers.forEach((peer) => {
    if (peer.id !== -1) {
      if (peer.id === -2) {
        peer.id = Godot.networking.rtcPeer.create();

        if (peer.createOfferOnInitialization) {
          peer.createOffer();
        }
      }
      else {
        Godot.networking.rtcPeer.poll(peer.id);

        const packets = Godot.networking.rtcPeer.getPackets(peer.id);

        packets.forEach((message) => {
          if (jsonUtils.isStringJson(message)) {
            // for large split messages, add to array and await all before combining and calling the callback
            // **actually** we have to do this for all messages because a short JSON blob would break this. eek!
            console.log(peer.id + ': json string received');

            const jsonMessage: PacketDescription = JSON.parse(message);
          }
          else {
            console.log(peer.id + ': plain string received');

            peer.sendMessagesTo.forEach((func) => {
              console.log(peer.id + ': plain string func called');

              func(message);
            });
          }
        });
      }
    }
  });
}