import 'reflect-metadata'
import { request } from 'graphql-request'
import { User } from '../entity/User'
import { startServer } from '../utils/startServer'
import { AddressInfo } from 'net'

const fakeEmail = 'test@test.com'
const fakePassword = 'fakePassword'

const mutation = `
mutation {
    register(email:"${fakeEmail}", password:"${fakePassword}")
}
`
let getHost = () => ''

beforeAll(async () => {
  // create/run server in test env
  const app = await startServer()
  // get current port number
  const { port } = app.address() as AddressInfo
  // assign port number for graphql endpoint
  getHost = () => `http://localhost:${port}`
})

test('Register user', async function() {
  const response = await request(getHost(), mutation)
  expect(response).toEqual({ register: true })

  const users = await User.find({ where: { email: fakeEmail } })
  expect(users).toHaveLength(1)
  const user = users[0]
  expect(user.email).toEqual(fakeEmail)
  expect(user.password).not.toEqual(fakePassword)
}, 30000)
