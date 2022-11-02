import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";
import toast, { Toast } from "react-hot-toast";

import { FDButton } from "../components/Button";
import { TitleBox } from "../components/Title";

interface IProps {
  primary?: (t: Toast) => JSX.Element;
  danger?: (t: Toast) => JSX.Element;
  title?: string;
  text: string;
}
export const createToast = ({ danger, primary, title, text }: IProps) => {
  toast(
    (t) => (
      <div className="">
        {!!title && (
          <TitleBox title={title} className="mb-2">
            <div className="mb-8">{text}</div>
            <div className="flex justify-end gap-2">
              {!!primary && primary(t)}
              {!!danger ? (
                danger(t)
              ) : (
                <FDButton
                  prefix={<XMarkIcon className="h-4 w-4" />}
                  type="danger"
                  size={2}
                  onClick={() => toast.dismiss(t.id)}
                >
                  Close
                </FDButton>
              )}
            </div>
          </TitleBox>
        )}
      </div>
    ),
    {
      duration: Infinity,
      position: "bottom-right",
      style: { background: "#fff0" },
      className: "text-white border-0 p-0 m-0 border-white text-lg",
    }
  );
};
