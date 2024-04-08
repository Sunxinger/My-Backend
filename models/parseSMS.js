// parseSMS.js
function parseSMS(content) {
    const locationRegex = /Latitude: ([\d.-]+), Longitude: ([\d.-]+)/;
    const matches = content.match(locationRegex);
  
    if (matches && matches.length >= 3) {
      return {
        latitude: parseFloat(matches[1]),
        longitude: parseFloat(matches[2]),
        timestamp: new Date() // 假设立即创建时间戳
      };
    }
    return null;
  }
  
  module.exports = parseSMS;
  