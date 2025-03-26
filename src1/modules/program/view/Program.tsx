import styled from '@emotion/native';
import React from 'react';
import {Animated, Image, View} from 'react-native';
import {ProgramInfo} from '../domain/programInfo';
import {useFocusAnimation} from '../../../design-system/helpers/useFocusAnimation';
import {getImageUrl} from '../../../../src/api/url';
import {Typography} from '../../../design-system/components/Typography';
import {theme} from '../../../design-system/theme/theme';

type ProgramProps = {
  isFocused?: boolean;
  programInfo: ProgramInfo;
};

export const Program = React.forwardRef<View, ProgramProps>(
  ({isFocused = false, programInfo}, ref) => {
    // const imageSource = programInfo.image;
    const imageSource = getImageUrl(programInfo.poster_path);

    // const scaleAnimation = useFocusAnimation(isFocused);

    return (
      <View style={{paddingBottom:15}}>
      <ProgramContainer
        // style={scaleAnimation} // Apply the animated scale transform
        ref={ref}
        isFocused={isFocused}
        programInfo={programInfo}>
        <ProgramImage source={imageSource} accessible />
        {/* <Typography  variant = 'body'
  fontWeight = 'regular'>

  </Typography> */}
      
      </ProgramContainer>
      <Typography
          style={{
            width:theme.sizes.program.portrait.width,
            marginLeft:programInfo.mediaUuid ?0:15
            // marginBottom:10,backgroundColor:'red'
          }}
          numberOfLines={1}
          variant="body"
          fontWeight="regular">
          {programInfo.title}
        </Typography>
        </View>
    );
  },
);

Program.displayName = 'Program';

const ProgramContainer = styled(Animated.View)<{
  isFocused: boolean;
  programInfo: ProgramInfo;
}>(({isFocused, theme, programInfo}) => ({
  // height: theme.sizes.program.portrait.height,
  // width: theme.sizes.program.portrait.width,
  height: programInfo.mediaUuid
    ? theme.sizes.program.portrait.height
    : theme.sizes.program.portrait.width,
  width: theme.sizes.program.portrait.width,
  overflow: 'hidden',
  borderRadius:programInfo.mediaUuid? 20:theme.sizes.program.portrait.width,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 3,
  cursor: 'pointer',
  marginBottom:3
}));

const ProgramImage = styled(Image)({
  height: '100%',
  width: '100%',
});
