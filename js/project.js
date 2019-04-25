class Project{
    constructor(){
        //BASIC THREE.JS
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
        this.camera.position.set(50, 50, 50)
        this.renderer = new THREE.WebGLRenderer({alpha: true})
        this.renderer.setSize(window.innerWidth*0.7, window.innerHeight-20)
        this.renderer.setClearColor( 0xeeeeee, 1);
        document.body.appendChild(this.renderer.domElement)
        window.addEventListener('resize', this.resizeManager.bind(this))

        //CONTROL SETUP
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target = new THREE.Vector3(0, 0, 0)
        this.controls.autoRotate = true
        this.controls.autoRotateSpeed = 6

        //ALL rubiksCUBE OBJECTS
        this.rubiksCubes = []
        
        //SOME BASIC GUIDELINES
        this.scene.add(new THREE.AxesHelper(100))
        this.scene.add(new THREE.GridHelper(100, 100))
    }
    resizeManager(){
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth/window.innerHeight
        this.camera.updateProjectionMatrix()
    }
    render(){
        this.renderer.render(this.scene, this.camera)
    }
    update(){
        for(let rubiksCube of this.rubiksCubes){
            rubiksCube.update()
        }
    }
    run(){
        requestAnimationFrame(this.run.bind(this))
        this.controls.update()
        this.update()
        this.render()
    }
    addCube(size, centerPosition){
        let newCube = new rubiksCube(this.scene, size, centerPosition)
        newCube.create()
        this.rubiksCubes.push(newCube)
    }
}