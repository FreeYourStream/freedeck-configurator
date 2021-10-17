import { XCircleIcon } from "@heroicons/react/solid";
import c from "clsx";
import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

export const ModalBody = styled.div<{ visible?: boolean }>`
  display: ${(p) => (p.visible || p.visible === undefined ? "flex" : "none")};
  height: 100%;
  padding: 40px 64px 64px 64px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const Modal: React.FC<{
  className?: string;
  visible?: boolean;
  setClose: () => void;
  title?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}> = ({ visible, setClose, children, title, className }) => {
  const content = (
    <div
      className={c(
        "fixed top-0 left-0 right-0 bottom-0 bg-gray-200 bg-opacity-70 z-50 ",
        visible ? "flex" : "hidden",
        "justify-center items-center"
      )}
    >
      <div className={c("relative bg-gray-900 rounded-2xl", className)}>
        <div
          className={c(
            "h-11 flex items-center justify-center font-medium text-xl text-white bg-gray-700 rounded-t-2xl",
            !title?.length && "hidden"
          )}
        >
          {title}
        </div>
        <div className={"absolute top-0.5 right-1"}>
          <div
            className={
              "box-content p-1 rounded-full flex items-center justify-center cursor-pointer"
            }
            onClick={() => setClose()}
          >
            {/* <Icon icon="ri/RiCloseCircleFill" size={32} color="white" /> */}
            <XCircleIcon className="h-7 w-7 hover:text-danger-500" />
          </div>
        </div>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.querySelector("#modal")!);
};
