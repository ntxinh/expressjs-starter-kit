const axios = require('axios')

exports.testAxios = async () => {
  // Grab some data over an Ajax request
  const xinh = await axios('https://api.github.com/users/nguyentrucxinh')

  // Many requests should be concurrent - don't slow things down!
  // Fire off two requests and save their promises
  const userPromise = axios('https://randomuser.me/api/')
  const namePromise = axios('https://uinames.com/api/')
  // Await all three promises to come back and destructure the result into their own variables
  const [user, name] = await Promise.all([userPromise, namePromise])

  return { xinh: xinh.data, user: user.data, name: name.data }
}
