# Taqweem (تقويم) 🚀
**Smart AI-Powered Exam Generation & Management System**

Taqweem is a modern educational platform designed to help teachers generate exams instantly using Artificial Intelligence, manage students, and track performance with detailed analytics.

![Taqweem Dashboard Preview](https://via.placeholder.com/800x400?text=Taqweem+Dashboard+Preview)

## ✨ Key Features

### 🤖 AI Question Generation
- **Multi-Model Support**: Utilizes powerful AI models (Gemini, Llama, Qwen, etc.) via OpenRouter.
- **Smart Fallback**: Automatically switches models if one fails or is rate-limited.
- **Customizable**: Generate questions by Subject, Skill, Difficulty, and Count.
- **Bank Integration**: Save generated questions directly to your specialized Question Bank.

### 📝 Exam Management
- **Dynamic Exam Creation**: Build exams from your question bank manually or via AI.
- **Access Control**: Activat/Deactivate exams instantly to control student access.
- **Time Limits**: Set strict duration timers for exams.
- **Secure Sharing**: Share exams via a unique 6-character code.

### 🎓 Student Experience
- **Easy Access**: Students join via Exam Code.
- **Identity Options**: Sign in with **Name**, **Email**, or **Google Account** (One-click login).
- **Interactive Interface**: Clean, distraction-free exam environment.
- **Instant Feedback**: Detailed review of answers immediately after submission (configurable).
- **PDF Reports**: One-click printable reports for exam results with custom school branding.

### 📊 Teachers Dashboard
- **Result Tracking**: View all student submissions and grades.
- **Analytics**: Identify student strengths and weaknesses based on skills.
- **Question Bank**: Manage thousands of questions with filtering and editing capabilities.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **UI Components**: [Headless UI](https://headlessui.com/), [Lucide React](https://lucide.dev/)
- **Authentication**: JWT & Google Identity Services (GSI)
- **AI Integration**: OpenAI SDK (configured for OpenRouter)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Database URL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdelrahman47-code/Taqweem.git
   cd Taqweem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add the following keys:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_super_secret_jwt_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

   # AI Service (OpenRouter)
   OPENROUTER_API_KEY=your_openrouter_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---
*Designed & Developed by Abdelrahman Ahmed*
*Footer Design: الأستاذة خديجه ظافر الشهري*
