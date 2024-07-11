/**
 * Chuyển đổi chuỗi JSON thành đối tượng JavaScript.
 *
 * @param {string} value - Chuỗi JSON cần được chuyển đổi.
 * @returns {Object|null} - Trả về đối tượng JavaScript nếu chuỗi JSON hợp lệ, ngược lại trả về null.
 */
export const toJson = (value) => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}