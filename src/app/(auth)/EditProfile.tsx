import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/src/context/AuthContext';
import { Input } from '@/components/Input';

// Validation Schema using zod
const editProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

const EditProfileScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });
  const { updateUserProfile } = useAuth(); // Assuming updateUserProfile function in AuthContext
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mutation for updating profile
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: () => {
      console.log('Profile updated successfully');
    },
    onError: (error: any) => {
      const serverError = error?.response?.data?.message || 'An error occurred while updating profile.';
      setErrorMessage(serverError);
    },
  });

  // Form submit handler
  const handleUpdateProfile: SubmitHandler<EditProfileFormData> = (data) => {
    setErrorMessage(null); // Clear previous errors
    mutation.mutate(data); // Trigger the mutation to update profile
  };

  return (
    <ScrollView className="flex-1 bg-[#F9F9F9] p-4">
      

      <View className="items-center mb-6">
        <View className="w-24 h-24 rounded-full bg-gray-300 justify-center items-center">
          <Text className="text-gray-500">Photo</Text>
        </View>
        <TouchableOpacity className="mt-2">
          <Text className="text-blue-600">Change Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Error Message Display */}
      {errorMessage && <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>}

      {/* First Name */}
      <View className="mb-4">
        <Text className="text-base mb-1">First Name</Text>
        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              className="bg-white"
              placeholder="Enter First Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // style={{ borderColor: errors.firstName ? 'red' : '#E5E7EB' }}
            />
          )}
        />
        {errors.firstName && <Text style={{ color: 'red' }}>{errors.firstName.message}</Text>}
      </View>

      {/* Last Name */}
      <View className="mb-4">
        <Text className="text-base mb-1">Last Name</Text>
        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
            className="bg-white"
              // className="border border-gray-400 rounded p-2"
              placeholder="Enter Last Name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // style={{ borderColor: errors.lastName ? 'red' : '#E5E7EB' }}
            />
          )}
        />
        {errors.lastName && <Text style={{ color: 'red' }}>{errors.lastName.message}</Text>}
      </View>

      {/* Username */}
      <View className="mb-4">
        <Text className="text-base mb-1">Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
            className="bg-white"
              // className="border border-gray-400 rounded p-2"
              placeholder="Enter Username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // style={{ borderColor: errors.username ? 'red' : '#E5E7EB' }}
            />
          )}
        />
        {errors.username && <Text style={{ color: 'red' }}>{errors.username.message}</Text>}
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-base mb-1">Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
            className="bg-white"
              // className="border border-gray-400 rounded p-2"
              placeholder="Enter Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              // style={{ borderColor: errors.email ? 'red' : '#E5E7EB' }}
            />
          )}
        />
        {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
      </View>

      {/* Phone Number */}
      <View className="mb-4">
        <Text className="text-base mb-1">Phone Number</Text>
        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
            className="bg-white"
              // className="border border-gray-400 rounded p-2"
              placeholder="Enter Phone Number"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="phone-pad"
              // style={{ borderColor: errors.phoneNumber ? 'red' : '#E5E7EB' }}
            />
          )}
        />
        {errors.phoneNumber && <Text style={{ color: 'red' }}>{errors.phoneNumber.message}</Text>}
      </View>

      {/* Address */}
      <View className="mb-6">
        <Text className="text-base mb-1">Address</Text>
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
            className="bg-white"
              // className="border border-gray-400 rounded p-2"
              placeholder="Enter Address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              // style={{ borderColor: errors.address ? 'red' : '#E5E7EB' }}
            />
          )}
        />
        {errors.address && <Text style={{ color: 'red' }}>{errors.address.message}</Text>}
      </View>

      {/* Update Button with Loading Indicator */}
      <TouchableOpacity
       className="bg-[#394F91] p-4 rounded-lg mb-4"
        onPress={handleSubmit(handleUpdateProfile)}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text className="text-white text-center font-bold">Update Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;