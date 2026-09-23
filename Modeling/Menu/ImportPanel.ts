import { Entity } from "../../Yuu API/Entity";
import { Vector3 } from "../../Yuu API/Basic Types/Vector3";
import { Vector2 } from "../../Yuu API/Basic Types/Vector2";
import { Color } from "../../Yuu API/Basic Types/Color";
import { Quaternion } from "../../Yuu API/Basic Types/Quaternion";
import { LayoutContext, MenuComponent } from "./MenuComponent";
import { createMenuButton } from "./MenuButton";
import { createMenuLabel } from "./MenuLabel";
import { ModelingTool } from "../Core/ModelingTool";
import { entityBaseUVs } from "../Core/TextureEditor";
import { parseText, FBXReader } from "../../fbx-parser";
import { Player } from "../../Yuu API/Player";
import { SceneManager } from "../Core/SceneManager";

interface FBXFileEntry {
  dirPath: string;
  name: string;
  display: string;
}

export class ImportPanel implements MenuComponent {
  private static selectedFile: FBXFileEntry | undefined = undefined;

  constructor(private rebuild: () => void) {}

  render(parent: Entity, context: LayoutContext): Entity[] {
    const elements: Entity[] = [];
    const buttonSize = new Vector3(0.15, 0.04, 0.01);

    // Render Title
    const titlePos = new Vector3(context.offset.x - 0.08, context.yPos + context.offset.y, context.offset.z);
    const titleLabel = createMenuLabel(parent, 'Select FBX file:', titlePos, 1.2, Color.white);
    elements.push(titleLabel);
    context.yPos -= 0.04;

    // Get FBX files list from both templates and worlds
    let fbxFiles: FBXFileEntry[] = [];
    try {
      const templates = Godot.files.folder.getContents('user://templates', true);
      for (const f of templates) {
        if (f[2].toLowerCase() === 'fbx' || f[1].toLowerCase().endsWith('.fbx')) {
          const name = f[1];
          fbxFiles.push({
            dirPath: f[0],
            name,
            display: `${name}.fbx (template)`
          });
        }
      }
    } catch (e) {
      console.log(`Failed to get templates contents: ${e}`);
    }

    try {
      const worlds = Godot.files.folder.getContents('user://worlds', true);
      for (const f of worlds) {
        if (f[2].toLowerCase() === 'fbx' || f[1].toLowerCase().endsWith('.fbx')) {
          const name = f[1];
          const dirPath = f[0];
          let display = `${name}.fbx`;
          if (dirPath.startsWith('user://worlds/')) {
            const parts = dirPath.substring('user://worlds/'.length).split('/');
            const worldFolder = parts[0];
            const nameIndex = worldFolder.lastIndexOf('_');
            const friendlyWorldName = nameIndex !== -1 ? worldFolder.substring(nameIndex + 1) : worldFolder;
            display = `${name}.fbx (in ${friendlyWorldName})`;
          } else {
            display = `${name}.fbx (in worlds)`;
          }
          fbxFiles.push({
            dirPath,
            name,
            display
          });
        }
      }
    } catch (e) {
      console.log(`Failed to get worlds contents: ${e}`);
    }

    if (fbxFiles.length === 0) {
      const nonePos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
      const noneLabel = createMenuLabel(parent, 'No FBX files found.', nonePos, 1.0, new Color(0.7, 0.7, 0.7));
      elements.push(noneLabel);
      context.yPos -= context.ySpacing;
    } else {
      // Render file list buttons
      for (const fileEntry of fbxFiles) {
        const isSelected = ImportPanel.selectedFile && 
                            ImportPanel.selectedFile.dirPath === fileEntry.dirPath && 
                            ImportPanel.selectedFile.name === fileEntry.name;
        const color = isSelected ? new Color(0.4, 0.4, 0.4) : new Color(0.2, 0.2, 0.2);
        const pos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
        
        const btn = createMenuButton(parent, fileEntry.display, pos, buttonSize, color, () => {
          ImportPanel.selectedFile = fileEntry;
          this.rebuild();
        });
        elements.push(btn);
        context.yPos -= 0.05;
      }
    }

    // Render Import Button
    context.yPos -= 0.02;
    const importBtnColor = ImportPanel.selectedFile ? new Color(0.2, 0.6, 0.2) : new Color(0.15, 0.25, 0.15);
    const importPos = new Vector3(context.offset.x, context.yPos + context.offset.y, context.offset.z);
    const importBtn = createMenuButton(parent, 'Import File', importPos, new Vector3(0.15, 0.05, 0.01), importBtnColor, () => {
      if (ImportPanel.selectedFile) {
        this.importFBX(ImportPanel.selectedFile);
        this.rebuild();
      }
    });
    elements.push(importBtn);
    context.yPos -= context.ySpacing;

    return elements;
  }

  importFBX(fileEntry: FBXFileEntry) {
    console.log(`Starting FBX import for: ${fileEntry.name} in ${fileEntry.dirPath}`);
    const content = Godot.files.text.get(fileEntry.dirPath as any, fileEntry.name, '.fbx');
    if (!content) {
      console.log(`Failed to read file contents for: ${fileEntry.name}`);
      return;
    }

    try {
      const nodes = parseText(content);
      const reader = new FBXReader(nodes);

      const objectsNode = reader.node('Objects');
      if (!objectsNode) {
        console.log("No Objects node found in FBX file.");
        return;
      }

      const geomNodes = objectsNode.nodes('Geometry');
      if (geomNodes.length === 0) {
        console.log("No Geometry found in FBX Objects.");
        return;
      }

      // Import the first Geometry
      const geom = geomNodes[0];
      const vertsNode = geom.node('Vertices');
      const indicesNode = geom.node('PolygonVertexIndex');

      if (!vertsNode || !indicesNode) {
        console.log("FBX Geometry is missing Vertices or PolygonVertexIndex.");
        return;
      }

      const fbxVerts = vertsNode.prop(0) as number[];
      const fbxIndices = indicesNode.prop(0) as number[];

      const verts: Vector3[] = [];
      const uvs: Vector2[] = [];
      const triangles: number[] = [];

      // UV mapping data from FBX
      const uvNode = geom.node('LayerElementUV');
      const fbxUvs = uvNode?.node('UV')?.prop(0) as number[] || [];
      const uvIndices = uvNode?.node('UVIndex')?.prop(0) as number[] || [];
      const mappingType = uvNode?.node('MappingInformationType')?.prop(0) as string || 'ByPolygonVertex';
      const referenceType = uvNode?.node('ReferenceInformationType')?.prop(0) as string || 'IndexToDirect';

      if (fbxUvs.length > 0) {
        // Vertex duplication map to split vertices when they share the same vertex index
        // but have different UV coordinates (to prevent tearing).
        // Map key is `fbxVertexIndex_uvIndex`. Value is index in uniqueVerts/uniqueUVs.
        const vertMap = new Map<string, number>();

        let polygonCornerIndex = 0;
        let polygon: number[] = [];

        for (let i = 0; i < fbxIndices.length; i++) {
          let idx = fbxIndices[i];
          let isLast = false;
          if (idx < 0) {
            idx = ~idx;
            isLast = true;
          }

          // Resolve the UV coordinate index for this polygon corner
          let uvIdx = 0;
          if (mappingType === 'ByPolygonVertex') {
            if (referenceType === 'IndexToDirect') {
              uvIdx = uvIndices[polygonCornerIndex] !== undefined ? uvIndices[polygonCornerIndex] : polygonCornerIndex;
            } else {
              uvIdx = polygonCornerIndex;
            }
          } else if (mappingType === 'ByVertex') {
            if (referenceType === 'IndexToDirect') {
              uvIdx = uvIndices[idx] !== undefined ? uvIndices[idx] : idx;
            } else {
              uvIdx = idx;
            }
          }

          // Get the actual UV coordinates (v is flipped vertically in FBX to match standard image space)
          const u = fbxUvs[uvIdx * 2] !== undefined ? fbxUvs[uvIdx * 2] : 0.5;
          const v = fbxUvs[uvIdx * 2 + 1] !== undefined ? 1.0 - fbxUvs[uvIdx * 2 + 1] : 0.5;

          // Unique key to identify vertex-UV combination
          const key = `${idx}_${uvIdx}`;
          let finalIdx = vertMap.get(key);
          if (finalIdx === undefined) {
            finalIdx = verts.length;
            vertMap.set(key, finalIdx);
            verts.push(new Vector3(fbxVerts[idx * 3], fbxVerts[idx * 3 + 1], fbxVerts[idx * 3 + 2]));
            uvs.push(new Vector2(u, v));
          }

          polygon.push(finalIdx);
          polygonCornerIndex++;

          if (isLast) {
            // Triangulate the polygon (fan triangulation)
            for (let j = 1; j < polygon.length - 1; j++) {
              triangles.push(polygon[0], polygon[j], polygon[j + 1]);
            }
            polygon = [];
          }
        }
      } else {
        // Fallback if no UVs are present
        for (let i = 0; i < fbxVerts.length; i += 3) {
          verts.push(new Vector3(fbxVerts[i], fbxVerts[i+1], fbxVerts[i+2]));
          uvs.push(new Vector2(0.5, 0.5));
        }

        // Triangulate FBX polygon indices
        let polygon: number[] = [];
        for (let i = 0; i < fbxIndices.length; i++) {
          let idx = fbxIndices[i];
          let isLast = false;
          if (idx < 0) {
            idx = ~idx;
            isLast = true;
          }
          polygon.push(idx);
          if (isLast) {
            for (let j = 1; j < polygon.length - 1; j++) {
              triangles.push(polygon[0], polygon[j], polygon[j+1]);
            }
            polygon = [];
          }
        }
      }

      // Spawn position in front of player
      const headPos = Player.head.position.get() ?? Vector3.zero;
      const forward = Player.head.forward.get() ?? new Vector3(0, 0, -1);
      const spawnPos = headPos.add(forward.multiply(2));

      // Create Entity
      const entity = new Entity(spawnPos, Quaternion.one, Vector3.one, undefined, 'Static');
      entity.mesh.create(verts, uvs, triangles);
      entity.mesh.color.set(Color.white, 1);

      if (entity.mesh.nodeID) {
        entity.collider.createFromMeshNode(entity.mesh.nodeID, 'Convex');
        // Store base UVs so TextureEditor can transform them later!
        entityBaseUVs.set(entity.mesh.nodeID, uvs.map(uv => new Vector2(uv.x, uv.y)));
      }

      entity.rayClick.initialize(false);
      entity.rayClick.setClickFunction((hit) => ModelingTool.handleEntityClick(entity, hit));
      entity.rayClick.setHeldFunction((hit) => ModelingTool.handleEntityHeld(entity, hit));

      ModelingTool.spawnedEntities.push(entity);
      // Register in scene graph with the FBX filename as name
      SceneManager.addObject(entity, fileEntry.name);
      ModelingTool.selectEntity(entity);

      console.log("FBX imported successfully");
    } catch (err) {
      console.log(`Failed to parse/import FBX: ${err}`);
    }
  }
}
