# Berry
> A web app for increasing shopping efficiency and saving money
> This is a multi-page React application

## Table of Contents
- [Project Overview](#project-overview)
- [Build](#build)
- [Tech Stack](#tech-stack)
- [Development Tools](#development-tools)
- [Installation & Setup](#installation--setup)
- [Workflow](#workflow)
- [Extending the Project](#extending-the-project)
- [Testing](#testing)
- [Architecture](#architecture)
- [Contribution Guidelines](#contribution-guidelines)
- [Design Decisions](#design-decisions)
- [Known Bugs](#known-bugs)

## Project Overview

This app allows users to:
- Create a shopping list
- Set a budget amount and edit it
- Shop an online version of stores in their areas inventory
- Shop at all stores in their area or a specific store
- Add items to their shopping cart and see how much is left in their budget and if they are over budget
- See a breakdown of how much was spent in each category
- View their shopping cart with all of the items from all stores
- Remove and increase items in their shopping card
- Use the in person shopping view to easily navigate the store

## Build

The current deployed version of the application can be accessed here:

https://berry-xi.vercel.app/

The build is automatically deployed through Vercel when updates are pushed to the main GitHub branch.

## Tech Stack
- Frontend: React with MUI, Tailwind CSS
- Build Tool: Vite
- Routing: React Router v6
- State Management: React Hooks
- Authentication: Firebase Authentication
- Database: Firebase Firestore
- Deployment: Vercel

## Development Tools

**IDE**
- [WebStorm](https://www.jetbrains.com/webstorm/) — Primary editor
- [Visual Studio Code](https://code.visualstudio.com/) — recommended alternative for development

 **Frameworks & Libraries**
- [React](https://react.dev/) — frontend framework
- [Material UI (MUI)](https://mui.com/) — component library
- [Tailwind CSS](https://tailwindcss.com/) — utility-first CSS
- [Vite](https://vitejs.dev/) — build tool and dev server
- [React Router v6](https://reactrouter.com/) — client-side routing
- [Firebase](https://firebase.google.com/) — authentication and Firestore database

**Utilities**
- [npm](https://www.npmjs.com/) — package manager
- [Git](https://git-scm.com/) — version control
- [GitHub](https://github.com/423S26/project1) — repository hosting and pull request management
- [Vercel](https://vercel.com/) — hosting and continuous deployment


## Installation & Setup
Make sure the following are installed on your machine before starting:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)
- 
1. Clone the repo:
```bash
git clone https://github.com/423S26/project1.git
```
2. Navigate to project folder
```bash
cd project1
```
3. Install dependencies
```bash
npm install
```
4. Firebase and Cloudianry are already configured in `src`. No additional setup is required for development unless you are creating a new project.
   
5. Run project
```bash
npm run dev
```
- Opens at http://localhost:5173 by default
- Default landing page: Home page with nav and points of interest

## Workflow

### Branching
- `main` — production branch, auto-deploys to Netlify on every push
- Feature branches should be named descriptively, e.g. `feat/image-upload` or `fix/cors-error`

### Pull Requests
1. Create a new branch from `main` for your feature or fix
2. Make and test your changes locally
3. Push your branch and open a pull request on GitHub
4. Request a review from a team member before merging
5. Squash and merge into `main` once approved

### Issue Tracking
- Issues are tracked via [GitHub Issues](https://github.com/sylviahutzler/Berry/issues)
- Clearly state what the issue is, where it may occur, and the steps taken to fix

## Extending the Project

### Adding a New Page
1. Create a new file in `src/pages/`, e.g. `src/pages/NewPage.jsx`
2. Add a route in `src/App.jsx`:
```jsx
} />
```
3. Add a navigation link in `src/components/nav.jsx` using the existing `NavItem` component

### Adding a New Firestore Collection
1. Define the collection name as a constant
2. Use `collection(db, 'collectionName')` with Firebase's `addDoc` / `getDocs`
3. Request update to Firestore rules in the Firebase Console if needed


### Modifying the Theme
- Global MUI theme settings are in `src/components/shared-theme/`
- Color primitives are defined in `themePrimitives.js` and can be imported into any component


## Contribution Guidelines
1. Create a new branch for any feature or bug fix
2. Follow consistent React component structure
3. Test changes locally before committing
4. Use descriptive commit messages
5. Submit a pull request for review before merging into `main`
6. Do not commit `.env` files or API keys to the repository

## Design Decisions
- **Vite** was chosen for its fast development server and build times over Create React App
- **Tailwind CSS** was used for fast, utility-first styling
- **MUI** was used for pre-built accessible components and consistent theming
- **Firebase** was selected to simplify backend development — it provides authentication and a managed NoSQL database without needing a custom server
- **React Router** handles all client-side routing; a `_redirects` file in `public/` ensures Vercel serves `index.html` for all routes


## Known Bugs
- No currently known issues, Please see the Issue tracking section for guidelines on reporting bugs
 
  
# Authors
Developed by:

Sylvia Hutzler

Course:

Independent Study

Semester:

Spring 2026
