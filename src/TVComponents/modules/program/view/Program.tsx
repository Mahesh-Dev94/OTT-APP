import styled from '@emotion/native';
import React from 'react';
import { Animated, View,Text } from 'react-native';
import { ProgramInfo } from '../domain/programInfo';
import { useFocusAnimation } from '../../../design-system/helpers/useFocusAnimation';
import { useSpatialNavigatorFocusableAccessibilityProps } from 'react-tv-space-navigation';
import { Typography } from '../../../design-system/components/Typography';
import { getImageUrl } from '../../../../api/url';
import { theme } from '../../../design-system/theme/theme';
import Images from '../../../../component/Utils/ImageComponent';

type ProgramProps = {
  isFocused?: boolean;
  programInfo: ProgramInfo;
};

export const Program = React.forwardRef<View, ProgramProps>(
  ({ isFocused = false, programInfo }, ref) => {
    const imageSource =getImageUrl(programInfo.poster_path);    //programInfo.image;;
    const scaleAnimation = useFocusAnimation(isFocused);

    const accessibilityProps = useSpatialNavigatorFocusableAccessibilityProps();

    return (
      <>
      <ProgramContainer
        // style={scaleAnimation} // Apply the animated scale transform
        ref={ref}
        isFocused={isFocused}
        programInfo={programInfo}
        {...accessibilityProps}
      >
         {/* <ProgramImageWrapper> */}
        <ProgramImage isFocused={isFocused} source={imageSource} resizeMode={undefined} style={undefined} />
        {/* </ProgramImageWrapper> */}

      </ProgramContainer>
      {/* {!isFocused &&  */}
      <Typography width={theme.sizes.program.portrait.width} numberOfLines={1} variant="body" fontWeight="regular" >
       {programInfo.title}
       </Typography>
       {/* } */}

       </>
    );
  },
);

Program.displayName = 'Program';

const ProgramContainer = styled(Animated.View)<{ isFocused: boolean,programInfo:ProgramInfo }>(({ isFocused, theme,programInfo }) => ({
  height: programInfo.mediaUuid ? theme.sizes.program.portrait.height :theme.sizes.program.portrait.width,
  width: theme.sizes.program.portrait.width,
  overflow: 'hidden',
  borderRadius: programInfo.mediaUuid ?  20 :theme.sizes.program.portrait.width,
  borderColor: isFocused ? theme.colors.primary.light : 'transparent',
  borderWidth: 3,
  marginBottom:5
}));

const ProgramImageWrapper = styled.View({
  flex: 1,
  // borderRadius: 20,
  overflow: 'hidden',
});

const ProgramImage = styled(Images)<{ isFocused: boolean }>(() =>({
  height:'100%',    //isFocused ? '100%':'90%',
  width: '100%',
  flex:1,
}));
