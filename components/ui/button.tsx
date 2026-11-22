import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-[#7A1D2E] text-white hover:bg-[#661423] shadow-md shadow-[#7A1D2E]/20',
        forest:
          'bg-[#7A1D2E] text-white hover:bg-[#661423] shadow-md shadow-[#7A1D2E]/20',
        pink:
          'bg-[#7A1D2E] text-white hover:bg-[#661423] shadow-md shadow-[#7A1D2E]/20',
        purple:
          'bg-[#801D30] text-white hover:bg-[#6E1826] shadow-md shadow-[#801D30]/20',
        sage:
          'bg-[#801D30] text-white hover:bg-[#6E1826] shadow-md shadow-[#801D30]/20',
        coral:
          'bg-[#7A1D2E] text-white hover:bg-[#661423] shadow-md shadow-[#7A1D2E]/20',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
        outline:
          'border border-[#F2E2DD] bg-white text-[#361118] hover:bg-[#FAF4F0] hover:border-[#7A1D2E]/40 shadow-xs',
        outlineForest:
          'border-2 border-[#7A1D2E] bg-transparent text-[#7A1D2E] hover:bg-[#7A1D2E] hover:text-white',
        secondary:
          'bg-[#FCEEEB] text-[#7A1D2E] hover:bg-[#F8DDD7] font-bold',
        ghost:
          'hover:bg-[#FCEEEB]/70 text-[#361118] hover:text-[#7A1D2E]',
        link:
          'text-[#7A1D2E] underline-offset-4 hover:underline p-0 h-auto font-medium',
        pcos:
          'bg-[#7A1D2E] text-white hover:bg-[#661423] shadow-md',
        teal:
          'bg-[#801D30] text-white hover:bg-[#6E1826] shadow-sm',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-3.5 text-xs',
        lg: 'h-13 px-8 text-base shadow-lg',
        icon: 'h-10 w-10 p-0 rounded-full',
        pill: 'h-12 px-6 rounded-full text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
