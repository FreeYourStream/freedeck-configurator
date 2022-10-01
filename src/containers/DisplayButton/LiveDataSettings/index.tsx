import React, { useCallback, useContext } from "react";

import { LiveMode } from "../../../generated";
import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { ScrollListContainer } from "../../../lib/components/ScrollListContainer";
import { FDSelect } from "../../../lib/components/SelectInput";
import { TitleBox } from "../../../lib/components/Title";
import { AppStateContext } from "../../../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

const options = [
  { text: "None", value: "none" },
  { text: "CPU Temp", value: "cpu_temp" },
  { text: "CPU Temp Graph", value: "cpu_temp_graph" },
  { text: "CPU Temp Line", value: "cpu_temp_line" },
  { text: "GPU Temp", value: "gpu_temp" },
  { text: "GPU Temp Graph", value: "gpu_temp_graph" },
  { text: "GPU Temp Line", value: "gpu_temp_line" },
];

const Tag: React.FC = ({ children }) => {
  return <div className="bg-gray-400 rounded-md px-2 py-1">{children}</div>;
};
export const LiveDataSettingsContainer: React.FC<{
  pageId: string;
  displayIndex: number;
}> = ({ pageId, displayIndex }) => {
  const { pages, defaultBackDisplay } = useContext(ConfigStateContext);
  const { setLive } = useContext(ConfigDispatchContext);
  const { system, serialApi } = useContext(AppStateContext);
  const liveSettings =
    pageId === "dbd"
      ? defaultBackDisplay.live
      : pages.byId[pageId].displayButtons[displayIndex].live;
  const setLiveCallback = useCallback(
    (data: {
      pageId: string;
      buttonIndex: number;
      mode: LiveMode;
      position: "top" | "bottom";
    }) => {
      const state = { ...liveSettings, [data.position]: data.mode };
      setLive(data);
      if (state.top === "none" && state.bottom === "none" && !!serialApi) {
        serialApi.setCurrentPage(pages.sorted.indexOf(pageId));
      }
    },
    [setLive, serialApi, liveSettings, pageId, pages.sorted]
  );
  return (
    <ScrollListContainer>
      <TitleBox title="Sensors">
        <div className="flex gap-8">
          <Tag>
            <span>CPU temp: </span>
            <span>
              {" "}
              {system.cpuTemp[system.cpuTemp.length - 1].toFixed(1)} C°
            </span>
          </Tag>
          <Tag>
            <span>GPU temp: </span>
            <span>
              {" "}
              {system.gpuTemp[system.gpuTemp.length - 1].toFixed(1)} C°
            </span>
          </Tag>
        </div>
      </TitleBox>
      <TitleBox title="Live data">
        <div className="">
          <Row>
            <Label>Top half</Label>
            <FDSelect
              className="w-48"
              value={liveSettings.top}
              options={options}
              onChange={(value) =>
                setLiveCallback({
                  pageId,
                  buttonIndex: displayIndex,
                  mode: value,
                  position: "top",
                })
              }
            />
          </Row>
          <Row>
            <Label>Bottom half</Label>
            <FDSelect
              className="w-48"
              value={liveSettings.bottom}
              options={options}
              onChange={(value) =>
                setLiveCallback({
                  pageId,
                  buttonIndex: displayIndex,
                  mode: value,
                  position: "bottom",
                })
              }
            />
          </Row>
        </div>
      </TitleBox>
      <TitleBox title="What you need for this to work">
        On windows you need openhardwaremonitor installed and running. If
        something is not working, please save a report and send it to me
        (Discord or GitHub issue).
        <br />
        <br />
        On linux and macos there is nothing to do. It should work out of the
        box. If something is not working on linux, please send me the output of
        the following command:{" "}
        <code className="bg-gray-400 p-1 rounded-sm border-2">sensors</code>
      </TitleBox>
    </ScrollListContainer>
  );
};
