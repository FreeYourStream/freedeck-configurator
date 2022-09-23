import React, { useContext } from "react";

import { FDSelect } from "../../../lib/components/SelectInput";
import { TitleBox } from "../../../lib/components/Title";
import { AppStateContext } from "../../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

const Tag: React.FC = ({ children }) => {
  return <div className="bg-gray-400 rounded-md px-2 py-1">{children}</div>;
};
export const LiveDataSettingsContainer: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const { pages } = useContext(ConfigStateContext);
  const { setLive } = useContext(ConfigDispatchContext);
  const { system } = useContext(AppStateContext);
  const liveSettings = pages.byId[pageId].displayButtons[displayIndex].live;
  return (
    <div className="flex flex-col h-full w-full gap-6">
      <TitleBox title="Sensors">
        <div className="flex gap-8">
          <Tag>
            <span>CPU temp: </span>
            <span> {system.cpuTemp[0].toFixed(1)} C°</span>
          </Tag>
          <Tag>
            <span>GPU temp: </span>
            <span> {system.gpuTemp[0].toFixed(1)} C°</span>
          </Tag>
        </div>
      </TitleBox>
      <TitleBox title="Live data">
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
      </TitleBox>
      {/* <div className="grid grid-cols-2 grid-rows-1 gap-2 h-full mb-4">
        
        
      </div> */}
    </div>
  );
};
