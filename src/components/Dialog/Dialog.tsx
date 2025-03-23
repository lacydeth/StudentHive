import React, { forwardRef } from "react";
import styles from "./Dialog.module.css";

type DialogProps = {
  children: React.ReactNode;
  toggleDialog: () => void;
};



const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ children, toggleDialog }, ref) => {
    const handleDialogClose = () => {
      toggleDialog();
    };

    return (
      <dialog
        className={styles.dialog}
        onClick={(e) => {
          if (e.currentTarget === e.target) {
            handleDialogClose();
          }
        }}
        ref={ref}
      >
        <div className={styles.content}>
          <i
            className="ri-close-line"
            onClick={handleDialogClose}
            style={{ cursor: "pointer" }}
          ></i>
          {children}
        </div>
      </dialog>
    );
  }
);

export default Dialog;
