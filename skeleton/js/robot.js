
var Robot = function() {

    this.root = new THREE.Object3D;
};

Robot.prototype.buildRobot = function(){

    var forearm = createJoint(0.4, 0.1, 0.1, "blue");
    var pivot_forearm = addPivotTo(forearm, 0.2);
    var axes_forearm = buildAxes(0.5);
    pivot_forearm.add(axes_forearm);
    pivot_forearm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(40));
    var group_forearm = new THREE.Group();
    group_forearm.add(pivot_forearm);
    group_forearm.translateX(0.3);

    var secondArm = createJoint(0.4, 0.1, 0.1, "blue");
    var pivot_secondArm = addPivotTo(secondArm, 0.2);
    var axes2 = buildAxes(0.5);
    pivot_secondArm.add(axes2);
    pivot_secondArm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(70));
    var group_secondArm = new THREE.Group();
    group_secondArm.add(pivot_secondArm);
    group_secondArm.translateX(0.3);

    var upperarm = createJoint(0.6, 0.1, 0.1, "blue");
    upperarm.add(group_forearm);
    upperarm.add(group_secondArm);
    var pivot_upperarm = addPivotTo(upperarm, 0.3);
    var axes3 = buildAxes(0.5);
    pivot_upperarm.add(axes3);
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

// Robot.prototype.selectChild = function (forward) {
// };
//
// Robot.prototype.selectSibling = function(forward){
// };

Robot.prototype.toggleSelection = function(){
};

Robot.prototype.rotateOnAxis = function(node, axis, degree){
    node.children[0].rotateOnAxis(axis, degToRad(degree));
};

// functions created by the student
Robot.prototype.translateRight = function(){
    this.root.translateX(0.3);
};

// Robot.prototype.traverseAndResetColor = function(color) {
//     this.root.traverse ( function( node ) {
//         if ( node instanceof THREE.Object3D) {
//             // node.position.set(0, 0, 0);
//             node.rotation = degToRad(0);
//         }
//         if (node instanceof THREE.Mesh) {
//             var material = new THREE.MeshLambertMaterial( {
//                 color: color,  // CSS color names can be used!
//             } );
//             node.material = material;
//         }
//     });
// };