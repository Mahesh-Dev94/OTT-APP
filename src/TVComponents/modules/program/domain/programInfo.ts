import { type } from 'os';
import { ImageSourcePropType } from 'react-native';

export type ProgramInfo = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  description: string;
  poster_path:string;
  mediaUuid:string;
};

export type ProgramInfo1 = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  description: string;
};

export type PlayerInfo={
   isLive: boolean ,
    url: string,
    liveData: object,
}