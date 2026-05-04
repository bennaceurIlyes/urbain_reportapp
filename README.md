# 🇩🇿 Urban Report - Algerian Citizen Portal

Urban Report is a premium mobile application designed for Algerian citizens to report and track urban issues (such as potholes, lighting failures, or waste management) directly to local authorities. Built with **React Native (Expo)** and **Supabase**, it features a modern, high-performance UI themed after the Algerian national identity.

## ✨ Features

- **Algerian National Theme**: A premium UI/UX design using the Algerian Green (#006233), Red, and White palette.
- **My Submissions Dashboard**: A personalized view where users can track the status of their own reported issues.
- **Multimedia Reporting**: Capture or upload photos of urban problems directly from the app.
- **Geographic Tagging**: Automatically tag the precise location of reported issues for faster resolution.
- **Real-time Status Tracking**: Monitor the progress of reports from "Pending" to "Resolved" with a detailed timeline.
- **Secure Authentication**: User accounts managed via Supabase Auth with encrypted sessions.

## 🚀 Tech Stack

- **Frontend**: React Native with Expo 54
- **UI Framework**: Gluestack UI (Styled with Vanilla CSS patterns)
- **Icons**: Lucide React Native
- **Backend/Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for high-quality image attachments
- **Navigation**: React Navigation (Native Stack & Bottom Tabs)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- Expo Go app on your mobile device (for testing)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/bennaceurIlyes/urbain_reportapp.git
   cd urban-issue-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npx expo start
   ```

## 📂 Project Structure

- `screens/`: Core application screens (Home, Report, Details, Auth).
- `services/`: API integration and Supabase configuration.
- `navigation/`: App routing and navigation configurations.
- `components/`: Reusable UI components (Buttons, Cards, etc.).
- `hooks/`: Custom React hooks for auth and state management.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any feature requests or bug reports.

## 📄 License

This project is licensed under the MIT License.
