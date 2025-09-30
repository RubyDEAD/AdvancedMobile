import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  Image,
} from "react-native";
import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import HeaderBar from "./HeadBar";
import { TextStyle } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const FloatingInput = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
  error,
  setError,
  validator,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  error?: string;
  setError: (err?: string) => void;
  validator?: (text: string) => string | undefined;
}) => {
  const theme = useSelector((state: RootState) => state.theme);
  const [isFocused, setIsFocused] = useState(false);

  const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedLabel, {
      toValue: isFocused || value ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  React.useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const handleChange = (text: string) => {
    onChangeText(text);
    if (validator) {
      setError(validator(text));
    }
  };

  const labelStyle: Animated.WithAnimatedObject<TextStyle> = {
    position: "absolute",
    left: 14,
    top: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 8],
    }),
    fontSize: animatedLabel.interpolate({
      inputRange: [0, 1],
      outputRange: [15, 12],
    }),
    color: isFocused ? theme.accentColor : theme.accentColor,
    fontWeight: "500",
    zIndex: 1,
    backgroundColor: theme.mode,
    paddingHorizontal: 4,
  };

  return (
    <Animated.View
      style={[
        { marginTop: 18 },
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      <View
        style={[
          styles(theme).inputContainer,
          error ? styles(theme).errorInput : {},
        ]}
      >
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          style={styles(theme).input}
          value={value}
          onChangeText={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          placeholder=""
          placeholderTextColor="transparent"
          selectionColor={theme.accentColor}
        />
        {isFocused && <View style={styles(theme).focusLine} />}
      </View>
      {error && (
        <View style={styles(theme).errorContainer}>
          <Text style={styles(theme).errorText}>⚠️ {error}</Text>
        </View>
      )}
    </Animated.View>
  );
};

export default function Profile() {
  const theme = useSelector((state: RootState) => state.theme);

  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@gmail.com");
  const [phone, setPhone] = useState("+1 234 567 8901");
  const [address, setAddress] = useState("123 Main St, City, Country");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }>({});

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "We need access to your photos to set a profile picture."
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const saveProfile = () => {
    if (Object.values(errors).some((e) => e)) {
      Alert.alert("Fix Errors", "Please correct the highlighted fields.");
      return;
    }

    Alert.alert("Success! 🎉", "Profile updated successfully!");
  };

  return (
    <SafeAreaView style={styles(theme).safe}>
      <HeaderBar />

      <TouchableOpacity style={styles(theme).profile_pic} onPress={pickImage}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles(theme).image} />
        ) : (
          <View style={styles(theme).placeholderContainer}>
            <Text style={styles(theme).placeholderIcon}>📷</Text>
            <Text style={styles(theme).placeholderText}>Upload Image</Text>
          </View>
        )}
        <View style={styles(theme).cameraOverlay}>
          <Text style={styles(theme).cameraIcon}>📸</Text>
        </View>
      </TouchableOpacity>

      {/* Full Name */}
      <FloatingInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        setError={(err) => setErrors((prev) => ({ ...prev, name: err }))}
        validator={(text) =>
          /^[A-Za-z\s]+$/.test(text) ? undefined : "Invalid Full Name"
        }
      />

      {/* Email */}
      <FloatingInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={errors.email}
        setError={(err) => setErrors((prev) => ({ ...prev, email: err }))}
        validator={(text) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
            ? undefined
            : "Invalid Email Address"
        }
      />

      {/* Phone */}
      <FloatingInput
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        error={errors.phone}
        setError={(err) => setErrors((prev) => ({ ...prev, phone: err }))}
        validator={(text) =>
          /^\+?[0-9\s\-]{7,15}$/.test(text) ? undefined : "Invalid Phone Number"
        }
      />

      {/* Address */}
      <FloatingInput
        label="Address"
        value={address}
        onChangeText={setAddress}
        error={errors.address}
        setError={(err) => setErrors((prev) => ({ ...prev, address: err }))}
        validator={(text) =>
          text.trim().length >= 5 ? undefined : "Invalid Address"
        }
      />

      <TouchableOpacity style={styles(theme).saveBtn} onPress={saveProfile}>
        <View style={styles(theme).saveButtonContent}>
          <Text style={styles(theme).saveText}>Save Profile</Text>
          <Text style={styles(theme).saveIcon}>✨</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// ✅ clean styles
const styles = (theme: any) => {
  const palette =
    theme.mode === "light"
      ? {
          background: "#FFFFFF",
          card: "#F5F5F5",
          text: "#1A1A1A",
          textSecondary: "#666",
          border: "#DDD",
          buttonText: "#FFFFFF",
        }
      : {
          background: "#121212",
          card: "#1E1E1E",
          text: "#FFFFFF",
          textSecondary: "#AAA",
          border: "#333",
          buttonText: "#FFFFFF",
        };

  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: palette.background,
      padding: 20,
    },
    profile_pic: {
      width: 160,
      height: 160,
      borderRadius: 80,
      alignSelf: "center",
      marginTop: 15,
      marginBottom: 25,
      backgroundColor: palette.card,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderWidth: 2,
      borderColor: theme.accentColor,
      position: "relative",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    placeholderContainer: {
      alignItems: "center",
    },
    placeholderIcon: {
      fontSize: 32,
      marginBottom: 6,
    },
    placeholderText: {
      textAlign: "center",
      color: palette.textSecondary,
      fontSize: 12,
      fontWeight: "500",
    },
    cameraOverlay: {
      position: "absolute",
      bottom: 8,
      right: 8,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.accentColor,
      justifyContent: "center",
      alignItems: "center",
    },
    cameraIcon: {
      fontSize: 14,
      color: palette.buttonText,
    },
    inputContainer: {
      backgroundColor: palette.card,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: palette.border,
      paddingHorizontal: 14,
      paddingVertical: 8,
      position: "relative",
      minHeight: 56,
    },
    input: {
      color: palette.text,
      fontSize: 15,
      fontWeight: "400",
      paddingTop: 24,
      paddingBottom: 8,
      minHeight: 40,
      textAlignVertical: "center",
    },
    focusLine: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: theme.accentColor,
      borderRadius: 1,
    },
    errorInput: {
      borderColor: "#FF6B6B",
      borderWidth: 1.5,
    },
    errorContainer: {
      marginTop: 6,
      marginLeft: 4,
    },
    errorText: {
      color: "#FF6B6B",
      fontSize: 12,
      fontWeight: "500",
    },
    saveBtn: {
      marginTop: 30,
      borderRadius: 14,
      backgroundColor: theme.accentColor,
      overflow: "hidden",
    },
    saveButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    },
    saveText: {
      color: palette.buttonText,
      fontWeight: "bold",
      fontSize: 16,
      marginRight: 6,
    },
    saveIcon: {
      fontSize: 16,
    },
  });
};
