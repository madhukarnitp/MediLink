# MediLink Android App

This is a React Native Android starter for the existing MediLink backend. It uses Expo so you can run it quickly on an Android emulator or Expo Go.

## Setup

From the repository root:

```powershell
npm run install-android
```

Start the backend, realtime server, and frontend services as usual:

```powershell
npm run dev
```

Then start the Android app:

```powershell
npm run android
```

## API URL

For the Android emulator, the default API URL is:

```text
http://10.0.2.2:5001/api
```

For a physical phone, create `android-app/.env` and use your computer's LAN IP address:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:5001/api
EXPO_PUBLIC_REALTIME_URL=http://YOUR_COMPUTER_IP:5002
```

Your phone and computer must be on the same Wi-Fi network.

## Demo Login

After seeding the backend, use:

```text
patient1@medilink.com
pass123
```

Other seeded roles:

```text
doctor1@medilink.com
admin@medilink.com
```

