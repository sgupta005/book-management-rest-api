import colors from 'colors';

const methodColors = {
  GET: 'green',
  POST: 'yellow',
  DELETE: 'red',
  PUT: 'blue',
  PATCH: 'purple',
};

export default function logger(req, res, next) {
  const methodColor = methodColors[req.method] || white;
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`[
      methodColor
    ]
  );
  next();
}
