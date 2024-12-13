import React from "react";
import { View, FlatList, Text, StyleSheet, Image, Modal, TouchableOpacity, Alert } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Toolbar from "C:/Users/Peter Escalicas/Desktop/EMETECH 11.1/messaging-app/components/Toolbar";

export default class App extends React.Component {
  state = {
    messages: [
      { id: "1", type: "text", text: "Hello", sender: "user" },
      { id: "2", type: "text", text: "World", sender: "user" },
    ],
    isInputFocused: false,
    isModalVisible: false,
    modalContent: null, // To store the content being viewed in fullscreen (image or map)
  };

  handlePressToolbarCamera = () => {
    this.addMessage({
      id: String(this.state.messages.length + 1),
      type: "image",
      uri: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/12/spider-man-across-the-spider-verse-miles-morales-gwen-stacy-header.jpg", // Replace with actual image capture functionality
    });
  };

  handlePressToolbarLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to send location messages.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      this.addMessage({
        id: String(this.state.messages.length + 1),
        type: "location",
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Error fetching location: ", error);
      Alert.alert("Error", "Unable to fetch location. Please try again.");
    }
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleSubmit = (text) => {
    if (text.trim()) {
      this.addMessage({ id: String(this.state.messages.length + 1), type: "text", text });
    }
  };

  addMessage = (message) => {
    this.setState((prevState) => ({
      messages: [message, ...prevState.messages],
    }));
  };

  handleMessagePress = (message) => {
    if (message.type === "image") {
      this.setState({
        isModalVisible: true,
        modalContent: <Image source={{ uri: message.uri }} style={styles.modalImage} />,
      });
    } else if (message.type === "location") {
      this.setState({
        isModalVisible: true,
        modalContent: (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: message.latitude,
              longitude: message.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude: message.latitude, longitude: message.longitude }} />
          </MapView>
        ),
      });
    }
  };

  closeModal = () => {
    this.setState({
      isModalVisible: false,
      modalContent: null,
    });
  };

  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  renderMessage = ({ item }) => {
    if (item.type === "text") {
      return (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
      );
    } else if (item.type === "image" || item.type === "location") {
      return (
        <TouchableOpacity onPress={() => this.handleMessagePress(item)}>
          {item.type === "image" ? (
            <Image source={{ uri: item.uri }} style={styles.messageImage} />
          ) : (
            <View style={styles.locationMessageContainer}>
              <Text style={styles.messageText}>
                View location at: {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      );
    }
    return null;
  };

  render() {
    const { messages, isModalVisible, modalContent } = this.state;

    return (
      <View style={styles.container}>
        {/* Full-Screen Modal for Images or Maps */}
        <Modal visible={isModalVisible} transparent={true} onRequestClose={this.closeModal}>
          <View style={styles.modalContainer}>
            {modalContent}
            <TouchableOpacity onPress={this.closeModal} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Message List */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={this.renderMessage}
          contentContainerStyle={styles.messageList}
          inverted // Show the most recent messages at the bottom
        />

        {/* Toolbar */}
        {this.renderToolbar()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  messageList: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  locationMessageContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    maxWidth: "75%",
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: "90%",
    height: "70%",
    resizeMode: "contain",
  },
  map: {
    width: "90%",
    height: "70%",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  modalCloseText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
