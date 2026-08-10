const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname, port=8123;
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.css':'text/css'};
http.createServer((req,res)=>{
  // endpoint de guardado de iconos (solo para generar los PNG en desarrollo)
  if(req.method==='POST' && req.url==='/_save'){
    let body='';
    req.on('data',d=>{ body+=d; });
    req.on('end',()=>{
      try{
        const {name,b64}=JSON.parse(body);
        if(!/^icon-\d+\.png$/.test(name)) throw new Error('bad name');
        fs.writeFileSync(path.join(root,'icons',name), Buffer.from(b64,'base64'));
        res.writeHead(200); res.end('ok');
      }catch(e){ res.writeHead(400); res.end('err '+e.message); }
    });
    return;
  }
  let p=decodeURIComponent(req.url.split('?')[0]); if(p==='/')p='/index.html';
  const fp=path.join(root,p);
  fs.readFile(fp,(e,d)=>{
    if(e){res.writeHead(404);res.end('404');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(fp)]||'application/octet-stream'});
    res.end(d);
  });
}).listen(port,()=>console.log('Repaso OPOS en http://localhost:'+port));
