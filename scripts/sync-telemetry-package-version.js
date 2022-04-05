// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..')
const CLIENT_DIR = path.join(ROOT, 'client');
const PACKAGE_JSON = path.join(CLIENT_DIR, 'package.json');
const GENERATED_FILE = path.join(CLIENT_DIR, 'src', 'telemetryAppInfo.ts')

function readPackageVersion(packageJSON) {
    const parsed = JSON.parse(fs.readFileSync(packageJSON));
    const version = parsed['version'];
    if (!version) {
        throw new Error('Malformed version in ' + packageJSON);
    }
    return version;
}

function _generateTelemetryVersionFile(filePath, packageVersion) {
    fs.writeFileSync(
        filePath,
        '// Copyright (c) Microsoft Corporation.\n' +
        '// Licensed under the MIT license.\n' +
        '\n' +
        '// GENERATED FILE. DO NOT EDIT MANUALLY.\n' +
        '\n' +
        'export const appName = \''+ 'virtualvisits' +'\';\n' +
        'export const appVersion = \''+ packageVersion +'\';\n'
    );
}

function main() {
    const version = readPackageVersion(PACKAGE_JSON);
    _generateTelemetryVersionFile(GENERATED_FILE, version);
    console.log('Wrote version ' + version + ' to ' + GENERATED_FILE);
}

main();