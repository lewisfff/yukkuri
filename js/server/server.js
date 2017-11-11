
const serve = require('koa-static');
const koa = require('koa');

const pub = '../../public';
const root = `${__dirname}/${pub}`;
const port = process.env.PORT || 3000;

const app = new koa();
app.use(serve(root));
app.listen(port);

console.log(`Serving ${root} on port ${port}`);
