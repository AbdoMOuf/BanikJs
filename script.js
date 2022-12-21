"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Abdo Ouf",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2022-12-03T17:01:17.194Z",
    "2022-12-04T23:36:17.929Z",
    "2022-12-06T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US", // de-DE
};

const account2 = {
  owner: "Abdo Mahmoud Mousa",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],

  currency: "EGP",
  locale: "ar-eg",
};

const account3 = {
  owner: "Omar Bassem",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    "2017-01-25T14:18:46.235Z",
    "2018-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2021-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],

  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 24 * 60 * 60));

  const daysPassed = calcdaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return "ToDay";
  if (daysPassed === 1) return "YesterDay";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  // const hour = date.getHours();
  // const min = date.getMinutes();

  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
          <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type.toUpperCase()}</div>
         <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${formattedMov}</div>
          </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);

const calcDisplayBlance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;

  const formattedBalance = formatCur(balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedBalance}`;
};
// calcDisplayBlance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .filter(mov => mov > 1)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// calcDisplaySummary(account1.movements);

const creatUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};
creatUserName(accounts);

const updateUI = function (currAcc) {
  // Display Movements
  displayMovements(currAcc);
  // display balance
  calcDisplayBlance(currAcc);
  // display summary
  calcDisplaySummary(currAcc);
};

// timer
const startLogOutTimer = function () {
  let time = 30;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    //When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearTimeout(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // decrese is

    time--;
  };
  // set time to 5minutes

  tick();
  // call the timer every second
  const timer = setInterval(tick, 1000);

  return timer;
};

// **************************************************************** //
// Event handler

let currentAcount, timer;

// Fake currentAcount

// currentAcount = account1;
// updateUI(currentAcount);
// containerApp.style.opacity = 100;

// Experimenting API

btnLogin.addEventListener("click", function (e) {
  // prevent form from submitting  يمنع الصفحه من التحميل لان الزرار الي بيبقي في فورم بيعمل تحميل للصفحه علطول

  e.preventDefault();
  currentAcount = accounts.find(
    acc => acc.userName === inputLoginUsername.value
  );

  if (currentAcount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Message
    labelWelcome.textContent = `Welcome back, ${
      currentAcount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // creat date
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    //  labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
    // day / month / year

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: "long",
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAcount.locale,
      options
    ).format(now);

    // clear in fields
    // inputLoginUsername.value = inputLoginPin.value = "";

    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // update UI
    updateUI(currentAcount);
  }
});
// **************************************************************** //

// transform money form acount to antoher acount
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAcount.balance >= amount &&
    receiverAcc.userName !== currentAcount.userName
  ) {
    // doing to transform
    currentAcount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Date transfer money
    const date = new Date().toISOString();
    currentAcount.movementsDates.push(date);
    receiverAcc.movementsDates.push(date);

    updateUI(currentAcount);

    // reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }

  inputTransferAmount.value = "";
  inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
});
// **************************************************************** //
// loan Money
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAcount.movements.some(mov => mov >= (10 / 100) * amount)
  ) {
    setTimeout(function () {
      // Add movement
      currentAcount.movements.push(amount);

      // add Date
      const date = new Date().toISOString();
      currentAcount.movementsDates.push(date);

      // Update UI
      updateUI(currentAcount);

      // clear field
      inputLoanAmount.value = "";
    }, 3000);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// **************************************************************** //
// close account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcount.userName &&
    currentAcount.pin === Number(inputClosePin.value)
  ) {
    // number of index form array
    const index = accounts.findIndex(
      acc => acc.userName === currentAcount.userName
    );
    // deleted acount from array
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});
// **************************************************************** //
// sort

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAcount.movements, sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// console.log(23 === 23.0);
// console.log(0.1 + 0.3);

// // conversion string to number

// console.log(Number("23"));
// console.log(+"23");

// // parsing Int
// console.log(Number.parseInt(" 23&&", 10)); // 23
// console.log(Number.parseInt("&&*23", 10)); // NAN

// // parsing float
// console.log(Number.parseInt(" 2em"));
// console.log(Number.parseFloat(" 2.5 rem"));

// //
// // console.log(Number.isNaN(20));
// // console.log(Number.isNaN("20&"));
// // console.log(Number.isNaN(+"23$"));

// // checking if valu is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite("23"));
// console.log(Number.isFinite(+"23"));
// console.log(Number.isFinite(+"23$"));

// console.log(Math.sqrt(25));
// console.log(Math.sqrt(36));

// console.log(25 ** (1 / 2));
// console.log(8 ** (1 / 3));

// console.log(Math.max(2, 3, 50, 929, 3));
// console.log(Math.min(10, 20, 39, 39, 2));
// // console.log(Math.max())

// console.log(Math.trunc(Math.random() * 20) + 1);

// const randomInt = (min, max) => Math.trunc(Math.random() * (max - min) + 1);
// console.log(randomInt(3, 10));

// console.log("Number");
// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// console.log(25 ** (1 / 3));
// console.log(Math.max(2, 3, 3, " 4", 2, 1));

// const random = function (min, max) {
//   console.log(Math.trunc(Math.random() * (max - min) + 1) + min);
// };
// random(2, 7);

// console.log(Math.trunc(23.5));
// console.log(Math.round(23.4));

// console.log(Math.ceil(23.3));
// console.log(Math.ceil(23.1));

// console.log(Math.floor(23.9));
// console.log(Math.trunc(23.4));

// console.log(Math.floor(-23.9));

// // decimal
// console.log((2.56666).toFixed(1));

// console.log(+(3.65656).toFixed(2));
// console.log(Math.floor("2.3"));
// console.log("abdo ouf");
// console.log(5 % 2);
// console.log(7 % 2);
// console.log(8 % 3);

// const isEvenOrNot = n => n % 2 === 0;
// console.log(isEvenOrNot(4));
// console.log(isEvenOrNot(23));

// const isEven = n => {
//   if (n % 2 === 0) {
//     console.log("this is even");
//   } else {
//     console.log("this is the odd");
//   }
// };
// isEven(22);
// isEven(57);
// labelBalance.addEventListener("click", function () {
//   [...document.querySelectorAll(".movements__row")].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       return (row.style.backgroundColor = "red");
//     } else {
//       row.style.backgroundColor = "black";
//     }
//   });
// });

// console.log(2 ** 53);
// console.log(2 ** 53 + 1);
// console.log(2 ** 53 + 2);
// console.log(2 ** 53 + 3);
// console.log(3838910848567254285702475027450205720275750n);
// console.log(BigInt(3838910848567254285702475027450205720275750));
// console.log(2200n + 33300n);
// console.log(37452344555555555555555555n + 25555555555555555555555n * 200000n);
// const max = 577548888888399485793985747547574729n;
// const int = 200;
// console.log(max * BigInt(int));

// console.log(20n > 10);
// console.log(20n < 30);

// console.log(20n === 20);
// console.log(20n == 20);
// console.log(max + " this is the big int");

// Create a date

// const now = new Date();
// console.log(now);
// console.log(new Date("Dec 06 2022 18:08:56"));

// console.log(new Date("Dec 24 2016"));
// console.log(new Date("Dec 30 2020"));

// console.log(new Date("2019-11-18T21:31:17.178Z"));
// console.log(new Date(account1.movements[0]));

// console.log(new Date(2037, 10, 33, 15, 23, 5));

// console.log(new Date(0));
// console.log(new Date(4 * 24 * 60 * 60 * 1000));
// const newDate = new Date(2033, 3, 20, 9);
// console.log(newDate);
// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate()); // day of month
// console.log(future.getDay()); // day of week
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());
// console.log(new Date(2142249780000));

// console.log(Date.now());
// console.log(new Date(1670345675824));
// console.log(new Date("2019-11-01T13:15:33.035Z"));

// const dateNow = new Date();
// console.log(dateNow);

// const dateOld = new Date(2010, 3, 4, 5);
// console.log(dateOld);

// const dateNowM = dateNow.getTime();
// const dateOldM = dateOld.getTime();
// console.log(dateNowM, dateOldM);

// const between = dateNowM - dateOldM;
// console.log(between);

// const betweenDate = new Date(between);
// console.log(betweenDate);

// const future = new Date(2037, 10, 19, 15, 23);
// console.log(future.getTime());
// console.log(+future);

// const calcdaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 24 * 60 * 60);
// const days = daysPassed(+new Date(2037, 3, 14), +new Date(2037, 3, 4));
// console.log(days);

// const daysbetween = (date1, date2) =>
//   Math.abs(date1 - date2) / (1000 * 24 * 60 * 60);
// const daysBetween = daysbetween(
//   new Date(2037, 3, 14),
//   new Date(2037, 3, 4, 10)
// );

// console.log(daysBetween);

// console.log(Math.round(daysBetween));

// console.log(new Date());

//
// const num = 335552545677.33;
// console.log(new Intl.NumberFormat("ar-eg").format(num));
// console.log(new Intl.NumberFormat("en-US").format(num));
// console.log(new Intl.NumberFormat(navigator.language).format(num));

// const option = {
//   style: "percent",
//   unit: "celsius",
// };
// console.log(new Intl.NumberFormat(navigator.language, option).format(num));

// console.log();

// const num = 335552545677.33;

// const options = {
//   style: "currency",
//   unit: "celsius",
//   currency: "EUR",
//   // useGrouping: false,
// };

// console.log("ar:", new Intl.NumberFormat("ar-eg", options).format(num));
// console.log("US:", new Intl.NumberFormat("en-US", options).format(num));
// console.log("Germany:", new Intl.NumberFormat("de-DE", options).format(num));
// console.log(
//   navigator.language,
//   new Intl.NumberFormat(navigator.language).format(num)
// );

// const timerAgain = setTimeout(
//   () => console.log("this is befor timer one"),
//   3000
// );

// const ingredients = ["olives", "spinach"];
// const timerPizza = setTimeout(
//   (ing1, ing2) => console.log(`Her is your pizza by with ${ing1} and ${ing2}`),
//   4000,
//   ...ingredients
// );

// if (ingredients.includes("spinach")) clearTimeout(timerPizza);

// const timer = setTimeout(value => console.log("this is after 5sec"), 5000);

// setTimeout(() => console.log("abdo ouf"), 1000);

// setInterval(function () {
//   const now = new Date();
//   const nowHour = now.getHours();
//   const nowMinuts = now.getMinutes();
//   const nowSecond = now.getSeconds();
//   console.log(`${nowHour}:${nowMinuts}:${nowSecond}`);
// }, 1000);

// console.log(100 % 60);
// console.log(200 % 60);
// console.log(90 % 30);
