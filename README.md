# Untitled

# DSO101 Final Project - DevSecOps Pipeline with BMI Calculator

## What This Project Does

This project demonstrates how to build a complete software pipeline that automatically tests, builds, and deploys a web application. I used a PERN stack (PostgreSQL database, Express.js backend, React frontend, and Node.js) and added a BMI calculator feature to it.

The main goal is to make everything automatic - from testing code to putting it live on the internet - using free tools like Jenkins, GitHub Actions, Docker, and Render.

## My Project Setup Process

### Getting Started

I started by creating my own GitHub repository for this assignment:

1. **Made a new repository** called `DSO101-DevSecOps-Project`
2. **Downloaded the starter code** from the given repository
3. **Cleaned it up** by removing the old git files and making it mine

```bash

bash
# Here's what I did:
git clone https://github.com/Darshansgit/DSO101_SE_project.git
cd DSO101_SE_project
rm -rf .git# Remove old git history
git init# Start fresh
git remote add origin https://github.com/my-username/DSO101-DevSecOps-Project.git

```

### Making Sure Everything Works First

Before doing any fancy automation, I tested the basic app on my computer:

- Installed all the needed packages with `npm install`
- Started the app with `npm start`
- Made sure I could see it in my web browser
- Ran the existing tests to check they work

## The BMI Calculator Feature I Added

### What It Does

I built a BMI calculator that:

- Lets users type in their height (in centimeters), weight (in kilograms), and age
- Calculates their BMI using the math formula: weight ÷ (height in meters)²
- Shows them if they're underweight, normal weight, overweight, or obese
- Saves their information in the database so they can see it later

### How I Built It

### Frontend Part (What Users See)

I created a new React component called `BMICalculator.ts` that has:

- Input boxes for height, weight, and age
- Buttons to calculate BMI or save the result
- A nice display showing the BMI result and category
- A history section to see past calculations

### Backend Part (Server Logic)

I added new API endpoints in the backend:

- `GET /api/bmi/records` - Gets all saved BMI records
- `POST /api/bmi/calculate` - Saves a new BMI calculation
- The server connects to a PostgreSQL database to store the data

### Database Changes

I created a new table called `bmi_records` with these columns:

- `id` - unique number for each record
- `height` - person's height in centimeters
- `weight` - person's weight in kilograms
- `age` - person's age in years
- `bmi` - calculated BMI value
- `created_at` - when the record was made

![alt text](<output screenshots/Screenshot from 2025-06-16 03-57-30.png>)

### Testing My BMI Calculator

I wrote tests using Jest to make sure everything works correctly:

- Tests that BMI calculation gives the right answer
- Tests that the database saves information properly
- Tests that the API endpoints work as expected
- Tests that handle errors when users type wrong information

![alt text](<output screenshots/Screenshot from 2025-06-17 22-59-23.png>)

![alt text](<output screenshots/Screenshot from 2025-06-18 00-22-41.png>)

## 🐳 Stage 1: Making It Work with Docker

### What Docker Does

Docker packages my application into containers - think of them like virtual boxes that contain everything needed to run the app. This makes it easy to run the same app on different computers.

### Docker Files I Created

**For the Frontend (Dockerfile.frontend):**

```

dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

```

**For the Backend (Dockerfile.backend):**

```

dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start"]

```

**Docker Compose File (docker-compose.yml):**

This file tells Docker how to run all the containers together:

```yaml

yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    volumes:
      - ./backend:/app
      - /app/node_modules

  database:
    image: postgres:13
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:

```

### Running Tests in Docker

I can run all my tests inside Docker containers:

```bash

bash
# Start all containers
docker-compose up -d

# Run backend tests
docker-compose exec backend npm test

# Run frontend tests
docker-compose exec frontend npm test

```
But there was an error while running the tests like mismatched of node versions.

```
  WARN[0000] /home/kuenzangrabten/DSO-FinalAssignment/docker/docker-compose-prod.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
Compose now can delegate build to bake for better performances
Just set COMPOSE_BAKE=true
[+] Building 1.6s (14/17)                                          docker:default
 => [test internal] load build definition from Dockerfile.dev                0.0s
 => => transferring dockerfile: 653B                                         0.0s
 => [test internal] load metadata for docker.io/library/node:18-alpine       1.6s
 => [test internal] load .dockerignore                                       0.0s
 => => transferring context: 100B                                            0.0s
 => [test internal] load build context                                       0.0s
 => => transferring context: 2.24kB                                          0.0s
 => CANCELED [test  1/13] FROM docker.io/library/node:18-alpine@sha256:8d64  0.0s
 => => resolve docker.io/library/node:18-alpine@sha256:8d6421d663b4c28fd3eb  0.0s
 => => sha256:8d6421d663b4c28fd3ebc498332f249011d118945588d 7.67kB / 7.67kB  0.0s
 => => sha256:929b04d7c782f04f615cf785488fed452b6569f87c73f 1.72kB / 1.72kB  0.0s
 => => sha256:ee77c6cd7c1886ecc802ad6cedef3a8ec1ea27d1fb961 6.18kB / 6.18kB  0.0s
 => CACHED [test  2/13] WORKDIR /app                                         0.0s
 => CACHED [test  3/13] COPY package.json ./                                 0.0s
 => CACHED [test  4/13] COPY sync-package-lock ./                            0.0s
 => CACHED [test  5/13] RUN npm install --legacy-peer-deps && npm install -  0.0s
 => CACHED [test  6/13] COPY nodemon.json ./                                 0.0s
 => CACHED [test  7/13] COPY tsconfig.json ./                                0.0s
 => CACHED [test  8/13] COPY src ./src                                       0.0s
 => CACHED [test  9/13] COPY database ./database                             0.0s
 => ERROR [test 10/13] COPY database/migrations ./database/migrations        0.0s
------
 > [test 10/13] COPY database/migrations ./database/migrations:
------
failed to solve: failed to compute cache key: failed to calculate checksum of ref 094ae383-bb2c-4735-9e6f-d29e3f6a56d1::qcepdafad20a69ly30x2tj93a: "/database/migrations": not found

```
And eventually not able to solve the error.

## Stage 2: Jenkins Automation

### What Jenkins Does

Jenkins watches my code and automatically does tasks when I make changes. I set it up to push code to GitHub when my commit message contains "@push".

### Setting Up Jenkins

Since Jenkins was already installed I opened `http://localhost:8080` in my browser to set it up.

### Creating the Jenkins Pipeline

I made a file called `Jenkinsfile` in my project:

```groovy

groovy
pipeline {
    agent any

    environment {
        GITHUB_CREDS = credentials('github-token')
    }

    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    def message = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    if (message.contains("@push")) {
                        echo "Found @push in commit message, continuing..."
                    } else {
                        error("No @push found in commit message")
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Push to GitHub') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                        git remote set-url origin https://$GITHUB_TOKEN@github.com/my-username/DSO101-DevSecOps-Project.git
                        git push origin main
                    '''
                }
            }
        }
    }
}

```

### Adding GitHub Credentials to Jenkins

1. Went to Jenkins → Manage Jenkins → Credentials
2. Added a new "Secret text" credential
3. Put my GitHub Personal Access Token as the secret
4. Named it `github-token`

![alt text](<output screenshots/Screenshot from 2025-06-18 00-47-58.png>)

![alt text](<output screenshots/Screenshot from 2025-06-18 00-57-30.png>)

### Creating the Pipeline Job

1. Created new job called `StudentID_bmi_pipeline`
2. Selected "Pipeline" type
3. Connected it to my GitHub repository
4. Pointed it to use my Jenkinsfile

![alt text](<output screenshots/Screenshot from 2025-06-18 01-02-12.png>)

![alt text](<output screenshots/Screenshot from 2025-06-18 01-26-09.png>)

Pipeline runs successfully when commit contains "@push"

## Stage 3: GitHub Actions for Docker

### What GitHub Actions Does

Every time I push code to GitHub, it automatically builds Docker images of my application and uploads them to Docker Hub (a place to store Docker images).

### Setting Up Docker Hub Secrets

In my GitHub repository settings, I added these secrets:

- `DOCKERHUB_USERNAME` - my Docker Hub username
- `DOCKERHUB_TOKEN` - my Docker Hub access token

![alt text](<output screenshots/Screenshot from 2025-06-18 00-48-26.png>)

### GitHub Actions Workflow File

I created `.github/workflows/docker-build.yml`:

```yaml

yaml
name: Build and Push Docker Images

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
    - name: Get the code
      uses: actions/checkout@v3

    - name: Login to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Build and push frontend image
      run: |
        docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/bmi-frontend:latest ./frontend
        docker push ${{ secrets.DOCKERHUB_USERNAME }}/bmi-frontend:latest

    - name: Build and push backend image
      run: |
        docker build -t ${{ secrets.DOCKERHUB_USERNAME }}/bmi-backend:latest ./backend
        docker push ${{ secrets.DOCKERHUB_USERNAME }}/bmi-backend:latest

    - name: Run tests
      run: |
        docker run --rm ${{ secrets.DOCKERHUB_USERNAME }}/bmi-backend:latest npm test

```

GitHub Actions successfully builds and pushes Docker images

![alt text](<output screenshots/Screenshot from 2025-06-18 09-43-55.png>)

## Stage 4: Deploying to Render

### Setting Up the Backend Service

1. **Created new Web Service** on Render
2. **Connected to my GitHub repository**
3. **Set environment variables:**
    - `DATABASE_URL` - connection string to my database
    - `PORT` - 5000
    - `NODE_ENV` - production

![alt text](<output screenshots/Screenshot from 2025-06-18 10-07-30.png>)

## Problems I Faced and How I Solved Them

### Problem 1: Jest Tests Failing Due to Async Operations
- What went wrong: My BMI calculator tests were failing because they involved database operations that weren't completing before the test assertions ran.
How I fixed it: I learned to properly use async/await in Jest tests and added proper test database setup/teardown procedures to ensure tests run in isolation.

### Problem 2: Environment Variable Conflicts
- What went wrong: The same environment variable names were being used for different purposes across frontend, backend, and database services, causing configuration conflicts.

### Problem 3: Docker Compose Volume Permissions
- What went wrong: The application couldn't write BMI data to the mounted volumes due to permission issues, especially on Linux systems.

### Problem 4: Test Data Pollution
- What went wrong: Running tests multiple times caused failures because previous test data wasn't being cleaned up, affecting BMI calculation tests.

## How to Use My BMI Calculator
1. **Enter your information:**
    - Height in centimeters (like 175 for 5'9")
    - Weight in kilograms (like 70 for 154 lbs)
    - Age in years
2. **Click "Calculate BMI"** to see your result
3. **Click "Save BMI"** if you want to keep a record
4. **View your history** to see past calculations

### BMI Categories Explained

- **Underweight:** BMI less than 18.5
- **Normal weight:** BMI between 18.5 and 24.9
- **Overweight:** BMI between 25 and 29.9
- **Obese:** BMI 30 or higher

## Final Links

### My Live Application

- **Backend API:** [https://backend-1-1fpx.onrender.com/](https://backend-1-1fpx.onrender.com/)


### Docker Images

- **Frontend Image:** [https://hub.docker.com/repository/docker/rabtens/frontend/general](https://hub.docker.com/repository/docker/rabtens/frontend/general)
- **Backend Image:** [https://hub.docker.com/repository/docker/rabtens/backend/general](https://hub.docker.com/repository/docker/rabtens/backend/general)

### Source Code

- **GitHub Repository:** [https://github.com/Rabtens/DSO_Final_Assignment](https://github.com/Rabtens/DSO_Final_Assignment)

## What I Learned

This project taught me how modern software development really works:

1. **Automation is powerful** - Once set up, everything happens automatically
2. **Testing is crucial** - Automated tests catch problems before users see them
3. **Docker makes deployment easier** - Same code runs the same way everywhere
4. **CI/CD pipelines save time** - No more manual deployments
5. **Cloud platforms are accessible** - I can deploy real applications for free

The hardest part was understanding how all the pieces fit together, but now I can build and deploy applications professionally.

---

## Student Information

- **Name:** [Kuenzang Rabten]
- **Student ID:** [02230289]
- **Course:** DSO101 - DevSecOps
- **Assignment:** Final Project - CI/CD Pipeline
- **Date:** [18/06/2025]