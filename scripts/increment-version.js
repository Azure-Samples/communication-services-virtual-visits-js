// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..')
const CLIENT_DIR = path.join(ROOT, 'client');
const SERVER_DIR = path.join(ROOT, 'server');
const CLIENT_PACKAGE_JSON = path.join(CLIENT_DIR, 'package.json');
const SERVER_PACKAGE_JSON = path.join(SERVER_DIR, 'package.json');

const SEMVER_REGEX = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/i;

function _isValidSemVer(version) {
    return SEMVER_REGEX.test(version);
}

function getNewVersion() {
    const version = process.argv[2];
    if (!version) {
        throw new Error('Version not found');
    }
    if (!_isValidSemVer(version)) {
        throw new Error('Invalid version syntax');
    }

    return version;
}

function setPackageJSON(packageJSON) {
    const parsed = JSON.parse(fs.readFileSync(packageJSON));
    const newVersion = getNewVersion();
    parsed.version = newVersion;

    const newPackageJSON = JSON.stringify(parsed, null, 2);
    fs.writeFileSync(packageJSON, newPackageJSON);
    
    return newVersion;
}

function main() {
    const clientVersion = setPackageJSON(CLIENT_PACKAGE_JSON);
    console.log(`Wrote version ${clientVersion} to ${CLIENT_PACKAGE_JSON}`);

    const serverVersion = setPackageJSON(SERVER_PACKAGE_JSON);
    console.log(`Wrote version ${serverVersion} to ${SERVER_PACKAGE_JSON}`);
}

main();