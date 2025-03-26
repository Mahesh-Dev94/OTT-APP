import styled from '@emotion/native';
import { ReactNode } from 'react';
import { TextProps } from 'react-native';
import { type FontWeight, type TypographyVariant } from '../theme/typography';
import React from 'react';

export type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  fontWeight?: FontWeight;
  children?: ReactNode;
  width?:number
};

export const Typography = ({
  variant = 'body',
  fontWeight = 'regular',
  width,
  children,
  ...textProps
}: TypographyProps) => {
  return (
    <StyledText width={width} numberOfLines={1} ellipsizeMode="tail" variant={variant} fontWeight={fontWeight} {...textProps}>
      {children}
    </StyledText>
  );
};

const StyledText = styled.Text<{
  variant: TypographyVariant;
  fontWeight: FontWeight;
  width?: number;
}>(({ variant, fontWeight, theme,width }) => ({
  ...theme.typography[variant][fontWeight],
  color: 'white',
  flexWrap: 'wrap',
  textAlign:variant==='body'? 'center':'left',
  
  width:width !== undefined ? width : 'auto',
}));
