const Stream = require('node-rtsp-stream-jsmpeg');

module.exports = () => {
  
  /* const stream = new Stream({
    name: 'name',
    streamUrl: 'rtsp://admin:Asodariya$1@192.168.1.110/Streaming/Channels/101',
    wsPort: 3001,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30 // options with required values specify the value after the key
    }
  });
  // console.log(stream, "stream") */
  const options = {
    name: 'streamName',
    url: 'rtsp://admin:Asodariya$1@192.168.1.110/Streaming/Channels/101',
    wsPort: 3001
  }
    
  const stream = new Stream(options)
  try{    
    stream.start();
  }catch(err){
    stream.start();
  }
  
}