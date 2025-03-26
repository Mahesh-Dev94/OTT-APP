import { MutableRefObject } from 'react';
import { Box } from '../../../design-system/components/Box';
import { Spacer } from '../../../design-system/components/Spacer';
import { Typography } from '../../../design-system/components/Typography';
import { ProgramsRow } from './ProgramList';
import { ProgramsRowVariableSize } from './ProgramListVariableSize';
// import { SpatialNavigationVirtualizedListRef } from '../../../../../lib/src/spatial-navigation/types/SpatialNavigationVirtualizedListRef';
import React from 'react';
import { SpatialNavigationVirtualizedListRef } from 'react-tv-space-navigation';

type Props = {
  title: string;
  listRef?: MutableRefObject<SpatialNavigationVirtualizedListRef>;
  data:[]
};

export const ProgramListWithTitle = ({ title, listRef ,data}: Props) => {
  return (
    <Box direction="vertical">
      <Typography style={{marginLeft:8}} variant="title" fontWeight="strong">
        {title}
      </Typography>
      <Spacer direction="vertical" gap="$2" />
      <ProgramsRow data={data} title={title} listRef={listRef as MutableRefObject<SpatialNavigationVirtualizedListRef>} />
    </Box>
  );
};

export const ProgramListWithTitleAndVariableSizes = ({ title }: Props) => {
  return (
    <Box direction="vertical">
      <Typography variant="title" fontWeight="strong">
        {title}
      </Typography>
      <Spacer direction="vertical" gap="$2" />
      <ProgramsRowVariableSize />
    </Box>
  );
};
