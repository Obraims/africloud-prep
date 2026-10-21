export interface Domain {
  id: string;
  name: string;
  weight: string;
  readiness: number;
  mastered: number;
  total: number;
}

export const readinessScore = 68;

export const domains: Domain[] = [
  { id: 'concepts', name: 'Cloud Concepts', weight: '25-30%', readiness: 82, mastered: 14, total: 16 },
  { id: 'architecture', name: 'Azure Architecture & Services', weight: '35-40%', readiness: 61, mastered: 19, total: 31 },
  { id: 'governance', name: 'Azure Management & Governance', weight: '30-35%', readiness: 54, mastered: 11, total: 20 },
];

export const weeklyActivity = [
  { day: 'Mon', minutes: 22 },
  { day: 'Tue', minutes: 45 },
  { day: 'Wed', minutes: 18 },
  { day: 'Thu', minutes: 60 },
  { day: 'Fri', minutes: 35 },
  { day: 'Sat', minutes: 72 },
  { day: 'Sun', minutes: 28 },
];

export interface QuizQuestion {
  id: string;
  domain: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    domain: 'Cloud Concepts',
    question:
      'Which cloud service model gives you the most control over the operating system and the least control over networking hardware?',
    options: ['SaaS', 'PaaS', 'IaaS', 'On-premises'],
    answerIndex: 2,
    explanation:
      'IaaS (Infrastructure as a Service) provisions VMs where you manage the OS, middleware, and apps, while the provider owns the physical networking and host hardware.',
  },
  {
    id: 'q2',
    domain: 'Azure Architecture & Services',
    question:
      'In Azure, what is the primary purpose of an Availability Zone?',
    options: [
      'To back up data to a different region',
      'To isolate applications within a single region against datacenter failure',
      'To reduce latency for global users',
      'To enforce compliance across subscriptions',
    ],
    answerIndex: 1,
    explanation:
      'An Availability Zone is a physically separate location within a single Azure region with its own power, cooling, and networking — it protects against datacenter-level failure, not region-wide outages.',
  },
  {
    id: 'q3',
    domain: 'Azure Management & Governance',
    question: 'Which Azure service provides a centralized view of cost across subscriptions and resource groups?',
    options: ['Azure Advisor', 'Azure Cost Management + Billing', 'Azure Policy', 'Azure Blueprints'],
    answerIndex: 1,
    explanation:
      'Azure Cost Management + Billing gives you a consolidated view of spend, budgets, and forecasts across subscriptions and resource groups.',
  },
];

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  domain: string;
}

export const flashcards: Flashcard[] = [
  {
    id: 'f1',
    domain: 'Cloud Concepts',
    front: 'What does "CapEx" mean in cloud economics?',
    back: 'Capital Expenditure — upfront spending on physical infrastructure you own, like servers. It is a fixed, one-time cost, unlike OpEx which is ongoing usage-based spending.',
  },
  {
    id: 'f2',
    domain: 'Architecture & Services',
    front: 'Difference between Azure Region and Availability Zone?',
    back: 'A Region is a geographic area with one or more datacenters. An Availability Zone is a distinct datacenter inside that region with independent power, cooling, and networking. Think: Nairobi = region, Westlands vs. Industrial Area = zones.',
  },
  {
    id: 'f3',
    domain: 'Management & Governance',
    front: 'What is Azure Resource Manager (ARM)?',
    back: 'The deployment and management service for Azure. It uses a declarative template (ARM template / Bicep) to create, update, and delete resources consistently across your subscription.',
  },
  {
    id: 'f4',
    domain: 'Cloud Concepts',
    front: 'Define the "shared responsibility" model.',
    back: 'Cloud providers and customers each own parts of security. The provider always handles the physical datacenter, network, and host. You always handle your data and accounts. The OS and app layer depends on the service model (IaaS vs PaaS vs SaaS).',
  },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  lang: 'English' | 'Kiswahili' | 'Sheng';
}

export const chatHistory: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    text: 'Hey, can you explain Availability Zones? I keep confusing them with regions.',
    lang: 'English',
  },
  {
    id: 'm2',
    role: 'ai',
    text: "Sure! Think of it like M-Pesa shops in Nairobi. A region is the whole city — lots of shops everywhere. An Availability Zone is one specific shop building with its own power and staff. If that one shop's power goes off, the other shops across town still work. That's why you deploy across zones — one datacenter can fail without taking down your app.",
    lang: 'English',
  },
  {
    id: 'm3',
    role: 'user',
    text: 'Ah sawa. So how many zones does a region usually have?',
    lang: 'Sheng',
  },
  {
    id: 'm4',
    role: 'ai',
    text: 'Most Azure regions have at least 3 Availability Zones. Not every region supports them though — check the Azure products-by-region page before you design for high availability. And remember: zones protect against datacenter failure, but a whole region going down needs a paired region + geo-replication.',
    lang: 'English',
  },
];

export const studyPlan = [
  { id: 's1', title: 'Storage accounts & redundancy options', minutes: 15, domain: 'Architecture & Services', done: false },
  { id: 's2', title: 'Review RBAC vs Azure Policy', minutes: 20, domain: 'Management & Governance', done: true },
  { id: 's3', title: 'Practice 10 questions on Cloud Concepts', minutes: 12, domain: 'Cloud Concepts', done: false },
];
