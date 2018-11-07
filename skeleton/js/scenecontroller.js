var SceneController = function(document)
{
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer( {
        antialias: true,  // to enable anti-alias and get smoother output
        preserveDrawingBuffer: true  // to allow screenshot
    } );
    this.raycaster = new THREE.Raycaster();
};

var mouse = new THREE.Vector2();
var targetRotation = new THREE.Vector2();
var mouseDown = new THREE.Vector2();
var targetRotationDown = new THREE.Vector2();
SceneController.prototype.onDocumentMouseDown = function( event ) {

    event.preventDefault();

    document.addEventListener( 'mousemove', this.onMouseMove, false );

    mouseDown.x = event.clientX - (window.innerWidth / 2);
    targetRotationDown.x = targetRotation.x;

    mouseDown.y = event.clientY - (window.innerHeight / 2);
    targetRotationDown.y = targetRotation.y;
    console.log(targetRotationDown);
    if (currentlyPickedMesh !== null && raycastingEnabled === true) {
        rotateAroundObjectAxis(currentlyPickedMesh.parent.parent, new THREE.Vector3(0,1,0), degToRad(-targetRotationDown.x*8));
        rotateAroundObjectAxis(currentlyPickedMesh.parent.parent, new THREE.Vector3(0,0,1), degToRad(-targetRotationDown.y*8));
    }
};

SceneController.prototype.onMouseMove = function( event )
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    targetRotation.x = ( mouseDown.x - mouse.x ) * 0.00025;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    targetRotation.y = ( mouseDown.y - mouse.y ) * 0.00025;
};

SceneController.prototype.traverseSceneAndGrabMeshes = function() {
    this.scene.traverse( function( node ) {

        if ( node instanceof THREE.Mesh ) {
            meshes.push(node);
        }

    } );
};

function rotateAroundObjectAxis(object, axis, radians) {
    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiply(rotationMatrix);
    object.rotation.setFromRotationMatrix(object.matrix);
}

SceneController.prototype.renderRaycasting = function()
{
    // update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera( mouse, this.camera );
    // calculate objects intersecting the picking ray
    var intersects = this.raycaster.intersectObjects( meshes);

    for ( var i = 0; i < intersects.length; i++ ) {
        if ( currentlyPickedMesh !== null ) {
            this.decolourNode(currentlyPickedMesh.parent.parent);
        }
        currentlyPickedMesh = intersects[ i ].object;
        intersects[ i ].object.material.color.set( 0xff0000 );

    }
    this.renderer.render( this.scene, this.camera );

};

var raycastingEnabled;
SceneController.prototype.toggleRaycasting = function()
{
    if (raycastingEnabled !== true) {
        this.controls.enabled = false;
        raycastingEnabled = true;
        document.addEventListener( 'mousemove', this.onDocumentMouseDown, false );
    } else {
        document.removeEventListener( 'mousemove', this.onDocumentMouseDown, false );
        raycastingEnabled = false;
        this.controls.enabled = true;
    }
};

SceneController.prototype.setup = function()
{
    // https://threejs.org/docs/#api/renderers/WebGLRenderer
    this.renderer.setSize( window.innerWidth, window.innerHeight);
    document.body.appendChild( this.renderer.domElement );

    this.setupCamera();
    this.setupControls();
    this.setupLight();
    this.setupGeometry();
    this.assignRootNode();

    this.render();
    this.traverseSceneAndGrabMeshes();
    this.animate();
};

SceneController.prototype.setupCamera = function()
{
    var VIEW_ANGLE = 70;
    var ASPECT_RATIO = window.innerWidth / window.innerHeight;
    var NEAR_PLANE = 0.01;
    var FAR_PLANE = 10;

    // https://threejs.org/docs/#api/cameras/PerspectiveCamera
    this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT_RATIO, NEAR_PLANE, FAR_PLANE );
    this.camera.position.z = 1.8;
    this.camera.lookAt(this.scene.position);
};

SceneController.prototype.setupControls = function()
{
    // https://threejs.org/examples/misc_controls_orbit.html
    this.controls = new THREE.OrbitControls( this.camera );
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
    this.controls.enableKeys = false;
    //bind? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    this.controls.addEventListener( 'change', this.render.bind(this) );
};

SceneController.prototype.setupGeometry = function()
{
    this.robot = new Robot();
    this.scene.add(this.robot.buildRobot());
};

SceneController.prototype.setupLight = function()
{
    // https://threejs.org/docs/#api/lights/PointLight
    var light = new THREE.PointLight( 0xffffcc, 1, 100 );
    light.position.set( 10, 30, 15 );
    this.scene.add(light);

    var light2 = new THREE.PointLight( 0xffffcc, 1, 100 );
    light2.position.set( 10, -30, -15 );
    this.scene.add(light2);

    this.scene.add( new THREE.AmbientLight(0x999999) );
};

SceneController.prototype.render = function() {

    document.addEventListener( 'mousemove', this.onMouseMove, false );
    this.renderer.render( this.scene, this.camera );
};



SceneController.prototype.animate = function()
{
    //bind? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    if (raycastingEnabled === true) {
        requestAnimationFrame( this.renderRaycasting.bind(this) );
    } else if (raycastingEnabled === false && currentlyPickedMesh instanceof THREE.Mesh) {
        this.decolourNode(currentlyPickedMesh.parent.parent);
    }
    requestAnimationFrame( this.animate.bind(this) );
    this.controls.update();
};

SceneController.prototype.reset = function()
{
    document.removeEventListener( 'mousemove', this.onDocumentMouseDown, false );
    raycastingEnabled = false;
    this.scene.remove(rootNode.parent);
    this.setupCamera();
    this.setupControls();
    this.setupGeometry();
    this.assignRootNode();
    this.render();
    this.traverseSceneAndGrabMeshes();
};

SceneController.prototype.toggleSelection = function()
{
    this.robot.toggleSelection();
};

SceneController.prototype.traverseAndToggleAxesVisibility = function ()
{
    // utils provides two helper functions which could be used
    var upperarm_axes = rootNode.children[0].children[1];
    var forearm_axes = rootNode.children[0].children[0].children[0].children[0].children[1];
    var secondarm_axes = rootNode.children[0].children[0].children[1].children[0].children[1];
    var extraarm_axes = rootNode.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1];
    this.toggleAxesVisibility(upperarm_axes);
    this.toggleAxesVisibility(forearm_axes);
    this.toggleAxesVisibility(secondarm_axes);
    this.toggleAxesVisibility(extraarm_axes);
};

SceneController.prototype.toggleAxesVisibility = function (parent) {
    parent.children.forEach(function(axis) {
        if (axis.material.visible === true) {
            axis.material.visible = false;
        } else {
            axis.material.visible = true;
        }
    });
};

SceneController.prototype.rotateNode = function(axis, degree)
{
    this.robot.rotateOnAxis(currentlySelectedNode, axis, degree);
};

SceneController.prototype.handleMouseClick = function(mouse)
{
    // Reference http://stemkoski.github.io/Three.js/Mouse-Click.html
};

SceneController.prototype.handleMouseMove = function(offsetX, offsetY)
{
};

// functions created by the student

var rootNode;
var currentlySelectedNode = null;
var childIndex;
var meshes = [];
var currentlyPickedMesh = null;

SceneController.prototype.assignRootNode = function () {
    rootNode = this.goToRootNode();
    currentlySelectedNode = null;
};

SceneController.prototype.goToRootNode = function () {
    var graphNodes = this.scene.children;
    var i;
    for (i = 0; i < graphNodes.length; i++) {
        if (graphNodes[i].type === "Object3D") {
            return graphNodes[i].children[0];
        }
    }
};

SceneController.prototype.getParentNode = function () {
    if (currentlySelectedNode === null) {
        currentlySelectedNode = rootNode;
        this.colorNode(currentlySelectedNode, "yellow");
        return currentlySelectedNode;
    } else {
        if ( currentlySelectedNode.parent.parent.parent === null ) {
            console.log("This is the first parent in the hierarchy.");
        } else {
            this.decolourNode(currentlySelectedNode);
            currentlySelectedNode = currentlySelectedNode.parent.parent.parent;
            this.colorNode(currentlySelectedNode, "yellow");
            return currentlySelectedNode;
        }
    }
};

SceneController.prototype.getFirstChild = function () {
    if (currentlySelectedNode === null) {
        console.log("No parent currently selected.");
    } else {
        temp = this.getFirstChildGroupFrom(currentlySelectedNode);
        if ( temp !== undefined ) {
            this.decolourNode(currentlySelectedNode);
            this.colorNode(temp, "yellow");
            currentlySelectedNode = temp;
            childIndex = 0;
        }
    }
};

SceneController.prototype.getFirstChildGroupFrom = function (node) {
    var nodeChildren = node.children[0].children[0].children;
    if (nodeChildren.length === 0) {
        console.log("no more children for this node");
        return currentlySelectedNode;
    } else {
        return node.children[0].children[0].children[0];
    }
};

SceneController.prototype.getNextSibling = function() {
    if ( currentlySelectedNode === null ) {
        console.log("No child node with parent currently selected.");
    } else if ( currentlySelectedNode === rootNode ) {
        console.log("Current child is the rootNode, this doesn't have any siblings.");
    } else {
        var parentMesh = currentlySelectedNode.parent;
        if ( parentMesh.children.length > 1 ) {
            if ( childIndex + 1 < parentMesh.children.length ) {
                childIndex += 1;
                temp = parentMesh.children[childIndex];
                this.decolourNode(currentlySelectedNode);
                this.colorNode(temp, "yellow");
                currentlySelectedNode = temp;
            } else {
                console.log("The are no more further siblings. Use 'a' to go back to previous sibling.");
            }
        } else {
            console.log("There is only one child for this parent.");
        }
    }
};

SceneController.prototype.getPreviousSibling = function() {
    if (currentlySelectedNode === null) {
        console.log("No child node with parent currently selected.");
    } else if (currentlySelectedNode === rootNode) {
        console.log("Current child is the rootNode, this doesn't have any siblings.");
    } else {
        var parentMesh = currentlySelectedNode.parent;
        if (parentMesh.children.length > 1) {
            if (childIndex - 1 >= 0) {
                childIndex -= 1;
                temp = parentMesh.children[childIndex];
                this.decolourNode(currentlySelectedNode);
                this.colorNode(temp, "yellow");
                currentlySelectedNode = temp;
            } else {
                console.log("The are no more previous siblings. Use 'd' to go forward to next sibling.");
            }
        } else {
            console.log("There is only one child for this parent.");
        }
    }
};

SceneController.prototype.decolourNode = function(node) {
    if ( node !== null ) {
        this.colorNode(node, "blue");
    }
};

SceneController.prototype.colorNode = function (node, color) {
    node.children[0].children[0].material = new THREE.MeshLambertMaterial( {
        color: color,  // CSS color names can be used!
    } );
};

SceneController.prototype.logCSN = function () {
    console.log(rootNode);
    console.log(currentlySelectedNode);
};