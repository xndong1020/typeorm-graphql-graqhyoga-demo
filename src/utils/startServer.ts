import 'reflect-metadata'
import { GraphQLServer } from 'graphql-yoga'
import * as path from 'path'
import * as fs from 'fs'
import { importSchema } from 'graphql-import'
import { mergeSchemas, makeExecutableSchema } from 'graphql-tools'
import { createTypeOrmConn } from './createTypeOrmConn'
import { GraphQLSchema } from 'graphql'

export const startServer = async () => {
  const schemas: GraphQLSchema[] = []
  const folders: string[] = fs.readdirSync(path.join(__dirname, '../modules'))
  // import all subschemas from src/modules folder
  folders.forEach(folder => {
    const { resolvers } = require(`../modules/${folder}/resolvers`)
    const typeDefs = importSchema(
      path.join(__dirname, `../modules/${folder}/schema.graphql`)
    )
    schemas.push(makeExecutableSchema({ resolvers, typeDefs }))
  })

  // use mergeSchemas to combine multiple GraphQL schemas together and produce a merged schema that knows how to delegate parts of the query to the relevant subschemas
  const server = new GraphQLServer({
    schema: mergeSchemas({ schemas })
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
