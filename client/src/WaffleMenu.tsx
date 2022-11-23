// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IconButton,
  INavLinkGroup,
  IPanelProps,
  Nav,
  Panel,
  PanelType,
  ThemeContext,
  createTheme
} from '@fluentui/react';
import { Theme } from '@fluentui/theme';
import { useState } from 'react';
import {
  headerMenuIconStyles,
  panelMenuIconStyles,
  wafflePanelNavigationStyles,
  wafflePanelStyles
} from './styles/Header.styles';

interface WaffleMenuProps {
  parentid: string;
}

export const WaffleMenu = (props: WaffleMenuProps): JSX.Element => {
  const { parentid } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const _openPanel = (): void => {
    setIsOpen(true);
  };

  const _dismissPanel = (): void => {
    setIsOpen(false);
  };

  const _onRenderPanelMenu = (props: IPanelProps | undefined, theme: Theme | undefined): JSX.Element => {
    return (
      <>
        <IconButton
          id="waffle-menu-panel"
          iconProps={{ iconName: 'Waffle' }}
          aria-label="Menu Button"
          styles={theme ? panelMenuIconStyles(theme) : undefined}
          onClick={() => _dismissPanel()}
        />
      </>
    );
  };

  return (
    <ThemeContext.Consumer>
      {(theme: Theme | undefined) => {
        if (theme === undefined) {
          theme = createTheme();
        }
        return (
          <div>
            <IconButton
              id="waffle-menu"
              iconProps={{ iconName: 'Waffle' }}
              aria-label="Menu Button"
              styles={headerMenuIconStyles(theme)}
              onClick={() => _openPanel()}
            />
            <Panel
              styles={wafflePanelStyles(theme)}
              isLightDismiss={true}
              isOpen={isOpen}
              hasCloseButton={false}
              onDismiss={() => _dismissPanel()}
              type={PanelType.smallFixedNear}
              layerProps={{ hostId: parentid }}
              onRenderNavigationContent={(props) => _onRenderPanelMenu(props, theme)}
            >
              <WaffleNavigation />
            </Panel>
          </div>
        );
      }}
    </ThemeContext.Consumer>
  );
};

const navLinkGroups: INavLinkGroup[] = [
  {
    links: [
      {
        name: 'Home',
        url: './',
        key: 'home'
      },
      {
        name: 'Book',
        url: './book',
        key: 'book'
      },
      {
        name: 'Visit',
        url: './visit',
        key: 'visit'
      }
    ]
  }
];

export const WaffleNavigation = (): JSX.Element => {
  return <Nav ariaLabel="Navigate to expected page" styles={wafflePanelNavigationStyles} groups={navLinkGroups} />;
};
