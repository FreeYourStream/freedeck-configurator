import { PlusCircleIcon } from "@heroicons/react/outline";
import React, { useContext } from "react";

import { FDButton } from "../lib/components/Button";
import { Title } from "../lib/components/Title";
import { ConfigDispatchContext } from "../states/configState";

export const FirstPage: React.FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <div className="flex flex-col justify-center h-full items-center">
      {/* <div className="flex flex-col justify-center items-center p-8 bg-gray-500 rounded-2xl"> */}
      <Title className="mb-8">Create your first page</Title>
      <FDButton
        prefix={<PlusCircleIcon className="w-6 h-6" />}
        size={3}
        type="primary"
        onClick={() => configDispatch.addPage({ startPage: true })}
      >
        Add Page
      </FDButton>
      {/* </div> */}
    </div>
  );
};
