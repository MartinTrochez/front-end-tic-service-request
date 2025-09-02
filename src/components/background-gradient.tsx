import { cn } from "@/lib/utils";

export const BackgroundGradient = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[#2567E8] to-[#1CE6DA]",
        className
      )}
      {...props}
    />
  );
};
