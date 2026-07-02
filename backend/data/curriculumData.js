const coursesSyllabus = [
  {
    name: "HTML",
    courseId: "html",
    difficulty: "Beginner",
    estimatedTime: "5 hours",
    image: "html-icon",
    chapters: [
      "Introduction to HTML", "HTML Editors", "HTML Elements", "HTML Attributes",
      "HTML Headings", "HTML Paragraphs", "HTML Formatting", "HTML Quotations",
      "HTML Comments", "HTML Colors", "HTML Links", "HTML Images", "HTML Tables",
      "HTML Lists", "HTML Forms", "Semantic HTML", "Audio & Video", "Canvas & SVG",
      "Accessibility", "HTML Best Practices"
    ]
  },
  {
    name: "CSS",
    courseId: "css",
    difficulty: "Beginner",
    estimatedTime: "6 hours",
    image: "css-icon",
    chapters: [
      "CSS Introduction", "CSS Syntax", "Selectors", "Colors", "Backgrounds",
      "Borders", "Margins", "Padding", "Box Model", "Flexbox", "CSS Grid",
      "Position", "Display", "Animations", "Transitions", "Media Queries",
      "Variables", "Responsive Design", "Tailwind Basics", "Advanced CSS"
    ]
  },
  {
    name: "JavaScript",
    courseId: "javascript",
    difficulty: "Intermediate",
    estimatedTime: "8 hours",
    image: "js-icon",
    chapters: [
      "Introduction", "Variables", "Data Types", "Operators", "Conditions",
      "Loops", "Functions", "Arrays", "Objects", "Strings", "DOM", "Events",
      "ES6 Features", "Promises", "Async Await", "Fetch API", "JSON", "Modules",
      "Error Handling", "Advanced JavaScript"
    ]
  },
  {
    name: "React.js",
    courseId: "react",
    difficulty: "Intermediate",
    estimatedTime: "10 hours",
    image: "react-icon",
    chapters: [
      "Introduction", "JSX", "Components", "Props", "State", "Events",
      "Conditional Rendering", "Lists & Keys", "Forms", "useState", "useEffect",
      "useContext", "React Router", "API Integration", "Custom Hooks",
      "Performance Optimization", "Authentication", "Project Structure",
      "Deployment", "Advanced React"
    ]
  },
  {
    name: "Node.js",
    courseId: "node",
    difficulty: "Intermediate",
    estimatedTime: "6 hours",
    image: "node-icon",
    chapters: [
      "Node Introduction", "Event Loop", "NPM package manager", "File System modules",
      "Paths & directories", "Streams & Buffer", "Events emitter", "HTTP Web Servers",
      "Processes & OS", "Child Processes", "Package json configuration",
      "File Uploading dispatches", "Command line utilities", "Scaling Node servers",
      "Node security policies"
    ]
  },
  {
    name: "Express.js",
    courseId: "express",
    difficulty: "Intermediate",
    estimatedTime: "6 hours",
    image: "express-icon",
    chapters: [
      "Express Introduction", "Express Routing", "Middleware Pipeline",
      "Express Request object", "Express Response object", "Serving Static assets",
      "Template engines", "Error handling middleware", "RESTful APIs controllers",
      "CORS configurations", "Form parsers", "Session storage cookies",
      "JWT authorizations", "Express file uploaders", "Production scale checklist"
    ]
  },
  {
    name: "MongoDB",
    courseId: "mongodb",
    difficulty: "Intermediate",
    estimatedTime: "6 hours",
    image: "mongodb-icon",
    chapters: [
      "MongoDB Introduction", "Collections & Documents BSON", "Document insertions",
      "Find queries & filters", "Updating documents", "Document deletions",
      "Schema validations", "Indexes & search speeds", "Aggregations overview",
      "Aggregations match & group", "Aggregations sort & project",
      "Lookup join relationships", "MongoDB Atlas cloud config",
      "Mongoose ODM adapters", "Data modeling design patterns"
    ]
  },
  {
    name: "MERN Stack",
    courseId: "mern",
    difficulty: "Advanced",
    estimatedTime: "12 hours",
    image: "mern-icon",
    chapters: [
      "Fullstack Architecture", "Configuring REST APIs", "Database connections Mongoose",
      "JWT stateful vs stateless", "Cors rules configurations", "Axios client setups",
      "State wrappers Contexts", "Components layouts folders", "Protected router systems",
      "Validations forms client", "Nodemailer email dispatches", "Leaderboard rank aggregations",
      "Admin stats collections", "Building release bundles", "Scalable cloud deployments"
    ]
  },
  {
    name: "Python",
    courseId: "python",
    difficulty: "Beginner",
    estimatedTime: "6 hours",
    image: "python-icon",
    chapters: [
      "Python Introduction", "Variables & Scopes", "Primitive data types",
      "Decision controls if-else", "Looping statements while-for",
      "Functions & return statements", "Lists & nested arrays", "Tuples & sets",
      "Dictionaries key-value", "List comprehensions syntax", "String parsing algorithms",
      "Object oriented classes", "Class inheritance parameters", "File inputs outputs",
      "Exception handling try-except", "Pip package managers", "Regular expressions re",
      "Virtual environments venv", "Standard libraries overview", "Python best practices"
    ]
  },
  {
    name: "Java",
    courseId: "java",
    difficulty: "Intermediate",
    estimatedTime: "7 hours",
    image: "java-icon",
    chapters: [
      "Java Introduction", "JVM, JRE and JDK", "Variables & types",
      "Operations & evaluations", "Conditionals if-switch", "Loops while-for",
      "Classes & objects", "Method signatures", "Access modifiers private-public",
      "Inheritance extends keyword", "Polymorphism overrides method",
      "Abstract classes interfaces", "ArrayList & collections", "HashMap key-value maps",
      "Exceptions try-catch", "File writing file reader", "Threading & runnables",
      "Generics type checking", "Garbage collection memory", "Java best coding guidelines"
    ]
  },
  {
    name: "SQL",
    courseId: "sql",
    difficulty: "Beginner",
    estimatedTime: "4 hours",
    image: "sql-icon",
    chapters: [
      "SQL Introduction", "Relational tables setup", "Select queries columns",
      "Where conditional filters", "And Or Not logic operators",
      "Ordering results order-by", "Group by aggregations", "Count Sum Avg functions",
      "Having filter conditions", "Inner Joins table links", "Left Joins table links",
      "Right Joins table links", "Full Joins table links", "Subqueries nesting",
      "Union operator unions", "Insert statements rows", "Update statement edits",
      "Delete statements rows", "Primary & Foreign keys", "Database indexing views"
    ]
  },
  {
    name: "Data Analyst",
    courseId: "data-analyst",
    difficulty: "Beginner",
    estimatedTime: "6 hours",
    image: "data-analyst-icon",
    chapters: [
      "Data Analysis introduction", "Python Pandas tables", "Loading CSV SQL sheets",
      "Cleaning missing rows NaN", "Data filtering queries",
      "Columns groupings aggregation", "Numpy arrays vectors",
      "Matplotlib visual charts", "Chart styling colors legends",
      "Seaborn charts templates", "Statistics basics mean-median",
      "Standard deviations variance", "Correlation charts trends",
      "Feature engineering scales", "Time series parsing dates",
      "Data cleaning duplicate rows", "Merging joining tables",
      "Pivot tables index summarization", "Jupyter notebooks markdown",
      "Business reporting metrics"
    ]
  },
  {
    name: "Git",
    courseId: "git",
    difficulty: "Beginner",
    estimatedTime: "3 hours",
    image: "git-icon",
    chapters: [
      "Git Version control intro", "Repository initiation git-init",
      "Staging changes git-add", "Commiting logs git-commit", "Stash alterations git-stash",
      "Log inspect git-log", "Local branch creation git-branch", "Merging branches git-merge",
      "Resolve merges conflicts", "Revert history commits git-revert",
      "Rebase branches git-rebase", "Ignoring logs .gitignore", "Clone repositories git-clone",
      "Pulling logs git-pull", "Git command line configurations"
    ]
  },
  {
    name: "GitHub",
    courseId: "github",
    difficulty: "Beginner",
    estimatedTime: "3 hours",
    image: "github-icon",
    chapters: [
      "GitHub Cloud hosting intro", "Remotes configurations git-remote",
      "Pushing branches git-push", "Pull requests pull-requests", "Repository forks forks",
      "Actions pipelines triggers", "GitHub pages hostings", "Issues check lists bugs",
      "Code reviews comments", "Branch protection constraints",
      "Organization permissions config", "Wikis documentations",
      "Releases version tag markings", "SSH security authorizations",
      "Collaboration team flows"
    ]
  },
  {
    name: "Aptitude",
    courseId: "aptitude",
    difficulty: "Beginner",
    estimatedTime: "5 hours",
    image: "aptitude-icon",
    chapters: [
      "Quantitative Aptitude intro", "Numbers & arithmetic sequences",
      "Percentages calculation ratios", "Profit and loss margins",
      "Simple and Compound interest", "Time and work assignments",
      "Distance speed calculations", "Averages & statistical ratios",
      "Ratio and proportion math", "Permutations calculations",
      "Combinations selection math", "Probability calculations",
      "Logical reasoning syllogisms", "Series completions sequences",
      "Placement test prep checklist"
    ]
  }
];

// Helper to generate 25 questions per chapter
const generateQuestionsForChapter = (courseId, chapterIndex, chapterTitle) => {
  const qs = [];
  
  for (let i = 0; i < 25; i++) {
    // Alternate question types
    let type = 'MCQ';
    if (i % 5 === 0) type = 'True/False';
    else if (i % 5 === 1) type = 'Code Output';
    else if (i % 5 === 2) type = 'Fill in the Blank';
    else if (i % 5 === 3) type = 'Interview Question';
    else type = 'Practical Scenario';

    const difficulty = i % 3 === 0 ? 'Easy' : (i % 3 === 1 ? 'Medium' : 'Hard');
    const tag = i % 2 === 0 ? 'Practice' : 'Interview';

    let questionText = ``;
    let options = [];
    let correctAnswer = 0;
    let explanation = ``;

    if (type === 'True/False') {
      questionText = `Is it true that in ${courseId.toUpperCase()} syllabus, ${chapterTitle} operates under blocking single-threaded structures by standard specification default?`;
      options = ["True", "False", "Not Applicable", "Depends on platform"];
      correctAnswer = 1; // False
      explanation = `By standard specifications, modern execution frameworks for ${chapterTitle} support asynchronous event loops, making this statement False.`;
    } else if (type === 'Code Output') {
      questionText = `Analyze the code block below:
\`\`\`
// Testing ${chapterTitle}
let outcomeVal = 10;
const testFunc = () => {
  let outcomeVal = 20;
  return outcomeVal;
};
console.log(testFunc() + outcomeVal);
\`\`\`
What is the console output?`;
      options = ["30", "40", "20", "ReferenceError"];
      correctAnswer = 0; // 30 (20 + 10)
      explanation = `Within the testFunc scope, outcomeVal is reassigned to 20. The external console log sums the scoped return (20) and the global scope variable (10), printing 30.`;
    } else if (type === 'Fill in the Blank') {
      questionText = `In ${courseId.toUpperCase()} design parameters, which reserved keyword is utilized to define standard structural modifiers inside ${chapterTitle}?`;
      options = ["import", "default", "const", "extends"];
      correctAnswer = 2; // const
      explanation = `The const keyword establishes block-scoped reference parameters, which is the recommended default declaration standard.`;
    } else if (type === 'Interview Question') {
      questionText = `How would you explain the core execution lifecycle loop of ${chapterTitle} during a technical screening interview?`;
      options = [
        "It blocks the central execution thread until calculations conclude.",
        "It cycles through asynchronous event handlers using microtask queues.",
        "It delegates state storage completely to structural models.",
        "It re-compiles the entire page stylesheet on every action tick."
      ];
      correctAnswer = 1;
      explanation = `Mastering event loops and microtask execution is a critical interview highlight. Option B correctly identifies asynchronous queue cycling.`;
    } else {
      // Practical Scenario
      questionText = `Imagine you are building a production-grade application and encounter high concurrency requirements under ${chapterTitle}. How should you scale it?`;
      options = [
        "Increase standard thread bounds using custom multi-threaded scripts",
        "Deploy cluster nodes to share process memory load balances",
        "Block all concurrent read inputs until database tables refresh",
        "Revert database storage engines to simple text documents"
      ];
      correctAnswer = 1;
      explanation = `Clustering nodes to divide request payloads represents standard industry practice for scaling high concurrency systems.`;
    }

    qs.push({
      questionText,
      options,
      correctAnswer,
      explanation,
      difficulty,
      tag,
      marks: 10,
      topicName: `${chapterTitle} Exam`
    });
  }
  return qs;
};

// Helper to generate Note contents per chapter
const generateNoteForChapter = (courseName, chapterTitle, chapterIndex) => {
  const codeExamples = {
    html: `<!-- HTML Example: ${chapterTitle} -->
<div class="card">
  <h2>Learning ${chapterTitle}</h2>
  <p>HTML elements represent the document layout skeleton.</p>
  <button onclick="alert('Hello from HTML!')">Click Me</button>
</div>`,
    css: `/* CSS Example: ${chapterTitle} */
.layout-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-radius: 12px;
}`,
    javascript: `// JavaScript Example: ${chapterTitle}
const processData = (items) => {
  console.log("Analyzing syllabus notes...");
  return items.map(item => \`Chapter Item: \${item}\`);
};
console.log(processData(["HTML", "CSS", "JS"]));`,
    react: `// React Example: ${chapterTitle}
import React, { useState } from 'react';

export default function App() {
  const [active, setActive] = useState(false);
  return (
    <button 
      onClick={() => setActive(!active)}
      style={{ background: active ? '#10b981' : '#6366f1', color: 'white' }}
    >
      Status: {active ? 'Completed' : 'Study'}
    </button>
  );
}`
  };

  const codeEx = codeExamples[courseName.toLowerCase()] || `// Dynamic template code for ${courseName} - ${chapterTitle}
const runTest = () => {
  return "Successfully executed ${chapterTitle} script";
};
console.log(runTest());`;

  return {
    title: chapterTitle,
    chapterNumber: chapterIndex + 1,
    definition: `${chapterTitle} defines the core design specifications and structural implementation parameters for the ${courseName} curriculum path.`,
    explanation: `Understanding ${chapterTitle} is critical. Developers leverage these paradigms to compile responsive components, write efficient operations, and secure user states. We explore the architectural lifecycles, execution rules, and practical layouts.`,
    syntax: `${courseName.toLowerCase() === 'html' ? `<tagname attribute="value">Content</tagname>` : `const ${chapterTitle.toLowerCase().replace(/[^a-z]/g, '')} = (args) => { ... };`}`,
    codeExample: codeEx,
    output: `Successfully executed ${chapterTitle} script`,
    realWorldExample: `Used in standard landing pages, product checkouts, and student directories to manage layout properties.`,
    importantPoints: [
      `Declared using standard naming specifications.`,
      `Always check compiler debug outputs during testing.`
    ],
    tips: [
      `Avoid declaring variables globally to prevent scope leakage.`,
      `Always keep components modular and highly reusable.`
    ],
    summary: `In this chapter, we studied the baseline specifications of ${chapterTitle}, setting up sandboxes and reviewing common layout syntax.`,
    interviewQuestions: [
      {
        question: `What is the primary architectural purpose of ${chapterTitle}?`,
        answer: `It encapsulates logic behaviors and handles rendering ticks inside modern browser engines.`
      },
      {
        question: `Describe a common scaling pitfall associated with ${chapterTitle}.`,
        answer: `Scope leakage and blocking concurrent event runs represent standard bottlenecks.`
      }
    ]
  };
};

// Expose compiled rich courses list
const getGeneratedCourses = () => {
  return coursesSyllabus.map((course) => {
    const chapters = course.chapters.map((title, idx) => {
      const note = generateNoteForChapter(course.name, title, idx);
      const questions = generateQuestionsForChapter(course.courseId, idx, title);
      return {
        ...note,
        questions
      };
    });

    return {
      name: course.name,
      courseId: course.courseId,
      description: `Master modern ${course.name} syllabus through W3Schools style chapters, copyable playground blocks, and 25 questions quiz evaluations.`,
      difficulty: course.difficulty,
      estimatedTime: course.estimatedTime,
      image: course.image,
      chapters
    };
  });
};

module.exports = {
  coursesSyllabus,
  getGeneratedCourses
};
