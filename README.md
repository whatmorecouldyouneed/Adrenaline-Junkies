## adrenaline junkies mobile 🎮
official react native front-end for the adrenaline junkies mobile game

## overview 🚀
this repository is the front-end and middleware layer for the adrenaline junkies mobile game, developed by wmcyn. built with expo (react native + typescript), the app connects to firebase for authentication, real-time leaderboard tracking, and user profile management. the actual game is built in unreal engine 5 and launched from this mobile app.

## tech stack 🛠️
framework: expo (react native + typescript)
backend: firebase (auth + realtime database)
styling: custom 8-bit inspired theming via style sheets
native: deep linking to unreal engine mobile binary
️features 💡
- modern mobile sign up & login flow with firebase auth
- real-time leaderboard integration using firebase realtime database
- user profile management with tracked metrics (speed, matches, times)
- deep link/intent integration to launch the ue5 mobile game
- custom retro-inspired UI using 8-bit pixel aesthetics

## firebase setup 🔑
in firebase console:
1. enable email/password authentication
2. enable realtime database
3. set database rules for development:
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
4. register ios + android apps in firebase project settings
5. create and add the firebase config to `.env`

## getting started 🏃🏼‍♂️
clone the repository:

```bash
git clone https://github.com/wmcyn/adrenaline-junkies-alpha.git
cd adrenaline-junkies-alpha
```

## install dependencies:
```bash
yarn install
```

## setup environment variables:
- create a `.env` file in the root
- ask @jared for the keys or refer to `.env.example`

run the app locally:
```bash
yarn start
```
open in expo go or use the iOS/Android simulator.

## project structure 📂
/src
  /components - shared components like buttons, input forms
  /screens - login, signup, leaderboard, profile, game launcher
  /services - firebase config + auth handlers
  App.tsx - root component

ui design 🎨
inspired by the original adrenaline junkies pixel-art aesthetic:
- 8-bit press start 2P font
- retro high-contrast color palette (#010326 background, #EAF205 text)
- responsive pixel-styled button UI
- touch-first layout, optimized for mobile

scripts 🎮
- `yarn start` - runs expo dev server
- `yarn android` - runs app on android
- `yarn ios` - runs app on ios
- `yarn build` - prepares production build

## contributing 🤝🏾
contributions welcome! open an issue or PR.

## deployment 🚀
built and deployed via expo/eas builds to app stores. game is shipped separately via unreal engine mobile builds.

## license 📜
this project is licensed under the mit license.

wmcyn.online 🌐
this app is part of the wmcyn ecosystem. visit us at https://wmcyn.online

