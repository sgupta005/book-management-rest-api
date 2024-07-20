export default function logger(request, response, next) {
  console.log(request.method + ' ' + request.url);
  next();
}
