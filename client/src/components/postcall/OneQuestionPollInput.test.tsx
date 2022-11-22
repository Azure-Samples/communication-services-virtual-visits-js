// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { OneQuestionPollInput, OneQuestionPollInputProps } from './OneQuestionPollInput';
import { mount } from 'enzyme';
import { IconButton, Rating, TextField } from '@fluentui/react';

describe('OneQuestionPollInput', () => {
  it('should trigger setPollResponse when like selected', async () => {
    const mockPollType = 'likeOrDislike';
    const mockTextInputPlaceholder = 'mock';
    const mockSetPollResponse = jest.fn();

    const onQuestionPollInput = await mount<OneQuestionPollInputProps>(
      <OneQuestionPollInput
        pollType={mockPollType}
        textInputPlaceholder={mockTextInputPlaceholder}
        setPollResponse={mockSetPollResponse}
      />
    );
    const iconButton = onQuestionPollInput.find(IconButton);
    expect(iconButton.length).toBe(2);
    iconButton.first().simulate('click');
    expect(mockSetPollResponse).toBeCalledWith(true);
  });

  it('should trigger setPollResponse when rating changed', async () => {
    const mockPollType = 'rating';
    const mockTextInputPlaceholder = 'mock';
    const mockSetPollResponse = jest.fn();

    const onQuestionPollInput = await mount<OneQuestionPollInputProps>(
      <OneQuestionPollInput
        pollType={mockPollType}
        textInputPlaceholder={mockTextInputPlaceholder}
        setPollResponse={mockSetPollResponse}
      />
    );
    const rating = onQuestionPollInput.find(Rating);
    expect(rating.length).toBe(1);
    rating.simulate('change');
    expect(mockSetPollResponse).toBeCalled();
  });

  it('should trigger setPollResponse when TextField changed', async () => {
    const mockPollType = 'text';
    const mockTextInputPlaceholder = 'mock';
    const mockSetPollResponse = jest.fn();

    const onQuestionPollInput = await mount<OneQuestionPollInputProps>(
      <OneQuestionPollInput
        pollType={mockPollType}
        textInputPlaceholder={mockTextInputPlaceholder}
        setPollResponse={mockSetPollResponse}
      />
    );
    const textField = onQuestionPollInput.find(TextField);
    expect(textField.length).toBe(1);
    textField
      .first()
      .find('textarea')
      .simulate('change', { target: { value: 'Changed' } });
    expect(mockSetPollResponse).toBeCalledWith('Changed');
  });
});
