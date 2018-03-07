// Locations used in project each with name and position
var locations = [
    {
        name: 'Alexandria University',
        position: {
            lat: 31.2105,
            lng: 29.9132
        }
    },
    {
        name: 'Cairo University',
        position: {
            lat: 30.0273,
            lng: 31.2086
        }
    },
    {
        name: 'Ain Shams University',
        position: {
            lat: 30.0758,
            lng: 31.2811
        }
    },
    {
        name: 'Mansoura University',
        position: {
            lat: 31.0431,
            lng: 31.3567
        }
    },
    {
        name: 'Al-Azhar University',
        position: {
            lat: 30.0594,
            lng: 31.3136
        }
    },
    {
        name: 'Zagazig University',
        position: {
            lat: 30.5877,
            lng: 31.4828
        }
    },
    {
        name: 'October 6 University',
        position: {
            lat: 29.9763,
            lng: 30.9482
        }
    },
    {
        name: 'Helwan University',
        position: {
            lat: 29.866667,
            lng: 31.316667
        }
    },
    {
        name: 'South Valley University',
        position: {
            lat: 26.1921,
            lng: 32.7453
        }
    },
    {
        name: 'Assiut University',
        position: {
            lat: 27.1889,
            lng: 31.1686
        }
    },
    {
        name: 'Fayoum University',
        position: {
            lat: 29.3198,
            lng: 30.8355
        }
    },
    {
        name: 'Kafrelsheikh University',
        position: {
            lat: 31.1007,
            lng: 30.9508
        }
    },
    {
        name: 'Tanta University',
        position: {
            lat: 30.792555,
            lng: 30.999146
        }
    },
    {
        name: 'Sinai University',
        position: {
            lat: 31.1148,
            lng: 33.6907
        }
    },
    {
        name: 'Suez Canal University',
        position: {
            lat: 30.6205,
            lng: 32.2697
        }
    },
    {
        name: 'Beni Suef University',
        position: {
            lat: 29.0828,
            lng: 31.1022
        }
    },
    {
        name: 'Minya University',
        position: {
            lat: 28.123274,
            lng: 30.734760
        }
    },
    {
        name: 'Menoufia University',
        position: {
            lat: 30.565580,
            lng: 31.013077
        }
    },
    {
        name: 'Sohaj University',
        position: {
            lat: 26.563734,
            lng: 31.707382
        }
    },
    {
        name: 'Damanhour University',
        position: {
            lat: 31.036234,
            lng: 30.457579
        }
    },
    {
        name: 'Aswan University',
        position: {
            lat: 23.996557,
            lng: 32.859903
        }
    },
    {
        name: 'University of Sadat City',
        position: {
            lat: 30.3697,
            lng: 30.4974
        }
    },
    {
        name: 'Misr University',
        position: {
            lat: 29.9965,
            lng: 30.9654
        }
    }
];

// global variables used by google maps api
var map, infoWindow, bounds;

// this function is loaded when google api is loaded
function initMap() {

    // creating map element and set its default options
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 26.8206,
            lng: 30.8025
        },
        zoom: 6
    });

    // creating a sigle infoWindow to be used by all markers
    infoWindow = new google.maps.InfoWindow();

    // map bounds
    bounds = new google.maps.LatLngBounds();

    // foursquare api id keys
    var clientID = 'BQCULXCHOIO1E0AQK3140N33APHVX0YK2QXUP5INWF5HK5DI',
        clientSecret = 'DBA4QTVMN0V1WJ1KMXNZA5CFO4CDL33IJ1ZZVNRKBTPBS5HK';

    // 'Location' is a function represent every single location and contains all location's attributes
    var Location = function (data) {
        // save this context to be used in internal scopes contexts
        var self = this;

        // locations data
        this.name = data.name;
        this.position = data.position;
        this.URL = "";
        this.street = "";
        this.city = "";
        this.phone = "";

        // constructing foursquare request url
        var requestURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118&query=' + this.name;

        // foursquare request call
        fetch(requestURL).then(function (data) {
            return data.json();
        }).catch(function (e) {
            alert('There was an error with recieving data. Please refresh the page and try again to load location data.\nLocation: ' + self.name);
        }).then(function (res) {
            result = res.response.venues[0];
            self.URL = result.url ? result.url : '';
            self.street = result.location.formattedAddress[0] || '';
            self.city = result.location.formattedAddress[1] || '';
            self.phone = result.contact.phone ? result.contact.phone : '';
        }).catch(function (e) {
            alert("can't fetch data\nLocation: " + self.name );
        });

        // creating location marker and set its options
        this.marker = new google.maps.Marker({
            position: {
                lat: self.position.lat,
                lng: self.position.lng
            },
            map: map,
            title: self.name,
            animation: google.maps.Animation.DROP,
            icon: "img/marker.png"
        });

        // extend map bounds with locations
        bounds.extend(this.position);

        // visibility of a location a the app page
        this.visible = ko.observable(true);
        
        // set location marker visibilty on the map
        this.markerVisbility = ko.computed(function () {
            if (self.visible()) {
                self.marker.setMap(map);
            } else {
                self.marker.setMap(null);
            }
            return true;
        }, self);

        // handle marker click action listener
        this.marker.addListener('click', function () {
            var contentString = '<div><div><b>' + data.name + "</b></div>" +
                '<div><a href="' + self.URL + '">' + self.URL + "</a></div>" +
                '<div>' + self.street + "</div>" +
                '<div>' + self.city + "</div>" +
                '<div><a href="tel:' + self.phone + '">' + self.phone + "</a></div></div>";

            infoWindow.setContent(contentString);

            infoWindow.open(map, this);

            map.panTo(this.position);

            self.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function () {
                self.marker.setAnimation(null);
            }, 2100);
        });

        // triggers marker click function when the location list item is clicked
        this.select = function (place) {
            google.maps.event.trigger(self.marker, 'click');
        };

    };

    // view model class used in app with knockoutJS
    var ViewModel = function () {
        var self = this;

        // display state of side bar
        this.isShowList = ko.observable(false);

        // toggle side bar visibility
        this.toggleList = function () {
            self.isShowList(!self.isShowList());
        };

        // filter query text
        this.filterQuery = ko.observable("");

        // array contains all locations displayed on the map
        this.locationsList = ko.observableArray([]);

        // get locations names and positions and then initilize it and add to location array
        locations.forEach(function (locationItem) {
            self.locationsList().push(new Location(locationItem));
        });

        // fit map bounds with the bounds of markers area
        map.fitBounds(bounds);

        // filter locations displayed with filter query 
        this.filtedLocations = ko.computed(function () {
            var filter = self.filterQuery().toLowerCase();
            // display all locations when filter query is empty
            if (!filter) {
                self.locationsList().forEach(function (locationItem) {
                    locationItem.visible(true);
                });
                return self.locationsList();
            } else {
                return ko.utils.arrayFilter(self.locationsList(), function (locationItem) {
                    var locName = locationItem.name.toLowerCase();
                    var res = (locName.search(filter) >= 0);
                    locationItem.visible(res);
                    return res;
                });
            }
        }, self);

        // hide side bar for small screen width on window resize and display on wide screens
        $(window).resize(function () {
            if ($(window).width() <= 512)
                self.isShowList(false);
            else self.isShowList(true);
        });

        // hide side bar for small screen width on window load and display on wide screens
        $(window).on('load', function () {
            if ($(window).width() <= 512)
                self.isShowList(false);
            else self.isShowList(true);
        });

        // reset map bounds when map div is resized
        $('#map').resize(function () {
            map.fitBounds(bounds);
        });
    };

    // activate knockout bindings
    ko.applyBindings(new ViewModel());
}

function googleError() {
	alert("Google Maps has failed to load. Please check your internet connection and try again.");
}