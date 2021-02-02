const bg = document.querySelector(".random_BG");

const bgList = [
    "/assets/0e36c67cf28a.jpg",
    "/assets/dd7ce797074b.jpg",
    "/assets/58bb99cb2db0.jpg",
    "/assets/05e4f75b1106.jpg",
    "/assets/3b3eb9904c22.jpg",
    "/assets/ff84698e3c7f.jpg",
    "/assets/c262caf64f00.jpg",
    "/assets/300be0889f76.jpg",
    "/assets/a98f9ee273fd.jpg",
    "/assets/3bb960158672.jpg",
    "/assets/23c3fc70e1cb.jpg",
    "/assets/f7ea24961462.jpg"

];

const randNum = Math.floor(Math.random() * bgList.length);

bg.style.backgroundImage = `url(${bgList[randNum]})`;