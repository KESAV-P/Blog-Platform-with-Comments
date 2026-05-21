# BlogSphere

BlogSphere is a production-grade, editorial-magazine-style blogging platform featuring user session authentication, interactive rich-text article composition, detailed author metrics, and recursive threaded discussion threads.

---

## Key Features

1. **User Authentication & Session Controls**:
   - Secure account registration and login via JWT (JSON Web Tokens) and `bcryptjs` password hashing.
   - User profile customizer (updating biography details and uploading custom avatars via Multer).
2. **Editorial Composition**:
   - High-impact rich-text article writing canvas built on **TipTap**.
   - Categories selection, custom tag lists, and cover image uploads.
   - Publishing control toggles (Drafts vs. Published).
3. **Interactive Discussions**:
   - **Recursive Threaded Comments**: Nested comments rendering with infinite visual depth capping.
   - Inline reply forms, inline edits, and deletion alerts.
   - Likes toggles on both articles and comments.
4. **Author Analytics Console**:
   - Interactive widgets detailing total publications, accumulated views, total likes, and drafts pending.

---

## Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Zustand, Axios, TipTap Editor, Lucide Icons, React Hot Toast, React Hook Form + Zod.
- **Backend**: Node.js, Express.js, JWT, BcryptJS, CORS, Helmet, Morgan, Express Rate Limit, Multer.
- **Database**: MongoDB & Mongoose.

---

## Project Structure

```text
├── client/                 # React 18 frontend
│   ├── src/
│   │   ├── components/     # UI elements, layouts, and forms
│   │   ├── hooks/          # Zustand store hooks
│   │   ├── pages/          # Layout page containers
│   │   └── utils/          # Axios wrappers and helper utilities
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Express backend API
│   ├── config/             # DB connectivity
│   ├── controllers/        # Route controllers (Auth, Posts, Comments, Users)
│   ├── middleware/         # Session guard, rate limits, error logging, and uploads
│   ├── models/             # Mongoose schemas (User, Post, Comment)
│   └── server.js           # Server initializer
├── package.json            # Root monorepo runner
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB running locally or a remote MongoDB Atlas URI.

### Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/KESAV-P/Blog-Platform-with-Comments.git
cd Blog-Platform-with-Comments
npm run install_all
```

### Configuration
Create a `.env` file in the `server/` directory and configure the environment variables:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/blogsphere
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Running Locally
To launch both the client development server and Express server concurrently:
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5001](http://localhost:5001)

---

## API Documentation

### Auth & Users
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate user credentials
- `GET /api/auth/me` - Fetch profile of active session
- `GET /api/users/username/:username` - Fetch public user info
- `PUT /api/users/profile` - Update bio, username, or profile avatar (FormData)

### Posts
- `POST /api/posts` - Create post (with `coverImage` file)
- `GET /api/posts` - Fetch paginated and filtered posts
- `GET /api/posts/:slug` - Fetch details of single post (increments view count)
- `GET /api/posts/id/:id` - Fetch single post by ID
- `PUT /api/posts/:id` - Update post details
- `DELETE /api/posts/:id` - Delete post and all nested comments
- `POST /api/posts/:id/like` - Toggle like status on post
- `GET /api/posts/user/:userId` - Fetch posts authored by user

### Comments
- `POST /api/posts/:postId/comments` - Create comment or reply
- `GET /api/posts/:postId/comments` - Retrieve comments tree structure
- `PUT /api/comments/:id` - Edit comment body
- `DELETE /api/comments/:id` - Delete comment and its sub-replies
- `POST /api/comments/:id/like` - Toggle comment like status
