import { Context } from "../types"
import { AuthChecker } from "type-graphql"
import { getManager } from "typeorm"

export const customAuthChecker: AuthChecker<Context> = async (
  { args, context },
  roles
) => {
  const { userId } = context.req.session
  if (!userId) return false

  // Check if the user is the admin of the circle
  if (roles.includes("ADMIN")) {
    const [result] = await getManager().query(
      `
    select exists (select 1 from member where "userId" = $1 and "circleId" = $2 and "isAdmin" = true )  
    `,
      [userId, args.circleId]
    )
    return result.exists
  }

  // Check if the user is the member of the circle
  if (roles.includes("MEMBER")) {
    const [result] = await getManager().query(
      `
    select exists (select 1 from member where "userId" = $1 and "circleId" = $2 )  
    `,
      [userId, args.circleId]
    )
    return result.exists
  }

  return true
}
