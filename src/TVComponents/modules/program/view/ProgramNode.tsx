import { SpatialNavigationNode } from 'react-tv-space-navigation';

import { ProgramInfo } from '../domain/programInfo';
import { Program } from './Program';
import { useDispatch } from 'react-redux';
import { setSelectedDetailHome } from '../../../../../redux/reducers/movieSwimlane';
import React from 'react';

type Props = {
  programInfo: ProgramInfo;
  onSelect?: () => void;
};

export const ProgramNode = ({ programInfo, onSelect }: Props) => {
  const dispatch = useDispatch();
  const _onFocus=()=>{
    dispatch(setSelectedDetailHome(programInfo));
  }
  // console.log('programInfo--',programInfo)
  return (
    <SpatialNavigationNode isFocusable onSelect={onSelect} onFocus={_onFocus}>
      {({ isFocused }) => <Program isFocused={isFocused} programInfo={programInfo} />}
    </SpatialNavigationNode>
  );
};
