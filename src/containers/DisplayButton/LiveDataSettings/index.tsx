import React, { useContext } from "react";

import { FDSelect } from "../../../lib/components/SelectInput";
import { AppDispatchContext, AppStateContext } from "../../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const LiveDataSettingsContainer: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const { pages } = useContext(ConfigStateContext);
  const { setLive } = useContext(ConfigDispatchContext);
  const { system } = useContext(AppStateContext);
  const liveSettings = pages.byId[pageId].displayButtons[displayIndex].live;
  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-2 grid-rows-1 gap-2 h-full mb-4">
        <div>{JSON.stringify(system)}</div>
        <FDSelect
          value={liveSettings}
          options={[
            { text: "CPU Temp", value: "cpu_temp" },
            { text: "GPU Temp", value: "gpu_temp" },
            { text: "CPU&GPU Temp", value: "cpu_gpu_temp" },
            { text: "None", value: undefined },
          ]}
          onChange={(value) =>
            setLive({ pageId, buttonIndex: displayIndex, live: value })
          }
        />
      </div>
    </div>
  );
};
