// CloudMwalimu Seed & Mock Data (Plain JavaScript)
export const readinessScore = 68;

export const domains = [
  { id: 'concepts', domain_id: 1, name: 'Cloud Concepts', weight: '25-30%', readiness: 82, mastered: 14, total: 16 },
  { id: 'architecture', domain_id: 2, name: 'Azure Architecture & Services', weight: '35-40%', readiness: 61, mastered: 19, total: 31 },
  { id: 'governance', domain_id: 3, name: 'Azure Management & Governance', weight: '30-35%', readiness: 54, mastered: 11, total: 20 },
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

export const allSeedQuestions = [
  {
    "id": "cc-01",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Define cloud computing",
    "question": "Which statement best describes cloud computing?",
    "options": [
      "Keeping backups on removable drives stored off-site",
      "Running software only on a single employee's laptop",
      "Delivering computing services such as servers, storage, databases and networking over the internet, on demand",
      "Buying and housing physical servers in your own server room"
    ],
    "correct_index": 2,
    "explanation": "Cloud computing delivers IT resources over the internet so you can use them on demand instead of owning and running the hardware yourself.",
    "wrong_explanations": [
      "Off-site backups are a data protection practice, not on-demand computing services.",
      "Local computing is not a shared, on-demand service delivered over a network.",
      null,
      "That describes on-premises infrastructure, where you own and maintain the hardware."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=cloud%20computing",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-02",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Describe the shared responsibility model",
    "question": "A company runs a database on an Azure virtual machine. Who is responsible for applying operating system patches to that VM?",
    "options": [
      "Microsoft, because it owns the datacenter",
      "Responsibility is split equally for every layer",
      "The customer, because the guest operating system on an IaaS virtual machine is customer-managed",
      "Azure Advisor, which patches VMs automatically"
    ],
    "correct_index": 2,
    "explanation": "In IaaS, Microsoft manages the physical infrastructure and host, while the customer manages the guest OS, including patching, plus apps and data.",
    "wrong_explanations": [
      "Microsoft secures the facility and hosts, but the guest OS inside the VM is the customer's responsibility.",
      "The split depends on the service type; for IaaS the OS layer sits with the customer.",
      null,
      "Azure Advisor only gives recommendations; it does not patch operating systems."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=shared%20responsibility%20model",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-03",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Describe the shared responsibility model",
    "question": "Which responsibility stays with the customer regardless of the cloud service type (IaaS, PaaS or SaaS)?",
    "options": [
      "Power and cooling of the servers",
      "Physical security of the datacenter building",
      "Their own data, accounts and identities",
      "Patching the host hypervisor"
    ],
    "correct_index": 2,
    "explanation": "Information and data, accounts and identities, and devices are always the customer's responsibility, even in SaaS.",
    "wrong_explanations": [
      "Facilities such as power and cooling belong to the cloud provider.",
      "Microsoft always manages physical datacenter security.",
      null,
      "The provider maintains the hypervisor and physical hosts."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=shared%20responsibility%20model",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-04",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Define cloud models, including public, private, and hybrid",
    "question": "A SACCO keeps its core member records in its own datacenter but runs its public website and mobile app back end in Azure. Which cloud model is this?",
    "options": [
      "Public cloud only",
      "Hybrid cloud",
      "On-premises only",
      "Private cloud only"
    ],
    "correct_index": 1,
    "explanation": "Hybrid cloud combines on-premises or private infrastructure with public cloud services and lets workloads span both.",
    "wrong_explanations": [
      "Part of the workload stays in the SACCO's own datacenter, so it is not public cloud only.",
      null,
      "Using Azure for the website and back end means the setup is not purely on-premises.",
      "Because Azure services are also used, it is more than a private cloud."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=hybrid%20cloud",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-05",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Define cloud models, including public, private, and hybrid",
    "question": "Which characteristic describes a public cloud?",
    "options": [
      "Resources are owned and operated by a provider and shared among multiple organisations over the internet",
      "Hardware is dedicated to a single organisation inside its own building",
      "It cannot be reached over the internet",
      "The customer must buy and install all servers"
    ],
    "correct_index": 0,
    "explanation": "In a public cloud the provider owns the hardware and delivers services to many customers, who pay only for what they use.",
    "wrong_explanations": [
      null,
      "That describes a private cloud or an on-premises setup.",
      "Public cloud services are delivered over the internet.",
      "Public cloud removes the need to buy hardware upfront."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=public%20cloud",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-06",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Identify appropriate use cases for each cloud model",
    "question": "A government agency must keep every workload on infrastructure it owns and controls exclusively, but wants cloud-style self-service for its teams. Which model fits best?",
    "options": [
      "Serverless",
      "Hybrid cloud",
      "Private cloud",
      "Public cloud"
    ],
    "correct_index": 2,
    "explanation": "A private cloud gives a single organisation dedicated cloud-style resources that it controls, often in its own datacenter.",
    "wrong_explanations": [
      "Serverless is a compute model, not a cloud deployment model.",
      "Hybrid cloud mixes private and public resources, which the agency wants to avoid.",
      null,
      "Public cloud uses provider-owned infrastructure shared with other customers."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=private%20cloud",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-07",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Describe the consumption-based model",
    "question": "In the consumption-based model, how do you pay for cloud services?",
    "options": [
      "A fixed fee per employee",
      "A fixed annual fee whatever the usage",
      "An upfront purchase of all hardware",
      "You pay only for the resources you actually use"
    ],
    "correct_index": 3,
    "explanation": "Consumption-based pricing charges for what you use, so there is no large upfront cost and no payment for capacity you have released.",
    "wrong_explanations": [
      "Consumption pricing is tied to usage, not headcount.",
      "That is a flat-rate model, not consumption-based.",
      "Upfront hardware purchases are capital expenditure, the opposite of consumption pricing.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=consumption-based%20model",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-08",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Compare cloud pricing models",
    "question": "A company stops buying servers and instead pays a monthly bill for the Azure resources it uses. Which type of spending is it moving toward?",
    "options": [
      "Capital expenditure (CapEx)",
      "Depreciation of owned hardware",
      "Operational expenditure (OpEx)",
      "A one-time licence fee"
    ],
    "correct_index": 2,
    "explanation": "Pay-as-you-go cloud usage is operating expense billed over time, whereas buying hardware upfront is capital expenditure.",
    "wrong_explanations": [
      "CapEx is large upfront spending on assets such as servers.",
      "If you no longer own the hardware, there is nothing to depreciate.",
      null,
      "Cloud usage is billed continuously, not as a single fee."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=capital%20expenditure%20operational%20expenditure%20cloud",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-09",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Compare cloud pricing models",
    "question": "Which pricing approach offers a lower rate in exchange for committing to use a resource for one or three years?",
    "options": [
      "Reservations (commitment-based pricing)",
      "Azure Service Health",
      "Pay-as-you-go",
      "The Azure free account"
    ],
    "correct_index": 0,
    "explanation": "Azure Reservations give a discount compared with pay-as-you-go when you commit to a 1-year or 3-year term for predictable workloads.",
    "wrong_explanations": [
      null,
      "Service Health reports on service issues; it is not a pricing model.",
      "Pay-as-you-go has no commitment and is billed at the standard rate.",
      "Free offers give limited free usage, not commitment discounts."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Reservations",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-10",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Describe serverless",
    "question": "Which description best fits serverless computing?",
    "options": [
      "Code runs in response to events, the provider manages the infrastructure, and you pay for execution",
      "You buy dedicated physical servers",
      "Your code can only run when a person starts it manually",
      "You provision, patch and scale your own virtual machines"
    ],
    "correct_index": 0,
    "explanation": "In serverless you focus on code while the platform handles servers and scaling, and billing reflects actual execution.",
    "wrong_explanations": [
      null,
      "Dedicated hardware is the opposite of serverless abstraction.",
      "Serverless code typically runs automatically from triggers or events.",
      "That describes IaaS, where the customer manages the servers."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=serverless%20computing",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-11",
    "domain_id": 1,
    "topic_id": "cloud-computing",
    "objective": "Describe serverless",
    "question": "Which workload is best suited to a serverless approach?",
    "options": [
      "A steady 24/7 workload that needs a custom operating system image",
      "Short, event-triggered tasks with spiky or infrequent demand",
      "A legacy app that needs full control of the server",
      "A database engine tied to specific physical hardware"
    ],
    "correct_index": 1,
    "explanation": "Serverless scales automatically and bills per execution, which suits bursty, event-driven work.",
    "wrong_explanations": [
      "Custom OS control points to a virtual machine, not serverless.",
      null,
      "Full server control is not available in serverless.",
      "Hardware-bound workloads need dedicated or IaaS resources."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=serverless%20Azure%20Functions",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-12",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of high availability and scalability in the cloud",
    "question": "A shop's website gets ten times its normal traffic during a holiday sale, and extra capacity is added automatically. Which cloud benefit is this?",
    "options": [
      "Governance",
      "Reserved pricing",
      "Data sovereignty",
      "Scalability"
    ],
    "correct_index": 3,
    "explanation": "Scalability is the ability to adjust resources up or down to match demand.",
    "wrong_explanations": [
      "Governance concerns rules and compliance, not capacity.",
      "Reservations are a pricing option, not a capacity benefit.",
      "Sovereignty is about where data lives and which laws apply.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=cloud%20scalability",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-13",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of high availability and scalability in the cloud",
    "question": "What is it called when you add more VM instances to share the load?",
    "options": [
      "Scaling up (vertical scaling)",
      "Scaling down",
      "Scaling in",
      "Scaling out (horizontal scaling)"
    ],
    "correct_index": 3,
    "explanation": "Scaling out adds more instances, while scaling up adds CPU or memory to an existing instance.",
    "wrong_explanations": [
      "Scaling up makes one instance bigger rather than adding instances.",
      "Scaling down reduces the size of an existing instance.",
      "Scaling in removes instances when demand drops.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=scale%20out%20scale%20up",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-14",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of high availability and scalability in the cloud",
    "question": "Which design choice most directly improves high availability?",
    "options": [
      "Running everything on one large VM",
      "Adding more tags to resources",
      "Turning off monitoring",
      "Running redundant instances across multiple availability zones"
    ],
    "correct_index": 3,
    "explanation": "Redundant instances in separate zones keep the app running if one location fails.",
    "wrong_explanations": [
      "A single VM is a single point of failure.",
      "Tags help organise and report; they do not add redundancy.",
      "Disabling monitoring reduces visibility and does not improve availability.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=high%20availability%20Azure",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-15",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of reliability and predictability in the cloud",
    "question": "A cloud app keeps running and recovers quickly after a component fails because of redundancy across regions. Which benefit is this?",
    "options": [
      "Consumption-based billing",
      "Manageability",
      "Serverless",
      "Reliability"
    ],
    "correct_index": 3,
    "explanation": "Reliability is a system's ability to recover from failures and continue to function.",
    "wrong_explanations": [
      "That is a pricing model, not a resilience feature.",
      "Manageability is about the ease of managing and automating resources.",
      "Serverless is a compute model; it does not define recovery behaviour by itself.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=reliability%20Azure",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-16",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of reliability and predictability in the cloud",
    "question": "A team uses autoscaling and load balancing so response times stay consistent as the number of users grows. Which type of predictability is this?",
    "options": [
      "Hardware predictability",
      "Cost predictability",
      "Legal predictability",
      "Performance predictability"
    ],
    "correct_index": 3,
    "explanation": "Performance predictability means keeping response times steady under changing load; cost predictability is a separate benefit.",
    "wrong_explanations": [
      "Hardware is managed by the provider; the benefit concerns performance and cost.",
      "Cost predictability is about forecasting spend, for example with the pricing calculator.",
      "Cloud predictability benefits cover performance and cost, not legal outcomes.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=autoscale%20load%20balancing",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-17",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of security and governance in the cloud",
    "question": "Which is a governance benefit of using Azure?",
    "options": [
      "Microsoft takes legal responsibility for all customer data",
      "Customers no longer need to manage user identities",
      "Tools such as Azure Policy can enforce organisational standards across resources",
      "Governance is unnecessary in the cloud"
    ],
    "correct_index": 2,
    "explanation": "Azure provides built-in governance tools to apply and audit rules consistently at scale.",
    "wrong_explanations": [
      "Customers stay responsible for their own data under the shared responsibility model.",
      "Identity management remains the customer's responsibility.",
      null,
      "Governance is still needed to control cost, security and compliance."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20governance",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-18",
    "domain_id": 1,
    "topic_id": "cloud-benefits",
    "objective": "Describe the benefits of manageability in the cloud",
    "question": "Deploying identical environments repeatedly from templates, and managing them through the portal, command line or REST APIs, illustrates which cloud benefit?",
    "options": [
      "Data sovereignty",
      "Private connectivity",
      "Manageability",
      "Capital expenditure"
    ],
    "correct_index": 2,
    "explanation": "Manageability covers managing the cloud (autoscaling, templates, monitoring) and managing in the cloud (portal, CLI, APIs).",
    "wrong_explanations": [
      "Sovereignty concerns data location and legal jurisdiction.",
      "Private connectivity relates to networking, not managing deployments.",
      null,
      "CapEx is a spending model, not a management capability."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=manageability%20cloud",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-19",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Describe infrastructure as a service (IaaS)",
    "question": "Which statement best describes infrastructure as a service (IaaS)?",
    "options": [
      "The customer owns and operates all physical hardware",
      "The provider manages everything, including the application",
      "The provider supplies a managed platform so you can deploy code without managing the OS",
      "The provider supplies virtualised compute, storage and networking, and the customer manages the OS and applications"
    ],
    "correct_index": 3,
    "explanation": "IaaS gives the most customer control: you manage the guest OS, middleware and apps on provider-hosted virtual hardware.",
    "wrong_explanations": [
      "That describes on-premises infrastructure.",
      "That describes SaaS.",
      "That describes PaaS.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=IaaS%20infrastructure%20as%20a%20service",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-20",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Describe infrastructure as a service (IaaS)",
    "question": "Which of these is an example of IaaS?",
    "options": [
      "Azure Virtual Machines",
      "Azure App Service",
      "Hosted Microsoft 365 email",
      "Azure SQL Database"
    ],
    "correct_index": 0,
    "explanation": "With Azure VMs you manage the operating system and software, which is typical IaaS.",
    "wrong_explanations": [
      null,
      "App Service is PaaS; the platform manages the OS and runtime.",
      "Hosted email is SaaS.",
      "Azure SQL Database is a managed PaaS database."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Virtual%20Machines%20overview",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-21",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Describe platform as a service (PaaS)",
    "question": "A development team wants to deploy a web application without managing or patching the operating system or web server. Which service type fits?",
    "options": [
      "Software as a service (SaaS)",
      "Platform as a service (PaaS)",
      "On-premises hosting",
      "Infrastructure as a service (IaaS)"
    ],
    "correct_index": 1,
    "explanation": "PaaS provides a managed platform and runtime so developers focus on application code and data.",
    "wrong_explanations": [
      "SaaS delivers finished software, but the team is building its own app.",
      null,
      "On-premises means managing everything, including hardware.",
      "IaaS would require the team to manage the OS."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=PaaS%20platform%20as%20a%20service",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-22",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Describe platform as a service (PaaS)",
    "question": "Compared with IaaS, which additional responsibility does PaaS shift to the provider?",
    "options": [
      "Employee devices",
      "Operating system and runtime maintenance",
      "User accounts and identities",
      "The customer's data"
    ],
    "correct_index": 1,
    "explanation": "In PaaS the provider also manages the OS and runtime, leaving the customer with apps and data.",
    "wrong_explanations": [
      "Device security stays with the customer.",
      null,
      "Identity management always remains with the customer.",
      "Customers always keep responsibility for their own data."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=shared%20responsibility%20PaaS",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-23",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Describe software as a service (SaaS)",
    "question": "A school uses a vendor-hosted web service for email and documents and only manages its users and data. Which service type is this?",
    "options": [
      "PaaS",
      "IaaS",
      "Private cloud",
      "Software as a service (SaaS)"
    ],
    "correct_index": 3,
    "explanation": "SaaS delivers complete, ready-to-use applications managed by the provider.",
    "wrong_explanations": [
      "PaaS is a development platform, not a ready-made application.",
      "With IaaS the school would manage servers and the OS.",
      "Private cloud is a deployment model, not a service type.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=SaaS%20software%20as%20a%20service",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "cc-24",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Describe software as a service (SaaS)",
    "question": "Which pairing of service type and example is correct?",
    "options": [
      "SaaS: Azure Virtual Network",
      "IaaS: Azure Functions",
      "IaaS: Microsoft 365",
      "PaaS: Azure App Service"
    ],
    "correct_index": 3,
    "explanation": "App Service is a managed platform for hosting web apps.",
    "wrong_explanations": [
      "A virtual network is a networking building block, not a SaaS application.",
      "Azure Functions is serverless, a higher level of abstraction than IaaS.",
      "Microsoft 365 is SaaS.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20App%20Service%20overview",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-25",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Identify appropriate use cases for each cloud service type (IaaS, PaaS, and SaaS)",
    "question": "A company must run a legacy application that needs a specific OS version and custom drivers. Which service type is the best fit?",
    "options": [
      "SaaS",
      "IaaS",
      "Serverless",
      "PaaS"
    ],
    "correct_index": 1,
    "explanation": "IaaS gives control of the OS and installed software, which legacy apps often need.",
    "wrong_explanations": [
      "SaaS offers fixed software with no OS access.",
      null,
      "Serverless does not allow OS and driver control.",
      "PaaS restricts OS-level changes."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=IaaS%20use%20cases",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "cc-26",
    "domain_id": 1,
    "topic_id": "cloud-service-types",
    "objective": "Identify appropriate use cases for each cloud service type (IaaS, PaaS, and SaaS)",
    "question": "Which list orders the service types from the most customer control to the least?",
    "options": [
      "IaaS, PaaS, SaaS",
      "SaaS, PaaS, IaaS",
      "SaaS, IaaS, PaaS",
      "PaaS, IaaS, SaaS"
    ],
    "correct_index": 0,
    "explanation": "IaaS gives the most control, PaaS less, and SaaS the least because the provider manages most layers.",
    "wrong_explanations": [
      null,
      "This reverses the order of control.",
      "SaaS always has the least customer control.",
      "IaaS gives more control than PaaS."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=IaaS%20PaaS%20SaaS",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-01",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe Azure regions, region pairs, and sovereign regions",
    "question": "What is an Azure region?",
    "options": [
      "A single rack of servers",
      "A set of datacenters deployed within a latency-defined area and connected by a dedicated low-latency network",
      "A group of management groups",
      "A billing boundary for departments"
    ],
    "correct_index": 1,
    "explanation": "A region is a geographic area containing one or more datacenters networked together.",
    "wrong_explanations": [
      "A region contains many racks and datacenters.",
      null,
      "Regions are physical locations, not groupings of management groups.",
      "Subscriptions are used for billing boundaries."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20regions",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-02",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe Azure regions, region pairs, and sovereign regions",
    "question": "What is a benefit of Azure region pairs?",
    "options": [
      "They merge two regions into one datacenter",
      "They make all data transfer between regions free",
      "They remove the need for backups",
      "Platform updates are rolled out one region at a time and recovery of one region is prioritised during a broad outage"
    ],
    "correct_index": 3,
    "explanation": "Paired regions in the same geography support disaster recovery and reduce the chance of both being affected together.",
    "wrong_explanations": [
      "Paired regions stay separate, physically distant locations.",
      "Data transfer between regions may incur charges.",
      "Customers still need their own backup and recovery planning.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20region%20pairs",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-03",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe Azure regions, region pairs, and sovereign regions",
    "question": "What is the purpose of Azure sovereign regions?",
    "options": [
      "They are free regions for trial accounts",
      "They have no physical datacenters",
      "They are isolated instances of Azure for specific compliance or legal needs, such as Azure Government",
      "They are datacenters installed at customer sites"
    ],
    "correct_index": 2,
    "explanation": "Sovereign regions, such as Azure Government and Azure operated by 21Vianet in China, are separate from the public Azure instance.",
    "wrong_explanations": [
      "Sovereign regions serve compliance and legal requirements, not trials.",
      "Like other regions, they contain physical datacenters.",
      null,
      "Sovereign regions are operated by Microsoft or partners, not placed at customer sites."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20sovereign%20regions",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-04",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe availability zones",
    "question": "What is an availability zone?",
    "options": [
      "Another name for a region pair",
      "A group of subscriptions",
      "A subnet inside a virtual network",
      "A physically separate location within a region with independent power, cooling and networking"
    ],
    "correct_index": 3,
    "explanation": "Availability zones protect apps from datacenter-level failures within a region.",
    "wrong_explanations": [
      "A region pair links two regions, while zones sit inside one region.",
      "Subscriptions are billing and management units, not physical zones.",
      "Subnets are logical network segments, not physical locations.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=availability%20zones",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-05",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe availability zones",
    "question": "An application must keep running if one datacenter in its region fails. What should you do?",
    "options": [
      "Put all instances in a single zone",
      "Deploy instances across multiple availability zones",
      "Apply a tag named HighAvailability",
      "Add a resource lock to the VM"
    ],
    "correct_index": 1,
    "explanation": "Spreading instances over separate zones means a failure in one zone does not take the application down.",
    "wrong_explanations": [
      "A single zone failure would take everything down.",
      null,
      "Tags are labels and have no effect on availability.",
      "Locks prevent changes or deletion, not outages."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=availability%20zones",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-06",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe Azure resources and resource groups",
    "question": "Which statement about Azure resource groups is true?",
    "options": [
      "A resource can belong to several resource groups at once",
      "Each Azure resource belongs to exactly one resource group",
      "Resource groups can be nested inside each other",
      "Deleting a resource group leaves its resources untouched"
    ],
    "correct_index": 1,
    "explanation": "Resource groups are containers for related resources, and every resource lives in one group.",
    "wrong_explanations": [
      "A resource is in exactly one resource group at a time.",
      null,
      "Azure does not support nesting resource groups.",
      "Deleting a resource group deletes all the resources in it."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=resource%20groups",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-07",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe subscriptions",
    "question": "A company wants separate bills for its Finance and Engineering departments. What is the simplest Azure construct to use?",
    "options": [
      "Separate region pairs",
      "Separate availability zones",
      "Separate virtual networks",
      "Separate subscriptions"
    ],
    "correct_index": 3,
    "explanation": "Subscriptions are billing and access boundaries, so each department can have its own.",
    "wrong_explanations": [
      "Region pairs are for resilience, not billing.",
      "Zones are physical locations, not billing boundaries.",
      "Virtual networks segment traffic, not bills.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20subscriptions",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-08",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe management groups",
    "question": "What can you do with Azure management groups?",
    "options": [
      "Apply policies and access control across multiple subscriptions",
      "Store unstructured data",
      "Create virtual network peering",
      "Scale virtual machines automatically"
    ],
    "correct_index": 0,
    "explanation": "Management groups organise subscriptions so governance settings are inherited by all of them.",
    "wrong_explanations": [
      null,
      "Data storage is provided by storage services.",
      "Peering connects virtual networks, not subscriptions.",
      "Scaling is done with services such as scale sets."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=management%20groups",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-09",
    "domain_id": 2,
    "topic_id": "core-architecture",
    "objective": "Describe the hierarchy of resource groups, subscriptions, and management groups",
    "question": "Which sequence lists Azure's management hierarchy from the highest scope to the lowest?",
    "options": [
      "Resource, resource group, subscription, management group",
      "Subscription, management group, resource, resource group",
      "Management group, subscription, resource group, resource",
      "Resource group, subscription, management group, resource"
    ],
    "correct_index": 2,
    "explanation": "Management groups contain subscriptions, which contain resource groups, which contain resources.",
    "wrong_explanations": [
      "This lists the scopes from lowest to highest.",
      "Management groups sit above subscriptions, and resource groups sit above resources.",
      null,
      "This mixes up the order of scopes."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20resource%20hierarchy",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-10",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Compare compute types, including containers, virtual machines, and functions",
    "question": "Which compute option packages an application with its dependencies and shares the host operating system kernel?",
    "options": [
      "Virtual machines",
      "Containers",
      "Azure Functions",
      "Dedicated physical servers"
    ],
    "correct_index": 1,
    "explanation": "Containers are lightweight and portable because they share the host OS, unlike VMs that each include a full guest OS.",
    "wrong_explanations": [
      "Each VM runs its own full guest OS.",
      null,
      "Functions run event-driven code and abstract away the hosting details.",
      "Physical servers are not packaged application units."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=containers%20vs%20virtual%20machines",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-11",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe virtual machine options, including Azure virtual machines, Azure Virtual Machine Scale Sets, availability sets, and Azure Virtual Desktop",
    "question": "Which Azure service can automatically increase or decrease the number of identical VM instances based on demand?",
    "options": [
      "Virtual Machine Scale Sets",
      "Availability sets",
      "Azure Virtual Desktop",
      "Azure Arc"
    ],
    "correct_index": 0,
    "explanation": "Scale sets manage a group of load-balanced VMs and can autoscale.",
    "wrong_explanations": [
      null,
      "Availability sets spread VMs across fault domains; they do not autoscale.",
      "Virtual Desktop delivers remote desktops and apps.",
      "Arc extends Azure management to other environments."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Virtual%20Machine%20Scale%20Sets",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-12",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe virtual machine options, including Azure virtual machines, Azure Virtual Machine Scale Sets, availability sets, and Azure Virtual Desktop",
    "question": "A company wants remote staff to securely use a full Windows desktop and applications hosted in Azure. Which service fits?",
    "options": [
      "Azure Virtual Desktop",
      "Azure DNS",
      "Azure Policy",
      "Azure Blob Storage"
    ],
    "correct_index": 0,
    "explanation": "Azure Virtual Desktop is a desktop and app virtualisation service in the cloud.",
    "wrong_explanations": [
      null,
      "DNS resolves domain names.",
      "Policy enforces rules on resources.",
      "Blob Storage stores unstructured data."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Virtual%20Desktop",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-13",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe virtual machine options, including Azure virtual machines, Azure Virtual Machine Scale Sets, availability sets, and Azure Virtual Desktop",
    "question": "What does an availability set help protect against?",
    "options": [
      "Expired user passwords",
      "Accidental deletion of resources",
      "Failure of an entire region",
      "Hardware failures and planned maintenance within a datacenter, by spreading VMs across fault and update domains"
    ],
    "correct_index": 3,
    "explanation": "Availability sets distribute VMs so a single rack failure or maintenance event does not affect all of them.",
    "wrong_explanations": [
      "Identity services handle credentials.",
      "Locks and backups protect against deletion.",
      "Surviving a regional failure needs a multi-region design.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=availability%20sets",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "as-14",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe the resources required for virtual machines",
    "question": "Which resources are typically needed to create an Azure virtual machine?",
    "options": [
      "A Log Analytics workspace and an alert rule",
      "A management group and a policy assignment",
      "A virtual network, a network interface and an OS disk",
      "An ExpressRoute circuit and a VPN gateway"
    ],
    "correct_index": 2,
    "explanation": "A VM needs compute plus networking and storage for its operating system disk.",
    "wrong_explanations": [
      "Monitoring is optional.",
      "Those are governance constructs, not required to create a VM.",
      null,
      "These connect on-premises networks and are not required for a basic VM."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20virtual%20machine%20resources",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-15",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe application hosting options, including web apps, containers, and virtual machines",
    "question": "Which Azure service is a managed platform for hosting web apps and APIs without managing servers?",
    "options": [
      "Azure Virtual Network",
      "Azure App Service",
      "Azure Service Health",
      "Azure Data Box"
    ],
    "correct_index": 1,
    "explanation": "App Service is a PaaS offering for web apps, REST APIs and mobile back ends.",
    "wrong_explanations": [
      "A virtual network provides connectivity, not application hosting.",
      null,
      "Service Health reports on Azure incidents.",
      "Data Box is a physical device for moving data."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20App%20Service%20overview",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-16",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe virtual networking, including the purpose of Azure virtual networks, subnets, peering, Azure DNS, Azure VPN Gateway, and ExpressRoute",
    "question": "Which Azure feature connects two virtual networks so resources can communicate privately over the Microsoft backbone network?",
    "options": [
      "Virtual network peering",
      "Azure DNS",
      "Microsoft Cost Management",
      "Azure Advisor"
    ],
    "correct_index": 0,
    "explanation": "Peering links VNets so traffic stays on Microsoft's private network.",
    "wrong_explanations": [
      null,
      "DNS resolves names, not network connectivity.",
      "Cost Management tracks spending.",
      "Advisor gives recommendations."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=virtual%20network%20peering",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-17",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Describe virtual networking, including the purpose of Azure virtual networks, subnets, peering, Azure DNS, Azure VPN Gateway, and ExpressRoute",
    "question": "Which service provides a private, dedicated connection between an on-premises network and Azure that does not travel over the public internet?",
    "options": [
      "Azure ExpressRoute",
      "Azure VPN Gateway",
      "A subnet",
      "Azure DNS"
    ],
    "correct_index": 0,
    "explanation": "ExpressRoute uses a private connection through a connectivity provider.",
    "wrong_explanations": [
      null,
      "VPN Gateway sends encrypted traffic over the public internet.",
      "Subnets divide a virtual network; they do not connect to on-premises sites.",
      "DNS is for name resolution."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20ExpressRoute",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-18",
    "domain_id": 2,
    "topic_id": "compute-networking",
    "objective": "Define public and private endpoints",
    "question": "What does an Azure private endpoint do?",
    "options": [
      "Exposes a virtual machine directly to the internet",
      "Creates a VPN tunnel to your office",
      "Encrypts data stored on disks",
      "Gives an Azure service a private IP address in your virtual network so traffic avoids the public internet"
    ],
    "correct_index": 3,
    "explanation": "A private endpoint brings a service such as a storage account into your VNet address space.",
    "wrong_explanations": [
      "That describes a public endpoint or public IP address.",
      "VPN tunnels are provided by VPN Gateway.",
      "Disk encryption is a separate feature.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Private%20Endpoint",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "as-19",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Compare Azure Storage services",
    "question": "Which Azure Storage service is designed for large amounts of unstructured data such as images, video and backups?",
    "options": [
      "Azure Queue Storage",
      "Azure Table Storage",
      "Azure Blob Storage",
      "Azure Files"
    ],
    "correct_index": 2,
    "explanation": "Blob Storage stores massive amounts of unstructured object data.",
    "wrong_explanations": [
      "Queue Storage stores messages for asynchronous processing.",
      "Table Storage holds NoSQL key-attribute data.",
      null,
      "Azure Files provides managed file shares."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Blob%20Storage",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-20",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Compare Azure Storage services",
    "question": "A web app needs to pass messages between components so that a sudden burst of requests does not overwhelm the back end. Which storage service is designed for this?",
    "options": [
      "Azure Files",
      "Azure Queue Storage",
      "Azure Blob Storage",
      "Azure Table Storage"
    ],
    "correct_index": 1,
    "explanation": "Queues decouple components by storing messages until they are processed.",
    "wrong_explanations": [
      "Azure Files provides file shares.",
      null,
      "Blob Storage holds objects, not message queues.",
      "Table Storage stores structured NoSQL data."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Queue%20Storage",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-21",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Describe storage tiers",
    "question": "Which blob access tier has the lowest storage cost but needs hours to retrieve data, suiting rarely accessed data kept for at least 180 days?",
    "options": [
      "Hot",
      "Premium",
      "Archive",
      "Cool"
    ],
    "correct_index": 2,
    "explanation": "The Archive tier keeps data offline at the lowest storage price, with rehydration taking hours.",
    "wrong_explanations": [
      "Hot is for frequently accessed data and has the highest storage cost.",
      "Premium is a performance tier for low-latency workloads, not the cheapest storage.",
      null,
      "Cool serves infrequent access but keeps data online with immediate access."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=blob%20access%20tiers",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-22",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Describe redundancy options",
    "question": "A business needs storage that survives a datacenter failure in the primary region and a full regional disaster. Which redundancy option fits best?",
    "options": [
      "Geo-zone-redundant storage (GZRS)",
      "Locally redundant storage (LRS)",
      "Geo-redundant storage (GRS)",
      "Zone-redundant storage (ZRS)"
    ],
    "correct_index": 0,
    "explanation": "GZRS replicates across availability zones in the primary region and asynchronously to a secondary region.",
    "wrong_explanations": [
      null,
      "LRS keeps copies in one datacenter only.",
      "GRS copies to a second region, but the primary copies sit in a single location rather than across zones.",
      "ZRS protects against zone failure but stays within one region."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Storage%20redundancy",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "as-23",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Describe storage account options and storage types",
    "question": "What is an Azure storage account?",
    "options": [
      "A backup of a virtual machine",
      "A billing account for a department",
      "A unique namespace that holds your Azure Storage data objects such as blobs, files, queues and tables",
      "A type of subscription"
    ],
    "correct_index": 2,
    "explanation": "The storage account provides the namespace and settings for your storage services.",
    "wrong_explanations": [
      "VM backups are stored in separate backup services.",
      "Billing accounts and subscriptions manage payment.",
      null,
      "A storage account lives inside a subscription."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20storage%20account",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-24",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Identify options for moving files, including AzCopy, Azure Storage Explorer, and Azure File Sync",
    "question": "Which tool is a command-line utility for copying data to and from Azure Storage?",
    "options": [
      "Azure Storage Explorer",
      "Azure File Sync",
      "AzCopy",
      "Azure Data Box"
    ],
    "correct_index": 2,
    "explanation": "AzCopy is a command-line tool for fast data transfer to and from storage accounts.",
    "wrong_explanations": [
      "Storage Explorer is a graphical application.",
      "File Sync synchronises file servers with Azure Files.",
      null,
      "Data Box is a physical shipping device."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=AzCopy",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-25",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Describe migration options, including Azure Migrate and Azure Data Box",
    "question": "A Nairobi company must move tens of terabytes to Azure but its internet connection is slow. Which option is best?",
    "options": [
      "Azure Queue Storage",
      "Azure DNS",
      "Azure Data Box",
      "AzCopy over the existing internet link"
    ],
    "correct_index": 2,
    "explanation": "Data Box lets you ship data on a physical device to an Azure datacenter for upload.",
    "wrong_explanations": [
      "Queue Storage holds messages, not bulk data.",
      "DNS has nothing to do with moving data.",
      null,
      "AzCopy works but would be impractically slow with limited bandwidth."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Data%20Box",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-26",
    "domain_id": 2,
    "topic_id": "storage",
    "objective": "Describe migration options, including Azure Migrate and Azure Data Box",
    "question": "Which service provides a central hub to discover, assess and migrate on-premises servers, databases and apps to Azure?",
    "options": [
      "Azure Advisor",
      "Microsoft Cost Management",
      "Azure Migrate",
      "Azure Arc"
    ],
    "correct_index": 2,
    "explanation": "Azure Migrate is the central hub for assessing and migrating workloads to Azure.",
    "wrong_explanations": [
      "Advisor recommends improvements for resources already in Azure.",
      "Cost Management tracks and optimises spending.",
      null,
      "Arc manages resources outside Azure from the Azure control plane."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Migrate",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-27",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe directory services in Azure, including Microsoft Entra ID and Microsoft Entra Domain Services",
    "question": "What is Microsoft Entra ID?",
    "options": [
      "A cloud-based identity and access management service",
      "A virtual machine image",
      "A monitoring dashboard",
      "A blob access tier"
    ],
    "correct_index": 0,
    "explanation": "Microsoft Entra ID (formerly Azure Active Directory) manages sign-ins and access to resources.",
    "wrong_explanations": [
      null,
      "Images are used to create VMs.",
      "Monitoring is done with Azure Monitor.",
      "Access tiers apply to storage."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Microsoft%20Entra%20ID",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-28",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe authentication methods in Azure, including single sign-on (SSO), multifactor authentication (MFA), and passwordless",
    "question": "Which sign-in combines two different types of authentication factors (MFA)?",
    "options": [
      "A password plus a security question",
      "A password plus a code from an authenticator app",
      "Two different passwords",
      "A PIN plus a password"
    ],
    "correct_index": 1,
    "explanation": "MFA requires factors from different categories, such as something you know and something you have.",
    "wrong_explanations": [
      "Both are something you know.",
      null,
      "Both are the same factor type.",
      "Both are something you know."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=multifactor%20authentication",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-29",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe external identities in Azure",
    "question": "A company wants partners from other organisations to access a shared app using their own work accounts. Which capability supports this?",
    "options": [
      "Resource locks",
      "Availability sets",
      "Microsoft Entra External ID (B2B collaboration)",
      "Azure Load Balancer"
    ],
    "correct_index": 2,
    "explanation": "External identities let guests use their own credentials to access your resources.",
    "wrong_explanations": [
      "Locks prevent accidental changes or deletion.",
      "Availability sets improve VM resilience.",
      null,
      "Load balancers distribute network traffic."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Microsoft%20Entra%20External%20ID",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "as-30",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe Microsoft Entra Conditional Access",
    "question": "Which Microsoft Entra feature evaluates signals such as user, location, device and risk to decide whether to require MFA or block access?",
    "options": [
      "Conditional Access",
      "Resource locks",
      "Azure Advisor",
      "Azure Policy"
    ],
    "correct_index": 0,
    "explanation": "Conditional Access applies if-then policies using signals to control access.",
    "wrong_explanations": [
      null,
      "Locks protect resources from changes.",
      "Advisor provides recommendations.",
      "Azure Policy governs resource configuration, not sign-in decisions."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Conditional%20Access",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-31",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe Azure role-based access control (RBAC)",
    "question": "What does Azure role-based access control (RBAC) manage?",
    "options": [
      "Which users can perform which actions on Azure resources at a given scope",
      "Whether data is replicated to a second region",
      "How much a subscription costs",
      "Which regions resources may be deployed in"
    ],
    "correct_index": 0,
    "explanation": "RBAC uses role assignments to grant permissions at a scope such as a subscription or resource group.",
    "wrong_explanations": [
      null,
      "Replication is a storage redundancy setting.",
      "Costs are managed with Cost Management.",
      "Restricting regions is done with Azure Policy."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20RBAC",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "as-32",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe the concept of Zero Trust",
    "question": "Which principle is central to a Zero Trust security model?",
    "options": [
      "Trust anything inside the corporate network",
      "Trust any device connected by VPN",
      "Verify explicitly, use least-privilege access and assume breach",
      "Rely on passwords alone"
    ],
    "correct_index": 2,
    "explanation": "Zero Trust treats every request as untrusted until it is verified.",
    "wrong_explanations": [
      "Zero Trust does not assume the internal network is safe.",
      "Being on a VPN does not remove the need for verification.",
      null,
      "Zero Trust encourages strong, multi-factor verification."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Zero%20Trust",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-33",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe the purpose of the defense-in-depth model",
    "question": "What is the idea behind defense in depth?",
    "options": [
      "Trusting all internal traffic",
      "Using multiple layers of security so that if one layer is breached the others still protect resources",
      "Relying on a single strong firewall",
      "Using one shared admin password"
    ],
    "correct_index": 1,
    "explanation": "Layers such as physical, identity, perimeter, network, compute, application and data work together.",
    "wrong_explanations": [
      "That removes layers of protection.",
      null,
      "One control is a single point of failure.",
      "That weakens security and removes accountability."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=defense%20in%20depth",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "as-34",
    "domain_id": 2,
    "topic_id": "identity-security",
    "objective": "Describe the purpose of Microsoft Defender for Cloud",
    "question": "Which service provides security posture management and threat protection across Azure, hybrid and multicloud workloads?",
    "options": [
      "Azure Service Health",
      "Azure pricing calculator",
      "Microsoft Cost Management",
      "Microsoft Defender for Cloud"
    ],
    "correct_index": 3,
    "explanation": "Defender for Cloud assesses security posture and protects workloads.",
    "wrong_explanations": [
      "Service Health reports on Azure service issues.",
      "The pricing calculator estimates costs.",
      "Cost Management handles spending.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Microsoft%20Defender%20for%20Cloud",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-01",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe factors that can affect costs in Azure",
    "question": "Which statement about Azure costs is correct?",
    "options": [
      "Inbound data transfer is always the largest charge",
      "The price of the same resource can vary by region",
      "Prices are identical in every region",
      "Cost depends only on the subscription name"
    ],
    "correct_index": 1,
    "explanation": "Region, size, usage and licensing all influence cost.",
    "wrong_explanations": [
      "Inbound transfers are generally free, while outbound transfers are usually charged.",
      null,
      "Regional differences in cost are common.",
      "Names have no effect on pricing."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=factors%20affecting%20Azure%20costs",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-02",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe factors that can affect costs in Azure",
    "question": "Which data movement is generally free in Azure?",
    "options": [
      "Data leaving Azure to the internet",
      "Data moved between Azure regions",
      "Data transferred into Azure datacenters (inbound)",
      "Data downloaded by visitors to your public website"
    ],
    "correct_index": 2,
    "explanation": "Inbound data transfer is generally free, while outbound transfer beyond free allowances is charged.",
    "wrong_explanations": [
      "Outbound transfers beyond free allowances are billed.",
      "Cross-region transfers are generally charged.",
      null,
      "Downloads by visitors are outbound traffic and are billed."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20bandwidth%20pricing",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "mg-03",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe factors that can affect costs in Azure",
    "question": "A workload runs only during business hours. Which action is most likely to lower its VM costs?",
    "options": [
      "Stop (deallocate) the VMs outside business hours",
      "Move the VMs to another subscription",
      "Increase the VM size",
      "Leave the VMs running and add tags"
    ],
    "correct_index": 0,
    "explanation": "Deallocated VMs do not incur compute charges, though attached disks still cost money.",
    "wrong_explanations": [
      null,
      "Moving subscriptions does not change resource pricing.",
      "Larger VMs usually cost more.",
      "Tags help reporting but do not reduce charges."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=reduce%20Azure%20virtual%20machine%20costs",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-04",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Explore the pricing calculator",
    "question": "A team wants to estimate monthly costs for a planned deployment before creating any resources. Which tool should they use?",
    "options": [
      "Azure pricing calculator",
      "Azure Service Health",
      "Microsoft Cost Management",
      "Azure Advisor"
    ],
    "correct_index": 0,
    "explanation": "The pricing calculator estimates the cost of Azure services you configure.",
    "wrong_explanations": [
      null,
      "Service Health reports incidents.",
      "Cost Management shows actual spending on existing resources.",
      "Advisor recommends improvements to existing resources."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20pricing%20calculator",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "mg-05",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe cost management capabilities in Azure",
    "question": "Which Azure capability lets you analyse spending, set budgets and receive alerts as costs approach a limit?",
    "options": [
      "Microsoft Cost Management",
      "Azure pricing calculator",
      "Azure Policy",
      "Resource locks"
    ],
    "correct_index": 0,
    "explanation": "Cost Management provides cost analysis, budgets and alerts.",
    "wrong_explanations": [
      null,
      "The calculator estimates future costs rather than tracking actual spend.",
      "Policy enforces resource standards.",
      "Locks prevent changes or deletions."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Microsoft%20Cost%20Management",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-06",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe cost management capabilities in Azure",
    "question": "Finance wants an email when monthly spend reaches 80 percent of an agreed limit. What should be created?",
    "options": [
      "An availability zone",
      "A resource lock",
      "A budget with an alert in Cost Management",
      "A management group"
    ],
    "correct_index": 2,
    "explanation": "Budgets track spend against a threshold and send notifications.",
    "wrong_explanations": [
      "Zones are physical locations for resilience.",
      "Locks do not monitor spending.",
      null,
      "Management groups organise subscriptions."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Cost%20Management%20budgets",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-07",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe the purpose of tags",
    "question": "What are Azure tags?",
    "options": [
      "Network address ranges",
      "Name-value pairs applied to resources to organise them and support cost reporting",
      "Backup retention policies",
      "User accounts with admin rights"
    ],
    "correct_index": 1,
    "explanation": "Tags such as Department=Finance help categorise and report on resources.",
    "wrong_explanations": [
      "Address ranges belong to virtual networks and subnets.",
      null,
      "Backup retention is configured in backup services.",
      "Tags are not identities."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20tags",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "mg-08",
    "domain_id": 3,
    "topic_id": "cost-management",
    "objective": "Describe the purpose of tags",
    "question": "Finance wants costs reported per department. What is the best approach?",
    "options": [
      "Apply a Department tag to resources and group costs by that tag",
      "Assign each department the Reader role",
      "Deploy each department in a different region",
      "Create a resource lock for each department"
    ],
    "correct_index": 0,
    "explanation": "Tagged resources can be filtered and grouped in cost analysis.",
    "wrong_explanations": [
      null,
      "Roles control access, not cost allocation.",
      "Regions do not provide departmental reporting.",
      "Locks do not categorise costs."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20tags%20cost%20reporting",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-09",
    "domain_id": 3,
    "topic_id": "governance-compliance",
    "objective": "Describe the purpose of Microsoft Purview in Azure",
    "question": "Which service helps govern and protect data across on-premises, multicloud and SaaS sources, including cataloguing and classifying data?",
    "options": [
      "Azure Arc",
      "Microsoft Purview",
      "Azure Policy",
      "Azure Monitor"
    ],
    "correct_index": 1,
    "explanation": "Purview provides data governance, protection and compliance capabilities.",
    "wrong_explanations": [
      "Arc extends Azure management to other environments.",
      null,
      "Policy governs resource configuration.",
      "Monitor collects performance and log telemetry."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Microsoft%20Purview",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-10",
    "domain_id": 3,
    "topic_id": "governance-compliance",
    "objective": "Describe the purpose of Azure Policy",
    "question": "A company wants to ensure resources can only be deployed in approved regions. Which service enforces this?",
    "options": [
      "Azure Advisor",
      "Azure Policy",
      "Azure RBAC",
      "Resource locks"
    ],
    "correct_index": 1,
    "explanation": "Azure Policy evaluates resources against rules such as allowed locations.",
    "wrong_explanations": [
      "Advisor only recommends.",
      null,
      "RBAC controls who can act, not which regions are allowed.",
      "Locks prevent deletion or change, not placement."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Policy",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-11",
    "domain_id": 3,
    "topic_id": "governance-compliance",
    "objective": "Describe the purpose of Azure Policy",
    "question": "Which statement correctly distinguishes Azure Policy from Azure RBAC?",
    "options": [
      "RBAC enforces allowed regions",
      "Policy governs resource properties and compliance, while RBAC governs user permissions",
      "Policy grants users access to resources",
      "Both only control user permissions"
    ],
    "correct_index": 1,
    "explanation": "Policy checks what resources look like; RBAC decides who can do what.",
    "wrong_explanations": [
      "Allowed regions are a Policy rule.",
      null,
      "Access is granted through RBAC roles.",
      "Policy is not about user permissions."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Policy%20vs%20RBAC",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "mg-12",
    "domain_id": 3,
    "topic_id": "governance-compliance",
    "objective": "Describe the purpose of Azure Policy",
    "question": "What is an initiative in Azure Policy?",
    "options": [
      "A collection of policy definitions grouped to meet a larger goal",
      "A type of resource lock",
      "A budget threshold",
      "A user permission role"
    ],
    "correct_index": 0,
    "explanation": "Initiatives bundle related policies so they can be assigned together.",
    "wrong_explanations": [
      null,
      "Locks are separate from policies.",
      "Budgets are part of Cost Management.",
      "Roles belong to RBAC."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Policy%20initiatives",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "mg-13",
    "domain_id": 3,
    "topic_id": "governance-compliance",
    "objective": "Describe the purpose of resource locks",
    "question": "An administrator wants a production resource group to stay readable but not be modified or deleted. Which lock should be applied?",
    "options": [
      "Read-only lock",
      "Delete (CanNotDelete) lock",
      "Tag lock",
      "Budget lock"
    ],
    "correct_index": 0,
    "explanation": "A ReadOnly lock allows reading but blocks changes and deletion.",
    "wrong_explanations": [
      null,
      "This still allows modifications.",
      "There is no such lock; tags are just labels.",
      "Budgets do not lock resources."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20resource%20locks",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-14",
    "domain_id": 3,
    "topic_id": "governance-compliance",
    "objective": "Describe the purpose of resource locks",
    "question": "A resource has a CanNotDelete lock. What can an authorised user do?",
    "options": [
      "Delete and modify it freely",
      "Read and modify the resource but not delete it",
      "Nothing at all",
      "Only read the resource"
    ],
    "correct_index": 1,
    "explanation": "CanNotDelete blocks deletion only.",
    "wrong_explanations": [
      "The lock prevents deletion.",
      null,
      "Authorised users can still read and modify.",
      "That describes a ReadOnly lock."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20resource%20locks",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-15",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe the Azure portal",
    "question": "A beginner prefers a graphical, browser-based interface with dashboards to create and manage Azure resources. Which tool fits?",
    "options": [
      "Azure PowerShell",
      "Azure CLI",
      "ARM templates",
      "Azure portal"
    ],
    "correct_index": 3,
    "explanation": "The Azure portal is Azure's web-based management console.",
    "wrong_explanations": [
      "PowerShell is command-line based.",
      "The CLI is command-line based.",
      "Templates are code files for automated deployments.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20portal",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "mg-16",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe Azure Cloud Shell, Azure CLI, and Azure PowerShell",
    "question": "Which statement about Azure Cloud Shell is true?",
    "options": [
      "It is a browser-accessible shell that supports Bash and PowerShell with Azure tools preinstalled",
      "It is a VM you must patch yourself",
      "It is a desktop-only application",
      "It supports PowerShell only"
    ],
    "correct_index": 0,
    "explanation": "Cloud Shell gives authenticated command-line access from the browser with tools ready to use.",
    "wrong_explanations": [
      null,
      "Microsoft manages the shell environment.",
      "Cloud Shell runs in the browser.",
      "It supports both Bash and PowerShell."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Cloud%20Shell",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-17",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe Azure Cloud Shell, Azure CLI, and Azure PowerShell",
    "question": "Which statement about Azure CLI and Azure PowerShell is true?",
    "options": [
      "Azure PowerShell only runs on Windows",
      "Neither can be used to automate tasks",
      "Azure CLI works only inside the portal",
      "Both can automate Azure resource management and can run in Cloud Shell"
    ],
    "correct_index": 3,
    "explanation": "Both are command-line options for scripting and can be used in Cloud Shell or installed locally.",
    "wrong_explanations": [
      "PowerShell is available cross-platform.",
      "Both are designed for scripting and automation.",
      "The CLI can be installed on local machines.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20CLI%20and%20Azure%20PowerShell",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-18",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe the purpose of Azure Arc",
    "question": "A company has servers on-premises and in another cloud and wants to manage them from Azure, applying tags and Azure Policy. Which service helps?",
    "options": [
      "Azure Arc",
      "Availability sets",
      "Azure ExpressRoute",
      "Azure Data Box"
    ],
    "correct_index": 0,
    "explanation": "Arc projects non-Azure resources into Azure for unified management.",
    "wrong_explanations": [
      null,
      "Availability sets protect VMs in Azure.",
      "ExpressRoute provides private connectivity, not unified management.",
      "Data Box moves data offline."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Arc",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-19",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe infrastructure as code (IaC)",
    "question": "What is infrastructure as code (IaC)?",
    "options": [
      "Manually configuring every resource in the portal",
      "Buying physical servers in bulk",
      "Managing and provisioning infrastructure through machine-readable definition files instead of manual steps",
      "Writing documentation about servers"
    ],
    "correct_index": 2,
    "explanation": "IaC defines infrastructure in code so deployments are repeatable.",
    "wrong_explanations": [
      "That is the manual approach IaC replaces.",
      "That is hardware procurement.",
      null,
      "Documentation does not deploy resources."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=infrastructure%20as%20code",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "mg-20",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe infrastructure as code (IaC)",
    "question": "Which is a key benefit of infrastructure as code?",
    "options": [
      "It removes the need for authentication",
      "It replaces monitoring",
      "It always lowers costs",
      "Consistent, repeatable deployments that can be version-controlled"
    ],
    "correct_index": 3,
    "explanation": "Code-defined infrastructure can be reviewed, versioned and redeployed identically.",
    "wrong_explanations": [
      "Deployments still require authentication.",
      "Monitoring remains necessary.",
      "IaC does not guarantee lower cost.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=infrastructure%20as%20code%20benefits",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-21",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe Azure Resource Manager (ARM) and ARM templates",
    "question": "What is Azure Resource Manager (ARM)?",
    "options": [
      "A billing report generator",
      "A network gateway",
      "A storage service for blobs",
      "The deployment and management layer through which requests to create, update and delete Azure resources are processed"
    ],
    "correct_index": 3,
    "explanation": "Whether you use the portal, CLI, PowerShell or REST, requests go through ARM.",
    "wrong_explanations": [
      "Billing is handled by Cost Management.",
      "Gateways provide connectivity.",
      "Storage is provided by Azure Storage.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Resource%20Manager",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-22",
    "domain_id": 3,
    "topic_id": "managing-deploying",
    "objective": "Describe Azure Resource Manager (ARM) and ARM templates",
    "question": "What is an ARM template?",
    "options": [
      "A backup of a virtual machine",
      "A JSON file that declaratively defines the resources to deploy",
      "A diagram tool for network layouts",
      "A monthly spending report"
    ],
    "correct_index": 1,
    "explanation": "ARM templates describe the desired state of resources.",
    "wrong_explanations": [
      "Templates do not contain data.",
      null,
      "Templates are deployment definitions, not diagram tools.",
      "Spending reports come from Cost Management."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=ARM%20templates",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-23",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe the purpose of Azure Advisor",
    "question": "Which service analyses your Azure resources and recommends improvements in reliability, security, cost, performance and operational excellence?",
    "options": [
      "Azure Service Health",
      "Azure Advisor",
      "Azure Policy",
      "Azure Monitor"
    ],
    "correct_index": 1,
    "explanation": "Advisor gives personalised best-practice recommendations.",
    "wrong_explanations": [
      "Service Health reports on service issues and maintenance.",
      null,
      "Policy enforces rules.",
      "Monitor collects telemetry."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Advisor",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-24",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe the purpose of Azure Advisor",
    "question": "Azure Advisor shows several VMs with very low CPU use. What type of recommendation is this most likely to be?",
    "options": [
      "Reliability",
      "Cost",
      "Operational excellence",
      "Security"
    ],
    "correct_index": 1,
    "explanation": "Underused VMs can be resized or shut down to save money.",
    "wrong_explanations": [
      "Reliability concerns resilience.",
      null,
      "Operational excellence covers process and deployment practices.",
      "Security recommendations concern vulnerabilities."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Advisor%20cost%20recommendations",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "mg-25",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe Azure Service Health",
    "question": "Which service notifies you about Azure service issues, planned maintenance and health advisories that affect your resources?",
    "options": [
      "Azure Service Health",
      "Azure Advisor",
      "Azure pricing calculator",
      "Microsoft Cost Management"
    ],
    "correct_index": 0,
    "explanation": "Service Health offers a personalised view of issues affecting your subscriptions and regions.",
    "wrong_explanations": [
      null,
      "Advisor provides recommendations.",
      "The calculator estimates costs.",
      "Cost Management tracks spending."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Service%20Health",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-26",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe Azure Service Health",
    "question": "How does Azure Service Health differ from the public Azure status page?",
    "options": [
      "Service Health only shows costs",
      "Azure status is personalised and Service Health is global",
      "They are the same thing",
      "Service Health is personalised to the services and regions you use, while Azure status shows a broad view of global outages"
    ],
    "correct_index": 3,
    "explanation": "Azure status is a general overview; Service Health is tailored to your resources.",
    "wrong_explanations": [
      "It reports service issues, not costs.",
      "This reverses their roles.",
      "They serve different scopes.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20status%20vs%20Service%20Health",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "mg-27",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe Azure Monitor, including Log Analytics, Azure Monitor alerts, and Azure Monitor Application Insights",
    "question": "Which service collects, analyses and acts on telemetry from Azure and on-premises environments?",
    "options": [
      "Azure Policy",
      "Azure DNS",
      "Azure Data Box",
      "Azure Monitor"
    ],
    "correct_index": 3,
    "explanation": "Azure Monitor provides metrics, logs and alerts.",
    "wrong_explanations": [
      "Policy enforces rules.",
      "DNS resolves names.",
      "Data Box moves data offline.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Monitor",
    "difficulty": 1,
    "reviewed": false
  },
  {
    "id": "mg-28",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe Azure Monitor, including Log Analytics, Azure Monitor alerts, and Azure Monitor Application Insights",
    "question": "Where can you write queries to analyse log data collected by Azure Monitor?",
    "options": [
      "Azure pricing calculator",
      "Azure Storage Explorer",
      "Azure Data Box",
      "Log Analytics"
    ],
    "correct_index": 3,
    "explanation": "Log Analytics lets you query logs using Kusto Query Language.",
    "wrong_explanations": [
      "The calculator estimates costs.",
      "Storage Explorer manages storage data.",
      "Data Box is a transfer device.",
      null
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Log%20Analytics",
    "difficulty": 3,
    "reviewed": false
  },
  {
    "id": "mg-29",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe Azure Monitor, including Log Analytics, Azure Monitor alerts, and Azure Monitor Application Insights",
    "question": "Operations wants an email when a VM's CPU stays above 90 percent for ten minutes. What should be configured?",
    "options": [
      "A cost budget",
      "An Azure Policy assignment",
      "An Azure Monitor alert rule with an action group",
      "A resource lock"
    ],
    "correct_index": 2,
    "explanation": "Alert rules watch metrics and trigger notifications through action groups.",
    "wrong_explanations": [
      "Budgets track spending.",
      "Policies enforce configuration; they do not notify on metrics.",
      null,
      "Locks do not monitor anything."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Azure%20Monitor%20alerts",
    "difficulty": 2,
    "reviewed": false
  },
  {
    "id": "mg-30",
    "domain_id": 3,
    "topic_id": "monitoring",
    "objective": "Describe Azure Monitor, including Log Analytics, Azure Monitor alerts, and Azure Monitor Application Insights",
    "question": "A developer wants to monitor a live web app's request rates, response times and exceptions. Which Azure Monitor feature helps?",
    "options": [
      "Azure File Sync",
      "Application Insights",
      "Azure Advisor",
      "Azure Arc"
    ],
    "correct_index": 1,
    "explanation": "Application Insights provides application performance monitoring.",
    "wrong_explanations": [
      "File Sync synchronises files.",
      null,
      "Advisor offers recommendations.",
      "Arc extends management."
    ],
    "learn_url": "https://learn.microsoft.com/en-us/search/?terms=Application%20Insights",
    "difficulty": 2,
    "reviewed": false
  }
];

// Formatted for existing Bento Grid QuizPage structure
export const quizQuestions = allSeedQuestions.map(q => ({
  id: q.id,
  domain_id: q.domain_id,
  topic_id: q.topic_id,
  domain: q.domain_id === 1 ? 'Cloud Concepts' : q.domain_id === 2 ? 'Azure Architecture & Services' : 'Azure Management & Governance',
  question: q.question,
  options: q.options,
  answerIndex: q.correct_index,
  explanation: q.explanation,
  wrong_explanations: q.wrong_explanations,
  learn_url: q.learn_url,
}));

export const flashcards = [
  {
    id: 'f1',
    domain: 'Cloud Concepts',
    box: 2,
    front: 'What does "CapEx" mean in cloud economics?',
    back: 'Capital Expenditure — upfront spending on physical infrastructure you own, like servers. It is a fixed, one-time cost, unlike OpEx which is ongoing usage-based spending.',
    next_review: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'f2',
    domain: 'Architecture & Services',
    box: 1,
    front: 'Difference between Azure Region and Availability Zone?',
    back: 'A Region is a geographic area with one or more datacenters. An Availability Zone is a distinct datacenter inside that region with independent power, cooling, and networking. Think: Nairobi = region, Westlands vs. Upper Hill = zones.',
    next_review: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'f3',
    domain: 'Management & Governance',
    box: 1,
    front: 'What is Azure Resource Manager (ARM)?',
    back: 'The deployment and management service for Azure. It uses a declarative template (ARM template / Bicep) to create, update, and delete resources consistently across your subscription.',
    next_review: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'f4',
    domain: 'Cloud Concepts',
    box: 3,
    front: 'Define the "shared responsibility" model.',
    back: 'Cloud providers and customers each own parts of security. The provider always handles the physical datacenter, network, and host. You always handle your data and accounts. The OS and app layer depends on the service model (IaaS vs PaaS vs SaaS).',
    next_review: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: 'f5',
    domain: 'Architecture & Services',
    box: 1,
    front: 'Which storage tier is best for backups stored for years?',
    back: 'Archive tier — provides lowest storage cost per GB but requires several hours for data rehydration.',
    next_review: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'f6',
    domain: 'Management & Governance',
    box: 2,
    front: 'What is the purpose of Azure Policy?',
    back: 'Enforces organizational standards and assesses compliance at scale (e.g. restricting deployments to specific regions).',
    next_review: new Date(Date.now() - 18000000).toISOString(),
  },
];

export const chatHistory = [
  {
    id: 'm1',
    role: 'user',
    text: 'Hey, can you explain Availability Zones? I keep confusing them with regions.',
    lang: 'English',
  },
  {
    id: 'm2',
    role: 'ai',
    text: "Sure! Think of it like M-Pesa agent shops in Nairobi. A region is the whole town. An Availability Zone is one specific shop building with its own power and network on a different street. If one shop closes for a blackout, the other shop stays open. In Azure, spreading apps across Availability Zones protects against datacenter failures.\n\nQuick check: What happens if you deploy all your VMs in a single zone and that zone fails?",
    lang: 'English',
  },
  {
    id: 'm3',
    role: 'user',
    text: 'Ah sawa. So Availability Zones inasaidia nini kwa Kiswahili?',
    lang: 'Kiswahili',
  },
  {
    id: 'm4',
    role: 'ai',
    text: "Availability Zone ni kituo kilichotengwa kimwili ndani ya Azure region chenye stima na mtandao wake huru.\n\nFikiria maduka mawili ya M-Pesa: moja likikosa mtandao, wateja wanaenda lingine mtaa wa pili bila biashara kusimama.\n\nKwenye Azure, ukiweka huduma zako kwenye Availability Zones tofauti, programu yako itaendelea kufanya kazi hata jengo moja likipata hitilafu.\n\nSwali la kujipima: Je, ukisambaza Virtual Machines kwenye zones tofauti unapata High Availability au Unarudisha gharama?",
    lang: 'Kiswahili',
  },
];

export const studyPlan = [
  { id: 's1', title: 'Storage accounts & redundancy options', minutes: 15, domain: 'Architecture & Services', done: false },
  { id: 's2', title: 'Review RBAC vs Azure Policy', minutes: 20, domain: 'Management & Governance', done: true },
  { id: 's3', title: 'Practice 10 questions on Cloud Concepts', minutes: 12, domain: 'Cloud Concepts', done: false },
];
