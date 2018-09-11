//requiring packages
const express=require('express');
const http=require('http');
const soc=require('socket.io');
//end of requinig packages



//making app from express main method
const app=express();
//end of making app


//setting for app
app.use('/public',express.static('public'));
app.set('view engine','ejs');
//end of app setting


//making server and sending app to it
const server=http.createServer(app);
//end of making serevre

//making io from socket and server
const io=soc(server);
//end of making server


//requing configs
const {port}=require('./configs/all_project');
//end of configs


//importing controllers
import {mongo_connection} from './controllers/connect_mongo';
//end of importing controllers

mongo_connection.connection();  //connecting to mongodb

//makng namespaces
const tech=io.of('/tech');
const history=io.of('/history');
//end of making namespaces

app.get('/',(req,res)=>{

    res.send({name:'ali jalali',message:'welcome'})
})

app.get('/tech',(req,res)=>{

    res.render('tech')
})

app.get('/history',(req,res)=>{

    res.render('history')
})

app.get('/tech/swift',(req,res)=>{

    res.render('chatroom',{title:'swift',room:'swift'})

})


tech.on('connection',(socket)=>{

    socket.on('join',(data)=>{

        socket.join(data.room);
        tech.in(data.room).emit('event',{text:`someone has joint to ${data.room} chatroom`,type:'connection'});
    
    })

    socket.on('message',(data)=>{

        tech.in(data.room).emit('message',{text:data.text})
    })

    socket.on('disconnect',()=>{

        
    })
})

history.on('connection',(socket)=>{

    console.log('user connectd to history tech')

})



server.listen(port,()=>{

    console.log(`server is running on port ${port}...`)
})