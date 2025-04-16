import { Loader2, LucideIcon } from "lucide-react";
import * as React from "react";

import clsxm from "@/lib/clsxm";

export enum ButtonVariant {
    primary,
    secondary,
    success,
    danger,
    warning,
    outline,
    ghost,
    gray,
}

export enum ButtonSize {
    sm,
    base,
    lg,
}

export type ButtonProps = {
    isLoading?: boolean;
    variant?: keyof typeof ButtonVariant;
    size?: (typeof ButtonSize)[number];
    leftIcon?: LucideIcon;
    rightIcon?: LucideIcon;
    leftIconClassName?: string;
    rightIconClassName?: string;
} & React.ComponentPropsWithRef<"button">;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            className,
            disabled: buttonDisabled,
            isLoading,
            variant = "primary",
            size = "base",
            leftIcon: LeftIcon,
            rightIcon: RightIcon,
            leftIconClassName,
            rightIconClassName,
            ...rest
        },
        ref,
    ) => {
        const disabled = isLoading || buttonDisabled;

        return (
            <button
                ref={ref}
                type="button"
                disabled={disabled}
                className={clsxm(
                    "inline-flex items-center justify-center cursor-pointer rounded-lg font-medium",
                    "focus:outline-none focus-visible:ring",
                    "shadow-sm",
                    "transition-colors duration-75",
                    //#region  //*=========== Size ===========
                    [
                        size === "lg" && [
                            "min-h-[2.75rem] px-3.5 md:min-h-[3rem]",
                            "text-base",
                        ],
                        size === "base" && [
                            "min-h-[2.25rem] px-3 md:min-h-[2.5rem]",
                            "text-sm md:text-base",
                        ],
                        size === "sm" && [
                            "min-h-[1.75rem] px-2 md:min-h-[2rem]",
                            "text-xs md:text-sm",
                        ],
                    ],
                    //#endregion  //*======== Size ===========
                    //#region  //*=========== Variants ===========
                    [
                        variant === "primary" && [
                            "bg-[#5d9ae9] text-white",
                            "border border-[#4c8ed9]",
                            "hover:bg-[#4c8ed9] hover:text-white",
                            "active:bg-[#148CC7]",
                            "disabled:bg-[#148CC7]",
                            "focus-visible:ring-[#7DCEF7]",
                        ],
                        variant === "secondary" && [
                            "bg-secondary-500 text-white",
                            "border border-secondary-600",
                            "hover:bg-secondary-600 hover:text-white",
                            "active:bg-secondary-700",
                            "disabled:bg-secondary-700",
                            "focus-visible:ring-secondary-100",
                        ],
                        variant === "success" && [
                            "bg-green-500 text-white",
                            "border border-green-500",
                            "hover:bg-green-600 hover:text-white",
                            "active:bg-green-700",
                            "disabled:bg-green-700",
                            "focus-visible:ring-green-200",
                        ],
                        variant === "danger" && [
                            "bg-red-500 text-white",
                            "border border-red-600",
                            "hover:bg-red-600 hover:text-white",
                            "active:bg-red-700",
                            "disabled:bg-red-700",
                            "focus-visible:ring-red-200",
                        ],
                        variant === "warning" && [
                            "bg-amber-500 text-white",
                            "border border-amber-500",
                            "hover:bg-amber-600 hover:text-white",
                            "active:bg-amber-700",
                            "disabled:bg-amber-700",
                            "focus-visible:ring-amber-100",
                        ],
                        variant === "outline" && [
                            "text-dark",
                            "border border-gray-300",
                            "hover:bg-light focus-visible:ring-slate-400 active:bg-typo-divider disabled:bg-typo-divider",
                        ],
                        variant === "ghost" && [
                            "text-primary-500",
                            "shadow-none",
                            "hover:bg-primary-50 focus-visible:ring-primary-400 active:bg-primary-100 disabled:bg-primary-100",
                        ],
                        variant === "gray" && [
                            "text-gray-900 bg-gray-200",
                            "shadow-none",
                            "hover:bg-gray-300 focus-visible:ring-primary-400 active:bg-primary-100 disabled:bg-primary-100",
                        ],
                    ],
                    //#endregion  //*======== Variants ===========
                    "disabled:cursor-not-allowed",
                    isLoading &&
                    "relative text-transparent transition-none hover:text-transparent disabled:cursor-wait",
                    className,
                )}
                {...rest}
            >
                {isLoading && (
                    <div
                        className={clsxm(
                            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
                            {
                                "text-white": [
                                    "primary",
                                    "secondary",
                                    "danger",
                                    "warning",
                                ].includes(variant),
                                "text-primary-500": ["outline", "ghost"].includes(variant),
                            },
                        )}
                    >
                        <Loader2 size={18} className="animate-spin" />
                    </div>
                )}
                {LeftIcon && (
                    <div
                        className={clsxm([
                            size === "lg" && "mr-3",
                            size === "base" && "mr-2",
                            size === "sm" && "mr-1",
                        ])}
                    >
                        <LeftIcon
                            size="1em"
                            className={clsxm("text-base", leftIconClassName)}
                        />
                    </div>
                )}
                {children}
                {RightIcon && (
                    <div
                        className={clsxm([
                            size === "lg" && "ml-3",
                            size === "base" && "ml-2",
                            size === "sm" && "ml-1",
                        ])}
                    >
                        <RightIcon
                            size="1em"
                            className={clsxm("text-base", rightIconClassName)}
                        />
                    </div>
                )}
            </button>
        );
    },
);

export default Button;
