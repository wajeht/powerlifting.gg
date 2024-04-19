export function nl2br(str) {
  return str.replace(/(?:\r\n|\r|\n|\t| )/g, function(match) {
    if (match === '\n') {
      return '<br>';
    } else if (match === '\r\n') {
      return '<br>';
    } else if (match === '\r') {
      return '<br>';
    } else if (match === '\t') {
      return '&nbsp;&nbsp;&nbsp;&nbsp;'; // Assuming 4 spaces for a tab
    } else if (match === ' ') {
      return '&nbsp;'; // Replacing space with non-breaking space
    }
  });
}
