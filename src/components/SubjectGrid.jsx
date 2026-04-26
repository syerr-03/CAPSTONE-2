import React from 'react';
import '../App.css'; 

const SubjectGrid = ({ onEnroll }) => {
  const subjects = [
    {
      id: 1,
      title: 'What is Data Science?',
      description: 'Understanding the basics of data science and its real-world applications.',
      icon: '📊'
    },
    {
      id: 2,
      title: 'Python for Data Science',
      description: 'Learn Python syntax, libraries, and coding skills for data tasks.',
      icon: '🐍'
    },
    {
      id: 3,
      title: 'Statistics Fundamentals',
      description: 'Build strong foundations in probability and data analysis.',
      icon: '📈'
    },
    {
      id: 4,
      title: 'Data Visualization',
      description: 'Present insights clearly using charts and dashboards.',
      icon: '🎨'
    },
    {
      id: 5,
      title: 'Machine Learning Basics',
      description: 'Understand models, training, prediction, and evaluation.',
      icon: '🤖'
    },
    {
      id: 6,
      title: 'Exploratory Data Analysis',
      description: 'Learn how to inspect and understand datasets before modeling.',
      icon: '🔍'
    }
  ];

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '25px', 
      padding: '20px' 
    }}>
      {subjects.map((subject) => (
        <div className="module-card" key={subject.id} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          transition: 'transform 0.2s',
          cursor: 'default'
        }}>
          <div>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{subject.icon}</div>
            <h3 className="section-title" style={{ marginBottom: '10px' }}>{subject.title}</h3>
            <p className="hero-subtitle" style={{ fontSize: '14px', textAlign: 'left', lineHeight: '1.5' }}>
              {subject.description}
            </p>
          </div>

          <button 
            className="hero-button" 
            style={{ width: '100%', marginTop: '20px', padding: '10px' }}
            onClick={() => onEnroll && onEnroll(subject)}
          >
            Enroll Now
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubjectGrid;