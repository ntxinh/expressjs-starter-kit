exports.randomPassword = () => {
  return Math.random()   // Generate random number, eg: 0.123456
    .toString(36)               // Convert  to base-36 : "0.4fzyo82mvyr"
    .slice(-8)                      // Cut off last 8 characters : "yo82mvyr"
}
