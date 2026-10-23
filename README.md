# AI Career Companion — Internship Matching & RAG Search Agent

An AI-powered career assistance system that helps students discover relevant internships by analyzing candidate profiles, retrieving relevant internship information, and calculating transparent job–resume compatibility scores.

Milestone 2 extends the existing candidate resume intelligence system with an internship knowledge base, section-based retrieval, semantic search, and a multi-factor internship matching agent.

## 📌 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation and Setup](#-installation-and-setup)
- [Run the Project](#-run-the-project)
- [API Documentation](#-api-documentation)
- [Testing and Evaluation](#-testing-and-evaluation)
- [Dataset Information](#-dataset-information)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Project Overview

Finding suitable internships can be difficult when students have different skills, qualifications, interests, and career goals.

AI Career Companion addresses this challenge by connecting candidate profiles with a structured internship knowledge base.

The system retrieves relevant internship descriptions, compares them with candidate information, and generates matching scores with explanations to help students understand why an internship may be suitable for them.

### Project Objectives

- Build a structured and searchable internship dataset.
- Organize internship information into meaningful sections.
- Retrieve relevant internship content using vector-based similarity search.
- Match candidate profiles with internship requirements.
- Provide understandable compatibility scores and matching explanations.
- Expose matching and search functionality through REST APIs.

## ✨ Key Features

### 1. Internship Knowledge Base

- Generates and cleans a dataset of 178 synthetic internship postings.
- Organizes postings across 10 career domains.
- Stores internship information in JSON and CSV formats.
- Maintains vector-index metadata for retrieval.

### 2. Section-Based Retrieval

- Splits internship descriptions into meaningful sections or chunks.
- Creates vector representations using the implemented embedding approach.
- Retrieves relevant sections using a k-nearest-neighbor (k-NN) search mechanism.
- Supports natural-language internship search queries.

### 3. Multi-Factor Matching Agent

- Compares candidate information with internship requirements.
- Calculates compatibility scores using multiple matching factors.
- Provides reasoning to explain why a candidate matches an opportunity.
- Helps candidates explore internships relevant to their skills and interests.

### 4. REST API Integration

- Uses FastAPI to expose internship search and matching functionality.
- Provides interactive API documentation.
- Integrates the matching backend with the existing React frontend.

### 5. Automated Evaluation

- Includes semantic-search sanity checks.
- Tests the matching agent end to end.
- Evaluates matching behavior across five different candidate profiles.

## 🔄 How It Works

The application follows this general workflow:

```text
Candidate Resume / Profile
          |
          v
Candidate Information
          |
          v
Internship Knowledge Base
          |
          v
Section Chunking & Vectorization
          |
          v
Relevant Internship Retrieval
          |
          v
Multi-Factor Matching Agent
          |
          v
Compatibility Scores & Explanations
          |
          v
FastAPI Backend
          |
          v
React Frontend
          |
          v
Internship Matches Dashboard
```

### Retrieval-Augmented Generation (RAG)

RAG combines information retrieval with a process that uses retrieved information to support a response.

In this project, internship descriptions are divided into sections and represented as vectors. When a candidate or user submits a search query, the retrieval engine finds relevant sections from the internship knowledge base.

The matching agent then uses relevant internship information and candidate data to calculate compatibility and explain the match.

**Technical note:** The described implementation uses vector retrieval and a matching/reasoning engine. Do not assume it generates answers using a large language model unless an LLM is explicitly integrated into the code.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend services and matching logic |
| FastAPI | REST API development |
| Uvicorn | Backend development server |
| NumPy | Numerical operations and vector processing |
| scikit-learn | Machine-learning utilities and similarity/search operations, as implemented |
| JSON | Internship dataset and vector-index metadata |
| CSV | Tabular dataset export |
| React | Frontend user interface |
| TypeScript | Frontend type safety, if enabled in the existing application |
| npm | Frontend dependency management |
| Git & GitHub | Version control and collaboration |

## 📁 Project Structure

```text
AI-Career-Companion/
│
├── backend/
│   ├── app/
│   │   ├── data/
│   │   │   └── internships/
│   │   │       ├── postings.json
│   │   │       ├── postings.csv
│   │   │       └── vector_index.json
│   │   │
│   │   ├── services/
│   │   │   ├── internship_dataset.py
│   │   │   ├── rag_engine.py
│   │   │   └── matching_agent.py
│   │   │
│   │   ├── routers/
│   │   │   └── matching.py
│   │   │
│   │   ├── models/
│   │   │   └── candidate.py
│   │   │
│   │   └── main.py
│   │
│   ├── test_rag_search.py
│   ├── test_matching_agent.py
│   ├── test_evaluation_matrix.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

**Note:** This is based on the provided Milestone 2 layout. Some frontend files and configuration files are abbreviated for readability. Keep the actual structure of your repository.

### Main Backend Modules

| File | Responsibility |
|---|---|
| `internship_dataset.py` | Generates and cleans internship postings |
| `rag_engine.py` | Chunks internship sections, creates vector representations, and retrieves relevant content |
| `matching_agent.py` | Calculates matching scores and generates matching explanations |
| `matching.py` | Defines API routes for search and candidate–internship matching |
| `candidate.py` | Defines candidate profile schemas |
| `main.py` | Initializes the FastAPI application and registers routers |

## 📋 Prerequisites

Install the following before starting:

- Python 3.10 or another version supported by your project dependencies.
- Node.js and npm.
- Git.
- Visual Studio Code or another code editor.

Check your installations:

```bash
python --version
node --version
npm --version
git --version
```

## ⚙️ Installation and Setup

Run the following commands from your project root directory.

### Step 1: Set Up the Backend

Navigate to the backend folder:

```powershell
cd backend
```

If the existing virtual environment is available, activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

If you do not have a virtual environment, create one:

```powershell
python -m venv venv
```

Then activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, you can run the project's Python executable directly instead.

### Step 2: Install Backend Dependencies

If `requirements.txt` exists and includes the required packages:

```powershell
python -m pip install -r requirements.txt
```

Otherwise, install the core packages used by the provided commands:

```powershell
python -m pip install fastapi uvicorn scikit-learn numpy
```

Use the dependency versions specified by the project where available.

### Step 3: Install Frontend Dependencies

Open a second terminal at the project root:

```powershell
cd frontend
npm install
```

## 🚀 Run the Project

Run each phase from the `backend` directory unless otherwise stated.

### Phase 1: Generate the Internship Dataset

```powershell
python -m app.services.internship_dataset
```

This runs the dataset generation and cleaning module.

Expected outputs include the internship dataset files under:

```text
backend/app/data/internships/
```

### Phase 2: Build the Vector Index

```powershell
python -m app.services.rag_engine
```

This runs the retrieval-engine module to build or regenerate the section-based vector index.

The generated data should be stored in the location configured by the implementation.

### Phase 3: Test Semantic Search

```powershell
python test_rag_search.py
```

This checks whether natural-language queries retrieve relevant internship sections.

### Phase 4: Test the Matching Agent

```powershell
python test_matching_agent.py
```

This runs the end-to-end candidate–internship matching test and displays the matching results produced by the implementation.

### Phase 5: Evaluate Five Candidate Profiles

```powershell
python test_evaluation_matrix.py
```

The evaluation covers these example candidate categories:

1. Frontend Developer
2. Data Analyst
3. Marketing
4. Finance
5. Generalist

Use the test results to assess whether the matching engine produces relevant and understandable results for different candidate backgrounds.

### Phase 6: Start the Backend API

From the `backend` directory:

```powershell
uvicorn app.main:app --reload --port 8000
```

The backend should be accessible at:

- **API base URL:** http://localhost:8000
- **Interactive API documentation:** http://localhost:8000/docs
- **Alternative API documentation:** http://localhost:8000/redoc

The available endpoints depend on the routes registered in the application.

### Phase 7: Start the Frontend

Open another terminal and navigate to the frontend directory:

```powershell
cd frontend
npm run dev
```

Open the local URL displayed by Vite in the terminal.

Navigate to **Internship Matches** in the dashboard to explore the matching and search features, provided that the frontend route is implemented and the backend is running.

## 🧪 Testing and Evaluation

Run the following commands from the `backend` directory:

```powershell
python test_rag_search.py
python test_matching_agent.py
python test_evaluation_matrix.py
```

These scripts cover three testing areas:

| Test | What it checks |
|---|---|
| `test_rag_search.py` | Retrieval of relevant internship sections |
| `test_matching_agent.py` | End-to-end candidate and internship matching |
| `test_evaluation_matrix.py` | Matching behavior across five candidate categories |

For meaningful evaluation, inspect the retrieved internships, relevance of the results, matching scores, and explanations. Do not treat the existence of a successful test run as proof of production-level accuracy.

## 📊 Dataset Information

The Milestone 2 dataset is described as containing:

| Attribute | Description |
|---|---|
| Dataset size | 178 synthetic internship postings |
| Domain coverage | 10 career domains |
| JSON dataset | `postings.json` |
| CSV dataset | `postings.csv` |
| Vector metadata | `vector_index.json` |

The dataset is synthetic and should be clearly distinguished from verified, currently open internship vacancies. Real internship availability, company details, deadlines, and application links require independent verification before being presented to users as factual opportunities.

## 🔍 Troubleshooting

### ModuleNotFoundError

Ensure you are running commands from the `backend` directory and using the correct Python environment.

```powershell
python -c "import fastapi, numpy, sklearn; print('Dependencies OK')"
```

### Internship Data Files Are Missing

Run the dataset generation module first:

```powershell
python -m app.services.internship_dataset
```

Then rebuild the vector index:

```powershell
python -m app.services.rag_engine
```

### Backend API Does Not Start

Verify that FastAPI and Uvicorn are installed:

```powershell
python -m pip install fastapi uvicorn
```

Start the server from the backend directory:

```powershell
uvicorn app.main:app --reload --port 8000
```

### Frontend Cannot Reach the Backend

- Confirm the backend is running on port `8000`.
- Check the API base URL configured in the frontend.
- Verify the backend CORS configuration if the frontend uses a different origin.
- Check browser developer tools and the backend terminal for errors.

### PowerShell Cannot Activate the Virtual Environment

You can bypass activation by running:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Use the same executable for Python modules and test scripts if you choose this approach.

## 🔮 Future Enhancements

Potential improvements include:

- Integration with verified internship sources and current job listings.
- More robust semantic embeddings and vector databases.
- Better evaluation using labeled relevance data and ranking metrics.
- Personalized skill-gap recommendations.
- Resume improvement and interview preparation assistance.
- Saved internships, application tracking, and notification support.
- Authentication, privacy controls, and secure candidate-profile management.

These are possible future directions, not claims about existing functionality.

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository or create a feature branch.
2. Implement your changes using the existing project structure.
3. Run the relevant tests.
4. Check that the backend and frontend work together.
5. Submit a pull request describing your changes.

Use descriptive commit messages and never commit API keys, passwords, private candidate data, or other secrets.

## 📄 License

Add a `LICENSE` file to the repository after choosing the license you want to use. Until then, the project's license is unspecified.

## 👩‍💻 Author

Yalluru Rani

- GitHub: https://github.com/Rani-reddy143
- LinkedIn: https://www.linkedin.com/in/yalluru-rani-reddy-8a9468323

---

**AI Career Companion**

*Making internship discovery more relevant, transparent, and personalized through retrieval and candidate–job matching.*
