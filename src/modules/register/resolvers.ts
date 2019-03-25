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
      const usersInDb: User[] = await User.find({
        where: { email },
        select: ['id']
      })

      if (usersInDb.length > 0)
      // return an array of errors
        return [
          {
            path: 'email',
            message: 'email already taken'
          }
        ]

      const salt: string = await bcrypt.genSalt(10)
      const hash: string = await bcrypt.hash(password, salt)
      // generate user in memory
      const user = User.create({
        email,
        password: hash
      })
      // now actually save in db
      await user.save()
      
      // return null means no errors
      return null
    }
  }
}
