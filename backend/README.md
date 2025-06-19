# Trivial Compute – Backend

This is the backend for **Trivial Compute**, a simplified online trivia game inspired by Trivial Pursuit. The backend is built with **Django** and provides APIs for question handling, category management, and more.

---

## Folder Structure

- `config/` – Django project settings  
- `game/` – Django app for game logic (questions, answers, etc.)  
- `venv/` – Python virtual environment  
- `db.sqlite3` – SQLite database  
- `manage.py` – Django project management tool  
- `requirements.txt` – Project dependencies

---

## Setup Instructions

### 1. Activate the Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```
**macOS:** 
```bash
source venv/bin/activate
```

### 2. Install Dependencies

If not already installed:
```bash
pip install -r requirements.txt
```

## 3. Run Migrations

Make sure the database schema is up to date:

```bash
python manage.py migrate
```

## 4. Start Server

```bash
python manage.py runserver
```
Access the backend at:
http://localhost:8000/

Test the existing questions at:
http://localhost:8000/api/random-question/ 

## Admin Panel

To add questions and categories through the admin interface:

Go to:
http://localhost:8000/admin/

Log in with superuser credentials:

- user = admin
- password = admin

From here you can:

- Add and manage Questions

- Set up Answer Options

- Assign Categories

- Choose Question Types (e.g., MC = Multiple Choice, SA = Short Answer, TF = True/False)