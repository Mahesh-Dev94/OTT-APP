import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableHighlight,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

import {getImageUrl} from '../../api/url';
import {Styles} from './Styles';
import Images from '../Utils/ImageComponent';
class MovieImages extends Component {
  constructor(props) {
    super(props);
    this.images = this.props.images.backdrops;
    this.state = {
      isShowModal: false,
      imageModalIndex: 0,
    };
  }

  onPressImage = (index = 0) => {
    this.setState(prevState => ({
      isShowModal: !prevState.isShowModal,
      imageModalIndex: index,
    }));
  };

  modalImage = () => {
    const {isShowModal, imageModalIndex} = this.state;
    const imagefull = this.modalImagesUrl();

    return (
      <Modal visible={isShowModal} transparent={true}>
        <ImageViewer
          imageUrls={imagefull}
          onCancel={this.onPressImage}
          enableSwipeDown
          index={imageModalIndex}
        />
      </Modal>
    );
  };

  modalImagesUrl = () => {
    const imagefull = this.images.map(item => {
      const imageurl = getImageUrl(item.file_path, 'url', 'original');
      return {...imageurl, ...{width: item.width, height: item.height}};
    });
    return imagefull;
  };

  render() {
    if (this.images.length === 0) {
      return null;
    }
    return (
      <View>
        <Text style={Styles.titleText}>Images</Text>
        <FlatList
          keyExtractor={item => item.file_path}
          data={this.images}
          renderItem={({item, index}) =>
            imageComponent(item, index, this.onPressImage)
          }
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        {this.modalImage()}
      </View>
    );
  }
}

const imageComponent = (data, index, onPress) => {
  const imageUrl = getImageUrl(data.file_path, 'uri', 'w300');
  const style = {...Styles.movieImages, ...{width: 120 * data.aspect_ratio}};

  return (
    <TouchableHighlight
      hasTVPreferredFocus={true}
      tvParallaxProperties={{
        enabled: true,
        shiftDistanceX: 1.5,
        shiftDistanceY: 1.5,
        tiltAngle: 0.01,
        magnification: 1.09,
      }}
      isTVSelectable={true}
      underlayColor={'transparent'}
      onPress={() => onPress(index)}
      style={[style, Styles.imagePlaceholder, {margin: 10}]}>
      <Images source={imageUrl} style={style} />
    </TouchableHighlight>
  );
};

export default MovieImages;

MovieImages.propTypes = {
  images: PropTypes.object,
};
