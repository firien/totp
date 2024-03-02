import base32Decoder from '../../src/base32.js'
import base32Encoder, { bitsPerByte } from '../test-helper.js'
import test from 'node:test'
import assert from 'node:assert/strict'

test('base 32 decoder', async () => {
  for (let n = 6; n < 30; ++n) {
    const { base32, bitString } = base32Encoder(n)
    const decoded = base32Decoder(base32)
    const bytes = []
    for (let i = 0; i < bitString.length; i = i + bitsPerByte) {
      const byteString = bitString.slice(i, i + bitsPerByte)
      bytes.push(parseInt(byteString, 2))
    }
    assert.deepEqual(new Uint8Array(bytes), decoded)
  }
})
