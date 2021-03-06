
var Robot = function() {

    this.root = new THREE.Object3D;
};

Robot.prototype.buildRobot = function(){
    var extraArm = createJoint(0.4, 0.1, 0.1, "blue");
    var pivot_extraarm = addPivotTo(extraArm, 0.2);
    var axes_extraarm = buildAxes(0.5);
    pivot_extraarm.add(axes_extraarm);
    pivot_extraarm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(-40));
    var group_extraarm = new THREE.Group();
    group_extraarm.add(pivot_extraarm);
    group_extraarm.translateX(0.2);

    var forearm = createJoint(0.4, 0.1, 0.1, "blue");
    forearm.add(group_extraarm);
    var pivot_forearm = addPivotTo(forearm, 0.2);
    var axes_forearm = buildAxes(0.5);
    pivot_forearm.add(axes_forearm);
    pivot_forearm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(40));
    var group_forearm = new THREE.Group();
    group_forearm.add(pivot_forearm);
    group_forearm.translateX(0.3);

    var secondarm = createJoint(0.4, 0.1, 0.1, "blue");
    var pivot_secondarm = addPivotTo(secondarm, 0.2);
    var axes_secondarm = buildAxes(0.5);
    pivot_secondarm.add(axes_secondarm);
    pivot_secondarm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(70));
    var group_secondarm = new THREE.Group();
    group_secondarm.add(pivot_secondarm);
    group_secondarm.translateX(0.3);

    var upperarm = createJoint(0.6, 0.1, 0.1, "blue");
    upperarm.add(group_forearm);
    upperarm.add(group_secondarm);
    var pivot_upperarm = addPivotTo(upperarm, 0.3);
    var axes_upperarm = buildAxes(0.5);
    pivot_upperarm.add(axes_upperarm);
    pivot_upperarm.rotateOnAxis(THREE.Vector3.ZAxis, degToRad(5));
    var group_upperarm = new THREE.Group();
    group_upperarm.add(pivot_upperarm);

    this.root.add(group_upperarm);

    return this.root;
};

function addPivotTo(object, object_offset){
    object.translateX(object_offset);
    var pivot_point = new THREE.Object3D();
    pivot_point.add(object);
    return pivot_point;
}

function createJoint(geo_x, geo_y, geo_z, color){
    var geometry = new THREE.BoxGeometry(geo_x, geo_y, geo_z);
    var material = new THREE.MeshLambertMaterial( {
        color: color,
    } );
    var joint = new THREE.Mesh( geometry, material );
    return joint;
}

Robot.prototype.toggleSelection = function(){
};

Robot.prototype.rotateOnAxis = function(node, axis, degree){
    node.children[0].rotateOnAxis(axis, degToRad(degree));
};