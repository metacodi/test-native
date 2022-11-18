#!/bin/sh

FIRST_ARGUMENT="$1"
SECOND_ARGUMENT="$2"
THIRD_ARGUMENT="$3"
CURDIR="$(pwd)"

if [ $FIRST_ARGUMENT == "ios" ] 
then
  echo "ionic build $2 && npx cap copy ios && npx cap sync ios && npx cap open ios"
  ionic build $2 && npx cap copy ios && npx cap sync ios && npx cap open ios
  # ionic build && npx cap copy ios && npx cap sync ios && npx cap open ios
fi
if [ $FIRST_ARGUMENT == "iosb" ] 
then
  sh do lang
  ionic build --prod && npx cap copy ios && npx cap sync ios
  rm -R ios/build
  rm -R ios/ipa
  xcodebuild build -workspace ios/App/App.xcworkspace -scheme App -destination generic/platform=iOS
  xcodebuild -workspace ios/App/App.xcworkspace -scheme App -sdk iphoneos -configuration AppStoreDistribution archive -archivePath ios/build/App.xcarchive
  xcodebuild -exportArchive -archivePath ios/build/App.xcarchive -exportOptionsPlist ios/exportOptions.plist -exportPath ios/ipa/App.ipa
  rm -R ios/build
  rm -R ios/ipa
  
  # ionic build && npx cap copy ios && npx cap sync ios && npx cap open ios
fi

if [ $FIRST_ARGUMENT == "both" ] 
then
  echo "ionic build $2 && npx cap copy && npx cap sync && npx cap open ios && npx cap open android"
  ionic build $2 && npx cap copy && npx cap sync && npx cap open ios && npx cap open android
fi

if [ $FIRST_ARGUMENT == "android" ] 
then
  echo "ionic build $2 && npx cap copy android && npx cap sync android && npx cap open android"
  ionic build $2 && npx cap copy android && npx cap sync android && npx cap open android
  # ionic build && npx cap copy android && npx cap sync android
fi

if [ $FIRST_ARGUMENT == "androidb" ] 
then
  sh do lang
  rm -R android/app/build
  rm -R android/app/debug
  rm -R android/app/src/main/assets/public
  rm -R android/app/release
  rm -R android/build
  ionic build --prod && npx cap copy android && npx cap sync android
  cd android
  ./gradlew build
  ./gradlew bundleRelease 
  jarsigner -keystore my-release-key.keystore app/build/outputs/bundle/release/app-release.aab alias_name -storepass sieteysiete77
  cd ..
  open -R android/app/build/outputs/bundle/release/app-release.aab
fi

if [ $FIRST_ARGUMENT == "electron" ] 
then
  echo "ionic build $2 && npx cap copy @capacitor-community/electron && npx cap sync @capacitor-community/electron && npx cap open @capacitor-community/electron"
  ionic build $2 && npx cap copy @capacitor-community/electron && npx cap sync @capacitor-community/electron && npx cap open @capacitor-community/electron
fi

if [ $FIRST_ARGUMENT == "open" ] 
then
  if [ $SECOND_ARGUMENT == "electron" ]
  then
    npx cap copy @capacitor-community/electron && npx cap open @capacitor-community/electron
  fi
fi

if [ $FIRST_ARGUMENT == "run" ] 
then
  ionic capacitor run $2 $3 --livereload --external
fi

if [ $FIRST_ARGUMENT == "build" ] 
then
  if [ $SECOND_ARGUMENT == "open" ]
  then
    ionic build $3 && npx cap copy && npx cap copy @capacitor-community/electron && npx cap sync && npx cap sync @capacitor-community/electron && npx cap open ios && npx cap open android
  else
    echo "ionic build $2 && npx cap copy @capacitor-community/electron && npx cap sync @capacitor-community/electron"
    ionic build $2 && npx cap copy @capacitor-community/electron && npx cap sync @capacitor-community/electron
  fi
fi

if [ $FIRST_ARGUMENT == "compile" ] 
then
  rm -R electron/dist
  echo "cd electron && npm run electron:build-mac && npm run electron:build-windows && cd .."
  cd electron && npm run electron:build-mac && npm run electron:build-windows && cd ..
fi
if [ $FIRST_ARGUMENT == "compile-mac" ] 
then
  rm -R electron/dist
  echo "cd electron && npm run electron:build-mac && cd .."
  cd electron && npm run electron:build-mac && cd ..
fi

if [ $FIRST_ARGUMENT == "upload" ] 
then
  echo "upload files"
  if [ "$THIRD_ARGUMENT" == "demo"  ] 
  then
    curl -T 'electron/dist/LogicTaxi-win.exe' -u metacodi:SGFhFy1YXj7473FhFy1Y 'ftp://ftp.metacodi.com/www/taxi/apps/pre/LogicTaxi-win.exe'
    curl -T 'electron/dist/latest.yml' -u metacodi:SGFhFy1YXj7473FhFy1Y 'ftp://ftp.metacodi.com/www/taxi/apps/pre/latest.yml'
    curl -T 'electron/dist/LogicTaxi-mac.zip' -u metacodi:SGFhFy1YXj7473FhFy1Y 'ftp://ftp.metacodi.com/www/taxi/apps/pre/LogicTaxi-mac.zip'
    curl -T 'electron/dist/LogicTaxi-mac.pkg' -u metacodi:SGFhFy1YXj7473FhFy1Y 'ftp://ftp.metacodi.com/www/taxi/apps/pre/LogicTaxi-mac.pkg'
    curl -T 'electron/dist/latest-mac.yml' -u metacodi:SGFhFy1YXj7473FhFy1Y 'ftp://ftp.metacodi.com/www/taxi/apps/pre/latest-mac.yml'
  fi
  if [ "$THIRD_ARGUMENT" == "galera"  ] 
  then
    curl -T 'electron/dist/ClickMoveApp-win.exe' -u apps:0wi4Wb2% 'ftp://clickmoveapp.es/pre/ClickMoveApp-win.exe'
    curl -T 'electron/dist/latest.yml' -u apps:0wi4Wb2% 'ftp://clickmoveapp.es/pre/latest.yml'
    curl -T 'electron/dist/ClickMoveApp-mac.zip' -u apps:0wi4Wb2% 'ftp://clickmoveapp.es/pre/ClickMoveApp-mac.zip'
    curl -T 'electron/dist/ClickMoveApp-mac.pkg' -u apps:0wi4Wb2% 'ftp://clickmoveapp.es/pre/ClickMoveApp-mac.pkg'
    curl -T 'electron/dist/latest-mac.yml' -u apps:0wi4Wb2% 'ftp://clickmoveapp.es/pre/latest-mac.yml'
  fi
  if [ "$THIRD_ARGUMENT" == "excel"  ] 
  then
    curl -T 'electron/dist/ExcelTaxi-win.exe' -u binaries:0wi4Wb2% 'ftp://ftp.exceltaxisantcugat.cat/pre/ExcelTaxi-win.exe'
    curl -T 'electron/dist/latest.yml' -u binaries:0wi4Wb2% 'ftp://ftp.exceltaxisantcugat.cat/pre/latest.yml'
    curl -T 'electron/dist/ExcelTaxi-mac.zip' -u binaries:0wi4Wb2% 'ftp://ftp.exceltaxisantcugat.cat/pre/ExcelTaxi-mac.zip'
    curl -T 'electron/dist/ExcelTaxi-mac.pkg' -u binaries:0wi4Wb2% 'ftp://ftp.exceltaxisantcugat.cat/pre/ExcelTaxi-mac.pkg'
    curl -T 'electron/dist/latest-mac.yml' -u binaries:0wi4Wb2% 'ftp://ftp.exceltaxisantcugat.cat/pre/latest-mac.yml'
  fi

fi

if [ $FIRST_ARGUMENT == "all" ] 
then
  sh do lang
  sh do build $2
  sh do compile
  sh do upload $3
fi

#sh do gen src/app/acciones accion
if [ $FIRST_ARGUMENT == "gen" ] 
then
  echo "gen $2 $3"
  cd /Users/xaviergiral/Documents/metacodi/precode/scripts/ionic-angular/
  if [ -z "$THIRD_ARGUMENT" ] 
  then
    npx ts-node generate.ts -f $CURDIR/$2 && cd $CURDIR
  else
    npx ts-node generate.ts -f $CURDIR/$2 -s $3 && cd $CURDIR
  fi
fi

if [ $FIRST_ARGUMENT == "lang" ] 
then
  echo "curl 'https://taxi.metacodi.com/dev/api/i18n?lang=1' -o 'src/assets/i18n/es.json'"
  curl 'https://taxi.metacodi.com/dev/api/i18n?lang=1' -o 'src/assets/i18n/es.json'
   echo "curl 'https://taxi.metacodi.com/dev/api/i18n?lang=2' -o 'src/assets/i18n/ca.json'"
  curl 'https://taxi.metacodi.com/dev/api/i18n?lang=2' -o 'src/assets/i18n/ca.json'
   echo "curl 'https://taxi.metacodi.com/dev/api/i18n?lang=3' -o 'src/assets/i18n/en.json'"
  curl 'https://taxi.metacodi.com/dev/api/i18n?lang=3' -o 'src/assets/i18n/en.json'
fi

if [ $FIRST_ARGUMENT == "npmi" ] 
then
  echo "do $1"
  echo "----------> npm i @angular/google-maps"
  npm i @angular/google-maps
  echo "----------> npm i @awesome-cordova-plugins/action-sheet"
  npm i @awesome-cordova-plugins/action-sheet
  echo "----------> npm i @capawesome/capacitor-badge"
  npm i @capawesome/capacitor-badge
  echo "----------> npm i @awesome-cordova-plugins/calendar"
  npm i @awesome-cordova-plugins/calendar
  echo "----------> npm i @awesome-cordova-plugins/core"
  npm i @awesome-cordova-plugins/core
  echo "----------> npm i @awesome-cordova-plugins/device"
  npm i @awesome-cordova-plugins/device
  echo "----------> npm i @awesome-cordova-plugins/dialogs"
  npm i @awesome-cordova-plugins/dialogs
  echo "----------> npm i @awesome-cordova-plugins/file"
  npm i @awesome-cordova-plugins/file
  echo "----------> npm i @awesome-cordova-plugins/file-opener"
  npm i @awesome-cordova-plugins/file-opener
  echo "----------> npm i @awesome-cordova-plugins/in-app-browser"
  npm i @awesome-cordova-plugins/in-app-browser
  echo "----------> npm i @awesome-cordova-plugins/launch-navigator"
  npm i @awesome-cordova-plugins/launch-navigator
  echo "----------> npm i @awesome-cordova-plugins/media"
  npm i @awesome-cordova-plugins/media
  echo "----------> npm i @capacitor-community/background-geolocation"
  npm i @capacitor-community/background-geolocation
  echo "----------> npm i @capacitor-community/barcode-scanner"
  npm i @capacitor-community/barcode-scanner
  echo "----------> npm i @capacitor-community/electron"
  npm i @capacitor-community/electron
  echo "----------> npm i @capacitor-community/fcm"
  npm i @capacitor-community/fcm
  echo "----------> npm i @capacitor-community/keep-awake"
  npm i @capacitor-community/keep-awake
  echo "----------> npm i @capacitor-community/speech-recognition"
  npm i @capacitor-community/speech-recognition
  echo "----------> npm i @capacitor/action-sheet"
  npm i @capacitor/action-sheet
  echo "----------> npm i @capacitor/android"
  npm i @capacitor/android
  echo "----------> npm i @capacitor/device"
  npm i @capacitor/device
  echo "----------> npm i @capacitor/filesystem"
  npm i @capacitor/filesystem
  echo "----------> npm i @capacitor/geolocation"
  npm i @capacitor/geolocation
  echo "----------> npm i @capacitor/ios"
  npm i @capacitor/ios
  echo "----------> npm i @capacitor/local-notifications"
  npm i @capacitor/local-notifications
  echo "----------> npm i @capacitor/motion"
  npm i @capacitor/motion
  echo "----------> npm i @capacitor/network"
  npm i @capacitor/network
  echo "----------> npm i @capacitor/push-notifications"
  npm i @capacitor/push-notifications
  echo "----------> npm i @capacitor/splash-screen"
  npm i @capacitor/splash-screen
  echo "----------> npm i @ionic/storage-angular"
  npm i @ionic/storage-angular
  echo "----------> npm i @logisticinfotech/ionic4-datepicker"
  npm i @logisticinfotech/ionic4-datepicker
  echo "----------> npm i @metacodi/capacitor-electron"
  npm i @metacodi/capacitor-electron
  echo "----------> npm i @ngx-translate/core"
  npm i @ngx-translate/core
  echo "----------> npm i @ngx-translate/http-loader"
  npm i @ngx-translate/http-loader
  echo "----------> npm i @capawesome/capacitor-app-update"
  npm i @capawesome/capacitor-app-update
  echo "----------> npm i @types/file-saver"
  npm i @types/file-saver
  echo "----------> npm i angular-svg-icon"
  npm i angular-svg-icon
  echo "----------> npm i capacitor-native-biometric"
  npm i capacitor-native-biometric
  echo "----------> npm i cordova-plugin-actionsheet"
  npm i cordova-plugin-actionsheet
  echo "----------> npm i cordova-plugin-calendar"
  npm i cordova-plugin-calendar
  echo "----------> npm i cordova-plugin-device"
  npm i cordova-plugin-device
  echo "----------> npm i cordova-plugin-dialogs"
  npm i cordova-plugin-dialogs
  echo "----------> npm i cordova-plugin-file"
  npm i cordova-plugin-file
  echo "----------> npm i cordova-plugin-file-opener2"
  npm i cordova-plugin-file-opener2
  echo "----------> npm i cordova-plugin-inappbrowser"
  npm i cordova-plugin-inappbrowser
  echo "----------> npm i cordova-plugin-media"
  npm i cordova-plugin-media
  echo "----------> npm i cordova-plugin-navigationbar-color"
  npm i cordova-plugin-navigationbar-color
  echo "----------> npm i file-saver"
  npm i file-saver
  echo "----------> npm i jssip"
  npm i jssip
  echo "----------> npm i moment"
  npm i moment
  echo "----------> npm i socket.io"
  npm i socket.io
  echo "----------> npm i socket.io-client"
  npm i socket.io-client
  echo "----------> npm i uk.co.workingedge.phonegap.plugin.launchnavigator"
  npm i uk.co.workingedge.phonegap.plugin.launchnavigator
  echo "----------> npm i zone.js"
  npm i zone.js
  sh do npmidev
  sh do platforms
fi

if [ $FIRST_ARGUMENT == "npmidev" ] 
then
    echo "npm i @types/google.maps -D"
    npm i @types/google.maps -D
    # echo "npm i @types/jasmine -D"
    # npm i @types/jasmine -D
    # echo "npm i @types/jasminewd2 -D"
    # npm i @types/jasminewd2 -D
    # echo "npm i electron -D"
    # npm i electron -D
    # echo "npm i protractor -D"
    # npm i protractor -D
fi

if [ $FIRST_ARGUMENT == "platforms" ] 
then
    ionic build
    npx cap add android
    npx cap add ios
    npx cap add @capacitor-community/electron
fi

if [ $FIRST_ARGUMENT == "permissions" ] 
then
  echo "do $1"
  cd /Users/xaviergiral/Documents/metacodi/precode/scripts/ionic-angular/
  echo "npx ts-node permissions.ts -f src/app/permissions.ts -c metacodi:SGFhFy1YXj7473FhFy1Y -s ftp.metacodi.com -d /www/taxi/pre/api && cd $CURDIR"
  npx ts-node permissions.ts -f $CURDIR/src/app/permissions.ts -c metacodi:SGFhFy1YXj7473FhFy1Y -s ftp.metacodi.com -d /www/taxi/pre/api && cd $CURDIR
fi
