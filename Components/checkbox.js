import * as React from "react";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(({ checked, onCheckedChange, disabled, ...props }, ref) => {
  const handleChange = (e) => {
    if (onCheckedChange) onCheckedChange(e.target.checked);
  };

  return (
    <div className="checkbox-wrapper">
      <input
        type="checkbox"
        ref={ref}
        className="checkbox-input"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <div className={`checkbox-box ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}>
        {checked && <Check className="checkbox-icon" />}
      </div>
    </div>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
