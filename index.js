let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let curateContent = require('./modules/curateContent.module');
let activePackPath = '/library/www/html/home/active_packs.json';
let app = express();


// ======== Run on Boot ======== //
// hotfix: remove .json from the end of the pack names. Its being doubled up. eg: .json.json
let activeContent = curateContent().map(each=>{return each.split('.json')[0]});
fs.writeFileSync(activePackPath, JSON.stringify(activeContent));
console.log('The following packs are active: ', activeContent);

// ======== Routes ======== //
app.get('/', (req, res) => {
  res.sendFile('/library/www/html/home/couchmover.html');
})

app.use(express.static('/library/www/html/home'));
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/update', (req,res) => {
  let newOrder = JSON.parse(req.body.order)
  console.log(newOrder)
  res.send('success')
})


console.log('Listening on port 8081');
app.listen(8081);