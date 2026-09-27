/**
 * Helper functions for Firebase operations
 */

/**
 * Sanitizes a string for use as a Firebase path key
 * Firebase paths cannot contain '.', '#', '$', '[', ']', or '/'
 * Spaces and other special characters are replaced with underscores
 * @param {string} path - The string to sanitize
 * @return {string} - Sanitized string
 */
export function sanitizePath(path) {
  if (typeof path !== 'string') {
    return '';
  }
  // Replace invalid Firebase path characters with underscores
  // Invalid chars: . # $ [ ] /
  // Also replace spaces and other problematic characters
  return path
    .replace(/[.#$[\]/]/g, '_')   // Replace invalid Firebase chars
    .replace(/\s+/g, '_')          // Replace spaces with underscores
    .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '');      // Remove leading/trailing underscores
} 