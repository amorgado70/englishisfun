// Aquarium.js

var LEFT_OF_LEFT = -1;
var RIGHT_OF_RIGHT = -2;
var RND_HEIGHT = -1;

var canvas;
var canvasctx;

var buffer;
var bufferctx;

var sprites;

var imgBG;

function init()
{
   canvas = document.getElementById("aquarium");
   canvasctx = canvas.getContext("2d");

   buffer = document.createElement("canvas");
   buffer.width = WIDTH;
   buffer.height = HEIGHT;
   bufferctx = buffer.getContext("2d");

   sprites = new Array();
   sprites[0] = new Sprite(358, -14, prefix+"/Aquarium/images/bubbles/",
                           "bubbles", ".gif", 8, 0, 3);
   sprites[1] = new Sprite(700, 230, prefix+"/Aquarium/images/bubbles/",
                           "bubbles", ".gif", 8, 0, 3);
   sprites[2] = new Sprite(640, -55, prefix+"/Aquarium/images/bubbles/",
                           "bubbles", ".gif", 8, 0, 3);
   sprites[3] = new Sprite(40, 195, prefix+"/Aquarium/images/bubbles/",
                           "bubbles", ".gif", 8, 0, 3);
   sprites[4] = new Sprite(RIGHT_OF_RIGHT, RND_HEIGHT,
                           prefix+"/Aquarium/images/guppy/",
                           "lfish", ".gif", 6, rnd(7)+1, 0);
   sprites[4].move = moveLeft;
   sprites[5] = new Sprite(LEFT_OF_LEFT, RND_HEIGHT,
                           prefix+"/Aquarium/images/guppy/",
                           "rfish", ".gif", 6, rnd(7)+1, 0);
   sprites[5].move = moveRight;
   sprites[6] = new Sprite(RIGHT_OF_RIGHT, RND_HEIGHT,
                           prefix+"/Aquarium/images/tigerbarb/", "lfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[6].move = moveLeft;
   sprites[7] = new Sprite(LEFT_OF_LEFT, RND_HEIGHT,
                           prefix+"/Aquarium/images/tigerbarb/", "rfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[7].move = moveRight;
   sprites[8] = new Sprite(RIGHT_OF_RIGHT, RND_HEIGHT,
                           prefix+"/Aquarium/images/zebrafish/", "lfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[8].move = moveLeft;
   sprites[9] = new Sprite(LEFT_OF_LEFT, RND_HEIGHT,
                           prefix+"/Aquarium/images/zebrafish/", "rfish", 
                           ".gif", 8, rnd(7)+1, 0);
   sprites[9].move = moveRight;
   sprites[10] = new Sprite(RIGHT_OF_RIGHT, RND_HEIGHT,
                           prefix+"/Aquarium/images/discus/",
                           "lfish", ".gif", 8, rnd(7)+1, 0);
   sprites[10].move = moveLeft;
   sprites[11] = new Sprite(LEFT_OF_LEFT, RND_HEIGHT,
                           prefix+"/Aquarium/images/discus/",
                           "rfish", ".gif", 8, rnd(7)+1, 0);
   sprites[11].move = moveRight;
   sprites[12] = new Sprite(RIGHT_OF_RIGHT, RND_HEIGHT,
                           prefix+"/Aquarium/images/angelfish/", "lfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[12].move = moveLeft;
   sprites[13] = new Sprite(LEFT_OF_LEFT, RND_HEIGHT,
                           prefix+"/Aquarium/images/angelfish/", "rfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[13].move = moveRight;
   sprites[14] = new Sprite(RIGHT_OF_RIGHT, RND_HEIGHT,
                           prefix+"/Aquarium/images/clownfish/", "lfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[14].move = moveLeft;
   sprites[15] = new Sprite(LEFT_OF_LEFT, RND_HEIGHT,
                           prefix+"/Aquarium/images/clownfish/", "rfish",
                           ".gif", 8, rnd(7)+1, 0);
   sprites[15].move = moveRight;

   imgBG = new Image();
   imgBG.src = prefix+"/Aquarium/images/misc/bg.png";
}

function moveLeft(index)
{ 
   this.x -= this.step;
   if (this.x < -this.images[this.index].width)
   {
      this.x = this.startX;
      this.startY = rnd(HEIGHT-this.images[this.index].height);
      this.y = this.startY;
      this.step = rnd(7)+1;
   }
}

function moveRight(index)
{ 
   this.x += this.step;
   if (this.x > WIDTH)
   {
      this.x = this.startX;
      this.startY = rnd(HEIGHT-this.images[this.index].height);
      this.y = this.startY;
      this.step = rnd(7)+1;
   }
}

function renderFrame()
{
   if (!imgBG.complete)
      return;

   bufferctx.drawImage(imgBG, 0, 0);

   for (var i = 0; i < sprites.length; i++)
   {
      sprites[i].draw(bufferctx);
      sprites[i].move(i);
   }

   canvasctx.drawImage(buffer, 0, 0);
}

function rnd(limit)
{
   return Math.floor(limit*Math.random());
}

function Sprite(startX, startY, imgDir, imgName, imgSuffix, numImages, step,
                delay)
{
   this.startX = startX;
   this.startY = startY;

   this.images = new Array();
   for (var i = 0; i < numImages; i++)
   {
      var image = new Image();
      image.src = imgDir+imgName+(i+1)+imgSuffix;
      this.images.push(image);
   }

   this.step = step;
   this.delay = delay;

   this.index = 0;
   this.count = this.delay;
   this.first = true;

   Sprite.prototype.draw = function(ctx)
   {
      if (!this.images[this.index].complete)
         return;
      else
      {
         if (this.first)
         {
            if (this.startX == LEFT_OF_LEFT)
               this.startX = -this.images[0].width-rnd(this.images[0].width);
            else
            if (this.startX == RIGHT_OF_RIGHT)
               this.startX = WIDTH+rnd(this.images[0].width);
            if (this.startY == RND_HEIGHT)
               this.startY = rnd(HEIGHT-this.images[0].height);
            this.x = this.startX;
            this.y = this.startY;
            this.first = false;
         }
      }
      ctx.drawImage(this.images[this.index], this.x, this.y);
      if (this.count != 0)
      {
         this.count--;
         return;
      }
      else
         this.count = this.delay;
      this.index++;
      if (this.index == this.images.length)
         this.index = 0;
   }

   Sprite.prototype.move = function(index)
   {
   }
}

init();
setInterval("renderFrame()", 55);
