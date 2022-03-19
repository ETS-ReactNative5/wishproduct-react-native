const fs = require('fs');
let content = fs.readFileSync('./app/enviroments/env.development.js');
if(!process.env.NODE_ENV){
  process.env.NODE_ENV = 'development';
}
if(process.env.NODE_ENV === 'production'){
  content = fs.readFileSync('./app/enviroments/env.production.js');
}
fs.writeFileSync('./app/enviroments/env.js', content, {});
console.log(`overwrite file env success NODE_ENV=`, process.env.NODE_ENV);
process.exit(0);