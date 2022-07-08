import { XIcon } from "@heroicons/react/outline";
import React from "react";
import toast, { Toast } from "react-hot-toast";
import { FDButton } from "./components/Button";
import { Title } from "./components/Title";
interface IProps {
  primary?: (t: Toast) => JSX.Element;
  danger?: (t: Toast) => JSX.Element;
  title?: string;
  text: string;
}
export const createToast = ({ danger, primary, title, text }: IProps) => {
  toast(
    (t) => (
      <div className="py-2">
        {!!title && <Title className="mb-2">{title}</Title>}
        <div className="mb-8">{text}</div>
        <div className="flex justify-end gap-2">
          {!!primary && primary(t)}
          {!!danger ? (
            danger(t)
          ) : (
            <FDButton
              prefix={<XIcon className="h-4 w-4" />}
              type="danger"
              size={2}
              onClick={() => toast.dismiss(t.id)}
            >
              Close
            </FDButton>
          )}
        </div>
      </div>
    ),
    {
      duration: Infinity,
      position: "bottom-right",
      className: "bg-gray-700 text-white border-0 border-white text-lg",
    }
  );
};
