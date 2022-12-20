// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator, RoomCallLocator } from '@azure/communication-calling';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { Header } from './Header';
import { JoinMeeting } from './components/JoinMeeting';
import { AppConfigModel } from './models/ConfigModel';
import { fetchConfig } from './utils/FetchConfig';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';
import { getTeamsMeetingLink, getRoomCallLocator, getRoomsUserId, isValidRoomsLink } from './utils/GetMeetingLink';
import { TeamsMeeting } from './components/teams/TeamsMeeting';
import { RoomsMeeting } from './components/rooms/RoomsMeeting';
import './styles/Common.css';

const PARENT_ID = 'VisitSection';

export const Visit = (): JSX.Element => {
  const _getTeamsMeetingLinkLocator = (meetingLink: string): TeamsMeetingLinkLocator | undefined => {
    let teamsMeetingLinkModel: TeamsMeetingLinkLocator | undefined = undefined;

    // try extracting Teams meeting link from the url
    try {
      teamsMeetingLinkModel = getTeamsMeetingLink(meetingLink);
    } catch (error) {
      teamsMeetingLinkModel = undefined;
    }

    return teamsMeetingLinkModel;
  };

  const _getRoomCallLocator = (meetingLink: string): RoomCallLocator | undefined => {
    let meetingLinkModel: RoomCallLocator | undefined = undefined;
    // try extracting rooms meeting link from the url
    try {
      meetingLinkModel = getRoomCallLocator(meetingLink);
    } catch (error) {
      meetingLinkModel = undefined;
    }
    return meetingLinkModel;
  };

  const _getParticipantId = (meetingLink: string): string | undefined => {
    let participantId: string | undefined = undefined;
    //try extracting rooms participant Id from the url
    try {
      participantId = getRoomsUserId(meetingLink);
    } catch (error) {
      participantId = undefined;
    }
    return participantId;
  };

  const _onJoinMeeting = (link: string): void => {
    const appendMeetingLinkToUrl = (): void => {
      window.history.pushState({}, document.title, window.location.href + link);
    };

    if (isValidRoomsLink(link)) window.location.assign(link);
    else {
      appendMeetingLinkToUrl();
      const meetingLinkLocator = _getTeamsMeetingLinkLocator(link);
      setTeamsMeetingLinkLocator(meetingLinkLocator);
    }
  };

  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const [teamsMeetingLinkLocator, setTeamsMeetingLinkLocator] = useState<TeamsMeetingLinkLocator | undefined>(
    _getTeamsMeetingLinkLocator(window.location.search) // case of direct link to visit with teams meeting link in URL
  );
  const [roomCallLocator] = useState<RoomCallLocator | undefined>(
    _getRoomCallLocator(window.location.search) // case of direct link to visit with rooms meeting link in URL
  );
  const [participantId] = useState<string | undefined>(_getParticipantId(window.location.search)); // case of direct link to visit with rooms meeting link in URL

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const config = await fetchConfig();
        setConfig(config);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };
    fetchData();
  }, []);

  const isTeamsMeeting = teamsMeetingLinkLocator && teamsMeetingLinkLocator.meetingLink;
  const isRoomsMeeting = roomCallLocator && participantId;

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  if (!config) {
    // config is not ready yet - show spinning/loading animation
    return <Spinner styles={fullSizeStyles} />;
  }

  if (!isTeamsMeeting && !isRoomsMeeting) {
    // If we have config and token but don't have a meeting link,
    // show a separate screen with "enter meeting link" textbox
    return (
      <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
        <JoinMeeting config={config} onJoinMeeting={(link) => _onJoinMeeting(link)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
      <Stack styles={backgroundStyles(config.theme)}>
        <Header companyName={config.companyName} parentid={PARENT_ID} />
        <LayerHost
          id={PARENT_ID}
          style={{
            position: 'relative',
            height: '100%'
          }}
        >
          {isTeamsMeeting && (
            <TeamsMeeting
              config={config}
              locator={teamsMeetingLinkLocator}
              onDisplayError={(error) => setError(error)}
            />
          )}
          {!isTeamsMeeting && isRoomsMeeting && (
            <RoomsMeeting
              config={config}
              locator={roomCallLocator}
              participantId={participantId}
              fluentTheme={config.theme}
              onDisplayError={(error) => setError(error)}
            />
          )}
        </LayerHost>
      </Stack>
    </ThemeProvider>
  );
};
