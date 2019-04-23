const createCubeButton = document.getElementById("createCubeButton")
const addCubeMenu = document.getElementById("addCubeMenu")
const sizeInput = document.getElementById("cubeSize")
const xInput = document.getElementById("positionX")
const yInput = document.getElementById("positionY")
const zInput = document.getElementById("positionZ")
resetInputs()
function resetInputs(){
    sizeInput.value = 3
    xInput.value = 0
    yInput.value = 0
    zInput.value = 0
}
createCubeButton.addEventListener("click", function(){
    if(!addCubeMenu.hidden){
        console.log("Hello")
        project.addCube(parseInt(sizeInput.value), new THREE.Vector3(parseInt(xInput.value), parseInt(yInput.value), parseInt(zInput.value)))
    }
    addCubeMenu.hidden = !addCubeMenu.hidden
    resetInputs()
})

let project = new Project()
project.run()