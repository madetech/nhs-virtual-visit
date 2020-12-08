## [0.5.2](https://github.com/madetech/nhs-virtual-visit/compare/v0.5.1...v0.5.2) (2020-12-08)


### Bug Fixes

* default ENABLE_UR_QUESTION to be disabled unless explicitly set to 'yes' ([3109710](https://github.com/madetech/nhs-virtual-visit/commit/31097108692d17b60d934d9bf4efddac919d8a31))
* navigate after submitting ur question results, improve testability, correct page formatting ([b488cd7](https://github.com/madetech/nhs-virtual-visit/commit/b488cd76406caf547d15f5e7c8c5e36b361d231d))
* stop ci failing due to environment variables not being correctly set ([15b9214](https://github.com/madetech/nhs-virtual-visit/commit/15b921428d23097e4d6f626e7944313dda470d87))



## [0.5.1](https://github.com/madetech/nhs-virtual-visit/compare/v0.5.0...v0.5.1) (2020-11-16)


### Bug Fixes

* make setup dev db work for docker-compose ([58f228d](https://github.com/madetech/nhs-virtual-visit/commit/58f228df9783b82b56bc1379168cd35cbd08847d))



# [0.5.0](https://github.com/madetech/nhs-virtual-visit/compare/v0.4.0...v0.5.0) (2020-11-12)


### Features

* add redirection behaviour for dedicated UR question page ([d0f6e0f](https://github.com/madetech/nhs-virtual-visit/commit/d0f6e0f46365f2fd28b067f3fe1be3ebe4bf303d))



# [0.4.0](https://github.com/madetech/nhs-virtual-visit/compare/v0.3.0...v0.4.0) (2020-11-12)


### Bug Fixes

* broken ur question submission url test ([b6fa7f9](https://github.com/madetech/nhs-virtual-visit/commit/b6fa7f965eea552c7b3a874b14461cf20899efc9))
* conventional-commits is no longer partially installed ([6442acd](https://github.com/madetech/nhs-virtual-visit/commit/6442acde6dc5fcd9de5347aa38909b26bfaf084b))
* Make docker-compose work locally and automatically setup the database ([c49cb52](https://github.com/madetech/nhs-virtual-visit/commit/c49cb522872eb161366ef637b65dabc98545ea2e))
* put UR question functionality behind feature flag to avoid breaking tests unnecessarily ([3e55d9a](https://github.com/madetech/nhs-virtual-visit/commit/3e55d9a6283314daf0541f1be7e0bb4f824cb11d))
* Remove not null constraint from patient_name field ([f600605](https://github.com/madetech/nhs-virtual-visit/commit/f600605e70ca644cc744f9181e0c388697045339))
* Remove not null constraint from visitor_name field ([dfebb66](https://github.com/madetech/nhs-virtual-visit/commit/dfebb66e6f79df8dea29f1e7e4683ab9298c4a2b))


### Features

* added husky commit msg hook ([965d9ca](https://github.com/madetech/nhs-virtual-visit/commit/965d9ca13ba7c942650ee37788814e888de3ccd0))



# [0.3.0](https://github.com/madetech/nhs-virtual-visit/compare/v0.2.0...v0.3.0) (2020-11-11)


### Bug Fixes

* added the changelog id to the conventional commit action ([3a06460](https://github.com/madetech/nhs-virtual-visit/commit/3a06460fd2455dc60a247721c480043089d19cdb))
* fixing yml, misusing - ([50cb19a](https://github.com/madetech/nhs-virtual-visit/commit/50cb19ada46b1a8425dcaca80164726828b22d8d))
* id in the wrong place in build file ([793b70c](https://github.com/madetech/nhs-virtual-visit/commit/793b70cd3c8924ba2dfca3e6f64b9ba002891382))
* ignored a test that is really intermitted ([682bfb5](https://github.com/madetech/nhs-virtual-visit/commit/682bfb5432674861bc92958f39f459ea7a46ffc6))
* Increase timeout temporarily for flaky cypress test ([c270054](https://github.com/madetech/nhs-virtual-visit/commit/c270054f01403a1daf6a1ff5c7243faf96a9a68e))
* reignored the test, will fix properly tomorrow ([d368eb0](https://github.com/madetech/nhs-virtual-visit/commit/d368eb029d94a65a7b9cd3c7990678450058e80f))
* unignored the test as a different fix made it in ([25778cb](https://github.com/madetech/nhs-virtual-visit/commit/25778cbe6c3ac4892352cd707db8dc3c1f57afe7))


### Features

* a feature file added to test feature ([c51228d](https://github.com/madetech/nhs-virtual-visit/commit/c51228d1acad778c376b401db1086ea1855220be))



