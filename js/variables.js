var isMobile = false;
var mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/;
var docWidth;
var docHeight;
var mouse;
var raycaster;
var renderer;

  
var WEB_SERVICES = {
   HOST: "162.230.119.18",
   LOCALHOST: "127.0.0.1",
   PORT: "888",
   URLS: {
      LOGIN_CHECK:      "/loginCheck",
      USERS:            "/users",
      LOGOUT:           "/logout"
   }
};
var WEB_SOCKETS = {
   HOST: "162.230.119.18",
   LOCALHOST: "127.0.0.1",
   PORT: "888",
   URI: "/ws"
};

var CLICK_PIXEL_ALLOWANCE = 3;
var AXES;
var AXES_LENGTH = 1.5*10;
var CUBES = [];
var MAP_DATA = {};
var EDIT_COMMAND_HISTORY = [];
var ROOMS = [];
var CONNECTIONS = {};
var CURRENT_ROOM;
var PREVIOUS_ROOM;
var STEP_DISTANCE = 10;
var WS;
var ME = {};
var USERS = {};

var DEFAULT_CAMERA = {
   x: 0.15*10,
   y: 3.4*10,
   z: 2.5*10
};

var DEFAULT_ROOM_OPACITY = .8;
var DEFAULT_ROOM_COLOR = "#cccccc";
var DEFAULT_ROOM_SIZE = {
   x: 10,
   y: 10,
   z: 10
};
var MAX_ROOM_SIZE = {
   x: 10,
   y: 10,
   z: 10
};
var DEFAULT_ROOM_SELECT_BOX_COLOR = "#ffff00";
var DIRECTION_COLORS = {
   "n": "#0000FF",
   "s": "#0000FF",
   "e": "#228B22",
   "w": "#228B22",
   "u": "#FF0000",
   "d": "#FF0000",
   "ne": "#FF7E00",
   "sw": "#FF7E00",
   "nw": "#FFFF00",
   "se": "#FFFF00"
};
var DEFAULT_AXES_OPACITY = .5;
var DEFAULT_CONNECTION_COLOR = "#333333";
var DEFAULT_CONNECTION_OPACITY = 1;

var command_map = {
   "n":           "north",
   "north":       "north",
   "s":           "south",
   "south":       "south",
   "e":           "east",
   "east":        "east",
   "w":           "west",
   "west":        "west",
   "u":           "up",
   "up":          "up",
   "d":           "down",
   "down":        "down"
};
