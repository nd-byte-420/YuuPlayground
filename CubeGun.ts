import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Controller } from "./Yuu API/Controller";
import { Entity } from "./Yuu API/Entity";
import { Events } from "./Yuu API/Events";
import { Player } from "./Yuu API/Player";
import { Raycast } from "./Yuu API/Raycast";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";

class Cube {
    entity: Entity;

    constructor(position: Vector3) {
        this.entity = spawnPrimitive.cube(
            position,
            new Vector3(0.1, 0.1, 0.1),
            Quaternion.one,
            Color.blue,
            1,
            true, // Has collider
            'Static', // Type
            undefined
        );
    }

    destroy() {
        this.entity.destroy();
    }
}

let cubeInventory = 0;
const pickableCubes: Cube[] = [];

export function initializeCubeGun() {
    // Spawn initial pickable cubes for the player to use
    for (let i = 0; i < 5; i++) {
        const testCube = new Cube(new Vector3(0, 1 + i * 0.2, -2)); // Position somewhat in front of the player
        pickableCubes.push(testCube);
    }

    // Laser for the raycast
    const laserEntity = spawnPrimitive.cube(
        Vector3.zero,
        new Vector3(0.005, 0.005, 1),
        Quaternion.one,
        Color.red,
        0.5,
        false,
        'Static',
        undefined
    );

    Events.onUpdate(() => {
        const rightHandPos = Player.rightHand.position.get();
        const rightHandForward = Player.rightHand.forward.get();
        const rightHandRot = Player.rightHand.rotation.get();

        if (rightHandPos && rightHandForward && rightHandRot) {
            const hit = Raycast.directional(rightHandPos, rightHandForward, 100, { getEntity: false });
            let distance = 100;
            if (hit) {
                distance = hit.distance;
            }

            // Offset the laser by distance / 2 so its start is at the hand
            const laserCenter = rightHandPos.add(rightHandForward.multiply(distance / 2));
            laserEntity.pos = laserCenter;
            laserEntity.scale = new Vector3(0.005, 0.005, distance);
            laserEntity.rot = rightHandRot;
        } else {
            laserEntity.scale = Vector3.zero;
        }
    });

    // Bind Right Grip for pickup
    Controller.subscribe('rightGrip', 'Pressed', () => {
        const rightHandPos = Player.rightHand.position.get();
        const rightHandForward = Player.rightHand.forward.get();
        
        if (rightHandPos && rightHandForward) {
            // Raycast properties: getEntity = true to identify the hit object
            const hit = Raycast.directional(rightHandPos, rightHandForward, 100, { getEntity: true });
            
            if (hit && hit.entity) {
                const index = pickableCubes.findIndex(c => c.entity.nodeID === hit.entity!.nodeID);
                if (index !== -1) {
                    // Pick up cube
                    const cubeToPickup = pickableCubes[index];
                    cubeToPickup.destroy();
                    pickableCubes.splice(index, 1);
                    cubeInventory++;
                    console.log(`Picked up a cube. Inventory: ${cubeInventory}`);
                }
            }
        }
    });

    // Bind Right Trigger for firing/placing
    Controller.subscribe('rightTrigger', 'Pressed', () => {
        if (cubeInventory > 0) {
            const rightHandPos = Player.rightHand.position.get();
            const rightHandForward = Player.rightHand.forward.get();

            if (rightHandPos && rightHandForward) {
                const hit = Raycast.directional(rightHandPos, rightHandForward, 100, { getEntity: false });

                if (hit) {
                    // Offset slightly by normal to avoid clipping
                    const offsetPos = hit.pos.add(hit.normal.multiply(0.05));
                    
                    // Snap to 0.1 grid
                    const gridX = Math.round(offsetPos.x * 10) / 10;
                    const gridY = Math.round(offsetPos.y * 10) / 10;
                    const gridZ = Math.round(offsetPos.z * 10) / 10;
                    const snappedPos = new Vector3(gridX, gridY, gridZ);

                    // Spawn new cube
                    const newCube = new Cube(snappedPos);

                    pickableCubes.push(newCube);
                    cubeInventory--;
                    console.log(`Placed a cube. Inventory: ${cubeInventory}`);
                }
            }
        }
    });
}
