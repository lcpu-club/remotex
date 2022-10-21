import { IGroup } from '../db/group.js'
import { IUser } from '../db/user.js'
import { protectedProcedure, tRPC } from './trpc.js'

export const userRouter = tRPC.router({
  info: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.dbconn.user.collection
      .aggregate([
        { $match: { _id: ctx.token?.userId } },
        {
          $lookup: {
            from: 'group',
            localField: 'groupId',
            foreignField: '_id',
            as: 'group'
          }
        },
        { $unwind: '$group' },
        {
          $project: {
            _id: 1,
            username: 1,
            attributes: 1,
            'group._id': 1,
            'group.attributes': 1,
            'group.policies': 1
          }
        }
      ])
      .next()
    type Result = Pick<IUser, '_id' | 'username' | 'attributes'> & {
      group: Pick<IGroup, '_id' | 'attributes' | 'policies'>
    }
    return user as Result
  })
})
