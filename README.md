# 稳定币平台

A React + TypeScript + Vite application for Mangrove AI's chat and inbox management platform.

## Local Development

### How to run local server
```cmd
git clone https://github.com/AlexMan2000/BOS_Service_Platform bos_service_frontend
cd bos_service_frontend
npm install
npm run dev
```

The server is accessible at http://localhost:5177

### How to build the project ready for deployment
Run `npm run build` until there is no flagged errors, then you should see a new folder called `project` that contains the build output. The name of the output folder can be modified in **vite.config.js** line 51.

## Project Architecture

### Folder Structure

```
src/
├── assets/               # Static assets (images, icons, fonts)
├── commons/              # Shared components and utilities
│   ├── components/       # Reusable UI components
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── defs/             # Configuration and data files
│   └── auth/             # Authentication utilities
├── fonts/                # Font files
├── hooks/                # Custom React hooks
├── locales/              # Internationalization files
├── pages/                # Page components
│   ├── AdminPages/      # AI chat and inbox features 
│   ├── AdminPages/     # Management page, only for admin, user cannot access
│   └── PublicPages/     # Any role can access, but rendering depends on roles.
├── services/             # API services and configuration
│   ├── api/              # API 
|   ├── axiosInstance.ts  # Axios header/middleware configurations
|   └── config.ts         # API endpoint configs
├── store/                # Redux store configuration
│   ├── slice/            # Redux slices
│       ├── globalSlice/* # Global states, including locale, OS, etc.
│       └── userSlice/*   # Session states, including user profiles.
│   ├── middlewares.ts    # Logging
│   ├── rootHooks.ts      # Redux dispatcher config
│   ├── rootReducers.ts   # Redux dispatcher config
├── App.tsx               # React router and internationalization
├── global.css            # Global css styling, fonts
└── main.tsx              # Application entry point
```
