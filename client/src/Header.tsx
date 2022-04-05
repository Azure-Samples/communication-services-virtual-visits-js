// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  Stack,
  Text,
  Panel,
  PanelType,
  Nav,
  INavLinkGroup,
  IconButton,
  ThemeContext,
  createTheme,
  IPanelProps
} from '@fluentui/react';
import { Theme } from '@fluentui/theme';
import React from 'react';
import {
  headerContainerStyles,
  headerMenuIconStyles,
  headerTextStyles,
  panelMenuIconStyles,
  wafflePanelNavigationStyles,
  wafflePanelStyles
} from './styles/Header.styles';

/**
 * @interface HeaderProps The properties that Header uses.
 * @member parentid The ID of the element that will be used to contain the panel. This is required so that the panel does not cover the entire height of the screen.
 */
interface HeaderProps {
  companyName: string;
  parentid: string;
}

interface WaffleMenuState {
  isOpen: boolean;
}

export class WaffleNavigation extends React.Component {
  render(): JSX.Element {
    const navLinkGroups: INavLinkGroup[] = [
      {
        links: [
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
    return <Nav ariaLabel="Navigate to expected page" styles={wafflePanelNavigationStyles} groups={navLinkGroups} />;
  }
}

export class WaffleMenu extends React.Component<{ parentid }, WaffleMenuState> {
  public constructor(props: { parentid }) {
    super(props);

    this.openPanel.bind(this);
    this.dismissPanel.bind(this);

    this.state = {
      isOpen: false
    };
  }

  public openPanel(): void {
    this.setState({ isOpen: true });
  }

  public dismissPanel(): void {
    this.setState({ isOpen: false });
  }

  private onRenderPanelMenu(props: IPanelProps | undefined, theme: Theme | undefined): JSX.Element {
    return (
      <>
        <IconButton
          id="waffle-menu-panel"
          iconProps={{ iconName: 'Waffle' }}
          aria-label="Menu Button"
          styles={theme ? panelMenuIconStyles(theme) : undefined}
          onClick={() => this.dismissPanel()}
        />
      </>
    );
  }

  render(): JSX.Element {
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
                onClick={() => this.openPanel()}
              />
              <Panel
                styles={wafflePanelStyles(theme)}
                isLightDismiss={true}
                isOpen={this.state.isOpen}
                hasCloseButton={false}
                onDismiss={() => this.dismissPanel()}
                type={PanelType.smallFixedNear}
                layerProps={{ hostId: this.props.parentid }}
                onRenderNavigationContent={(props) => this.onRenderPanelMenu(props, theme)}
              >
                <WaffleNavigation />
              </Panel>
            </div>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

export class Header extends React.Component<HeaderProps> {
  public constructor(props: HeaderProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <ThemeContext.Consumer>
        {(theme: Theme | undefined) => {
          if (theme === undefined) {
            theme = createTheme();
          }
          return (
            <Stack styles={headerContainerStyles(theme)} verticalAlign="center" horizontal>
              <WaffleMenu parentid={this.props.parentid} />
              <Text styles={headerTextStyles(theme)}>{this.props.companyName}</Text>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
