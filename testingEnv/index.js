const Admin = require("firebase-admin")
const fetch = require('node-fetch');
Admin.initializeApp();
const db = Admin.firestore()

// console.log('hello')


const saveEachBreweryWithAllPhotosToFirestore = () => {
    const getAllBreweries = () => {
        return new Promise(async(resolve, reject) => {
            await db.collection('Cities').doc('Austin').collection('Breweries').doc('-AllBreweries')
            .onSnapshot((result) => {
                resolve(result.data().data);
            })
        })
    }
    getAllBreweries()
    .then((allBrewriesData) => {
        console.log(allBrewriesData.length, '567897654')

        let i = 0;

        if (i === allBrewriesData.length - 1) {
            return;
        } 


        const getBreweryDetailAndPhotos = (brew) => {
            return new Promise(async(resolve, reject) => {
                try {
                    await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + brew.place_id + '&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,photos,place_id,price_level,reviews,website,geometry&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
                          .then(data => data.json().then(async(allData) => {  
                                allData = allData.result;
                                let photosArray = [];
                                let photosIndex = 0;
                                let allPhotos = async (array) => {
                                    if (photosArray.length === array.length) {
                                        allData.photos = await photosArray;
                                        await i++;
                                        await resolve(allData);
                                        return;
                                    }
                                    let photo = array[photosIndex];
                                    fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=' + photo.photo_reference + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw', {
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        method: 'GET'
                                    })
                                    .then(async(doneR)=> {
                                        await photosArray.push(doneR.url);
                                        await console.log(doneR.url)
                                        if (array.length === 1) {
                                            return;
                                        } else  {
                                            await setTimeout(async() => {
                                                await photosIndex++;
                                                await allPhotos(array)

                                            }, 500)
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                                    // item.result.photos.shift()
                                    // allPhotos(item.result.photos)
                            }

                            await allPhotos(allData.photos);
                          }))
                } catch(err) {
                    reject(err);
                }
                
            })
        }

        getBreweryDetailAndPhotos(allBrewriesData[i])
        .then(async(brewData) => {
            console.log(brewData, 'hello');
            await db.collection('Cities').doc('Austin').collection('Breweries').doc(brewData.name)
            .set(brewData)
            .then((item) => {
                setTimeout(() => {
                    getBreweryDetailAndPhotos(allBrewriesData[i])

                }, 10000)
            })
        })
        // .catch((reRun) => {

        // })
 

    })
}
saveEachBreweryWithAllPhotosToFirestore()


// const addDataToDB = async () => {
//     // console.log('hello')
// //         fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJ236XXrm0RIYRHL-NPzrdEmw&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,photos,place_id,price_level,reviews,website&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
// //         .then(x => x.json().then((item) => {
// //             console.log(item)
// //             // console.log(item)
// //             let allPhotos = (array) => {
// //                 if (array.length === 0) {
// //                     return
// //                 }
// //                     let photo = item.result.photos[0];
// //                         const get = fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=' + photo.photo_reference + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw', {
// //                             headers: {
// //                                 'Content-Type': 'application/json'
// //                             },
// //                             credentials: 'include',
// //                             method: 'GET'
// //                         })
// //                             .then((doneR)=> {
// //                                 console.log(doneR.url)
// //                             })
// //                     item.result.photos.shift()
// //                     allPhotos(item.result.photos)
                
// //             }
// //             allPhotos(['']);
// //         }));
// let GetAllData = async () => {
//     let array = [];
//     await db.collection('Cities').doc('Austin').collection('Breweries')
//     .onSnapshot(async(data) => {
//     data.forEach((item) => {
//         item = item.data();
//         // console.log()
//         // console.log(item, '-------')
//         if (item.photos && item.photos.length < 2) {
//             array.push(item)

//             // console.log(item.photos.length)
//             // console.log(item.photos)
//         } 
//     })
//         await console.log(array.length)
//         return await array;
//     });
//      return await array;
// }

        

//         //   const getAllBreweries = await db.collection('Cities').doc('Austin').collection('Breweries')
//         //       .onSnapshot(async(results) => {

//             // let results = await GetAllData()
            
//             let data = await GetAllData();

//             await console.log(data, '678765')

//               let mainI = 0;

//             //   const fetchPhotosForEach = async () => {

                            
//             //     if (mainI === results) {
//             //         return;
//             //     }
//             //     // await console.log(results[mainI].place_id)
//             //     await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + results[mainI].place_id + '&fields=photos,name&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
//             //     .then(x => x.json().then(async (data) => {
//             //         // await console.log(data)
//             //         let i =  0;
//             //         let photos =  [];
//             //         let allPhotos = async () => {
//             //             //    await console.log(data.result.photos)
//             //             if (i === data.result.photos.length) {
//             //                 return
//             //             }          
//             //             // await console.log('HELLO1')
                  
                        
//             //             // await console.log('HELLO2')

                        
//             //             await console.log(data.result, '5678987654e567890876567898765r')
//             //             if (!typeof(data.result.photos[mainI]) === 'object') {
//             //                  i++;
//             //                   allPhotos();
//             //             }
//             //             if (!data.result.photos[mainI].hasOwnProperty('photo_reference')) {
//             //                  i++;
//             //                   allPhotos();
//             //             }
                        
//             //             // await console.log(i)
//             //             await  fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=' + data.result.photos[mainI].photo_reference + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
//             //                     .then(async(doneR)=> {
//             //                         // await console.log(doneR.url)
//             //                          photos.push(doneR.url)
//             //                         // await console.log(photos, 'photos')

//             //                     })
//             //             // data.result.photos.shift()
                         
                        
//             //                 await   i++;
//             //                 await   allPhotos(data.result.photos);
                  
//             //             // }, 2000);
                        

                    
//             //     }
//             //     await  allPhotos();

//             //     data.result.photos = await photos;
//             //              console.log(data.result.photos, '12')
//             //              console.log(data.result.name, 'name')

//             //     await db.collection('Cities').doc('Austin')
//             //                             .collection('Breweries').doc(data.result.name)
//             //                             .set(data.result)

//             //      mainI++;

//             //      setTimeout(() => {
//             //         fetchPhotosForEach();       
//             //     }, 2000);

//             //     }))
                
                
//             //     return;

//             //   }
//             //   setTimeout(() => {
//             //     fetchPhotosForEach();       
//             // }, 2000);

//             //   console.log(results)
//             //    for (let i = 0; i < results.length; i++) {
//             //     //   await console.log(results[i])
//             //       await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + results[i].place_id + '&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,photos,place_id,price_level,reviews,website&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
//             //        .then((x)=> {
//             //           x.json().then(async(data) => {
//             //               let photos = [];
//             //             //   console.log(data.result)

//             //             let allPhotos = (array) => {
//             //                 if (array.length === 0) {
//             //                     return
//             //                 }
//             //                     let photo = data.result.photos[0];
//             //                         const get = fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=' + photo.photo_reference + '&key=AIzaSyDRUpBESMbs6306QTg9QeIvQmbhApYl2Qw')
//             //                             .then((doneR)=> {
//             //                                 console.log(doneR.url)
//             //                                 photos.push(doneR.url)
//             //                             })
//             //                     data.result.photos.shift()
//             //                     allPhotos(data.result.photos)
                            
//             //             }
//             //             await allPhotos(['']);
//             //              data.result.photos = photos;
//             //              await console.log(photos, 'allphotos')
//             //               await console.log(data.result.photos, 'console.log dataphotos')
//             //               await db.collection('Cities').doc('Austin')
//             //                   .collection('Breweries').doc(data.result.name)
//             //                   .set(data.result)
//             //               })
//             //           })
//             //    }
//               //  await this.setState({
//               //    brews: results
//               //  })
//     //           return results
//     //    })
//        return;
//   }
  
//   addDataToDB()