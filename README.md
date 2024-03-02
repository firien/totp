## TOTP generator

* [HOTP](https://www.rfc-editor.org/rfc/rfc4226)
* [TOTP](https://www.rfc-editor.org/rfc/rfc6238)

### Usage

```js
import getTOTP from './src/totp.js'
const base32secret = 'ASDFGHTREWDSFG'
const totp = await getTOTP(base32secret)
```

### Inspirations

* https://github.com/bellstrand/totp-generator/blob/master/index.js
* https://dev.to/al_khovansky/generating-2fa-one-time-passwords-in-js-using-web-crypto-api-1hfo
