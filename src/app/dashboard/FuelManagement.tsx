import React from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

const fuelFormSchema = z.object({
  tankLevel: z.string().min(1, "Tank Level is required"),
  mileage: z.string().min(1, "Mileage is required"),
  litresOfFuel: z.string().min(1, "Litres of Fuel is required"),
  nairaAmount: z.string().min(1, "Naira Amount is required"),
});

type FuelFormData = z.infer<typeof fuelFormSchema>;

const FuelManagement = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FuelFormData>({
    resolver: zodResolver(fuelFormSchema),
  });

  const onSubmit = (data: FuelFormData) => {
    console.log("Form data:", data);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ScrollView
        className="w-full m-0 p-0 flex-co "
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          paddingHorizontal: 0,
          marginHorizontal: 0,
        }}
        // contentContainerStyle={{ paddingHorizontal: 16, flexGrow: 1 }}
        // keyboardShouldPersistTaps="handled"
      >
        <View className="w-[90%] bg-white p-4 rounded-xl">
          <Controller
            control={control}
            name="tankLevel"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Tank Level on Arrival"
                placeholder="Enter Tank Level"
                className="py-2"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.tankLevel?.message as string}
              />
            )}
          />

          <Controller
            control={control}
            name="mileage"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mileage"
                placeholder="Enter Mileage"
                className="py-2"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.mileage?.message as string}
              />
            )}
          />

          <Controller
            control={control}
            name="litresOfFuel"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Litres of Fuel Bought"
                placeholder="Enter Litres of Fuel"
                className="py-2"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.litresOfFuel?.message as string}
              />
            )}
          />

          <Controller
            control={control}
            name="nairaAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Naira Amount"
                placeholder="Enter Naira Amount"
                className="py-2"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.nairaAmount?.message as string}
              />
            )}
          />
        </View>

        <Button
          label="Submit"
          className=" my-4 bg-[#3A5092] w-[90%]"
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default FuelManagement;
