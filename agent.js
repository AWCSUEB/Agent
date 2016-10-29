/*var ports = {
    "SFO": {lat: 37.6213129, lng: -122.3789554},
    "ATL": {lat: 33.6407282, lng: -84.4277001},
    "DAL": {lat: 32.8481029, lng: -96.8512063},
    "LAX": {lat: 33.9415889, lng: -118.40853},
    "SEA": {lat: 47.4502499, lng: -122.3088165},
    "STL": {lat: 38.7161686, lng: -90.3534764},
    "MIA": {lat: 25.795865, lng: -80.2870457},
    "CLE": {lat: 41.4124339, lng: -81.8479925},
    "DEN": {lat: 39.8630625, lng: -104.6737477},
    "BOS": {lat: 42.3656132, lng: -71.0095602},
    "SLC": {lat: 40.78426, lng: -111.98048},
    "MSP": {lat: 44.8847554, lng: -93.2222846},
    "PDX": {lat: 45.588654, lng: -122.593117},
    "HOU": {lat: 29.6529506, lng: -95.2766507},
    "BWI": {lat: 39.1774042, lng: -76.6683922},
    "BIS": {lat: 46.775111, lng: -100.7573875}
};*/

var ports = {
    "A": {lat: 37.6213129, lng: -122.3789554},
    "B": {lat: 33.6407282, lng: -84.4277001},
    "C": {lat: 32.8481029, lng: -96.8512063},
    "D": {lat: 33.9415889, lng: -118.40853},
    "E": {lat: 47.4502499, lng: -122.3088165},
    "F": {lat: 38.7161686, lng: -90.3534764},
    "G": {lat: 25.795865, lng: -80.2870457},
    "H": {lat: 41.4124339, lng: -81.8479925},
    "I": {lat: 39.8630625, lng: -104.6737477},
    "J": {lat: 42.3656132, lng: -71.0095602},
    "K": {lat: 40.78426, lng: -111.98048},
    "L": {lat: 44.8847554, lng: -93.2222846},
    "M": {lat: 45.588654, lng: -122.593117},
    "N": {lat: 29.6529506, lng: -95.2766507},
    "O": {lat: 39.1774042, lng: -76.6683922},
    "P": {lat: 46.775111, lng: -100.7573875}
};

function queueList(length) {
    var portNames = Object.keys(ports);
    var list = {};

    for (var i=0; i<length; i++) {
        var a = parseInt(Math.random() * portNames.length);
        var b = parseInt(Math.random() * portNames.length);

        // duplicate resolution
        if (a == b) {
            b = (b + 1) % portNames.length;
        }

        var c1 = portNames[a];
        var c2 = portNames[b];
        var pair;

        // order pair alphabetically for easier comparison
        if (c1 < c2) {
            pair = c1 + c2;
        } else {
            pair = c2 + c1;
        }

        // add to result list
        if (undefined == list[pair]) {
            list[pair] = {"c1": c1, "c2": c2, "coord1": ports[c1], "coord2": ports[c2]};
        } else {
            i--; // repeat loop if we already have this pair
        }
    }

    return list;
}

function adjList() {
    var adj = {};

    for (var l in lines) {
        if (lines[l].hold) {
            if (!adj[l[0]]) {
                adj[l[0]] = [];
            }

            if (!adj[l[1]]) {
                adj[l[1]] = [];
            }

            adj[l[0]].push(l[1]);
            adj[l[1]].push(l[0]);
        }
    }

    return adj;
}

function pathCost(path) {
    var cost = 0;
    var p1 = path[0];
    var p2;
    for (var i=1; i<path.length; i++) {
        p2 = path[i];
        if (p1 < p2) {
            cost += labels[p1 + p2].route.cost;
        } else {
            cost += labels[p2 + p1].route.cost;
        }
        p1 = p2;
    }

    return cost;
}

function pathExists(strict) {
    var visited = [];
    var path = [];
    var adj = adjList();
    var cost = 0;
    var result = [];

    var linesheld = 0;

    for (var l in lines) {
        if (lines[l].hold) {
            linesheld++;
        }
    }

    if (context) {
        if (search(context.c1, context.c2, visited, path, adj)) {
            // strict means only return a result if there is a single path (no extraneous lines)
            // non strict means more than one path, return first one found
            if (strict) {
                if ((path.length - 1) == linesheld) {
                    result = path;
                } else {
                    result = [];
                }
            } else {
                result = path;
            }
        }
    }

    return result;
}

function search(n1, n2, visited, path, adj) {
    visited.push(n1);

    if (n1 == n2) {
        path.push(n1);
        return true;
    }

    var nbr = adj[n1];
    for (var n in nbr) {
        if ($.inArray(nbr[n], visited) >= 0) {
            continue;
        }

        if (search(nbr[n], n2, visited, path, adj)) {
            path.push(n1);
            return true;
        }
    }

    return false;
}

var styles = [
    {
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#212121"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#9e9e9e"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#bdbdbd"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "poi.business",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#181818"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#1b1b1b"
            }
        ]
    },
    {
        "featureType": "road",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#2c2c2c"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#8a8a8a"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#373737"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#3c3c3c"
            }
        ]
    },
    {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#4e4e4e"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#616161"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#757575"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#3d3d3d"
            }
        ]
    }
]