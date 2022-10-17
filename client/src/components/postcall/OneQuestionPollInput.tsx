// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState } from 'react';
import { RatingSize, Stack, StackItem } from '@fluentui/react';
import { IIconProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react';
import { Text } from '@fluentui/react';
import { TextField } from '@fluentui/react';
import { Rating } from '@fluentui/react';
import { FocusZone } from '@fluentui/react-focus';
import { starRatingLabelStyles, surveyTextFieldStyles } from '../../styles/Survey.styles';

export interface OneQuestionPollInputProps {
  pollType: string;
  textInputPlaceholder?: string;
  setPollResponse: (pollResponse: boolean | number | string | undefined) => void;
}

const RATING_MAX = 5;
const RATING_DEFAULT = 0;
const LIKE = true;
const DISLIKE = false;

enum LikeOrDislikeSelection {
  None,
  Like,
  Dislike
}

export const OneQuestionPollInput = (props: OneQuestionPollInputProps): JSX.Element => {
  const { pollType, textInputPlaceholder } = props;

  const [likeOrDislike, setLikeOrDislike] = useState(LikeOrDislikeSelection.None);

  const likeIcon: IIconProps = { iconName: 'Like' };
  const likeSolidIcon: IIconProps = { iconName: 'LikeSolid' };
  const dislikeIcon: IIconProps = { iconName: 'Dislike' };
  const dislikeSolidIcon: IIconProps = { iconName: 'DislikeSolid' };

  if (pollType === 'likeOrDislike') {
    return (
      <Stack horizontal>
        <IconButton
          toggle
          checked={likeOrDislike === LikeOrDislikeSelection.Like}
          iconProps={likeOrDislike === LikeOrDislikeSelection.Like ? likeSolidIcon : likeIcon}
          onClick={() => {
            setLikeOrDislike(LikeOrDislikeSelection.Like);
            props.setPollResponse(LIKE);
          }}
          tabIndex={-1}
        />
        <IconButton
          toggle
          checked={likeOrDislike === LikeOrDislikeSelection.Dislike}
          iconProps={likeOrDislike === LikeOrDislikeSelection.Dislike ? dislikeSolidIcon : dislikeIcon}
          onClick={() => {
            setLikeOrDislike(LikeOrDislikeSelection.Dislike);
            props.setPollResponse(DISLIKE);
          }}
          tabIndex={-1}
        />
      </Stack>
    );
  }

  if (pollType === 'rating') {
    return (
      <FocusZone disabled={true}>
        <Rating
          tabIndex={-1}
          allowZeroStars={true}
          max={RATING_MAX}
          size={RatingSize.Large}
          defaultRating={RATING_DEFAULT}
          onChange={(event: React.FormEvent<HTMLElement>, rating?: number) => {
            props.setPollResponse(rating);
          }}
        />
        <Stack horizontalAlign="center">
          <StackItem>
            <Text styles={starRatingLabelStyles}>{'Choose a star rating'}</Text>
          </StackItem>
        </Stack>
      </FocusZone>
    );
  }

  if (pollType === 'text') {
    return (
      <TextField
        styles={surveyTextFieldStyles}
        tabIndex={-1}
        placeholder={textInputPlaceholder}
        multiline
        rows={3}
        resizable={false}
        width="100%"
        onChange={(_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) =>
          props.setPollResponse(newValue)
        }
      />
    );
  }

  return <></>;
};

export default OneQuestionPollInput;
