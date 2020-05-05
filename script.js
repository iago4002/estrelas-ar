// getting places from APIs
function loadPlaces(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: '2AKDDBDIUOBMSEWJPITO1BMZFG2S2LJLKMELJ4KEBYZUJKOX',
        clientSecret: 'WWPKKJS1VNT3ZYVCWRSRDMB2Z2O1XC3VARFDMZWD3UJGBAH5',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // CORS Proxy to avoid CORS problems
    //const corsProxy = 'https://estrelas-ar.herokuapp.com/';

    // Foursquare API (limit param: number of maximum places to fetch)
    const endpoint = `https://api.foursquare.com/v2/venues/search?intent=checkin
        &ll=${position.latitude},${position.longitude}
        &radius=${params.radius}
        &client_id=${params.clientId}
        &client_secret=${params.clientSecret}
        &limit=30 
        &v=${params.version}`;
    return fetch(endpoint)
        .then((res) => {
            return res.json()
                .then((resp) => {
                    return resp.response.venues;
                })
        })
        .catch((err) => {
            console.error('Error with places API', err);
        })
};


window.onload = () => {
    const scene = document.querySelector('a-scene');
    places_fixed = [
      {
        'location': {
          'lat': '-23.4551376',
          'lng': '-46.5936074'
        },
        'name': 'Teste 1'
      },
      {
        'location': {
          'lat': '-23.674034',
          'lng': '-46.736119'
        },
        'name': 'Teste 2'
      },
      {
        'location': {
          'lat': '-23.674648',
          'lng': '-46.736732'
        },
        'name': 'Teste 3'
      }
    ]

    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        // loadPlaces(position.coords)
        //     .then((places) => {
              places_fixed.forEach((place) => {
                const latitude = place.location.lat;
                const longitude = place.location.lng;                    
                // add place name
                const placeText = document.createElement('a-text');
                placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                placeText.setAttribute('value', place.name);
                placeText.setAttribute('scale', '15 15 15');
                placeText.setAttribute('position', '0 0 0');
                
                placeText.addEventListener('loaded', () => {
                    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                });

                scene.appendChild(placeText);
              });              
            //})
    },
        (err) => console.error('Error in retrieving position', err),
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 27000,
        }
    );
};
