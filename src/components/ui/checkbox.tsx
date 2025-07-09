import * as React from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <input
        type="checkbox"
        ref={ref}
        {...props}
        style={{ width: 18, height: 18 }}
      />
      {label && <span>{label}</span>}
    </label>
  )
);
Checkbox.displayName = "Checkbox"; 