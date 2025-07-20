# Civ Copilot

**Civ Copilot** is an AI strategy companion for *Sid Meier’s Civilization V*. Powered by LLM-driven insights, it is designed to make Civilization V more approachable for newcomers, more fun for casual players and seamless for veterans to dive back into. 

Civ Copilot helps players streamline their gameplay with two core features:

- **The Scholar's Table**: Personalized, optimal technology paths based on player game state and scenarios
- **The Hall of Leaders**: Instant, AI-generated strategies, counter-strategies, and victory types for every civilization
  
---

## Table of Contents

- [Features](#features)
  - [The Scholars Table](#the-scholars-table)
  - [The Hall of Leaders](#the-hall-of-leaders)
- [Technology Tree Problem and Solution Overview](#technology-tree-problem-and-solution-overview)
  - [Technology Path Optimization Algorithm](#technology-path-optimization-algorithm)
  - [Mathematical Model and Scheduling Theory](#mathematical-model-and-scheduling-theory)
- [Strategy Generation with RAG](#strategy-generation-with-rag)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [How to Run](#how-to-run)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### The Scholars Table

Plan your empire's research initiatives the smart way:

- Provide your current Civilization, in-game scenario, and previously researched technologies
- Get **three high-impact target technologies** tailored to your playstyle and current game
- Receive an **optimized path of prerequisite technologies** that prioritizes strategic value
- Say goodbye to spreadsheet micromanagement and hello to streamlined, AI-powered assisted planning

Ideal for:
- New players navigating the complex technology tree for the first time
- Casual players looking to reduce micromanagement and decision fatigue
- Veterans players who want a fast alternate strategic perspective 
---

### The Hall of Leaders

Quickly access critical information and expert-level advice for any Civilization:

- Civilizations are easily searchable by name
- Recommended primary and secondary victory types
- **AI-generated** general strategies and counter-strategies
- Unique units, buildings, and leader traits for **fast referencing**

Ideal for:
- New players learning about unique civilization bonuses and strengths
- Casual players looking for a quick refresher on civilization synergies
- Veterans players who required fast comparative analysis in multiplayer lobbies

---

## Technology Tree Problem and Solution Overview

Civilization V’s technology tree is a **Directed Acyclic Graph (DAG)** with prerequisite constraints. However, in-game technology selection:

- Only supports **one target** technology to be selected at a time
- **Randomly** queues a path of prerequisite technologies to reach the target
- The path **ignores** scenario-specific goals, science cost, and compound benefits

**Civ Copilot fixes this** by using a scheduling-inspired approximation algorithm to compute *near-optimal research sequences*, balancing value and science cost to ensure key prerequisite technologies are collected efficiently on the paths to the desired target technologies.

---

### Technology Path Optimization Algorithm

1. **Input Gathering**  
   User inputs:
   - The civilization that they are playing as
   - Game scenario (e.g., aiming for science, facing aggression, etc.)
   - Technologies that they have already researched in the technology tree

2. **Subgraph Construction**  
   Construct a subgraph $G$ of **unresearched** technologies in the player's current and next era.

3. **LLM-Based Weighting**  
   Prompt the LLM with:
   - Game scenario context
   - Player civilization
   - Unique civiliation bonuses

   It returns a weight $\in [0, 1]$ for each technology in $G$ based on **strategic importance**.

5. **Select Target Technologies**  
   Select the 3 highest weight technologies. These are the targets.

6. **Refined Graph $H$**  
   Build a subgraph of $G$ called $H$ that contains:
   - The 3 target technology nodes
   - All **unresearched ancestor** technology nodes (dependencies for the targets)

7. **Priority Calculation**  
   For each technology node $t \in H$ normalize both LLM weights and science costs using min-max normalization.

   Assign a **priority score** to each technology node $t \in H$:
   
   $$\text{Priority}(t) = \frac{\text{NormalizedWeight}(t)}{\text{NormalizedScienceCost}(t)}$$

9. **Priority-based Topological Sort**  
   Perform a **greedy topological sort** using the priority scores to create the optimal technology paths.

>  Civilization V is a compounding game. Researching low-cost, high-impact technologies early unlocks units and buildings that snowball momentum for a player. This heuristic ensures that these technologies are favored in the paths.

---

### Mathematical Model and Scheduling Theory

The problem is modelled as a **single-machine scheduling problem** with precedence constraints, a variant of a Mixed Integer Programming (MIP) problem. This model assumes **non-preemptive scheduling**, meaning once a technology (job) begins, it must run to completion before another can begin. This reflects the structure of the weighted completion time objective function, where preemption would never produce a lower objective value.

Each technology in the technology tree is treated as a job $j \in J$, with:

- $w_j$: Weight of job $j$ (strategic importance assigned by the LLM)
- $p_j$: Processing time of job $j$ (the science cost of the technology)
- $C_j$: Completion time of job $j$ (total cumulative science units consumed to finish job $j$)
- $P \subseteq J \times J$: Set of precedence constraints such that if $(i, j) \in P$, then job $i$ must complete before job $j$

#### Objective

Minimize total weighted completion time (in science units spent):

$$\min \sum_{j \in J} w_j \cdot C_j$$

Where:
- $C_j$ is the total science units spent up to and including the completion of job $j$
- This aims to complete **high-impact** technologies (high $w_j$) as early as possible

#### Constraints

1. **Precedence**
   
   $$C_i + p_j \le C_j \quad \forall (i, j) \in P$$
   
   This enforces that job $j$ cannot complete until after its prerequisites’ cumulative cost plus its own cost.

3. **Non-overlap (single-machine)**
   
   $$C_i + p_i \le C_j \quad \text{or} \quad C_j + p_j \le C_i \quad \forall i, j \in J \quad \text{s.t.} \quad i \neq j$$
   
   This enforces that research is sequential since one technology is scheduled at a time.
   
4. **Variable Domains**
   
   $$C_j \ge p_j \quad \forall j \in J$$
   
   $$w_j \in [0, 1] \quad \forall j \in J$$
   
   $$C_j, p_j \in Z^+ \quad \forall j \in J$$

> This problem is **NP-hard**. Civ Copilot implements a greedy approximation algorithm inspired by [Goemans & Hall, 1998](https://www.sciencedirect.com/science/article/pii/S0166218X98001437), generating practical, near-optimal research sequences in real time.

---

## Strategy Generation with RAG

Civ Copilot uses **Retrieval-Augmented Generation (RAG)** to reduce LLM hallucinations and generate reliable, context-aware strategy guidance rooted in real Civilization V game data.

### Retrieval

Civ Copilot queries a MongoDB knowledge base that stores structured Civilization V data, including:

- Unique units and buildings
- Unique leader bonuses
- Technology prerequisites

This ensures that the LLM is grounded in-game information and Civilization V statistics.

### Augmentation

The retrieved game data is formatted into a structured prompt that combines:

- A system prompt that defines the LLM's role and frames the task
- A user prompt containing the relevant retrieved game information

This step includes prompt engineering to ensure the LLM generates civilization specific, relevant strategies.

### Generation

The augmented prompt is passed to the LLM (Llama 3.1 8B Instruct via Fireworks.ai), which produces structured output including:

- A primary and secondary victory type recommendation
- Strategy and counter-strategy suggestions

All outputs are JSON-structured, validated, and persisted in MongoDB for reuse by the client interface.

> RAG is a framework that improves the output of large language models (LLMs) by referencing authoritative, external knowledge sources before generating a response, allowing for accurate and domain-specific results ([AWS: What is Retrieval-Augmented Generation?](https://www.sciencedirect.com/science/article/pii/S0166218X98001437)).

---

## Screenshots

### Homepage

<img width="1907" height="949" alt="Civ Copilot Screenshot - Main Homepage" src="https://github.com/user-attachments/assets/9c12e509-39ee-42f7-b9ae-31bfbaee2a7a" />

### The Scholars Table

#### User describing their in-game scenario and selecting Poland as their civilization.
<img width="1893" height="948" alt="Civ Copilot Screenshot - The Scholars Table 1" src="https://github.com/user-attachments/assets/fb75533d-9953-4a56-b591-cac9ef72f98b" />

#### User interactively selecting their researched technologies from the technology tree.
<img width="1894" height="950" alt="Civ Copilot Screenshot - The Scholars Table 2" src="https://github.com/user-attachments/assets/161476ee-edf7-4d1f-ba09-c059a56ec002" />

> Note that the user only needs to manually select **Astronomy**, **Scientific Theory**, **Industrialization**, and **Chemistry**. Civ Copilot will **automatically** select all prerequisite technologies for the user.

#### User receiving their tailored optimal technology paths and target technologies.
<img width="1893" height="950" alt="Civ Copilot Screenshot - The Scholars Table 3" src="https://github.com/user-attachments/assets/fe26ae2c-9897-4111-a68c-9625294bdaae" />

> Civ Copilot immediately identifies **Metallurgy** as the first target technology because it unlocks **Poland's unique unit**, the **Winged Hussar**, a powerful mid-game cavalry unit with a devastating military special ability. From there, it prioritizes **Flight** and **Ballistics** to support the player’s **military-focused** strategy.
>
> The path also deliberately advances through **Military Science** and **Rifling** before less relevant technologies like **Fertilizer**, ensuring high-impact military technologies are obtained as early as possible. This is a strong showcase of Civ Copilot tailoring research to both civilization-specific strengths and the player's in-game scenario.

### The Hall of Leaders

#### User browsing playable leaders and searching for the civilization Poland.
<img width="1907" height="948" alt="Civ Copilot Screenshot - The Hall of Leaders 1" src="https://github.com/user-attachments/assets/15cb9873-d35e-4d99-896a-3651011ec23b" />

#### User viewing Poland's strategic overview including the unique leader trait and recommended victory focuses.
<img width="1893" height="950" alt="Civ Copilot Screenshot - The Hall of Leaders 2" src="https://github.com/user-attachments/assets/5cfac57f-9643-4d20-b7ff-f4d93cd6a4fc" />

#### User viewing Poland's unique advantages and the bulk of the civilization's strategy and counter strategy.
<img width="1893" height="950" alt="Civ Copilot Screenshot - The Hall of Leaders 3" src="https://github.com/user-attachments/assets/49ab9707-9150-48c5-a6da-f3b2384e5d9d" />

---

## Tech Stack

- **Frontend**: React (TypeScript), Tailwind CSS, MUI, React Flow
- **Backend**: Node.js (JavaScript), Express.js
- **Database**: MongoDB
- **AI Integration**: OpenAI SDK with `accounts/fireworks/models/llama-v3p1-8b-instruct`
- **Visualization**: Interactive directed graph layout with `dagre` and React Flow
- **Containerization**: Docker and Docker Compose for orchestrating services

---

## How to Run

### Prerequisites

- [Docker & Docker Compose](https://docs.docker.com/compose/install/)
- A [Fireworks AI API key](https://fireworks.ai/models/fireworks/llama-v3p1-8b-instruct)
- A `.env` file in `/server` with the following variables:
```dotenv
MONGO_URI=mongodb://mongo:27017/civdb
FIREWORKS_API_KEY=your_fireworks_key
PORT=3000
```

### Quick Start Development Setup

1. Clone and navigate to the project:
```bash
git clone https://github.com/kuharski/civ-copilot.git
cd civ-copilot
```
2. Build and launch the stack (client, server, and MongoDB)
```bash
# client will be available at http://localhost:3001/
docker-compose up --build
```
3. Load game data into MongoDB (First Run Only)
```bash
# in a new terminal from the project root
cd server
docker exec -it <server-container-id> npm run ingest
```

---

## Contributing

Built as a solo personal project for fun, but if you're a fellow Civ enthusiast with ideas or improvements, pull requests are always welcome.

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

Built with ❤️, 🧠, 💻, and a serious case of “One more turn...”
