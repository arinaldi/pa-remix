import { useRef } from "react";
import { Form, useTransition } from "@remix-run/react";
import { Dialog, Transition } from "@headlessui/react";

import type { ReactNode } from "react";

import CancelButton from "~/components/CancelButton";
import SubmitButton from "~/components/SubmitButton";

interface Props {
  action: string;
  children: ReactNode;
  isOpen: boolean;
  method: "delete" | "post" | "put";
  onClose: () => void;
  title: string;
}

export default function Modal({
  action,
  children,
  isOpen,
  method,
  onClose,
  title,
}: Props) {
  const cancelButtonRef = useRef(null);
  const { state } = useTransition();

  return (
    <Transition
      show={isOpen}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
    >
      <Dialog
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 mt-2 transform p-4 transition-all">
          <Dialog.Panel className="mx-auto w-full max-w-lg rounded-2xl bg-white text-left shadow-xl dark:bg-gray-800">
            <Dialog.Title
              as="h3"
              className="p-6 pb-0 text-2xl font-semibold dark:text-white"
            >
              {title}
            </Dialog.Title>
            <Form action={action} method={method}>
              {children}
              <div className="flex items-center justify-end p-6 pt-0">
                <CancelButton onClick={onClose} ref={cancelButtonRef} />
                <span className="ml-1" />
                <SubmitButton isSubmitting={state === "submitting"} />
              </div>
            </Form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
