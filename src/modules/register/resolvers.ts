///<reference path="../../types/schema.d.ts"/>

import * as bcrypt from 'bcryptjs'
import { ResolverMap } from '../../types/graphql-utils'
import { User } from '../../entity/User'

export const resolvers: ResolverMap = {
  // dummy Query for fixing exiting bug from graghql-tool: must have at least 1 query
  Query: { 
    stub: () => {
      return 'Bye'
    }
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
