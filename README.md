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
│   │   ├── Layouts/      # Layout components
│   │   ├── Modal/        # Modal components
│   │   ├── Routers/      # Router components
│   │   ├── BatchImport/  # Batch import functionality
│   │   ├── Menu/         # Menu components
│   │   ├── StackContext/ # Stack context components
│   │   ├── ControlFlow/  # Control flow components
│   │   ├── CopiableCode/ # Copyable code components
│   │   ├── Image/        # Image components
│   │   ├── Inputs/       # Input form components
│   │   ├── LanguageSwitcher/ # Language switching components
│   │   ├── ChatbotModal/ # Chatbot modal components
│   │   └── Buttons/      # Button components
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── defs/             # Configuration and data files
│   ├── configs/          # Configuration files
│   ├── auth/             # Authentication utilities
│   ├── depres/           # Deprecated components/utilities
│   ├── hoc/              # Higher-order components
│   └── styles.ts         # Global styles configuration
├── fonts/                # Font files
├── hooks/                # Custom React hooks
├── locales/              # Internationalization files
├── pages/                # Page components
│   ├── AdminPages/       # Management pages, only for admin, user cannot access
│   ├── UserPages/        # User-specific pages
│   └── PublicPages/      # Any role can access, but rendering depends on roles
├── services/             # API services and configuration
│   ├── api/              # API endpoints and services
│   ├── axiosInstance.ts  # Axios header/middleware configurations
│   └── config.ts         # API endpoint configs
├── store/                # Redux store configuration
│   ├── slice/            # Redux slices
│   │   ├── globalSlice/  # Global states, including locale, OS, etc.
│   │   └── userSlice/    # Session states, including user profiles
│   ├── middlewares.ts    # Logging middleware
│   ├── rootHooks.ts      # Redux hooks configuration
│   ├── rootReducers.ts   # Redux reducers configuration
│   └── store.ts          # Store configuration
├── App.tsx               # React router and internationalization
├── global.css            # Global CSS styling and fonts
├── main.tsx              # Application entry point
└── vite-env.d.ts         # Vite environment type definitions
```

### Routing Rules

The application uses React Router with role-based access control. Routes are protected using `ProtectedRoute` components that check authentication and admin privileges.

#### Public Routes (No Authentication Required)
- `/` → Redirects to `/login`
- `/login` → Login page accessible to all users

#### Admin Routes (Authentication + Admin Role Required)
- `/admin` → Admin dashboard (redirects to user-management by default)
  - `/admin/user-management` → User management interface
    - `/admin/user-management/user-detail` → User detail view
  - `/admin/rights-management` → Rights management interface
    - `/admin/rights-management/right-detail` → Right detail view
  - `/admin/activities-management` → Activities management interface
    - `/admin/activities-management/activity-detail` → Activity detail view
      - `/admin/activities-management/activity-detail/project-detail` → Project detail view

#### User Routes (Authentication Required, Admin Role Not Required)
- `/home` → User landing page (redirects to activities by default)
  - `/home/activities` → Activities overview
    - `/home/activities/projects` → Projects grid view
    - `/home/activities/projects/detail` → Project detail view
  - `/home/rights` → User rights overview
    - `/home/rights/details` → Right details view
  - `/home/profile` → User profile management
    - `/home/profile/details` → Profile details view
    - `/home/profile/rights` → User rights view
    - `/home/profile/transactions` → User transactions view

#### Route Protection
- **Public Routes**: Accessible to all users
- **Protected Routes**: Require user authentication (`login_required={true}`)
- **Admin Routes**: Require both authentication and admin privileges (`admin_required={true}`)
- **User Routes**: Require authentication but do not require admin privileges (`admin_required={false}`)
