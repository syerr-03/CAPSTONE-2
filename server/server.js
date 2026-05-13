const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const beginnerContent = {
  whatIsDataScience: {
    module1: {
      moduleNumber: 1,
      moduleTitle: "Fundamentals",
      reading: {
        title: "Master the Basics: What is Data Science?",
        type: "Reading",
        url: "https://www.geeksforgeeks.org/data-science/data-science/"
      },
      video: {
        title: "Watch and Learn: What is Data Science? Overview",
        type: "Video",
        url: "https://www.youtube.com/watch?v=X3paOmcrTjQ"
      }
    },

    module2: {
      moduleNumber: 2,
      moduleTitle: "Programming Basics",
      reading: {
        title: "Core Concepts of Data Science",
        type: "Reading",
        url: "https://www.geeksforgeeks.org/data-science/data-science-tutorial/"
      },
      video: {
        title: "Data Science Concepts and Techniques",
        type: "Video",
        url: "https://www.youtube.com/watch?v=ua-CiDNNj30"
      }
    }
  },

  pythonForDataScience: {
    module1: {
      moduleNumber: 1,
      moduleTitle: "Python Basics",
      reading: {
        title: "Master the Basics: Introduction to Python for Data Science",
        type: "Reading",
        url: "https://www.geeksforgeeks.org/python-programming-language/",
        image: "/images/python-intro.png"
      },
      video: {
        title: "Watch and Learn: Python for Data Science Basics",
        type: "Video",
        url: "https://youtu.be/SUsfmh2BSbg?si=7KUoNlqd9UYZdNGq"
      }
    }
  }
};

app.get("/", (req, res) => {
  res.send("Beginner API is running. Use /api/beginner/:subject/:moduleNumber");
});

app.get("/api/beginner/:subject/:moduleNumber", (req, res) => {
  const { subject, moduleNumber } = req.params;

  const subjectData = beginnerContent[subject];

  if (!subjectData) {
    return res.status(404).json({ message: "Subject not found" });
  }

  const moduleData = subjectData[`module${moduleNumber}`];

  if (!moduleData) {
    return res.status(404).json({ message: "Module not found" });
  }

  res.json(moduleData);
});

app.listen(PORT, () => {
  console.log(`Beginner API running at http://localhost:${PORT}`);
});