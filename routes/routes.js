var express = require('express');
var router = express.Router();
var csv = require("fast-csv");
var path = require("path");
var filepath = path.join(__dirname,'../data/data.csv')
var dataStore = [];
csv
 .fromPath(filepath,{
   headers:true
 })
 .on("data", function(data){
   dataStore.push(data);
 })
 .on("end", function(){
     console.log("Data loaded");
 });

router.get('/', function(req, res, next) {
  res.send('Working');
});

router.get('/listings', (req,res) => {
  let results = dataStore;
  if (req.query.min_price) {
    results = results.filter(datum => datum.price >= req.query.min_price)
  }
  if (req.query.max_price) {
    results = results.filter(datum => datum.price <= req.query.max_price)
  }
  if (req.query.min_bed) {
    results = results.filter(datum => datum.bedrooms >= req.query.min_bed)
  }
  if (req.query.max_bed) {
    results = results.filter(datum => datum.bedrooms <= req.query.max_bed)
  }
  if (req.query.min_bath) {
    results = results.filter(datum => datum.bathrooms >= req.query.min_bath)
  }
  if (req.query.max_bath) {
    results = results.filter(datum => datum.bathrooms <= req.query.max_bath)
  }
  results = results.map(datum => {
    return {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [parseFloat(datum.lng),parseFloat(datum.lat)],
      },
      "properties": {
        "id": datum.id,
        "price": datum.price,
        "street": datum.street,
        "bedrooms": datum.bedrooms,
        "bathrooms": datum.bathrooms,
        "sq_ft": datum.sq_ft,
      },
    }
  })
  res.json({
    number: results.length,
    results: {
      "type":"Feature",
      "features": results,
    },
  })
})
module.exports = router;
