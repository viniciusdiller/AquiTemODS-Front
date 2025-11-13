import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

// Importando sua função 'cn' original
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-[#D7386E] to-[#3C6AB2]" />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb
      className={cn(
        "block h-5 w-5 rounded-full bg-white shadow-md",
        "transition-all",
        "hover:scale-110 active:scale-95",
        "outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[#D7386E]",

        "disabled:pointer-events-none disabled:opacity-50",

        "border-2 border-[#D7386E]",

        "dark:bg-slate-950 dark:border-[#3C6AB2] dark:focus-visible:ring-[#3C6AB2]"
      )}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
