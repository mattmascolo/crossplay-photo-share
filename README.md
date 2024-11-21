# Crossplay Photos: Cross-Platform Lossless Photo Sharing

## Overview
Crossplay Photos is a React Native mobile application designed to solve the challenge of sharing high-resolution photos seamlessly across iOS and Android devices. Built with Expo, the app provides a secure, user-friendly platform for photo sharing.

## Key Features
- 🔒 Secure user authentication via Supabase
- 📱 Cross-platform compatibility (iOS & Android)
- 💾 Lossless photo storage using Supabase Storage
- 📥 Bulk download functionality
- 🔐 User-specific file storage and access

## Technologies
- React Native
- Expo
- Supabase (Authentication & Storage)
- TypeScript
- Expo Router

## Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo CLI

## Configuration
1. Set up Supabase keys in `config/initSupabase.ts`
2. Create a `files` bucket in Supabase Storage
3. Apply upload policies using `create-policy.sql`

## Installation
```bash
# Clone the repository
git clone https://your-repo-url/crossplay-photos.git

# Navigate to project directory
cd crossplay-photos

# Install dependencies
npm install

# Start the Expo development server
npm expo start
```

## Running on Devices
```bash
# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web (limited functionality)
npm run web
```

## Key Functionalities
- User registration and authentication
- Photo upload to user-specific storage
- Bulk photo download
- Secure, permission-based file access

## Future Roadmap
- Enhanced photo editing features
- Sharing capabilities
- Improved UI/UX
- Performance optimizations

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
