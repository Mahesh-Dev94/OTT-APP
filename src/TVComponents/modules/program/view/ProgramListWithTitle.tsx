import React from 'react';
import { Box } from '../../../design-system/components/Box';
import { Spacer } from '../../../design-system/components/Spacer';
import { Typography } from '../../../design-system/components/Typography';
import { ProgramsRow } from './ProgramList';

type Props = {
  title: string;
  data:[]
};

export const ProgramListWithTitle = ({ title ,data}: Props) => {
  return (
    <Box direction="vertical">
      <Typography variant="title" fontWeight="strong">
        {title}
      </Typography>
      <Spacer direction="vertical" gap="$2" />
      <ProgramsRow title={title} data={data} containerStyle={undefined}/>
    </Box>
  );
};
