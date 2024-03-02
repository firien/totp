const bitsPerChar = 5
const bitsPerByte = 8

const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
const map = new Map()
for (let i = 0; i < base32chars.length; i++) {
  const char = base32chars.charAt(i)
  map.set(char, i)
}

/**
 * slightly complicated base32 decoder.
 * every character represents 5 bits
 * these bits are concatenated until there are at least 8 bits.
 * then 1 byte (8 bits) is extracted and stored.
 * left over bits are concatenated with the next 5 bits…
 *
 * makes it a little harder to read, but it's much faster
 * than traditional js decoders that use strings and parseInt
 *
 * @param {string} base32
 */
export default (base32) => {
  base32 = base32.replace(/=+$/, '')
  const bytes = []
  let bitCount = 0
  let bits = 0
  for (let i = 0; i < base32.length; i++) {
    const val = map.get(base32.charAt(i).toUpperCase())
    if (val === undefined) {
      throw new Error(`'${base32.charAt(i)}' is an invalid base32 character`)
    }
    const newBitCount = bitCount + bitsPerChar
    if (newBitCount >= bitsPerByte) {
      const offset = bitsPerByte - bitCount
      const byteFragment = bits << offset
      // get bits from incoming char
      const newBitCount = bitsPerChar - offset
      const newBits = (((2 ** offset - 1) << newBitCount) & val) >> newBitCount
      bytes.push(byteFragment + newBits)
      bitCount = newBitCount
      bits = val & ((2 ** newBitCount - 1))
    } else {
      if (bitCount === 0) {
        bits = val
      } else {
        bits = (bits << bitsPerChar) + val
      }
      bitCount = newBitCount
    }
  }
  // cleanup
  bytes.push(bits << (bitCount - bitsPerByte))
  return new Uint8Array(bytes)
}
