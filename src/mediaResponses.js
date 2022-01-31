// Object used to make sending file-path/content-type a little more organized
const mediaObject = {
  'File-Path': '../client/client.html', // '../client/party.mp4'
  'Content-Type': 0,
};

const fs = require('fs');
const path = require('path');

// Used to return Start/End/Total/Chunksize and keep implementation out of callback function
const returnRangeInfo = (request, size) => {
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  let start = parseInt(positions[0], 10);

  const end = positions[1] ? parseInt(positions[1], 10) : size - 1;

  if (start > end) {
    start = end - 1;
  }

  const chunksize = (end - start) + 1;

  const rangeObject = {
    Start: start,
    End: end,
    Total: size,
    Chunksize: chunksize,
  };
  return rangeObject;
};

// The callback of the fs.stat function called in the media request function 'getMedia'
function statCallback(err, stats, file, request, response, media) {
  if (err) {
    if (err.code === 'ENOENT') {
      response.writeHead(404);
    }
    return response.end(err);
  }

  const rangeObj = returnRangeInfo(request, stats.size);

  response.writeHead(206, {
    'Content-Range': `bytes  ${rangeObj.Start}-${rangeObj.End}/${rangeObj.Total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': rangeObj.Chunksize,
    'Content-Type': media['Content-Type'],
  });

  const stream = fs.createReadStream(file, { start: rangeObj.Start, end: rangeObj.End });

  stream.on('open', () => { stream.pipe(response); });
  stream.on('error', (streamErr) => { response.end(streamErr); });

  return stream;
}

// What is called when a media request is made
const getMedia = (request, response, media) => {
  const file = path.resolve(__dirname, media['File-Path']);
  fs.stat(file, (err, stats) => { statCallback(err, stats, file, request, response, media); });
};

module.exports.getMedia = getMedia;
module.exports.mediaObject = mediaObject;
