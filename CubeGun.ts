import { Color } from "./Yuu API/Basic Types/Color";
import { Quaternion } from "./Yuu API/Basic Types/Quaternion";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";
import { Controller } from "./Yuu API/Controller";
import { Entity } from "./Yuu API/Entity";
import { Events } from "./Yuu API/Events";
import { Player } from "./Yuu API/Player";
import { Raycast } from "./Yuu API/Raycast";
import { spawnPrimitive } from "./Yuu API/SpawnPrimitive";

let cubeInventory = 0;
const pickableCubes: Entity[] = [];

interface MovingCube {
    entity: Entity;
    startPos: Vector3;
    targetPos: Vector3;
    startTime: number;
    duration: number;
}
const movingCubes: MovingCube[] = [];

export function initializeCubeGun() {
    // Visual inventory cube rendered at the player's hand
    const inventoryCubeEntity = spawnPrimitive.cube(
        Vector3.zero,
        Vector3.zero, // initially hidden
        Quaternion.one,
        Color.blue,
        0,
        false, // No collider
        'Static',
        undefined
    );

    // Laser for the raycast, rendered the same way as the paint raycast
    const laserEntity = spawnPrimitive.cube(
        new Vector3(0, -10, 0),
        Vector3.one,
        Quaternion.one,
        Color.red,
        0.5,
        false,
        'Empty',
        undefined
    );

    let latestHitDistance = 100;

    Events.onPhysicsUpdate(() => {
        const rightHandPos = Player.rightHand.position.get();
        const rightHandForward = Player.rightHand.forward.get();
        
        if (rightHandPos && rightHandForward) {
            const hit = Raycast.directional(rightHandPos, rightHandForward, 100, { getEntity: false });
            latestHitDistance = hit ? hit.distance : 100;
        }
    });

    Events.onUpdate(() => {
        const rightHandPos = Player.rightHand.position.get();
        const rightHandForward = Player.rightHand.forward.get();
        const rightHandRot = Player.rightHand.rotation.get();

        if (rightHandPos && rightHandForward && rightHandRot) {
            // Update Laser
            const laserCenter = rightHandPos.add(rightHandForward.multiply(latestHitDistance / 2));
            laserEntity.pos = laserCenter;
            laserEntity.scale = new Vector3(0.001, 0.005, latestHitDistance);
            laserEntity.rot = rightHandRot;
            laserEntity.visible.set(true);

            // Update Inventory Cube
            if (cubeInventory > 0) {
                // Render slightly above the right hand
                const offsetPos = rightHandPos.add(new Vector3(0, 0.3, 0));
                inventoryCubeEntity.pos = offsetPos;
                inventoryCubeEntity.scale = new Vector3(0.5, 0.5, 0.5);
                
                // Set rotation based on current time
                const time = Date.now() / 1000;
                inventoryCubeEntity.rot = Quaternion.fromEuler(new Vector3(time, time, 0));
            } else {
                inventoryCubeEntity.scale = Vector3.zero;
            }
        } else {
            laserEntity.visible.set(false);
            inventoryCubeEntity.scale = Vector3.zero;
        }

        // Update Moving Cubes
        const now = Date.now();
        for (let i = movingCubes.length - 1; i >= 0; i--) {
            const mc = movingCubes[i];
            const elapsed = now - mc.startTime;
            let percent = elapsed / mc.duration;
            if (percent >= 1) {
                percent = 1;
                mc.entity.pos = mc.targetPos;
                mc.entity.rot = Quaternion.one;
                movingCubes.splice(i, 1);
            } else {
                mc.entity.pos = mc.startPos.lerp(mc.targetPos, percent);
                mc.entity.rot = Quaternion.fromEuler(new Vector3(percent * Math.PI * 4, percent * Math.PI * 4, 0)); 
            }
        }
    });

    // Spawn initial pickable cubes for the player to use
    for (let i = 0; i < 5; i++) {
        const testCube = spawnPrimitive.cube(
            new Vector3(0, 1 + i * 0.2, -2), // Position somewhat in front of the player
            new Vector3(0.1, 0.1, 0.1),
            Quaternion.one,
            Color.blue,
            1,
            true, // Has collider
            'Static', // Type
            undefined
        );
        pickableCubes.push(testCube);
    }

    // Bind Right Grip for pickup
    Controller.subscribe('rightGrip', 'Pressed', () => {
        const rightHandPos = Player.rightHand.position.get();
        const rightHandForward = Player.rightHand.forward.get();
        
        if (rightHandPos && rightHandForward) {
            // Raycast properties: getEntity = true to identify the hit object
            const hit = Raycast.directional(rightHandPos, rightHandForward, 100, { getEntity: true });
            
            if (hit && hit.entity) {
                const index = pickableCubes.findIndex(c => c.nodeID === hit.entity!.nodeID);
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

                    const startPos = rightHandPos.add(new Vector3(0, 0.3, 0));

                    const distance = Vector3.distance(startPos, snappedPos);
                    const velocity = 15; // m/s
                    const durationMs = (distance / velocity) * 1000;

                    // Spawn new cube
                    const newCube = spawnPrimitive.cube(
                        startPos,
                        new Vector3(0.1, 0.1, 0.1),
                        Quaternion.one,
                        Color.blue,
                        1,
                        true,
                        'Static',
                        undefined
                    );

                    pickableCubes.push(newCube);
                    movingCubes.push({
                        entity: newCube,
                        startPos: startPos,
                        targetPos: snappedPos,
                        startTime: Date.now(),
                        duration: durationMs
                    });

                    cubeInventory--;
                    console.log(`Placed a cube. Inventory: ${cubeInventory}`);
                }
            }
        }
    });
}
