let fs = require('fs');
let express = require('express');
let bodyParser = require('body-parser');
let curateContent = require('./modules/curateContent.module');
let async = require('async');
let activePackPath = '/library/www/html/home/active_packs.json';
let app = express();

let activeContent = JSON.parse(fs.readFileSync(activePackPath)) || ['Please navigate to /findall'];


// ======== Routes ======== //
// app.get('/', (req, res) => {
//   res.render('/library/www/html/home/couchmover.ejs', {
//     data: activeContent
//   });
// })

app.get('/', (req, res) => {
  res.sendFile('/library/www/html/home/couchmover.html');
})

app.use(express.static('/library/www/html/home'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/findall', (req,res) => {
  // hotfix: remove .json from the end of the pack names. Its being doubled up. eg: .json.json
  activeContent = curateContent().map(each=>{return each.split('.json')[0]});
  fs.writeFileSync(activePackPath, JSON.stringify(activeContent));
  console.log('The following packs are active: ', activeContent);
  res.redirect('/');
});

app.get('/curateAll', (req, res) => {
  let information = [];
  let getInformation = (filename, cb) => {
    fs.readFile(`/library/www/html/home/metadata/${filename}.json`, 'utf8', (err, data) => {
      if (err) console.log('error reading from', filename, error);
      let file = fs.readFileSync(`/library/www/html/home/metadata/${filename}.json`, 'utf8');
      file = JSON.parse(file);
      information.push(file);
      cb();
    })
  }
  let done = () => res.send(JSON.stringify(information));
  async.eachSeries(activeContent, getInformation, done); // switch to async. But a solution for ordering will be needed.
});

app.post('/update', (req, res) => {
  console.log(req.body);
  let file = fs.readFileSync(`/library/www/html/home/metadata/${req.body.menuItem}.json`, 'utf8')
  file = JSON.parse(file);
  file.title = req.body.title;
  file.description = req.body.desc;
  console.log(file)
  fs.writeFile(`/library/www/html/home/metadata/${req.body.menuItem}.json`, JSON.stringify(file), (err, response) => {
    if (err) console.log(err);
    res.send('success');
  });
});

app.post('/update', (req,res) => {
  let newOrder = JSON.parse(req.body.order)
  console.log(newOrder)
  fs.writeFileSync(activePackPath, JSON.stringify(newOrder));
  activeContent = newOrder;
  res.send('success')
})

console.log('Listening on port 8081');
app.listen(8081);