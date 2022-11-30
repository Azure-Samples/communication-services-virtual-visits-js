// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator, RoomCallLocator } from '@azure/communication-calling';
import { getTeamsMeetingLink, getRoomsMeetingLink, getRoomsUserId } from './utils/GetMeetingLink';
import { useEffect, useState } from 'react';
import { Spinner, ThemeProvider } from '@fluentui/react';
import { JoinTeamsMeeting } from './components/JoinTeamsMeeting';
import { AppConfigModel } from './models/ConfigModel';
import { fetchConfig } from './utils/FetchConfig';
import { GenericError } from './components/GenericError';
import { fullSizeStyles } from './styles/Common.styles';
import { TeamsMeeting } from './components/teams/TeamsMeeting';
import { RoomsMeeting } from './components/rooms/RoomsMeeting';

export const Visit = (): JSX.Element => {
  const _getMeetingLinkLocator = (meetingLink: string): TeamsMeetingLinkLocator | undefined => {
    let meetingLinkModel: TeamsMeetingLinkLocator | undefined = undefined;

    // try extracting Teams meeting link from the url
    try {
      meetingLinkModel = getTeamsMeetingLink(meetingLink);
    } catch (error) {
      meetingLinkModel = undefined;
    }

    return meetingLinkModel;
  };

  const _getRoomLocator = (meetingLink: string): RoomCallLocator | undefined => {
    let meetingLinkModel: RoomCallLocator | undefined = undefined;
    // try extracting rooms meeting link from the url
    try {
      meetingLinkModel = getRoomsMeetingLink(meetingLink);
    } catch (error) {
      console.log(error);
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
      console.log(error);
      participantId = undefined;
    }
    return participantId;
  };

  const _onJoinMeeting = (link: string): void => {
    const appendMeetingLinkToUrl = (): void => {
      window.history.pushState({}, document.title, window.location.href + link);
    };

    appendMeetingLinkToUrl();

    const meetingLinkLocator = _getMeetingLinkLocator(link);
    setMeetingLinkLocator(meetingLinkLocator);
  };

  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const [meetingLinkLocator, setMeetingLinkLocator] = useState<TeamsMeetingLinkLocator | undefined>(
    _getMeetingLinkLocator(window.location.search) // case of direct link to visit with teams meeting link in URL
  );
  const [roomsLocator] = useState<RoomCallLocator | undefined>(
    _getRoomLocator(window.location.search) // case of direct link to visit with rooms meeting link in URL
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

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  if (!config) {
    // config is not ready yet - show spinning/loading animation
    return <Spinner styles={fullSizeStyles} />;
  }

  if (!meetingLinkLocator && roomsLocator && participantId) {
    return (
      <RoomsMeeting
        config={config}
        locator={roomsLocator}
        participantId={participantId}
        onDisplayError={(error) => setError(error)}
      />
    );
  }

  if (meetingLinkLocator && meetingLinkLocator.meetingLink) {
    return <TeamsMeeting config={config} locator={meetingLinkLocator} onDisplayError={(error) => setError(error)} />;
  }

  // If we have config and token but don't have a meeting link,
  // show a separate screen with "enter meeting link" textbox
  return (
    <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
      <JoinTeamsMeeting config={config} onJoinMeeting={(link) => _onJoinMeeting(link)} />
    </ThemeProvider>
  );
};
