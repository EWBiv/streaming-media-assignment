const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const makeMediaObj = (filePath, contentType) => {
  const media = mediaHandler.mediaObject;
  media['File-Path'] = filePath;
  media['Content-Type'] = contentType;
  return media;
};

const onRequest = (request, response) => {
  console.log(request.url);
  switch (request.url) {
    case '/':
      htmlHandler.getPage(request, response, 'Index');
      break;
    case '/page2':
      htmlHandler.getPage(request, response, 'Client2');
      break;
    case '/page3':
      htmlHandler.getPage(request, response, 'Client3');
      break;
    case '/bird.mp4':
      mediaHandler.getMedia(request, response, makeMediaObj('../client/bird.mp4', 'video.mp4'));
      break;
    case '/bling.mp3': // MIME Type Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
      mediaHandler.getMedia(request, response, makeMediaObj('../client/bling.mp3', 'audio/mpeg'));
      break;
    case '/party.mp4':
      mediaHandler.getMedia(request, response, makeMediaObj('../client/party.mp4', 'video/mp4'));
      break;
    default:
      htmlHandler.getPage(request, response, 'Index');
      break;
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
