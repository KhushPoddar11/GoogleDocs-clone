import { Server } from "socket.io"; 
import Connection from './database/db.js'
import { getDocument, updateDocument } from "./controller/document-controller.js";
const PORT = 8005;
Connection();
const io = new Server(PORT,{
    cors:{
        origin:"http://localhost:5173",
        methods:['GET','POST']
    }
});

io.on("connection",socket=>{
    socket.on('get-document', async documentId=>{
        const document = await  getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document',document.data);
        socket.on('send-messages', delta=>{
            // console.log(delta);
            socket.broadcast.to(documentId).emit('receive-messages', delta);
        });

        socket.on("save-document", async data=>{
            await updateDocument(documentId, data);
        })
    })
});