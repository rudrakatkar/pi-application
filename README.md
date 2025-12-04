☁️ PiCloud: Secure Self-Hosted Personal Cloud

PiCloud is a production-grade, self-hosted Network Attached Storage (NAS) system engineered to run on low-power hardware (Raspberry Pi). It provides a secure, private alternative to commercial cloud storage services like Google Drive or Dropbox.

Designed with a Full-Stack architecture, PiCloud eliminates monthly subscription fees and ensures complete data sovereignty while offering global accessibility through a Zero Trust security model.

📖 Project Overview

The primary objective of this project was to design a file server that bridges the gap between local storage performance and cloud accessibility. Unlike simple SMB shares that work only on a local network, PiCloud provides a modern web interface accessible from anywhere in the world, securely encrypted via HTTPS.

Key Capabilities

Global Accessibility: Access files from any device (Desktop/Mobile) via a custom domain (cloud.katkar.xyz) without exposing home IP addresses.

User Authentication: Secure login system using JWT (JSON Web Tokens) to protect file access.

File Operations: Intuitive UI for uploading, downloading, and browsing files stored on the Raspberry Pi.

Environment Agnostic: The backend features intelligent path detection to switch seamlessly between Development (Laptop) and Production (Raspberry Pi) environments.

⚙️ Technical Architecture

This project utilizes a modern MERN-style stack (swapping MongoDB for SQLite for efficiency on edge devices) and robust DevOps tools for deployment.

1. Hardware Layer

Host: Raspberry Pi 4 Model B (ARM64 Architecture).

OS: Raspberry Pi OS Lite (Headless Linux Debian Bookworm).

Storage: Local high-speed storage managed via Linux file permissions.

2. Frontend (User Interface)

Framework: React.js (v18) initialized with Vite for optimized build performance.

Networking: Axios with Request Interceptors to automatically handle JWT injection for authenticated API calls.

Build Artifact: Compiled into static HTML/CSS/JS assets served via Nginx.

Features: Responsive layout, authentication state management (Login/Register/Dashboard).

3. Backend (API & Logic)

Runtime: Node.js (LTS).

Framework: Express.js REST API.

Database: SQLite (sqlite3) – Chosen for its serverless, zero-configuration, and high-performance characteristics on embedded systems.

File Handling: Multer middleware for streaming multipart file uploads directly to the disk.

Security:

Bcrypt.js for one-way password hashing.

JWT for stateless session management.

4. Infrastructure & DevOps

Web Server: Nginx acts as a Reverse Proxy. It serves the static frontend files and forwards /api requests to the Node.js backend running on port 3000.

Process Management: PM2 handles the Node.js process, ensuring 100% uptime with automatic restarts on crash or system reboot.

Ingress & Security: Cloudflare Tunnel (cloudflared).

Establishes an outbound-only connection to Cloudflare’s global edge network.

Zero Trust: No firewall ports (80/443) are opened on the home router.

SSL/TLS: Automatic HTTPS encryption provided by Cloudflare.

📂 System Data Flow

User Request: User visits https://cloud.katkar.xyz.

Edge Network: Cloudflare receives the request and routes it through the secure Tunnel.

Local Ingress: The cloudflared daemon on the Raspberry Pi receives the packet and forwards it to localhost:80.

Reverse Proxy: Nginx determines if the request is for the Frontend (UI) or Backend (API).

Processing: Node.js validates the User Token and performs file system operations (Read/Write) on the storage drive.

🗂 Project Structure

pi-cloud-project/
├── backend/                  # API Logic
│   ├── middleware/           # Auth verification (JWT)
│   ├── routes/               # Endpoints for Auth and File operations
│   ├── database.js           # SQLite connection & schema
│   └── index.js              # Server entry point & path logic
│
└── frontend/                 # React UI
    ├── src/
    │   ├── api.js            # Axios configuration with smart URL
    │   ├── components/       # Login, Dashboard, Upload UI
    │   └── App.jsx           # Routing logic
    └── dist/                 # Production build files


🚀 Future Improvements

Implement file preview for images and PDFs.

Add multi-file upload and drag-and-drop support.

Create a storage usage visualization dashboard.

Developed by Rudra Katkar
A production-grade implementation of a Personal Cloud Infrastructure.
