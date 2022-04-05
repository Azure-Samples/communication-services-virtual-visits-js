// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ThemeGenerator, themeRulesStandardCreator, createTheme, BaseSlots } from '@fluentui/react';
import { Theme } from '@fluentui/theme';

export function generateTheme(primaryColor: string): Theme {
  const themeRules = themeRulesStandardCreator();
  ThemeGenerator.setSlot(themeRules[BaseSlots[BaseSlots.primaryColor]], primaryColor, false, true, true);
  ThemeGenerator.insureSlots(themeRules, false);
  const themeAsJson = ThemeGenerator.getThemeAsJson(themeRules);
  return createTheme({ ...{ palette: themeAsJson } });
}
