import base32Decoder, { map, bitsPerChar, bitsPerByte } from '../../src/base32.js'
import { expect, test } from 'bun:test'

const invertedMap = new Map()

for (const [key, value] of map) {
  invertedMap.set(value, key)
}

const random5Bits = () => Math.floor(Math.random() * 32)

const base32Encoder = (charCount) => {
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

test('base 32 decoder', async () => {
  for (let n = 6; n < 30; ++n) {
    const { base32, bitString } = base32Encoder(n)
    const decoded = base32Decoder(base32)
    const bytes = []
    for (let i = 0; i < bitString.length; i = i + bitsPerByte) {
      const byteString = bitString.slice(i, i + bitsPerByte)
      bytes.push(parseInt(byteString, 2))
    }
    expect(new Uint8Array(bytes)).toEqual(decoded)
  }
})
