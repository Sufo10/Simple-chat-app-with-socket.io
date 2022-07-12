const io = require('socket.io')(9000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-connected', name);
    });
    // console.log("new client connected");
    // socket.emit('chat-message', 'Welcome to the chat');
    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', {
            message: message,
            name: users[socket.id]
        });
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id]);
        delete users[socket.id]
    });
})