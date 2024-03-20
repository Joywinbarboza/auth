// utils.js
export function capitalizeFirstLetter(string) {
  if (string === "illegal arguments: undefined, string")
    return "You must be Offline";
  return string.replace(/\b\w/g, function (char) {
    return char.toLocaleUpperCase();
  });
}
