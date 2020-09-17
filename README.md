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
Nope!  The BRS project currently has no intention of emulating the Roku user interface, integrating with the Roku store, or emulating content playback.  In addition to likely getting this project in legal trouble, that sort of emulation is a ton of work.  BRS isn't mature enough to be able to sustain that yet.

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

## Extensions

For the most part, `brs` attempts to emulate BrightScript as closely as possible. However, in the spirit of unit testing, it also has a few extensions that will help with testing.

### `_brs_.process`

Allows you to access the command line arguments. Usage:

```brightscript
print _brs_.process
' {
'   argv: [ "some", "arg" ]
' }
```

### `_brs_.global`

Allows you to access `m.global` from inside your unit tests. Usage:

```brightscript
print _brs_.global
' {
'   someGlobalField: "someGlobalValue"
' }
```

### `_brs_.runInScope`

Runs a file (or set of files) **in the current global + module scope** with the provided arguments, returning either the value returned by those files' `main` function or `invalid` if an error occurs.

```brightscript
_brs_.runInScope("/path/to/myFile.brs", { foo: "bar" })
```

### `_brs_.mockComponent`

Allows you to mock a component. Usage:

```brightscript
_brs_.mockComponent("ComponentName", {
    someField: "foobar",
    someFunc: sub()
      return 123
    end sub
})
```

### `_brs_.mockFunction`

Allows you to mock a function. It also returns an associative array "spy" that keeps track of calls and return values. Usage:

```brightscript
spy = _brs_.mockFunction("FunctionName", sub()
    print "foobar"
end sub)
```

#### Spy API

The Spy API is modeled after [Jest's `mockFn` API](https://jestjs.io/docs/en/mock-function-api). Methods:

##### `spy.calls`

An array containing the arguments of each call to this function. Each item in the array is an array of the arguments for that call.

For example:
```brightscript
spy = _brs_.mockFunction("fooBar", function(arg1 as string, arg2 as integer)
    print "fooBar"
end function)

fooBar("baz", 123)
print spy.calls
' [
'     ["baz", 123]
' ]

fooBar("lorem", 456)
print spy.calls
' [
'     ["baz", 123]
'     ["lorem", 456]
' ]
```

##### `spy.results`

An array containing the return value for each call to this function. For example:

```brightscript
spy = _brs_.mockFunction("fooBar", function(arg as boolean)
    if arg then return "foo" : else return "bar" : end if
end function)

fooBar(true)
print spy.results ' => [ "foo" ]

fooBar(false)
print spy.results ' => [ "foo", "bar" ]
```

##### `spy.clearMock()`

Clears the `calls` and `results` arrays. Does not affect the mock implementation.

```brightscript
spy = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)

fooBar()
print spy.calls.count()   ' => 1
print spy.results.count() ' => 1

spy.clearMock()
print spy.calls.count()   ' => 0
print spy.results.count() ' => 0
```

##### `spy.getMockName()`

Returns the name of the mocked function.

```brightscript
spy = _brs_.mockFunction("fooBar", function()
    return "hello, world"
end function)

print spy.getMockName() ' => "fooBar"
```

### `_brs_.resetMocks`

Resets all component and function mocks. Usage:

```brightscript
_brs_.resetMocks()
```

### `_brs_.resetMockComponents`

Resets all component mocks. Usage:

```brightscript
_brs_.resetMockComponents()
```

### `_brs_.resetMockFunctions`

Resets all function mocks. Usage:

```brightscript
_brs_.resetMockFunctions()
```
