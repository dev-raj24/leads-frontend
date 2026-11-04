"use client";

import { forwardRef, useState } from "react";
import { IconEye, IconEyeOff } from "@/components/icons";

/** A password <input> with a show/hide eye toggle. Forwards every prop (incl. react-hook-form's register spread). */
export const PasswordField = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function PasswordField({ className, style, ...rest }, ref) {
    const [visible, setVisible] = useState(false);
    return (
      <div style={{ position: "relative" }}>
        <input {...rest} ref={ref} type={visible ? "text" : "password"} className={className} style={{ paddingRight: 44, ...style }} />
        <button
          type="button"
          className="pw-eye"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <IconEyeOff size={17} /> : <IconEye size={17} />}
        </button>
      </div>
    );
  }
);
