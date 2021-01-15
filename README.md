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
      - [All Together](#all-together)
  - [Gaps](#gaps)
  - [Extensions](#extensions)
    - [`_brs_.getStackTrace(numEntries = 10, excludePatterns = [])`](#_brs_getstacktracenumentries--10-excludepatterns--)
    - [`_brs_.global`](#_brs_global)
    - [`_brs_.mockComponent(componentName as string, impl as AssocArray)`](#_brs_mockcomponentcomponentname-as-string-impl-as-assocarray)
    - [`_brs_.mockFunction(funcName as string, impl as Function)`](#_brs_mockfunctionfuncname-as-string-impl-as-function)
      - [Mock Function API](#mock-function-api)
        - [`mock.calls`](#mockcalls)
        - [`mock.clearMock()`](#mockclearmock)
        - [`mock.getMockName()`](#mockgetmockname)
        - [`mock.results`](#mockresults)
    - [`_brs_.process`](#_brs_process)
    - [`_brs_.resetMockComponent(componentName as string)`](#_brs_resetmockcomponentcomponentname-as-string)
    - [`_brs_.resetMockComponents()`](#_brs_resetmockcomponents)
    - [`_brs_.resetMockFunction(funcName as string)`](#_brs_resetmockfunctionfuncname-as-string)
    - [`_brs_.resetMockFunctions()`](#_brs_resetmockfunctions)
    - [`_brs_.resetMocks()`](#_brs_resetmocks)
    - [`_brs_.runInScope(filePath as string, mainArgs as AssocArray)`](#_brs_runinscopefilepath-as-string-mainargs-as-assocarray)
    - [`_brs_.triggerKeyEvent(key as string, press as boolean)`](#_brs_triggerkeyeventkey-as-string-press-as-boolean)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# BRS: Off-Roku BrightScript
An interpreter for the BrightScript language that runs on non-Roku platforms.

[![CircleCI](https://circleci.com/gh/sjbarag/brs.svg?style=svg)](https://circleci.com/gh/sjbarag/brs)
[![NPM Version](https://badge.fury.io/js/brs.svg?style=flat)](https://npmjs.org/package/brs)

## Installation
The BRS project is published as a `node` package, so use `npm`:

```shell
$ npm install -g brs
```

or `yarn` if that's your preference:

```shell
$ yarn global add brs
```

## Usage
This repo provides the `brs` executable, which operates in two ways.

### REPL
An interactive BrightScript REPL (Read-Execute-Print Loop) is available by running `brs` with no arguments, e.g.:

```
$ brs
brs> ?"Dennis Ritchie said ""Hello, World!"""
Dennis Ritchie said "Hello, World!"
```

Quit by entering `^D` (Control-D).

### Executing a file
BRS can execute an arbitrary BrightScript file as well!  Simply pass the file to the `brs` executable, e.g.:

```
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

Once that's ready, install [yarn](https://yarnpkg.com).  Installing it with `npm` is probably the simplest:

```shell
$ npm install -g yarn
```
### Setup
1. Clone this repo:
   ```
   $ git clone https://github.com/sjbarag/brs.git
   ```

2. Install dependencies:
    ```shell
    $ yarn install     # or just `yarn`
    ```

3. Get `brs` onto your `PATH`:
    ``` shell
    $ yarn link
    ```
### The build-test-clean dance
#### Build
This project is written in TypeScript, so it needs to be compiled before it can be executed.  `yarn build` compiles files in `src/` into JavaScript and TypeScript declarations, and puts them in `lib/` and `types/` respectively.

```shell
$ yarn build

$ ls lib/
index.js (and friends)

$ ls types/
index.d.ts (and friends)
```

Alternatively, you can run the build step in "watch" mode. This will run `yarn build` for you automatically, every time it detects source file changes:
```shell
$ yarn watch
```
This is often useful for testing that local changes work in your BrightScript project, without having to run `yarn build` over and over.

#### Testing
Tests are written in plain-old JavaScript with [Facebook's Jest](http://facebook.github.io/jest/), and can be run with the `test` target:

```shell
$ yarn test

# tests start running
```

Note that only test files ending in `.test.js` will be executed by `yarn test`.

#### Cleaning
Compiled output in `lib/` and `types/` can be removed with the `clean` target:

```shell
$ yarn clean

$ ls lib/
ls: cannot access 'lib': No such file or directory

$ ls types/
ls: cannot access 'types': No such file or directory
```

#### All Together
Thanks to the [npm-run-all](https://www.npmjs.com/package/npm-run-all) package, it's trivially easy to combine these into a sequence of tasks without relying on shell semantics:

```shell
$ yarn run-s clean build test
```

## Gaps
The API provided to BrightScript developers is quite large, and implementing it in its entirety is a daunting task.  Parts in the standard library included with the Reference BrightScript Implementation (RBI) are [listed in NotImplemented.md](./docs/NotImplemented.md).

## Extensions

For the most part, `brs` attempts to emulate BrightScript as closely as possible. However, in the spirit of unit testing, it also has a few extensions that will help with testing.

### `_brs_.getStackTrace(numEntries = 10, excludePatterns = [])`

Prints out the stack trace. You can configure how many lines to print, and also use the `excludePatterns` arg, which is an **array of strings**, to exclude files/folders from being included in the trace. *Note: this function internally uses the [Javascript regex engine](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) to match the strings, not [Brightscript PCRE](https://developer.roku.com/en-ca/docs/references/brightscript/components/roregex.md).*

```brs
print _brs_.getStackTrace()
' [
'     "test/baz.test.brs:1:10",
'     "lib/utils.brs:25:4",
'     "foo/baz.brs:50:29"
' ]

print _brs_.getStackTrace(1)
' [
'     "test/baz.test.brs:1:10",
' ]

print _brs_.getStackTrace(10, ["lib"])
' [
'     "test/baz.test.brs:1:10",
'     "foo/baz.brs:50:29"
' ]
```

### `_brs_.global`

Allows you to access `m.global` from inside your unit tests. Usage:

```brightscript
print _brs_.global
' {
'   someGlobalField: "someGlobalValue"
' }
```

### `_brs_.mockComponent(componentName as string, impl as AssocArray)`

Allows you to mock a component. Usage:

```brightscript
_brs_.mockComponent("ComponentName", {
    someField: "foobar",
    someFunc: sub()
      return 123
    end sub
})
```

### `_brs_.mockFunction(funcName as string, impl as Function)`

Allows you to mock a function. It also returns an associative array mock function (also known as a "spy" or "stub") that keeps track of calls and return values. Usage:

```brightscript
mock = _brs_.mockFunction("FunctionName", sub()
    print "foobar"
end sub)
```

#### Mock Function API

The Mock Function API is modeled after [Jest's `mockFn` API](https://jestjs.io/docs/en/mock-function-api). Methods:

##### `mock.calls`

An array containing the arguments of each call to this function. Each item in the array is an array of the arguments for that call.

For example:
```brightscript
mock = _brs_.mockFunction("fooBar", function(arg1 as string, arg2 as integer)
    print "fooBar"
end function)

fooBar("baz", 123)
print mock.calls
' [
'     ["baz", 123]
' ]

fooBar("lorem", 456)
print mock.calls
' [
'     ["baz", 123]
'     ["lorem", 456]
' ]
```

##### `mock.clearMock()`

Clears the `calls` and `results` arrays. Does not affect the mock implementation.

```brightscript
mock = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)

fooBar()
print mock.calls.count()   ' => 1
print mock.results.count() ' => 1

mock.clearMock()
print mock.calls.count()   ' => 0
print mock.results.count() ' => 0
```

##### `mock.getMockName()`

Returns the name of the mocked function.

```brightscript
mock = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)

print mock.getMockName() ' => "fooBar"
```

##### `mock.results`

An array containing the return value for each call to this function. For example:

```brightscript
mock = _brs_.mockFunction("fooBar", function(arg as boolean)
    if arg then return "foo" : else return "bar" : end if
end function)

fooBar(true)
print mock.results ' => [ "foo" ]

fooBar(false)
print mock.results ' => [ "foo", "bar" ]
```

### `_brs_.process`

Allows you to access the command line arguments and locale. Locale changes will be reflected in related `RoDeviceInfo` functions and the standard library `Tr` function. Usage:

```brightscript
print _brs_.process
' {
'   argv: [ "some", "arg" ],
'   getLocale: [Function getLocale]
'   setLocale: [Function setLocale]
' }

_brs_.process.setLocale("fr_CA")
print _brs_.process.getLocale() ' => "fr_CA"
print createObject("roDeviceInfo").getCurrentLocale() ' => "fr_CA"
```

### `_brs_.resetMockComponent(componentName as string)`

Resets a specific component mock. Works on both partially mocked and fully mocked components. Usage:

```brightscript
_brs_.resetMockComponent("MyComponent")
```

### `_brs_.resetMockComponents()`

Resets all component mocks. Usage:

```brightscript
_brs_.resetMockComponents()
```

### `_brs_.resetMockFunction(funcName as string)`

Resets a specific function mock. Usage:

```brightscript
_brs_.resetMockFunction("MyFunction")
```

**Note:** If you have a mocked component that has a function with the same name, this _will not_ reset that component member function. For example:

```brightscript
_brs_.mockComponent("Component", {
    foo: sub()
        print "mock component foo"
    end sub
})
_brs_.mockFunction("foo", sub()
    print "mock global foo"
end sub)

node = createObject("roSGNode", "Component")
foo() ' => "mock global foo"
node.foo() ' => "mock component foo"

_brs_.resetMockFunction("foo")
foo() ' => "original implementation"
node.foo() ' => "mock component foo"
```

### `_brs_.resetMockFunctions()`

Resets all function mocks. Usage:

```brightscript
_brs_.resetMockFunctions()
```

### `_brs_.resetMocks()`

Resets all component and function mocks. Usage:

```brightscript
_brs_.resetMocks()
```

### `_brs_.runInScope(filePath as string, mainArgs as AssocArray)`

Runs a file (or set of files) **in the current global + module scope** with the provided arguments, returning either the value returned by those files' `main` function or `invalid` if an error occurs.

```brightscript
_brs_.runInScope("/path/to/myFile.brs", { foo: "bar" })
```

### `_brs_.triggerKeyEvent(key as string, press as boolean)`

This will call `onKeyEvent` handlers up the focus chain until the event is handled. If there is no focused component, nothing will happen (which is how RBI behaves). Usage:

```brs
_brs_.triggerKeyEvent("OK", true)
```
