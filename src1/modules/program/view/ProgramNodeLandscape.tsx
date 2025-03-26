import { SpatialNavigationFocusableView } from 'react-tv-space-navigation';

import { ProgramInfo } from '../domain/programInfo';
import { ProgramLandscape } from './ProgramLandscape';
import React from 'react';

type Props = {
  programInfo: ProgramInfo;
  onSelect?: () => void;
};

export const ProgramNodeLandscape = ({ programInfo, onSelect }: Props) => {
  return (
    <SpatialNavigationFocusableView onSelect={onSelect}>
      {({ isFocused }) => <ProgramLandscape isFocused={isFocused} programInfo={programInfo} />}
    </SpatialNavigationFocusableView>
  );
};
