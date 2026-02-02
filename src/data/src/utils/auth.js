import studentsData from '../data/students.json';

/**
 * Authenticate student with name and register number
 */
export const authenticateStudent = (name, registerNo) => {
  const student = studentsData.students.find(
    s => s.name.toLowerCase().trim() === name.toLowerCase().trim() && 
         s.registerNo === registerNo
  );
  
  if (student) {
    // Store in session
    sessionStorage.setItem('currentStudent', JSON.stringify(student));
    return { success: true, student };
  }
  
  return { success: false, message: 'Invalid name or register number' };
};

/**
 * Get current logged-in student
 */
export const getCurrentStudent = () => {
  const studentData = sessionStorage.getItem('currentStudent');
  return studentData ? JSON.parse(studentData) : null;
};

/**
 * Logout student
 */
export const logoutStudent = () => {
  sessionStorage.removeItem('currentStudent');
};

/**
 * Check if student is authenticated
 */
export const isAuthenticated = () => {
  return getCurrentStudent() !== null;
};
