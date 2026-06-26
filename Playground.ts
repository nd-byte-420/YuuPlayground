import { registerStart } from "./Yuu API/RegisterStart";
import { ModelingMenu } from "./Modeling/Menu/ModelingMenu";
import { Gizmo } from "./Modeling/Gizmo/Gizmo";
import { SelectionTools } from "./Modeling/SelectionTools";

registerStart(start);
async function start() {
  ModelingMenu.init();
  Gizmo.init();
  SelectionTools.init();
}
