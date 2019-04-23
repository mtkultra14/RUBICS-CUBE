class RubicsCube{
    constructor(scene, cubeSize, centerPosition){
        this.scene = scene

        //CUBE PROPERTIES
        this.cubeSize = cubeSize
        this.centerPosition = centerPosition
        this.arrayPositionOffset = (this.cubeSize-1)*0.5 //WE WANT THE CUBES TO BE CENTERED AT THE ORIGIN
        this.cubies = [] //STORES CUBIES, 3D ARRAY

        //ROTATION VARIABLES
        this.isRotating = false
        this.rotationAxes = [0, 0, 1, 1, 2, 2]
        this.rotationAngles = [0.5*Math.PI, -0.5*Math.PI, 0.5*Math.PI, -0.5*Math.PI, 0.5*Math.PI, -0.5*Math.PI]
        this.rotationAxis = null //0: x, 1: y, 2: z
        this.rotationAngle = null //0.5*Math.PI or -0.5*Math.PI
        this.rotationLayer = null //0 or this.cubeSize-1
        this.rotationGroup = new THREE.Group()
        this.rotationCounter = 0
        this.speedOfRotation = 10

        //SCRAMBLING
        this.scrambleMode = true
        this.scrambleCounter = 0
    }
    //------------------GENERAL METHOD FOR ANIMATION--------------------------------------
    update(){
        if(this.isRotating){
            this.rotationGroup.rotateOnAxis(this.getRotationAxis(), this.rotationAngle/this.speedOfRotation)
            this.rotationCounter++
            if(this.rotationCounter == this.speedOfRotation){
                this.stopRotation()
            }
        }else if(this.scrambleMode){
            this.rotate()
            this.scrambleCounter++
            if(this.scrambleCounter == 200){
                //this.scrambleMode = false
            }
        }
    }
    //------------------BEFORE ROTATION---------------------------------------
    setRotationGroup(){
        //GET THE CUBIES ACCORDING TO ROTATION PROPERTIES
        this.rotationGroup = new THREE.Group()
        //POSITION GROUP TO CUBE
        this.rotationGroup.position.copy(this.centerPosition)
        for(let i=0;i<this.cubeSize;i++){
            for(let j=0;j<this.cubeSize;j++){
                let newCubie
                if(this.rotationAxis == 0){
                    newCubie = this.cubies[this.rotationLayer][i][j]
                }else if(this.rotationAxis == 1){
                    newCubie = this.cubies[i][this.rotationLayer][j]
                }else{
                    newCubie = this.cubies[i][j][this.rotationLayer]
                }
                //CENTER THE CUBIES AROUND ORIGIN
                newCubie.position.sub(this.centerPosition)
                this.rotationGroup.add(newCubie)
            }
        }
    }
    startRotation(rotationIndex){
        this.isRotating = true
        this.rotationAxis = this.rotationAxes[rotationIndex]
        this.rotationAngle = this.rotationAngles[rotationIndex]
        this.rotationLayer = Math.floor(Math.random()*this.cubeSize)
        this.setRotationGroup()
    }
    //------------------DURING ROTATION----------------------------------
    getRotationAxis(){
        if(this.rotationAxis == 0){
            return new THREE.Vector3(1, 0, 0)
        }else if(this.rotationAxis == 1){
            return new THREE.Vector3(0, 1, 0)
        }
        return new THREE.Vector3(0, 0, 1)
    }
    rotate(){
        if(!this.isRotating){
            this.isRotating = true
            this.startRotation(Math.floor(Math.random()*6))
            this.scene.add(this.rotationGroup)
        }
    }
    //------------------AFTER ROTATION------------------------------------
    setNewFaceArray(){
        //BASED ON ROTATION DATA WE SET WHERE THE FACES OF A CUBIE WILL BE
        let newFaces
        if(this.rotationAxis == 0 && this.rotationAngle > 0){
            //X ANTICLOCKWISE
            newFaces = [0, 1, 5, 4, 2, 3]
        }else if(this.rotationAxis == 0 && this.rotationAngle < 0){
            //X CLOCKWISE
            newFaces = [0, 1, 4, 5, 3, 2]
        }else if(this.rotationAxis == 1 && this.rotationAngle > 0){
            //Y ANTICLOCKWISE
            newFaces = [4, 5, 2, 3, 1, 0]
        }else if(this.rotationAxis == 1 && this.rotationAngle < 0){
            //Y CLOCKWISE
            newFaces = [5, 4, 2, 3, 0, 1]
        }else if(this.rotationAxis == 2 && this.rotationAngle > 0){
            //Z ANTICLOCKWISE
            newFaces = [3, 2, 0, 1, 4, 5]
        }else{
            //Z CLOCKWISE
            newFaces = [2, 3, 1, 0, 4, 5]
        }
        return newFaces
    }
    getExactValue(value){
        //WE WANT THE CUBIES TO BE SYMMETRIC TO THE CUBECENTER
        //E.G.: 3x3x3: WE WANT COORDINATES TO BE EITHER -1, 0 OR 1 ON ALL AXES 
        if(this.cubeSize%2 == 1){
            return Math.round(value)
        }
        return Math.floor(value)+0.5
    }
    getExactWorldPosition(block){
        //We get World position, round it up, then return it by components
        let pos = new THREE.Vector3()
        block.getWorldPosition(pos)
        return [this.getExactValue(pos.x), this.getExactValue(pos.y), this.getExactValue(pos.z)]
    }
    setFaceColours(body){
        //CHANGES FACE COLOURS BASED ON ROTATION
        let newFaces = this.setNewFaceArray()
        let oldFaces = []
        for(let j=0;j<6;j++){
            oldFaces.push(body.material[j].color.getHex())
        }
        for(let j=0;j<6;j++){
            body.material[j].color.setHex(oldFaces[newFaces[j]])
        }
        return body
    }
    stopRotation(){
        this.isRotating = false
        this.rotationCounter = 0
        for(let i=0;i<this.cubeSize*this.cubeSize;i++){
            let block = this.rotationGroup.children[0]
            //UPDATE POSITION
            let [x, y, z] = this.getExactWorldPosition(block)
            block.position.set(x, y, z)
            //UPDATE SIDES (ROTATION)
            block.children[0] = this.setFaceColours(block.children[0]) //WE ASSUME THAT CHILDREN[0] IS THE MESH
            let newX = x+this.arrayPositionOffset-this.centerPosition.x
            let newY = y+this.arrayPositionOffset-this.centerPosition.y
            let newZ = z+this.arrayPositionOffset-this.centerPosition.z
            this.cubies[newX][newY][newZ] = block
            this.scene.add(this.cubies[newX][newY][newZ])
        }
    }
    //------------------CREATING A CUBE------------------------------------------------
    setSideColours(i, j, k){
        let faceMaterials = []
        //create six black sides
        for(let l=0;l<6;l++){
            faceMaterials.push(new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide}))
        }
        //change some side colours according to position
        if(i == 0){ //left, green
            faceMaterials[1].color.setHex(0x00ff00)
        }else if(i == this.cubeSize-1){ //right, blue
            faceMaterials[0].color.setHex(0x0000ff)
        }
        if(j == 0){ //bottom, yellow
            faceMaterials[3].color.setHex(0xffff00)
        }else if(j == this.cubeSize-1){ //top, white
            faceMaterials[2].color.setHex(0xffffff)
        }
        if(k == 0){ //back, orange
            faceMaterials[5].color.setHex(0xffa500)
        }else if(k == this.cubeSize-1){ //front, red
            faceMaterials[4].color.setHex(0xff0000)
        }
        return faceMaterials
    }
    createCubie(i, j, k){
        //CREATE BODY WITH APPROPRIATE SIDE COLOURS
        let bodyGeometry = new THREE.BoxGeometry(1, 1, 1)
        let body = new THREE.Mesh(bodyGeometry, this.setSideColours(i, j, k))
        //CREATE LINES
        let lineGeometry = new THREE.LineSegmentsGeometry().setPositions(new THREE.EdgesGeometry(bodyGeometry).attributes.position.array)
        let lineMaterial = new THREE.LineMaterial({color: 0x000000, linewidth: 3})
        lineMaterial.resolution.set(window.innerWidth, window.innerHeight)
        let line = new THREE.LineSegments2(lineGeometry, lineMaterial)
        //CHUCK THEM TOGETHER INTO A GROUP
        let cubie = new THREE.Group()
        cubie.add(body)
        cubie.add(line)
        return cubie
    }
    create(){
        let start = this.centerPosition.clone()
        start.addScalar(-(this.cubeSize-1)*(0.5))
        for(let i=0;i<this.cubeSize;i++){
            this.cubies.push([])
            for(let j=0;j<this.cubeSize;j++){
                this.cubies[i].push([])
                for(let k=0;k<this.cubeSize;k++){
                    this.cubies[i][j].push(this.createCubie(i, j, k))
                    //SET POSITIONS
                    let offset = new THREE.Vector3(i, j, k)
                    this.cubies[i][j][k].position.copy(offset.add(start))
                    this.scene.add(this.cubies[i][j][k])
                }
            }
        }
    }
}