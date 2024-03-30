const app = require('./app');

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
    const address = server.address();
    console.log(`Backend Server is running on port ${port}`)
});

// for chat app
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.DEPLOY_URL,
    },
  });


/*
TODO: Chats socket connections: kirthivasan pending
*/

module.exports=server;