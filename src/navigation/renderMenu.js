import React, { memo } from 'react';
import { Menu } from '../../src1/components/Menu/Menu';

const RenderMenu = (props) => <Menu {...props} />;

const MemoizedRenderMenu = memo(RenderMenu);

export default MemoizedRenderMenu;
