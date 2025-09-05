"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

export const Slider = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={`relative flex w-full touch-none select-none items-center ${className}`}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-gray-300">
        <SliderPrimitive.Range className="absolute h-full bg-teal-400" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full bg-white border border-gray-500 shadow" />
    </SliderPrimitive.Root>
  )
})

Slider.displayName = "Slider"
