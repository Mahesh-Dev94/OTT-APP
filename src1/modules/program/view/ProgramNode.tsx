import { SpatialNavigationFocusableView,SpatialNavigationNodeRef } from 'react-tv-space-navigation';

import { ProgramInfo } from '../domain/programInfo';
import { Program } from './Program';
import { LongProgram } from './LongProgram';
import { forwardRef } from 'react';
// import { SpatialNavigationNodeRef } from '../../../../../lib/src/spatial-navigation/types/SpatialNavigationNodeRef';
import React from 'react';

type Props = {
  programInfo: ProgramInfo;
  onSelect?: () => void;
  onFocus?:()=>void;
  indexRange?: [number, number];
};

export const ProgramNode = forwardRef<SpatialNavigationNodeRef, Props>(
  ({ programInfo, onSelect,onFocus, indexRange }: Props, ref) => {
    return (
      <SpatialNavigationFocusableView
        onSelect={onSelect}
        onFocus={onFocus}
        indexRange={indexRange}
        viewProps={{ accessibilityLabel: programInfo.title }}
        ref={ref}
      >
        {({ isFocused }) => <Program isFocused={isFocused} programInfo={programInfo} />}
      </SpatialNavigationFocusableView>
    );
  },
);
ProgramNode.displayName = 'ProgramNode';

export const LongProgramNode = forwardRef<SpatialNavigationNodeRef, Props>(
  ({ programInfo, onSelect, indexRange }: Props, ref) => {
    return (
      <SpatialNavigationFocusableView
        onSelect={onSelect}
        alignInGrid
        indexRange={indexRange}
        ref={ref}
      >
        {({ isFocused }) => <LongProgram isFocused={isFocused} programInfo={programInfo} />}
      </SpatialNavigationFocusableView>
    );
  },
);
LongProgramNode.displayName = 'LongProgramNode';
