
var Robot = function() {

    this.root = new THREE.Object3D;
};

Robot.prototype.buildRobot = function(){

    // var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    // // https://threejs.org/docs/#api/materials/MeshLambertMaterial
    // var material = new THREE.MeshLambertMaterial( {
    //     color: "red",  // CSS color names can be used!
    // } );
    // //a mesh consists of geometry and a material; added to the scene
    // var torso = new THREE.Mesh( geometry, material );


    // var geometry2 = new THREE.BoxGeometry( 0.4, 0.1, 0.1 );
    // var material2 = new THREE.MeshLambertMaterial( {
    //     color: "blue",  // CSS color names can be used!
    // } );
    // var shoulderArm = new THREE.Mesh( geometry2, material2 );
    //
    // var pivot_point = new THREE.Vector3(0.2,0,0);
    //
    // var geometry3 = new THREE.BoxGeometry( 0.2, 0.1, 0.1 );
    // var material3 = new THREE.MeshLambertMaterial( {
    //     color: "green",  // CSS color names can be used!
    // } );
    // var foreArm = new THREE.Mesh( geometry3, material3 );
    // shoulderArm.add(foreArm);
    //
    // foreArm.translateX(0.3);
    // rotateAboutPoint(foreArm, pivot_point, THREE.Vector3.ZAxis, degToRad(25));
    //
    //
    //
    //
    //
    // // this.root.add(torso);
    // this.root.add(shoulderArm);

    var forearm = createJoint(0.4, 0.1, 0.1, "blue");
    var pivot_forearm = addPivotTo(forearm, 0.2);
    pivot_forearm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(40));
    var group_forearm = new THREE.Group();
    group_forearm.add(pivot_forearm);
    group_forearm.translateX(0.3);

    var secondArm = createJoint(0.4, 0.1, 0.1, "blue");
    var pivot_secondArm = addPivotTo(secondArm, 0.2);
    pivot_secondArm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(70));
    var group_secondArm = new THREE.Group();
    group_secondArm.add(pivot_secondArm);
    group_secondArm.translateX(0.3);

    var upperarm = createJoint(0.6, 0.1, 0.1, "green");
    upperarm.add(group_forearm);
    upperarm.add(group_secondArm);
    var pivot_upperarm = addPivotTo(upperarm, 0.3);
    pivot_upperarm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(5));
    var group_upperarm = new THREE.Group();
    group_upperarm.add(pivot_upperarm);

    this.root.add(group_upperarm);

    return this.root
};

function addPivotTo(object, object_offset){
    object.translateX(object_offset);
    var pivot_point = new THREE.Object3D();
    pivot_point.add(object);
    return pivot_point;
}

function createJoint(geo_x, geo_y, geo_z, color){
    var geometry = new THREE.BoxGeometry(geo_x, geo_y, geo_z);
    // https://threejs.org/docs/#api/materials/MeshLambertMaterial
    var material = new THREE.MeshLambertMaterial( {
        color: color,  // CSS color names can be used!
    } );
    //a mesh consists of geometry and a material; added to the scene
    var joint = new THREE.Mesh( geometry, material );
    return joint
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }

    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}

Robot.prototype.reset = function(){
    this.root.position.set(0, 0, 0);
    this.root.setRotationFromEuler(new THREE.Euler(0,0,0));
    this.traverseAndResetColor("green");
};


Robot.prototype.selectChild = function (forward) {
};

Robot.prototype.selectSibling = function(forward){
};

Robot.prototype.toggleSelection = function(){
};

Robot.prototype.rotateOnAxis = function(axis, degree){
    this.root.rotateOnAxis(axis, degToRad(degree));
};

// functions created by the student
Robot.prototype.translateRight = function(){
    this.root.translateX(0.3);
};

Robot.prototype.traverseAndResetColor = function(color) {
    this.root.traverse ( function( node ) {
        if (node instanceof THREE.Mesh) {
            var material = new THREE.MeshLambertMaterial( {
                color: color,  // CSS color names can be used!
            } );
            node.material = material;
        }
    });
};

// Robot.prototype.rotateOnAxis = function(axis, degree){
//     this.root.rotateOnAxis(axis, degToRad(degree));
// };