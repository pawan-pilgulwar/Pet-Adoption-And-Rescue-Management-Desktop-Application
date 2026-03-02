# Pet Adoption and Rescue Management Portal

This repository contains a Django-based application developed for managing pet adoptions and rescue operations. It includes models, views, serializers, and tests to handle pets, users, authentication, and related entities.

## Getting Started

### Prerequisites

- Python 3.11+ (or compatible)
- virtualenv or `venv` module

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Pet-Adoption-and-Rescue-Management-Portal_Feb_Batch-8.2_2026
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Apply migrations and run the server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Notes

- A `.gitignore` file has been added to exclude virtual environments, cache files, and other common artifacts.
- Database file `db.sqlite3` is ignored by default.

Feel free to explore the `pet_rescue_app` package for models, views, and serializers. Tests are defined in `pet_rescue_app/tests.py`.

## Frontend (React + TypeScript)

A simple React application using TypeScript and Tailwind CSS provides a landing page plus login and registration forms. The source is located under `pet_rescue_frontend/`.

### Setup

1. Navigate to the frontend directory:
   ```bash
   cd pet_rescue_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   npm install react-router-dom@6
   npm install --save-dev @types/react-router-dom
   ```
3. Run the development server:
   ```bash
   npm start
   ```

By default the landing page will load at `http://localhost:3000/`. Use the links to access the login and registration screens; form submissions currently log values to the console and can be wired to the Django REST API.
