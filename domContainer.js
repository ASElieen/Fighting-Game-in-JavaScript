const $ = (ele) => {
    return document.querySelector(ele);
}

const leftHp = $('.leftHp');
const rightHp = $('.rightHp');
const timer = $('.timer');
const canvas = $('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;
const time = 100;