'use strict';
////////////////////////////////////
//////////// Scrolling button
let btnScrollTo = document.querySelector('.btn--scroll-to');
let section1 = document.getElementById('section--1');
let section3 = document.getElementById('section--3');

let footLogo = document.querySelector('.footer__logo');

btnScrollTo.addEventListener('click', function (e) {
  ////// Scrolling
  // let s1coords = section1.getBoundingClientRect(); // команда для получения координат секции
  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect()); // координат кнопки
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // координат, где непосредственно находится скролл окна
  // console.log(
  //   'height/width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); // команды для определения количества пикселей видимой зоны
  /// OLD SCHOOL
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); // функция скролла доступна в window и в аргументы вбивается координата х и координата y (которую взяли у переменной s1coords). Сумма необходима потому что расстояние меняется в зависимости где мы находимся на странице!!!
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // }); /// чтобы произошел плавный скрол, нужно задавать объект и поведение
  /// MODERN SCHOOL
  section1.scrollIntoView({ behavior: 'smooth' });
  // footLogo.scrollIntoView({ behavior: 'smooth' }); // другой элемент для проверки
});
/////////////////////////////////
////////////////// Page navigation////

// document.querySelectorAll('.nav__link').forEach(function (el, i, ar) {
// el.addEventListener('click', function (e) {
// e.preventDefault(); // нужно чтобы предотвратить ссылку через HTML #section
// let id = this.getAttribute('href'); // через атрибут получили название нужной нам области
// console.log(id);
// document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' }); // прописали переход к области через переменную id, полученную ранее!!!
// });
// }); /// но это не самое лучшее решение

/// Способ через Event delegation
// 1. Add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // нужно чтобы предотвратить ссылку через HTML #section
  // 2. Determine what element originated the event
  console.log(e.target);
  // 3. Matching strategy
  if (e.target.classList.contains('nav__link')) {
    let id = e.target.getAttribute('href'); // через атрибут получили название нужной нам области
    console.log(id);
    document.querySelector(`${id}`).scrollIntoView({ behavior: 'smooth' });
  }
});
/////////////////////// Tabbed component///
let tabs = document.querySelectorAll('.operations__tab');
let tabsContainer = document.querySelector('.operations__tab-container');
let tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  let clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  /////// Guard clause
  if (!clicked) return; // смысл в том, что если кликнул не туда, где навигатион бар, а за область - там клосест будет null, а если он null- значит будет false и значит сразу прекращай выполнение через return!!!

  /////// Remove active all tabs
  tabs.forEach(el => el.classList.remove('operations__tab--active')); // удаляем на всех активный класс
  ////// Activate tab
  clicked.classList.add('operations__tab--active'); // добавляем активный класс на нажатую кнопку
  ////// Activate content area
  // Remove active content сначала удалить везде активный
  tabsContent.forEach(e => e.classList.remove('operations__content--active'));
  // Active content сделать активным
  let dataTab = clicked.dataset.tab; // вместо getAttribute можно через dataset получить данные из HTML
  // console.log(dataTab);
  // и потом выбрать этот контент с учетом привязки номера даты!
  document
    .querySelector(`.operations__content--${dataTab}`)
    .classList.add('operations__content--active');
});
///////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
////./////////////// Menu Fade animation
let nav = document.querySelector('.nav');

//////////// Способ через внесение повторяющейся функции

// function handleHover(opacityIns, e) {
//   if (e.target.classList.contains('nav__link')) {
//     // не используем closest, потому что в отличие от прошлых кнопок тут нет child элементов типо цифр, поэтому проще сделать так!
//     let link = e.target;
//     let siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     let logo = link.closest('nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) {
//         el.style.opacity = opacityIns;
//         logo.style.opacity = opacityIns;
//       }
//     });
//   }
// }

// Два листенера, которые отвечают за снижение яркости при наведении, и увеличении яркости при уходе стрелки

// nav.addEventListener('mouseover', function (e) {
//   // используем mouseover вместо mouseenter, потому что mouseenter не имеет bubbling phase. Opposite to mouseenter - mouseleave; mouseover - mouseout
//   e.preventDefault();
//   handleHover(0.5, e); // повторяющийся код внесли в функцию, а чтобы event мог использоваться, также внесли его во внутренности кода
// });

// nav.addEventListener('mouseout', function (e) {
//   e.preventDefault();
//   handleHover(1, e);
// });

////////////// Способ через .bind (замысловатый!) How to pass arguments into event handler!
//// Passing "argument" into function
nav.addEventListener('mouseover', handleHover.bind(0.5)); // через bind закрепили значение, которое будет в функции this!

nav.addEventListener('mouseout', handleHover.bind(1)); // чтобы закрепить больше, надо вносить array из значений

function handleHover(e) {
  // e - единственный параметр, который может иметь эта функция
  if (e.target.classList.contains('nav__link')) {
    let link = e.target;
    let siblings = link.closest('.nav').querySelectorAll('.nav__link');
    let logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this; // а это закрепленное значение вставили через this!
        logo.style.opacity = this;
      }
    });
  }
}
//////////////////////////////////////////////////////////
///////////////////// Sticky Navigation
///1. Scroll Event - not efficient потому что каждое движение скролл заставляет грузить систему
// let initialCoordsS1 = section1.getBoundingClientRect(); // получили координаты первой секции

// window.addEventListener('scroll', function (e) {
//   // закрепили event к скроллу
//   if (window.scrollY > initialCoordsS1.top) {
//     // задали условие, что если позиция скролла по У больше координаты первой секции то добавляется класс
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky'); // если меньше - убирается класс
//   }
// });
/////////2. Intersection Observer API - лучший вариант (смотреть видео - сложно!)
// let obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// let obsOptions = {
//   // функция будет вызываться каждый раз, когда будут выполнятся условия
//   root: null, // пересечение
//   threshold: [0, 0.2], // это нужно детально смотреть на видео в 197 видео
// };

// let observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

let header1 = document.querySelector('.header');
let navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
let stickyNav = function (entries) {
  let [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
let headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`, //дополнительный марджин на высоту nav bara чтобы красиво появлялся на 1 секции
});
headerObserver.observe(header1);

///////////////////////////////////////////
//////////////////// Reveal Sections
/// задаем Nodelist из элементов с которыми будет работать
let allSections1 = document.querySelectorAll('.section');
/// создаем функцию для обсервера. При этом аргументы функций теперь entries и observer
let revealSection = function (entries, observer) {
  let [entry] = entries;
  // console.log(entry);
  // задаем Guard clause - если не совпадает - закончи функцию
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden'); // если совпадает - выполняй
  observer.unobserve(entry.target); // после выполнения задачи, говорим перестать следить
};

let sectionObserver = new IntersectionObserver(revealSection, {
  root: null, // на всем view
  threshold: 0.15, // 15 % заступа
});
allSections1.forEach(function (el) {
  el.classList.add('section--hidden'); // добавляем через JS скрытие секций
  sectionObserver.observe(el); // задаем обсерверу смотреть элементы
});

/////////////////////////////
/////////////////// Lazy Loading Images
// создаем Nodelist из переменных картинок с помощью img и сss атрибута data-src
let imgTargets = document.querySelectorAll('img[data-src]');
// создаем функцию для обсервера
let loadImg = function (entries, observer) {
  let [entry] = entries;
  // console.log(entry);
  /// Guard clause если не пересекает
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // блюр эффект убирает только после загрузки картинки высокого качества!
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  // прекращаем следить обсервером
  observer.unobserve(entry.target);
};
// сам обсервер
let imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0, /// первое пересечение
  rootMargin: '-200px',
});
/// Лупинг среди картинок для вызова обсервера
imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

///////////////////////////////////////
////////// Slider Component
// Задаем пул слайдов, текущий слайд, максимальное количество слайдов
let slides = document.querySelectorAll('.slide');
let currentSlide = 0;
let maxSlide = slides.length;

// / Чисто для визуального уменьшения, не продуктивный код
let slider = document.querySelector('.slider');
slider.style.transform = 'scale(1)';
slider.style.overflow = 'visible';

/// Задаем кнопки
let btnLeft = document.querySelector('.slider__btn--left');
let btnRight = document.querySelector('.slider__btn--right');

/// Начальное состояние распределяем, а то все вместе лежат
slides.forEach(function (s, i) {
  s.style.transform = `translateX(${100 * i}%)`;
});

/// задаем функцию перехода на слайд
function goToSilde(slide) {
  slides.forEach(function (s, i) {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
}

// Going to next slide

btnRight.addEventListener('click', function (e) {
  // условие, что когда достигаем максимального слайда, уравняем 0
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  }
  /// в другом случае увеличиваем номер слайда
  else {
    currentSlide++;
  }
  // и двигаемся к этому слайду
  goToSilde(currentSlide);
  // и также активируем соответствующий дот
  activateDot(currentSlide);
});

/// Going to previous slide
btnLeft.addEventListener('click', function (e) {
  // условие, что когда 0 слайд - переходим на максимальный
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  }
  // в ином случае уменьшаем номер слайда
  else {
    currentSlide--;
  }
  // и двигаемся к этому слайду
  goToSilde(currentSlide);
  //и также активируем соответствующий дот
  activateDot(currentSlide);
});

/// Задаем листенер и функцию на кнопки влево и вправо
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    // условие, что когда 0 слайд - переходим на максимальный
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    }
    // в ином случае уменьшаем номер слайда
    else {
      currentSlide--;
    }
    // и двигаемся к этому слайду
    goToSilde(currentSlide);
    //и также активируем соответствующий дот
    activateDot(currentSlide);
  } else if (e.key === 'ArrowRight') {
    // условие, что когда достигаем максимального слайда, уравняем 0
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    }
    /// в другом случае увеличиваем номер слайда
    else {
      currentSlide++;
    }
    // и двигаемся к этому слайду
    goToSilde(currentSlide);
    //и также активируем соответствующий дот
    activateDot(currentSlide);
  }
});

////// Dot functional for Slider
// задаем дот контейнер
let dotContainer = document.querySelector('.dots');
// создаем функцию, в которой заполняем этот контейнер дотами шаблонными
function createDots() {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
}
// включаем эту функцию
createDots();

/// создаем функцию активации дота на основе dataSet
function activateDot(slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active')); // отключаем везде активный дот

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`) // ловим активный дот через дата set и даем ему активность
    .classList.add('dots__dot--active');
}

// отображаем активный дот (ниже раздел)
activateDot(0);

// Вешаем ивент листенер на родительский контейнер дотов
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    let slide = e.target.dataset.slide;
    goToSilde(slide);
    activateDot(slide);
  }
});

///////////////////////////////////////
///// Modal window

// задаем окна из html
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// Функция для открытия окна и замены параметров для отображения в css
const openModal = function (e) {
  e.preventDefault(); // прописав превент дефалт мы избавились от сквачка страницы в начало, при нажатии кнопки!
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
// Функция для закрытия окна и замены параметров отображения в css
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
/// Функция захвата одной из кнопок из nodelist при ее нажатии и реализации открытия
btnsOpenModal.forEach(function (el) {
  el.addEventListener('click', openModal);
});

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal); // старый способ прописания лупа для контроля кнопок для нажатия

// Кнокпка закрытия и окна modal и ее функционал
btnCloseModal.addEventListener('click', closeModal);
// Закрытие окна modal при нажатии на зону вне кнопки
overlay.addEventListener('click', closeModal);
// Закрытие окна modal при нажатии на esc на клаве
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//// Lifecycle dom - events

document.addEventListener('DOMContentLoaded', function (e) {
  // DOMcontentloaded - event, когда прогружается HTML+JS без jpg
  console.log(e);
});
window.addEventListener('load', function (e) {
  // этот event, когда прогрузится вся страница
  console.log(e);
});
/// Диалоговое окно перед закрытием
window.addEventListener('beforeunload', function (e) {
  e.preventDefault();
  console.log(e); // event, который происходит непосредственно перед закрытием страницы
  e.returnValue = ''; // он нужен для задания вопроса перед закрытием браузера
});

////////////////////////////////////// Lecture

/// Способы получения элементов из HTML! Selecting Elements

// console.log(document.documentElement); // позволяет получить в консоли полное дерево html документа!
// console.log(document.head); // можно получить head
// console.log(document.body); // а также body!

let header = document.querySelector('.header'); // если мы хотим получить первый элемент/или если документ один - querySelector
let allSections = document.querySelectorAll('.section'); // а если хотим получить все элементы в nodeList, то querySelectorAll
// console.log(allSections);
document.getElementById('section--1'); // если хотим получить элемент только по его уникальному id - используем getElementByID!
let allButtons = document.getElementsByTagName('button'); // этот способ возвращает html collection (live collection) - если будет изменен DOM, то и эта коллекция сразу изменится
// console.log(allButtons);
// console.log(document.getElementsByClassName('btn')); // также возвращает html collection!

/// Основные способы это - QuerySelector/QueryselectorAll, остальные типы второстепенные и помогают в определенных ситуациях

///////////////////// Creating and inserting elements
// .insertAdjacentHTML - добавляет элементы  (пример в предыдущем проекте)

// Создал пример ниже сам - в body вставил копию одной из секций
// let body = document.querySelector('body');

// let newSection = `<section class="section" id="section--10">
// <div class="section__title">
//   <h2 class="section__description">New Section #10</h2>
//   <h3 class="section__header">
//     I want to check
//   </h3>
// </div>`;

// body.insertAdjacentHTML('afterend', newSection); // вставил этот элемент в конце всех секций body

//// Другие виды

let message = document.createElement('div'); // создает элемент и сохранили в переменной, но он еще не привязон к DOM tree
message.classList.add('cookie-message'); // к этому элементу добавили класс CSS (не надо использовать точку!!!)
// message.textContent = 'We use cookies for improved analytics.';
message.innerHTML =
  'We use cookies for improved analytics. <button class="btn btn--close-cookie" >Got it!</button>'; // внесли этому элементу текст и кнопку
// header.prepend(message); // а теперь добавли в html с помощью prepend - он ставит первым элементом в header!
header.append(message); // append - он ставит последним элементом
// нельзя один элемент (в нашем случае message) сначала prepenдить а потом апендить, потому что это один элемент и он согласно коду вставент в позицию, которая написана последней

// чтобы сделать в нескольких местах, нужно провести копирование
// header.append(message.cloneNode(true));

// header.before(message); // .before вставляет объект перед header и является его братом, в отличие от append и prepend, когда message вставляется внутрь header
// header.after(message) // вставляет объект после header и делает его братом, а не внутрь

// Delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove(); // .remove() метод часто встречается для удаления объекта
    // message.parentElement.removeChild(message); // это старый способ удаления - DOM traversing, до появления remove
  });

///////////////////// Styles, Attributes and Classes

/// Styles
message.style.backgroundColor = '#37383d'; // через .style мы модем менять CSS поменять цвет заливки
message.style.width = '120%'; // например поменять ширину
message.style.fontSize = '20px'; // или поменять шрифт текста

console.log(message.style.height); // ничего не дало, потому что я не вводил этот параметр
console.log(message.style.backgroundColor); // дало информацию
console.log(message.style.fontSize); // также дало, потому что я внес
/// Есть способ получить данные которые не вводили через getComputedStyle
// console.log(getComputedStyle(message));
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 10 + 'px'; // внес изменения в height стандартные плюс мое изменение
console.log(message.style.height);

//// CSS variables
document.documentElement.style.setProperty('--color-primary', 'olive'); // поменял основной цвет элементов CSS

///  Atributes - это все что в html перед ==, src=, alt=, class=, id= и тд
let logo = document.querySelector('.nav__logo');
console.log(logo);
console.log(logo.className); // класс нейм вместо класс - так получилось исторически

///////// Non-standard
console.log(logo.designer); // самопальные атрибуты не вызваются - undefined
console.log(logo.getAttribute('designer')); // можно вызвать через специальный метод
////
logo.alt = 'Beautiful minimalist logo'; // так можно вносить изменения в  стандартный атрибут
logo.setAttribute('company', 'Bankist'); // так можно задавать нестандартные атрибуты

console.log(logo.src); // можно вызывать стандартные атрибуты // src здесь полный, в отличии от HTML где относительный
console.log(logo.getAttribute('src')); // вот здесь относительный

let link = document.querySelector('.nav__link--btn');
console.log(link.href); // абсолютный путь
console.log(link.getAttribute('href')); // относительный путь!

/// Data attributes
console.log(logo.dataset.versionNumber); // атрибут data - нужно обратить внимание, что в HTML он называется data-version-number, а тут вызывается через dataset, да еще и дальше запрос через camelCase!!!

// Classes - основные функции для класса прописываются через classList
// logo.classList.add('jj');
// logo.classList.remove('jj');
// logo.classList.toggle('jj');
// logo.classList.contains('jj'); // not includes как в array...

// Don't use
// logo.className = 'jonas'; // лучше не использовать, т.к. перезатирает class, нужно использовать 4 команды выше!

/////////////////////////// Smooth scrolling
// Чтобы провести скроллинг в кнопке, достаточно написать элемент к которому хотим провести скролл
// section1.scrollIntoView({ behavior: 'smooth' });
// вся остальная теория old school and modern school выше

///////////////////////// Events and Event Handlers!

let h1 = document.querySelector('h1');
h1.addEventListener(
  'mouseenter',
  conslFun // mouseenter проверяется когда на элемент будет наведена мышка!
);
//// Про все виды event можно посмотреть на MDN JS

function conslFun(e) {
  console.log('Hello there!');

  // h1.removeEventListener('mouseenter', conslFun); // чтобы единожды произошло выполнение eventlistener, просто внутрь функции вставляем remove
}
/// другие способы event handler (old school)

// h1.onmouseleave = function (e) {
//   // mouseenter проверяется когда на элемент будет наведена мышка!
//   console.log('Hello there!');
// };

/// Преимущество addEvent:
// 1) в том что его можно скопировать, и например на клик сделать еще функцию для выполнения. А вот на onmouseclick если еще раз скопируешь и внесешь функцию, она просто ее перезатерет!!!
// 2) Можно удалить event, если он больше не нужен (либо вставить заранее в функцию выполнения eventa, либо через определенное время)

setTimeout(e => h1.removeEventListener('mouseenter', conslFun), 5000);

/// Еще один способ выпонения event handler через HTML - don't use!
// Прописывается непосредственно в HTML (old school) <h1 onclick="alert('HTML alert!')">

////// Event Bubbling and Capturing
// Event propogate - состоит из 2 фаз: Capturing phase and Bubbling phase
// Capturing phase - когда нажимают на таргет eventa и он идет по дереву сначала - document - html - body - section - target el.
// выполняет event
// и затем идет bubbling phase - когда идет обратно от target el - section - body - html - document
// Это нужно чтобы следить за выполнением очередности eventов в дереве, если event прикреплен на родителе
// Не на всех event handleraх есть фазы capturing and bubbling

// rgb(255, 255, 255);
let randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
let randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
// this.style.backgroundColor = randomColor();
// console.log('LINK', e.target, e.currentTarget);
// console.log(this === e.currentTarget); // для event listenera this = e.currentTarget если ивент повешан на нашу прямую целя, а не на parent!!!

// Stop event propagation
// e.stopPropagation(); // благодаря этой функции не произойдет выполнение нижележащих ивентов
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
// this.style.backgroundColor = randomColor();
// console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
// 'click',
// function (e) {
// // this.style.backgroundColor = randomColor();
// // console.log('NAV', e.target, e.currentTarget);
// },
// false
// ); // вставив 3 элементом в ивент листенер true, я задал выполнение листенера не в bubling phase, а в первой capturing phase

// На этом примере было показано, что нажимая на первый элемент кнопку в bubling phase выполнялось 3 ивента на самой кнопке, на секции кнопок и на навигейшен баре!

///// Event delegation - UP Section in Page Navigation

/////////////////////////// DOM Traversing
/// Going downwards: child
console.log(h1.querySelectorAll('.highlight')); // удалось забрать child у h1, причем не имеет значения, насколько глубоко сидит child!
// 1)Пойдет в глубь DOM tree если нужно.
// 2)Однако если бы на странице были другие элементы с этим классом, но не под h1, тогда мы их не заберем!
console.log(h1.childNodes); // все child у h1 в формате Nodelist
console.log(h1.children); // все children у h1 в формате HTML collection
// h1.firstElementChild.style.color = 'red'; // команда использования 1 child
// h1.lastElementChild.style.color = 'blue'; // команда использования последнего child
/// Going upwards: parents
console.log(h1.parentNode); // получение родителя
console.log(h1.parentElement); // получение родительского элемента
// h1.closest('.header').style.background = 'var(--gradient-secondary'; // closest функция для получения ближнего элемента, но его надо вносить как в quarySelector. Будем использовать часто для event delegation
// h1.closest('h1').style.background = 'olive'; // аналог querySelector только для поднятия вверх

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling); // оба метода дают ближайщих сестер

console.log(h1.parentElement.children); // чтобы увидеть всех сестер, можно подняться на parent element и посмотреть детей
// [...h1.parentElement.children].forEach(function (el, i, ar) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

///// Tabbed component
