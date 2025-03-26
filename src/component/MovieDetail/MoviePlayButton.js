import React, { Component } from "react";
import PropTypes from "prop-types";
import Modal from "react-native-modal";
import { View, StyleSheet, TouchableWithoutFeedback, Text,TouchableHighlight,Dimensions,Platform } from "react-native";
import { orange, white } from "../../helper/Color";
import {ImageIcon} from '../Icon/icon';
import { normalize } from "../../helper/FontSize";

const {width,height}=Dimensions;

class MoviePlayButton extends Component {
  state = {
    isModalShown: false,
  };

  toggleModal = () => {
    // If you want to be more specific and only detect devices running tvOS
    if(Platform.isTV){
      this.props.navigation.navigate('MoviePlayer');
    }else{
      this.props.navigation.navigate('Player', { id: this.props.videoData.id });
    }
		
  };

  renderPlayButton = () => {
    return (
      <TouchableHighlight
        hasTVPreferredFocus={true}
        tvParallaxProperties={{
          enabled: true,
          shiftDistanceX: 1.9,
          shiftDistanceY: 1.9,
          tiltAngle: 0.05,
          magnification: 1.15,
        }}
        isTVSelectable={true}
        style={{width: width, justifyContent: 'flex-end'}}
        underlayColor={'transparent'}
        onPress={this.toggleModal}>
        <View style={_styles.wrapper}>
          <ImageIcon
            name={'play'}
            size={20}
            color={white}
            style={_styles.icon}
          />
        </View>
      </TouchableHighlight>
    );
  };

  onPressPlay = (key) => {
    this.toggleModal();
    this.props.navigation.navigate("Webview", { id: key });
  };

  videoItem = () => {
    const results = this.props.videoData.results.slice(0, 7);
    return results.map((item) => (
      <View key={item.key} style={{ marginBottom: 8, flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ width: "80%" }}>
          <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 14 }}>{item.name}</Text>
          <Text style={{ fontFamily: "Montserrat-Light", fontSize: 12 }}>{item.type}</Text>
        </View>
        <TouchableWithoutFeedback onPress={() => this.onPressPlay(item.key)}>
          <View style={{ alignSelf: "flex-start", borderRadius: 6, overflow: "hidden" }}>
            <Text style={_styles.playText}>Play</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    ));
  };

  renderModal = () => {
    const { results = [] } = this.props.videoData;

    if (this.state.isModalShown && results.length !== 0) {
      return (
        <Modal
          isVisible={this.state.isModalShown}
          style={{ justifyContent: "flex-end", margin: 0 }}
          swipeDirection={"down"}
          onBackButtonPress={this.toggleModal}
          onBackdropPress={this.toggleModal}
          onSwipeComplete={this.toggleModal}
        >
          <View style={_styles.modalStyle}>
            <View style={_styles.bar} />
            <Text style={_styles.videoText}>Videos</Text>
            {this.videoItem()}
          </View>
        </Modal>
      );
    }
  };

  render() {
    return (
      <View >
        {this.renderPlayButton()}
      </View>
    );
  }
}

export default MoviePlayButton;

MoviePlayButton.propTypes = {
  videoData: PropTypes.object,
  navigation: PropTypes.object,
};

const _styles = StyleSheet.create({
  wrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#3A85BC',
    justifyContent: "center",
    alignSelf: 'center',
  },

  icon: {
    alignSelf: "center",
  },

  modalStyle: {
    backgroundColor: white,
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 48,
    minHeight: "40%",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },

  bar: {
    width: 40,
    height: 5,
    backgroundColor: orange,
    marginBottom: 24,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
  },

  playText: {
    fontFamily: "Montserrat-SemiBold",
    textAlign: "right",
    backgroundColor: orange,
    color: white,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: normalize(1),
  },

  videoText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: normalize(2),
    paddingBottom: 12,
  },
});
