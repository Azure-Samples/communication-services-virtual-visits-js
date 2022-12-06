// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import MobileDetect from 'mobile-detect';
import { LayerHost, Stack, Theme } from '@fluentui/react';
import { getGenericContainerStyles } from '../styles/GenericContainer.styles';
import { getDefaultLayerHostStyles } from '../styles/Common.styles';
import React from 'react';

interface GenericContainerProps {
  layerHostId: string;
  theme: Theme;
}

const GenericContainer = (props: React.PropsWithChildren<GenericContainerProps>): JSX.Element => {
  const { layerHostId, theme } = props;
  const containerStyles = getGenericContainerStyles(theme, new MobileDetect(window.navigator.userAgent).mobile());

  return (
    <LayerHost id={layerHostId} style={getDefaultLayerHostStyles()}>
      <Stack styles={containerStyles} tokens={{ childrenGap: 15 }}>
        {props.children}
      </Stack>
    </LayerHost>
  );
};

export default GenericContainer;
