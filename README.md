# ✅ Todo App

A simple task management web app built with **Laravel**, designed to help users create, update, complete, and delete tasks with ease.

This project was developed as part of a school assignment to demonstrate practical skills in Laravel, Blade templating, and PostgreSQL integration.

---

## 📋 Features

- Add new tasks
- Edit existing tasks
- Mark tasks as completed
- Delete tasks
- Responsive UI using Tailwind CSS

---

## 🛠 Tech Stack

- **Backend:** PHP 8.x, Laravel 11
- **Frontend:** Blade templating with Tailwind CSS
- **Database:** PostgreSQL

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/todo-app.git
cd todo-app
```
### 2. Install dependencies
```bash
composer install
npm install && npm run dev
```
### 3. Set up your `.env` file
Copy the example environment file and configure your database settings.
```bash
cp .env.example .env
```
Edit .env and set your PostgreSQL credentials:
```bash
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```
### 4. Generate application key
```bash
php artisan key:generate
```
### 5. Run migrations
```bash
php artisan migrate
```
### 6. Serve the app
```bash
php artisan serve
```
The app will be available at http://localhost:8000

---
About

This application was created as a school project to demonstrate knowledge in Laravel framework, Blade templating, and PostgreSQL database integration.
