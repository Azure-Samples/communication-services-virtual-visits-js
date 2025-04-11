// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonProps, IStyle, mergeStyles, PrimaryButton, Stack, Text } from '@fluentui/react';
import {
  containerStyle,
  moreDetailsStyles,
  containerItemGap,
  titleStyles,
  rejoinCallButtonContainerStyles,
  presenterEndCallContainerStyles
} from '../../../styles/SummaryEndCall.styles';
import { Video20Filled, CallEnd20Filled } from '@fluentui/react-icons';
import { buttonWithIconStyles, rejoinButtonStyle, videoCameraIconStyle } from '../../../styles/StartCallButton.styles';
import { CallSummaryTile } from './CallSummaryTile';
/**
 * @private
 */
export interface PresenterEndCallScreenProps {
  disableStartCallButton?: boolean;
  pageStyle?: IStyle;
  serverCallId?: string;
  summary?: string;
  summarizationStatus: 'InProgress' | 'Complete' | 'None';
  reJoinCall: () => void;
}

/**
 * Generic page with a title and more details text for serving up a notice to the user.
 *
 * @private
 */
export const PresenterEndCallScreen = (props: PresenterEndCallScreenProps): JSX.Element => {
  const { serverCallId, summarizationStatus, summary, reJoinCall } = props;

  return (
    <Stack
      className={mergeStyles(props.pageStyle)}
      verticalFill
      styles={presenterEndCallContainerStyles}
      verticalAlign="center"
      horizontalAlign="center"
      aria-atomic
      tokens={containerItemGap}
    >
      <Stack className={mergeStyles(containerStyle)} tokens={containerItemGap}>
        <Stack>
          <CallEnd20Filled />
          <Text className={mergeStyles(titleStyles)} aria-live="assertive" role="alert">
            {'You left the call'}
          </Text>
          <Text className={mergeStyles(moreDetailsStyles)} aria-live="assertive">
            {'If this was a mistake , re-join the call.'}
          </Text>
          {!props.disableStartCallButton && (
            <Stack styles={rejoinCallButtonContainerStyles}>
              <StartCallButton
                className={mergeStyles(rejoinButtonStyle)}
                onClick={() => {
                  reJoinCall();
                }}
                disabled={false}
                rejoinCall={true}
                autoFocus
              />
            </Stack>
          )}
        </Stack>
        <CallSummaryTile summarizationStatus={summarizationStatus} summary={summary} serverCallId={serverCallId} />
      </Stack>
    </Stack>
  );
};

/**
 * @private
 */
export interface StartCallButtonProps extends IButtonProps {
  className?: string;
  /** If set, the button is intended to rejoin an existing call. */
  rejoinCall?: boolean;
  hideIcon?: boolean;
}

/**
 * @private
 */
const StartCallButton = (props: StartCallButtonProps): JSX.Element => {
  const { rejoinCall } = props;

  return (
    <PrimaryButton
      {...props}
      data-ui-id="call-composite-start-call-button"
      className={mergeStyles(props.className)}
      styles={buttonWithIconStyles}
      text={rejoinCall ? 'Re-join call' : 'Start call'}
      onRenderIcon={props.hideIcon ? undefined : () => <Video20Filled className={videoCameraIconStyle} />}
    />
  );
};
