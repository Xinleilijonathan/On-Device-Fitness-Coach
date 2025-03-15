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

