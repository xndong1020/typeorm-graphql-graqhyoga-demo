///<reference path="types/schema.d.ts"/>

import { ResolverMap } from './types/graphql-utils'
import * as bcrypt from 'bcryptjs'
import { User } from './entity/User'

export const resolvers: ResolverMap = {
  Query: {
    hello: (_: any, { name }: GQL.IHelloOnQueryArguments) =>
      `Bye ${name || 'World'}`
  },
  Mutation: {
    register: async (
      _: any,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const salt: string = await bcrypt.genSalt(10)
      const hash: string = await bcrypt.hash(password, salt)
      // generate user in memory
      const user = User.create({
        email,
        password: hash
      })
      // now actually save in db
      await user.save()
      return true
    }
  }
}
