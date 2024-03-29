import {useEffect, useState} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import {Box} from '@mui/material';
import styled from "@emotion/styled";

import {io} from 'socket.io-client';

import {useParams} from 'react-router-dom';
const Component = styled.div`
  background: #F5F5F5;
  `

  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];


export default function Editor() {

  const[quill, setQuill] = useState();
  const[socket, setSocket] = useState();
  const {id} = useParams();

  //for rendering text editor when the component is initially mounted
  useEffect(()=>{
    const quillServer = new Quill('#container',{modules:{toolbar:toolbarOptions}, theme:'snow'});
    quillServer.disable();
    quillServer.setText('Loading the document....');
    setQuill(quillServer);
  },[]);

  //for establishing connection to server
  useEffect(()=>{
    const socketServer = io('http://localhost:8005');
    setSocket(socketServer)
    return()=>{
      socketServer.disconnect();
    }
  },[]);

  //to handle the text change
  useEffect(()=>{
    if(socket === null || quill ===  null) return;

    const handleChange=(delta, oldData, source)=>{
      if(source !== 'user') return;

      socket && socket.emit('send-messages',delta);
    }

    quill && quill.on('text-change',handleChange);

    return()=>{
      quill && quill.off('text-change',handleChange)
    }
  },[quill, socket]);

  useEffect(()=>{
    if(socket === null || quill ===  null) return;
    
    const handleChange=(delta)=>{
      quill.updateContents(delta);
    }

    socket && socket.on('receive-messages',handleChange);

    return()=>{
      socket && socket.off('receive-messages',handleChange)
    }
  },[quill, socket]);

  useEffect(()=>{
    if(socket === null || quill ===  null) return;

    socket && socket.once('load-document',document=>{
      quill && quill.setContents(document);
      quill && quill.enable();
    })
    socket && socket.emit('get-document',id);
  },[quill, socket, id]);

  useEffect(()=>{
    if(socket == null && quill == null) return;

    const interval = setInterval(()=>{
        socket && socket.emit('save-document', quill.getContents());
    }, 2000);

    return ()=>{
      clearInterval(interval);
    }
  },[socket, quill])
    
  return (
    <>
    <Component>
      <Box className="container" id='container'></Box>
    </Component>
    </>
  )
}
