# Task Management API

API manajemen tugas berbasis GraphQL yang dibangun menggunakan Apollo Server, Express.js, dan MySQL. API ini mendukung autentikasi User serta operasi CRUD untuk tugas.

---

## **Fitur**

- **Autentikasi User:** Registrasi dan login dengan autentikasi JWT.
- **Manajemen Tugas:** Buat, baca, perbarui, dan hapus tugas.
- **Penyaringan dan Validasi:** Filter tugas berdasarkan status dan tanggal jatuh tempo. Validasi input menggunakan Joi.
- **Penanganan Kesalahan:** Respon kesalahan yang komprehensif untuk input atau aksi yang tidak valid.

---

## **Instruksi Instalasi dan Menjalankan**

### **1. Prasyarat**

- **Node.js** (v14 atau lebih baru) terinstal di sistem Anda.
- Server database **MySQL** terinstal dan berjalan secara lokal atau di server.

### **2. Buat Proyek Baru**

```bash
cd task-management-api
cd backend
```

### **3. Instalasi Dependensi**

Instal paket-paket yang dibutuhkan:
```bash
npm install express apollo-server-express graphql mysql2 joi dotenv jsonwebtoken bcrypt jest supertest
```

### **4. Konfigurasi Lingkungan**

Buat file `.env` di direktori root proyek dengan variabel berikut:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=task_management
PORT=4000
JWT_SECRET=your_jwt_secret
```

### **5. Inisialisasi Database**

Eksekusi perintah SQL berikut untuk membuat database dan tabel yang dibutuhkan:

```sql
CREATE DATABASE task_management;
USE task_management;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  dueDate DATE,
  status ENUM('pending', 'in progress', 'completed') NOT NULL,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### **6. Jalankan Server**

Jalankan server dengan perintah berikut:
```bash
node index.js
```

Server akan berjalan di `http://localhost:4000/graphql`.

---

## **Endpoint API**

### **Endpoint GraphQL**

**Base URL:** `POST http://localhost:4000/graphql`

### **Query dan Mutasi GraphQL**

#### **1. Registrasi User**

**Request:**
```graphql
mutation {
  register(user: { username: "testuser", password: "password123" }) {
    id
    username
  }
}
```

**Response:**
```json
{
  "data": {
    "register": {
      "id": "1",
      "username": "testuser"
    }
  }
}
```

#### **2. Login User**

**Request:**
```graphql
mutation {
  login(user: { username: "testuser", password: "password123" }) {
    token
  }
}
```

**Response:**
```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

#### **3. Buat Tugas**

**Request:**
```graphql
mutation {
  createTask(task: { title: "Tugas Contoh", description: "Deskripsi tugas", dueDate: "2025-01-31", status: "pending" }) {
    id
    title
  }
}
```

**Response:**
```json
{
  "data": {
    "createTask": {
      "id": "1",
      "title": "Tugas Contoh"
    }
  }
}
```

#### **4. Dapatkan Daftar Tugas**

**Request:**
```graphql
query {
  getTask(filterByStatus: "pending", filterByDueDate: "2025-01-31") {
    id
    title
    status
  }
}
```

**Response:**
```json
{
  "data": {
    "getTask": [
      {
        "id": "1",
        "title": "Tugas Contoh",
        "status": "pending"
      }
    ]
  }
}
```

#### **5. Detail Tugas**

**Request:**
```graphql
query {
  getTaskDetail(id: "1") {
    id
    title
    description
    dueDate
    status
  }
}
```

**Response:**
```json
{
  "data": {
    "getTaskDetail": {
      "id": "1",
      "title": "Tugas Contoh",
      "description": "Deskripsi tugas",
      "dueDate": "2025-01-31",
      "status": "pending"
    }
  }
}
```

#### **6. Perbarui Tugas**

**Request:**
```graphql
mutation {
  updateTask(id: "1", task: { title: "Tugas Diperbarui", description: "Deskripsi diperbarui", dueDate: "2025-02-01", status: "in progress" }) {
    id
    title
  }
}
```

**Response:**
```json
{
  "data": {
    "updateTask": {
      "id": "1",
      "title": "Tugas Diperbarui"
    }
  }
}
```

#### **7. Hapus Tugas**

**Request:**
```graphql
mutation {
  deleteTask(id: "1") {
    id
    title
  }
}
```

**Response:**
```json
{
  "data": {
    "deleteTask": {
      "id": "1",
      "title": "Tugas Contoh"
    }
  }
}
```

---
