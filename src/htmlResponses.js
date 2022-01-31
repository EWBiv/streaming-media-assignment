const fs = require('fs');

// Slow, needs to be done prior (not in getPage)
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const client2 = fs.readFileSync(`${__dirname}/../client/client2.html`);
const client3 = fs.readFileSync(`${__dirname}/../client/client3.html`);

// Acts as a dictionary for server to reference strings to get a page
const htmlFiles = {
  Index: index,
  Client2: client2,
  Client3: client3,
};

const getPage = (request, response, fileName) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(htmlFiles[fileName]);
  response.end();
};

module.exports.htmlFiles = htmlFiles;
module.exports.getPage = getPage;
