
import ImageColors from 'react-native-image-colors'
import { Platform } from "react-native";

export const MovieTypes = ["Popular", "Top Rated", "Must Watch", "Upcoming"];
export const circleRadiusHeight = 43
let global = {
  id: null
};

export const id_Get = () => {
  return global.id;
};

export const id_Set = Id => {
  global.id = Id;
};



//get primary color of the given image url
export const imgBGPrimaryColor = async (url) => {

  // try {
  //   const result = await ImageColors.getColors(url, {
  //     fallback: '#4d5152',
  //     cache: false,
  //     key: url,
  //   })
  //   switch (result.platform) {
  //     case 'android':
  //       // android result properties
  //       console.log('image color android result------',result)
  //       const vibrantColor =result.vibrant;
  //        return  vibrantColor;      
  //       break
  //     case 'web':
  //       // web result properties
  //       console.log('image color web result------',result)
  //       const lightVibrantColor =result.lightVibrant;
  //       return  lightVibrantColor ;     

  //       break
  //     case 'ios':
  //       // iOS result properties
  //       // Thismis not stable for TVOS so I have used workaround here, this will change later
  //       let primaryColor=''
  //       if (Platform.isTV){
  //          primaryColor =result.primary
  //       }else{
  //         primaryColor=result.secondary
  //       }

  //      console.log('image color ios Mobile TV result------',result)
  //      return primaryColor;

  //       break
  //     default:
  //       throw new Error('Unexpected platform key')
  //   }

  return '#000000'
  // } catch (e) {
  //   throw e;
  // }
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

//Get the invert color which is better according to bg color
export const invertColor = (hex, bw) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
  // invert color components
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

