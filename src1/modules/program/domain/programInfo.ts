import { ImageSourcePropType } from 'react-native';

export type ProgramInfo = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  description: string;
  mediaUuid:string;
  poster_path:string
};
