import axios from 'axios'

export async function checkLoginUser({ url, identifier, password }) {
  // Complete endpoint
  const uri = `${url}auth/local`

  if (!identifier && !password) return

  try {
    const { data } = await axios.post(uri, { identifier, password })
    return data.jwt
  } catch (e) {
    log(chalk`{red [ERROR]} checkLoginUser`)
    throw new Error(e)
  }
}