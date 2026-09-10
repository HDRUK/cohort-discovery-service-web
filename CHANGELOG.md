## [1.10.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.9.0...v1.10.0) (2026-09-10)

### ✨ Features

* **DP-1019:** collection type filters in the collections filter dropdown (#497) ([938e972](https://github.com/HDRUK/cohort-discovery-service-web/commit/938e972c91f96b58decef5c2547a3260275c6fb7)), closes [DP-1019](undefinedDP-1019)
* **DP-1021:** Redesign of the query results (#485) ([5a59978](https://github.com/HDRUK/cohort-discovery-service-web/commit/5a599786009295b9524c76c3d15208b7ce5fe14e)), closes [DP-1021](undefinedDP-1021)
* **DP-1024:** Make sort button configurable and add it to term directory (#487) ([1c7c3d8](https://github.com/HDRUK/cohort-discovery-service-web/commit/1c7c3d8aaa98964fbea34e12401d47191fa0024b)), closes [DP-1024](undefinedDP-1024)
* **DP-1037:** add flag-gated location & death collection toggles (#479) ([6edb504](https://github.com/HDRUK/cohort-discovery-service-web/commit/6edb504391667ab9e99bf098d457109a8414348f)), closes [DP-1037](undefinedDP-1037) [flag-gated](undefinedgated)
* **DP-1059:** add Race demographic filter with dataset-scoped concept fetching (#474) ([1430742](https://github.com/HDRUK/cohort-discovery-service-web/commit/1430742a547e01a47f8b2348d4a7946af6837b70)), closes [DP-1059](undefinedDP-1059)
* **DP-1061:** add Location demographic filter with OpenStreetMap map (#476) ([eee2bd5](https://github.com/HDRUK/cohort-discovery-service-web/commit/eee2bd5fa0ed803579fd41495c167b420b758e31)), closes [DP-1061](undefinedDP-1061)
* **DP-1062:** show query location in results (#486) ([56e9d45](https://github.com/HDRUK/cohort-discovery-service-web/commit/56e9d45b0fc4d1175b21801280b45a268091a01c)), closes [DP-1062](undefinedDP-1062)
* **DP-1063:** show location in query preview (#477) ([6cc9e4b](https://github.com/HDRUK/cohort-discovery-service-web/commit/6cc9e4b812c1e668b082be52f2661f8c33bbe4b2)), closes [DP-1063](undefinedDP-1063)
* **DP-1092:** redesign location map picker (#489) ([5e35f9a](https://github.com/HDRUK/cohort-discovery-service-web/commit/5e35f9aea136554e82d6f5ab94e2db7087d3071b)), closes [DP-1092](undefinedDP-1092)
* **DP-1094:** truncate addresses in query preview (#492) ([09c6f28](https://github.com/HDRUK/cohort-discovery-service-web/commit/09c6f2895885e0625d47af0c5ca066c67c08dd3d)), closes [DP-1094](undefinedDP-1094)
* **DP-1099:** disable location when not enabled (#496) ([50daea8](https://github.com/HDRUK/cohort-discovery-service-web/commit/50daea81d58f747bf5964ddce48499062118d249)), closes [DP-1099](undefinedDP-1099)
* **DP-1107:** gate Race demographic filter behind feature flag (#494) ([77a861f](https://github.com/HDRUK/cohort-discovery-service-web/commit/77a861f492a4a04572cb84b2f2555ea04d121961)), closes [DP-1107](undefinedDP-1107) [gate](undefinedgate)
* **DP-1108:** Rearrange and realign of the collection settings (#495) ([30d818b](https://github.com/HDRUK/cohort-discovery-service-web/commit/30d818b4d7225359ca911b477aeba16900f70620)), closes [DP-1108](undefinedDP-1108)
* **DP-1122:** keep the demographics confirm action in view (#504) ([2a785bd](https://github.com/HDRUK/cohort-discovery-service-web/commit/2a785bd8df0e71277f2c7debc00d1bf4ac332dcb)), closes [DP-1122](undefinedDP-1122)
* **DP-1123:** collapse the demographics block when NLP pre-populates it (#505) ([bd83cf3](https://github.com/HDRUK/cohort-discovery-service-web/commit/bd83cf36ecb1b7cd2418413c4ae525ed6b1316ee)), closes [DP-1123](undefinedDP-1123)
* **DP-1129:** change death labels (#516) ([32e5969](https://github.com/HDRUK/cohort-discovery-service-web/commit/32e59698328d5021d859a2f723ed6a48ee2d16f6)), closes [DP-1129](undefinedDP-1129)
* **DP-887:** add demographic filter with Death selector (#498) ([cd6239d](https://github.com/HDRUK/cohort-discovery-service-web/commit/cd6239db928ddbd5c63d299f35d1c0b5464edd42)), closes [DP-887](undefinedDP-887)
* **DP-946:** Register clicks on links to collections (#484) ([ebb6305](https://github.com/HDRUK/cohort-discovery-service-web/commit/ebb6305985a95d81dcaacf8e9186ff091c51b185)), closes [DP-946](undefinedDP-946)

### 🐛 Bug Fixes

* **DP-1007:** fix paginated tables not resetting to page 1 when a filter or search changes (#472) ([47183af](https://github.com/HDRUK/cohort-discovery-service-web/commit/47183af420a158c1444368c3775ba19d329a0b0f))
* **DP-1060:** show demographics in query preview text everywhere (#482) ([fbcbdf7](https://github.com/HDRUK/cohort-discovery-service-web/commit/fbcbdf7b5747e106ebfed156a01b484286bae83c)), closes [DP-1060](undefinedDP-1060)
* **DP-1069:** allow query to run when only location is enabled (#481) ([24682eb](https://github.com/HDRUK/cohort-discovery-service-web/commit/24682eb818d20db9a2be589c31647120a8f8b6ba)), closes [DP-1069](undefinedDP-1069)
* **DP-1073:** populate location/death collection toggles from fetched value (#483) ([ab2d4d1](https://github.com/HDRUK/cohort-discovery-service-web/commit/ab2d4d15f0d065e1eab370276cb59473a2194d37)), closes [DP-1073](undefinedDP-1073)
* **DP-1093:** Remove rogue title (#491) ([e6980ee](https://github.com/HDRUK/cohort-discovery-service-web/commit/e6980eef683a935badee29cbaf630c39b059874d)), closes [DP-1093](undefinedDP-1093)
* **DP-1098:** Race content chips overlap Clear all (#493) ([871e95a](https://github.com/HDRUK/cohort-discovery-service-web/commit/871e95a8fa0facc72cbfe667f5649a36a9619a92)), closes [DP-1098](undefinedDP-1098)
* **DP-1117:** persist Reset Selection in the demographics panel (#501) ([843f9dc](https://github.com/HDRUK/cohort-discovery-service-web/commit/843f9dc693c3ebc3d7d688f9aca82388459aaa30)), closes [DP-1117](undefinedDP-1117)
* **DP-1118:** allow Clear Query when only demographics are set (#499) ([5a16f46](https://github.com/HDRUK/cohort-discovery-service-web/commit/5a16f46e1dd65de6a1766610ad1077323583851e)), closes [DP-1118](undefinedDP-1118)
* **DP-1119:** fully collapse the demographics panel on save (#500) ([5b04255](https://github.com/HDRUK/cohort-discovery-service-web/commit/5b0425547e86be2080dd10d9a64e3a7185aa370d)), closes [DP-1119](undefinedDP-1119)
* **DP-1121:** raise minimum location radius to 25km (#502) ([87ce92c](https://github.com/HDRUK/cohort-discovery-service-web/commit/87ce92c0643efed333e8e7bea2dd5ff82d340c2f)), closes [DP-1121](undefinedDP-1121)
* **DP-1127:** Issues with empty age rule (#515) ([d625bd0](https://github.com/HDRUK/cohort-discovery-service-web/commit/d625bd0f5e945e171537459f17114d4bb741fc99)), closes [DP-1127](undefinedDP-1127)
* **DP-1130:** update formatDeathSummary (#517) ([d35760f](https://github.com/HDRUK/cohort-discovery-service-web/commit/d35760fe18f10a3d7c136a2162bb9e3f51b157e5)), closes [DP-1130](undefinedDP-1130)

## [1.9.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.8.0...v1.9.0) (2026-08-21)

### ✨ Features

* **DP-1000:** match the "X collections" pill design from figma in term directory (#454) ([3e96f24](https://github.com/HDRUK/cohort-discovery-service-web/commit/3e96f248540650621fe3c1986835ccb392d513d5)), closes [DP-1000](undefinedDP-1000)
* **DP-1018:** add SDE access banner (#463) ([4687240](https://github.com/HDRUK/cohort-discovery-service-web/commit/468724053a6ed1d7da207f9bbea959cca4642db3)), closes [DP-1018](undefinedDP-1018)
* **DP-1055:** help tutorials in MDX with a route per section (#473) ([3717b79](https://github.com/HDRUK/cohort-discovery-service-web/commit/3717b79879ce6097c7ca032aa1a75e2ce14c9f59)), closes [DP-1055](undefinedDP-1055)
* **DP-1056:** Update example for useDemographic rule (#468) ([183ec0e](https://github.com/HDRUK/cohort-discovery-service-web/commit/183ec0e04b4c55ef26a52ea161e224fbed6e87bc)), closes [DP-1056](undefinedDP-1056)
* **DP-857:** demographics panel in the query builder (#467) ([66f9e26](https://github.com/HDRUK/cohort-discovery-service-web/commit/66f9e267f0c2ed50c935fdf24cf9dcd10f36914d)), closes [DP-857](undefinedDP-857)
* **DP-905:** add term directory collection filter (#443) ([b3d5874](https://github.com/HDRUK/cohort-discovery-service-web/commit/b3d58740a46ce469850fb10218808abcaa1bd44d)), closes [DP-905](undefinedDP-905)
* **DP-917:** add term directory navigation (#449) ([1f051f2](https://github.com/HDRUK/cohort-discovery-service-web/commit/1f051f2493aee76917b68ef5bda80c8f03e20259)), closes [DP-917](undefinedDP-917) [navigation](undefinedgation)
* **DP-997:** add an "All" domain filter tab in term directory (#450) ([460c1d0](https://github.com/HDRUK/cohort-discovery-service-web/commit/460c1d053a6ced6811b77a920792ae58321443a1)), closes [DP-997](undefinedDP-997)
* **DP-998:** add Domain column to term directory table (#452) ([b25678d](https://github.com/HDRUK/cohort-discovery-service-web/commit/b25678d1069b446a70f6ad4affccff48b8d53a7f)), closes [DP-998](undefinedDP-998)

### 🐛 Bug Fixes

* **DP-1032:** temporarily disable sorting in term directory (#458) ([6ace765](https://github.com/HDRUK/cohort-discovery-service-web/commit/6ace7651a5f7f0678fdab08a9735de9e141d1338)), closes [DP-1032](undefinedDP-1032)
* **DP-1040:** UI improvements for term directory 2 (#466) ([ef74df2](https://github.com/HDRUK/cohort-discovery-service-web/commit/ef74df26501336e0e18bfd985f8e095089cbd708)), closes [DP-1040](undefinedDP-1040)
* **DP-1057:** stop stale demographics block leaking when editing another query (#469) ([54bf218](https://github.com/HDRUK/cohort-discovery-service-web/commit/54bf2180964ef0323a22fa1c00b4701be8c73588)), closes [DP-1057](undefinedDP-1057)
* **DP-1058:** stop search overlay flashing open on first click after load (#471) ([0f98e65](https://github.com/HDRUK/cohort-discovery-service-web/commit/0f98e65de62484325258ba990611308380d75c51)), closes [DP-1058](undefinedDP-1058)
* **DP-955:** search bar auto select on initial load (#445) ([074e747](https://github.com/HDRUK/cohort-discovery-service-web/commit/074e7477a0d79e28d062f8ed66cb1034826d2c63)), closes [DP-955](undefinedDP-955)
* **DP-983:** drag overlay crash from missing CloseGuardProvider (#455) ([97f1dd4](https://github.com/HDRUK/cohort-discovery-service-web/commit/97f1dd4660370f46345520421db8156a92addd18)), closes [DP-983](undefinedDP-983) [CloseGuardProvider](undefineddProvider)
* **DP-999:** UI improvements for term directory (#453) ([eef2a6c](https://github.com/HDRUK/cohort-discovery-service-web/commit/eef2a6cc2fdf2452386831a9fc57925a750f63b1)), closes [DP-999](undefinedDP-999)

## [1.8.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.7.1...v1.8.0) (2026-07-29)

### ✨ Features

* **DP-903:** term directory page foundation & browse (#433) ([d734e91](https://github.com/HDRUK/cohort-discovery-service-web/commit/d734e91db67a7bbd2920527a70603d790bc5992a)), closes [DP-903](undefinedDP-903)
* **DP-904:** add term directory search (#438) ([96d57bc](https://github.com/HDRUK/cohort-discovery-service-web/commit/96d57bc463e9107783dd1759ac02d7a00efdbec8)), closes [DP-904](undefinedDP-904)
* **DP-906:** add Term Directory "copy OMOP ID" button (#442) ([543e250](https://github.com/HDRUK/cohort-discovery-service-web/commit/543e250dbe3764865f93b63b6cdc4d717313d7a8)), closes [DP-906](undefinedDP-906)
* **DP-913:** Adding Rule for value as number selector (#427) ([fbd2d8d](https://github.com/HDRUK/cohort-discovery-service-web/commit/fbd2d8dcf62969aeaad60aa4a5d911c6e1095efd)), closes [DP-913](undefinedDP-913)
* **DP-929:** Update for query parser to send collections (#434) ([4997adf](https://github.com/HDRUK/cohort-discovery-service-web/commit/4997adfc1481206574440538e0235abd6ae8600a)), closes [DP-929](undefinedDP-929)
* **DP-932:** New workflow for deploying to dev standalone (#430) ([077b724](https://github.com/HDRUK/cohort-discovery-service-web/commit/077b724a92ff32767d6c4302dc63e556bdf471cb)), closes [DP-932](undefinedDP-932)
* **DP-941:** add term directory domain filters (#440) ([46600d7](https://github.com/HDRUK/cohort-discovery-service-web/commit/46600d7abc68f3e5c2f4d8d673da1d79d309b9ee)), closes [DP-941](undefinedDP-941)

### 🐛 Bug Fixes

* **DP-932:** updated dev deployment pipeline for standalone so it can run on manual… (#436) ([8442ca0](https://github.com/HDRUK/cohort-discovery-service-web/commit/8442ca0f4471b1ec3deffacb235dbc35229ba639)), closes [DP-932](undefinedDP-932)
* **DP-932:** updated dev pipeline to run standalone when tag has been added (#439) ([95d9d3b](https://github.com/HDRUK/cohort-discovery-service-web/commit/95d9d3b5b8ea78cdfa6e58d7456edd84f6d7521a)), closes [DP-932](undefinedDP-932)
* **GAT-8999:** removed args duplicates from the pipelines (#428) ([f304441](https://github.com/HDRUK/cohort-discovery-service-web/commit/f304441d62eca89f22636e55724cbea89bb80fca)), closes [GAT-8999](undefinedGAT-8999)

## [1.7.1](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.7.0...v1.7.1) (2026-06-29)

### 🐛 Bug Fixes

* **DP-861:** Truncate long concept names with "..." (#417) ([a64f25d](https://github.com/HDRUK/cohort-discovery-service-web/commit/a64f25d8aae0d3e3c481a14fb71c3e8d0ad99b79)), closes [DP-861](undefinedDP-861)

## [1.7.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.6.0...v1.7.0) (2026-06-12)

### ✨ Features

* **DP-833:** Update for regression testing  (#400) ([b730679](https://github.com/HDRUK/cohort-discovery-service-web/commit/b730679d3ed837ff275cb689f38332db7d82ea35)), closes [DP-833](undefinedDP-833)
* **DP-848:** Super Rule (#402) ([d57ade6](https://github.com/HDRUK/cohort-discovery-service-web/commit/d57ade64d5a0372d78967c7ce0d9993afbbc64ed)), closes [DP-848](undefinedDP-848)

### 🐛 Bug Fixes

* **DP-722:** auto-focus search input for newly added rule blocks (#392) ([1f5e7fb](https://github.com/HDRUK/cohort-discovery-service-web/commit/1f5e7fbca1059781d6e3f454027d29c8f8419a71)), closes [DP-722](undefinedDP-722)
* **DP-858:** keep rule search results fixed height with vertical scroll (subtask of DP-721) (#401) ([75b9839](https://github.com/HDRUK/cohort-discovery-service-web/commit/75b9839ec48ee39ff3ffc368d9f4a9cbff0bfa3e)), closes [DP-721](undefinedDP-721)
* **DP-863:** fix pagination for concept search "Show more" results (#403) ([b75fb46](https://github.com/HDRUK/cohort-discovery-service-web/commit/b75fb460dfcad61f3422608b7e0497cddee3a7cc)), closes [DP-863](undefinedDP-863) [DP-858](undefinedDP-858)
* **DP-867:** Dragging concepts (#406) ([c204b7d](https://github.com/HDRUK/cohort-discovery-service-web/commit/c204b7d6b8803df84051f174ed2f6a4e8d651032)), closes [DP-867](undefinedDP-867)
* **DP-876:** fix UI misalignment in collection selection screen (#412) ([f326f80](https://github.com/HDRUK/cohort-discovery-service-web/commit/f326f8064a0fbaee5ff8dec5755eabb9c4c92a20))
* **GAT-8811:** added docker build in semantic release (#407) ([d867f03](https://github.com/HDRUK/cohort-discovery-service-web/commit/d867f03ff5270e479290ad8938ad619e37e9b085)), closes [GAT-8811](undefinedGAT-8811)
* **GAT-8811:** fixed the arguments in the pipelines (#397) ([a6291f5](https://github.com/HDRUK/cohort-discovery-service-web/commit/a6291f5c0908adac9b54f5e39f69cc5690c6872c))
* **GAT-8811:** updated pipeline to use two separate environments for dev (#398) ([beca5de](https://github.com/HDRUK/cohort-discovery-service-web/commit/beca5de46a16aef7b47b532d3de19349abe33643)), closes [GAT-8811](undefinedGAT-8811)
* **GAT-8811:** updated workflows to use reusable pipelines (#396) ([4ba9317](https://github.com/HDRUK/cohort-discovery-service-web/commit/4ba93179266b9aad39b16b87fd98ef7a564c51bc)), closes [GAT-8811](undefinedGAT-8811)

## [1.6.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.5.0...v1.6.0) (2026-05-21)

### ✨ Features

* **DP-222:** Enable Filtering of Selecting Collections (#388) ([cd59a70](https://github.com/HDRUK/cohort-discovery-service-web/commit/cd59a700b62006ddd1d9c82e3b8467c4e9c25b2f)), closes [DP-222](DP-222)
* **DP-823:** 🤖 Improving performance for QueryHistory and other routes (#389) ([ceb8877](https://github.com/HDRUK/cohort-discovery-service-web/commit/ceb8877917c8dc0d7b9b11020882f8db6a9195fa)), closes [DP-823](DP-823)
* **DP-833:** Regression testing suite for admin (#390) ([f7b7cf9](https://github.com/HDRUK/cohort-discovery-service-web/commit/f7b7cf92f44f612cb9a3815fe87c977ec84b82a6)), closes [DP-833](DP-833)

### 🐛 Bug Fixes

* **DP-800:** Allow user to modify include/exclude on an empty rule (#382) ([d0e02b9](https://github.com/HDRUK/cohort-discovery-service-web/commit/d0e02b9025c39d97c5543a4beb1e229a38f701e8)), closes [DP-800](DP-800)

## [1.5.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.4.0...v1.5.0) (2026-05-11)

### ✨ Features

* **DP-711:** Separate Query status for Partial Results (#366) ([6ad2642](https://github.com/HDRUK/cohort-discovery-service-web/commit/6ad2642fd86f804905f32e519c815271e99e5b3a)), closes [DP-711](DP-711)
* **DP-799:** Rule Builder auto scrolls to top of the builder container when rules are added (#369) ([9e62e70](https://github.com/HDRUK/cohort-discovery-service-web/commit/9e62e7056209f00d79535663151caca3f7a08a3c)), closes [DP-799](DP-799)
* **DP-801:** Fixes for incomplete searches (#372) ([7c6f500](https://github.com/HDRUK/cohort-discovery-service-web/commit/7c6f500ca05b5bd5d8c5f266bbe04b6ba4e8f92d))

### 🐛 Bug Fixes

* **DP-747:** :airplane: Update the second query example (#368) ([3e0c633](https://github.com/HDRUK/cohort-discovery-service-web/commit/3e0c6332f57fb591af9fcd9e73284a65e20a32e7)), closes [DP-747](DP-747)
* **DP-754:** Fixing the functionality for deleting queries (#363) ([59fe1c7](https://github.com/HDRUK/cohort-discovery-service-web/commit/59fe1c75c9bf65e9936ccde7af071eaf00a25dc0)), closes [DP-754](DP-754)
* **DP-754:** Query results table scrollable  (#362) ([32e33cf](https://github.com/HDRUK/cohort-discovery-service-web/commit/32e33cfbf8d4b7ce53405c0b57b4c43f2062b7b3)), closes [DP-754](DP-754)
* **DP-755:** Names for demographic and medication rules (#367) ([1fa58b5](https://github.com/HDRUK/cohort-discovery-service-web/commit/1fa58b570b1da4ab62399cbd07d7e35656f4c1dc)), closes [DP-755](DP-755)
* **DP-762:** Add padding between text query and button (#364) ([9a518dc](https://github.com/HDRUK/cohort-discovery-service-web/commit/9a518dcda7a712e8232a2446bc66cde9e964f9d5)), closes [DP-762](DP-762)
* **DP-768:** Enable user name search (#365) ([74dcae8](https://github.com/HDRUK/cohort-discovery-service-web/commit/74dcae8d055d4703c4a39f36952a0f07bab197fd)), closes [DP-768](DP-768)
* **DP-778:** Select Datasets is a fixed height (#370) ([a29b305](https://github.com/HDRUK/cohort-discovery-service-web/commit/a29b3057ed1947f0d04eb4eb54f0f1fcbe2a9254))
* **DP-803:** Appending to searchers (#374) ([f9dc873](https://github.com/HDRUK/cohort-discovery-service-web/commit/f9dc873218157e3f8de5c5dc4e51969721335df3)), closes [DP-803](DP-803)
* **DP-819:** Search box behaviour with existing queries (#378) ([e832633](https://github.com/HDRUK/cohort-discovery-service-web/commit/e8326331f7983b3c4e60a90c1b07fddb668b6de7)), closes [DP-819](DP-819)

## [1.4.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.3.0...v1.4.0) (2026-04-27)

### ✨ Features

* **DP-0000:** e2e tests - initial commit ([d8bb277](https://github.com/HDRUK/cohort-discovery-service-web/commit/d8bb2773064920331adb2b34e1183ca10a58b239)), closes [DP-0000](DP-0000)
* **DP-328:** make use of exisitng urls (#321) ([0044564](https://github.com/HDRUK/cohort-discovery-service-web/commit/0044564c4a3931f263c9f316c6b9d0cc982bc3ae)), closes [DP-328](DP-328)
* **DP-731:** Enable User Table sorting (#349) ([c99b7b2](https://github.com/HDRUK/cohort-discovery-service-web/commit/c99b7b27d6aca7af53fe63a1d07d3982c3b40567)), closes [DP-731](DP-731)

### 🐛 Bug Fixes

* **DP-682:** Rule selection bug (#323) ([2ab360e](https://github.com/HDRUK/cohort-discovery-service-web/commit/2ab360ef2b4bd757d555ce3db5a977fea5481b2e)), closes [DP-682](DP-682) [propagation](gation)
* **DP-690:** User workgroup management accidentally disabled (#327) ([a7a5bb8](https://github.com/HDRUK/cohort-discovery-service-web/commit/a7a5bb83ad36e2ba1ac5e6b3d15d6f4273e09473)), closes [DP-690](DP-690) [propagation](gation)
* **DP-708:** Use feature flag for collection details (#341) ([623166b](https://github.com/HDRUK/cohort-discovery-service-web/commit/623166b39b9c727a7d059654a12019f5a697d7dc)), closes [DP-708](DP-708)
* **DP-715:** Report correct last activity (#343) ([a73fa7d](https://github.com/HDRUK/cohort-discovery-service-web/commit/a73fa7d693ce0cafeefb32ec55b71380b2e08bee)), closes [DP-715](DP-715)
* **DP-724:** Update USER table [admin only] (#345) ([08c7241](https://github.com/HDRUK/cohort-discovery-service-web/commit/08c724119231ef263ce4089e3edc8228dfcca999)), closes [DP-724](DP-724)
* **DP-738:** Last ping now showing (#350) ([98ae3b1](https://github.com/HDRUK/cohort-discovery-service-web/commit/98ae3b1845464a3bbc635981093fd41ac9035098)), closes [DP-738](DP-738)

## [1.3.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.2.0...v1.3.0) (2026-03-04)

### ✨ Features

- **DP-0000:** License file ([f3dc38e](https://github.com/HDRUK/cohort-discovery-service-web/commit/f3dc38e86ed8dacc597a05129cdecc8691b19070)), closes [DP-0000](DP-0000)

## [1.2.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.1.0...v1.2.0) (2026-02-23)

### ✨ Features

- **DP-0000:** Contibution guide and template ([ccda076](https://github.com/HDRUK/cohort-discovery-service-web/commit/ccda076e71611538a3575e68f2d0017ec4d2af6e)), closes [DP-0000](DP-0000)
- **DP-0000:** Update README for public use ([a1b00bc](https://github.com/HDRUK/cohort-discovery-service-web/commit/a1b00bc78c77ecc17f5c69065639f5758820140a)), closes [DP-0000](DP-0000)
- **DP-459:** Yaml linting ([1b0ee91](https://github.com/HDRUK/cohort-discovery-service-web/commit/1b0ee919f5b0897445e10ecee8afb4f9c389573c)), closes [DP-459](DP-459)
- **DP-485:** Links profile back to Gateway per .env setting. Removes My Account tab in integrated mode ([5002ba3](https://github.com/HDRUK/cohort-discovery-service-web/commit/5002ba38a250a9a9514b6fe46af77677ca647b06)), closes [DP-485](DP-485) [Gateway](Gateway)

## [1.1.0](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.0.2...v1.1.0) (2026-02-16)

### ✨ Features

- **DP-1234:** Update Docker build context ([ef5be4d](https://github.com/HDRUK/cohort-discovery-service-web/commit/ef5be4ded23066d36a8c8b1b05d14442f27b6372)), closes [DP-1234](DP-1234)

## [1.0.2](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.0.1...v1.0.2) (2026-02-16)

### 🐛 Bug Fixes

- **DP-465:** Disable cache on rerunTask, as calling with the same pid would defer to cache and ignore request ([05ec26f](https://github.com/HDRUK/cohort-discovery-service-web/commit/05ec26fa384a89e77f62c7f67ffd81ca8d2df77d)), closes [DP-465](DP-465)

## [1.0.1](https://github.com/HDRUK/cohort-discovery-service-web/compare/v1.0.0...v1.0.1) (2026-01-09)

### 🐛 Bug Fixes

- **DP-1234:** pipeline errors ([af23118](https://github.com/HDRUK/cohort-discovery-service-web/commit/af231182498d06afcd710ac1a0d165e1ca49e360)), closes [DP-1234](DP-1234)
- **DP-1234:** pipeline errors ([ed3f043](https://github.com/HDRUK/cohort-discovery-service-web/commit/ed3f043344370588006f81adf5a7e6b1aa471707)), closes [DP-1234](DP-1234)
- pipeline errors ([f956945](https://github.com/HDRUK/cohort-discovery-service-web/commit/f956945fbbf7841c29ef04927f80a18e9a0c7192))

## 1.0.0 (2026-01-08)

### ✨ Features

- **DP-149:** FE component parts for standalone mode running ([4cc031e](https://github.com/HDRUK/cohort-discovery-service-web/commit/4cc031e13c154c7cae14a2ef6b0af3c3b99ac6af)), closes [DP-149](DP-149)
- **DP-149:** implementing standalone mode ([96df81e](https://github.com/HDRUK/cohort-discovery-service-web/commit/96df81ed564f045d82473653041070e58d53f421)), closes [DP-149](DP-149)
- **DP-27:** User list for administration page ([30f31f4](https://github.com/HDRUK/cohort-discovery-service-web/commit/30f31f4e9d26cf406cfc1433ffd0d971296b95d6)), closes [DP-27](DP-27)
