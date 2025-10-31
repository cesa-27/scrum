import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Aprende } from './components/Aprende';
import { Practica } from './components/Practica';
import { Recursos } from './components/Recursos';
import GlobalStudyTimer from './components/GlobalStudyTimer';


export default function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const [activeModule, setActiveModule] = useState('dashboard');
  
  // User progress state
  const [userProgress, setUserProgress] = useState({
    overallProgress: 45,
    averageScore: 87,
    studyTime: 12.5,
    medals: 5,
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'fundamentos-1',
    'scrum-1',
  ]);

  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([
    'quiz-roles',
  ]);

  // Load authentication state from localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('userProgress');
    const savedLessons = localStorage.getItem('completedLessons');
    const savedQuizzes = localStorage.getItem('completedQuizzes');

    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedLessons) {
      setCompletedLessons(JSON.parse(savedLessons));
    }
    if (savedQuizzes) {
      setCompletedQuizzes(JSON.parse(savedQuizzes));
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('userProgress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
  }, [completedQuizzes]);

  const handleCompleteLesson = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);
      
      // Update progress
      const totalLessons = 10; // Total number of lessons in the app
      const newProgress = Math.round((newCompletedLessons.length / totalLessons) * 100);
      setUserProgress(prev => ({
        ...prev,
        overallProgress: Math.min(newProgress, 100),
        studyTime: prev.studyTime + 0.3,
      }));
    }
  };

  const handleCompleteQuiz = (quizId: string, score: number) => {
    if (!completedQuizzes.includes(quizId)) {
      const newCompletedQuizzes = [...completedQuizzes, quizId];
      setCompletedQuizzes(newCompletedQuizzes);
      
      // Update progress
      const currentAverage = userProgress.averageScore;
      const newAverage = Math.round((currentAverage + score) / 2);
      
      setUserProgress(prev => ({
        ...prev,
        averageScore: newAverage,
        studyTime: prev.studyTime + 0.2,
      }));

      // Award medal if score is high
      if (score >= 90 && userProgress.medals < 12) {
        setUserProgress(prev => ({
          ...prev,
          medals: prev.medals + 1,
        }));
      }
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
    setActiveModule('dashboard'); // Reset to dashboard on logout
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      <Header 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        onLogout={handleLogout}
      />
      
      {activeModule === 'dashboard' && (
        <Dashboard 
          userProgress={userProgress}
          setActiveModule={setActiveModule}
        />
      )}
      
      {activeModule === 'aprende' && (
        <Aprende 
          completedLessons={completedLessons}
          onCompleteLesson={handleCompleteLesson}
        />
      )}
      
      {activeModule === 'practica' && (
        <Practica 
          completedQuizzes={completedQuizzes}
          onCompleteQuiz={handleCompleteQuiz}
        />
      )}
      
      {activeModule === 'recursos' && (
        <Recursos />
      )}
    </div>
  );
}
