import {StyleSheet,Text,TextInput,TouchableOpacity,View,} from "react-native";
  import PropTypes from "prop-types";
  import React from "react";
  
  const ToolbarButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.button}>{title}</Text>
    </TouchableOpacity>
  );
  
  ToolbarButton.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  };
  
  export default class Toolbar extends React.Component {
    static propTypes = {
      isFocused: PropTypes.bool.isRequired, // Determines focus state of TextInput
      onChangeFocus: PropTypes.func,
      onSubmit: PropTypes.func,
      onPressCamera: PropTypes.func,
      onPressLocation: PropTypes.func,
    };
  
    static defaultProps = {
      onChangeFocus: () => {},
      onSubmit: () => {},
      onPressCamera: () => {},
      onPressLocation: () => {},
    };
  
    constructor(props) {
      super(props);
      this.input = null; // Store reference to TextInput
      this.state = {
        text: "",
      };
    }
  
    // Capture reference to TextInput
    setInputRef = (ref) => {
      this.input = ref;
    };
  
    // React to changes in isFocused prop
    componentDidUpdate(prevProps) {
      if (prevProps.isFocused !== this.props.isFocused) {
        if (this.props.isFocused) {
          this.input.focus();
        } else {
          this.input.blur();
        }
      }
    }
  
    handleFocus = () => {
      const { onChangeFocus } = this.props;
      onChangeFocus(true); // Notify parent that TextInput is focused
    };
  
    handleBlur = () => {
      const { onChangeFocus } = this.props;
      onChangeFocus(false); // Notify parent that TextInput lost focus
    };
  
    handleChangeText = (text) => {
      this.setState({ text });
    };
  
    handleSubmitEditing = () => {
      const { onSubmit } = this.props;
      const { text } = this.state;
  
      if (text.trim()) {
        onSubmit(text); // Pass submitted text to parent
        this.setState({ text: "" }); // Clear the TextInput
      }
    };
  
    render() {
      const { onPressCamera, onPressLocation } = this.props;
      const { text } = this.state;
  
      return (
        <View style={styles.toolbar}>
          <ToolbarButton title="📷" onPress={onPressCamera} />
          <ToolbarButton title="📍" onPress={onPressLocation} />
          <TextInput
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder="Type something!"
            blurOnSubmit={false} // Prevent automatic keyboard dismissal on submit
            value={text}
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSubmitEditing}
            ref={this.setInputRef} // Set reference to this.input
            onFocus={this.handleFocus} // Notify parent of focus state
            onBlur={this.handleBlur} // Notify parent of blur state
          />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    toolbar: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 10,
      paddingLeft: 16,
      backgroundColor: "white",
      borderTopWidth: 1,
      borderTopColor: "#ccc",
    },
    button: {
      marginRight: 12,
      fontSize: 20,
      color: "black",
    },
    input: {
      flex: 1,
      fontSize: 18,
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 20,
      paddingHorizontal: 10,
      marginLeft: 10,
      backgroundColor: "grey",
    },
  });
  