
$(document).ready(function()
{
   docWidth = $(document).width();
   docHeight = $(document).height();
   
   
   setupLogin();
   
   //setupMenu();
   //setupGame();
   
   // Check if logged in already.
   //checkLoggedIn(); 
});

$(window).resize(function()
{
   if(typeof camera !== "undefined" && typeof renderer !== "undefined")
   {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );
   }
});

//$(document).on('click','canvas',canvasMouseClick);


function checkLoggedIn()
{
   
   if($.cookie('sessionKey'))
   {
      // Make ajax call to see if session is still valid.
      var sessionKey = $.cookie('sessionKey');
      var url        = "http://"+WEB_SERVICES.HOST+":"+WEB_SERVICES.PORT+WEB_SERVICES.URLS.LOGIN_CHECK; //http://localhost:8888/loginCheck 
      
      $.ajax({
         url: url,
         cache: false,
         crossDomain: true,
         dataType: 'JSONP',
         data: {
            sessionKey: sessionKey
         },
         success: function(returnData) {
            if(typeof returnData !== "undefined" && returnData.hasOwnProperty('status') && returnData.status == "pass")
            {               
               $("#user").html($.cookie('username'));
               $("#userContainer").show();
               
               ME = {
                  id: $.cookie('id'),
                  username: $.cookie('username'),
                  nickname: $.cookie('nickname'),
                  sessionKey: $.cookie('sessionKey'),
                  role: $.cookie('role'),
                  email: $.cookie('email')
               };
               
               
               getUsers();
               setupChat();
            }
            else
               console.log("Show login error.");
               setupLogin();
         },
         error: function() {
            console.log("Ajax error to "+url);
            setupLogin();
         }
      });
   }
   //else
   //   setupLogin();
   
   setupLogout();
}

function setupLogin()
{
   console.log("setupLogin()");
   $("#login_username").focus();
   
   $("#login_username").keyup(function(event){
      if(event.which == 13)
         $("#login_password").focus();
   });
   
   $("#login_password").keyup(function(event){
      if(event.which == 13)
         $("#login_button").click();
   });
   
   $("#login_button").unbind('click').click(function(event)
   {
      console.log("login_button clicked.");
      var username   = $("#login_username").val();
      var password   = $("#login_password").val();
      var url        = "http://"+WEB_SERVICES.HOST+":"+WEB_SERVICES.PORT+WEB_SERVICES.URLS.LOGIN_CHECK; //http://localhost:8888/loginCheck      
      
      /*
      $.ajax({
         url: url,
         cache: false,
         crossDomain: true,
         dataType: 'JSONP',
         data: {
            username: username,
            password: password
         },
         success: function(returnData) {
            if(typeof returnData !== "undefined" && returnData.hasOwnProperty('status') && returnData.status == "pass")
            {
               ME = returnData.data;
               
               $.cookie('id', ME.id);
               $.cookie('username', ME.username);
               $.cookie('nickname', ME.nickname);
               $.cookie('role', ME.role);
               $.cookie('email', ME.email);
               $.cookie('sessionKey', ME.sessionKey);
               
               $("#user").html(ME.username);
               $("#userContainer").show();
               
               getUsers();
               setupChat();
            }
            else
               console.log("Show login error.");
         },
         error: function() {
            console.log("Ajax error to "+url);
         }
      });
      */
     
     setupLogout();
     setupEditor();
      
   });
}

function setupLogout()
{
   $("#menu_logout").click(function(event)
   {
      console.log("Logout clicked.");
      window.location.href = './';
      
      
      event.preventDefault();
      
      var url = "http://"+WEB_SERVICES.HOST+":"+WEB_SERVICES.PORT+WEB_SERVICES.URLS.LOGOUT;
      
      $.ajax({
         url: url,
         cache: false,
         crossDomain: true,
         dataType: 'JSONP',
         data: {
            id: ME.id,
            sessionKey: ME.sessionKey
         },
         success: function(returnData) {
            var cookies = $.cookie();
            for(var cookie in cookies) {
               $.removeCookie(cookie);
            }
            
            window.location.href = './';
         },
         error: function() {
            console.log("Ajax error to "+url);
         }
      });
   });
   
}

function setupEditor()
{   
   $("#loginRow").hide("fast");
   $("#gameRow").show("fast", function(){
      $("footer").show();
      
      setupMenus();
      setupScene();
      setupCamera();
      setupLighting();
      //addInitialRoom();
      addRoom();

      renderer.render(scene, camera);

      animate();
      
   });
}

function setupMenus(){
   
   $('.menu').draggable({
      handle:'.menu-header',
      start: function(event, ui){
      },
      stop: function(event, ui){
      }
   });
   
   // Set up default room cube opacity.
   $("#option-room-opacity").val(DEFAULT_ROOM_OPACITY * 100)
   .change(function(){
      var newVal = $(this).val()/100;
      
      DEFAULT_ROOM_OPACITY = newVal;
   });
   /*.change(function(){
      var newVal = $(this).val()/100;
      if(typeof currentRoom !== "undefined")
         currentRoom.material.opacity = newVal;
   });*/
   
   // Set up default room cube opacity.
   $("#option-room-sizeWidth").val(DEFAULT_ROOM_SIZE.x * 100)
   .change(function(){
      var newVal = $(this).val();
      
      DEFAULT_ROOM_SIZE.x = newVal/100;
   });
   $("#option-room-sizeHeight").val(DEFAULT_ROOM_SIZE.y * 100)
   .change(function(){
      var newVal = $(this).val();
      
      DEFAULT_ROOM_SIZE.y = newVal/100;
   });
   $("#option-room-sizeDepth").val(DEFAULT_ROOM_SIZE.z * 100)
   .change(function(){
      var newVal = $(this).val();
      
      DEFAULT_ROOM_SIZE.z = newVal/100;
   });
   
   // Set up default room cube color.
   $("#option-room-color").val(DEFAULT_ROOM_COLOR)
   .change(function(){
      var newVal = $(this).val();
      
      DEFAULT_ROOM_COLOR = newVal;
   });
   
   // Set up default room box cube selection color.
   $("#option-room-selectBox").val(DEFAULT_ROOM_SELECT_BOX_COLOR)
   .change(function(){
      var newVal = $(this).val();
      
      DEFAULT_ROOM_SELECT_BOX_COLOR = newVal;
      
      if(typeof selectBox !== "undefined")
      {
         selectBox.material.color.set(newVal);
      }
   });
   
   // Set up direction colors.
   $("#option-axes-colors").find('input').each(function(){
      var direction = $(this).data('direction');
      var color = DIRECTION_COLORS[direction];
      
      $(this).val(color);
   });
   
   // Set up default axes opacity.
   $("#option-axes-opacity").val(DEFAULT_AXES_OPACITY * 100)
   .change(function(){
      var newVal = $(this).val()/100;
      
      DEFAULT_AXES_OPACITY = newVal;
      if(typeof AXES !== "undefined")
      {
         for(axisInd in AXES.children)
         {
            var AXES = AXES.children[axisInd];
            AXES.material.opacity = newVal;
         }
      }
   });
   
   setupEditingInput();
   
}

function setupScene()
{
   scene = new THREE.Scene();

   windowWidth = $("#gameRow").innerWidth();
   windowHeight = $("body").innerHeight() - $("header").outerHeight();
   windowRatio = windowWidth/windowHeight;
   
   // Create the renderer.
   renderer = new THREE.WebGLRenderer({antialias: true});
   renderer.setSize(windowWidth, windowHeight);
   renderer.setClearColor(0xFFFFFF, 1);
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
   $("#gameRow").append(renderer.domElement);
   
   mouse = new THREE.Vector2();
   raycaster = new THREE.Raycaster();
   
   $(renderer.domElement)
   .mousedown(function(event){
      $(this).data('clicking', true);
      $(this).data('click-location', {x: event.clientX, y: event.clientY});
      
   })
   .mouseup(function(event){
      $(this).data('clicking', false);
      var oldLocation = $(this).data('click-location');
      
      if(Math.abs(event.clientX-oldLocation.x) <= CLICK_PIXEL_ALLOWANCE && Math.abs(event.clientY-oldLocation.y) <= CLICK_PIXEL_ALLOWANCE)
         canvasMouseClick(event);
      else
         console.log("Drag instead of click. Allowance: "+CLICK_PIXEL_ALLOWANCE+"px");
   });
}

function setupCamera()
{
   camera = new THREE.PerspectiveCamera(75, windowRatio, 0.1, 1000);
   camera.position.set(DEFAULT_CAMERA.x, DEFAULT_CAMERA.y, DEFAULT_CAMERA.z);
   camera.up = new THREE.Vector3(0,1,0);
   camera.lookAt(new THREE.Vector3(0,0,0));
   
   scene.add(camera);
   
   /*
   var moveCamera = function(newSpeed){
      
      cameraCurrentSpeed = newSpeed;
         
      
      //camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), radians);
      //camera.lookAt(new THREE.Vector3(0,0,0));
   };
   
   $('canvas').bind('touchstart',function(event)
   {
      event.stopPropagation();
      event.preventDefault();
      
      var xPosition = event.pageX;
      if(event.type == "touchstart")
         xPosition = event.originalEvent.changedTouches[0].pageX;
      
      if(xPosition > (windowWidth/2))
         moveCamera(cameraSpeed);
      else
         moveCamera(-cameraSpeed);
      
      return false;
   });
   
   $('canvas').bind('touchend',function(event)
   {
      event.stopPropagation();
      event.preventDefault();
      
      moveCamera(0);
   });
   */
   
   
   controls = new THREE.OrbitControls(camera, renderer.domElement);
   /*controls.damping = 0.2;
   controls.addEventListener('change', function(){
      renderer.render(scene, camera);
   });
   */
   
   //controls = new THREE.TrackballControls(camera, renderer.domElement);

   controls.rotateSpeed = 2.0;
   controls.zoomSpeed = 1.2;
   controls.panSpeed = 0.8;
   controls.noZoom = false;
   controls.noPan = false;
   controls.staticMoving = true;
   controls.dynamicDampingFactor = 0.3;
   controls.keys = [ 65, 83, 68 ];
   controls.addEventListener('change', function(event){
      renderer.render(scene, camera);
   } );
}

function setupLighting()
{
   var lightPosition = {x:-10,y: 50,z: 30};
   
   // Add a light.
   ambientLight = new THREE.AmbientLight(0xcccccc);
   scene.add(ambientLight);
   
   spotLight                     = new THREE.SpotLight( 0x333333 );
   spotLight.position.set(lightPosition.x, lightPosition.y, lightPosition.z);	
   spotLight.castShadow          = true;
   spotLight.shadowCameraNear    = 500;
   spotLight.shadowCameraFar     = 4000;
   spotLight.shadowCameraFov     = 30;	
   spotLight.shadowDarkness      = 0.1;
   spotLight.shadowCameraVisible = false;
   //scene.add(spotLight);
   
   dirLight = new THREE.DirectionalLight(0x333333, 0.5);
   dirLight.shadowDarkness = 0.8;
   dirLight.position.set(-1, 1, 0); // the direction the light comes from
   scene.add(dirLight);
}

function animate()
{
   requestAnimationFrame(animate);
   
   //camera.position.x += cameraCurrentSpeed;
   //camera.lookAt(new THREE.Vector3(0,0,0));
   
   // Render the scene.
   renderer.render(scene, camera);
   controls.update();

}

function buildAxis(src, dst, colorHex, dashed) {
   var geom = new THREE.Geometry(),
      mat; 

   if(dashed) {
      mat = new THREE.LineDashedMaterial({linewidth: 1, color: colorHex, dashSize: .25, gapSize: .125, transparent: true, opacity: DEFAULT_AXES_OPACITY});
   } else {
      mat = new THREE.LineBasicMaterial({linewidth: 1, color: colorHex, transparent: true, opacity: DEFAULT_AXES_OPACITY});
   }

   geom.vertices.push( src.clone() );
   geom.vertices.push( dst.clone() );
   geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

   var axis = new THREE.Line( geom, mat, THREE.LinePieces );

   return axis;
}

function buildAxes( position, length ) {
   var axes = new THREE.Object3D();

   axes.add( buildAxis( position, new THREE.Vector3( position.x+length, position.y, position.z ), DIRECTION_COLORS["e"], false ) ); // +X -> e (green)
   axes.add( buildAxis( position, new THREE.Vector3( position.x-length, position.y, position.z ), DIRECTION_COLORS["w"], true) ); // -X -> w (green dotted)
   axes.add( buildAxis( position, new THREE.Vector3( position.x, position.y, position.z+length ), DIRECTION_COLORS["n"], true ) ); // +Z -> n (blue)
   axes.add( buildAxis( position, new THREE.Vector3( position.x, position.y, position.z-length ), DIRECTION_COLORS["s"], false ) ); // -Z -> s (blue dotted)
   axes.add( buildAxis( position, new THREE.Vector3( position.x, position.y+length, position.z ), DIRECTION_COLORS["u"], false ) ); // +Y -> u (red)
   axes.add( buildAxis( position, new THREE.Vector3( position.x, position.y-length, position.z ), DIRECTION_COLORS["d"], true ) ); // -Y -> d (red dotted)
   
   var diagLength = length * Math.sin(45);
   
   axes.add( buildAxis( position, new THREE.Vector3( position.x+diagLength, position.y, position.z+diagLength), DIRECTION_COLORS["se"], true ) ); // +XZ -> se ()
   axes.add( buildAxis( position, new THREE.Vector3( position.x-diagLength, position.y, position.z-diagLength), DIRECTION_COLORS["nw"], false ) ); // -XZ -> nw ()
   
   axes.add( buildAxis( position, new THREE.Vector3( position.x-diagLength, position.y , position.z+diagLength), DIRECTION_COLORS["ne"], true ) ); // +XZ -> (
   axes.add( buildAxis( position, new THREE.Vector3( position.x+diagLength, position.y,  position.z-diagLength), DIRECTION_COLORS["sw"], false ) ); // -XZ -> 

   return axes;
}

function canvasMouseClick(event) {
   event.preventDefault();
   
   mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
   
   raycaster.setFromCamera(mouse, camera);
   var intersects = raycaster.intersectObjects(ROOMS);
   
   console.log("canvasMouseClick() intersects.length: "+intersects.length);
   if(intersects.length > 0) {     
      setSelectedRoom(intersects[0].object);
      var roomId = intersects[0].object.roomId;
      console.log("room selected: "+roomId);
   }
   else
   {
      setSelectedRoom();
      
      if(typeof selectBox !== "undefined")
         scene.remove(selectBox);
      
      if(typeof AXES !== "undefined" && AXES != null)
         scene.remove(AXES);
      
      CURRENT_ROOM = null;
   }
}

function setupEditingInput()
{
   $("#editing-input").keyup(function(event){
      if(event.which == '13') // On enter.
      {
         var editInput = $(this).val().toLowerCase();
         EDIT_COMMAND_HISTORY.push(editInput);
         $(this).val("");
         
         if(command_map.hasOwnProperty(editInput))
         {
            var editCommand = command_map[editInput];
            
            switch(editCommand)
            {
               case 'north':
               case 'south':
               case 'east':
               case 'west':
               case 'up':
               case 'down':
                  addRoom(editCommand);
                  break;
            }
         }
         else
         {
            console.warn("Edit Input command not found: "+editInput);
         }
            
      }
   });
};

function addRoom(direction)
{
   /*
   console.log("addRoom "+direction);
   if(ROOMS.length == 0)
   {
      var geometry = new THREE.BoxGeometry(DEFAULT_ROOM_SIZE.x, DEFAULT_ROOM_SIZE.y, DEFAULT_ROOM_SIZE.z);
      var material = new THREE.MeshLambertMaterial({color: DEFAULT_ROOM_COLOR, transparent: true, opacity: DEFAULT_ROOM_OPACITY });
      var room = new THREE.Mesh(geometry, material);
      
      // Find the new location.
      var newLocation = new THREE.Vector3(0,0,0);
      room.position = newLocation;
      room.renderOrder = 1;
      
      scene.add(room);
      ROOMS.push(room);
      
      var roomId = ROOMS.length-1;
      room.roomId = roomId;
      MAP_DATA[roomId] = new Room({id: roomId});
      
      // Show it as selected by default.
      setSelectedRoom(room);
   }
   else */
   if((ROOMS.length == 0) || (typeof CURRENT_ROOM !== "undefined" && CURRENT_ROOM != null))
   {
      var geometry = new THREE.BoxGeometry(DEFAULT_ROOM_SIZE.x, DEFAULT_ROOM_SIZE.y, DEFAULT_ROOM_SIZE.z);
      var material = new THREE.MeshLambertMaterial({color: DEFAULT_ROOM_COLOR, transparent: true, opacity: DEFAULT_ROOM_OPACITY });
      var room = new THREE.Mesh(geometry, material);
      
      // Find the new location.
      var currentLocation;// = CURRENT_ROOM.position;
      var newLocation;
      
      if(ROOMS.length == 0){
         newLocation = new THREE.Vector3(0,0,0);
      }
      else
      {
         currentLocation = CURRENT_ROOM.position;
         
         switch(direction){
            case 'north':
               newLocation = new THREE.Vector3(currentLocation.x, currentLocation.y, currentLocation.z - (STEP_DISTANCE + MAX_ROOM_SIZE.z));
               break;
            case 'south':
               newLocation = new THREE.Vector3(currentLocation.x, currentLocation.y, currentLocation.z + (STEP_DISTANCE + MAX_ROOM_SIZE.z));
               break;
            case 'east':
               newLocation = new THREE.Vector3(currentLocation.x + (STEP_DISTANCE + MAX_ROOM_SIZE.x), currentLocation.y, currentLocation.z);
               break;
            case 'west':
               newLocation = new THREE.Vector3(currentLocation.x - (STEP_DISTANCE + MAX_ROOM_SIZE.x), currentLocation.y, currentLocation.z);
               break;
            case 'up':
               newLocation = new THREE.Vector3(currentLocation.x, currentLocation.y + (STEP_DISTANCE + MAX_ROOM_SIZE.y), currentLocation.z);
               break;
            case 'down':
               newLocation = new THREE.Vector3(currentLocation.x, currentLocation.y - (STEP_DISTANCE + MAX_ROOM_SIZE.y), currentLocation.z);
               break;
         }
      }
      
      room.position.copy(newLocation);
      room.renderOrder = 1;
      
      scene.add(room);
      ROOMS.push(room); 
      
      var roomId = ROOMS.length-1;
      room.roomId = roomId;
      MAP_DATA[roomId] = new Room({id: roomId}); 
      
      // Update the selected room visually.
      setSelectedRoom(room);
      
      if(ROOMS.length != 0 && typeof PREVIOUS_ROOM !== "undefined" && PREVIOUS_ROOM != null)
      {
         // Add the connecting line.
         var connectionGeometry = new THREE.Geometry();
         var connectionMaterial= new THREE.LineBasicMaterial({linewidth: 1, color: DEFAULT_CONNECTION_COLOR, transparent: true, opacity: DEFAULT_CONNECTION_OPACITY});

         connectionGeometry.vertices.push( PREVIOUS_ROOM.position.clone() );
         connectionGeometry.vertices.push( CURRENT_ROOM.position.clone() );
         //connectionGeometry.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

         var connection = new THREE.Line( connectionGeometry, connectionMaterial, THREE.LinePieces );
         CONNECTIONS[PREVIOUS_ROOM.roomId+"-"+CURRENT_ROOM.roomId] = connection;
         scene.add(connection);
      }
   }
   else
      console.warn("No current room selected.");
};

function setSelectedRoom(room)
{
   // Remove the select box.
   if(typeof selectBox !== "undefined")
      scene.remove(selectBox);
   
   if(typeof room !== "undefined" && room != null)
   {
      // Add the select box.
      selectBox = new THREE.BoxHelper(room);
      selectBox.material.color.set(DEFAULT_ROOM_SELECT_BOX_COLOR);
      scene.add(selectBox);

      // Update the points to the current and previous rooms.
      if(typeof CURRENT_ROOM !== "undefined" && CURRENT_ROOM != null)
         PREVIOUS_ROOM = CURRENT_ROOM;

      CURRENT_ROOM = room;

      // Move the axes.
      if(typeof AXES !== "undefined" && AXES != null)
         scene.remove(AXES);

      AXES = buildAxes(room.position, AXES_LENGTH);
      scene.add(AXES);

      // Show properties.
      $("#property-room-id").val(CURRENT_ROOM.roomId);

      if(MAP_DATA.hasOwnProperty(CURRENT_ROOM.roomId))
      {
         $("#property-room-name").val( MAP_DATA[CURRENT_ROOM.roomId].getName() ).attr('disabled', false);
         $("#property-room-description").val( MAP_DATA[CURRENT_ROOM.roomId].getDescription() ).attr('disabled', false);
         $("#property-room-opacity").val( MAP_DATA[CURRENT_ROOM.roomId].getOpacity() ).attr('disabled', false);
      }
      else
      {
         console.alert("There are no properties for room id '"+CURRENT_ROOM.roomId+"' in MAP_DATA... this shouldn't happen.");
      }
      
   }
   else { // Room is null -> disable properties menu.
      $("#property-room-id").val("").attr('disabled', true);
      $("#property-room-name").val("").attr('disabled', true);
      $("#property-room-description").val("").attr('disabled', true);
      $("#property-room-opacity").val("").attr('disabled', true);
   }
   
}
