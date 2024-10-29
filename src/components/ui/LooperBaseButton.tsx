import React from "react";

interface LooperBaseButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "processing" | "cancelling";
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const LooperBaseButton = React.forwardRef<
  HTMLButtonElement,
  LooperBaseButtonProps
>(
  (
    {
      variant = "primary",
      fullWidth = false,
      isLoading = false,
      loadingText,
      icon,
      children,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      h-9 
      px-4 
      rounded-md
      inline-flex
      items-center
      justify-center
      text-sm
      font-medium
      transition-colors
      focus-visible:outline-none 
      focus-visible:ring-2 
      focus-visible:ring-bronze-8
      focus-visible:ring-offset-2
    `;

    const variantStyles = {
      primary: `
        ${
          disabled || isLoading
            ? "bg-bronze-3 text-bronze-11 cursor-not-allowed"
            : "bg-bronze-10 text-bronze-1 hover:bg-bronze-11/90 active:bg-bronze-12"
        }
      `,
      secondary: `
        ${
          disabled || isLoading
            ? "bg-bronze-3 text-bronze-11 cursor-not-allowed"
            : "bg-bronze-4 text-bronze-11 hover:bg-bronze-5 active:bg-bronze-6"
        }
      `,
      processing: `
        ${
          disabled
            ? "bg-bronze-3 text-bronze-11 cursor-not-allowed"
            : "bg-bronze-10 text-bronze-1 hover:bg-bronze-11/90 active:bg-bronze-12"
        }
      `,
      cancelling: `
        bg-bronze-3 text-bronze-11 cursor-not-allowed
      `,
    };

    const widthStyles = fullWidth ? "w-full" : "w-auto";

    return (
      <button
        ref={ref}
        disabled={disabled || variant === "cancelling"}
        className={`
          ${baseStyles}
          ${variantStyles[variant]}
          ${widthStyles}
          ${className}
        `}
        {...props}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {isLoading ? loadingText || "Loading..." : children}
      </button>
    );
  }
);

LooperBaseButton.displayName = "LooperBaseButton";

export default LooperBaseButton;
