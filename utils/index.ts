/**
 * Generates a secure random string of the specified length.
 * This is commonly used for things like CSRF tokens or unique identifiers.
 * 
 * @param {number} length - The desired length of the generated string.
 * @returns {string} - A random string consisting of alphanumeric characters.
 */
export function generateRandomString(length: number): string {
  let result = ''; // Initialize the result as an empty string to build upon.
  
  // Define the set of characters to use in the random string.
  // This includes uppercase, lowercase letters, and numbers.
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Loop `length` times to append random characters to the result string.
  for (let i = 0; i < length; i++) {
    // Generate a random index within the range of the characters string.
    const randomIndex = Math.floor(Math.random() * characters.length);
    
    // Append the character at the randomly selected index to the result string.
    result += characters.charAt(randomIndex);
  }
  
  // Return the final random string.
  return result;
}