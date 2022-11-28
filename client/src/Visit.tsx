// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserToken } from '@azure/communication-identity';
import { LayerHost, Spinner, Stack, ThemeProvider } from '@fluentui/react';
import { Header } from './Header';
import { MeetingExperience } from './components/MeetingExperience';
import { JoinTeamsMeeting } from './components/JoinTeamsMeeting';
import { AppConfigModel } from './models/ConfigModel';
import { fetchConfig } from './utils/FetchConfig';
import { fetchToken } from './utils/FetchToken';
import { getTeamsMeetingLink, getRoomsMeetingLink, getRoomsUserId } from './utils/GetTeamsMeetingLink';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import './styles/Common.css';
import { GenericError } from './components/GenericError';
import { useEffect, useState } from 'react';
import { TeamsMeetingLinkLocator, RoomCallLocator } from '@azure/communication-calling';
import { fetchRoomsResponse } from './utils/FetchRoomsToken';
import { RoomsMeetingExperience } from './components/Rooms/RoomsMeetingExperience';
import { RoomParticipantRole } from './models/RoomModel';

const PARENT_ID = 'VisitSection';

export const Visit = (): JSX.Element => {
  const _getMeetingLinkLocator = (meetingLink: string): TeamsMeetingLinkLocator | undefined => {
    let meetingLinkModel: TeamsMeetingLinkLocator | undefined = undefined;

    // try extracting Teams link from the url
    try {
      meetingLinkModel = getTeamsMeetingLink(meetingLink);
    } catch (error) {
      meetingLinkModel = undefined;
    }

    return meetingLinkModel;
  };

  const _getRoomLocator = (meetingLink: string): RoomCallLocator | undefined => {
    let meetingLinkModel: RoomCallLocator | undefined = undefined;
    // try extracting meeting link from the url
    try {
      meetingLinkModel = getRoomsMeetingLink(meetingLink);
    } catch (error) {
      console.log(`In roomId catch ${error}`);
      meetingLinkModel = undefined;
    }
    return meetingLinkModel;
  };

  const _getParticipantId = (meetingLink: string): string | undefined => {
    let participantId: string | undefined = undefined;
    //try extracting participant Id from the url
    try {
      participantId = getRoomsUserId(meetingLink);
    } catch (error) {
      console.log(`In participantId catch ${error}`);
      participantId = undefined;
    }
    return participantId;
  };

  // handle going to previous/next page of window history
  window.onpopstate = () => {
    window.location.assign(window.location.href);
  };

  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [token, setToken] = useState<CommunicationUserToken | undefined>(undefined);
  const [roomsToken, setRoomsToken] = useState<string | undefined>(undefined);
  const [userRole, setUserRole] = useState<RoomParticipantRole | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const [meetingLinkLocator, setMeetingLinkLocator] = useState<TeamsMeetingLinkLocator | undefined>(
    _getMeetingLinkLocator(window.location.search) // case of direct link to visit with teams meeting link in URL
  );
  const [roomsLocator] = useState<RoomCallLocator | undefined>(
    _getRoomLocator(window.location.search) // case of direct link to visit with rooms meeting link in URL
  );
  const [participantId] = useState<string | undefined>(_getParticipantId(window.location.search)); // case of direct link to visit with rooms meeting link in URL

  const _onJoinMeeting = (link: string): void => {
    const appendMeetingLinkToUrl = (): void => {
      window.history.pushState({}, document.title, window.location.href + link);
    };

    appendMeetingLinkToUrl();

    const meetingLinkLocator = _getMeetingLinkLocator(link);
    setMeetingLinkLocator(meetingLinkLocator);
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const config = await fetchConfig();
        const token = await fetchToken();
        if (roomsLocator && participantId) {
          const roomsResponse = await fetchRoomsResponse(roomsLocator.roomId, participantId);
          setRoomsToken(roomsResponse.token);
          setUserRole(roomsResponse.participant.role);
        }
        setConfig(config);
        setToken(token);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  if (!config || !token) {
    // config and token not ready yet - show spinning/loading animation
    return <Spinner styles={fullSizeStyles} />;
  }

  if (!meetingLinkLocator || !meetingLinkLocator.meetingLink) {
    if (!roomsLocator || !participantId) {
      // If we have config and token but don't have a meeting link,
      // show a separate screen with "enter meeting link" textbox
      return (
        <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
          <JoinTeamsMeeting config={config} onJoinMeeting={(link) => _onJoinMeeting(link)} />
        </ThemeProvider>
      );
    }
  }

  // If the config and token are loaded and we got a valid teams link - try to start
  // the meeting experience
  const locator = meetingLinkLocator;

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
          {meetingLinkLocator && locator && (
            <MeetingExperience
              userId={token.user}
              token={token.token}
              displayName="Virtual Appointments User"
              endpointUrl={config.communicationEndpoint}
              locator={locator}
              fluentTheme={config.theme}
              logoUrl={config.logoUrl}
              waitingTitle={config.waitingTitle}
              waitingSubtitle={config.waitingSubtitle}
              chatEnabled={config.chatEnabled}
              postCall={config.postCall}
              onDisplayError={(error) => setError(error)}
            />
          )}
          {!meetingLinkLocator && roomsLocator && participantId && roomsToken && userRole && (
            <RoomsMeetingExperience
              token={roomsToken}
              userId={participantId}
              userRole={userRole}
              locator={roomsLocator}
              onDisplayError={(error) => setError(error)}
            />
          )}
        </LayerHost>
      </Stack>
    </ThemeProvider>
  );
};
