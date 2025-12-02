import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { ReactNode, Children, cloneElement, isValidElement } from "react";

interface StaggeredAnimationProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
}

export const StaggeredAnimation = ({
  children,
  className = "",
  staggerDelay = 100,
  baseDelay = 0,
}: StaggeredAnimationProps) => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const delay = baseDelay + index * staggerDelay;

        return (
          <div
            className={`transition-all duration-500 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: isVisible ? `${delay}ms` : "0ms",
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
