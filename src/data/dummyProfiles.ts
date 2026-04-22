import { TalentProfile } from '../types/profile';

export const dummyProfiles: TalentProfile[] = [
  // Profile 1: Junior Frontend (Kigali)
  {
    firstName: "Jean",
    lastName: "Bosco",
    email: "jean.bosco.kgl@example.com",
    headline: "Junior Frontend Developer",
    bio: "Passionate about building responsive and accessible user interfaces. Fresh graduate eager to learn new web technologies.",
    location: "Kigali Rwanda",
    skills: [
      { name: "HTML/CSS", level: "Intermediate", yearsOfExperience: 2 },
      { name: "JavaScript", level: "Beginner", yearsOfExperience: 1 },
      { name: "React", level: "Beginner", yearsOfExperience: 1 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Kinyarwanda", proficiency: "Native" },
      { name: "French", proficiency: "Conversational" }
    ],
    experience: [
      {
        company: "Tech KGL",
        role: "Frontend Intern",
        startDate: "2023-01-01",
        endDate: "2023-06-01",
        description: "Assisted in building UI components using React and styled-components for an internal dashboard.",
        technologies: ["React", "CSS", "JavaScript"],
        isCurrent: false
      },
      {
        company: "Rwandan Digital Solutions",
        role: "Junior Web Developer",
        startDate: "2023-07-01",
        endDate: "2024-01-01",
        description: "Developing responsive websites for local businesses and NGOs.",
        technologies: ["HTML", "CSS", "Vanilla JS"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        startYear: 2018,
        endYear: 2022
      }
    ],
    projects: [
      {
        name: "Portfolio Site",
        description: "Personal portfolio to showcase projects and learning progress.",
        technologies: ["React", "Tailwind CSS"],
        role: "Sole Developer",
        startDate: "2022-09-01",
        endDate: "2022-10-01"
      },
      {
        name: "E-commerce Landing Page",
        description: "A beautiful landing page mock for a local boutique.",
        technologies: ["HTML", "SASS", "JS"],
        role: "Frontend Lead",
        link: "https://github.com/jb-kgl",
        startDate: "2023-02-01",
        endDate: "2023-03-01"
      }
    ],
    availability: {
      status: "Available",
      type: "Full-time"
    },
    socialLinks: {
      github: "https://github.com/jb-kgl",
      linkedin: "https://linkedin.com/in/jean-bosco-kgl"
    }
  },
  // Profile 2: Senior Mobile (Kigali)
  {
    firstName: "Alice",
    lastName: "Mugisha",
    email: "alice.mobile@example.com",
    headline: "Senior Mobile Engineer | React Native Expert",
    bio: "Mobile app developer with over 6 years of experience building high-performance, cross-platform applications.",
    location: "Kigali Rwanda",
    skills: [
      { name: "React Native", level: "Expert", yearsOfExperience: 6 },
      { name: "Swift", level: "Intermediate", yearsOfExperience: 3 },
      { name: "Kotlin", level: "Advanced", yearsOfExperience: 4 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Swahili", proficiency: "Fluent" }
    ],
    experience: [
      {
        company: "Venture Mobile",
        role: "Mobile App Developer",
        startDate: "2018-05-01",
        endDate: "2021-12-01",
        description: "Developed native Android apps using Kotlin and Java for e-commerce clients.",
        technologies: ["Kotlin", "Firebase", "SQLite"],
        isCurrent: false
      },
      {
        company: "PayKigali",
        role: "Senior React Native Developer",
        startDate: "2022-01-01",
        endDate: "2024-04-18",
        description: "Leading the mobile team in migrating a legacy native app to React Native. Successfully reduced build times by 30%.",
        technologies: ["React Native", "TypeScript", "Redux Saga"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Carnegie Mellon University Africa",
        degree: "Master of Science",
        fieldOfStudy: "Information Technology",
        startYear: 2016,
        endYear: 2018
      }
    ],
    projects: [
      {
        name: "PayKigali Wallet",
        description: "Mobile wallet application with secure biometric authentication.",
        technologies: ["React Native", "Reanimated"],
        role: "Lead Mobile Engineer",
        startDate: "2022-03-01",
        endDate: "2023-01-01"
      },
      {
        name: "Rwanda Rides",
        description: "A ride-sharing application connecting local drivers with tourists.",
        technologies: ["Kotlin", "Google Maps API"],
        role: "Android Developer",
        startDate: "2019-06-01",
        endDate: "2020-05-01"
      }
    ],
    availability: {
      status: "Not Available",
      type: "Full-time"
    }
  },
  // Profile 3: Mid Backend (Lagos)
  {
    firstName: "Chinedu",
    lastName: "Okafor",
    email: "c.okafor@example.com",
    headline: "Backend Engineer (Node.js/Python)",
    bio: "Building robust, scalable server-side applications and microservices. Strong advocate for clean code and test-driven development.",
    location: "Lagos Nigeria",
    skills: [
      { name: "Node.js", level: "Advanced", yearsOfExperience: 4 },
      { name: "Python", level: "Intermediate", yearsOfExperience: 2 },
      { name: "MongoDB", level: "Advanced", yearsOfExperience: 3 }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Yoruba", proficiency: "Native" }
    ],
    experience: [
      {
        company: "Fintech Naija",
        role: "Junior Backend Eng",
        startDate: "2019-08-01",
        endDate: "2021-10-01",
        description: "Maintained legacy PHP code and developed new RESTful endpoints in Express.js.",
        technologies: ["PHP", "Express.js", "MySQL"],
        isCurrent: false
      },
      {
        company: "Lagos Tech Hub",
        role: "Backend Engineer",
        startDate: "2021-11-01",
        endDate: "2024-04-18",
        description: "Designing microservices for a large-scale e-commerce platform.",
        technologies: ["Node.js", "MongoDB", "RabbitMQ", "Docker"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "University of Lagos",
        degree: "BSc",
        fieldOfStudy: "Computer Engineering",
        startYear: 2014,
        endYear: 2018
      }
    ],
    projects: [
      {
        name: "Market API",
        description: "A highly available API serving 10k requests per minute for local marketplaces.",
        technologies: ["Node.js", "Redis", "MongoDB"],
        role: "Backend Dev",
        startDate: "2022-01-01",
        endDate: "2022-08-01"
      },
      {
        name: "Identity Service",
        description: "Authentication and authorization layer using OAuth2 and JWT.",
        technologies: ["Python", "Flask", "PostgreSQL"],
        role: "Developer",
        startDate: "2023-05-01",
        endDate: "2023-10-01"
      }
    ],
    availability: {
      status: "Open to Opportunities",
      type: "Remote"
    }
  },
  // Profile 4: Senior Data Engineer (Lagos)
  {
    firstName: "Oluwaseun",
    lastName: "Adeyemi",
    email: "seun.data@example.com",
    headline: "Senior Data Engineer | Big Data",
    bio: "Specializing in building big data pipelines, data warehousing, and distributed systems to extract actionable business insights.",
    location: "Lagos Nigeria",
    skills: [
      { name: "Apache Spark", level: "Expert", yearsOfExperience: 5 },
      { name: "Python", level: "Expert", yearsOfExperience: 7 },
      { name: "AWS", level: "Advanced", yearsOfExperience: 6 }
    ],
    languages: [
      { name: "English", proficiency: "Native" }
    ],
    experience: [
      {
        company: "Data Naija Solutions",
        role: "Data Analyst",
        startDate: "2015-02-01",
        endDate: "2018-05-01",
        description: "Created dashboards and ETL scripts for internal reporting.",
        technologies: ["SQL", "Tableau", "Python"],
        isCurrent: false
      },
      {
        company: "Pan-African Bank",
        role: "Senior Data Engineer",
        startDate: "2018-06-01",
        endDate: "2024-04-18",
        description: "Architected modern data stack on AWS. Managed pipelines processing TBs of data daily.",
        technologies: ["AWS Redshift", "Airflow", "Spark", "Scala"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Obafemi Awolowo University",
        degree: "BSc",
        fieldOfStudy: "Mathematics",
        startYear: 2010,
        endYear: 2014
      }
    ],
    projects: [
      {
        name: "Fraud Detection Pipeline",
        description: "Real-time stream processing for transaction fraud detection.",
        technologies: ["Kafka", "Spark Streaming", "AWS EMR"],
        role: "Lead Data Engineer",
        startDate: "2020-03-01",
        endDate: "2020-11-01"
      },
      {
        name: "Customer 360",
        description: "Unified data model merging 5 different legacy systems.",
        technologies: ["Airflow", "dbt", "Snowflake"],
        role: "Data Architect",
        startDate: "2021-02-01",
        endDate: "2022-01-01"
      }
    ],
    availability: {
      status: "Not Available",
      type: "Full-time"
    }
  },
  // Profile 5: Mid Fullstack (Nairobi)
  {
    firstName: "Wanjiku",
    lastName: "Ndung'u",
    email: "wanjiku.dev@example.com",
    headline: "Mid-level Fullstack Developer (MERN)",
    bio: "Bridging the gap between beautiful frontend designs and solid backend architecture.",
    location: "Nairobi Kenya",
    skills: [
      { name: "React", level: "Advanced", yearsOfExperience: 3 },
      { name: "Node.js", level: "Intermediate", yearsOfExperience: 3 },
      { name: "PostgreSQL", level: "Intermediate", yearsOfExperience: 2 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Swahili", proficiency: "Native" }
    ],
    experience: [
      {
        company: "Kenya Tech Solutions",
        role: "Junior Web Developer",
        startDate: "2020-01-01",
        endDate: "2022-05-01",
        description: "Built marketing sites and integrated payment gateways like M-PESA.",
        technologies: ["PHP", "JavaScript", "HTML/CSS"],
        isCurrent: false
      },
      {
        company: "AgriTech Nairobi",
        role: "Fullstack Developer",
        startDate: "2022-06-01",
        endDate: "2024-04-18",
        description: "Developing dashboard applications for farmers to track crop yields.",
        technologies: ["React", "Express.js", "PostgreSQL"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "University of Nairobi",
        degree: "BSc",
        fieldOfStudy: "Software Engineering",
        startYear: 2016,
        endYear: 2020
      }
    ],
    projects: [
      {
        name: "M-PESA Integration Wrapper",
        description: "An open-source Node.js wrapper for the Daraja API.",
        technologies: ["Node.js", "Axios"],
        role: "Creator",
        link: "https://github.com/wanjiku/mpesa-node",
        startDate: "2021-08-01",
        endDate: "2021-10-01"
      },
      {
        name: "Agri Dashboard",
        description: "Real-time crop monitoring visualization platform.",
        technologies: ["React", "Chart.js", "Socket.io"],
        role: "Fullstack Eng",
        startDate: "2023-01-01",
        endDate: "2023-06-01"
      }
    ],
    availability: {
      status: "Available",
      type: "Contract"
    }
  },
  // Profile 6: Junior Mobile (Nairobi)
  {
    firstName: "Brian",
    lastName: "Kiprono",
    email: "brian.kip@example.com",
    headline: "Junior Mobile Developer (Flutter)",
    bio: "Enthusiastic mobile developer focused on delivering smooth, animations-rich experiences using Flutter.",
    location: "Nairobi Kenya",
    skills: [
      { name: "Flutter", level: "Intermediate", yearsOfExperience: 2 },
      { name: "Dart", level: "Intermediate", yearsOfExperience: 2 },
      { name: "Firebase", level: "Beginner", yearsOfExperience: 1 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Swahili", proficiency: "Native" }
    ],
    experience: [
      {
        company: "Campus Devs",
        role: "Intern Mobile Dev",
        startDate: "2022-05-01",
        endDate: "2022-12-01",
        description: "Helped build a campus event discovery app.",
        technologies: ["Flutter", "Firebase"],
        isCurrent: false
      },
      {
        company: "Nairobi Startup Garage",
        role: "Junior Mobile Developer",
        startDate: "2023-01-01",
        endDate: "2024-04-18",
        description: "Maintaining multiple prototype apps for early-stage startups.",
        technologies: ["Flutter", "REST APIs"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Strathmore University",
        degree: "Diploma",
        fieldOfStudy: "Business Information Technology",
        startYear: 2020,
        endYear: 2022
      }
    ],
    projects: [
      {
        name: "Campus Events App",
        description: "Event ticketing and scheduling application for university students.",
        technologies: ["Flutter", "Cloud Firestore"],
        role: "Co-Developer",
        startDate: "2022-06-01",
        endDate: "2022-11-01"
      },
      {
        name: "Expense Tracker",
        description: "Personal finance local app built with Flutter and Hive.",
        technologies: ["Flutter", "Hive"],
        role: "Sole Dev",
        startDate: "2023-04-01",
        endDate: "2023-05-01"
      }
    ],
    availability: {
      status: "Open to Opportunities",
      type: "Full-time"
    }
  },
  // Profile 7: Senior DevOps (Accra)
  {
    firstName: "Kwame",
    lastName: "Mensah",
    email: "kwame.ops@example.com",
    headline: "Senior DevOps & Cloud Architect",
    bio: "Automating everything. Expertise in Kubernetes, CI/CD, and Infrastructure as Code.",
    location: "Accra Ghana",
    skills: [
      { name: "Kubernetes", level: "Expert", yearsOfExperience: 5 },
      { name: "Terraform", level: "Expert", yearsOfExperience: 6 },
      { name: "AWS", level: "Advanced", yearsOfExperience: 8 }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Twi", proficiency: "Fluent" }
    ],
    experience: [
      {
        company: "Ghana Telecom",
        role: "Systems Administrator",
        startDate: "2014-03-01",
        endDate: "2018-09-01",
        description: "Managed Linux server farms and automated routine maintenance tasks.",
        technologies: ["Linux", "Bash", "Ansible"],
        isCurrent: false
      },
      {
        company: "CloudAfrica",
        role: "Lead DevOps Engineer",
        startDate: "2018-10-01",
        endDate: "2024-04-18",
        description: "Spearheaded cloud migration and implemented company-wide Kubernetes adoption.",
        technologies: ["EKS", "Terraform", "GitHub Actions", "Prometheus"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Kwame Nkrumah University of Science and Technology",
        degree: "BSc",
        fieldOfStudy: "Telecommunications Eng",
        startYear: 2009,
        endYear: 2013
      }
    ],
    projects: [
      {
        name: "Zero-Downtime Deployment Pipeline",
        description: "A robust CI/CD pipeline achieving 99.99% uptime during releases.",
        technologies: ["GitLab CI", "ArgoCD", "Kubernetes"],
        role: "Architect",
        startDate: "2020-01-01",
        endDate: "2020-08-01"
      },
      {
        name: "Security Auditing Tool",
        description: "Internal script to audit IAM roles and S3 permissions.",
        technologies: ["Python", "Boto3"],
        role: "Developer",
        startDate: "2021-04-01",
        endDate: "2021-05-01"
      }
    ],
    availability: {
      status: "Not Available",
      type: "Full-time"
    }
  },
  // Profile 8: Mid Frontend (Accra)
  {
    firstName: "Ama",
    lastName: "Osei",
    email: "ama.ui@example.com",
    headline: "Frontend Engineer (Vue/React)",
    bio: "Creating pixel-perfect, accessible, and deeply interactive web experiences.",
    location: "Accra Ghana",
    skills: [
      { name: "Vue.js", level: "Advanced", yearsOfExperience: 4 },
      { name: "React", level: "Intermediate", yearsOfExperience: 2 },
      { name: "CSS/SASS", level: "Expert", yearsOfExperience: 5 }
    ],
    languages: [
      { name: "English", proficiency: "Native" }
    ],
    experience: [
      {
        company: "Creative Web Accra",
        role: "UI Developer",
        startDate: "2019-02-01",
        endDate: "2021-06-01",
        description: "Developed marketing microsites using HTML/CSS/JS and GSAP animations.",
        technologies: ["GSAP", "SASS", "HTML"],
        isCurrent: false
      },
      {
        company: "Accra FinTech Provider",
        role: "Frontend Engineer",
        startDate: "2021-07-01",
        endDate: "2024-04-18",
        description: "Building a complex internal CRM dashboard using Vue 3 and Vuex.",
        technologies: ["Vue 3", "Vite", "Tailwind CSS"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Ashesi University",
        degree: "BSc",
        fieldOfStudy: "Computer Science",
        startYear: 2014,
        endYear: 2018
      }
    ],
    projects: [
      {
        name: "FinDash",
        description: "Open-source dashboard UI kit for Fintechs.",
        technologies: ["Vue.js", "Tailwind CSS"],
        role: "Creator",
        startDate: "2022-09-01",
        endDate: "2023-01-01"
      },
      {
        name: "Interactive Annual Report",
        description: "A highly animated WebGL experience for an NGO.",
        technologies: ["Three.js", "Vue.js"],
        role: "Frontend Dev",
        startDate: "2023-08-01",
        endDate: "2023-11-01"
      }
    ],
    availability: {
      status: "Available",
      type: "Contract"
    }
  },
  // Profile 9: Mid Backend (Dakar)
  {
    firstName: "Mamadou",
    lastName: "Diop",
    email: "m.diop@example.com",
    headline: "Backend Developer | Go & PHP",
    bio: "Strong backend fundamentalist focusing on high concurrency APIs.",
    location: "Dakar Senegal",
    skills: [
      { name: "Go", level: "Advanced", yearsOfExperience: 3 },
      { name: "PHP", level: "Expert", yearsOfExperience: 6 },
      { name: "PostgreSQL", level: "Advanced", yearsOfExperience: 4 }
    ],
    languages: [
      { name: "French", proficiency: "Native" },
      { name: "Wolof", proficiency: "Native" },
      { name: "English", proficiency: "Conversational" }
    ],
    experience: [
      {
        company: "Senegal Web Agency",
        role: "Web Developer",
        startDate: "2017-06-01",
        endDate: "2020-03-01",
        description: "Developed customized WordPress plugins and Laravel applications.",
        technologies: ["Laravel", "PHP", "MySQL"],
        isCurrent: false
      },
      {
        company: "West Africa Pay",
        role: "Backend Developer",
        startDate: "2020-04-01",
        endDate: "2024-04-18",
        description: "Migrated core payment processing services from Laravel to Go for better performance.",
        technologies: ["Go", "gRPC", "PostgreSQL"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Université Cheikh Anta Diop",
        degree: "Licence",
        fieldOfStudy: "Informatique",
        startYear: 2013,
        endYear: 2016
      }
    ],
    projects: [
      {
        name: "Payment Gateway Core",
        description: "High performance ISO-8583 message parser in Go.",
        technologies: ["Go"],
        role: "Core Contributor",
        startDate: "2021-02-01",
        endDate: "2021-08-01"
      },
      {
        name: "E-Commerce CMS",
        description: "Headless e-commerce backend built with Laravel.",
        technologies: ["Laravel", "Redis"],
        role: "Solo Dev",
        startDate: "2019-01-01",
        endDate: "2019-12-01"
      }
    ],
    availability: {
      status: "Open to Opportunities",
      type: "Full-time"
    }
  },
  // Profile 10: Senior Fullstack (Dakar)
  {
    firstName: "Fatou",
    lastName: "Sow",
    email: "fatou.sow@example.com",
    headline: "Senior Fullstack Engineer",
    bio: "Building robust end-to-end architectures. Passionate about empowering women in tech.",
    location: "Dakar Senegal",
    skills: [
      { name: "TypeScript", level: "Expert", yearsOfExperience: 5 },
      { name: "React", level: "Advanced", yearsOfExperience: 5 },
      { name: "Node.js", level: "Advanced", yearsOfExperience: 4 }
    ],
    languages: [
      { name: "French", proficiency: "Native" },
      { name: "English", proficiency: "Fluent" }
    ],
    experience: [
      {
        company: "Dakar Tech Labs",
        role: "Fullstack Dev",
        startDate: "2016-09-01",
        endDate: "2020-12-01",
        description: "Delivering custom SaaS platforms for local logistics companies.",
        technologies: ["Angular", "Node.js", "MongoDB"],
        isCurrent: false
      },
      {
        company: "Global Remote Corp",
        role: "Senior Software Engineer",
        startDate: "2021-01-01",
        endDate: "2024-04-18",
        description: "Leading a squad to build a global payroll management platform.",
        technologies: ["Next.js", "NestJS", "TypeScript"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Ecole Supérieure Polytechnique de Dakar",
        degree: "Diplôme d'Ingénieur",
        fieldOfStudy: "Génie Informatique",
        startYear: 2011,
        endYear: 2016
      }
    ],
    projects: [
      {
        name: "Payroll Simulator",
        description: "Complex spreadsheet-like interface for calculating multi-country payroll.",
        technologies: ["React", "Redux", "Web Workers"],
        role: "Tech Lead",
        startDate: "2022-05-01",
        endDate: "2023-01-01"
      },
      {
        name: "Logistics Router",
        description: "Delivery route optimization tool.",
        technologies: ["Node.js", "Google Maps API"],
        role: "Fullstack Eng",
        startDate: "2018-02-01",
        endDate: "2018-09-01"
      }
    ],
    availability: {
      status: "Available",
      type: "Part-time"
    }
  },
  // Profile 11: Mid Data Engineer (Kigali)
  {
    firstName: "Claude",
    lastName: "Habimana",
    email: "claude.data@example.com",
    headline: "Data Engineer",
    bio: "Turning messy data into clean, queryable assets for analytics and ML.",
    location: "Kigali Rwanda",
    skills: [
      { name: "SQL", level: "Advanced", yearsOfExperience: 4 },
      { name: "Python", level: "Intermediate", yearsOfExperience: 3 },
      { name: "dbt", level: "Intermediate", yearsOfExperience: 2 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Kinyarwanda", proficiency: "Native" },
      { name: "French", proficiency: "Basic" }
    ],
    experience: [
      {
        company: "Rwanda Bureau of Statistics",
        role: "Data Analyst",
        startDate: "2019-01-01",
        endDate: "2021-06-01",
        description: "Cleaning survey data and preparing reports.",
        technologies: ["Excel", "Python", "SQL Server"],
        isCurrent: false
      },
      {
        company: "Kigali Telecomm",
        role: "Data Engineer",
        startDate: "2021-07-01",
        endDate: "2024-04-18",
        description: "Building reporting pipelines using modern data stack.",
        technologies: ["Snowflake", "dbt", "Airflow"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "University of Rwanda",
        degree: "BSc",
        fieldOfStudy: "Statistics",
        startYear: 2014,
        endYear: 2018
      }
    ],
    projects: [
      {
        name: "Telecom Churn Prediction Model Data Prep",
        description: "Prepared and engineered features for data scientists.",
        technologies: ["Python", "Pandas", "Snowflake"],
        role: "Data Engineer",
        startDate: "2022-04-01",
        endDate: "2022-08-01"
      },
      {
        name: "Survey Data Pipeline",
        description: "Automated ingestion of field survey data from mobile devices.",
        technologies: ["Python", "AWS S3", "PostgreSQL"],
        role: "Data Analyst",
        startDate: "2020-05-01",
        endDate: "2020-11-01"
      }
    ],
    availability: {
      status: "Not Available",
      type: "Full-time"
    }
  },
  // Profile 12: Junior Fullstack (Lagos)
  {
    firstName: "Ifunanya",
    lastName: "Eze",
    email: "ify.codes@example.com",
    headline: "Junior Fullstack Developer (PERN stack)",
    bio: "Recent bootcamp grad specializing in Postgres, Express, React, and Node.",
    location: "Lagos Nigeria",
    skills: [
      { name: "JavaScript", level: "Intermediate", yearsOfExperience: 1 },
      { name: "React", level: "Beginner", yearsOfExperience: 1 },
      { name: "Node.js", level: "Beginner", yearsOfExperience: 1 }
    ],
    languages: [
      { name: "English", proficiency: "Native" },
      { name: "Igbo", proficiency: "Fluent" }
    ],
    experience: [
      {
        company: "Tech4Africa Bootcamp",
        role: "Trainee Developer",
        startDate: "2023-01-01",
        endDate: "2023-06-01",
        description: "Intensive 6-month software engineering bootcamp.",
        technologies: ["React", "Express", "PostgreSQL"],
        isCurrent: false
      },
      {
        company: "Lagos Digital Agency",
        role: "Junior Web Developer",
        startDate: "2023-08-01",
        endDate: "2024-04-18",
        description: "Implementing landing pages and small backend services for local clients.",
        technologies: ["HTML/CSS", "JavaScript", "Express"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "University of Nigeria, Nsukka",
        degree: "BA",
        fieldOfStudy: "English Literature",
        startYear: 2018,
        endYear: 2022
      }
    ],
    projects: [
      {
        name: "E-Commerce Clone",
        description: "Fullstack clone of a popular e-commerce site with functional cart and checkout.",
        technologies: ["React", "Node.js", "Stripe API"],
        role: "Fullstack Dev",
        startDate: "2023-04-01",
        endDate: "2023-05-01"
      },
      {
        name: "Movie Library App",
        description: "Frontend app interacting with TMDB API.",
        technologies: ["React", "Tailwind CSS"],
        role: "Frontend Dev",
        startDate: "2023-02-01",
        endDate: "2023-03-01"
      }
    ],
    availability: {
      status: "Open to Opportunities",
      type: "Part-time"
    }
  },
  // Profile 13: Senior Backend (Nairobi)
  {
    firstName: "David",
    lastName: "Ouma",
    email: "david.backend@example.com",
    headline: "Senior Backend Architect | Java & Spring Boot",
    bio: "Enterprise software architect specializing in highly available banking systems.",
    location: "Nairobi Kenya",
    skills: [
      { name: "Java", level: "Expert", yearsOfExperience: 10 },
      { name: "Spring Boot", level: "Expert", yearsOfExperience: 7 },
      { name: "Microservices", level: "Advanced", yearsOfExperience: 5 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" },
      { name: "Swahili", proficiency: "Native" }
    ],
    experience: [
      {
        company: "Kenya National Bank",
        role: "Software Developer",
        startDate: "2012-05-01",
        endDate: "2018-08-01",
        description: "Maintained and extended core banking applications.",
        technologies: ["Java", "Oracle DB", "SOAP"],
        isCurrent: false
      },
      {
        company: "Pan-African FinTech",
        role: "Backend Architect",
        startDate: "2018-09-01",
        endDate: "2024-04-18",
        description: "Designing the transition from monolith to microservices.",
        technologies: ["Spring Boot", "Kafka", "Kubernetes"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Jomo Kenyatta University",
        degree: "BSc",
        fieldOfStudy: "Computer Technology",
        startYear: 2008,
        endYear: 2012
      }
    ],
    projects: [
      {
        name: "Microservices Migration",
        description: "Breaking down the 5M line monolithic application to 30 distributed services.",
        technologies: ["Java", "Spring Cloud", "Docker"],
        role: "Lead Architect",
        startDate: "2019-01-01",
        endDate: "2021-12-01"
      },
      {
        name: "Real-time Notification Service",
        description: "Handling millions of SMS and emails matching transaction alerts.",
        technologies: ["Kafka", "Spring Boot", "Redis"],
        role: "Lead Dev",
        startDate: "2022-03-01",
        endDate: "2022-10-01"
      }
    ],
    availability: {
      status: "Not Available",
      type: "Full-time"
    }
  },
  // Profile 14: Mid Mobile (Accra)
  {
    firstName: "Emmanuel",
    lastName: "Appiah",
    email: "e.appiah@example.com",
    headline: "Mobile Engineer (iOS/Swift)",
    bio: "Crafting beautiful iOS applications. Obsessed with UI animations and clean architecture.",
    location: "Accra Ghana",
    skills: [
      { name: "Swift", level: "Advanced", yearsOfExperience: 4 },
      { name: "SwiftUI", level: "Intermediate", yearsOfExperience: 2 },
      { name: "CoreData", level: "Advanced", yearsOfExperience: 3 }
    ],
    languages: [
      { name: "English", proficiency: "Fluent" }
    ],
    experience: [
      {
        company: "Accra App Studios",
        role: "Junior iOS Dev",
        startDate: "2019-10-01",
        endDate: "2021-12-01",
        description: "Collaborated on several agency projects, mostly consumer-facing apps.",
        technologies: ["Swift", "UIKit", "REST"],
        isCurrent: false
      },
      {
        company: "Ghana Startups Hub",
        role: "Mobile Engineer",
        startDate: "2022-01-01",
        endDate: "2024-04-18",
        description: "Lead iOS developer for local on-demand delivery apps.",
        technologies: ["SwiftUI", "Combine", "Google Maps SDK"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "University of Ghana",
        degree: "BSc",
        fieldOfStudy: "Information Technology",
        startYear: 2015,
        endYear: 2019
      }
    ],
    projects: [
      {
        name: "Q-Delivery iOS",
        description: "Fast on-demand delivery app used by 50k+ users.",
        technologies: ["Swift", "CoreLocation", "Sockets"],
        role: "Lead iOS Dev",
        startDate: "2022-02-01",
        endDate: "2022-09-01"
      },
      {
        name: "Fitness Tracker App",
        description: "Apple HealthKit integrated workout tracker.",
        technologies: ["SwiftUI", "HealthKit"],
        role: "Sole Dev",
        startDate: "2021-06-01",
        endDate: "2021-11-01"
      }
    ],
    availability: {
      status: "Available",
      type: "Contract"
    }
  },
  // Profile 15: Junior DevOps (Dakar)
  {
    firstName: "Omar",
    lastName: "Fall",
    email: "omar.devops@example.com",
    headline: "Junior Cloud / DevOps Engineer",
    bio: "Fascinated by cloud architecture and CI/CD. Gaining hands-on experience with AWS and Docker.",
    location: "Dakar Senegal",
    skills: [
      { name: "Linux", level: "Intermediate", yearsOfExperience: 2 },
      { name: "Docker", level: "Beginner", yearsOfExperience: 1 },
      { name: "AWS", level: "Beginner", yearsOfExperience: 1 }
    ],
    languages: [
      { name: "French", proficiency: "Native" },
      { name: "Wolof", proficiency: "Native" },
      { name: "English", proficiency: "Conversational" }
    ],
    experience: [
      {
        company: "Dakar Hosting",
        role: "IT Support Intern",
        startDate: "2022-06-01",
        endDate: "2022-12-01",
        description: "Troubleshooting cPanel and simple Linux server issues for clients.",
        technologies: ["Linux", "cPanel", "Bash"],
        isCurrent: false
      },
      {
        company: "Senegal E-commerce",
        role: "Junior Systems Administrator",
        startDate: "2023-01-01",
        endDate: "2024-04-18",
        description: "Assisting in transitioning applications into Docker containers.",
        technologies: ["Docker", "Nginx", "GitHub Actions"],
        isCurrent: true
      }
    ],
    education: [
      {
        institution: "Institut Supérieur de Management (ISM)",
        degree: "Licence",
        fieldOfStudy: "Réseaux et Systèmes",
        startYear: 2019,
        endYear: 2022
      }
    ],
    projects: [
      {
        name: "Automated Backup Script",
        description: "Bash script to backup MySQL databases to AWS S3 daily via cron.",
        technologies: ["Bash", "AWS CLI"],
        role: "Developer",
        startDate: "2023-03-01",
        endDate: "2023-04-01"
      },
      {
        name: "Dockerized Ghost Blog",
        description: "Setting up a Ghost blog with Docker Compose and Nginx reverse proxy.",
        technologies: ["Docker", "Docker Compose", "Nginx"],
        role: "DevOps",
        startDate: "2023-08-01",
        endDate: "2023-09-01"
      }
    ],
    availability: {
      status: "Available",
      type: "Full-time"
    }
  }
];
