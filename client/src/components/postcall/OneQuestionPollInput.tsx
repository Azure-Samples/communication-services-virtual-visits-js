// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState } from 'react';
//import { Theme } from '@fluentui/theme';
import { Stack, StackItem } from '@fluentui/react/lib/Stack';
import { IIconProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react/lib/Button';
import { Text } from '@fluentui/react/lib/Text';
import { TextField } from '@fluentui/react/lib/TextField';
import { Rating } from '@fluentui/react/lib/Rating';
import { FocusZone } from '@fluentui/react-focus';
import { starRatingLabelStyles } from '../../styles/Survey.styles';
//import { OneQuestionPollType } from '../../models/ConfigModel';
// import {
//   postCallOneQuestionPollPreviewStylesLessThan900Height,
//   postCallOneQuestionPollPreviewStylesGreaterThanEqual900Height
// } from '../../../styles/PostCallOneQuestionPollPreview.styles';
// import * as ClientResources from "ClientResources";

interface OneQuestionPollInputProps {
  //isScaled: boolean;
  pollType: string;
  //theme: Theme;
  textInputPlaceholder?: string;
}

const RATING_MAX = 5;
const RATING_DEFAULT = 0;

enum LikeOrDislikeSelection {
  None,
  Like,
  Dislike
}

const OneQuestionPollInput = (props: OneQuestionPollInputProps): JSX.Element => {
  const { pollType, textInputPlaceholder } = props;

  const [likeOrDislike, setLikeOrDislike] = useState(LikeOrDislikeSelection.None);

  const likeIcon: IIconProps = { iconName: 'Like' };
  const likeSolidIcon: IIconProps = { iconName: 'LikeSolid' };
  const dislikeIcon: IIconProps = { iconName: 'Dislike' };
  const dislikeSolidIcon: IIconProps = { iconName: 'DislikeSolid' };

  //   const styles = isScaled
  //     ? postCallOneQuestionPollPreviewStylesLessThan900Height
  //     : postCallOneQuestionPollPreviewStylesGreaterThanEqual900Height;

  if (pollType === 'likeOrDislike') {
    return (
      <Stack horizontal>
        <IconButton
          toggle
          checked={likeOrDislike === LikeOrDislikeSelection.Like}
          iconProps={likeOrDislike === LikeOrDislikeSelection.Like ? likeSolidIcon : likeIcon}
          onClick={() => setLikeOrDislike(LikeOrDislikeSelection.Like)}
          tabIndex={-1}
        />
        <IconButton
          toggle
          checked={likeOrDislike === LikeOrDislikeSelection.Dislike}
          iconProps={likeOrDislike === LikeOrDislikeSelection.Dislike ? dislikeSolidIcon : dislikeIcon}
          onClick={() => setLikeOrDislike(LikeOrDislikeSelection.Dislike)}
          tabIndex={-1}
        />
      </Stack>
    );
  }

  if (pollType === 'rating') {
    return (
      <FocusZone disabled={true}>
        <Rating tabIndex={-1} allowZeroStars={true} max={RATING_MAX} defaultRating={RATING_DEFAULT} />
        <Stack horizontalAlign="center">
          <StackItem>
            <Text styles={starRatingLabelStyles}>{'Choose a star rating'}</Text>
          </StackItem>
        </Stack>
      </FocusZone>
    );
  }

  if (pollType === 'textInput') {
    return (
      <TextField tabIndex={-1} placeholder={textInputPlaceholder} multiline rows={3} resizable={false} width="100%" />
    );
  }

  return <></>;
};

export default OneQuestionPollInput;
