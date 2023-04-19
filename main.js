(function() {
// создаем заголовок игры
function createAppTitle () {
  const appTitle = document.createElement('h2');
  appTitle.classList.add('h2', 'text-center');
  appTitle.innerHTML = 'Игра в пары';
  return appTitle;
}

//создаем поля ввода для задания количества пар
function createdAppForm() {
  const form = document.createElement('form');
  const inputVert = document.createElement('input');
  const inputGor = document.createElement('input');


  inputGor.placeholder = 'Введите количество карточек по горизонтали';
  inputVert.placeholder = 'Введите количество карточек по вертикали';

  form.classList.add('input-group', 'justify-content-center', 'mb-3');
  inputGor.classList.add('form-text');
  inputVert.classList.add('form-text')

  form.append(inputGor);
  form.append(inputVert);

  return {
    form,
    inputGor,
    inputVert,
  }


}

// создаем кнопки старт и сыграть еще раз
function createAppButtons() {
  const startButton = document.createElement('button');
  const tryAgainButton = document.createElement('button');

  startButton.classList.add('btn', 'btn-primary', 'mb-4');
  tryAgainButton.classList.add('btn', 'btn-primary');

  startButton.textContent = 'Начать игру';
  tryAgainButton.textContent = 'Сыграть еще раз';

  return {
    startButton,
    tryAgainButton,
  }
}

//создаем список для карточек
function createCardsList() {
  const list = document.createElement('ul');
  list.classList.add('list-group', 'flex-row', 'flex-wrap', 'align-items-center', 'justify-content-center');
  return list;
}

//создаем карточку
function createAppItem() {
  const item = document.createElement('li');
  item.classList.add('list-group-item', 'mb-3');
  return item;
}

//генерируем массив парных чисел, count - колтво пар
function createNumbersArray(count) {
  const numbersArray = [];
  const gameOverArray = [];
  for (let i = 1; i <= count; i++) {
    numbersArray.push(i);
    numbersArray.push(i);
    gameOverArray.push(i);
  }
  return {
    numbersArray,
    gameOverArray,
  }
}

// перемешиваем массив

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // суть в том, чтобы проходить по массиву в обратном порядке и менять местами каждый элемент со случайным элементом, который находится перед ним.
  }
  return arr;
}

function startApp() {
  const container = document.createElement('div');
  container.classList.add('container', 'd-flex', 'align-items-center', 'flex-column');
  const h2 = createAppTitle();
  const form = createdAppForm().form;
  const list = createCardsList();
  const startButton = createAppButtons().startButton;
  const tryAgainButton = createAppButtons().tryAgainButton;
  let interval;

  document.body.append(container);
  container.append(h2);
  container.append(form);
  container.append(startButton);
  container.append(list);

  let inputGor = 4;
  let inputVert = 4;
  let count;
  form.firstElementChild.addEventListener('input', () => {
    inputGor = (parseInt(form.firstElementChild.value) % 2 == 0
    && 2<=parseInt(form.firstElementChild.value)
    && parseInt(form.firstElementChild.value)<= 10) ? parseInt(form.firstElementChild.value) : 4;
  });
  form.lastElementChild.addEventListener('input', () => {
    inputVert = inputGor = (parseInt(form.lastElementChild.value) % 2 == 0
    && 2<=parseInt(form.lastElementChild.value)
    && parseInt(form.lastElementChild.value)<= 10) ? parseInt(form.lastElementChild.value) : 4;
  });



  startButton.addEventListener('click', () => {
    timer();
    startNewGame();
  });
  tryAgainButton.addEventListener('click', () => {
    location.reload();
  });

  // начало игры
  function startNewGame() {

    count = inputGor*inputVert/2;
    form.firstElementChild.value = '';
    form.firstElementChild.disabled = true
    form.lastElementChild.value = '';
    form.lastElementChild.disabled = true;

    const arrayForGame = shuffle(createNumbersArray(count).numbersArray);
    const arrayGameOver = createNumbersArray(count).gameOverArray;

    for (let i=0; i<arrayForGame.length; i++) {
      const item = createAppItem();
      const cardNumber = document.createElement('div');
      cardNumber.classList.add('card-number', 'number--not-active');
      cardNumber.textContent = `${arrayForGame[i]}`;
      item.append(cardNumber);
      list.append(item);
    }

    startButton.setAttribute('disabled', 'disabled');

    const card = document.querySelectorAll('.list-group-item');
    let cardValue = null;
    let prevCard = null;

    card.forEach(function(el) {
      el.addEventListener('click', () => {
        el.style.cssText = 'background-image: none';
        el.firstElementChild.classList.remove('number--not-active');
        el.firstElementChild.classList.add('number--active');
        let currentCardValue = el.firstElementChild.textContent;
        let currentCard = el.firstElementChild;

        if (cardValue == null) {
          el.style.cssText = 'background-image: none';
          el.firstElementChild.classList.remove('number--not-active');
          el.firstElementChild.classList.add('number--active');
          cardValue = currentCardValue;
          prevCard = currentCard;
        }
        else if (cardValue != currentCardValue) {
          setTimeout(() => {
            el.style.cssText = 'background-image: url("card.webp")';
            el.firstElementChild.classList.add('number--not-active');
            el.firstElementChild.classList.remove('number--active');
          }, 1000);
            el.style.cssText = 'background-image: none';
            el.firstElementChild.classList.remove('number--not-active');
            el.firstElementChild.classList.add('number--active');
            setTimeout(() => {
              prevCard.parentElement.style.cssText = 'background-image: url("card.webp")';
              prevCard.classList.add('number--not-active');
              prevCard.classList.remove('number--active');
              prevCard = null;
              cardValue = null;
            }, 1000);
        }
        else if (cardValue == currentCardValue) {
          el.style.cssText = 'background-image: none';
          el.firstElementChild.classList.remove('number--not-active');
          el.firstElementChild.classList.add('number--active');
          const indexForDelete = arrayGameOver.indexOf(parseInt(currentCardValue));
          arrayGameOver.splice(indexForDelete, 1);
          if (arrayGameOver.length == 0) {
            clearInterval(interval);
            startButton.textContent = 'Поздравляю! Сыграй еще!'
            container.append(tryAgainButton);
          }
          console.log(arrayGameOver)
          cardValue = null;
          prevCard = null;
        }
      })
  })
  }

  //timer
  function timer() {
    let timer = 60;
    interval = setInterval(() => {
      startButton.textContent = timer;
      timer--;
      if (timer == 0) {
        startButton.textContent = 'Конец игры'
        clearInterval(interval);
        container.append(tryAgainButton);
      };
    }, 1000);
  }
}

window.startApp = startApp;

})();

