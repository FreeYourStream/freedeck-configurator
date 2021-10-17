import React from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FDButton } from "./Button";

export const confirm = (title: string, message?: string) => {
  return new Promise<boolean>((resolve) => {
    confirmAlert({
      closeOnEscape: true,
      closeOnClickOutside: true,
      customUI: ({ onClose }) => (
        <div className="custom-ui bg-gray-700 rounded-xl p-8">
          <div className="text-2xl mb-2">{title}</div>
          {!!message && <div className="mb-8">{message}</div>}
          <div className="flex justify-end gap-2">
            <FDButton
              onClick={() => {
                onClose();
                resolve(false);
              }}
            >
              No
            </FDButton>
            <FDButton
              type="danger"
              onClick={() => {
                onClose();
                resolve(true);
              }}
            >
              Yes
            </FDButton>
          </div>
        </div>
      ),
    });
  });
};
