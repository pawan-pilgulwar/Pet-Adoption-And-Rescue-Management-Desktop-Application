# Pet Adoption and Rescue Management Portal

A modern, full-stack web application designed to streamline pet adoption and rescue operations. This portal provides a comprehensive platform for users to find pets for adoption and report lost/found animals, while giving administrators the tools to manage these processes efficiently.

## 🚀 Key Features

### 🐾 Pet Adoption Management
- **Pet Listings**: Browse available pets with detailed information (breed, age, gender, vaccination status, etc.).
- **Pet Registration**: Administrators can easily register new pets with high-quality images.
- **Status Tracking**: Automated tracking of pet status (Available, Adopted).

### 🆘 Rescue & Reporting
- **Lost and Found Reports**: Users can report lost or found pets with location data and descriptions.
- **Report Status Tracking**: Real-time status updates (Pending, Accepted, Rejected, Closed) for reports.
- **Admin Review**: Centralized system for administrators to review, comment on, and manage rescue reports.

### 🔔 Smart Notifications
- **Real-time Alerts**: Get notified about report status changes, adoption requests, and automated pet matches.
- **Multi-type Notifications**: Categories include Adoption Status, Report Status, Match Found, and General updates.

### 🔐 Secure User Management
- **Role-based Access**: Separate flows for standard Users and Administrators.
- **JWT Authentication**: Secure login and registration using JSON Web Tokens with custom authentication middleware.
- **Profile Management**: Customizable user accounts with profile pictures and contact information.

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 6.0.2
- **API**: Django REST Framework (DRF)
- **Authentication**: Simple JWT + Custom CustomJWTAuthentication
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **Utilities**: `python-dotenv`, `corsheaders`

### Frontend
- **Framework**: React 19 (TypeScript)
- **Styling**: Tailwind CSS
- **State/Data Fetching**: Axios
- **Routing**: React Router 7
- **Cookie Management**: `js-cookie`

## 📂 Project Structure

```text
├── pet_rescue_pro/          # Django Backend
│   ├── adoptions/           # Pet and Adoption management
│   ├── reports/             # Lost and Found reporting
│   ├── users/               # User models and authentication logic
│   ├── notifications/       # Notification delivery system
│   ├── core/                # Shared constants, exceptions, and pagination
│   └── pet_rescue_pro/      # Project configuration (settings, root URLs)
│
├── pet_rescue_frontend/     # React Frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API service layers
│   │   └── assets/          # Static files and styling
│   └── ...
└── venv/                    # Python virtual environment
```

## ⚙️ Installation & Setup

### 1. Backend Setup (Django)

1. Navigate to the backend directory:
   ```bash
   cd pet_rescue_pro
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (create a `.env` file):
   ```env
   SECRET_KEY=your_secret_key
   DEBUG=True
   POSTGRES_DB=pet_rescue_pro
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   ```
5. Apply migrations and start the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### 2. Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd pet_rescue_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
   The portal will be available at `http://localhost:3000`.

## 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---
*Note: This project is part of a dedicated portal for pet management and rescue reporting.*
