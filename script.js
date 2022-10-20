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
  const flatMatrix = matrix.flat();
  const shuffledArray = shuffleArray(flatMatrix);
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
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

// проверка варилдности смешения блоков
function isValidForSwap(coords1, coords2) {
  //   return Math.abs(coords1.x + coords1.y - (coords2.x + coords2.y)) == 1;
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
