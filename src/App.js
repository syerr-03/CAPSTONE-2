import React, { useMemo, useState } from 'react';
import './App.css';
import SubjectGrid from './components/SubjectGrid';
import QuizPage from './components/QuizPage';

function App() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activeContent, setActiveContent] = useState(null);
  const [completedItems, setCompletedItems] = useState({});
  const [practicalSubmission, setPracticalSubmission] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  const [quizScore, setQuizScore] = useState(null);
  const [practicalScore, setPracticalScore] = useState(null);
  const [adaptiveMessage, setAdaptiveMessage] = useState('');

  const handleEnroll = (subject) => {
    setSelectedSubject(subject);
    setActiveContent(null);
    setCompletedItems({});
    setPracticalSubmission('');
    setDifficultyLevel('Medium');
    setQuizScore(null);
    setPracticalScore(null);
    setAdaptiveMessage('');
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setActiveContent(null);
    setCompletedItems({});
    setPracticalSubmission('');
    setDifficultyLevel('Medium');
    setQuizScore(null);
    setPracticalScore(null);
    setAdaptiveMessage('');
  };

  const modules = useMemo(() => {
    if (!selectedSubject) return [];

    const title = selectedSubject.title;

    return [
      {
        id: 'module1',
        title: 'Module 1: Fundamentals',
        items: [
          {
            id: 'm1-reading',
            type: 'reading',
            title: `Reading: Introduction to ${title}`,
            label: 'Reading',
            content: {
              sections: [
                {
                  heading: `What is ${title}?`,
                  text: `${title} is an important topic in Data Science. It helps learners understand key concepts, foundations, and how this topic is applied in real-world scenarios.`
                },
                {
                  heading: 'Why it matters',
                  text: `Understanding ${title} helps students build confidence in solving data-related problems, making decisions from data, and preparing for more advanced modules.`
                },
                {
                  heading: 'Key takeaway',
                  text: `This lesson introduces the basic meaning, purpose, and practical value of ${title} in the learning journey.`
                }
              ]
            }
          },
          {
            id: 'm1-video',
            type: 'video',
            title: `Video: Learn ${title}`,
            label: 'Video',
            content: {
              duration: '8 min',
              description: `A short video-style lesson that explains the basic concepts of ${title} in a simple and visual way.`,
              points: [
                `Overview of ${title}`,
                'Main concepts explained simply',
                'Examples of how it is used in Data Science'
              ]
            }
          },
          {
            id: 'm1-quiz',
            type: 'quiz',
            title: 'Quiz: Test Your Knowledge',
            label: 'Quiz',
            content: {
              questions: [
                {
                  id: 'q1',
                  question: `What is the main purpose of learning ${title}?`,
                  options: [
                    'To ignore data completely',
                    'To understand important concepts and applications',
                    'To replace all programming languages',
                    'To avoid practical work'
                  ],
                  correctAnswer: 'To understand important concepts and applications',
                  explanation: `${title} helps learners understand core concepts and how they are applied in real-world Data Science tasks.`
                },
                {
                  id: 'q2',
                  question: `Which statement best describes ${title}?`,
                  options: [
                    'A random unrelated topic',
                    'A topic with no value in learning',
                    'A useful subject in the Data Science learning path',
                    'Only something for expert researchers'
                  ],
                  correctAnswer: 'A useful subject in the Data Science learning path',
                  explanation: `${title} is part of the learning path and supports foundational and applied knowledge in Data Science.`
                },
                {
                  id: 'q3',
                  question: `Why should students study ${title}?`,
                  options: [
                    'To strengthen their understanding and skills',
                    'Because it has no assessment',
                    'Only to memorize definitions',
                    'To skip later modules'
                  ],
                  correctAnswer: 'To strengthen their understanding and skills',
                  explanation: `Studying ${title} improves understanding, prepares learners for quizzes and practical tasks, and supports later modules.`
                }
              ]
            }
          },
          {
            id: 'm1-practical',
            type: 'practical',
            title: 'Practical Assignment: Basic Practice',
            label: 'Practical Assignment',
            content: {
              objective: `Apply basic understanding of ${title} in a simple practical task.`,
              tasks: [
                `Write 3 short points about what ${title} means.`,
                `Give 2 examples of how ${title} can be used in Data Science.`,
                `Write 1 short reflection about what you learned.`
              ]
            }
          }
        ]
      },
      {
        id: 'module2',
        title: 'Module 2: Core Concepts',
        items: [
          {
            id: 'm2-reading',
            type: 'reading',
            title: `Reading: Core Concepts of ${title}`,
            label: 'Reading',
            content: {
              sections: [
                {
                  heading: 'Core ideas',
                  text: `This lesson focuses on the deeper concepts behind ${title}, helping students connect theory with understanding.`
                },
                {
                  heading: 'Common use',
                  text: `${title} is commonly used in Data Science workflows to support analysis, interpretation, and decision-making.`
                },
                {
                  heading: 'Learning note',
                  text: `Students should be able to explain the concept, identify examples, and recognize its role in practice.`
                }
              ]
            }
          },
          {
            id: 'm2-video',
            type: 'video',
            title: `Video: Deep Dive into ${title}`,
            label: 'Video',
            content: {
              duration: '10 min',
              description: `A deeper lesson that explores the main ideas and use cases of ${title}.`,
              points: [
                'Key terms and meanings',
                'Examples and simple walkthrough',
                'How the concept supports real analysis'
              ]
            }
          },
          {
            id: 'm2-quiz',
            type: 'quiz',
            title: 'Quiz: Intermediate Checkpoint',
            label: 'Quiz',
            content: {
              questions: [
                {
                  id: 'q1',
                  question: 'What does this module mainly focus on?',
                  options: [
                    'Entertainment only',
                    'Core concepts and deeper understanding',
                    'Skipping theory completely',
                    'Only memorizing formulas'
                  ],
                  correctAnswer: 'Core concepts and deeper understanding',
                  explanation: `Module 2 is designed to strengthen deeper understanding of the topic's core concepts.`
                },
                {
                  id: 'q2',
                  question: 'A good learner outcome for this module is:',
                  options: [
                    'Being unable to explain the topic',
                    'Understanding how the concept is used',
                    'Ignoring practical examples',
                    'Avoiding quizzes'
                  ],
                  correctAnswer: 'Understanding how the concept is used',
                  explanation: `This module aims to help learners understand both the concept and its practical use.`
                },
                {
                  id: 'q3',
                  question: 'Why are examples important in this module?',
                  options: [
                    'They are not important',
                    'They help connect theory to practice',
                    'They reduce all learning',
                    'They replace all reading'
                  ],
                  correctAnswer: 'They help connect theory to practice',
                  explanation: `Examples make abstract concepts easier to understand and apply.`
                }
              ]
            }
          },
          {
            id: 'm2-practical',
            type: 'practical',
            title: 'Practical Assignment: Apply Core Skills',
            label: 'Practical Assignment',
            content: {
              objective: `Practice using the core ideas of ${title} in a simple applied task.`,
              tasks: [
                `Summarize 3 core concepts of ${title}.`,
                'Explain how one concept could be used in a real-world situation.',
                'Write a short conclusion from your learning.'
              ]
            }
          }
        ]
      },
      {
        id: 'module3',
        title: 'Module 3: Applied Learning',
        items: [
          {
            id: 'm3-reading',
            type: 'reading',
            title: `Reading: Real-World Uses of ${title}`,
            label: 'Reading',
            content: {
              sections: [
                {
                  heading: 'Industry use',
                  text: `${title} can be used in business, education, healthcare, and technology to improve data understanding and decision support.`
                },
                {
                  heading: 'Applied thinking',
                  text: `Learners should think about how this topic can support real projects and simple case studies.`
                },
                {
                  heading: 'Final takeaway',
                  text: `${title} is not only theoretical; it also supports practical and professional problem-solving.`
                }
              ]
            }
          },
          {
            id: 'm3-video',
            type: 'video',
            title: `Video: Case Study for ${title}`,
            label: 'Video',
            content: {
              duration: '12 min',
              description: `A simple case-study style lesson showing how ${title} can be applied in realistic situations.`,
              points: [
                'Scenario overview',
                'Problem and solution idea',
                'How the topic helps in practice'
              ]
            }
          },
          {
            id: 'm3-quiz',
            type: 'quiz',
            title: 'Quiz: Final Knowledge Test',
            label: 'Quiz',
            content: {
              questions: [
                {
                  id: 'q1',
                  question: `What is the best value of learning ${title} in an applied module?`,
                  options: [
                    'It helps in real-world understanding',
                    'It removes all need for thinking',
                    'It is only useful in theory',
                    'It has no practical value'
                  ],
                  correctAnswer: 'It helps in real-world understanding',
                  explanation: `Applied modules connect the topic to realistic use and help learners see its value beyond theory.`
                },
                {
                  id: 'q2',
                  question: `Case studies are useful because they:`,
                  options: [
                    'Confuse learners intentionally',
                    'Show how concepts work in realistic situations',
                    'Replace all assessments',
                    'Remove the need for examples'
                  ],
                  correctAnswer: 'Show how concepts work in realistic situations',
                  explanation: `Case studies help students understand how the topic appears in practical settings.`
                },
                {
                  id: 'q3',
                  question: `Which is a strong final learning outcome?`,
                  options: [
                    'Ignoring real applications',
                    'Applying knowledge to simple tasks',
                    'Skipping practical assignments',
                    'Avoiding revision'
                  ],
                  correctAnswer: 'Applying knowledge to simple tasks',
                  explanation: `A strong final outcome is being able to use the knowledge in simple practical tasks and scenarios.`
                }
              ]
            }
          },
          {
            id: 'm3-practical',
            type: 'practical',
            title: 'Practical Assignment: Final Mini Project',
            label: 'Practical Assignment',
            content: {
              objective: `Demonstrate what you learned about ${title} in a short mini project.`,
              tasks: [
                `Choose 1 real-world example related to ${title}.`,
                'Explain how the topic helps solve or understand that example.',
                'Write a short final reflection on your learning progress.'
              ]
            }
          }
        ]
      }
    ];
  }, [selectedSubject]);

  const totalItems = modules.reduce((sum, module) => sum + module.items.length, 0);
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = totalItems ? Math.round((completedCount / totalItems) * 100) : 0;

  const getAdaptiveMessage = (level) => {
    if (level === 'Easy') {
      return 'You may need more support. Review the reading and video before continuing to the next assessment.';
    }

    if (level === 'Medium') {
      return 'You are making steady progress. Continue with the next module at the standard level.';
    }

    return 'Excellent performance. You are ready for more advanced assessment content.';
  };

  const updateAdaptiveLevel = (newQuizScore, newPracticalScore) => {
    if (newQuizScore === null || newPracticalScore === null) return;

    const finalScore = (newQuizScore * 0.4) + (newPracticalScore * 0.6);

    let newLevel = 'Easy';
    if (finalScore >= 75) {
      newLevel = 'Hard';
    } else if (finalScore >= 50) {
      newLevel = 'Medium';
    }

    setDifficultyLevel(newLevel);
    setAdaptiveMessage(getAdaptiveMessage(newLevel));
  };

  const openContent = (item) => {
    setActiveContent(item);

    if (item.type !== 'practical') {
      setCompletedItems((prev) => ({
        ...prev,
        [item.id]: true
      }));
    }

    setPracticalSubmission('');
  };

  const goBackToModules = () => {
    setActiveContent(null);
    setPracticalSubmission('');
  };

  const handleQuizSubmit = (percent) => {
    setQuizScore(percent);
    setCompletedItems((prev) => ({
      ...prev,
      [activeContent.id]: true
    }));
    updateAdaptiveLevel(percent, practicalScore);
  };

  const handlePracticalSubmit = () => {
    let score = 0;

    if (practicalSubmission.trim().length > 20) score = 60;
    if (practicalSubmission.trim().length > 80) score = 80;
    if (practicalSubmission.trim().length > 150) score = 100;

    setPracticalScore(score);
    setCompletedItems((prev) => ({
      ...prev,
      [activeContent.id]: true
    }));

    updateAdaptiveLevel(quizScore, score);
  };

  const renderContentPage = () => {
    if (!activeContent) return null;

    if (activeContent.type === 'reading') {
      return (
        <div className="content-page">
          <button className="back-button" onClick={goBackToModules}>←</button>
          <h1 className="content-title">{activeContent.title}</h1>
          <div className="content-card">
            {activeContent.content.sections.map((section, index) => (
              <div key={index} className="reading-section">
                <h3>{section.heading}</h3>
                <p>{section.text}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeContent.type === 'video') {
      return (
        <div className="content-page">
          <button className="back-button" onClick={goBackToModules}>←</button>
          <h1 className="content-title">{activeContent.title}</h1>
          <div className="content-card">
            <div className="video-placeholder">Video Player Placeholder</div>
            <p className="video-description">{activeContent.content.description}</p>
            <p className="video-duration">Duration: {activeContent.content.duration}</p>
            <ul className="video-points">
              {activeContent.content.points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    if (activeContent.type === 'quiz') {
      return (
        <QuizPage
          title={activeContent.title}
          content={activeContent.content}
          onBack={goBackToModules}
          onSubmitQuiz={handleQuizSubmit}
          quizScore={quizScore}
          difficultyLevel={difficultyLevel}
          practicalScore={practicalScore}
        />
      );
    }

    if (activeContent.type === 'practical') {
      return (
        <div className="content-page">
          <button className="back-button" onClick={goBackToModules}>←</button>
          <h1 className="content-title">{activeContent.title}</h1>
          <div className="content-card">
            <h3>Objective</h3>
            <p>{activeContent.content.objective}</p>

            <h3>Tasks</h3>
            <ul className="assignment-list">
              {activeContent.content.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>

            <textarea
              className="assignment-textarea"
              placeholder="Write your short answer or reflection here..."
              value={practicalSubmission}
              onChange={(e) => setPracticalSubmission(e.target.value)}
            />

            <button className="primary-button" onClick={handlePracticalSubmit}>
              Submit Assignment
            </button>

            {practicalScore !== null && (
              <div className="adaptive-feedback-box">
                <h3>Adaptive Feedback</h3>
                <p className="result-line"><strong>Quiz Score:</strong> {quizScore}%</p>
                <p className="result-line"><strong>Practical Score:</strong> {practicalScore}%</p>
                <p className="result-line"><strong>Difficulty Level:</strong> {difficultyLevel}</p>
                <p className="adaptive-message">{adaptiveMessage}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };

  if (selectedSubject && activeContent) {
    return renderContentPage();
  }

  if (selectedSubject) {
    return (
      <div className="module-page">
        <button className="back-button" onClick={handleBackToSubjects}>
          ←
        </button>

        <h1 className="module-title">{selectedSubject.title}</h1>

        <div className="progress-header">
          <span>{progressPercent}% Completed</span>
          <span>Adaptive Level: {difficultyLevel}</span>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        {modules.map((module) => (
          <div className="module-card" key={module.id}>
            <h2 className="module-section-title">{module.title}</h2>

            {module.items.map((item) => (
              <div
                className="content-item clickable-item"
                key={item.id}
                onClick={() => openContent(item)}
              >
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.label}</p>
                </div>
                <span className={`status-badge ${completedItems[item.id] ? 'completed' : 'incomplete'}`}>
                  {completedItems[item.id] ? 'Completed' : 'Incomplete'}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="app">
      <section className="hero">
        <div className="hero-content">
          <h1 className="main-title">Adaptive Learning for Data Science</h1>
          <p className="hero-subtitle">
            Enhance your skills through personalized, adaptive learning modules.
          </p>
        </div>
      </section>

      <section className="subjects-section">
        <h2 className="section-title">Choose a Subject to Enroll</h2>
        <SubjectGrid onEnroll={handleEnroll} />
      </section>
    </div>
  );
}

export default App;