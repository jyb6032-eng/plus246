/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StudentData } from './types';
import { DataService } from './services/dataService';
import { StudentLogin } from './components/student/StudentLogin';
import { TeacherLogin } from './components/teacher/TeacherLogin';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { WorldMap } from './components/student/WorldMap';
import { MathStagePlay } from './components/student/MathStagePlay';
import { CharacterCreationModal } from './components/character/CharacterCreationModal';

type AppView = 'student_login' | 'teacher_login' | 'teacher_dashboard' | 'world_map' | 'stage_play';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('student_login');
  const [currentStudent, setCurrentStudent] = useState<StudentData | null>(null);
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [showInitialCharacterSetup, setShowInitialCharacterSetup] = useState<boolean>(false);

  // Initialize seed data if empty
  useEffect(() => {
    DataService.seedDemoDataIfEmpty();
  }, []);

  // Student Login Success
  const handleStudentLogin = (student: StudentData) => {
    setCurrentStudent(student);
    // If nickname is default or empty, trigger initial character setup
    if (!student.character.nickname || student.character.inventory.length === 0) {
      setShowInitialCharacterSetup(true);
    } else {
      setShowInitialCharacterSetup(false);
    }
    setCurrentView('world_map');
  };

  // Student selects a stage to play
  const handleSelectStage = (stageId: number) => {
    setActiveStageId(stageId);
    setCurrentView('stage_play');
  };

  // Return to world map
  const handleBackToMap = () => {
    if (currentStudent) {
      // Re-fetch latest student data from service
      const updated = DataService.getStudentData(currentStudent.account.id);
      if (updated) setCurrentStudent(updated);
    }
    setCurrentView('world_map');
  };

  // Student Logout
  const handleStudentLogout = () => {
    setCurrentStudent(null);
    setCurrentView('student_login');
  };

  // Teacher Logout
  const handleTeacherLogout = () => {
    setCurrentView('student_login');
  };

  return (
    <div className="min-h-screen font-sans bg-slate-100 text-slate-900 antialiased">
      {/* 1. Student Login View */}
      {currentView === 'student_login' && (
        <StudentLogin
          onLoginSuccess={handleStudentLogin}
          onSwitchToTeacher={() => setCurrentView('teacher_login')}
        />
      )}

      {/* 2. Teacher Login View */}
      {currentView === 'teacher_login' && (
        <TeacherLogin
          onLoginSuccess={() => setCurrentView('teacher_dashboard')}
          onBackToStudent={() => setCurrentView('student_login')}
        />
      )}

      {/* 3. Teacher Dashboard View */}
      {currentView === 'teacher_dashboard' && (
        <TeacherDashboard
          onLogout={handleTeacherLogout}
          onSwitchToStudentView={() => setCurrentView('student_login')}
        />
      )}

      {/* 4. Student World Map View */}
      {currentView === 'world_map' && currentStudent && (
        <>
          <WorldMap
            student={currentStudent}
            onSelectStage={handleSelectStage}
            onLogout={handleStudentLogout}
            onUpdateStudent={(updated) => setCurrentStudent(updated)}
          />

          {showInitialCharacterSetup && (
            <CharacterCreationModal
              student={currentStudent}
              isInitialSetup={true}
              onComplete={(updated) => {
                setCurrentStudent(updated);
                setShowInitialCharacterSetup(false);
              }}
            />
          )}
        </>
      )}

      {/* 5. Student Math Stage Gameplay View */}
      {currentView === 'stage_play' && currentStudent && (
        <MathStagePlay
          student={currentStudent}
          stageId={activeStageId}
          onBackToMap={handleBackToMap}
          onUpdateStudent={(updated) => setCurrentStudent(updated)}
        />
      )}
    </div>
  );
}
