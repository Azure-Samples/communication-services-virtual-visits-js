// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { getApplicationName, getApplicationVersion } from './GetAppInfo';

describe('GetAppInfo', () => {
    describe('getApplicationName', () => {
        it('should return correct app name', () => {
            const result = getApplicationName();
            expect(result).toBe('virtualvisits');
        });
    });

    describe('getApplicationVersion', () => {
        it('should return valid version syntax', () => {
            const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/i;
            const result = getApplicationVersion() as string;
            expect(result).toBeDefined();
            expect(SEMVER_REGEX.test(result)).toBe(true);
        });
    });
});