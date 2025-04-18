import React, { forwardRef } from "react";
import { Root as SwitchRoot, Thumb as SwitchThumb } from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = forwardRef((props, ref) => {
  const { className, ...rest } = props;

  return (
    <SwitchRoot
      ref={ref}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
        className
      )}
      {...rest}
    >
      <SwitchThumb
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchRoot>
  );
});

Switch.displayName = "Switch";

export { Switch };
