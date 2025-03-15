# On-Device-Fitness-Coach
On-device AI hackathon project

# Project Environment Setup

This project uses a Python virtual environment to manage dependencies. Below are the steps to set up the environment on your local machine.

## 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/Scarlet23333/On-Device-Fitness-Coach.git
cd /path/to/project
```

## 2. Create the Virtual Environment

Navigate to the project root directory and create a virtual environment using the following command:

```bash
python -m venv .venv
```

This will create a hidden `.venv` folder in the root of the project, which will contain the isolated Python environment.

## 3. Activate the Virtual Environment

Once the virtual environment is created, activate it with the appropriate command for your operating system:

- **On macOS/Linux:**

  ```bash
  source .venv/bin/activate
  ```

- **On Windows:**

  ```bash
  .venv\Scripts\activate
  ```

After activation, you should see `(.venv)` at the beginning of your terminal prompt, indicating that the virtual environment is active.

## 4. Install Dependencies

With the virtual environment active, install the required dependencies using `pip`:

```bash
pip install -r requirements.txt
```

This will install all the Python packages listed in the `requirements.txt` file.

## 5. Deactivate the Virtual Environment

When you're done working on the project, you can deactivate the virtual environment by running:

```bash
deactivate
```

This will return you to the system's default Python environment.

# On-Device AI Fitness Coach

Real-time AI fitness coach that provides instant feedback on your exercise form using pose detection.

## Project Structure

```
On-Device-Fitness-Coach/
├── ai-fitness-app/     # Frontend React application
└── backend/           # Backend server (coming soon)
```

## Quick Start

```bash
# Frontend setup
cd ai-fitness-app
npm install
npm run dev
```

The app will run at `http://localhost:5173`

## Features
- Real-time pose detection and feedback
- Exercise library with form guidance
- Visual skeleton overlay
- Exercise completion tracking
- External projector support (coming soon)

## Development Status
- ✅ Frontend: Basic features implemented with mock data
- 🚧 Backend: In development (MediaPipe integration coming soon)

## Team Members
Xinlei Li 		li.xinle@northeastern.edu
Yiyi Wang  		wang.yiyi2@northeastern.edu
Ruixin Shi 		shi.ruixi@northeastern.edu
Yushuang Huang	huang.yushu@northeastern.edu
Ruoxuan Chen 	chen.ruoxu@northeasstern.edu

## For More Details
- See [Frontend README](ai-fitness-app/README.md) for detailed frontend setup
- Backend documentation coming soon
