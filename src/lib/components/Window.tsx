import { Dialog, Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/solid";
import c from "clsx";
import React, { Fragment } from "react";

export const FDWindow: React.FC<{
  className?: string;
  visible?: boolean;
  setClose: () => void;
  title?: string;
}> = ({ visible, setClose, children, title, className }) => {
  return (
    <Transition show={visible} as={Fragment}>
      <Dialog
        className="flex justify-center items-center fixed z-40 inset-0 m-24"
        onClose={() => setClose()}
      >
        <Transition.Child
          as={Fragment}
          enter="transition duration-50 ease-out"
          enterFrom="transform opacity-0"
          enterTo="transform opacity-100"
          leave="transition duration-50 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black z-10 bg-opacity-70" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transition duration-50 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-50 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <div
            className={c(
              "relative bg-gray-900 rounded-2xl z-20 flex flex-col",
              className
            )}
          >
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
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
