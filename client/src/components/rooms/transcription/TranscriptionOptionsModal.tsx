// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  DefaultButton,
  Dropdown,
  IconButton,
  IDropdownStyles,
  Modal,
  PrimaryButton,
  Stack,
  Text,
  useTheme
} from '@fluentui/react';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { LocaleCode, localeDisplayNames } from '../../../utils/CallAutomationUtils';
import { useState } from 'react';

export interface TranscriptionModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  startTranscription: (locale: LocaleCode) => Promise<void>;
  transcriptionStartedByYou: React.MutableRefObject<boolean>;
}

export const TranscriptionOptionsModal = (props: TranscriptionModalProps): JSX.Element => {
  const { isOpen, setIsOpen, startTranscription, transcriptionStartedByYou } = props;
  const [currentLanguage, setCurrentLanguage] = useState<LocaleCode>('en-US');

  const theme = useTheme();
  const dropdownOptions = Object.keys(localeDisplayNames).map((key) => ({
    key,
    text: localeDisplayNames[key as LocaleCode]
  }));
  return (
    <Modal
      isOpen={isOpen}
      isBlocking={false}
      onDismiss={() => {
        setIsOpen(false);
      }}
      styles={{ main: { maxWidth: '27.5rem', height: '16.75rem' } }}
    >
      <Stack tokens={{ childrenGap: '1.5rem' }} styles={{ root: { margin: '1.5rem' } }}>
        <Stack horizontal verticalAlign="center" style={{ position: 'relative' }} tokens={{ childrenGap: '0.5rem' }}>
          <Text style={{ fontWeight: 600, fontSize: '1.25rem' }}>What language is being spoken?</Text>
          <IconButton
            style={{ right: 0 }}
            onRenderIcon={() => <Dismiss20Regular style={{ color: theme.palette.neutralPrimary }} />}
            onClick={() => {
              setIsOpen(false);
            }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: '0.25rem' }}>
          <Dropdown
            options={dropdownOptions}
            styles={dropdownStyles}
            placeholder={localeDisplayNames[currentLanguage]}
            onChange={(_, option) => {
              if (option) {
                setCurrentLanguage(option.key as LocaleCode);
              }
            }}
            label={'Spoken Language'}
            selectedKey={currentLanguage}
          ></Dropdown>
          <Text style={{ fontSize: '0.75rem', color: theme.palette.neutralSecondary }}>
            Language that everyone on this call is speaking.
          </Text>
        </Stack>
        <Stack horizontal tokens={{ childrenGap: '0.5rem' }} horizontalAlign="end" style={{ paddingTop: '1.5rem' }}>
          <PrimaryButton
            onClick={() => {
              startTranscription(currentLanguage)
                .then(() => {
                  setIsOpen(false);
                  transcriptionStartedByYou.current = true;
                })
                .catch((error) => {
                  if (error.message === 'Transcription already started') {
                    setIsOpen(false);
                    return;
                  }
                  console.error('Error starting transcription:', error);
                  setIsOpen(false);
                });
            }}
          >
            Confirm
          </PrimaryButton>
          <DefaultButton
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Cancel
          </DefaultButton>
        </Stack>
      </Stack>
    </Modal>
  );
};

const dropdownStyles: Partial<IDropdownStyles> = {
  callout: {
    height: '25rem'
  }
};
