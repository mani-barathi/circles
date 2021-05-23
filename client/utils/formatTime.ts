export const formatTime = (time: any): string => {
  let dObj
  if (isNaN(time)) {
    dObj = new Date(time)
  } else {
    dObj = new Date(parseInt(time))
  }
  const t = dObj.toLocaleTimeString().split(" ")
  const date = dObj.toDateString().split(" ")
  const period = t[1]
  const temp = t[0].split(":", 2)
  return `${date[0]} ${date[1]} ${date[2]} ${temp[0]}:${temp[1]} ${period}`
}
