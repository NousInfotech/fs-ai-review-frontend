# AI Financial Statement Review SaaS

This is a production-ready frontend for the AI Financial Statement Review SaaS, built with Next.js App Router, TypeScript, and Tailwind CSS.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication (Google Login)
- **State Management**: React Query (TanStack Query)
- **API Client**: Axios
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed.
- A Firebase project with Google Authentication enabled.

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Environment Variables:
   Copy `.env.local.example` to `.env.local` and fill in your Firebase and API details.
   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_API_BASE_URL` (Backend API URL)

3. Run the development server:
   ```bash
   npm run dev
   ```

## Folder Structure

- `app/`: Next.js App Router pages and layouts.
  - `login/`: Login page.
  - `dashboard/`: User dashboard.
  - `upload/`: File upload page.
  - `processing/[uploadId]/`: Status polling page.
  - `results/[uploadId]/`: Analysis results page.
- `components/`: Reusable UI components.
  - `auth/`: Auth related components.
  - `upload/`: Upload related components (Dropzone).
  - `results/`: Result display components (SummaryCard, TestList).
- `contexts/`: React Contexts (AuthProvider).
- `lib/`: Utilities and configurations.
  - `firebase.ts`: Firebase initialization.
  - `api.ts`: Axios instance with interceptors.

## Features implemented

- **Authentication**: Google Login with persistent session.
- **Protected Routes**: Dashboard and workflow pages redirect to login if unauthenticated.
- **File Upload**: Drag and drop PDF upload with validation.
- **Processing Workflow**: Polling mechanism to check analysis status.
- **Results Display**: Comprehensive report view with scoring and compliance tests.
