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
    this.robot.reset();
};

SceneController.prototype.toggleSelection = function()
{
    this.robot.toggleSelection();
};

SceneController.prototype.selectSibling = function(forward)
{
    this.robot.selectSibling(forward);
};

SceneController.prototype.selectChild = function(forward)
{
    this.robot.selectChild(forward);
};

SceneController.prototype.toggleAxisVisibility = function ()
{
    // utils provides two helper functions which could be used
};

SceneController.prototype.rotateNode = function(axis, degree)
{
    this.robot.rotateOnAxis(axis, degree);
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

// SceneController.prototype.traverse = function() {
//     this.scene.traverse ( function( node ) {
//         if (node instanceof THREE.Mesh) {
//             var material2 = new THREE.MeshLambertMaterial( {
//                 color: "yellow",  // CSS color names can be used!
//             } );
//             node.material = material2;
//         }
//     });
//
// };


var selectedNode;
SceneController.prototype.selectParentNode = function () {
    var rootNode = this.goToRootNode();
    console.log(rootNode);
    selectedNode = this.goToFirstMesh(rootNode);
    console.log(selectedNode);
    this.colorNode(selectedNode, "yellow");

    // console.log(this.scene.children);

}

SceneController.prototype.goToRootNode = function () {
    var graphNodes = this.scene.children;

    var i;
    for (i = 0; i < graphNodes.length; i++) {
        if (graphNodes[i].type === "Object3D") {
            return graphNodes[i];
            break;
        }
    }
}

SceneController.prototype.goToFirstMesh = function (rootNode) {
    var rootChildren = rootNode.children;
    var firstGroup;
    var i;
    for (i = 0; i < rootChildren.length; i++) {
        if (rootChildren[i].type === "Group") {
            firstGroup = rootChildren[i];
            break;
        }
    }

    var groupMesh = firstGroup.children[0].children[0];
    return groupMesh;
}

SceneController.prototype.colorNode = function (selectedNode, color) {
    var material = new THREE.MeshLambertMaterial( {
        color: color,  // CSS color names can be used!
    } );
    selectedNode.material = material;
}