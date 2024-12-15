// 종횡비를 고정하고 싶을 경우: 아래 두 변수를 0이 아닌 원하는 종, 횡 비율값으로 설정.
// 종횡비를 고정하고 싶지 않을 경우: 아래 두 변수 중 어느 하나라도 0으로 설정.
const aspectW = 4;
const aspectH = 3;
// html에서 클래스명이 container-canvas인 첫 엘리먼트: 컨테이너 가져오기.
const container = document.body.querySelector('.container-canvas');
// 필요에 따라 이하에 변수 생성.

let monitorX;
let monitorY;
let monitorW;
let monitorH;
let characterX;
let characterY;
let characterS;
let attackerX;
let attackerY;
let attackerS;
let attackerA;
let jump = 0;
let angle = 45;
let img;

function preload() {
  img = loadImage('../img/game.png');
}

function setup() {
  // 컨테이너의 현재 위치, 크기 등의 정보 가져와서 객체구조분해할당을 통해 너비, 높이 정보를 변수로 추출.
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  // 종횡비가 설정되지 않은 경우:
  // 컨테이너의 크기와 일치하도록 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  if (aspectW === 0 || aspectH === 0) {
    createCanvas(containerW, containerH).parent(container);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 클 경우:
  // 컨테이너의 세로길이에 맞춰 종횡비대로 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  else if (containerW / containerH > aspectW / aspectH) {
    createCanvas((containerH * aspectW) / aspectH, containerH).parent(
      container
    );
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 작거나 같을 경우:
  // 컨테이너의 가로길이에 맞춰 종횡비대로 캔버스를 생성하고, 컨테이너의 자녀로 설정.
  else {
    createCanvas(containerW, (containerW * aspectH) / aspectW).parent(
      container
    );
  }
  init();
  // createCanvas를 제외한 나머지 구문을 여기 혹은 init()에 작성.

  // image(img, 0, 0);
}

// windowResized()에서 setup()에 준하는 구문을 실행해야할 경우를 대비해 init이라는 명칭의 함수를 만들어 둠.
function init() {
  monitorX = width * 0.5;
  monitorY = height * 0.35;
  monitorW = width * 0.25;
  monitorH = height * 0.25;

  // 캐릭터 초기 위치와 크기 설정
  characterX = monitorX - monitorW * 0.35;
  characterY = monitorY + monitorH * 0.33;
  characterS = monitorW * 0.1;

  attackerX = monitorX + monitorX * 0.275;
  attackerY = monitorY + monitorY * 0.23;
  attackerS = monitorW * 0.05;
  attackerA = radians(angle);
}

// 충돌 판단 함수 - gpt 도움
function boom(
  characterX,
  characterY,
  characterS,
  attackerX,
  attackerY,
  attackerS
) {
  // attacker의 중심점 찾기
  let attackerMid = attackerS * 0.5;
  // 캐릭터의 중심과 어태커의 가장 가까운 점 찾기
  let meetX = constrain(
    characterX,
    attackerX - attackerMid,
    attackerX + attackerMid
  );
  let meetY = constrain(
    characterY,
    attackerY - attackerMid,
    attackerY + attackerMid
  );

  let distance = dist(characterX, characterY, meetX, meetY);

  return distance < characterS * 0.5;
}

function draw() {
  background('black');

  fill('white');
  textAlign(CENTER, TOP);
  textSize(monitorW * 0.1);
  text('Click the Mouse!', monitorX, monitorY * 0.15);

  // 모니터 배경
  rectMode(CENTER);
  noStroke();
  fill('#BEF386');
  rect(monitorX, monitorY, monitorW, monitorH);

  // 바닥
  fill('#96D058');
  rect(monitorX, monitorY + monitorH * 0.45, monitorW, monitorH * 0.1);
  fill('#598A24');
  rect(monitorX, monitorY + monitorH * 0.4, monitorW, monitorH * 0.02);

  // 캐릭터가 될 원
  fill('#33550F');
  circle(characterX, characterY, characterS);
  if (characterY > characterY) {
    characterY = characterY;
  }

  // 캐릭터 점프할 높이, 바닥 뚫고가지 않도록
  characterY -= jump;
  jump -= 2.5;
  if (characterY > monitorY + monitorH * 0.33) {
    characterY = monitorY + monitorH * 0.33;
  }

  // 공격하는 사각형
  fill('#33550F');
  push();
  translate(attackerX, attackerY);
  rotate(attackerA);
  square(0, 0, attackerS);
  attackerX -= 3;

  if (attackerX < monitorW + monitorW * 0.4) {
    attackerX = monitorX + monitorX * 0.275;
  }
  pop();

  let bang = boom(
    characterX,
    characterY,
    characterS,
    attackerX,
    attackerY,
    attackerS
  );

  if (bang) {
    noLoop();
    fill('#213D04');
    textSize(monitorX * 0.05);
    textAlign(CENTER, CENTER);
    text('Game Over', monitorX, monitorY);
    textSize(monitorX * 0.05 - 5);
    text('Restart(R)', monitorX, monitorY + monitorX * 0.05 - 5);
  }

  let imgW = monitorW + monitorW * 0.25;
  let imgH = imgW * (img.height / img.width);

  imageMode(CENTER);
  // img.resize(monitorW, 0);
  image(img, monitorX, monitorY + monitorY * 0.35, imgW, imgH);
}

// 마우스 클릭하면 점프
function mouseClicked() {
  jump = monitorH * 0.117;
}

function keyPressed() {
  if (key === 'R' || key === 'r') {
    location.reload();
  }
}

function windowResized() {
  // 컨테이너의 현재 위치, 크기 등의 정보 가져와서 객체구조분해할당을 통해 너비, 높이 정보를 변수로 추출.
  const { width: containerW, height: containerH } =
    container.getBoundingClientRect();
  // 종횡비가 설정되지 않은 경우:
  // 컨테이너의 크기와 일치하도록 캔버스 크기를 조정.
  if (aspectW === 0 || aspectH === 0) {
    resizeCanvas(containerW, containerH);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 클 경우:
  // 컨테이너의 세로길이에 맞춰 종횡비대로 캔버스 크기를 조정.
  else if (containerW / containerH > aspectW / aspectH) {
    resizeCanvas((containerH * aspectW) / aspectH, containerH);
  }
  // 컨테이너의 가로 비율이 설정한 종횡비의 가로 비율보다 작거나 같을 경우:
  // 컨테이너의 가로길이에 맞춰 종횡비대로 캔버스 크기를 조정.
  else {
    resizeCanvas(containerW, (containerW * aspectH) / aspectW);
  }
  // 위 과정을 통해 캔버스 크기가 조정된 경우, 다시 처음부터 그려야할 수도 있다.
  // 이런 경우 setup()의 일부 구문을 init()에 작성해서 여기서 실행하는게 편리하다.
  // init();
}
