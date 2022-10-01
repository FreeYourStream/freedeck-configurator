import { CloudArrowDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { IAppDispatch } from "../../states/appState";
import { FDButton } from "../components/Button";
import { createToast } from "./createToast";
import { isMacOS } from "./util";

export const AddEventListeners = ({
  appDispatchContext,
}: {
  appDispatchContext: IAppDispatch;
}) => {
  const { setCtrl } = appDispatchContext;
  return useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      if (!localStorage.getItem("closedPWACTA"))
        createToast({
          text: "You can install the configurator to have it offline! Click here to install",
          danger: (t) => (
            <FDButton
              onClick={() => {
                localStorage.setItem("closedPWACTA", "true");
                toast.dismiss(t.id);
              }}
              prefix={<XMarkIcon className="h-4 w-4" />}
            >
              Close
            </FDButton>
          ),
          primary: (t) => (
            <FDButton
              type="primary"
              onClick={() => {
                localStorage.setItem("closedPWACTA", "true");
                toast.dismiss(t.id);
                (e as any).prompt();
              }}
              prefix={<CloudArrowDownIcon className="h-4 w-4" />}
            >
              Install
            </FDButton>
          ),
        });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (isMacOS && event.key === "Meta") {
        setCtrl(true);
      } else if (event.key === "Control") {
        setCtrl(true);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (isMacOS && event.key === "Meta") {
        setCtrl(false);
      } else if (event.key === "Control") {
        setCtrl(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    window.onblur = () => setCtrl(false);
    // eslint-disable-next-line
  }, []); // only execute on page load
};
