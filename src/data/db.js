const chats = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    title: "Learn JavaScript",
    messages: [
      {
        id: "7c9e6679-7425-40de-944b-e07fc1f90ae7",
        sender: "user",
        text: "What is JavaScript?"
      },
      {
        id: "16fd2706-8baf-433b-82eb-8c7fada847da",
        sender: "ai",
        text: "JavaScript is a programming language used to make websites interactive."
      },
      {
        id: "26fd2706-8baf-433b-82eb-8c7fada847db",
        sender: "user",
        text: "Is JavaScript easy to learn?"
      },
      {
        id: "36fd2706-8baf-433b-82eb-8c7fada847dc",
        sender: "ai",
        text: "Yes, JavaScript is beginner-friendly if you learn the basics step by step."
      },
      {
        id: "46fd2706-8baf-433b-82eb-8c7fada847dd",
        sender: "user",
        text: "What should I learn first?"
      },
      {
        id: "56fd2706-8baf-433b-82eb-8c7fada847de",
        sender: "ai",
        text: "Start with variables, data types, operators, conditions, loops, and functions."
      }
    ]
  },

  {
    id: "6ba7b810-9dad-41d1-80b4-00c04fd430c8",
    title: "Learn React",
    messages: [
      {
        id: "b3b0c442-98fc-4a8f-8f2c-2c1c8e7b9f31",
        sender: "user",
        text: "What is React?"
      },
      {
        id: "9f8c7d6e-5b4a-4321-9876-123456789abc",
        sender: "ai",
        text: "React is a JavaScript library for building user interfaces."
      },
      {
        id: "a1b2c3d4-e5f6-4789-8012-345678901234",
        sender: "user",
        text: "What is a component?"
      },
      {
        id: "b2c3d4e5-f6a7-4890-8123-456789012345",
        sender: "ai",
        text: "A component is a reusable piece of UI in a React application."
      },
      {
        id: "c3d4e5f6-a7b8-4901-8234-567890123456",
        sender: "user",
        text: "What is JSX?"
      },
      {
        id: "d4e5f6a7-b8c9-4012-8345-678901234567",
        sender: "ai",
        text: "JSX allows you to write HTML-like syntax inside JavaScript."
      }
    ]
  },

  {
    id: "1b2e3d4c-5f6a-4789-8abc-def012345678",
    title: "Python Basics",
    messages: [
      {
        id: "2c3d4e5f-6a7b-4890-abcd-ef1234567890",
        sender: "user",
        text: "What is Python?"
      },
      {
        id: "3d4e5f6a-7b8c-4901-bcde-f23456789012",
        sender: "ai",
        text: "Python is a popular programming language known for its simple syntax."
      },
      {
        id: "4e5f6a7b-8c9d-4012-def3-456789012345",
        sender: "user",
        text: "What is a variable in Python?"
      },
      {
        id: "5f6a7b8c-9d0e-4123-ef45-678901234567",
        sender: "ai",
        text: "A variable stores a value that can be used later in a program."
      },
      {
        id: "6a7b8c9d-0e1f-4234-f567-890123456789",
        sender: "user",
        text: "How do I print something?"
      },
      {
        id: "7b8c9d0e-1f2a-4345-6789-012345678901",
        sender: "ai",
        text: "You can use the print() function, such as print('Hello World')."
      }
    ]
  },

  {
    id: "8c9d0e1f-2a3b-4456-7890-123456789012",
    title: "HTML Basics",
    messages: [
      {
        id: "9d0e1f2a-3b4c-4567-8901-234567890123",
        sender: "user",
        text: "What is HTML?"
      },
      {
        id: "0e1f2a3b-4c5d-4678-9012-345678901234",
        sender: "ai",
        text: "HTML is used to create the structure of web pages."
      },
      {
        id: "1f2a3b4c-5d6e-4789-0123-456789012345",
        sender: "user",
        text: "What is a heading?"
      },
      {
        id: "2a3b4c5d-6e7f-4890-1234-567890123456",
        sender: "ai",
        text: "A heading is created using HTML tags such as h1, h2, and h3."
      },
      {
        id: "3b4c5d6e-7f8a-4901-2345-678901234567",
        sender: "user",
        text: "How do I create a button?"
      },
      {
        id: "4c5d6e7f-8a9b-4012-3456-789012345678",
        sender: "ai",
        text: "You can create a button using the button element."
      }
    ]
  },

  {
    id: "5d6e7f8a-9b0c-4123-4567-890123456789",
    title: "CSS Learning",
    messages: [
      {
        id: "6e7f8a9b-0c1d-4234-5678-901234567890",
        sender: "user",
        text: "What is CSS?"
      },
      {
        id: "7f8a9b0c-1d2e-4345-6789-012345678901",
        sender: "ai",
        text: "CSS is used to style and design web pages."
      },
      {
        id: "8a9b0c1d-2e3f-4456-7890-123456789012",
        sender: "user",
        text: "How do I change text color?"
      },
      {
        id: "9b0c1d2e-3f4a-4567-8901-234567890123",
        sender: "ai",
        text: "Use the color property, for example color: red."
      },
      {
        id: "0c1d2e3f-4a5b-4678-9012-345678901234",
        sender: "user",
        text: "How do I add a background?"
      },
      {
        id: "1d2e3f4a-5b6c-4789-0123-456789012345",
        sender: "ai",
        text: "Use the background-color property to add a background color."
      }
    ]
  },

  {
    id: "2e3f4a5b-6c7d-4890-1234-567890123456",
    title: "Node.js",
    messages: [
      {
        id: "3f4a5b6c-7d8e-4901-2345-678901234567",
        sender: "user",
        text: "What is Node.js?"
      },
      {
        id: "4a5b6c7d-8e9f-4012-3456-789012345678",
        sender: "ai",
        text: "Node.js allows JavaScript to run outside the browser."
      },
      {
        id: "5a6b7c8d-9e0f-4123-4567-890123456789",
        sender: "user",
        text: "Can Node.js create a server?"
      },
      {
        id: "6b7c8d9e-0f1a-4234-5678-901234567890",
        sender: "ai",
        text: "Yes, Node.js can be used to create backend servers and APIs."
      },
      {
        id: "7c8d9e0f-1a2b-4345-6789-012345678901",
        sender: "user",
        text: "What is npm?"
      },
      {
        id: "8d9e0f1a-2b3c-4456-7890-123456789012",
        sender: "ai",
        text: "npm is a package manager used to install and manage JavaScript packages."
      }
    ]
  },

  {
    id: "9e0f1a2b-3c4d-4567-8901-234567890123",
    title: "Web Development",
    messages: [
      {
        id: "0f1a2b3c-4d5e-4678-9012-345678901234",
        sender: "user",
        text: "What is web development?"
      },
      {
        id: "1a2b3c4d-5e6f-4789-0123-456789012345",
        sender: "ai",
        text: "Web development is the process of creating websites and web applications."
      },
      {
        id: "2b3c4d5e-6f7a-4890-1234-567890123456",
        sender: "user",
        text: "What is frontend development?"
      },
      {
        id: "3c4d5e6f-7a8b-4901-2345-678901234567",
        sender: "ai",
        text: "Frontend development focuses on the part of a website that users see and interact with."
      },
      {
        id: "4d5e6f7a-8b9c-4012-3456-789012345678",
        sender: "user",
        text: "What is backend development?"
      },
      {
        id: "5e6f7a8b-9c0d-4123-4567-890123456789",
        sender: "ai",
        text: "Backend development handles servers, databases, APIs, and application logic."
      }
    ]
  },

  {
    id: "6f7a8b9c-0d1e-4234-5678-901234567890",
    title: "Programming Help",
    messages: [
      {
        id: "7a8b9c0d-1e2f-4345-6789-012345678901",
        sender: "user",
        text: "How do I learn programming?"
      },
      {
        id: "8b9c0d1e-2f3a-4456-7890-123456789012",
        sender: "ai",
        text: "Start with one programming language and practice its fundamentals."
      },
      {
        id: "9c0d1e2f-3a4b-4567-8901-234567890123",
        sender: "user",
        text: "How much should I practice?"
      },
      {
        id: "0d1e2f3a-4b5c-4678-9012-345678901234",
        sender: "ai",
        text: "Try to practice consistently every day, even if it is only for one hour."
      },
      {
        id: "1e2f3a4b-5c6d-4789-0123-456789012345",
        sender: "user",
        text: "Should I build projects?"
      },
      {
        id: "2f3a4b5c-6d7e-4890-1234-567890123456",
        sender: "ai",
        text: "Yes, projects help you apply programming concepts and improve problem-solving skills."
      }
    ]
  },

  {
    id: "3a4b5c6d-7e8f-4901-2345-678901234567",
    title: "Git and GitHub",
    messages: [
      {
        id: "4b5c6d7e-8f9a-4012-3456-789012345678",
        sender: "user",
        text: "What is Git?"
      },
      {
        id: "5c6d7e8f-9a0b-4123-4567-890123456789",
        sender: "ai",
        text: "Git is a version control system used to track changes in code."
      },
      {
        id: "6d7e8f9a-0b1c-4234-5678-901234567890",
        sender: "user",
        text: "What is GitHub?"
      },
      {
        id: "7e8f9a0b-1c2d-4345-6789-012345678901",
        sender: "ai",
        text: "GitHub is a platform where developers can store and collaborate on Git repositories."
      },
      {
        id: "8f9a0b1c-2d3e-4456-7890-123456789012",
        sender: "user",
        text: "What is a commit?"
      },
      {
        id: "9a0b1c2d-3e4f-4567-8901-234567890123",
        sender: "ai",
        text: "A commit is a saved snapshot of changes in a Git repository."
      }
    ]
  },

  {
    id: "4b5c6d7e-8f9a-4012-3456-789012345678",
    title: "React Hooks",
    messages: [
      {
        id: "5c6d7e8f-9a0b-4123-4567-890123456789",
        sender: "user",
        text: "What is useState?"
      },
      {
        id: "6d7e8f9a-0b1c-4234-5678-901234567890",
        sender: "ai",
        text: "useState is a React Hook used to store and update data in a component."
      },
      {
        id: "7e8f9a0b-1c2d-4345-6789-012345678901",
        sender: "user",
        text: "What is useEffect?"
      },
      {
        id: "8f9a0b1c-2d3e-4456-7890-123456789012",
        sender: "ai",
        text: "useEffect is used to perform side effects such as fetching data or running code after rendering."
      },
      {
        id: "9a0b1c2d-3e4f-4567-8901-234567890123",
        sender: "user",
        text: "What is useRef?"
      },
      {
        id: "0b1c2d3e-4f5a-4678-9012-345678901234",
        sender: "ai",
        text: "useRef is used to store a value without causing a component to re-render."
      }
    ]
  }
];

export default chats;