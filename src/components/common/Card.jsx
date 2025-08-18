
export function Card({ children, className = "", onClick = null }) {
    return (
        <div onClick={onClick}
            className={`rounded-2xl shadow-md border border-gray-200 bg-white ${className}`}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }) {
    return (
        <div className={`p-4 border-b border-gray-100 font-semibold ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = "" }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
    return (
        <div className={`p-4 border-t border-gray-100 text-sm text-gray-600 ${className}`}>
            {children}
        </div>
    );
}

export function Button({
    children,
    className = "",
    variant = "default",
    size = "md",
    ...props
}) {
    const base =
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
