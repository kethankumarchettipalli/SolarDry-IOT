🌞 SolarDry IoT – Smart Solar Drying Monitoring System

SolarDry IoT is a comprehensive web and mobile-accessible system designed to monitor, visualize, and manage the solar drying process. Leveraging IoT principles and real-time data handling, this project focuses on providing intelligent decision support and a user-friendly visualization layer for agricultural drying applications.
The system is architected to function seamlessly across Desktop, Mobile Browsers, and Android WebView, ensuring a consistent experience for demonstration and future hardware integration.

🎯 Objectives

Real-Time Monitoring: To track the solar drying parameters and status instantly.
Data Visualization: To present complex sensor data in a clear, readable format.
Responsive UI: To ensure a professional user interface across all device types.
Scalability: To establish a foundation for future AI analysis and automated hardware control.

🧩 Key Features

🔹 Authentication & User Flow
Secure Access: Implemented via Firebase Authentication (Email/Password & Google Sign-In).
State Management: Real-time detection of authentication state for secure session handling.
Optimized Flow: Clean transition from Intro → Login → Dashboard.

🔹 Responsive Design & Navigation
Premium Intro Interface: A modern, high-impact landing screen with glassmorphism and animated elements.
Mobile View: Prioritizes the "Intro" page with a clear "Get Started" CTA for logged-out users and inline login forms.
Desktop View: Features a side-by-side layout (Intro + Login).
Smart UI Logic: Logged-in users see a system loading/connection animation instead of generic login prompts.

🔹 Dashboard & Monitoring
Live Data: Powered by Firebase Realtime Database for instant updates.
Status Visualization: Dynamic display of drying status and progress.
Sensor Metrics: Clear, readable UI for visualizing temperature, humidity, and other sensor values.

🔹 Drying Simulation
Progress Tracking: Visualizes drying progress based on estimated/simulated values.
Demo-Ready: Data fetch mechanisms are designed to support testing and demonstration without immediate dependency on physical hardware.

🛠️ Technology Stack

Category
Technologies
Frontend
React, TypeScript, Tailwind CSS, Responsive Web Design
Backend
Firebase Authentication, Firebase Realtime Database
Mobile
Android WebView (Hybrid Implementation)
Deployment
Vercel (Web), GitHub (Source Control)

📱 Android Application Integration
This project includes a specialized Android WebView implementation, allowing the web platform to function as a native mobile application.
Hybrid Architecture: Runs the web application within a native container.
Native Features: Supports persistent cookies, authentication states, and real-time updates.
Zero-Config Backend: No additional API changes required; the app consumes the same React frontend.
Security: Implements WebChromeClient to handle secure Google Login popups natively.

🔮 Future Scope

🧠 AI-Driven Analysis: Predictive modeling for drying time optimization.
⚙️ Automated Control: Integration with actuators (fans, vents, heaters) for closed-loop control.
📊 Advanced Analytics: Historical data reporting and trend analysis.
🔌 Hardware Integration: Full deployment with physical IoT sensors and microcontrollers.

⚙️ Local Development Setup

To set up the project locally, follow these steps:

Clone the repository:
git clone [https://github.com/your-username/solardry-iot.git](https://github.com/your-username/solardry-iot.git)
cd solardry-iot


Install Dependencies:
npm install


Configure Environment:
Create a .env file in the root directory.
Add your Firebase configuration keys (API Key, Auth Domain, Project ID, etc.).
Run Development Server:
npm run dev


Note: The .env file is excluded from the repository for security. You must provide your own Firebase credentials.

📂 Project Structure
src/
├── components/   # Reusable UI components (Charts, Cards, Nav)
├── pages/        # Application routes (Intro, Login, Dashboard)
├── context/      # Global state management (Auth Context)
├── firebase/     # Firebase initialization and configuration
├── styles/       # Tailwind and global CSS
└── utils/        # Helper functions and constants


👩‍💻 Project Ownership

This project is developed and maintained as part of an academic submission. All design decisions, logic implementations, and architectural choices were made with a focus on academic integrity, clarity, and future scalability.

📜 License

This project is intended for educational purposes only.