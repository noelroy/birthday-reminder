# Birthday Reminder

Birthday Reminder is a React Native + Expo app that reads birthdays from your phone contacts and helps you keep track of:

- birthdays happening today
- upcoming birthdays sorted by nearest date
- local birthday notifications

The app uses only on-device contact data and local notifications (no backend required).

## Features

- Contact sync from phone contacts (`expo-contacts`)
- "Today" tab for birthdays happening today
- "Upcoming" tab for future birthdays sorted by date
- Local notification setup (`expo-notifications`)
- Periodic background worker registration (`expo-background-task`)
- Debug tools screen with actions for refreshing contacts, sending test notifications, manually triggering the background worker, and checking task registration status

## Tech Stack

- Expo Router (file-based navigation)
- React Native
- Zustand (lightweight local state)
- Expo Contacts
- Expo Notifications
- Expo Background Task + Task Manager

## Project Structure

- `app/(tabs)/today.tsx`: Birthdays today view
- `app/(tabs)/upcoming.tsx`: Upcoming birthdays view
- `app/(tabs)/settings.tsx`: Debug actions and task status
- `app/index.tsx`: App startup flow (permissions, setup, task registration)
- `lib/dataHelpers.ts`: Contacts permission + contact data processing
- `lib/notificationHelper.ts`: Notification permission + scheduling
- `lib/backgroundTaskHelper.ts`: Background task definition and registration
- `lib/store.ts`: Global app state (`contacts`, `lastSynced`)

## Getting Started

### Prerequisites

- Node.js
- npm
- Android Studio / Xcode (depending on target platform)
- Physical device recommended for notification testing

### Install

```bash
npm install
```

### Run

```bash
npm run start
```

Common platform commands:

```bash
npm run android
npm run ios
npm run web
```

In case the dev server is inaccessible
```bash
npx expo start --tunnel -d -a
```

### Android Development With USB Debugging

#### Quick Start: Build and Install with Expo (Simplest)

```bash
npx expo run:android
```

#### Manual APK Generation and Installation

**Generate native code:**
```bash
npx expo prebuild --clean
```

**Build debug APK:**
```bash
cd android
./gradlew assembleDebug
cd ..
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

**Install via USB:**
```bash
adb devices
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### Release APK

Build release APK:
```bash
cd android
./gradlew assembleRelease
cd ..
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

#### Useful ADB Commands

```bash
adb kill-server && adb start-server
adb reverse tcp:8081 tcp:8081
adb logcat | grep -i "reactnative\|expo\|birthday"
```

### Lint

```bash
npm run lint
```

## How To Use The App

1. Launch the app.
2. Grant Contacts permission when prompted.
3. Grant Notifications permission when prompted.
4. The app redirects to the Today tab once initialization completes.

### Today Tab

- Shows contacts whose birthday matches today.
- If no birthdays exist for today, an empty state message is shown.

### Upcoming Tab

- Shows contacts with birthdays sorted by next upcoming date.
- Displays the computed next birthday date.

### Debug Tab

- `Refresh contacts`: re-fetches contacts and updates `lastSynced`.
- `Test Notification`: sends an immediate local test notification.
- `Test Background Task`: manually triggers background worker (for dev/test).

## Permissions

The app requests:

- Contacts permission: needed to read birthdays from your contacts.
- Notifications permission: needed to show local reminders.

On Android, the app also sets up a `birthdays` notification channel.

## Background Notification Notes

The app registers a periodic background task with a minimum interval (currently every 6 hours). On modern Android/iOS versions, background execution is best-effort and OS-managed.

Important implications:

- Background runs are not exact timers.
- Device battery optimization and app standby can delay execution.
- Force-stopping the app usually prevents background work until user opens the app again.

## Troubleshooting

### App stuck on Loading screen

- Ensure Contacts permission is granted.
- If permission was denied permanently, open app settings and re-enable Contacts.
- Check device logs for permission or background task errors.

### No notifications

- Ensure Notifications permission is granted.
- Test with the `Test Notification` button in Debug tab.
- Disable battery optimization for the app on Android while testing background behavior.

### No birthdays displayed

- Verify contact entries include birthday fields.
- Use `Refresh contacts` in Debug tab.

## Future TODOs

### Reliability First

- Pre-scheduled yearly reminders per contact birthday instead of only background polling.
- Notification deduping so users never get duplicate reminders.
- Missed reminder recovery: if the app was off at trigger time, show a "missed birthdays today" notification on next launch.
- Add a notification health status card in [app/(tabs)/settings.tsx](app/(tabs)/settings.tsx) with permissions, scheduled count, last sync, and task status.

### User Experience

- Search and filter in Today and Upcoming tabs (by month, by name).
- Group upcoming birthdays by month sections.
- Add days-left badges in [app/(tabs)/upcoming.tsx](app/(tabs)/upcoming.tsx).

### Customization

- Reminder time picker (for example, 8:00 AM local time).
- Reminder lead-time options: same day, 1 day before, 1 week before.

### Data and Contacts

- Detect contacts missing birthdays and show "Improve reminders" suggestions.

### Security and Release Readiness

- Add analytics events for key flows: permission granted, reminder sent, reminder tapped.

## Scripts

- `npm run start`: Start Expo dev server
- `npm run android`: Run Android build
- `npm run ios`: Run iOS build
- `npm run web`: Run web target
- `npm run lint`: Run lint checks
- `npm run reset-project`: Reset starter scaffolding
