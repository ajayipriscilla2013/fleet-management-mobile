import React, { useState, useEffect } from 'react';
import {
	Button,
	Image,
	View,
	StyleSheet,
	ActivityIndicator,
	SafeAreaView,
	Text,
	FlatList
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Ionicons from '@expo/vector-icons/Ionicons';

const imgDir = FileSystem.documentDirectory + 'images/';

const ensureDirExists = async () => {
	const dirInfo = await FileSystem.getInfoAsync(imgDir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
	}
};

// Save image to file system
const saveImage = async (uri: string) => {
	await ensureDirExists();
	const filename = new Date().getTime() + '.jpeg';
	const dest = imgDir + filename;
	await FileSystem.copyAsync({ from: uri, to: dest });
	setImages([...images, dest]);
};

// Upload image to server
const uploadImage = async (uri: string) => {
	setUploading(true);

	await FileSystem.uploadAsync('http://192.168.1.52:8888/upload.php', uri, {
		httpMethod: 'POST',
		uploadType: FileSystem.FileSystemUploadType.MULTIPART,
		fieldName: 'file'
	});

	setUploading(false);
};

// Delete image from file system
const deleteImage = async (uri: string) => {
	await FileSystem.deleteAsync(uri);
	setImages(images.filter((i) => i !== uri));
};

export default function App() {
	const [uploading, setUploading] = useState(false);
	const [images, setImages] = useState<any[]>([]);



	// Load images on startup
	useEffect(() => {
		loadImages();
	}, []);

	// Load images from file system
	const loadImages = async () => {
		await ensureDirExists();
		const files = await FileSystem.readDirectoryAsync(imgDir);
		if (files.length > 0) {
			setImages(files.map((f) => imgDir + f));
		}
	};

	// Select image from library or camera
	const selectImage = async (useLibrary: boolean) => {
		let result;
		const options: ImagePicker.ImagePickerOptions = {
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.75
		};

		if (useLibrary) {
			result = await ImagePicker.launchImageLibraryAsync(options);
		} else {
			await ImagePicker.requestCameraPermissionsAsync();
			result = await ImagePicker.launchCameraAsync(options);
		}

		// Save image if not cancelled
		if (!result.canceled) {
			saveImage(result.assets[0].uri);
		}
	};
}