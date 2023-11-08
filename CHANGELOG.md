# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).



## [0.45.2](https://github.com/rokucommunity/brs/compare/v0.45.1...v0.45.2) - 2023-11-07
### Added
 - logic for optional chaining ([#21](https://github.com/rokucommunity/brs/pull/21))
### Fixed
 - fix(parser): Wrong negative sign precedence was causing math errors (#6) ([#24](https://github.com/rokucommunity/brs/pull/24))
 - fix(interp): Preventing multiple calls for dot-chained methods ([#22](https://github.com/rokucommunity/brs/pull/22))



## [0.45.1](https://github.com/rokucommunity/brighterscript/compare/v0.45.0...v0.45.1) - 2023-09-08
### Changed
 - This is the first release of the RokuCommunity fork of this project
 - remove yarn in favor of npm ([#1](https://github.com/rokucommunity/brs/pull/1))
### Fixed
 - Fixed `val()` edge cases: hex without radix and `NaN` ([#3](https://github.com/rokucommunity/brs/pull/3))
