# Graph Report - .  (2026-06-05)

## Corpus Check
- Large corpus: 342 files · ~135,069 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 1032 nodes · 1079 edges · 68 communities detected
- Extraction: 76% EXTRACTED · 24% INFERRED · 0% AMBIGUOUS · INFERRED: 257 edges (avg confidence: 0.8)
- Token cost: 1,200 input · 400 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Angular Navigation Components|Angular Navigation Components]]
- [[_COMMUNITY_Mock API Handlers|Mock API Handlers]]
- [[_COMMUNITY_Alert UI Component|Alert UI Component]]
- [[_COMMUNITY_App Configuration & UI Shell|App Configuration & UI Shell]]
- [[_COMMUNITY_Data Resolvers & Dashboard Services|Data Resolvers & Dashboard Services]]
- [[_COMMUNITY_Backend Authentication & Security|Backend Authentication & Security]]
- [[_COMMUNITY_Application Bootstrapping & Drawers|Application Bootstrapping & Drawers]]
- [[_COMMUNITY_Drawer Services & Core APIs|Drawer Services & Core APIs]]
- [[_COMMUNITY_Backend Services & Base Controllers|Backend Services & Base Controllers]]
- [[_COMMUNITY_Syntax Highlighting & Scrollbars|Syntax Highlighting & Scrollbars]]
- [[_COMMUNITY_Media Watcher Services|Media Watcher Services]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_HTTP Auth Interceptor|HTTP Auth Interceptor]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Masonry Layout Component|Masonry Layout Component]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Pagination Component|Pagination Component]]
- [[_COMMUNITY_Sign In Component|Sign In Component]]
- [[_COMMUNITY_Sign Up Component|Sign Up Component]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Card UI Component|Card UI Component]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Data List Resource Module|Data List Resource Module]]
- [[_COMMUNITY_Real Data Resource Module|Real Data Resource Module]]
- [[_COMMUNITY_Permissions Management Module|Permissions Management Module]]
- [[_COMMUNITY_Roles Management Module|Roles Management Module]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Fullscreen UI Component|Fullscreen UI Component]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Confirmation Dialog Services|Confirmation Dialog Services]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Date Time Picker Component|Date Time Picker Component]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Confirmation Dialog Services|Confirmation Dialog Services]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Data List Resource Module|Data List Resource Module]]
- [[_COMMUNITY_Data List Resource Module|Data List Resource Module]]
- [[_COMMUNITY_Data List Resource Module|Data List Resource Module]]
- [[_COMMUNITY_Data List Resource Module|Data List Resource Module]]
- [[_COMMUNITY_Real Data Resource Module|Real Data Resource Module]]
- [[_COMMUNITY_Real Data Resource Module|Real Data Resource Module]]
- [[_COMMUNITY_Real Data Resource Module|Real Data Resource Module]]
- [[_COMMUNITY_Real Data Resource Module|Real Data Resource Module]]
- [[_COMMUNITY_Permissions Management Module|Permissions Management Module]]
- [[_COMMUNITY_Permissions Management Module|Permissions Management Module]]
- [[_COMMUNITY_Permissions Management Module|Permissions Management Module]]
- [[_COMMUNITY_Permissions Management Module|Permissions Management Module]]
- [[_COMMUNITY_Roles Management Module|Roles Management Module]]
- [[_COMMUNITY_Roles Management Module|Roles Management Module]]
- [[_COMMUNITY_Roles Management Module|Roles Management Module]]
- [[_COMMUNITY_Roles Management Module|Roles Management Module]]
- [[_COMMUNITY_Users Management Module|Users Management Module]]
- [[_COMMUNITY_Users Management Module|Users Management Module]]
- [[_COMMUNITY_Users Management Module|Users Management Module]]
- [[_COMMUNITY_Confirmation Dialog Services|Confirmation Dialog Services]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Data List Resource Module|Data List Resource Module]]

## God Nodes (most connected - your core abstractions)
1. `FuseVerticalNavigationComponent` - 26 edges
2. `FuseScrollbarDirective` - 21 edges
3. `get()` - 19 edges
4. `AuthService` - 16 edges
5. `FuseDrawerComponent` - 16 edges
6. `QuickChatComponent` - 15 edges
7. `ShortcutsComponent` - 13 edges
8. `MessagesComponent` - 12 edges
9. `NotificationsComponent` - 12 edges
10. `SearchComponent` - 12 edges

## Surprising Connections (you probably didn't know these)
- `bootstrap()` --calls--> `create()`  [INFERRED]
  be\src\main.ts → fuse-starter-v20.0.0\src\app\services\abstract.service.ts
- `initialDataResolver()` --calls--> `get()`  [INFERRED]
  fuse-starter-v20.0.0\src\app\app.resolvers.ts → fuse-starter-v20.0.0\src\app\services\abstract.service.ts

## Hyperedges (group relationships)
- **Authentication System Flow** — auth_auth_controller_authcontroller, auth_auth_guard_authguard, auth_auth_service_authservice, sign_in_sign_in_component_authsignincomponent [INFERRED 0.85]
- **Users Management** — users_users_controller_userscontroller, users_users_service_usersservice, entities_user_entity_user [INFERRED 0.90]

## Communities

### Community 0 - "Angular Navigation Components"
Cohesion: 0.02
Nodes (18): FuseHorizontalNavigationBasicItemComponent, FuseVerticalNavigationBasicItemComponent, FuseHorizontalNavigationBranchItemComponent, CenteredLayoutComponent, ClassicLayoutComponent, ClassyLayoutComponent, CompactLayoutComponent, DenseLayoutComponent (+10 more)

### Community 1 - "Mock API Handlers"
Cohesion: 0.04
Nodes (23): AcademyMockApi, ActivitiesMockApi, AnalyticsMockApi, ChatMockApi, ContactsMockApi, CryptoMockApi, FileManagerMockApi, FinanceMockApi (+15 more)

### Community 2 - "Alert UI Component"
Cohesion: 0.04
Nodes (11): FuseAlertComponent, FuseAlertService, FuseVerticalNavigationCollapsableItemComponent, EmptyLayoutComponent, FuseLoadingBarComponent, fuseLoadingInterceptor(), FuseLoadingService, mockApiInterceptor() (+3 more)

### Community 3 - "App Configuration & UI Shell"
Cohesion: 0.04
Nodes (7): FuseConfigService, MessagesComponent, NotificationsComponent, update(), ShortcutsComponent, AuthSignOutComponent, UserComponent

### Community 4 - "Data Resolvers & Dashboard Services"
Cohesion: 0.05
Nodes (11): initialDataResolver(), DashboardService, MessagesService, NotificationsService, QueryComponent, all(), buildHttpParams(), exportExcel() (+3 more)

### Community 5 - "Backend Authentication & Security"
Cohesion: 0.04
Nodes (11): AuthController, AuthModule, AuthService, TypeOrmConfigService, AuthGuard(), NoAuthGuard(), PermissionsGuard, findOne() (+3 more)

### Community 6 - "Application Bootstrapping & Drawers"
Cohesion: 0.09
Nodes (4): FuseDrawerComponent, create(), bootstrap(), FuseVerticalNavigationComponent

### Community 7 - "Drawer Services & Core APIs"
Cohesion: 0.05
Nodes (7): FuseDrawerService, FuseHorizontalNavigationComponent, LanguagesComponent, FuseNavigationService, SearchMockApi, delete(), FuseUtilsService

### Community 8 - "Backend Services & Base Controllers"
Cohesion: 0.06
Nodes (7): AbstractService, DatalistController, DatarealController, FuseFindByKeyPipe, PermissionsController, find(), UsersController

### Community 9 - "Syntax Highlighting & Scrollbars"
Cohesion: 0.1
Nodes (3): FuseHighlightComponent, FuseHighlightService, FuseScrollbarDirective

### Community 10 - "Media Watcher Services"
Cohesion: 0.08
Nodes (4): LayoutComponent, FuseMediaWatcherService, RolesController, FuseSplashScreenService

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (2): QuickChatComponent, QuickChatService

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (1): SearchComponent

### Community 13 - "HTTP Auth Interceptor"
Cohesion: 0.31
Nodes (2): authInterceptor(), AuthUtils

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (1): DashboardComponent

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (1): FuseVerticalNavigationAsideItemComponent

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (1): SettingsComponent

### Community 17 - "Community 17"
Cohesion: 0.43
Nodes (1): AuthMockApi

### Community 18 - "Masonry Layout Component"
Cohesion: 0.6
Nodes (1): FuseMasonryComponent

### Community 19 - "Community 19"
Cohesion: 0.4
Nodes (2): ScrollbarGeometry, ScrollbarPosition

### Community 20 - "Pagination Component"
Cohesion: 0.4
Nodes (1): PaginateTakeComponent

### Community 21 - "Sign In Component"
Cohesion: 0.4
Nodes (1): AuthSignInComponent

### Community 22 - "Sign Up Component"
Cohesion: 0.4
Nodes (1): AuthSignUpComponent

### Community 23 - "Community 23"
Cohesion: 0.5
Nodes (1): AuthGuard

### Community 24 - "Card UI Component"
Cohesion: 0.5
Nodes (1): FuseCardComponent

### Community 25 - "Community 25"
Cohesion: 0.5
Nodes (1): FuseValidators

### Community 26 - "Community 26"
Cohesion: 0.5
Nodes (1): NavigationService

### Community 27 - "Data List Resource Module"
Cohesion: 0.67
Nodes (1): DatalistService

### Community 28 - "Real Data Resource Module"
Cohesion: 0.67
Nodes (1): DatarealService

### Community 29 - "Permissions Management Module"
Cohesion: 0.67
Nodes (1): PermissionsService

### Community 30 - "Roles Management Module"
Cohesion: 0.67
Nodes (1): RolesService

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (2): FuseAnimationCurves, FuseAnimationDurations

### Community 32 - "Fullscreen UI Component"
Cohesion: 0.67
Nodes (1): FuseFullscreenComponent

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (1): FuseMockApiUtils

### Community 34 - "Confirmation Dialog Services"
Cohesion: 0.67
Nodes (1): FuseConfirmationService

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (1): FusePlatformService

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (1): Version

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (1): AppComponent

### Community 38 - "Date Time Picker Component"
Cohesion: 0.67
Nodes (1): DateTimePickerComponentComponent

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (1): IconsService

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (1): ExampleComponent

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (1): TestComponent

### Community 42 - "Confirmation Dialog Services"
Cohesion: 0.67
Nodes (1): AuthConfirmationRequiredComponent

### Community 43 - "Community 43"
Cohesion: 0.67
Nodes (1): LandingHomeComponent

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): AppModule

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (1): CommonModule

### Community 46 - "Data List Resource Module"
Cohesion: 1.0
Nodes (1): DatalistModule

### Community 47 - "Data List Resource Module"
Cohesion: 1.0
Nodes (1): CreateDatalistDto

### Community 48 - "Data List Resource Module"
Cohesion: 1.0
Nodes (1): UpdateDatalistDto

### Community 49 - "Data List Resource Module"
Cohesion: 1.0
Nodes (1): Datalist

### Community 50 - "Real Data Resource Module"
Cohesion: 1.0
Nodes (1): DatarealModule

### Community 51 - "Real Data Resource Module"
Cohesion: 1.0
Nodes (1): CreateDatarealDto

### Community 52 - "Real Data Resource Module"
Cohesion: 1.0
Nodes (1): UpdateDatarealDto

### Community 53 - "Real Data Resource Module"
Cohesion: 1.0
Nodes (1): Datareal

### Community 55 - "Permissions Management Module"
Cohesion: 1.0
Nodes (1): PermissionsModule

### Community 56 - "Permissions Management Module"
Cohesion: 1.0
Nodes (1): CreatePermissionDto

### Community 57 - "Permissions Management Module"
Cohesion: 1.0
Nodes (1): UpdatePermissionDto

### Community 58 - "Permissions Management Module"
Cohesion: 1.0
Nodes (1): Permission

### Community 59 - "Roles Management Module"
Cohesion: 1.0
Nodes (1): RolesModule

### Community 60 - "Roles Management Module"
Cohesion: 1.0
Nodes (1): CreateRoleDto

### Community 61 - "Roles Management Module"
Cohesion: 1.0
Nodes (1): UpdateRoleDto

### Community 62 - "Roles Management Module"
Cohesion: 1.0
Nodes (1): Role

### Community 63 - "Users Management Module"
Cohesion: 1.0
Nodes (1): CreateUserDto

### Community 64 - "Users Management Module"
Cohesion: 1.0
Nodes (1): UpdateUserDto

### Community 65 - "Users Management Module"
Cohesion: 1.0
Nodes (1): User

### Community 68 - "Confirmation Dialog Services"
Cohesion: 1.0
Nodes (1): FuseConfirmationDialogComponent

### Community 73 - "Community 73"
Cohesion: 1.0
Nodes (1): GlobalVariable

### Community 76 - "Data List Resource Module"
Cohesion: 1.0
Nodes (1): DatalistService

## Knowledge Gaps
- **27 isolated node(s):** `AppModule`, `AuthModule`, `CommonModule`, `DatalistModule`, `CreateDatalistDto` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (20 nodes): `quick-chat.component.ts`, `quick-chat.service.ts`, `QuickChatComponent`, `.classList()`, `.constructor()`, `._hideOverlay()`, `.ngAfterViewInit()`, `.ngOnDestroy()`, `.ngOnInit()`, `.open()`, `._resizeMessageInput()`, `.selectChat()`, `._showOverlay()`, `._toggleOpened()`, `.trackByFn()`, `QuickChatService`, `.chat$()`, `.chats$()`, `.constructor()`, `.getChatById()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (13 nodes): `search.component.ts`, `SearchComponent`, `.barSearchInput()`, `.classList()`, `.close()`, `.constructor()`, `.matAutocomplete()`, `.ngOnChanges()`, `.ngOnDestroy()`, `.ngOnInit()`, `.onKeydown()`, `.open()`, `.trackByFn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HTTP Auth Interceptor`** (10 nodes): `authInterceptor()`, `AuthUtils`, `._b64decode()`, `._b64DecodeUnicode()`, `._decodeToken()`, `._getTokenExpirationDate()`, `.isTokenExpired()`, `._urlBase64Decode()`, `auth.interceptor.ts`, `auth.utils.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (9 nodes): `DashboardComponent`, `.constructor()`, `.displayStatus()`, `._fixSvgFill()`, `.ngOnDestroy()`, `.ngOnInit()`, `._prepareChartData()`, `.trackByFn()`, `dashboard.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 15`** (8 nodes): `FuseVerticalNavigationAsideItemComponent`, `._hasActiveChild()`, `._markIfActive()`, `.ngOnChanges()`, `.ngOnDestroy()`, `.ngOnInit()`, `.trackByFn()`, `aside.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 16`** (8 nodes): `settings.component.ts`, `SettingsComponent`, `.constructor()`, `.ngOnDestroy()`, `.ngOnInit()`, `.setLayout()`, `.setScheme()`, `.setTheme()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 17`** (7 nodes): `AuthMockApi`, `._base64url()`, `.constructor()`, `._generateJWTToken()`, `.registerHandlers()`, `._verifyJWTToken()`, `api.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Masonry Layout Component`** (5 nodes): `masonry.component.ts`, `FuseMasonryComponent`, `._distributeItems()`, `.ngAfterViewInit()`, `.ngOnChanges()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (5 nodes): `scrollbar.types.ts`, `ScrollbarGeometry`, `.constructor()`, `ScrollbarPosition`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Pagination Component`** (5 nodes): `paginate-take.component.ts`, `PaginateTakeComponent`, `.changedLimit()`, `.constructor()`, `.ngOnInit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sign In Component`** (5 nodes): `sign-in.component.ts`, `AuthSignInComponent`, `.constructor()`, `.ngOnInit()`, `.signIn()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sign Up Component`** (5 nodes): `sign-up.component.ts`, `AuthSignUpComponent`, `.constructor()`, `.ngOnInit()`, `.signUp()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (4 nodes): `AuthGuard`, `.canActivate()`, `.constructor()`, `auth.guard.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Card UI Component`** (4 nodes): `FuseCardComponent`, `.classList()`, `.ngOnChanges()`, `card.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (4 nodes): `validators.ts`, `FuseValidators`, `.isEmptyInputValue()`, `.mustMatch()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (4 nodes): `navigation.service.ts`, `NavigationService`, `.get()`, `.navigation$()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data List Resource Module`** (3 nodes): `datalist.service.ts`, `DatalistService`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Real Data Resource Module`** (3 nodes): `datareal.service.ts`, `DatarealService`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Permissions Management Module`** (3 nodes): `permissions.service.ts`, `PermissionsService`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Roles Management Module`** (3 nodes): `roles.service.ts`, `RolesService`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (3 nodes): `FuseAnimationCurves`, `FuseAnimationDurations`, `defaults.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Fullscreen UI Component`** (3 nodes): `FuseFullscreenComponent`, `.toggleFullscreen()`, `fullscreen.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (3 nodes): `mock-api.utils.ts`, `FuseMockApiUtils`, `.guid()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Confirmation Dialog Services`** (3 nodes): `FuseConfirmationService`, `.open()`, `confirmation.service.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (3 nodes): `platform.service.ts`, `FusePlatformService`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (3 nodes): `version.ts`, `Version`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (3 nodes): `AppComponent`, `.constructor()`, `app.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Date Time Picker Component`** (3 nodes): `DateTimePickerComponentComponent`, `.getCombinedDateTime()`, `date-time-picker-component.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (3 nodes): `icons.service.ts`, `IconsService`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (3 nodes): `ExampleComponent`, `.constructor()`, `example.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (3 nodes): `test.component.ts`, `TestComponent`, `.ngOnInit()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Confirmation Dialog Services`** (3 nodes): `AuthConfirmationRequiredComponent`, `.constructor()`, `confirmation-required.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (3 nodes): `home.component.ts`, `LandingHomeComponent`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `app.module.ts`, `AppModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `common.module.ts`, `CommonModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data List Resource Module`** (2 nodes): `datalist.module.ts`, `DatalistModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data List Resource Module`** (2 nodes): `create-datalist.dto.ts`, `CreateDatalistDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data List Resource Module`** (2 nodes): `update-datalist.dto.ts`, `UpdateDatalistDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data List Resource Module`** (2 nodes): `datalist.entity.ts`, `Datalist`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Real Data Resource Module`** (2 nodes): `datareal.module.ts`, `DatarealModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Real Data Resource Module`** (2 nodes): `create-datareal.dto.ts`, `CreateDatarealDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Real Data Resource Module`** (2 nodes): `update-datareal.dto.ts`, `UpdateDatarealDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Real Data Resource Module`** (2 nodes): `datareal.entity.ts`, `Datareal`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Permissions Management Module`** (2 nodes): `permissions.module.ts`, `PermissionsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Permissions Management Module`** (2 nodes): `create-permission.dto.ts`, `CreatePermissionDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Permissions Management Module`** (2 nodes): `update-permission.dto.ts`, `UpdatePermissionDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Permissions Management Module`** (2 nodes): `permission.entity.ts`, `Permission`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Roles Management Module`** (2 nodes): `roles.module.ts`, `RolesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Roles Management Module`** (2 nodes): `create-role.dto.ts`, `CreateRoleDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Roles Management Module`** (2 nodes): `update-role.dto.ts`, `UpdateRoleDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Roles Management Module`** (2 nodes): `role.entity.ts`, `Role`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Management Module`** (2 nodes): `create-user.dto.ts`, `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Management Module`** (2 nodes): `update-user.dto.ts`, `UpdateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Users Management Module`** (2 nodes): `user.entity.ts`, `User`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Confirmation Dialog Services`** (2 nodes): `FuseConfirmationDialogComponent`, `dialog.component.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 73`** (2 nodes): `GlobalVariable`, `global-variable.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Data List Resource Module`** (2 nodes): `datalist.service.ts`, `DatalistService`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get()` connect `Data Resolvers & Dashboard Services` to `Angular Navigation Components`, `Backend Authentication & Security`, `Drawer Services & Core APIs`, `Media Watcher Services`, `Community 11`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `FuseMockApiService` connect `Mock API Handlers` to `Alert UI Component`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `get()` (e.g. with `.createTypeOrmOptions()` and `.canActivate()`) actually correct?**
  _`get()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AppModule`, `AuthModule`, `CommonModule` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Angular Navigation Components` be split into smaller, more focused modules?**
  _Cohesion score 0.02 - nodes in this community are weakly interconnected._
- **Should `Mock API Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Alert UI Component` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._