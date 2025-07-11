import { type VariantProps, cva } from "class-variance-authority";
import { Text, View, ViewStyle, TextStyle, StyleProp, TextProps } from "react-native";

import { cn } from "../lib/utils";

// Define your badge variants
const badgeVariants = cva(
  "flex flex-row items-center rounded-full px-2 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        success: "bg-green-500 dark:bg-green-700",
        initiated: "bg-[#FFD9644D]",
        inprogress:"bg-[#394F911A]",
        delivered:"bg-[##18BB0C1A]"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeTextVariants = cva("font-medium text-xs", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      success: "text-green-100",
      initiated: "text-[#E6B432]",
      inprogress:"text-[#394F91]",
      delivered:"text-[#18BB0C]"
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Define the BadgeProps interface
export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof View>,
    VariantProps<typeof badgeVariants> {
  label: string;
  labelClasses?: string;
  icon?: React.ReactNode; // New prop for the icon
  iconStyle?: StyleProp<ViewStyle>; // Optional style for the icon
  labelStyle?: StyleProp<TextStyle>; // Optional style for the label
}

// Update the Badge component
function Badge({
  label,
  labelClasses,
  icon,
  iconStyle,
  labelStyle,
  className,
  variant,
  ...props
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <View style={iconStyle}>{icon}</View>}
      <Text className={cn(badgeTextVariants({ variant }), labelClasses)} style={labelStyle}>
        {label}
      </Text>
    </View>
  );
}

export { Badge, badgeVariants };