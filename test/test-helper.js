import { map, bitsPerChar, bitsPerByte } from '../src/base32.js'

const invertedMap = new Map()

for (const [key, value] of map) {
  invertedMap.set(value, key)
}

export { bitsPerByte }

const random5Bits = () => Math.floor(Math.random() * 32)

export default (charCount) => {
  const data = []
  let base32 = ''
  for (let i = 0; i < charCount; ++i) {
    const value = random5Bits()
    const fiveBitString = value.toString(2).padStart(5, '0')
    data.push(fiveBitString)
    base32 = base32.concat(invertedMap.get(value))
  }
  const padding = bitsPerByte - charCount * bitsPerChar % 8
  const bitString = data.join('') + '0'.padStart(padding, '0')
  return { base32, bitString }
}
