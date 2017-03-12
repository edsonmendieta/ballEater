// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// counter

var counter = document.querySelector('p');
var counterTotal = 0;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

function Shape() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.velX = random(-7, 7);
    this.velY = random(-7, 7);
    this.exists = true;
 }

 function Ball(x, y, velX, velY, exists) {
     Shape.call(this, x, y, velX, velY, exists);
     this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
     this.size = random(10, 20);
  }

  Ball.prototype = Object.create(Shape.prototype);

  Ball.prototype.constructor = Ball;


 Ball.prototype.draw = function() {
     ctx.beginPath();
     ctx.fillStyle = this.color;
     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
     ctx.fill();
 }

 Ball.prototype.update = function() {
     if ((this.x + this.size) >= width) {
         this.velX = -(this.velX);
     }

     if ((this.x - this.size) <= 0) {
         this.velX = -(this.velX);
     }

     if ((this.y + this.size) >= height) {
         this.velY = -(this.velY);
     }

     if ((this.y - this.size) <= 0) {
         this.velY = -(this.velY);
     }

     this.x += this.velX;
     this.y += this.velY;
 }

 Ball.prototype.collisionDetect = function() {
     for (var j = 0; j < balls.length; j++) {
         if (!(this === balls[j])) {
             var dx = this.x - balls[j].x;
             var dy = this.y - balls[j].y;
             var distance = Math.sqrt(dx * dx + dy * dy);

             if (distance < this.size + balls[j].size) {
                 balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
             }
         }
     }
 }

 function EvilCircle(x, y, exists) {
     Shape.call(this, x, y, exists);
     this.color = 'white';
     this.size = 10;
     this.velX = 20;
     this.velY = 20;
 }

 EvilCircle.prototype = Object.create(Shape.prototype);

 EvilCircle.prototype.constructor = EvilCircle;

 EvilCircle.prototype.draw = function() {
     ctx.beginPath();
     ctx.lineWidth = 3;
     ctx.strokeStyle = this.color;
     ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
     ctx.stroke();
 }

 EvilCircle.prototype.checkBounds = function() {
     if ((this.x + this.size) >= width) {
         this.x = (width - 10);
     }

     if ((this.x - this.size) <= 0) {
         this.x = 10;
     }

     if ((this.y + this.size) >= height) {
         this.y = (height - 10);
     }

     if ((this.y - this.size) <= 0) {
         this.y = 10;
     }
 }

 EvilCircle.prototype.setControls = function() {
     var _this = this;
     window.onkeydown = function(e) {
         if(e.keyCode === 65) {
             _this.x -= _this.velX;
         }
         else if (e.keyCode === 68) {
             _this.x += _this.velX;
         }
         else if (e.keyCode === 87) {
             _this.y -= _this.velY;
         }
         else if (e.keyCode === 83) {
             _this.y += _this.velY;
         }
     }
 }

 EvilCircle.prototype.collisionDetect = function() {
     for (var j = 0; j < balls.length; j++) {
         if (balls[j].exists === true) {
             var dx = this.x - balls[j].x;
             var dy = this.y - balls[j].y;
             var distance = Math.sqrt(dx * dx + dy * dy);

             if (distance < this.size + balls[j].size) {
                 balls[j].exists = false;
                 balls[j].size = 0;
                 counterTotal -= 1;
                 counter.textContent = 'Ball count: ' + counterTotal;
                //  balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
             }
         }
     }
 }

 theEvilOne = new EvilCircle();
 theEvilOne.setControls();


 var balls = [];

 function loop() {
     ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
     ctx.fillRect(0, 0, width, height);

     while (balls.length < 25) {
         var ball = new Ball();
         balls.push(ball);
         counterTotal += 1;
         counter.textContent = 'Ball count: ' + counterTotal;
     }

     theEvilOne.draw();
     theEvilOne.checkBounds();
     theEvilOne.collisionDetect();

     for (var i = 0; i < balls.length; i++) {
         if (balls[i].exists === true) {
             balls[i].draw();
             balls[i].update();
             balls[i].collisionDetect();
         }
     }

     requestAnimationFrame(loop);
 }

 loop();
