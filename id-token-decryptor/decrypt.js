const jose = require('node-jose');
const fs = require('fs');
const { parseJwk } = require('jose/jwk/parse');
const { compactDecrypt } = require('jose/jwe/compact/decrypt');
const jwt = require('jsonwebtoken');

// Example usage - replace with your actual private key
const rsaPrivateKeyStr = `
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmGrglUApXCONQ1R4YMPnFh0R2XWV1iEoTJJvF+ulA8yoHSPiZo0GhhoCKGTnQ8zJ7SYdTl7PDnP4rcuW5MGXjRyE9aC6h/ku8KB283lFvLX1HHeIRyJrMA5oGW2dRYH6eeiBsM0jc0m48jmAnzFwF0loCRYFU51nEtpXsZ2NILZX2yzRaqLxjOg+fOQoqJVAjzRSiHPLtjSgM8zj6RFMseq+O6xnEM33oh7S+rJEwjSRW9WqZ28fdIkUHrhGaMbIKq5bMknig9Uqk3cI0eEVez4kfa4pvUhtLiEFBcOsRiBfBsUOsQXFs7XpoPoJEj1T5sGCgCpusbaOXV+svobFBAgMBAAECggEAUgT1ku8f+/QWku55Ssa8Pu5ZPv1FQTEIKsWz6aHJFdo8kZZVsz+rA8BvrkFgjC3aaohXO064ZEocM4YrqzMbzItt/W15QWJZMVK5xG4e1gAnUTuPSuq8jSrmHmd57/Pu8gAqDGOSgf+ikWJYVq6Rbgp9iYuanjsS15C1HSO8IYIbkt5eOKIShQMEnqhTjxrGWRakC+wBWrvjE4gyupfteI9bwwHxKTaBRy7j/tEjnqJrnw/EXQDv0EU/d9OohqhVh8FlSk4xGUsYySU02lMl14etsHf8K/76yWmRnbn49JTP9YWQxZGY5PWmE4HEZwxLUExCQFjEAdCzsyLwD47SZQKBgQDrTr1smwob/i0/4buXhdK/KkcRSixuGmvPyXf1CmvpD1JznFvuiEhHAWB6pXGI/bz/dLswSyPG9+7ecdEsQE0Uw0cC6nEYURi4Baqqoai7FQ7XKlEpFZ/QHZytXenXlM4CEstc8cn4Kvi0TC54nrTwv36zZkvruWpJMHKP9gSBxwKBgQC0thJ4e5OvTETw874PqLnmpDCzz+3yFxTtKBOTt/FZRJ4L6RWidLJrVHqCjjS1N2itYUdvdCp5PXHduo1NkKDvtVA9Htl65Wu7qztd41ONt0v4XrLKsK6TzAmhY936cf5r5FjNffRTUjdj21aMBsk24tbFEltplBgfaabYD4+0twKBgQC2E1SBsCoPZQtwbePxKCzdnQImv8VHYQxhWRyIMIs1aJS9PpToKu36e3dDD7edb/GJnbKmeM3zTK+50kovuoWqdjwBZpUiYsYExuW7aKGeOXolRepNJx1lNTSh9ZRXKx6I/i/7+F/2tpGBOZ2P2gZab2LDwHkoqm0yutk6yfvMywKBgG1Nk258kJ9/KlPzmgourALtXOfl5K6Bd47apry6jajI8C+UFBnnK+PvfQpqqUbS9OWp6WNoiCg9GhpbNAyuZimXKalOd4z2J2uj7oyja25UaAcagFpI889BorGTjjhlqtXnkC76+EVNfWNQz9ByalJgcjdRGymJAe4+IUSeZPWRAoGAFnTQbqU2cgaXPg+zu2WZe1NP/BwpLDmY4zy3j6/3YrGJyYMbQWip77o2JV4eOoUwrXKEqo5T+xacsuO7FaNFiZF1oWMKBlZ+bjLpS6TzTkYaEdL8MrtEgzzIGDGGx1ZCN474OR97tyz0I9ZnRat2mHdT/0jTN3d5uGqZ4ud/Clc=
-----END PRIVATE KEY-----
`;

const encryptedIdToken = 'eyJraWQiOiJhZHItMTIzIiwiY3R5IjoiSldUIiwiZW5jIjoiQTEyOENCQy1IUzI1NiIsImFsZyI6IlJTQS1PQUVQIn0.ghh7umz9KuYEaMfcoOmrJkC4cMbSB2HgXjsSDkLEekxzkkqczy8dszQhet5amFSy0e6s1aoyZH1WYDkiokJAHhOgXZCrdcPMZAhv3Iw5viyXZOI211JFWGaWyv5eQbtRDEIfv-2d9O4YLWe_P6bM-FQE2AdP8zysy9To35YCIv0FPZLuCDS_aeA-iAzY5wCCHJUP-CDOx-8lByfWJZfxDKy-6oBVXihqhAvAK3tDn3wEXnY1oEhX4hv0xEuNEGyLsArII1phg7GPGcIAYFD5Te1gO-aGC4PSiHjrE8dO0peRu_5E-nA2s2OOrIufIChxjYil67i2hFWcIY0SaiyEyg.B71iWDle2miCkfMEA-z64A.xv4kEC-sfhubgPOHDKXEEfLrBW0yVikzkrsf1CG5y3wzxXzvs9zb71l8GsQmlLiOJWHLTrdxIB0CqMOSNV4QY4IMRLkH5fHhORHIlByH0Aq_gmonOybge5mTq6SqbVVXhHO2jndmnMVBsrj0Gw6WZYSeX6Bxq07Qw3eQG6RjaqY4vdiX9nBEXiHsxXkABXxtZLv2xFtrTDnd24JWdZP68gvDBM-uybojT53q24zHRwCe3JGe3Q-5CbOFwqKEUoD9_j9g0fnomzlN_gQAhwUy8Z2qUV8H4lUe31j06b203lWdXQmXRIdxHLCFHHvAltoNAYrFNRVxSQa_fsGRzACURdocfzheLKkwGuA9WuxNO13o-FHRjU5oxcjyb0WtTzykVLZwdjtGH0R6ubdIYxoTLrN4uKnNruLuN2aFOM9irjK7zGGDXyImoyO4eWnLiNz7cW_UVOS9WAdUC0Qckcw88dTmHEdFEV_rwHQoFy1n7BKcWUq1gPe0iYxgTsIYbpJ0ie_IbRberVMAnR1deeL3N2G67_YHj5ALEfCrxbC2aeiggGpV3M1mpndirNf7KiirmE1hEtzhNooMT-aLJRGStNld0lv6rgdyNHu57xa0b9dXQ5IxhvNbLfJCqpJkTk6ewWgmJFIu2oTxfB4gOV_9ka1AVGAoKVuCZP0i3ReK_UvRukaFlOft4W7_PDJ6LxTgomM7wQn-eIck8BeHB2UMHdm9T_ZW3UU0g5V_LG7JisXUKER-hdYn0DbWADt0bIpXUoY7JOn3YI7ET_vIvPnx7OqEY7SJgpzvsoQKaygFZrBO-l5p59yZMg-VwtgSoqbbDChEyFCItzwcVwzeOrACnScmBzBcCnt9ytySsHBtbBfmRkDNFgmeEOj3v7NaRy7-IM0wFjEL4QToZP4i2fn2PWSnhN36TfJWNWrpyqRgMa1AziCrtYTTvvXN7BW6DbcgK1TgZlCGvFf7DJonVq4hB5K0I7LqvLxgTMuitRaKsw0KB4WibQe3Rn1iJ9KpFkV1-UGuSTlsQnOOqfiMs7sp7dyBTBodr5A8HlnnLua1KT5v7HaNvYu6IuwGDlUM9_PMgF0JH7b9D-Wjm5dC48DMNY-g4IXQ9b4luQBcv7cr0A0jzz4B7OCj9bgAcRRH-HZKDcNcrzeig0VXu3Xlo8yrW0GDaCvHBZlnMpq73cdtvK92d8G7PL3nDCNyqSZElO5_eTvzvwiFlGfYQW1pJOlmi2nwqnTeqBiCfm8OdaCGKm7COM9SJB1zyx31uQlz0TYYGZ1KYDrpIFuvWnlufP-XnN4F6x-RGm9-L4IPCo6dW70iz_Jic2dxT4UNy3WDX4ycCYVrRQeBEyGEUvnqHDc4TMJuVQiy5_G-VKa2zW8MGt0gqteWmFKG1yUkFEbPWjAmMbM7uGr676u9BneemW-mxQNbqS-xCTgdOJrwMfTGf086g1noeBV95cPyO_PbpvJVncmqZB2A66ZwtkeWWU1gnLljmMvJqR9ZjBB0-_EQHQJwlikISLft_2wwBx3TMqToD_osPZ9k-U2IsxU62mgpaMf2eEuBAMLlgIBNx3tGG66d8xBdorRDOVSlLwytn77rUNJa9ERfTvwsRUvq9FSJu1nxxj0sp0gII_6BEcTcSSmgb7P4eiBKsBV4158zVApXBudEpEByQ4MGUuVt9w9q_ePIUyjK4dWai1q29xEklUiNB7ibqaXZU88rN7jvvbtDeoSabTlIPt4diUeoiTygxhgRxXs6Sq1x4neKMouJaAA6cd7EA-AU4cznuFRyOdjpH-RfOY-2H0GmzHyxuLZvWK3fcyuIS0ZBg6wN9Rb5nEMZwGH_W5LTDoc_kuO2pi08NzsAN-4tiEuJp576D8ru_DLtLXUzEkee4q3RBc8h6xwwoHVotlHyR7Kfas_miwCy5yYVu0mjS0RPMw8Ivz1oYJJef1UFH0zNh1b8J1Arp3Iiyefy0qSH52FQZ1QHxhF_.SRmJWtaGzqDFENQWoeIz_g';

async function decryptIdToken(encrypted, pemKey) {
  try {
      // Create a keystore to hold the key
      const keystore = jose.JWK.createKeyStore();

      // Convert PEM to JWK
      const key = await keystore.add(pemKey, 'pem');

      // Get JWK in JSON format
      const jwk = key.toJSON(true);

      // Add "alg" field to the JWK
      jwk.alg = "RS256";

      const jwkString = JSON.stringify(jwk, null, 2);
      // Output the JWK format with the additional "alg" field


      const privateKey = await parseJwk(jwk);

      const { plaintext, protectedHeader } = await compactDecrypt
          (
              encrypted,
              privateKey
          );

      const decoder = new TextDecoder()
      const decoded = jwt.decode(decoder.decode(plaintext), { complete: true });
//      console.log('Header:', decoded.header);
//      console.log('Payload:', decoded.payload);
//      console.log(decoded);
      console.log(decoded.payload);

  } catch (err) {
      console.error('Error converting private key to JWK:', err);
  }

}

decryptIdToken(encryptedIdToken,rsaPrivateKeyStr);
