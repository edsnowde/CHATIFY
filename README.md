# 📱 Chatify – AI-Powered Social Platform for Students

**Chatify** is a social networking platform tailored for academic communities, enabling seniors and juniors to connect, share experiences, and collaborate. The platform integrates cutting-edge **AI-powered content moderation** and **context-based authentication** to enhance safety, privacy, and trust among users.

---

## 📌 Abstract

The rise of social media has introduced challenges in ensuring safe and authentic online interactions. A critical issue is the spread of harmful content and unauthorized access to accounts. This project investigates the integration of **multimodal AI techniques** and **context-based authentication** to address these concerns. 

While existing moderation systems often focus solely on text, Chatify expands moderation to **images, videos, and speech** using models like **CLIP**, **Whisper**, and **BART**. For enhanced security, context-aware mechanisms analyze device, location, and user behavior using **One-Class SVM** for anomaly detection. The outcome is a secure, intelligent platform that redefines the safety and authenticity of online communities.

---

## 🛠️ Tech Stack

### 🔹 Frontend
| Tech           | Role                | Why It's Used                                                  |
|----------------|---------------------|----------------------------------------------------------------|
| React.js       | Frontend Library     | For building UI with reusable components                      |
| TypeScript     | Typed JavaScript     | Adds type safety to JavaScript code                           |
| Vite           | Build Tool           | Fast dev server & bundler for React                           |
| Tailwind CSS   | Styling              | Utility-first CSS for fast, responsive design                 |
| shadcn/ui      | UI Components        | Accessible pre-built UI components                            |
| React Router   | Routing              | Enables navigation across pages like Home, Auth, Profile      |
| date-fns       | Date Utilities       | Helps format and manage dates easily                          |

### 🔹 Backend
| Tech           | Role                 | Why It's Used                                                  |
|----------------|----------------------|----------------------------------------------------------------|
| Node.js        | Backend Runtime       | Executes JavaScript on the server                             |
| Express.js     | Web Framework         | REST API creation simplified                                  |
| MongoDB        | NoSQL Database        | Stores user profiles, posts, and comments                     |
| Mongoose       | MongoDB ODM           | Interacts with MongoDB using JS models                        |
| JWT            | Authentication        | Secures login/signup flows                                    |
| bcrypt.js      | Password Hashing      | Safely stores user passwords                                  |
| dotenv         | Environment Variables | Secures API keys and secrets                                  |

---

## 🧠 AI Technologies Used

- **CLIP** – Multimodal image-text analysis for content moderation
- **Whisper** – Speech-to-text for moderating audio content
- **Perspective API / BART** – Text classification and toxicity filtering
- **One-Class SVM** – Anomaly detection for secure authentication

---

## 🚀 Features

- 👥 Senior-junior interaction platform
- 🛡️ AI-powered content moderation (text, image, speech)
- 🔐 Context-aware authentication (location, device, behavior)
- 🧾 Profile creation, post sharing, liking, commenting
- 📦 Secure storage of user data using MongoDB

---

## 🧩 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/chatify.git
cd chatify
```

---

### 2️⃣ Frontend Setup

```bash
cd client
npm install
npm run dev
```

### 3️⃣ Backend Setup

```bash
cd server
npm install
npm run dev
```

> 🔐 Make sure to create a `.env` file in the `/server` directory and add the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 🌐 Live Demo

🚧 Coming soon…

---

## 🤝 Contributing

We welcome contributions and feedback! If you'd like to fix a bug, improve a feature, or add something new — feel free to fork the repo and submit a pull request.

---

## ⭐️ Show Your Support

If you found this project useful or inspiring, leave a ⭐️ on the repository to support the team!

```