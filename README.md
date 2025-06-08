This is a full-stack E-Commerce application built using the MERN stack — MongoDB, Express.js, React, and Node.js — developed for practice and learning purposes.

Users can create their own products, list them for sale, and browse products added by others. The app features category and price-based filtering, along with a clean and responsive UI.

🚀 Features
🔐 User Authentication – Register and login securely

🛍️ Product Management – Users can create, update, and delete their own products

🗂️ Category Filters – Filter products by Men, Women, or Unisex

💰 Price Filters – Sort and filter by price range

📱 Responsive Design – Fully responsive UI for mobile, tablet, and desktop

⚙️ RESTful API – Backend built with Express and MongoDB

🧰 Tech Stack
Frontend: React, React Router, Fetch

Backend: Node.js, Express.js

Database: MongoDB with Mongoose

Authentication: JWT (JSON Web Tokens)



---

## 🚀 Getting Started

## 📁 Project Structure
E-Commerce/
├── backend/
├── frontend/
└── .gitignore


Follow these steps to set up the project locally:


### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/e-commerce.git
cd e-commerce

Inside the backend/ folder, create a .env file:

env file 
PORT=5000
MONGO_URL=your_mongo_connection_string
jwToken=your_jwt_secret_key
BUCKET_NAME=your_aws_bucket_name
BUCKET_REGION=your_aws_bucket_region
ACCESS_KEY=your_aws_access_key
SECRET_ACESS_KEY=your_aws_secret_access_key


cd backend
npm install
npm start


cd frontend
npm install
npm run dev
