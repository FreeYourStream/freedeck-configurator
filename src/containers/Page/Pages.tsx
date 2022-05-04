import c from "clsx";
import React, { useContext } from "react";

import { Title } from "../../lib/components/Title";
import { ConfigStateContext } from "../../states/configState";
import { Page } from "./";

export const Pages: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configState = useContext(ConfigStateContext);
  return (
    <div>
      <div className="flex flex-col justify-center items-center pt-12">
        <Title>Pages</Title>
        <div
          className={c(
            "flex flex-wrap justify-evenly items-center w-full h-full pt-6 pb-16 flex-shrink",
            className
          )}
        >
          {configState.pages.sorted.map(
            (id) =>
              !configState.pages.byId[id].isInCollection && (
                <Page pageId={id} key={id} />
              )
          )}
        </div>
      </div>
    </div>
  );
};
