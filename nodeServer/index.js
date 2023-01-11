// Node Server which will handle socket io connections



const server = require("http").createServer(()=>{});

const io = require('socket.io')(server, 
    {
        cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }});

const users ={}

io.on('connection',socket =>{

    // If new user joins, let other user connected to the server know
    socket.on('new-user-joined' ,name =>{
         
         users[socket.id]=name;
         socket.broadcast.emit('user-joined',name);
    } )
       
    // if someone send a message , broadcast it to other people 
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message: message, name: users[socket.id]})
    });
         // if someone leaves the chat , let other users know
     socket.on('disconnect', (message) => {
       socket.broadcast.emit("left", users[socket.id]);
         delete users[socket.id];
     });

} )

server.listen(8004)