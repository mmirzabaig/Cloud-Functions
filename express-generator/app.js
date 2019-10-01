var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

const Admin = require("firebase-admin")
const fetch = require('node-fetch');

Admin.initializeApp();

const addDataToDB = () => {
  console.log('hello')
  const db = Admin.firestore()
        const getAllBreweries = await db.collection('Cities').doc('Austin')
            .collection('Breweries').doc('-AllBreweries')
            .onSnapshot(async(results) => {
            results = results.data().data
            // console.log(results)
             for (let i = 0; i < results.length; i++) {
                await console.log(results[i])
                await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + results[i].place_id + '&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,photos,place_id,price_level,reviews,website&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
                 .then((item)=> {
                    item.json().then(async(data) => {
                        let photos = [];
                        console.log(data.result.name)
                        for (let i = 0; i < data.result.photos.length; i++) {
                            let photo = data.result.photos[i];
                            await setTimeout(async() => {
                                await fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=' + photo.photo_reference + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
                                    .then((doneR)=> {
                                        doneR.json().then((item) => {
                                            console.log(item)
                                            photos.push(item);
                                        })
                                    })
                              }, 2000);
                            
                        }
                        data.result.photos = photos;
                        await db.collection('Cities').doc('Austin')
                            .collection('Breweries').doc(data.result.name)
                            .set(data.result)
                        })
                    })
             }
            //  await this.setState({
            //    brews: results
            //  })
            return results
     })
     return;
}

addDataToDB()
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
