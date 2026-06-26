import { registerStart } from "./Yuu API/RegisterStart";
import { ModelingMenu } from "./Modeling/Menu/ModelingMenu";
import { Gizmo } from "./Modeling/Gizmo/Gizmo";
import { SelectionTools } from "./Modeling/SelectionTools";
import { http } from "./Yuu API/Networking/http";
import { inWorldConsole } from "./Yuu API/Console";
import { Vector3 } from "./Yuu API/Basic Types/Vector3";

registerStart(start);
async function start() {
  ModelingMenu.init();
  Gizmo.init();
  SelectionTools.init();

  // Show the in-world console 1.5m up and 2m forward
  inWorldConsole.visible(true, new Vector3(0, 1.5, -2));

  console.log("Making HTTP request to local Express server...");
  try {
    const response = http.getJson<{ message: string; success: boolean; timestamp: string }>(
      "192.168.0.150:3000",
      "/"
    );
    console.log("Express Server Response:", JSON.stringify(response));
  } catch (error) {
    console.error("HTTP Request failed:", error);
  }
}


