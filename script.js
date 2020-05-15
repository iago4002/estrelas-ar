// getting places from APIs
function loadPlaces(position) {
    const params = {
        radius: 300,    // search places not farther than this value (in meters)
        clientId: '2AKDDBDIUOBMSEWJPITO1BMZFG2S2LJLKMELJ4KEBYZUJKOX',
        clientSecret: 'WWPKKJS1VNT3ZYVCWRSRDMB2Z2O1XC3VARFDMZWD3UJGBAH5',
        version: '20300101',    // foursquare versioning, required but unuseful for this demo
    };

    // Foursquare API (limit param: number of maximum places to fetch)
    var url = new URL(window.location.href);
    var c = url.searchParams.get("code");
    endpoint = "https://estrelas-277117.uk.r.appspot.com/api/v1/messages?code=" + c
    return fetch(endpoint, {method: 'GET'})
      .then((res) => {
        return res.json()
          .then((resp) => {
            return resp;
          })
      })
      .catch((err) => {
        console.error('Error with places API', err);
    })
    
    // const endpoint = `https://api.foursquare.com/v2/venues/search?intent=checkin
    //     &ll=${position.latitude},${position.longitude}
    //     &radius=${params.radius}
    //     &client_id=${params.clientId}
    //     &client_secret=${params.clientSecret}
    //     &limit=30 
    //     &v=${params.version}`;
    // return fetch(endpoint)
    //     .then((res) => {
    //         return res.json()
    //             .then((resp) => {
    //                 return resp.response.venues;
    //             })
    //     })
    //     .catch((err) => {
    //         console.error('Error with places API', err);
    //     })
};

const round = (num, places) => {
	if (!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + places)  + "e-" + places);
	} else {
		let arr = ("" + num).split("e");
		let sig = ""
		if (+arr[1] + places > 0) {
			sig = "+";
		}

		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
	}
}


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
        loadPlaces(position.coords)
            .then((places) => {
              //places.forEach((place) => {
                place = places[0]                
                const latitude = place.lat;
                const longitude = place.lng;                    
                // add place name
                const placeText = document.createElement('a-text');                
                placeText.setAttribute('gps-entity-place', `latitude: ${ round(parseInt(latitude) + 0.000146, 6).toString() }; longitude: ${ round(parseInt(longitude) + 0.000175, 6).toString() };`);
                placeText.setAttribute('value', place.message);
                placeText.setAttribute('scale', '25 25 25');
                placeText.setAttribute('height', '30');
                
                placeText.addEventListener('loaded', () => {
                    window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                });

                scene.appendChild(placeText);
              //});
            })
    },
      (err) => console.error('Error in retrieving position', err),
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 27000,
        }
    );
};
