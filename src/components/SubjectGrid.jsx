import React from 'react';

const SubjectGrid = ({ onEnroll }) => {
  const subjects = [
    {
      id: 1,
      title: 'What is Data Science?',
      description: 'Understanding the basics of data science and its real-world applications.'
    },
    {
      id: 2,
      title: 'Python for Data Science',
      description: 'Learn Python syntax, libraries, and coding skills for data tasks.'
    },
    {
      id: 3,
      title: 'Statistics Fundamentals',
      description: 'Build strong foundations in probability and data analysis.'
    },
    {
      id: 4,
      title: 'Data Visualization',
      description: 'Present insights clearly using charts and dashboards.'
    },
    {
      id: 5,
      title: 'Machine Learning Basics',
      description: 'Understand models, training, prediction, and evaluation.'
    },
    {
      id: 6,
      title: 'Exploratory Data Analysis',
      description: 'Learn how to inspect and understand datasets before modeling.'
    }
  ];

  return (
    <div className="subjects-grid">
      {subjects.map((subject) => (
        <div className="subject-card" key={subject.id}>
          <div className="card-top"></div>

          <div className="card-body">
            <h3 className="card-title">{subject.title}</h3>
            <p className="card-description">{subject.description}</p>

            <button className="enroll-button" onClick={() => onEnroll(subject)}>
              Enroll
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubjectGrid;