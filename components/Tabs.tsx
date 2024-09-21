import { createContext, useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { cn } from "../lib/utils";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}
const TabsContext = createContext<TabsContextProps>({
  activeTab: "",
  setActiveTab: () => {},
});

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}
function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) {
  return (
    <View
      className={cn(
        "flex-row px-6 gap-2 justify-start bg-white py-[6.5px]", // Similar to your filter button container
        className
      )}
      {...props}
    />
  );
}

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  value: string;
  title: string;
  textClasses?: string;
}
function TabsTrigger({
  value,
  title,
  className,
  textClasses,
  ...props
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext);

  return (
    <TouchableOpacity
      className={cn(
        "px-4 py-2 rounded-lg", // Shared styles
        activeTab === value ? "bg-[#394F91]" : "bg-gray-200", // Active and Inactive background colors
        className
      )}
      onPress={() => setActiveTab(value)}
      {...props}
    >
      <Text
        className={cn(
          "text-center", // Shared styles for text
          activeTab === value ? "text-white" : "text-gray-700", // Active and Inactive text colors
          textClasses
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof View> {
  value: string;
}
function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { activeTab } = useContext(TabsContext);

  if (value === activeTab)
    return (
      <View
        className={cn(
          // border border-border
          " mt-2 px-4 py-4 rounded-xl",
          className
        )}
        {...props}
      />
    );

  return null;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
