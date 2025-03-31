/**
 * @typedef {Object} Suggestion
 * @property {number} id
 * @property {string} type - "redirect" | "message"
 * @property {string} text
 * @property {string} [url] - Optional for "message" type
 */

/**
 * @typedef {Object} Widget
 * @property {number} id
 * @property {string} type - "iframe" | "gallery"
 * @property {string} [label]
 * @property {string} [url] - For iframe type
 * @property {string[]} [images] - For gallery type
 */

/**
 * @typedef {Object} FAQ
 * @property {number} id
 * @property {string} question
 * @property {string} answer
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {number} embed_config_id
 * @property {Suggestion[]} [suggestions]
 * @property {Widget[]} [widgets]
 */

class FAQ {
  // ... existing methods ...
}
