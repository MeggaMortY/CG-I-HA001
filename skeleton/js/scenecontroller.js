var SceneController = function(document)
{
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer( {
        antialias: true,  // to enable anti-alias and get smoother output
        preserveDrawingBuffer: true  // to allow screenshot
    } );
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

    this.renderer.render( this.scene, this.camera );
};

SceneController.prototype.animate = function()
{
    //bind? --> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
    requestAnimationFrame( this.animate.bind(this) );
    this.controls.update();
};

SceneController.prototype.reset = function()
{
    this.scene.remove(rootNode.parent);
    this.setup();
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
    this.toggleAxesVisibility(upperarm_axes);
    this.toggleAxesVisibility(forearm_axes);
    this.toggleAxesVisibility(secondarm_axes);
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
SceneController.prototype.translateRight = function() {
    this.robot.translateRight();
};

var rootNode;
var currentlySelectedNode = null;
var childIndex;

SceneController.prototype.assignRootNode = function () {
    console.log(this.scene);
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