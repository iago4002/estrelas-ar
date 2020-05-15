// getting places from APIs
function loadPlaces(position) {
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
    // first get current user location
    return navigator.geolocation.getCurrentPosition(function (position) {

        // than use it to load from remote APIs some places nearby
        loadPlaces(position.coords)
            .then((places) => {
              //places.forEach((place) => {
                place = places[0]                             
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                // add place name
                const placeText = document.createElement('a-text');                
                placeText.setAttribute('gps-entity-place', `latitude: ${ round(latitude + 0.000278, latitude.toString().length).toString() }; longitude: ${ round(longitude + 0.000985, longitude.toString().length).toString() };`);
                placeText.setAttribute('value', place.message);
                placeText.setAttribute('rotation', '0 -85 0');
                placeText.setAttribute('scale', '15 15 15');
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
