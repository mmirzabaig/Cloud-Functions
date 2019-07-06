const cors = require('cors')({origin: true });
const Admin = require("firebase-admin")
const fetch = require('node-fetch');

Admin.initializeApp();

exports.mirza = async (req, res) => {
    await cors(req,res, async () => {
        let data = [];
        const getData = (nextPageToken) => {
          let city = 'austin';
      
          if (nextPageToken.length > 2) {
            // console.log('NEXT PAGE TOKEN', jsonDa)
            
            let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+' + city + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw&pagetoken=';
            url = url.concat(nextPageToken);
            console.log(url)
              const getAllBrewries = fetch(url)
                  .then(data => data.json())
                  .then(async(jsonData) => {
                    // console.log(jsonData)
                      await data.push(jsonData);
                      // console.log(jsonData)
                      // await console.log(jsonData.next_page_token, '---2')
                      // await console.log(jsonData, 'JSONDATA')
      
      
                      if (jsonData.next_page_token) {
                        await setTimeout(() => {
                            getData(jsonData.next_page_token);
                          }, 2000);
                          // throw(err);
                      } else {
                         res.status(200).json({
                            data: data
                        })  
                          return;
                      }
                  })
          } else {
              const getAllBrewries = fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=breweries+in+${city}&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw`)
              .then(data => data.json())
              .then(async(jsonData) => {
                // console.log(jsonData, 'next')
                   await data.push(jsonData)
                  //  await console.log(jsonData.next_page_token, '---1')
      
                  if (jsonData.next_page_token) {
                    console.log('NEXT PAGE TOKEN 2' ,jsonData.next_page_token)
                    await setTimeout(() => {
                      getData(jsonData.next_page_token);
                    }, 2000);
                      // await ;
                      // throw(err);                  
      
                  } else {
                    res.status(200).json({
                        data: data
                    })  
                      return;
                  }
              
              })
          }
         
          return;
      
        // const getAllBrewriesJson = await getAllBrewries.json();
        // console.log(getAllBrewriesJson, '235253')
      }
      await getData('a');
    //   await res.status(200).json({
    //       data: data
    //   })      
    })
  };