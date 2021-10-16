import { XCircleIcon } from "@heroicons/react/solid";
import c from "clsx";
import React from "react";
import ReactDOM from "react-dom";
import { AiFillCloseSquare } from "react-icons/ai";
import styled from "styled-components";

import { colors } from "../../definitions/colors";
import { Icon } from "./Button";

const Close = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 30px;
  height: 30px;
  cursor: pointer;
`;
const CloseBackground = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: white;
`;
export const ModalBody = styled.div<{ visible?: boolean }>`
  display: ${(p) => (p.visible || p.visible === undefined ? "flex" : "none")};
  height: 100%;
  padding: 40px 64px 64px 64px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
export const Modal: React.FC<{
  visible?: boolean;
  setClose: () => void;
  title?: string;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
}> = ({ visible, setClose, children, title }) => {
  const content = (
    <div
      className={c(
        "fixed top-0 left-0 right-0 bottom-0 bg-gray-200 bg-opacity-70 z-50 ",
        visible ? "flex" : "hidden",
        "justify-center items-center"
      )}
    >
      <div className="relative bg-gray-900 rounded-2xl w-modal">
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
