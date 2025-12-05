import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Loader = ({ className, size = "md" }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <div
        className={cn(
          "rounded-full border-primary border-t-transparent animate-spin",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export { Loader };
