import { scaledPixels } from '../helpers/scaledPixels';

export const sizes = {
  program: {
    landscape: { width: scaledPixels(250), height: scaledPixels(200) },
    portrait: { width: scaledPixels(280), height: scaledPixels(380) },
  },
  menu: {
    open: scaledPixels(190),
    closed: scaledPixels(90),
  },
};
