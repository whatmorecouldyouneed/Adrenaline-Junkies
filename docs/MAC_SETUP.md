# mac ios build setup

one-time setup to build and install the app on your iphone from your mac.

## prerequisites

- apple developer account signed into xcode
- iphone, mac, and windows all on same wifi
- iphone connected to mac via usb (for initial install)

## steps (on mac)

```bash
# 1. update xcode
# open app store, update xcode. then:
sudo xcode-select --switch /Applications/Xcode.app
xcodebuild -license accept

# 2. install node + yarn
brew install node
npm install -g yarn

# 3. clone repo
git clone <your-repo-url> ~/AdrenalineJunkies
cd ~/AdrenalineJunkies

# 4. install deps
yarn install

# 5. install cocoapods (if needed)
sudo gem install cocoapods
# or: brew install cocoapods

# 6. generate ios native project
npx expo prebuild --platform ios

# 7. install pods
cd ios && pod install && cd ..

# 8. connect iphone via usb, trust computer on iphone

# 9. build + run on device
npx expo run:ios --device

# 10. on iphone: settings > general > vpn & device management > trust developer cert
```

## when to rebuild

after adding native deps (e.g. at milestone 1 and milestone 4):

```bash
cd ~/AdrenalineJunkies
git pull
yarn install
npx expo prebuild --platform ios
cd ios && pod install && cd ..
npx expo run:ios --device
```

## daily workflow (windows)

1. `npx expo start --dev-client --host lan`
2. open app on iphone (connects to metro over wifi)
3. code in cursor, hot reload to iphone
