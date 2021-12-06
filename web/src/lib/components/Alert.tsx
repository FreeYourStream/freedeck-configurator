import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

import { FDButton } from "./Button";
import { Title } from "./Title";

export const Alert: React.FC<{
  title: string;
  text: string;
  onClose: () => any;
  isOpen: boolean;
}> = ({ isOpen, onClose, title, text }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        className="flex justify-center items-center fixed z-40 inset-0"
        onClose={() => onClose()}
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
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 translate-y-8 opacity-0"
          enterTo="transform scale-100 translate-y-0 opacity-70"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-70"
          leaveTo="transform scale-95 opacity-0"
        >
          <div className="flex flex-col items-start justify-center p-6 bg-gray-600 z-50 rounded-xl shadow-2xl max-w-md break-words break-all">
            <Dialog.Title className="mb-2">
              <Title>{title}</Title>
            </Dialog.Title>
            <Dialog.Description className="text-lg mb-8">
              {text}
            </Dialog.Description>
            <div className="flex w-full justify-end gap-2">
              <FDButton onClick={() => onClose()}>Ok</FDButton>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};
