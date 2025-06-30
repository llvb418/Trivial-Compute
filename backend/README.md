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

### 3. Run Migrations

Make sure the database schema is up to date:

```bash
python manage.py migrate
```

### 4. Create database if you have not already done so

### 5. Start Server

```bash
python manage.py runserver
```
Access the backend at:
http://localhost:8000/

Test the existing questions at:
http://localhost:8000/api/get-question/ 

In order for the random question page to work, you need to have set up the database and added questions. To add questions to the database if you have not already, see [Admin Panel](#admin-panel)

## Admin Panel

To add questions and categories through the admin interface:

### Add a superuser for your database instance:

```bash
python manage.py createsuperuser
```

I just used 
- user = admin
- password = admin

### Re-run the server:

```bash
python manage.py runserver
```

### Go to: http://localhost:8000/admin/

### Log in with the superuser credentials you just created

From here you can:

- Add and manage Questions

- Set up Answer Options

- Assign Categories

- Choose Question Types (e.g., MC = Multiple Choice, SA = Short Answer, TF = True/False)



# Board
```
0  1  2  3  4  5  6  7  8
9           10          11
12          13          14
15          16          17
18  19  20  21  22  23  24
25          26          27
28          29          30
31          32          33
34  35  36  37  38  39  40 
```