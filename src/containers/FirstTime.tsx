import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React, { useContext } from "react";

import { FDButton } from "../lib/components/Button";
import { TitleBox } from "../lib/components/Title";
import { ConfigDispatchContext } from "../states/configState";

export const FirstPage: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <div className="flex flex-col justify-center h-full items-center">
      <TitleBox title="Create your first page" className="mb-8">
        <div className="flex justify-center">
          <FDButton
            prefix={<PlusCircleIcon className="w-6 h-6" />}
            size={3}
            type="primary"
            onClick={() => configDispatch.addPage({ startPage: true })}
          >
            Add Page
          </FDButton>
        </div>
      </TitleBox>
    </div>
  );
};
