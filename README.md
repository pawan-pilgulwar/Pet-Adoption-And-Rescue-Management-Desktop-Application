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
