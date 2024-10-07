import { Input } from "@/components/Input";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Zod schema for validation
const changePasswordSchema = z.object({
  currentPassword: z.string().min(3, "Password must be at least 3 characters long"),
  newPassword: z.string().min(3, "New password must be at least 3 characters long"),
  confirmNewPassword: z.string().min(3, "Confirm password must be at least 3 characters long"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  path: ["confirmNewPassword"],
  message: "Passwords do not match",
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// API request to change password
const changePassword = async (data: ChangePasswordFormData) => {
  const response = await axios.post('/api/change-password', data);
  return response.data;
};

// Change Password Screen Component
const ChangePasswordScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  // useMutation with an object configuration
  const mutation = useMutation({
    mutationFn: changePassword, // Function making the API call
    onSuccess: (response) => {
      if (response.status === 200) {
        console.log('Password updated successfully');
        // Handle success (e.g., navigate, show success message)
      }
    },
    onError: (error: any) => {
      const serverError = error?.response?.data?.message || 'An error occurred while updating password.';
      setErrorMessage(serverError); // Set the server error message
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    mutation.mutate(data);
  };

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <Text className="text-xl font-bold">Change Password</Text>
      </View>

      <Text className="text-base mb-4">
        Provide your current password to change the password successfully
      </Text>

      {/* Error Message */}
      {errorMessage ? (
        <Text className="text-red-500 mb-4">{errorMessage}</Text>
      ) : null}

      {/* Current Password Input */}
      <View className="mb-4">
        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, onBlur, value } }) => (
         
              <Input
                label="Current Password"
                placeholder="********"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.currentPassword?.message as string}
            
              />
           
          )}
        />
        {/* <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="flex-row justify-end"
        >
          <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="black" />
        </TouchableOpacity> */}
      </View>

      {/* New Password Input */}
      <View className="mb-8">
        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, onBlur, value } }) => (
      
              <Input
                label="New Password"
                placeholder="********"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.newPassword?.message as string}
                
              />

          )}
        />
        {/* <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="flex-row justify-end"
        >
          <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="black" />
        </TouchableOpacity> */}
      </View>

      {/* Confirm New Password Input */}
      <View className="mb-8">
        <Controller
          control={control}
          name="confirmNewPassword"
          render={({ field: { onChange, onBlur, value } }) => (
           
              <Input
                label="Confirm New Password"
                placeholder="********"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.confirmNewPassword?.message as string}
              />
           
          )}
        />
        {/* <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="flex-row justify-end"
        >
          <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="black" />
        </TouchableOpacity> */}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-[#394F91] p-4 rounded-lg mb-4"
        onPress={handleSubmit(onSubmit)}
      >
        <Text className="text-white text-center font-bold">Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;