// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAdapter, CallWithChatAdapter } from '@azure/communication-react';
import { useState } from 'react';
import { Theme, PartialTheme } from '@fluentui/react';
import { PostCallConfig } from '../../models/ConfigModel';
import { Survey } from './Survey';
import { callWithChatComponentStyles } from '../../styles/MeetingExperience.styles';

interface PostCallExperienceProps {
  adapter: CallWithChatAdapter | CallAdapter | undefined;
  postCall: PostCallConfig | undefined;
  fluentTheme?: PartialTheme | Theme;
  meetingLink: string;
  acsUserId: string;
}

const PostCallExperience = (props: React.PropsWithChildren<PostCallExperienceProps>): JSX.Element => {
  const { adapter, postCall, acsUserId, fluentTheme, meetingLink } = props;
  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();

  if (!adapter) {
    return <>{props.children}</>;
  }

  if (postCall?.survey.type) {
    adapter.on('callEnded', () => {
      setRenderPostCall(true);
    });
  }
  adapter.onStateChange((state) => {
    if (state.call?.id !== undefined && state.call?.id !== callId) {
      setCallId(adapter.getState().call?.id);
    }
  });

  return (
    <>
      {renderPostCall && postCall && (
        <Survey
          callId={callId}
          acsUserId={acsUserId}
          meetingLink={meetingLink}
          theme={fluentTheme}
          data-testid="Survey"
          postCall={postCall}
          onRejoinCall={() => {
            adapter.joinCall();
            setRenderPostCall(false);
          }}
        />
      )}
      <div style={callWithChatComponentStyles(renderPostCall && postCall !== undefined)}>{props.children}</div>
    </>
  );
};

export default PostCallExperience;
