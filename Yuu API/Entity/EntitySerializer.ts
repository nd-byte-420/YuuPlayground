import { Quaternion } from "../Basic Types/Quaternion";
import { Vector3 } from "../Basic Types/Vector3";
import { Files } from "../Files";
import { Entity } from "./Entity";


// The best part of working on this is that it can also be used to send data across the network
// ie. in multiplayer when an Entity enters the scene
// So it is worth thinking about keeping the size of this data small where possible,
// or creating a minified -> uncompressed function


export type SerializedEntity = {
  version: number
  fileName: string,
  pos: Vector3,
  rot: Quaternion,
  scale: Vector3,
  type: BaseNodeTypes,
  // Add looooots more data about the entity, ideally all information
  // Will also need a loop for child entities
}

export const entitySerializer = {
  saveEntityToWorldFolder,
}


function saveEntityToWorldFolder(entity: Entity) {
  const serializedEntity: SerializedEntity = getSerializedEntity(entity);

  Files.text.update('user://worlds', 'worldName', serializedEntity.fileName, '.json', JSON.stringify(serializedEntity));
}

function getSerializedEntity(entity: Entity): SerializedEntity {
  const serializedEntity: SerializedEntity = {
    // Thinking on Entity creation it should create a Unique ID using the random that basically guarantees no dupes.
    version: 1,
    fileName: 'Need A Unique Identifier, That Stays The Same If It Already Exists -- Interesting Dilemma!',
    pos: entity.pos,
    rot: entity.rot,
    scale: entity.scale,
    type: entity.type ?? 'Empty',
  }

  return serializedEntity;
}


function loadEntityIntoWorld(fileName: string): Entity | undefined {
  // Should load the JSON and create an entity based on the saved data

  // Parse the file
  const serializedEntity: SerializedEntity = JSON.parse('');

  // Check that it parsed correctly
  if (typeof(serializedEntity) === 'object') {
    // Checking a type version number is probably a good idea

    const entity: Entity = new Entity(serializedEntity.pos, serializedEntity.rot, serializedEntity.scale, undefined, serializedEntity.type);
    // Think about parent not being undefined if the serializedEntity has children

    return entity;
  }
  else {
    return undefined;
  }
}