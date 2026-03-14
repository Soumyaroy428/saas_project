# VideoSaaS

A modern video compression and sharing platform built with Next.js, featuring AI-powered compression, secure cloud storage, and seamless social sharing.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![React](https://img.shields.io/badge/React-19.2.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

### Core Features
- **Video Compression** - Reduce file sizes by up to 80% without losing quality
- **Cloud Storage** - Secure video storage powered by Cloudinary
- **User Authentication** - Secure auth with Clerk (Sign In/Sign Up)
- **Dashboard** - Real-time video statistics and recent activity
- **Video Upload** - Drag-and-drop upload with progress tracking
- **Social Sharing** - Share videos directly to social platforms

### Technical Features
- **AI-Powered Compression** - Smart compression algorithms
- **4K Output Support** - High-quality video processing
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Mode** - Built-in dark theme support with DaisyUI
- **Real-time Updates** - Dynamic dashboard with live video stats

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Frontend**: React 19.2.3, TypeScript 5.0
- **Styling**: Tailwind CSS 3.4, DaisyUI 5.5
- **Authentication**: Clerk (@clerk/nextjs)
- **Database**: Prisma ORM with SQLite
- **Cloud Storage**: Cloudinary
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saas_project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
saas_project/
├── app/
│   ├── (app)/                 # Protected app routes
│   │   ├── dashboard/         # Dashboard with video stats
│   │   ├── home/              # User's video gallery
│   │   ├── video-upload/      # Video upload page
│   │   ├── social-share/      # Social sharing page
│   │   ├── settings/          # User settings
│   │   └── layout.tsx         # App layout with sidebar
│   ├── (auth)/                # Auth routes
│   │   ├── sign-in/           # Sign in page
│   │   └── sign-up/           # Sign up page
│   ├── api/                   # API routes
│   │   ├── video/             # Get user videos
│   │   ├── videoUpload/       # Upload video to Cloudinary
│   │   └── cloudinary-signature/ # Cloudinary signature
│   ├── page.tsx               # Landing page
│   └── layout.tsx             # Root layout with Clerk
├── components/                # React components
│   └── videoCard.tsx          # Video card component
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── .env.local                 # Environment variables
└── package.json
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/video` | GET | Fetch user's uploaded videos |
| `/api/videoUpload` | POST | Upload video to Cloudinary & save to DB |
| `/api/cloudinary-signature` | GET | Get Cloudinary upload signature |

## Database Schema

### Video Model
```prisma
model Video {
  id             String   @id @default(uuid())
  title          String
  description    String?
  publicId       String
  originalsize   String
  compressedsize String
  duration       String
  userId         String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | SQLite database file path | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## Features in Detail

### Video Upload
- Supports MP4, MOV, AVI formats
- Maximum file size: 100MB
- Progress tracking during upload
- Automatic compression after upload
- Cloudinary integration for storage

### Dashboard
- Total videos uploaded
- Space saved statistics
- Uploads this month counter
- Recent activity feed
- Real-time data updates

### User Profile
- Display name and email
- Profile picture from Clerk
- Click to open account management
- Secure sign out

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 VideoSaaS SoumyaRoy. All rights reserved.

## Author

**Soumya Roy**

---

Built with ❤️ using Next.js, React, and TypeScript.
