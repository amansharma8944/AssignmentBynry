# User Management Application

## Overview
This is a user management application built with Vite and React. The application allows users to view a list of profiles, navigate to individual profile pages, and interact with Google Maps for location details. Additionally, an admin dashboard is available for filtering, adding, and editing users.

## Installation and Setup
Follow these steps to set up and run the application locally:

### 1. Clone the Repository
```sh
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Run the Application in Development Mode
```sh
npm run dev
```
The application will start and be accessible at `http://localhost:5173/` (or another available port).

## Features

### Landing Page
- Displays a list of all users.
- Clicking on a user's profile image redirects to their profile page.
- Clicking on a user's location opens Google Maps with the user's address.

### Navigation
- The navbar includes a link to the **Admin Dashboard**, allowing direct access.

### Admin Dashboard
- **Filter Users**: Search and filter users based on various criteria.
- **Add Users**: Add new users to the system.
- **Edit Users**: Modify existing user details.

## Tech Stack
- **Frontend:** Vite, React.js, JavaScript, Tailwind CSS
- **Backend (if applicable):** Firebase (or other database integration)
- **API:** REST API for user data

## Contributing
Feel free to fork the repository and submit pull requests with improvements or bug fixes.

## License
This project is licensed under the MIT License.

