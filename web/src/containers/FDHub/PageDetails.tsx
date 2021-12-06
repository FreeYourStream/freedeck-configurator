import React, { useContext } from "react";
import { useNavigate, useParams } from "react-router";

import { usePageQuery } from "../../generated/types-and-hooks";
import { FDButton } from "../../lib/components/Button";
import { FDWindow } from "../../lib/components/Window";
import { ConfigDispatchContext } from "../../states/configState";
import { HubPage } from "./components/HubPage";

export const HubPageDetails = () => {
  const nav = useNavigate();
  const params = useParams();
  const { downloadPage } = useContext(ConfigDispatchContext);
  const { data, error } = usePageQuery({
    variables: { id: params.pageId! },
    fetchPolicy: "cache-first",
  });
  console.log("a", error);
  if (!params.pageId || error || !data) return <></>;
  console.log("b");
  return (
    <FDWindow
      className=""
      title={`FreeDeck Hub Page ${data.page.name}`}
      visible={true}
      setClose={() => {
        console.log("closing");
        nav("/");
      }}
    >
      <div className="flex flex-col p-8">
        <HubPage page={data.page} />
        <div className="flex mt-8">
          <FDButton
            onClick={() => {
              downloadPage({ page: data.page, id: params.pageId! });
              nav("/hub");
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
