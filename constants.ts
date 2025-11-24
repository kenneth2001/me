import { Job, Education, SkillCategory } from './types';

export const PERSONAL_INFO = {
  name: "Kenneth Wan",
  fullName: "Yee Ki Wan (Kenneth)",
  role: "Data Scientist & AI Engineer",
  headline: "Turning data into meaningful insights through AI, LLMs, and optimization.",
  location: "Hong Kong",
  email: "yeekiiiiii@protonmail.com",
  linkedin: "https://www.linkedin.com/in/yee-ki-wan/",
  github: "https://github.com/kenneth2001",
};

export const EXPERIENCES: Job[] = [
  {
    title: "Associate Data Scientist",
    company: "OOCL",
    period: "September 2024 - Current",
    projects: [
      {
        title: "LLM-Based Workflow Automation",
        description: [
          "Developed and deployed a Large Language Model (LLM) solution to parse unstructured data from emails, images, and tables.",
          "Incorporated preprocessing pipelines to extract key information, automate database queries, and categorize content.",
          "Implemented an embedding-based Retrieval-Augmented Generation (RAG) pipeline with Maximum Marginal Relevance (MMR) to enhance LLM accuracy.",
          "Leveraged LangChain for scalable LLM application development and LangFuse for performance monitoring."
        ]
      },
      {
        title: "Copilot for Business Strategy and Knowledge Management",
        description: [
          "Built a LangGraph-based LLM pipeline to extract and organize domain-specific knowledge from presentation slides.",
          "Utilized GraphRAG to structure extracted knowledge, enhancing LLM outputs with relevant, context-specific information.",
          "Designed a standalone knowledge base system with a Streamlit-based UI supported by PostgreSQL and Pgvector.",
          "Implemented an MCP server for querying relevant data efficiently."
        ]
      },
      {
        title: "Operational Optimization",
        description: [
          "Developed linear programming models to optimize operational planning processes, improving efficiency.",
          "Maintained automated data preprocessing pipelines to clean and prepare historical data for analytical tasks.",
          "Applied stochastic optimization techniques to address uncertainty in operational data, incorporating hard and soft constraints."
        ]
      }
    ]
  },
  {
    title: "Research Intern (AI Music)",
    company: "Huawei",
    period: "Feb 2023 - July 2023",
    description: [
      "Conducted in-depth research on music generation and music-related classification tasks.",
      "Developed deep learning models for music classification using Stochastic Weight Averaging, mix-up, and gradient clipping, surpassing state-of-the-art benchmarks.",
      "Contributed to the development of content generation algorithms."
    ]
  },
  {
    title: "QA Engineer Intern",
    company: "Viu",
    period: "Jun 2021 - Sep 2021",
    highlight: "Job duty was mainly focused on Data Engineering",
    description: [
      "Conduct quality assurance (QA) on mobile applications / web pages to ensure data accuracy",
      "Track and process data using various tools such as DBT, Databricks, DBeaver, and Spark",
      "Query data from Redshift and S3 to extract insights and create reports",
      "Build interactive Tableau dashboards to visualize and analyze data",
      "Use Atlassian tools (Jira, Confluence, and BitBucket) for project management / collaboration"
    ]
  }
];

export const EDUCATIONS: Education[] = [
  {
    school: "Imperial College London",
    degree: "MSc in Computing (AI and Machine Learning)",
    period: "Sep 2023 - Sep 2024",
    honors: ["Graduated with Distinction"],
    details: [
      "MSc Project: Data mining medical records of cannabis therapy in the UK"
    ]
  },
  {
    school: "The Chinese University of Hong Kong (CUHK)",
    degree: "BSc in Computer Science",
    period: "Aug 2019 - July 2023",
    honors: [
      "First Class Honours",
      "Dean’s List (2021-2022, 2022-2023)"
    ],
    details: [
      "Minor in Data Analytics and Informatics",
      "Stream: Database and Information Systems",
      "Final Year Project: Music Chord Detection"
    ]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    category: "Multi-Agent Systems & LLMs",
    skills: ["LangGraph", "LangChain"]
  },
  {
    category: "Deep Learning & Machine Learning",
    skills: ["PyTorch", "scikit-learn", "Librosa"]
  },
  {
    category: "Data Analytics & Processing",
    skills: ["Pandas", "NumPy", "BeautifulSoup"]
  },
  {
    category: "Big Data & Databases",
    skills: ["Apache Spark (PySpark & Scala)", "PostgreSQL (pgvector)", "MongoDB", "MySQL", "SQL", "DBeaver"]
  },
  {
    category: "BI & Data Visualization",
    skills: ["Tableau", "Vividime"]
  },
  {
    category: "Visualization Libraries",
    skills: ["Matplotlib", "Seaborn"]
  },
  {
    category: "Programming Languages",
    skills: ["Python", "Scala", "JavaScript", "C", "Prolog"]
  },
  {
    category: "Web Development",
    skills: ["React.js", "Node.js", "Express.js", "Mongoose", "Bootstrap"]
  },
  {
    category: "Spoken Languages",
    skills: ["English (Fluent)", "Cantonese (Native)"]
  }
];