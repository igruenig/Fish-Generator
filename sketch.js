const fishWidth = 300;
const fishHeight = 200;
let canvas = {};

function setup() {
  canvas = createCanvas(340, 200)
  canvas.parent('sketch-holder');
  const fish = new Fish(20, 0, 300, 200);
  fish.display();
}

function generateNewFish() {
  clear()
  const fish = new Fish(20, 0, 300, 200);
  fish.display();
}

function downloadFish() {
  save(canvas, 'fish.png')
}

document.getElementById("new-fish").addEventListener("click", generateNewFish);
document.getElementById("download").addEventListener("click", downloadFish);