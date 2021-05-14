import DataLoader from "dataloader"
import User from "../entities/User"

export const createUserLoader = () => {
  return new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[], {
      select: ["id", "username"],
    })
    const usersMap: Record<number, User> = {}
    users.forEach((u) => (usersMap[u.id] = u))
    usersMap
    const mappedUsers = userIds.map((id) => usersMap[id])
    return mappedUsers
  })
}
