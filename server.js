const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
const app = express();
const _ = require('lodash');

if (isDeveloping) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

const server = app.listen(port, '127.0.0.1', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('Listening on port %s. Open up http://127.0.0.1:%s/ in your browser.', port, port);
});

const io = require('socket.io')(server);
let allShipsPosition = [];

// Socket Handle listen from Client
let gameSocket;
io.on('connection', function(socket) {
  gameSocket = socket;

  // Listen from Client when all ships are added

  socket.on('allShipAdded', function(data) {
    allShipsPosition = data.shipsPosition;
    this.emit('gameReady', data.gameReady);

    // Then broadcast to notify Client that we are ready

    socket.broadcast.to(data.roomId).emit('player2Ready', data.gameReady);
  });

  socket.on('playerShoot', function(data) {
    socket.broadcast.to(data.roomId).emit('receivedShot', data.shotPosition);
    socket.broadcast.to(data.roomId).emit('turnChange', data);
  })

  socket.on('hostStartGame', function(data) {
    // Broadcast to the other player that host pressed start game

    socket.broadcast.to(data.roomId).emit('gameStartedByHost', data);
    this.emit('turnChange', {myTurn: true});
  })

  socket.on('createRoom', createRoom);
  socket.on('joinRoom', joinRoom);

  socket.on('trackingGame', function(data) {
    socket.broadcast.to(data.roomId).emit('trackingGame', data);

    if (data.hitPos) {
      if (data.hitPos.length === 22) {
        io.sockets.in(data.roomId).emit('gameOver', data);
        this.leave(data.roomId);
      }
    }
  });

  socket.on('checkRoom', checkRoom);
  console.log("Client connected");
});

const createRoom = function(host) {
  let roomId = (Math.random() * 10000) | 0;

  // join to the room
  this.join(roomId.toString());

  // Notify 'newGameCreated' at Client side and send gameId & socketId
  let data = {
    roomId: roomId.toString(),
    mySocketId: this.id
  };

  // Broadcast to yourself
  this.emit('newGameCreated', data);
};

const joinRoom = function(data) {
    let room = gameSocket.nsp.adapter.rooms[data.roomId];

    if (room !== undefined) {
      // Limit number of players at 2
      if (room.length <= 1) {
        this.join(data.roomId);
        // ***** Player already Joined
        // Call playerJoined at Frontend and pass room Id
        io.sockets.in(data.roomId).emit('playerJoined', data);
      }
    }
};

// Check if the room is available on socket
const checkRoom = function(roomId) {
  let room = gameSocket.nsp.adapter.rooms[roomId];

  if (!room) {
    this.emit('validateRoom', {valid: false});
  } else {
    if (room.length > 1) {
      this.emit('validateRoom', {valid: false});
    } else {
      this.emit('validateRoom', {valid: true});
    }
  }
};
