# id-token-decryptor

## Pre requisites

id-token-decryptor requires [Node.js](https://nodejs.org/) to run.

## Installation

In the `id-token-decryptor` directory, run the following to install required dependencies

```
npm install jose
npm install node-jose
npm install jsonwebtoken
```

## Configuration

- Open `decrypt.js`
- Modify the `const encryptedIdToken` value and add the required token you need to decrypt 
- Modify the `const rsaPrivateKeyStr` to include the private key of associated token
- Save the modifications
- Run the decryptor using the following command,

```
node decrypt.js
```
- You will get an output like below,

```markdown
Header: {
  x5t: 'MDJlNjIxN2E1OGZlOGVmMGQxOTFlMzBmNmFjZjQ0Y2YwOGY0N2I0YzE4YzZjNjRhYmRmMmQ0ODdiNDhjMGEwMA',
  kid: 'MDJlNjIxN2E1OGZlOGVmMGQxOTFlMzBmNmFjZjQ0Y2YwOGY0N2I0YzE4YzZjNjRhYmRmMmQ0ODdiNDhjMGEwMA_PS256',
  alg: 'PS256'
}
Payload: {
  isk: '8e337a24f92da4887fc5a2a46e48e80aac69f38f71ad12f99de0a9508126aa01',
  at_hash: 'IXYZjZ7o0dQ_wj9xrnyABg',
  sub: '40012345678',
  amr: [ 'IdentifierExecutorCDS', 'SMSOTPCDS' ],
  iss: 'https://localhost:9446/oauth2/token',
  given_name: 'Janitha',
  nonce: 'GpKXk1FvHo',
  sid: '04227c18-6740-4105-a473-5d3e24f461a1',
  aud: 'fXejdrV69hfMJTF4R962VpRgfPwa',
  acr: 'urn:cds.au:cdr:2',
  c_hash: '1vQH559SrLZQa6OwG6t37w',
  nbf: 1724402979,
  updated_at: 1718908200,
  azp: 'fXejdrV69hfMJTF4R962VpRgfPwa',
  auth_time: 1724402959,
  name: 'Janitha Senevirathna',
  exp: 1724406579,
  iat: 1724402979,
  family_name: 'Senevirathna',
  jti: '1c1f03b9-30e5-44f9-8341-74ce2d551fe2'
}
```
- Use at will!
