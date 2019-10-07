/**
 * common functions
 */
// roomID用のランダム文字列生成
export const getUniqueId = () => {
  return Math.random()
    .toString(36)
    .slice(-8)
}

// いいねの星を出す位置を計算するやつ
export const getIinePositions = (width, height, size, count) => {
  const pattern = [
    {
      x: 0 + Math.floor(Math.random() * (size / 2)),
      y: size + Math.floor(Math.random() * (height - size * 2)),
      count
    },
    {
      x: size + Math.floor(Math.random() * (width - size * 2)),
      y: size + Math.floor(Math.random() * (size / 2)),
      count
    },
    {
      x: width - size - Math.floor(Math.random() * (size / 2)),
      y: size + Math.floor(Math.random() * (height - size * 2)),
      count
    },
    {
      x: size + Math.floor(Math.random() * (width - size * 2)),
      y: height - size - Math.floor(Math.random() * (size / 2)),
      count
    }
  ]
  return pattern
}
