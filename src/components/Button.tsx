import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps<T extends React.ElementType> {
  as?: T;
}

export default function Button<T extends React.ElementType = "button">({ as, ...props }: ButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>) {

    const Component = as ?? "button";

  return (
    <Component
      {...props}
      className={twMerge(
        "flex items-center gap-2 rounded bg-green-500 p-2 text-white active:bg-green-600 disabled:bg-gray-200",
        props.className
      )}
    />
  );
}
