---
title: "Compatibility and Contribution Guide"
description: "AngularFire, Angular, and Firebase JS SDK compatibility from Angular 12 onward, plus guidance for contributing to AngularFire."
category: "Getting Started"
order: 2
---

## Compatibility

The matrix lists the AngularFire release line published for each Angular major and the Firebase JavaScript SDK version range declared by that AngularFire package. AngularFire 7.6.1 supports Angular 12 through 16; AngularFire 16 and later use matching Angular major versions.

| AngularFire | Angular | Firebase |
| :--- | :--- | :--- |
| [22.0.0-rc.0](https://www.npmjs.com/package/@angular/fire/v/22.0.0-rc.0) (pre-release) | `^22` | `^12.18.0` |
| [21.0.0](https://www.npmjs.com/package/@angular/fire/v/21.0.0) | `^21.2.0` | `^12.18.0` |
| [20.1.1](https://www.npmjs.com/package/@angular/fire/v/20.1.1) | `^20` | `^11.8.0` |
| [19.2.0](https://www.npmjs.com/package/@angular/fire/v/19.2.0) | `^19` | `^11.8.0` |
| [18.0.1](https://www.npmjs.com/package/@angular/fire/v/18.0.1) | `^18` | `^10.12.0` |
| [17.1.0](https://www.npmjs.com/package/@angular/fire/v/17.1.0) | `^17` | `^10.12.0` |
| [16.0.0](https://www.npmjs.com/package/@angular/fire/v/16.0.0) | `^16` | `^10.5.0` |
| [7.6.1](https://www.npmjs.com/package/@angular/fire/v/7.6.1) | `^12-^15` | `^9.8.0` |

Firebase ranges use npm semver notation. The AngularFire 21 and 22 entries are pre-release builds, not stable releases. The supported Angular and Firebase versions are defined by each linked package's metadata; check it before upgrading because compatibility can change between releases.

## Contributing to AngularFire

AngularFire is developed in the [angular/angularfire repository](https://github.com/angular/angularfire). Before starting, read the repository's [contribution guide](https://github.com/angular/angularfire/blob/main/CONTRIBUTING.md), which has the current setup, testing, and pull-request requirements.

A typical contribution flow is:

1. Search existing issues and pull requests. Discuss a major feature proposal in an issue before implementing it.
2. Fork the repository, clone your fork, install dependencies, and create a branch for your change.
3. Make the change with appropriate tests, then follow the contribution guide to build and run the test suite.
4. Submit a pull request to the main repository. Follow the guide's submission instructions, including its contributor license agreement requirements.

For usage questions, use AngularFire's [GitHub Discussions](https://github.com/angular/angularfire/discussions); reserve issues for bugs and feature proposals.
