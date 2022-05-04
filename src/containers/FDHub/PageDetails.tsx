import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router";

import { usePageQuery } from "../../generated/types-and-hooks";
import { FDButton } from "../../lib/components/Button";
import { FDWindow } from "../../lib/components/Window";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";
import { HubPage } from "./components/HubPage";

export const HubPageDetails = () => {
  const nav = useNavigate();
  const params = useParams();
  const { downloadPage } = useContext(ConfigDispatchContext);
  const { width, height } = useContext(ConfigStateContext);
  const { data, error } = usePageQuery({
    variables: { id: params.pageId! },
    fetchPolicy: "cache-first",
  });
  if (!params.pageId || error || !data) return <></>;
  return (
    <FDWindow
      className=""
      title={`FreeDeck Hub Page ${data.page.data.name}`}
      visible={true}
      setClose={() => {
        nav("/hub");
      }}
    >
      <div className="flex flex-col p-8">
        <HubPage page={data.page} />
        <div className="flex mt-8">
          <FDButton
            onClick={() => {
              if (data.page.height * data.page.width > width * height) {
                window.advancedConfirm(
                  `Wrong size`,
                  `This page is too big. The last ${
                    data.page.height * data.page.width - width * height
                  } screen(s) will be cut off`,
                  () => {
                    downloadPage({ id: params.pageId! });
                    nav("/hub");
                  }
                );
              } else {
                downloadPage({ id: params.pageId! });
                nav("/hub");
              }
            }}
            className="ml-auto"
            title="Get this page"
          >
            Get this page
          </FDButton>
        </div>
      </div>
    </FDWindow>
  );
};
