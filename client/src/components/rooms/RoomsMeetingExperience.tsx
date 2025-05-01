// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ActiveNotification,
  CallAdapter,
  CallAdapterState,
  CallComposite,
  CommonCallAdapter,
  createAzureCommunicationCallAdapterFromClient,
  createStatefulCallClient,
  CustomCallControlButtonCallback,
  DeclarativeCallAgent,
  StatefulCallClient,
  fromFlatCommunicationIdentifier,
  useTheme,
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  CallAdapterCallEndedEvent,
  CallCompositeOptions
} from '@azure/communication-react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { Theme, PartialTheme, Stack, Spinner } from '@fluentui/react';
import { fullSizeStyles } from '../../styles/Common.styles';
import { RoomParticipantRole, RoomsInfo } from '../../models/RoomModel';
import { PostCallConfig, TranscriptionClientOptions } from '../../models/ConfigModel';
import { Survey } from '../postcall/Survey';
import MobileDetect from 'mobile-detect';
import InviteInstructions from './InviteInstructions';
import { isRoomsInviteInstructionsEnabled, isRoomsPostCallEnabled } from '../../utils/MeetingExperienceUtil';
import {
  connectToCallAutomation,
  fetchTranscriptionStatus,
  getCallSummaryFromServer,
  LocaleCode,
  sendParticipantInfoToServer,
  startTranscription,
  stopTranscription,
  SummarizeResult
} from '../../utils/CallAutomationUtils';
import { Call, TeamsCall } from '@azure/communication-calling';
import { SlideTextEdit20Regular } from '@fluentui/react-icons';
import { TranscriptionOptionsModal } from './transcription/TranscriptionOptionsModal';
import { CustomNotifications } from './transcription/CustomNotifications';
import { PresenterEndCallScreen } from './transcription/PresenterEndCall';

export interface RoomsMeetingExperienceProps {
  roomsInfo: RoomsInfo;
  token: string;
  postCall?: PostCallConfig;
  fluentTheme?: PartialTheme | Theme;
  onDisplayError(error: any): void;
  transcriptionClientOptions?: TranscriptionClientOptions;
  notificationEventsUrl?: string;
}

const RoomsMeetingExperience = (props: RoomsMeetingExperienceProps): JSX.Element => {
  const {
    roomsInfo,
    token,
    postCall,
    fluentTheme,
    onDisplayError,
    transcriptionClientOptions,
    notificationEventsUrl
  } = props;
  const { userId, userRole, locator } = roomsInfo;
  const [call, setCall] = useState<Call | TeamsCall | undefined>();
  const [callAdapter, setCallAdapter] = useState<CommonCallAdapter>();
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent>();
  const [callConnected, setCallConnected] = useState(false);
  const [transcriptionNotifications, setCustomNotifications] = useState<ActiveNotification[]>([]);
  const [dismissedTranscriptionNotificationTypes, setDismissedTrancsriptionNotificationTypes] = useState<string[]>([]);
  const [serverCallId, setServerCallId] = useState<string | undefined>(undefined);
  const [showTranscriptionModal, setShowTranscriptionModal] = useState(false);
  const [statefulClient, setStatefulClient] = useState<StatefulCallClient>();
  const [summary, setSummary] = useState<SummarizeResult>();
  const [summarizationLanguage, setSummarizationLanguage] = useState<LocaleCode>('en-US');
  const [summarizationStatus, setSummarizationStatus] = useState<'None' | 'InProgress' | 'Complete'>('None');
  const [transcriptionStarted, setTranscriptionStarted] = useState(false);

  const transcriptionFeatureEnabled = useRef(transcriptionClientOptions?.transcription !== 'none');
  const summarizationFeatureEnabled = useRef(transcriptionClientOptions?.summarization);
  const theme = useTheme();
  const transcriptionStartedByYou = useRef(false);
  const callAutomationStarted = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const displayName = userRole === RoomParticipantRole.presenter ? 'Presenter' : 'Attendee';
  const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

  const [renderEndCallScreen, setRenderEndCallScreen] = useState<boolean>(false);
  const [renderInviteInstructions, setRenderInviteInstructions] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (serverCallId && transcriptionFeatureEnabled.current) {
      // Create EventSource connection when serverCallId is available. The URL provided here is for your server.
      eventSource = new EventSource(`${notificationEventsUrl}/api/notificationEvents`);
      eventSourceRef.current = eventSource; // Store reference for cleanup

      // Connection opened so we want to have the status of the transcription sent from the server to push the notification
      eventSource.onopen = () => {
        fetchTranscriptionStatus(serverCallId);
      };
      eventSource.addEventListener('message', (event) => {
        console.log('EventSource connection event:', event);
      });

      // Connection error
      eventSource.onerror = (error) => {
        console.error('EventSource error:', error);

        // Attempt to reconnect if the connection is closed
        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
          console.log('EventSource connection closed, attempting to reconnect');
        }
      };
    }

    // Clean up on unmount or when serverCallId changes
    return () => {
      if (eventSource) {
        console.log('Closing EventSource connection');
        eventSource.close();
      }
    };
  }, [serverCallId]);

  useEffect(() => {
    if (!eventSourceRef.current || !callConnected) {
      return;
    }
    const transcriptionStartedhandler = (event: MessageEvent): void => {
      const parsedData = JSON.parse(event.data);
      if (
        parsedData.serverCallId.includes(serverCallId) &&
        !(
          dismissedTranscriptionNotificationTypes.includes('transcriptionStarted') ||
          dismissedTranscriptionNotificationTypes.includes('transcriptionStartedByYou')
        )
      ) {
        setTranscriptionStarted(true);
        setCustomNotifications((prev) =>
          prev
            .filter((notification) => notification.type !== 'transcriptionStarted')
            .filter((notification) => notification.type !== 'transcriptionStopped')
            .concat([
              {
                type: transcriptionStartedByYou.current ? 'transcriptionStartedByYou' : 'transcriptionStarted',
                autoDismiss: false,
                onDismiss: () => {
                  setCustomNotifications((prev) =>
                    prev
                      .filter((notification) => notification.type !== 'transcriptionStarted')
                      .filter((notification) => notification.type !== 'transcriptionStartedByYou')
                  );
                  setDismissedTrancsriptionNotificationTypes(['transcriptionStarted', 'transcriptionStartedByYou']);
                }
              }
            ])
        );
      }
    };
    eventSourceRef.current?.addEventListener('TranscriptionStarted', transcriptionStartedhandler);

    const transcriptionStoppedHandler = (event: MessageEvent): void => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.serverCallId.includes(serverCallId)) {
        setTranscriptionStarted(false);
        setCustomNotifications((prev) =>
          prev
            .filter((notification) => notification.type !== 'transcriptionStarted')
            .filter((notification) => notification.type !== 'transcriptionStopped')
            .filter((notification) => notification.type !== 'transcriptionStartedByYou')
            .concat([
              {
                type: 'transcriptionStopped',
                autoDismiss: false,
                onDismiss: () => {
                  setCustomNotifications((prev) =>
                    prev.filter((notification) => notification.type !== 'transcriptionStopped')
                  );
                }
              }
            ])
        );
        transcriptionStartedByYou.current = false;
        setDismissedTrancsriptionNotificationTypes([]);
      }
    };
    eventSourceRef.current?.addEventListener('TranscriptionStopped', transcriptionStoppedHandler);

    const transcriptionStatusHandler = (event: MessageEvent): void => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.serverCallId.includes(serverCallId)) {
        const transcriptionStarted = parsedData.transcriptStarted;
        console.log('TranscriptionStatus:', transcriptionStarted);
        if (transcriptionStarted) {
          setTranscriptionStarted(true);
          if (
            transcriptionNotifications.find((notification) => notification.type === 'transcriptionStarted') ||
            transcriptionNotifications.find((notification) => notification.type === 'transcriptionStartedByYou')
          ) {
            return;
          }
          setCustomNotifications((prev) =>
            prev
              .filter((notification) => notification.type !== 'transcriptionStarted')
              .filter((notification) => notification.type !== 'transcriptionStopped')
              .filter((notification) => notification.type !== 'transcriptionStartedByYou')
              .concat([
                {
                  type: 'transcriptionStarted',
                  autoDismiss: false,
                  onDismiss: () => {
                    setCustomNotifications((prev) =>
                      prev.filter((notification) => notification.type !== 'transcriptionStarted')
                    );
                  }
                }
              ])
          );
        }
      }
    };
    eventSourceRef.current?.addEventListener('TranscriptionStatus', transcriptionStatusHandler);

    const transcriptionErrorHandler = (event: MessageEvent): void => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.serverCallId === serverCallId) {
        console.log('Transcription error', event.data);
        setTranscriptionStarted(false);
        setCustomNotifications([
          {
            type: 'transcriptionError',
            autoDismiss: false,
            onDismiss: () => {
              setCustomNotifications((prev) =>
                prev.filter((notification) => notification.type !== 'transcriptionError')
              );
            }
          }
        ]);
        transcriptionStartedByYou.current = false;
      }
    };
    eventSourceRef.current?.addEventListener('TranscriptionError', transcriptionErrorHandler);
    return () => {
      eventSourceRef.current?.removeEventListener('TranscriptionStarted', transcriptionStartedhandler);
      eventSourceRef.current?.removeEventListener('TranscriptionStopped', transcriptionStoppedHandler);
      eventSourceRef.current?.removeEventListener('TranscriptionStatus', transcriptionStatusHandler);
      eventSourceRef.current?.removeEventListener('TranscriptionError', transcriptionErrorHandler);
    };
  }, [serverCallId, callConnected]);

  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  const afterAdapterCreate = useCallback(
    async (adapter: CallAdapter): Promise<CallAdapter> => {
      const postCallEnabled = isRoomsPostCallEnabled(userRole, postCall);

      if (postCallEnabled) {
        adapter.on('callEnded', () => setRenderEndCallScreen(true));
      }

      const onCallEndedHandler = async (event: CallAdapterCallEndedEvent): Promise<void> => {
        setRenderEndCallScreen(true);
        setCallConnected(false);
        setCustomNotifications([]);
        if (callAutomationStarted.current) {
          console.log('Summarization to be provided in language - ', summarizationLanguage);
          setCallConnected(false);
          if (summarizationFeatureEnabled.current) {
            setSummary(undefined);
            setSummarizationStatus('InProgress');
            setSummary(
              await getCallSummaryFromServer(adapter, summarizationLanguage).finally(() =>
                setSummarizationStatus('Complete')
              )
            );
          }
        }
      };
      adapter.on('callEnded', onCallEndedHandler);

      const onStateChangedHandler = async (state: CallAdapterState): Promise<void> => {
        if (state.call?.id !== undefined && state.call?.id !== callId) {
          setCallId(adapter.getState().call?.id);
        }
        if (state?.call?.state === 'Connected' && !callConnected) {
          setCallConnected(true);
          const serverCallId = await state.call.info?.getServerCallId();
          setServerCallId(serverCallId);
          // The server needs to store the information of participants in the call for later mapping participantIds to display names in the transcription
          sendParticipantInfoToServer({ displayName, userId: userId }, serverCallId);
        }
        if (state.call && callAgent && !call) {
          const call = callAgent?.calls.find((call) => call.id === state.call?.id);
          if (call) {
            setCall(call);
          }
        }

        if (
          !callAutomationStarted.current &&
          state.call?.state === 'Connected' &&
          transcriptionFeatureEnabled.current
        ) {
          callAutomationStarted.current = true;
          try {
            console.log('Connecting to call automation...');
            await connectToCallAutomation(state);
          } catch (e) {
            console.error('Error connecting to call automation:', e);
            callAutomationStarted.current = false;
          }
        }
      };
      adapter.onStateChange(onStateChangedHandler);

      const toggleInviteInstructions = (state: CallAdapterState): void => {
        const roomsInviteInstructionsEnabled = isRoomsInviteInstructionsEnabled(userRole, formFactorValue, state?.page);
        setRenderInviteInstructions(roomsInviteInstructionsEnabled);
      };

      toggleInviteInstructions(adapter.getState());

      adapter.onStateChange((state) => {
        if (state.call?.id !== undefined && state.call?.id !== callId) {
          setCallId(adapter.getState().call?.id);
        }

        toggleInviteInstructions(state);
      });

      return adapter;
    },
    [callAgent]
  );

  const args = useMemo(
    () => ({
      userId: { communicationUserId: userId },
      displayName,
      credential,
      locator
    }),
    [userId, displayName, credential, locator]
  );

  const customButtonOptions: CustomCallControlButtonCallback[] = [
    () => ({
      placement: 'overflow',
      strings: {
        label: transcriptionStarted ? 'Stop Transcription' : 'Start Transcription'
      },
      onRenderIcon: () => (
        <SlideTextEdit20Regular style={{ color: theme.palette.themePrimary, margin: '0rem 0.2rem' }} />
      ),
      onItemClick: async () => {
        if (serverCallId && !transcriptionStarted) {
          console.log('Starting transcription');
          setShowTranscriptionModal(true);
          transcriptionStartedByYou.current = true;
        } else if (serverCallId && transcriptionStarted) {
          console.log('Stopping transcription');
          setTranscriptionStarted(await !stopTranscription(serverCallId));
        }
      },
      tooltipText: 'Start Transcription'
    })
  ];

  const callCompositeOptions = useMemo((): CallCompositeOptions => {
    return {
      callControls: {
        onFetchCustomButtonProps: transcriptionFeatureEnabled.current ? customButtonOptions : undefined,
        endCallButton: {
          hangUpForEveryone: userRole === RoomParticipantRole.presenter ? 'endCallOptions' : undefined
        }
      },
      notificationOptions: {
        hideAllNotifications: true
      }
    };
  }, [customButtonOptions, transcriptionFeatureEnabled, userRole]);

  /**
   * We want to set up the call adapter through the usage of the create from clients method
   * this allows us to use the usePropsFor hook to access the notifications from state
   * and create our own notification Stack with the notifications disabled in the composite
   */
  useEffect(() => {
    const createCallAgent = async (): Promise<void> => {
      if (statefulClient && !callAgent) {
        const callAgent = await statefulClient.createCallAgent(args.credential, { displayName });
        setCallAgent(callAgent);
      }
    };

    const createAdapter = async (): Promise<void> => {
      if (callAgent && statefulClient && locator && afterAdapterCreate) {
        try {
          const adapter = await createAzureCommunicationCallAdapterFromClient(statefulClient, callAgent, locator);
          setCallAdapter(await afterAdapterCreate(adapter));
        } catch {
          onDisplayError('Failed to create call adapter');
        }
      }
    };

    if (!statefulClient) {
      setStatefulClient(
        createStatefulCallClient({ userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier })
      );
    }
    if (statefulClient) {
      createCallAgent();
    }
    if (callAgent && statefulClient && locator) {
      createAdapter();
    }
    return () => {
      if (callAdapter) {
        callAdapter.dispose();
      }
      if (callAgent) {
        callAgent.dispose();
      }
    };
  }, [args.credential, afterAdapterCreate, callAgent, locator, statefulClient, userId]);

  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  if (!callAdapter) {
    return <Spinner data-testid="spinner" styles={fullSizeStyles} />;
  }

  if (renderEndCallScreen && postCall && userRole !== RoomParticipantRole.presenter) {
    return (
      <Stack>
        <Survey
          data-testid="survey"
          callId={callId}
          acsUserId={userId}
          meetingLink={locator.roomId}
          theme={fluentTheme}
          postCall={postCall}
          serverCallId={serverCallId}
          summarizationStatus={summarizationStatus}
          summary={summarizationFeatureEnabled ? summary : undefined}
          transcriptionClientOptions={transcriptionClientOptions}
          onRejoinCall={async () => {
            await callAdapter.joinCall();
            setRenderEndCallScreen(false);
          }}
        />
      </Stack>
    );
  }

  if (userRole === RoomParticipantRole.presenter && renderEndCallScreen && transcriptionFeatureEnabled) {
    return (
      <Stack data-testid="rooms-composite">
        <PresenterEndCallScreen
          reJoinCall={() => {
            callAdapter.joinCall({});
            setRenderEndCallScreen(false);
          }}
          summarizationStatus={summarizationStatus}
          serverCallId={serverCallId}
          summary={summary?.recap}
        />
      </Stack>
    );
  }

  return (
    <Stack data-testid="rooms-composite" style={{ height: '100%' }}>
      {!statefulClient && (
        <Stack horizontal horizontalAlign={'center'} styles={{ root: { height: '100%', width: '100%' } }}>
          <Spinner label="Loading..." />
        </Stack>
      )}
      {statefulClient && (
        <CallClientProvider callClient={statefulClient}>
          <CallAgentProvider callAgent={callAgent}>
            <Stack
              horizontal
              horizontalAlign={'center'}
              styles={{ root: { height: '100%', width: '100%', position: 'relative' } }}
            >
              {call && (
                <CallProvider call={call as Call}>
                  <CustomNotifications customNotifications={transcriptionNotifications} />
                </CallProvider>
              )}
              <TranscriptionOptionsModal
                isOpen={showTranscriptionModal}
                setIsOpen={setShowTranscriptionModal}
                startTranscription={async (locale: LocaleCode) => {
                  if (serverCallId) {
                    setSummarizationLanguage(locale);
                    const transcriptionResponse = await startTranscription(serverCallId, { locale });
                    setTranscriptionStarted(transcriptionResponse);
                  }
                }}
              ></TranscriptionOptionsModal>
              <CallComposite
                adapter={callAdapter}
                fluentTheme={fluentTheme}
                formFactor={formFactorValue}
                options={callCompositeOptions}
                callInvitationUrl={
                  userRole === RoomParticipantRole.presenter ? roomsInfo.inviteParticipantUrl : undefined
                }
              />
              {renderInviteInstructions && <InviteInstructions fluentTheme={fluentTheme} />}
            </Stack>
          </CallAgentProvider>
        </CallClientProvider>
      )}
    </Stack>
  );
};

export default RoomsMeetingExperience;
