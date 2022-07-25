import c from "clsx";
import React, { useContext } from "react";

import { TitleBox } from "../../lib/components/Title";
import { ConfigStateContext } from "../../states/configState";
import { Page } from "./";

export const Pages: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configState = useContext(ConfigStateContext);
  return (
    <div>
      <div className="flex flex-col justify-center items-center p-12">
        <TitleBox title="Pages" center className="w-full">
          <div
            className={c(
              "flex flex-wrap justify-evenly items-center w-full h-full",
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
        </TitleBox>
      </div>
    </div>
  );
};
