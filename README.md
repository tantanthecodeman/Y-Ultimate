# 🥏 Y-Ultimate Management Platform

> *Digitizing Ultimate Frisbee tournaments and coaching programs* — an open-source management system built for *Y-Ultimate*, a non-profit empowering children through sports and life skills.

---

<!-- //## 🌐 Live Website

👉 [Add your live deployment link here](#)

--- -->

## 📖 Overview

Y-Ultimate uses Ultimate Frisbee to teach life skills to children from under-resourced communities — values like teamwork, fairness, and respect.  
However, all operations (tournaments, attendance, and reporting) were previously managed manually via Google Sheets and Forms.

This platform was built to *replace that fragmented system* with a unified, data-driven, and user-friendly web app to manage both *Tournaments* and *Coaching Programs* — built with *Next.js, **TypeScript, and **Supabase*.

---

## 🎯 Problem We Solved

| Domain                | Manual Process (Before)                       | Our Solution                                                 |
| --------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| Tournament Management | Google Sheets for each event                  | Centralized dashboard for teams, matches, and spirit scoring |
| Coaching Management   | Manual attendance, home visit, and LSAS forms | Unified child profiles with real-time session tracking       |
| Communication         | WhatsApp and email for updates                | In-app live updates and notifications                        |
| Data Reporting        | Manual quarterly aggregation                  | Automated reporting and analytics dashboards                 |

---

## 🧩 Core Features

### 🏆 Tournament Management

- Player and Team registration with approval workflow
- Match scheduling, live scoring, and leaderboard generation
- Spirit scoring system (auto-calculated with 5 categories)
- Roster management and attendance tracking
- Photo gallery and announcements for engagement
- Historical tournament data storage

### 🧑‍🏫 Coaching Programme Management

- Centralized child profiles (with dual participation tracking)
- Real-time attendance marking for sessions
- Home visit tracking linked to profiles
- LSAS (Life Skills Assessment) management and reporting
- Coach workload and session tracking
- Data analytics: participation, gender ratio, program reach

### 🔐 Coming Soon

- Role-based logins for:
  - Admin
  - Volunteer
  - Coach
  - Team Manager
  - Player
- Custom dashboards per role for both *tournament* and *coaching* modules.

---

## 🧱 Tech Stack

| Layer                | Technology                                       |
| -------------------- | ------------------------------------------------ |
| *Frontend*         | Next.js (App Router) + TypeScript + Tailwind CSS |
| *Backend & Auth*   | Supabase (PostgreSQL, Auth, Storage)             |
| *State Management* | React Hooks / Context                            |
| *Deployment*       | Vercel                                           |
| *Version Control*  | GitHub                                           |

---

## ⚙ Installation & Setup

### 1. Clone the Repository

bash
git clone https://github.com/tantanthecodeman/Y-Ultimate.git
cd Y-Ultimate


### 2. Install Dependencies

bash
npm install
# or
yarn install


### 3. Create Environment Variables

Create a .env.local file in the root directory:

env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key


### 4. Run the Development Server

bash
npm run dev


Visit [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Build for Production

bash
npm run build
npm run start


### 6. Database Setup (Supabase)

To set up the database structure, run the SQL queries from the [/db/schema.sql](./db/schema.sql) file in your Supabase SQL Editor.

It creates the necessary tables:

- users (admin, coaches, volunteers, players)
- tournaments, teams, matches, spirit_scores
- children, sessions, home_visits, assessments

Each table is normalized with foreign key relationships and cascade rules for consistency.

---

## 🧭 Project Structure

```
Y-Ultimate/
├── app/                # Next.js routes & pages
├── components/         # UI components (forms, tables, etc.)
├── lib/                # Utility and helper functions
├── public/             # Static assets
├── styles/             # Tailwind / global CSS
├── .env.local.example  # Example environment file
├── package.json
└── README.md

```
---

## 🧠 Data Model (via Supabase)

| Table           | Purpose                                     |
| --------------- | ------------------------------------------- |
| users         | Stores user info (players, coaches, admins) |
| teams         | Team registration & approvals               |
| tournaments   | Tournament details & configurations         |
| matches       | Match scheduling and scores                 |
| spirit_scores | Spirit scoring records                      |
| children      | Coaching program participants               |
| sessions      | Attendance and session records              |
| home_visits   | Community home visit data                   |
| assessments   | LSAS and other evaluations                  |

---

## 📊 Analytics & Reporting

- Participation metrics by gender, region, and program
- Spirit score leaderboards
- Tournament summaries (wins, losses, spirit rank)
- Coach workload and engagement reports

---

## 💡 Future Scope

- ✅ Add role-based access control (RBAC)
- ✅ Mobile-responsive UI for on-field score entry
- 🚀 Push notifications and offline mode for coaches
- 📈 Visual dashboards with charts (Recharts / D3.js)
- 🤝 Integration with WhatsApp API for attendance reminders

---

## 👥 Contributors

| Name              | Role                 |
| ----------------- | -------------------- |
| Tanay Gujarathi   | Front-End Developer  |
| Ronit Shrivastava | Back-End Developer   |
| Sahil Sinha       | Full Stack Developer |

---

## 💬 How to Contribute

We welcome contributions!

1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Submit a pull request

Before committing, ensure code passes linting and follows the project structure.

---

## 📄 License

This project is open-sourced under the *MIT License*.


MIT License
© 2025 Y-Ultimate Hackathon Team


---

## 🏁 Acknowledgments

Built as part of the *T4GC × OASIS Hackathon 2025*.  
Special thanks to *Y-Ultimate* for inspiring this project and for their impactful community work through Ultimate Frisbee.