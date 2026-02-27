# 📱 WhatsApp Connect App

A full-stack web application to generate WhatsApp links with pre-filled messages. Built with **Node.js**, **Express**, **EJS**, **MongoDB**, and **CSS**.

---

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Make sure MongoDB is running
```bash
# On Linux/Mac
mongod

# Or with brew (Mac)
brew services start mongodb-community
```

### 3. Start the App
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 4. Open in Browser
```
http://localhost:4000
```

---

## 📁 Project Structure

```
whatsapp-app/
├── server.js              # Main Express server (port 4000)
├── package.json
├── models/
│   └── Contact.js         # MongoDB schema
├── routes/
│   └── index.js           # All route handlers
├── views/
│   ├── index.ejs          # Home page
│   └── history.ejs        # Contact history page
└── public/
    └── css/
        └── style.css      # All styles
```

---

## ✨ Features

- 🔢 Enter country code + phone number → generates `wa.me` WhatsApp link
- 💬 Pre-filled message: *"Hello! I'd like to connect with you."*
- 🗄️ Saves all contacts to MongoDB
- 📌 If same number is entered again, the "Where to Connect" field is **appended** (comma-separated)
- 📋 History page with all saved contacts + delete functionality
- 🎨 Beautiful dark UI with green WhatsApp theme
- 📱 Fully responsive (mobile + desktop)

---

## 🗄️ MongoDB

- **Connection**: `mongodb://localhost:27017/whatsapp_app`
- **Collection**: `contacts`
- **Fields**: `countryCode`, `phoneNumber`, `whereToConnect`, `createdAt`
