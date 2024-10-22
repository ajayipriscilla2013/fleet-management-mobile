import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView } from 'react-native';

const CustomModal = ({ 
  visible, 
  onClose, 
  title, 
  message,
  content,
  buttonText = "OK",
  icon,
  buttonColor = "#394F91",
  titleColor = "#394F91",
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-[rgba(0, 0, 0, 0.5)] gap-4">
        <View className='m-5 bg-white rounded-2xl p-9 items-center' style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
          maxWidth: '90%',
          maxHeight: '80%'
        }}>
          <ScrollView>
            {icon && (
              <View className="rounded-full flex items-center justify-center bg-[#EEF0FB] mx-auto w-[84px] h-[84px] mb-4">
                <Image source={icon} />
              </View>
            )}
            <Text className={`font-semibold text-center text-xl text-[${titleColor}] mb-2`}>{title}</Text>
            {message && <Text className="text-primary text-center mb-2">{message}</Text>}
            {content && (
              typeof content === 'string' 
                ? <Text className="text-primary text-center mb-2">{content}</Text>
                : content
            )}
          </ScrollView>
          <TouchableOpacity
            className={`bg-[${buttonColor}] p-4 rounded-lg mt-4 w-full`}
            onPress={onClose}
          >
            <Text className="text-white text-center font-semibold">{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;