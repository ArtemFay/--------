const containerNode = document.getElementById("fifteen");
const itemNodes = Array.from(containerNode.querySelectorAll(".item"));
const countItems = 16;

if (countItems != 16) {
  throw new Error(`Должно быть ровно ${countItems} items in HTML`);
}

// 1. Первичное расположение эементов
// 2. Перемешиване
// 3. Изменение позиции по клику
// 4. Изменение позиции по нажатию стрелок
// 5. Показать выигрыш

// 1. Первичное расположение эементов
itemNodes[countItems - 1].style.display = "none";
let arr = itemNodes.map((item) => Number(item.dataset.matrixId));
let matrix = getMatrix(arr);
setPositionItems(matrix);

// 2. Перемешиване
document.getElementById("shuffle").addEventListener("click", () => {
  // смещение элементов в виртуальной матрице
  // const flatMatrix = matrix.flat();
  // const shuffledArray = shuffleArray(flatMatrix);
  // matrix = getMatrix(shuffledArray);

  // УМНОЕ ПЕРЕМЕШИВАНИЕ
  // 1. Сделать валидное смещение и запомнить прошлую позицию
  let priveousEmpty = { x: "", y: "" };

  for (let i = 0; i < 100; i++) {
    let oneRandomMoveResult = oneRandomMove();

    if (
      priveousEmpty.x != oneRandomMoveResult[0].x ||
      priveousEmpty.y != oneRandomMoveResult[0].y
    ) {
      swap(oneRandomMoveResult[0], findCoordinatesByNumber(16, matrix), matrix);
      setPositionItems(matrix);
    }

    priveousEmpty = {
      x: oneRandomMoveResult[1].x,
      y: oneRandomMoveResult[1].y,
    };

    console.log(i);
  }
  // console.log(secondEmpty);

  // 2. Повторить смещения N раз

  // реальное смещение элементов

  // обнуление ходов
  moveReset();

  // обнуление времени
  ClearСlock();
  StartStop();
});

// 3. Изменение позиции по клику
const blankNumber = 16;
containerNode.addEventListener("click", (event) => {
  const buttonNode = event.target.closest("button");
  if (!buttonNode) {
    return;
  }

  const buttonNumber = Number(buttonNode.dataset.matrixId);
  const buttonCords = findCoordinatesByNumber(buttonNumber, matrix);
  const blankCords = findCoordinatesByNumber(blankNumber, matrix);

  const isValid = isValidForSwap(buttonCords, blankCords);

  if (isValid) {
    swap(buttonCords, blankCords, matrix);
    setPositionItems(matrix);
  }
});

// 4. Изменение позиции по нажатию стрелок
window.addEventListener("keydown", (event) => {
  if (!event.key.includes("Arrow")) {
    return;
  }
  console.log(event.key);

  const blankCords = findCoordinatesByNumber(blankNumber, matrix);
  const buttonCords = {
    x: blankCords.x,
    y: blankCords.y,
  };

  if (event.key == "ArrowDown") {
    buttonCords.y = buttonCords.y - 1;
  }

  if (event.key == "ArrowUp") {
    buttonCords.y = buttonCords.y + 1;
  }

  if (event.key == "ArrowLeft") {
    buttonCords.x = buttonCords.x + 1;
  }

  if (event.key == "ArrowRight") {
    buttonCords.x = buttonCords.x - 1;
  }

  if (
    // 0 <= buttonCords.x < 4 &&
    // 0 <= buttonCords.y < 4

    buttonCords.x >= 0 &&
    buttonCords.x < 4 &&
    buttonCords.y >= 0 &&
    buttonCords.y < 4
  ) {
    swap(buttonCords, blankCords, matrix);
    setPositionItems(matrix);
  }
});

// Пауза и запуск таймера

// ===============================================================
// вспомогательные функции

function getMatrix(arr) {
  let matrix = [[], [], [], []];
  let x = 0;
  let y = 0;

  for (let i = 0; i < arr.length; i++) {
    if (x >= 4) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }
  return matrix;
}

function setPositionItems(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];
      setNodeStyles(node, x, y);
    }
  }

  // Нужно добавить блок, при срабатывании данной функции увеличиваем число ходов на 1.
  moveUpper();
  chackWon(matrix);
}

// подмена стилей, чтобы установить смешения для всех блоков
function setNodeStyles(node, x, y) {
  const shiftPs = 100;
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%, 0)`;
}

// перемешивание массива
function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// поиск кооринаты блока
function findCoordinatesByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (number == matrix[y][x]) {
        return { x, y };
      }
    }
  }
  return null;
}

// проверка валидности смешения блоков
function isValidForSwap(coords1, coords2) {
  const diffX = Math.abs(coords1.x - coords2.x);
  const diffY = Math.abs(coords1.y - coords2.y);
  return (
    (diffX == 1 || diffY == 1) &&
    (coords1.x == coords2.x || coords1.y == coords2.y)
  );
}

// смещение блоков
function swap(coords1, coords2, matrix) {
  const coords1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Number;
}

// подсчет ходов
function moveUpper() {
  let countMoves = Number(document.getElementById("moves__count").textContent);
  document.getElementById("moves__count").textContent = +countMoves + 1;
}

function moveReset() {
  document.getElementById("moves__count").textContent = 0;
}

// СЕКУНДОМЕР

// window.onload = () => {
//   StartStop();
// };

//объявляем переменные
var base = 60;
var clocktimer, dateObj, dh, dm, ds, ms;
var readout = "";
var h = 1,
  m = 1,
  tm = 1,
  s = 0,
  ts = 0,
  ms = 0,
  init = 0;

//функция для очистки поля
function ClearСlock() {
  clearTimeout(clocktimer);
  h = 1;
  m = 1;
  tm = 1;
  s = 0;
  ts = 0;
  ms = 0;
  init = 0;
  readout = "00:00";
  document.getElementById("time__count").textContent = readout;
}

//функция для старта секундомера
function StartTIME() {
  var cdateObj = new Date();
  var t = cdateObj.getTime() - dateObj.getTime() - s * 1000;
  if (t > 999) {
    s++;
  }
  if (s >= m * base) {
    ts = 0;
    m++;
  } else {
    ts = parseInt(ms / 100 + s);
    if (ts >= base) {
      ts = ts - (m - 1) * base;
    }
  }
  if (m > h * base) {
    tm = 1;
    h++;
  } else {
    tm = parseInt(ms / 100 + m);
    if (tm >= base) {
      tm = tm - (h - 1) * base;
    }
  }
  ms = Math.round(t / 10);
  if (ms > 99) {
    ms = 0;
  }
  if (ms == 0) {
    ms = "00";
  }
  if (ms > 0 && ms <= 9) {
    ms = "0" + ms;
  }
  if (ts > 0) {
    ds = ts;
    if (ts < 10) {
      ds = "0" + ts;
    }
  } else {
    ds = "00";
  }
  dm = tm - 1;
  if (dm > 0) {
    if (dm < 10) {
      dm = "0" + dm;
    }
  } else {
    dm = "00";
  }
  dh = h - 1;
  if (dh > 0) {
    if (dh < 10) {
      dh = "0" + dh;
    }
  } else {
    dh = "00";
  }
  readout = dm + ":" + ds;
  document.getElementById("time__count").textContent = readout;
  clocktimer = setTimeout("StartTIME()", 1);
}

//Функция запуска и остановки
function StartStop() {
  if (init == 0) {
    ClearСlock();
    dateObj = new Date();
    StartTIME();
    init = 1;
  } else {
    clearTimeout(clocktimer);
    init = 0;
  }
}

// =========================================
// Подфункции умного перемешивания

function oneRandomMove() {
  // найти пустой блок №16
  // найти валидные смещения
  // сместить
  // запомнить прошлую позицию

  const emptyBlock = findCoordinatesByNumber(blankNumber, matrix);
  // console.log(emptyBlock);

  let coordsArray = [];
  console.log("\nИзначальный пустой блок: " + JSON.stringify(emptyBlock));

  // up
  if (emptyBlock.y - 1 >= 0) {
    coordsArray.push({ x: emptyBlock.x, y: emptyBlock.y - 1 });
  }
  // down;
  if (emptyBlock.y + 1 < 4) {
    coordsArray.push({ x: emptyBlock.x, y: emptyBlock.y + 1 });
  }
  // left;
  if (emptyBlock.x - 1 >= 0) {
    coordsArray.push({ x: emptyBlock.x - 1, y: emptyBlock.y });
  }
  // right;
  if (emptyBlock.x + 1 < 4) {
    coordsArray.push({ x: emptyBlock.x + 1, y: emptyBlock.y });
  }

  let side = Math.round(Math.random() * (coordsArray.length - 1));
  console.log("Варианты для смещения: " + JSON.stringify(coordsArray));
  console.log("Номер рандома " + side);
  console.log("Блок становится пустым " + JSON.stringify(coordsArray[side]));
  return [coordsArray[side], emptyBlock];
}

function chackWon(matrix) {
  console.log(matrix.join() == "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16");

  setTimeout(() => {
    let countMoves = Number(
      document.getElementById("moves__count").textContent
    );
    if (
      matrix.join() == "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16" &&
      countMoves > 2
    ) {
      alert("УРА! ПОБЕДА!");
    }
  }, 100);
}
