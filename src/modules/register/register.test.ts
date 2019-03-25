import 'reflect-metadata'
import { request } from 'graphql-request'

import { AddressInfo } from 'net'
import { startServer } from '../../utils/startServer'
import { User } from '../../entity/User'

const fakeEmail = 'test@test.com'
const fakePassword = 'fakePassword'

const mutation = `
mutation {
    register(email:"${fakeEmail}", password:"${fakePassword}") {
      path,
      message
    }
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
  expect(response).toEqual({ register: null })

  const users = await User.find({ where: { email: fakeEmail } })
  expect(users).toHaveLength(1)
  const user = users[0]
  expect(user.email).toEqual(fakeEmail)
  expect(user.password).not.toEqual(fakePassword)
}, 30000)

test('email has to be unique', async function() {
  const response = await request(getHost(), mutation)
  // should get an array of error, which contains message from register resolver
  expect(response).toEqual({
    register: [
      {
        path: 'email',
        message: 'email already taken'
      }
    ]
  })
}, 30000)
