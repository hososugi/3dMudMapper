

var Room = function(params){
   var color =         DEFAULT_ROOM_COLOR;
   var description =  "";
   var dimensions =   {
      x:                DEFAULT_ROOM_SIZE.x,
      y:                DEFAULT_ROOM_SIZE.y,
      z:                DEFAULT_ROOM_SIZE.z
   };
   var exits =         {
      "n":              null,
      "e":              null,
      "s":              null,
      "w":              null,
      "u":              null,
      "d":              null,
      "nw":             null,
      "ne":             null,
      "se":             null,
      "sw":             null
   };
   var id =          (ROOMS.length-1);
   var name =         "";
   var opacity =      DEFAULT_ROOM_OPACITY;
   
   // Getters
   this.getColor = function(){
      return color;
   };
   this.getDescription = function(){
      return description;
   };
   this.getDimension = function(dim){
      if(dimensions.hasOwnProperty(dim))
         return dimensions[dim];
      else
         return false;
   };
   this.getDimensions = function(){
      return dimensions;
   };
   this.getExits = function(){
      return exits;
   };
   this.getId = function(){
      return id;
   };
   this.getName = function(){
      return name;
   };
   this.getOpacity = function(){
      return opacity;
   };
   
   // Setters
   this.setColor = function(value){
      var oldValue = color;
      color = value;
      
      return oldValue;
   };
   this.setDescription = function(value){
      var oldValue = description;
      description = value;
      
      return oldValue;
   };
   this.setDimension = function(dim, value){
      if(dimensions.hasOwnProperty(dim))
      {
         var oldValue = dimensions[dim];
         dimensions[dim] = value;

         return oldValue;
      }
      else
         return false;
   };
   this.setDimensions = function(value){
      var oldValue = dimensions;
      dimensions = value;
      
      return oldValue;
   };
   this.setExits = function(value){
      var oldValue = exits;
      exits = value;
      
      return oldValue;
   };
   this.setName = function(value){
      var oldValue = name;
      name = value;
      
      return oldValue;
   };
   this.setOpacity = function(value){
      var oldValue = opacity;
      opacity = value;
      
      return oldValue;
   };
   
   var constructor = function(params){
      if(typeof params !== "undefined")
      {
         if(params.hasOwnProperty('color'))
            color = params.color;
         if(params.hasOwnProperty('description'))
            description = params.description;
         if(params.hasOwnProperty('dimensions'))
            dimensions = params.dimensions;
         if(params.hasOwnProperty(''))
            exits = params.exits;
         if(params.hasOwnProperty('id'))
            id = params.id;
         if(params.hasOwnProperty('name'))
            name = params.name;
         if(params.hasOwnProperty('opacity'))
            opacity = params.opacity;
      }
   };
   
   constructor(params);
};