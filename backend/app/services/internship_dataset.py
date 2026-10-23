import json
import csv
import os
import random
from typing import List, Dict, Any

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "internships")
JSON_PATH = os.path.join(OUTPUT_DIR, "postings.json")
CSV_PATH = os.path.join(OUTPUT_DIR, "postings.csv")

# 10 Tech & Business Domains with representative roles
DOMAINS = {
    "Software Engineering": [
        ("Frontend Developer Intern", ["React.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS"], ["Next.js", "Redux Toolkit", "REST APIs", "Git"], "Build responsive UI components and integrate with RESTful APIs."),
        ("Backend Engineer Intern", ["Python", "FastAPI", "REST APIs", "PostgreSQL", "SQL"], ["Docker", "Redis", "AWS S3", "PyTest"], "Design microservices, write clean backend APIs, and optimize database queries."),
        ("Full Stack Developer Intern", ["React.js", "Node.js", "TypeScript", "MongoDB", "Express.js"], ["GraphQL", "Docker", "CI/CD", "Tailwind CSS"], "Develop end-to-end features across web frontends and Node.js microservices."),
        ("Java Software Engineer Intern", ["Java", "Spring Boot", "SQL", "OOP", "Git"], ["Hibernate", "Kafka", "Docker", "JUnit"], "Develop backend services using Spring Boot and maintain enterprise application logic."),
        ("Mobile App Developer Intern (Flutter)", ["Flutter", "Dart", "REST APIs", "State Management", "Git"], ["Firebase", "iOS", "Android", "GraphQL"], "Build cross-platform mobile apps for Android and iOS using Flutter framework.")
    ],
    "Data Science & AI/ML": [
        ("Machine Learning Intern", ["Python", "PyTorch", "Scikit-Learn", "Pandas", "NumPy"], ["NLP", "Transformers", "MLflow", "Docker"], "Train and evaluate ML models for classification, forecasting, and NLP tasks."),
        ("AI / NLP Research Intern", ["Python", "PyTorch", "Transformers", "HuggingFace", "NLP"], ["LangChain", "Vector DBs", "LLMs", "RAG"], "Research, experiment, and implement state-of-the-art NLP and Large Language Models."),
        ("Computer Vision Intern", ["Python", "OpenCV", "PyTorch", "TensorFlow", "Deep Learning"], ["YOLO", "CNN", "CUDA", "Git"], "Develop computer vision pipelines for image segmentation and object detection."),
        ("Generative AI Engineer Intern", ["Python", "LangChain", "OpenAI API", "Vector Databases", "FastAPI"], ["PyTorch", "ChromaDB", "LlamaIndex", "Docker"], "Build RAG pipelines, prompt engineering tools, and LLM-powered applications.")
    ],
    "Data Analytics & BI": [
        ("Data Analyst Intern", ["Python", "SQL", "Pandas", "Excel", "Data Visualization"], ["PowerBI", "Tableau", "NumPy", "Statistics"], "Analyze business metrics, extract trends using SQL/Python, and present reports."),
        ("Business Intelligence Intern", ["SQL", "PowerBI", "Tableau", "Excel", "ETL"], ["Python", "Snowflake", "DAX", "Data Modeling"], "Build interactive dashboards, data models, and automated reporting pipelines."),
        ("Data Engineer Intern", ["Python", "SQL", "PySpark", "PostgreSQL", "Git"], ["AWS Glue", "Airflow", "Kafka", "Docker"], "Construct robust data pipelines, data warehouses, and clean incoming raw data streams.")
    ],
    "Marketing & Growth": [
        ("Digital Marketing Intern", ["SEO", "Content Marketing", "Google Analytics", "Social Media Marketing"], ["Canva", "Google Ads", "Email Marketing", "Copywriting"], "Manage digital campaign performance, write SEO-optimized blogs, and track conversion rates."),
        ("Content Strategy Intern", ["Content Writing", "Copywriting", "SEO", "Social Media", "Proofreading"], ["WordPress", "Canva", "Analytics", "Brand Messaging"], "Draft engaging tech articles, social media collateral, and marketing newsletters."),
        ("Growth Marketing Intern", ["Growth Hacking", "Google Analytics", "A/B Testing", "SEO", "Data Analysis"], ["Mixpanel", "SQL", "Social Media Ads", "Excel"], "Run experiments to optimize candidate conversion, referral programs, and acquisition channels.")
    ],
    "UI/UX & Product Design": [
        ("UI/UX Designer Intern", ["Figma", "User Research", "Wireframing", "Prototyping", "Design Systems"], ["Adobe XD", "User Testing", "HTML/CSS", "Design Tokens"], "Create high-fidelity UI mockups, conduct user testing sessions, and build interactive design components."),
        ("Product Design Intern", ["Figma", "Interaction Design", "User Journeys", "Wireframing"], ["Design Systems", "Usability Testing", "UX Writing", "Illustrator"], "Collaborate with product teams to design seamless mobile and web user experiences.")
    ],
    "Finance & Business Analysis": [
        ("Financial Analyst Intern", ["Financial Modeling", "Excel", "Corporate Finance", "Accounting", "Valuation"], ["Python", "SQL", "Bloomberg", "PowerBI"], "Perform financial analysis, build forecasting models, and prepare pitch decks."),
        ("Business Analyst Intern", ["Business Analysis", "Requirements Gathering", "SQL", "UML", "Agile"], ["Jira", "Excel", "Process Mapping", "PowerBI"], "Translate business requirements into functional specs and user stories for dev teams."),
        ("FinTech Analyst Intern", ["Financial Analysis", "SQL", "Python", "Data Analysis", "Risk Assessment"], ["Financial Modeling", "API Integration", "Excel", "Tableau"], "Analyze transaction trends, assess credit/risk algorithms, and report financial metrics.")
    ],
    "DevOps, Cloud & Security": [
        ("Cloud Infrastructure Intern", ["AWS", "Linux", "Docker", "Bash Scripting", "Networking"], ["Terraform", "Kubernetes", "CI/CD", "Python"], "Deploy and manage cloud services on AWS, configure Linux servers, and write automation scripts."),
        ("DevOps Engineer Intern", ["Docker", "Linux", "CI/CD", "Git", "Python"], ["Kubernetes", "Terraform", "Jenkins", "AWS"], "Automate deployment pipelines, maintain Docker containers, and monitor infrastructure health."),
        ("Cyber Security Intern", ["Cybersecurity", "Network Security", "Linux", "Python", "Ethical Hacking"], ["Wireshark", "Penetration Testing", "OWASP", "SIEM"], "Perform vulnerability assessments, audit network security, and investigate potential security incidents.")
    ],
    "Product Management & Operations": [
        ("Associate Product Manager Intern", ["Product Strategy", "User Research", "Agile", "Wireframing", "Data Analysis"], ["Jira", "Figma", "SQL", "A/B Testing"], "Support product roadmap execution, analyze feature adoption, and write PRDs."),
        ("Operations Analyst Intern", ["Process Optimization", "Excel", "Data Analysis", "Project Management"], ["SQL", "Jira", "Python", "Communication"], "Streamline operational workflows, analyze SLAs, and coordinate cross-functional logistics.")
    ]
}

LOCATIONS = [
    "Bengaluru, Karnataka, India", "Hyderabad, Telangana, India", "Mumbai, Maharashtra, India",
    "Pune, Maharashtra, India", "Gurugram, Haryana, India", "Noida, Uttar Pradesh, India",
    "Chennai, Tamil Nadu, India", "Remote, India", "Remote, Worldwide"
]

WORK_MODES = ["Remote", "Hybrid", "On-site"]

COMPANIES = [
    "TechPulse Innovations", "Infosys Springboard", "Infosys Technologies", "TCS Research",
    "Wipro Digital", "Cognizant AI Labs", "Flipkart Engineering", "Amazon Web Services",
    "Google Cloud India", "Microsoft India R&D", "Swiggy Tech", "Zomato Growth",
    "Razorpay FinTech", "PhonePe", "CRED Engineering", "Postman", "Zoho Corporation",
    "Freshworks", "Dunzo Tech", "PolicyBazaar", "Groww", "Zerodha Tech",
    "Jio Platforms", "Airtel Xlabs", "HCL Tech", "Tech Mahindra", "Persistent Systems"
]

QUALIFICATIONS_LIST = [
    "Pursuing B.Tech / B.E. / M.Tech in Computer Science, IT, or related technical discipline.",
    "Pursuing Bachelor's / Master's degree in Data Science, Statistics, Mathematics, or Economics.",
    "Pursuing B.Com, BBA, MBA, or Bachelor's in Finance / Accounting.",
    "Pursuing Bachelor's / Master's in Design (B.Des / M.Des), HCI, or related creative field.",
    "Pursuing Bachelor's in Marketing, Mass Communication, Journalism, or Business Administration.",
    "Currently enrolled in an undergraduate or postgraduate degree program with strong academic performance."
]

EXPERIENCE_LIST = [
    "0-1 years / Freshers welcome",
    "0-6 months prior internship or project experience",
    "No prior experience required; strong hands-on project portfolio preferred",
    "Prior academic or personal projects demonstrating required technical skills",
    "Freshers or final-year students graduating in 2025/2026"
]

def generate_postings(target_count: int = 175) -> List[Dict[str, Any]]:
    postings = []
    job_counter = 1

    # Flatten domain roles
    role_pool = []
    for domain, roles in DOMAINS.items():
        for role_name, req_skills, pref_skills, desc in roles:
            role_pool.append((domain, role_name, req_skills, pref_skills, desc))

    # Cycle and randomize to reach target_count
    while len(postings) < target_count:
        for domain, role_name, req_skills, pref_skills, desc in role_pool:
            if len(postings) >= target_count:
                break
            
            company = random.choice(COMPANIES)
            location = random.choice(LOCATIONS)
            work_mode = "Remote" if "Remote" in location else random.choice(WORK_MODES)
            exp = random.choice(EXPERIENCE_LIST)
            
            if domain in ["Software Engineering", "Data Science & AI/ML", "DevOps, Cloud & Security"]:
                edu = QUALIFICATIONS_LIST[0]
            elif domain in ["Data Analytics & BI"]:
                edu = random.choice([QUALIFICATIONS_LIST[0], QUALIFICATIONS_LIST[1]])
            elif domain in ["Finance & Business Analysis"]:
                edu = random.choice([QUALIFICATIONS_LIST[2], QUALIFICATIONS_LIST[5]])
            elif domain in ["UI/UX & Product Design"]:
                edu = random.choice([QUALIFICATIONS_LIST[3], QUALIFICATIONS_LIST[5]])
            elif domain in ["Marketing & Growth"]:
                edu = random.choice([QUALIFICATIONS_LIST[4], QUALIFICATIONS_LIST[5]])
            else:
                edu = QUALIFICATIONS_LIST[5]

            responsibilities = [
                f"Collaborate with senior team members at {company} to execute key project deliverables.",
                f"Work on hands-on tasks involving {', '.join(req_skills[:3])} in real-world scenarios.",
                desc,
                "Participate in daily agile standups, code/work reviews, and team sprint planning.",
                "Document technical workflows, user journeys, and project progress reports."
            ]

            full_desc = (
                f"{company} is seeking a motivated {role_name} to join our {domain} team in {location}. "
                f"In this role, you will work closely with industry mentors on real-world projects. {desc} "
                f"Ideal candidates possess strong knowledge of {', '.join(req_skills)} and a passion for learning."
            )

            job_id = f"JOB_{job_counter:03d}"
            job_counter += 1

            posting = {
                "job_id": job_id,
                "job_title": role_name,
                "company": company,
                "location": location,
                "work_mode": work_mode,
                "domain": domain,
                "job_description": full_desc,
                "responsibilities": responsibilities,
                "required_skills": req_skills,
                "preferred_skills": pref_skills,
                "qualifications": [edu],
                "experience_required": exp,
                "education_required": edu
            }

            postings.append(posting)

    return postings

def clean_dataset(postings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Clean the dataset: remove duplicates, incomplete entries, and malformed rows."""
    cleaned = []
    seen_keys = set()

    for p in postings:
        # Check required schema fields
        required_fields = [
            "job_id", "job_title", "company", "location", "job_description",
            "responsibilities", "required_skills", "preferred_skills",
            "qualifications", "experience_required", "education_required"
        ]
        
        if not all(field in p and p[field] for field in required_fields):
            continue  # Skip incomplete record
        
        # Deduplication key: company + job_title + location
        dedup_key = f"{p['company'].strip().lower()}|{p['job_title'].strip().lower()}|{p['location'].strip().lower()}"
        if dedup_key in seen_keys:
            continue
        
        seen_keys.add(dedup_key)
        
        # Clean text whitespace
        p["job_title"] = p["job_title"].strip()
        p["company"] = p["company"].strip()
        p["location"] = p["location"].strip()
        p["job_description"] = p["job_description"].strip()
        
        cleaned.append(p)

    return cleaned

def build_and_save_dataset():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    raw_postings = generate_postings(target_count=180)
    cleaned_postings = clean_dataset(raw_postings)
    
    # Save JSON
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(cleaned_postings, f, indent=2, ensure_ascii=False)
        
    # Save CSV
    fieldnames = [
        "job_id", "job_title", "company", "location", "work_mode", "domain",
        "job_description", "responsibilities", "required_skills", "preferred_skills",
        "qualifications", "experience_required", "education_required"
    ]
    
    with open(CSV_PATH, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for p in cleaned_postings:
            row = p.copy()
            row["responsibilities"] = " | ".join(row["responsibilities"]) if isinstance(row["responsibilities"], list) else row["responsibilities"]
            row["required_skills"] = ", ".join(row["required_skills"]) if isinstance(row["required_skills"], list) else row["required_skills"]
            row["preferred_skills"] = ", ".join(row["preferred_skills"]) if isinstance(row["preferred_skills"], list) else row["preferred_skills"]
            row["qualifications"] = " | ".join(row["qualifications"]) if isinstance(row["qualifications"], list) else row["qualifications"]
            writer.writerow(row)
            
    print(f"[SUCCESS] Successfully generated and saved {len(cleaned_postings)} cleaned internship postings.")
    print(f"   - JSON file: {JSON_PATH}")
    print(f"   - CSV file:  {CSV_PATH}")

if __name__ == "__main__":
    build_and_save_dataset()
