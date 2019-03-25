import 'reflect-metadata'
import { GraphQLServer } from 'graphql-yoga'
import { resolvers } from '../resolver'
import { createTypeOrmConn } from './createTypeOrmConn'

export const startServer = async () => {
  const server = new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers
  })

  await createTypeOrmConn()
  // make sure test and development server are running on different port
  const port = process.env.NODE_ENV === 'test' ? 0 : 4000
  const app = await server.start({
    port
  })
  console.log(`Server is running on localhost:${port}`)

  return app
}
