import React, { forwardRef } from "react";

type DialogProps = {
  children: React.ReactNode;
  toggleDialog: () => void;
};

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, toggleDialog }, ref) => {
    return (
      <dialog
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            toggleDialog();
          }
        }}
        ref={ref}
      >
        <div>
          <button onClick={toggleDialog}>
            Close
          </button>
          {children}
        </div>
      </dialog>
    );
  }
);

export default Dialog;
