// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { fireEvent, render } from '@testing-library/react';
import { OneQuestionPollInput } from './OneQuestionPollInput';
import React from 'react';

describe('OneQuestionPollInput', () => {
  it('should trigger setPollResponse when like selected', async () => {
    const mockPollType = 'likeOrDislike';
    const mockTextInputPlaceholder = 'mock';
    const mockSetPollResponse = jest.fn();

    const onQuestionPollInput = await render(
      <OneQuestionPollInput
        pollType={mockPollType}
        textInputPlaceholder={mockTextInputPlaceholder}
        setPollResponse={mockSetPollResponse}
      />
    );
    const iconButton = onQuestionPollInput.getAllByRole('button');
    expect(iconButton.length).toBe(2);
    React.act(() => {
      fireEvent.click(iconButton[0]);
    });
    expect(mockSetPollResponse).toBeCalledWith(true);
  });

  it('should trigger setPollResponse when rating changed', async () => {
    const mockPollType = 'rating';
    const mockTextInputPlaceholder = 'mock';
    const mockSetPollResponse = jest.fn();

    const onQuestionPollInput = await render(
      <OneQuestionPollInput
        pollType={mockPollType}
        textInputPlaceholder={mockTextInputPlaceholder}
        setPollResponse={mockSetPollResponse}
      />
    );
    const ratings = onQuestionPollInput.getAllByRole('radio');
    React.act(() => {
      fireEvent.click(ratings[0]);
    });
    expect(mockSetPollResponse).toBeCalled();
  });

  it('should trigger setPollResponse when TextField changed', async () => {
    const mockPollType = 'text';
    const mockTextInputPlaceholder = 'mock';
    const mockSetPollResponse = jest.fn();

    const onQuestionPollInput = await render(
      <OneQuestionPollInput
        pollType={mockPollType}
        textInputPlaceholder={mockTextInputPlaceholder}
        setPollResponse={mockSetPollResponse}
      />
    );
    const textField = onQuestionPollInput.getByRole('textbox');
    React.act(() => {
      fireEvent.change(textField, { target: { value: 'Changed' } });
    });
    expect(mockSetPollResponse).toBeCalledWith('Changed');
  });
});
