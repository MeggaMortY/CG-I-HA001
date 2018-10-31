
var Robot = function() {

    this.root = new THREE.Object3D;
};

Robot.prototype.buildRobot = function(){

    var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    // https://threejs.org/docs/#api/materials/MeshLambertMaterial
    var material = new THREE.MeshLambertMaterial( {
        color: "red",  // CSS color names can be used!
    } );
    //a mesh consists of geometry and a material; added to the scene
    var torso = new THREE.Mesh( geometry, material );

    var geometry2 = new THREE.BoxGeometry( 0.4, 0.1, 0.1 );
    var material2 = new THREE.MeshLambertMaterial( {
        color: "blue",  // CSS color names can be used!
    } );
    var arm = new THREE.Mesh( geometry2, material2 );
    arm.translateOnAxis(THREE.Vector3.XAxis, 0.35);
    arm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(25));

    torso.add(arm);

    // var geometry3 = THREE.BoxGeometry( 0.25, 0.1, 0.1 );
    // var material3 = new THREE.MeshLambertMaterial( {
    //     color: "green",  // CSS color names can be used!
    // } );
    // var forearm = new THREE.Mesh( geometry3, material3 );
    //
    //
    // arm.add(forearm);



    this.root.add(torso);

    return this.root
};


Robot.prototype.reset = function(){
};

Robot.prototype.selectChild = function (forward) {
};

Robot.prototype.selectSibling = function(forward){
};

Robot.prototype.toggleSelection = function(){
};

Robot.prototype.rotateOnAxis = function(axis, degree){
};
