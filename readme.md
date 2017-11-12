
## 2-type by team Yukkuri
Typing game written in node.js for nko2017!

## build usage:
```shell
npm start # run app
npm run build:dev # webpack to public/app.js [source]
npm run build:release # webpack to public/app.js [uglified]
npm run build:sass # build sass/app.sass to public/app.css
npm run watch:sass # build + watch sass/app.sass to public/app.css
```

## stuff used to make this
* [koajs](https://github.com/koajs/koa) web-server
* [koa-static](https://github.com/koajs/static) serve our game
* [socket.io](https://socket.io/) websockets
* [request](https://github.com/request/request) http client
* [metaphorpsum](http://metaphorpsum.com) sentence generator
