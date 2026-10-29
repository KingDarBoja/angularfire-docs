---
title: "Compatibility and Contribution Guide"
description: "AngularFire, Angular, Firebase JS SDK, and Node.js compatibility from Angular 12 onward, plus guidance for contributing to AngularFire."
category: "Getting Started"
order: 2
---

## Compatibility

The matrix lists the AngularFire release line published for each Angular major, the Firebase JavaScript SDK version range declared by that AngularFire package, and the minimal Node.js version supported by that Firebase JS SDK version. AngularFire 7.6.1 supports Angular 12 through 16; AngularFire 16 and later use matching Angular major versions.

| AngularFire | Angular | Firebase | Min. Node.js (Firebase) |
| :--- | :--- | :--- | :--- |
| [22.0.0-rc.0](https://www.npmjs.com/package/@angular/fire/v/22.0.0-rc.0) (pre-release) | `^22` | `^12.18.0` | `^20.0.0` |
| [21.0.0](https://www.npmjs.com/package/@angular/fire/v/21.0.0) | `^21.2.0` | `^12.18.0` | `^20.0.0` |
| [20.1.1](https://www.npmjs.com/package/@angular/fire/v/20.1.1) | `^20` | `^11.8.0` | `^18.0.0` |
| [19.2.0](https://www.npmjs.com/package/@angular/fire/v/19.2.0) | `^19` | `^11.8.0` | `^18.0.0` |
| [18.0.1](https://www.npmjs.com/package/@angular/fire/v/18.0.1) | `^18` | `^10.12.0` | `^10.0.0` |
| [17.1.0](https://www.npmjs.com/package/@angular/fire/v/17.1.0) | `^17` | `^10.12.0` | `^10.0.0` |
| [16.0.0](https://www.npmjs.com/package/@angular/fire/v/16.0.0) | `^16` | `^10.5.0` | `^10.0.0` |
| [7.6.1](https://www.npmjs.com/package/@angular/fire/v/7.6.1) | `^12-^15` | `^9.8.0` | `^10.0.0` |

Firebase and Node.js ranges use npm semver notation. The AngularFire 21 and 22 entries are pre-release builds, not stable releases. The supported Angular and Firebase versions are defined by each linked package's metadata; check it before upgrading because compatibility can change between releases.

### Firebase JS SDK Node.js Support

AngularFire has supported the Firebase JS SDK Modular API since its introduction in August 2021 with Firebase JS SDK v9 per the [release notes](https://firebase.google.com/support/release-notes/js#version_900_-_august_25_2021). Both Firebase v9 and v10 rely on Node.js v10 and above based on the `package.json` engines requirement at the [v9.0.0 tag](https://github.com/firebase/firebase-js-sdk/blob/firebase%409.0.0/package.json) and [v10.0.0 tag](https://github.com/firebase/firebase-js-sdk/blob/firebase%4010.0.0/package.json).

Subsequent major releases updated the minimum Node.js engine baseline:

- **Firebase JS SDK v11**: Raised the minimal supported Node.js engine to v18 and higher (`^18.0.0 || >=20.0.0`). See the [v11 release notes](https://firebase.google.com/support/release-notes/js#version_1100_-_october_21_2024) and [v11.0.0 tag](https://github.com/firebase/firebase-js-sdk/blob/firebase%4011.0.0/package.json).
- **Firebase JS SDK v12**: Raised the minimal supported Node.js engine to v20 and higher (`^20.0.0 || >=22.0.0`). See the [v12 release notes](https://firebase.google.com/support/release-notes/js#version_1200_-_july_17_2025) and [v12.0.0 tag](https://github.com/firebase/firebase-js-sdk/blob/firebase%4012.0.0/package.json).
- **Firebase JS SDK v13**: The [v13 release notes](https://firebase.google.com/support/release-notes/js#version_1300_-_october_7_2026) do not explicitly mention the Node.js requirement change, but the [`package.json` at the v13.0.0 tag](https://github.com/firebase/firebase-js-sdk/blob/firebase%4013.0.0/package.json) defines Node.js `24.12.0` or higher (`^24.12.0 || >=26.0.0`) as the minimal supported version.

## Contributing to AngularFire

AngularFire is developed in the [angular/angularfire repository](https://github.com/angular/angularfire). Before starting, read the repository's [contribution guide](https://github.com/angular/angularfire/blob/main/CONTRIBUTING.md), which has the current setup, testing, and pull-request requirements.

A typical contribution flow is:

1. Search existing issues and pull requests. Discuss a major feature proposal in an issue before implementing it.
2. Fork the repository, clone your fork, install dependencies, and create a branch for your change.
3. Make the change with appropriate tests, then follow the contribution guide to build and run the test suite.
4. Submit a pull request to the main repository. Follow the guide's submission instructions, including its contributor license agreement requirements.

For usage questions, use AngularFire's [GitHub Discussions](https://github.com/angular/angularfire/discussions); reserve issues for bugs and feature proposals.
