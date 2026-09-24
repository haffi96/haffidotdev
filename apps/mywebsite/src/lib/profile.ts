// Resume data shared by every page. Keep in sync with public/resume.pdf.

export const profile = {
  name: "Haffi Mazhar",
  title: "Senior Software Engineer",
  location: "Oxford, UK",
  email: "haffimazhar96@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/haffimazhar",
    github: "https://github.com/haffi96",
    resume: "/resume.pdf"
  },
  summary:
    "Software engineer with 7+ years in backend development and real-time systems. I build FastAPI services and cloud infrastructure, tune Python services for performance, and test reliability at very high scale. Currently building low-latency teleoperation for autonomous vehicles at Oxa, and previously founding engineer on a consumer sports platform."
};

export type Role = {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  highlights: string[];
  stack: string[];
};

export const experience: Role[] = [
  {
    company: "Oxa",
    role: "Senior Software Engineer, Autonomous Vehicles Remote Assist",
    start: "Sep 2024",
    end: "Present",
    location: "Oxford, UK",
    highlights: [
      "Architected and built multi-client video streaming and remote control with WebRTC, enabling fleet-wide teleoperation across regions and AV platforms.",
      "Achieved sub-200ms video latency and under 50ms bidirectional messaging latency using WebRTC (H.264/VP9 over UDP) across fibre, 4G and Starlink.",
      "Deployed a real-time WebSocket service on GCP Cloud Run with FastAPI, Redis and Cloud SQL, scaling to concurrent vehicle/operator sessions with strong connection reliability.",
      "Provisioned GCP Cloud SQL, Redis and Pub/Sub infrastructure with Terraform."
    ],
    stack: ["WebRTC", "FastAPI", "Redis", "GCP", "Terraform"]
  },
  {
    company: "EggMonkey",
    role: "Founding Engineer (part-time venture)",
    start: "2024",
    end: "2026",
    location: "Boston, UK",
    highlights: [
      "Took a consumer sports platform from concept to production, generating £20k total revenue and £1.3k MRR, owning product discovery, architecture and delivery.",
      "Partnered directly with the CEO to turn customer needs into scoped features and a pragmatic roadmap; recruited and managed UI/UX and customer-service hires.",
      "Built the full-stack platform from scratch with Next.js, React, TypeScript, Node.js and PostgreSQL: auth, onboarding, player profiles, fixture booking and matchmaking, subscriptions, football video highlights and an operations admin portal.",
      "Architected the cloud infrastructure, including Stripe payments and subscriptions, Mux video streaming, S3, SES notifications, Vercel hosting and DNS."
    ],
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Mux"]
  },
  {
    company: "Move.ai",
    role: "Backend Python Developer",
    start: "Oct 2023",
    end: "Aug 2024",
    location: "London, UK",
    highlights: [
      "Shipped multi-tenant SaaS services using FastAPI on AWS Lambda, integrating DynamoDB, Stripe and Auth0.",
      "Added Datadog performance dashboards and standardised CI/CD in GitHub Actions for more reliable, visible deploys."
    ],
    stack: ["FastAPI", "AWS Lambda", "DynamoDB", "Stripe", "Datadog"]
  },
  {
    company: "Bink",
    role: "Backend Python Developer",
    start: "Jan 2022",
    end: "Oct 2023",
    location: "Ascot, UK",
    highlights: [
      "Delivered retailer APIs with FastAPI/Django, Postgres, Redis and RabbitMQ for digital loyalty; supported the ASOS launch issuing tens of thousands of vouchers."
    ],
    stack: ["Django", "FastAPI", "Postgres", "RabbitMQ", "Redis"]
  },
  {
    company: "Sky",
    role: "Software Engineer, Performance",
    start: "Nov 2019",
    end: "Dec 2021",
    location: "Leeds, UK",
    highlights: [
      "Optimised Sky Identity to handle spikes of ~10 million concurrent users through scaling, resource tuning and load balancing.",
      "Introduced chaos and failover testing for APIs serving ~15 million concurrent users."
    ],
    stack: ["Load testing", "Chaos testing", "Kubernetes"]
  }
];

export const achievements = [
  { value: "<200ms", label: "Live video latency", detail: "Fleet-wide AV teleoperation over an optimised WebRTC pipeline." },
  { value: "<50ms", label: "Control messaging", detail: "Bidirectional operator-to-vehicle messaging across fibre, 4G and Starlink." },
  { value: "15M", label: "Concurrent users", detail: "Performance and chaos testing for Sky's identity platform." },
  { value: "10,000s", label: "Vouchers issued", detail: "ASOS digital loyalty launch at Bink." }
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "Go", "C++", "TypeScript"] },
  { group: "Real-time systems", items: ["WebRTC", "WebSockets", "gRPC", "FastAPI"] },
  { group: "Reliability & performance", items: ["Latency reduction", "Load testing", "Chaos/failover testing", "Horizontal scaling"] },
  {
    group: "Cloud & infrastructure",
    items: ["GCP", "AWS Lambda", "Kubernetes", "Terraform", "IAM", "PostgreSQL", "DynamoDB", "Redis", "RabbitMQ", "Grafana", "Prometheus"]
  }
];

export const education = [
  { school: "University of Leeds", degree: "MSc Engineering, Technology and Business Management", years: "2018 – 2019" },
  { school: "University of Nottingham", degree: "BEng Mechanical Engineering", years: "2015 – 2018" }
];
