# 🌞 SolarDry IoT – Automated Solar Dryer Monitoring System

An IoT-based monitoring and visualization system for an **automated solar dryer**, designed to track real-time environmental conditions such as **temperature and humidity** for selected agricultural products using **ESP32, Firebase, and a web dashboard**.

---

## 📌 Project Overview

SolarDry IoT is developed to support **controlled solar dehydration** of agricultural products.  
The system continuously monitors sensor data from a solar dryer cabin and visualizes it through a modern web dashboard and Android app (WebView-based).

The project focuses on **seven predefined agricultural products**, each with fixed drying parameters based on standard agricultural practices.

---

## 🎯 Objectives

- Monitor real-time temperature and humidity inside a solar dryer
- Visualize sensor data using charts and status indicators
- Compare live data against predefined crop-specific thresholds
- Provide a responsive web dashboard and Android application
- Ensure simple, reliable, and academic-friendly system design

---

## 🧩 System Architecture

ESP32 + Sensors
↓
Firebase Realtime Database
↓
Web Dashboard (React)
↓
Android App (WebView)

yaml
Copy code

---

## 🛠️ Hardware Components

- ESP32 Development Board  
- DHT11 Temperature & Humidity Sensor  
- 12V Cooling Fans  
- Relay Module (12V)  
- OLED Display (0.96”)  
- Power Supply (12V Adapter)  
- Solar Dryer Cabin (designed using AutoCAD)  

---

## 💻 Software Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts (Data Visualization)
- Lucide / Emoji Icons

### Backend & Cloud
- Firebase Realtime Database
- Firebase Authentication (Email/Password + Google Sign-In)

### Embedded System
- ESP32 (C++ using Arduino IDE)
- HTTP-based Firebase communication

### Mobile App
- Android Studio
- WebView-based Android application

---

## 🌾 Supported Crops (Fixed Scope)

The system supports **seven predefined agricultural products**:

| Crop | Temperature (°C) | Humidity (%) | Drying Time (hrs) |
|----|------------------|--------------|-------------------|
| Tomato | 55–65 | 10–15 | 8 |
| Mango | 50–55 | 12–18 | 12 |
| Banana | 50 | 15–20 | 10 |
| Chilli Pepper | 60 | 8–12 | 6 |
| Fish | 55–60 | 10–15 | 10 |
| Cassava | 50–55 | 12–18 | 10 |
| Coffee Beans | 45–50 | 12–15 | 24 |

> Crop parameters are **hardcoded** to ensure reliability and simplicity as per project scope.

---

## 📊 Key Features

- Real-time sensor data visualization
- Crop-based drying parameter selection
- Target vs actual deviation monitoring
- Firebase-powered live updates
- User authentication (Email + Google)
- Dark/Light mode with preference persistence
- Android app via WebView wrapper

---

## 🔐 Firebase Usage

### Realtime Database Structure
/liveData
├── temperature
├── humidity
└── timestamp

/users/{uid}
└── theme

yaml
Copy code

### Authentication
- Email & Password
- Google Sign-In

---

## 🚀 Setup Instructions

### 1️⃣ Web Dashboard
```bash
npm install
npm run dev
2️⃣ Firebase Configuration
Create Firebase project

Enable Authentication

Enable Realtime Database

Replace Firebase config placeholders in the project

3️⃣ ESP32
Open Arduino IDE

Paste provided ESP32 C++ code

Update WiFi credentials & Firebase URL

Upload to ESP32