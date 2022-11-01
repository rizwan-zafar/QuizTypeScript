 /**
 * * shuffle correct & incorrect answers
 * @param array 
 * @returns array
 */
export const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);
