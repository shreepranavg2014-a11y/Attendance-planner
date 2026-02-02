/**
 * Calculate attendance percentage
 */
export const calculatePercentage = (attended, held) => {
  if (held === 0) return 100;
  return parseFloat(((attended / held) * 100).toFixed(2));
};

/**
 * Predict attendance after skipping classes
 */
export const predictAttendance = (currentAttended, currentHeld, skips) => {
  const newHeld = currentHeld + skips;
  const newAttended = currentAttended; // Attended stays same when skipping
  
  return {
    current: calculatePercentage(currentAttended, currentHeld),
    predicted: calculatePercentage(newAttended, newHeld),
    newHeld,
    newAttended,
    change: parseFloat((calculatePercentage(newAttended, newHeld) - calculatePercentage(currentAttended, currentHeld)).toFixed(2))
  };
};

/**
 * Predict combined attendance (theory + practical)
 */
export const predictCombined = (theory, practical, theorySkips, practicalSkips) => {
  const theoryPrediction = predictAttendance(
    theory.attended,
    theory.held,
    theorySkips
  );
  
  const practicalPrediction = predictAttendance(
    practical.attended,
    practical.held,
    practicalSkips
  );
  
  // Calculate combined
  const currentCombinedAttended = theory.attended + practical.attended;
  const currentCombinedHeld = theory.held + practical.held;
  
  const predictedCombinedAttended = theoryPrediction.newAttended + practicalPrediction.newAttended;
  const predictedCombinedHeld = theoryPrediction.newHeld + practicalPrediction.newHeld;
  
  return {
    theory: theoryPrediction,
    practical: practicalPrediction,
    combined: {
      current: calculatePercentage(currentCombinedAttended, currentCombinedHeld),
      predicted: calculatePercentage(predictedCombinedAttended, predictedCombinedHeld),
      change: parseFloat((
        calculatePercentage(predictedCombinedAttended, predictedCombinedHeld) -
        calculatePercentage(currentCombinedAttended, currentCombinedHeld)
      ).toFixed(2)),
      currentAttended: currentCombinedAttended,
      currentHeld: currentCombinedHeld,
      predictedAttended: predictedCombinedAttended,
      predictedHeld: predictedCombinedHeld
    }
  };
};

/**
 * Calculate maximum skips allowed to maintain target percentage
 */
export const calculateMaxSkips = (currentAttended, currentHeld, targetPercentage, futureClasses) => {
  const totalFutureHeld = currentHeld + futureClasses;
  const requiredAttended = (targetPercentage / 100) * totalFutureHeld;
  const additionalRequired = Math.max(0, requiredAttended - currentAttended);
  
  const maxSkips = Math.max(0, Math.floor(futureClasses - additionalRequired));
  const achievable = additionalRequired <= futureClasses;
  
  return {
    maxSkips,
    mustAttend: Math.ceil(additionalRequired),
    achievable,
    bestCase: calculatePercentage(currentAttended + futureClasses, totalFutureHeld),
    worstCase: achievable 
      ? calculatePercentage(currentAttended + (futureClasses - maxSkips), totalFutureHeld)
      : calculatePercentage(currentAttended + futureClasses, totalFutureHeld)
  };
};

/**
 * Get status color based on percentage
 */
export const getStatusColor = (percentage) => {
  if (percentage >= 90) return 'text-green-600 bg-green-50 border-green-200';
  if (percentage >= 75) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  return 'text-red-600 bg-red-50 border-red-200';
};

/**
 * Get change color (for displaying change percentage)
 */
export const getChangeColor = (change) => {
  if (change < 0) return 'text-red-600';
  if (change > 0) return 'text-green-600';
  return 'text-gray-600';
};
