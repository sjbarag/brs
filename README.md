<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [BRS: Off-Roku BrightScript](#brs-off-roku-brightscript)
  - [Installation](#installation)
  - [Usage](#usage)
    - [REPL](#repl)
    - [Executing a file](#executing-a-file)
  - [Sure, but why?](#sure-but-why)
  - [So can I use this to watch TV without a Roku?](#so-can-i-use-this-to-watch-tv-without-a-roku)
  - [Building from source](#building-from-source)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [The build-test-clean dance](#the-build-test-clean-dance)
      - [Build](#build)
      - [Testing](#testing)
      - [Cleaning](#cleaning)
  - [Documentation](#documentation)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# BRS: Off-Roku BrightScript

An interpreter for the BrightScript language that runs on non-Roku platforms.

[![build status](https://img.shields.io/github/actions/workflow/status/rokucommunity/brs/build.yml?branch=master&logo=github)](https://github.com/rokucommunity/brs/actions?query=branch%3Amaster+workflow%3Abuild)
[![coverage status](https://img.shields.io/coveralls/github/rokucommunity/brs?logo=coveralls)](https://coveralls.io/github/rokucommunity/brs?branch=master)
[![monthly downloads](https://img.shields.io/npm/dm/@rokucommunity/brs.svg?sanitize=true&logo=npm&logoColor=)](https://npmcharts.com/compare/@rokucommunity/brs?minimal=true)
[![npm version](https://img.shields.io/npm/v/@rokucommunity/brs.svg?logo=npm)](https://www.npmjs.com/package/@rokucommunity/brs)
[![license](https://img.shields.io/github/license/rokucommunity/brs.svg)](LICENSE)
[![Slack](https://img.shields.io/badge/Slack-RokuCommunity-4A154B?logo=slack)](https://join.slack.com/t/rokudevelopers/shared_invite/zt-4vw7rg6v-NH46oY7hTktpRIBM_zGvwA)

**NOTE:** Development on the original [brs](https://github.com/sjbarag/brs) project stalled in September of 2021. We at RokuCommunity believe in the vision of [brs](https://github.com/sjbarag/brs), so after [some discussions with the original author](https://github.com/sjbarag/brs/issues/681), we decided to fork the project in order to ensure its continued development. 

## Installation

The BRS project is published as a `node` package, so use `npm`:

```shell
$ npm install -g @rokucommunity/brs
```

## Usage

This repo provides the `brs` executable, which operates in two ways.

### REPL

An interactive BrightScript REPL (Read-Execute-Print Loop) is available by running `brs` with no arguments, e.g.:

```shell
$ brs
brs> ?"Dennis Ritchie said ""Hello, World!"""
Dennis Ritchie said "Hello, World!"
```

Quit by pressing `^D` (Control-D) or executing `exit`.

### Executing a file

BRS can execute an arbitrary BrightScript file as well!  Simply pass the file to the `brs` executable, e.g.:

```shell
$ cat hello-world.brs
?"Dennis Ritchie said ""Hello, World!"""

$ brs hello-world.brs
Dennis Ritchie said "Hello, World!"
```

## Sure, but why?

The [Roku](https://roku.com) series of media streaming devices are wildly popular amongst consumers, and several [very](https://netflix.com) [popular](https://hulu.com) [streaming](https://amazon.com/primevideo) [services](https://crackle.com) offer Channels for the Roku platform.  Unfortunately, Roku chanels *must* be written in a language called BrightScript, which is only executable directly on a Roku device.  BRS hopes to change that by allowing Roku developers to test their code on their own machines, thus improving the quality of their channels and the end-user's experience as a whole.

## So can I use this to watch TV without a Roku?

Nope!  The BRS project currently has no intention of emulating the Roku user interface, integrating with the Roku store, or emulating content playback.  In addition to likely getting this project in legal trouble, that sort of emulation is a ton of work.

## Building from source

The BRS project follows pretty standard `node` development patterns, with the caveat that it uses `yarn` for dependency management.

### Prerequisites

BRS builds (and runs) in `node`, so you'll need to [install that first](https://nodejs.org).

### Setup

1. Clone this repo:

   ```shell
   $ git clone https://github.com/rokucommunity/brs.git
   ```

2. Install dependencies:

    ```shell
    $ npm install
    ```

3. Get `brs` onto your `PATH`:

    ```shell
    $ npm link
    ```

### The build-test-clean dance

#### Build

This project is written in TypeScript, so it needs to be compiled before it can be executed.  `npm run build` compiles files in `src/` into JavaScript and TypeScript declarations, and puts them in `lib/` and `types/` respectively.

```shell
$ npm run build

$ ls lib/
index.js (and friends)

$ ls types/
index.d.ts (and friends)
```

Alternatively, you can run the build step in "watch" mode. This will run `npm run build` for you automatically, every time it detects source file changes:

```shell
$ npm run watch
```

This is often useful for testing that local changes work in your BrightScript project, without having to run `npm run build` over and over.

#### Testing

Tests are written in plain-old JavaScript with [Facebook's Jest](http://facebook.github.io/jest/), and can be run with the `test` target:

```shell
$ npm run test

# tests start running
```

Note that only test files ending in `.test.js` will be executed by `yarn test`.

#### Cleaning

Compiled output in `lib/` and `types/` can be removed with the `clean` target:

```shell
$ npm run clean

$ ls lib/
ls: cannot access 'lib': No such file or directory

$ ls types/
ls: cannot access 'types': No such file or directory
```

## Documentation

For the most part, `brs` attempts to emulate BrightScript as closely as possible. However, as a work in progress, there are certain implementation gaps, please refer to the [BrightScript language reference](https://developer.roku.com/docs/references/brightscript/language/brightscript-language-reference.md) and report an issue for any gaps found. Also, in the spirit of unit testing, there are a few extensions that will help with testing. All of the roca documentation for APIs, extensions, gaps, and more is hosted on the docs site, [hulu.github.io/roca](https://hulu.github.io/roca).
