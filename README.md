# X (Twitter) Clone

This project is a feature-rich clone of **X (formerly Twitter)**, developed using modern web technologies such as
**TypeScript**, **React**, and **Next.js**. It replicates key functionalities of the X platform, delivering a seamless
user experience for social interaction, content sharing, and profile management.

---

#### 🌐 Visit the site at [https://x.chow.my.id](https://x.chow.my.id) ✨

## 🚀 Features

### 🔐 Authentication

- **Login**: Secure user authentication via email and password.
- **Session Management**: Persistent sessions using secure cookies.
- **Error Handling**: User-friendly messages for failed login attempts.

### 👤 User Profiles

- **Profile Display**: View profile details including:
    - Profile picture
    - Name and username
    - Bio
    - Location
    - Website
    - Join date
    - Follower / following counts
- **Editable Profiles**: Users can update their bio, profile picture, and other information (if viewing their own
  profile).
- **Sticky Header**: Profile header stays visible with user info and tweet count.

### 📝 Posts (Tweets)

- **Post List**: Display a user’s tweets.
- **Post Types**: Supports tweets, replies, media, and likes with tab navigation.
- **Error Handling**: Informative messages when posts fail to load or are unavailable.

### 📱 Responsive Design

- Mobile-first, responsive layout optimized for all devices.
- Clean, modern UI with **dark mode** as the default theme.

### 🧭 Navigation

- **Back Navigation**: Easily return to the previous page.
- **Home Navigation**: Return home from error pages or other sections.

### ⏳ Loading & Error States

- **Loading Spinner**: Indicates data is being fetched.
- **Error Messages**: Clear and helpful error display.

### 🔗 Social Links

- Users can add and display external links (e.g., GitHub, personal website) on their profile.

### 👥 Follow System

- Follow and unfollow users (upcoming feature).
- Display follower and following counts.

---

## 🧰 Tech Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **State Management**: React Query
- **API Handling**: Axios
- **Authentication**: Custom token-based auth using cookies
- **Styling**: Tailwind CSS utility-first framework

---

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/chowjustin/x-clone-v2.git
   cd x-clone-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your required environment variables, such as:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open the app**
   Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

---

## 🌱 Future Enhancements

- ✅ Tweet creation
- 🔜 Follow/Unfollow functionality
- 🔔 Notification system
- 💬 Direct messaging
- 🔍 Search for users and tweets

---
