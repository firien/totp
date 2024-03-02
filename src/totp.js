import base32Decoder from './base32.js'

/**
 * @param {integer} counter
 * @returns {ArrayBuffer}
 */
const counter = (counter) => {
  const buffer = new ArrayBuffer(8)
  const view = new DataView(buffer)
  view.setBigUint64(0, BigInt(counter))
  return buffer
}

/**
 * @param {integer} period - in seconds
 * @returns {integer}
 */
const timeCounter = (period) => {
  const stepWindow = period * 1000
  const time = Date.now()
  return Math.floor(time / stepWindow)
}
/**
 * @param {ArrayBuffer} buffer
 * @returns {integer}
 */
const dynamicTruncation = (buffer) => {
  const HS = new Uint8Array(buffer)
  const offset = HS[19] & 0xf
  return ((HS[offset] & 0x7f) << 24) | (HS[offset + 1] << 16) | (HS[offset + 2] << 8) | HS[offset + 3]
}

export default async (secret, { digits = 6, period = 30, algorithm = 'SHA-1' } = {}) => {
  const key = await crypto.subtle.importKey(
    'raw',
    base32Decoder(secret),
    {
      name: 'HMAC',
      hash: { name: algorithm }
    },
    false,
    ['sign']
  )
  const timeBasedCounter = timeCounter(period)
  const counterBuffer = counter(timeBasedCounter)
  const signature = await crypto.subtle.sign('HMAC', key, counterBuffer)
  const Snum = dynamicTruncation(signature)
  return String.prototype.padStart.call(Snum % (10 ** digits), digits, '0')
}
