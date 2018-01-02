# ORBS: Off-Roku BrightScript
An interpreter for the BrightScript language that runs on non-Roku platforms.

## Installation
ORBS is published as a `node` package, so use `npm`:

```shell
$ npm install -g orbs
```

or `yarn` if that's your preference:

```shell
$ yarn global add orbs
```

## Usage
This repo provides the `orbs` executable, which operates in two ways.

### REPL
An interactive BrightScript REPL (Read-Execute-Print Loop) is available by running `orbs` with no arguments, e.g.:

```
$ orbs
ORBS> ?"Dennis Ritchie said ""Hello, World!"""
Dennis Ritchie said "Hello, World!"
```

Quit by entering `^D` (Control-D).

### Executing a file
ORBS can execute an arbitrary BrightScript file as well!  Simply pass the file to the `orbs` executable, e.g.:

```
$ cat hello-world.brs
?"Dennis Ritchie said ""Hello, World!"""

$ orbs hello-world.brs
Dennis Ritchie said "Hello, World!"
```

## Sure, but why?
The [Roku](https://roku.com) series of media streaming devices are wildly popular amongst consumers, and several [very](https://netflix.com) [popular](https://hulu.com) [streaming](https://amazon.com/primevideo) [services](https://crackle.com) offer Channels for the Roku platform.  Unfortunately, Roku chanels *must* be written in a language called BrightScript, which is only executable directly on a Roku device.  ORBS hopes to change that by allowing Roku developers to test their code on their own machines, thus improving the quality of their channels and the end-user's experience as a whole.

## So can I use this to watch TV without a Roku?
Nope!  The ORBS project currently has no intention of emulating the Roku user interface, integrating with the Roku store, or emulating content playback.  In addition to likely getting this project in legal trouble, that sort of emulation is a ton of work.  ORBS isn't mature enough to be able to sustain that yet.

## Building from source
ORBS follows pretty standard `node` development patterns, with the caveat that it uses `yarn` for dependency management.

### Prerequisites
ORBS builds (and runs) in `node`, so you'll need to [install that first](https://nodejs.org).

Once that's ready, install [yarn](https://yarnpkg.com).  Installing it with `npm` is probably the simplest:

```shell
$ npm install -g yarn
```
### Setup
1. Clone this repo:
   ```
   $ git clone https://github.com/sjbarag/orbs.git
   ```

2. Install dependencies:
    ```shell
    $ yarn install     # or just `yarn`
    ```

3. Get `orbs` onto your `PATH`:
    ``` shell
    $ yarn link
    ```
### The build-test-clean dance
#### Build
Yarn's written in TypeScript, so it needs to be compiled before it can be executed.  `yarn build` compiles files in `src/` into JavaScript and TypeScript declarations, and puts them in `lib/` and `types/` respectively.

```shell
$ yarn build

$ ls lib/
index.js (and friends)

$ ls types/
index.d.ts (and friends)
```

#### Testing
Tests are written with [Facebook's Jest](http://facebook.github.io/jest/), and can be run with the `test` target:

```shell
$ yarn test

# tests start running
```

#### Cleaning
Compiled output in `lib/` and `types/` can be removed with the `clean` target:

```shell
$ yarn clean

$ ls lib/
ls: cannot access 'lib': No such file or directory

$ ls types/
ls: cannot access 'types': No such file or directory
```
