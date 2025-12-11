# Antigravity Archive

A web archive project designed to creatively display various works. This platform serves as a digital gallery, offering an immersive experience with interactive elements and a comprehensive management system.

## Key Features

### ❄️ Interactive Snow Effect
- **Toggleable Animation**: A "Let it Snow" button allows users to toggle a global snow effect on and off.
- **Dynamic UI**: The button icon updates primarily to reflect the current state (Start/Stop).
- **Cache Handling**: Recent updates include cache busting strategies to ensure the latest assets are always loaded.

### 🎨 Work Archive
- **Grid Layout**: Works are displayed in a responsive grid layout.
- **Filtering**: Supports filtering works by Author (e.g., `/output?author=Name`).
- **Detailed View**: dedicated pages for individual work details.

### 🛠️ Admin Dashboard
- **Secure Access**: Dedicated login page for administrators.
- **Content Management**:
    - **Output Manager**: Add, edit, and delete work entries.
    - **Slider Manager**: Manage the hero slider content on the main page.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend/Database**: Supabase
- **Deployment**: (Add deployment details here if applicable)

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```
