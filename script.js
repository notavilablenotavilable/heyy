let highestZ = 1;
class Paper {
  holdingPaper = false;
  touchX = 0;
  touchY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  init(paper) {
    const moveHandler = (x, y) => {
      if (!this.rotating) {
        this.touchX = x;
        this.touchY = y;
        this.velX = this.touchX - this.prevTouchX;
        this.velY = this.touchY - this.prevTouchY;
      }
      const dirX = x - this.touchX;
      const dirY = y - this.touchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }
      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevTouchX = x;
        this.prevTouchY = y;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse events
    document.addEventListener('mousemove', (e) => {
      moveHandler(e.clientX, e.clientY);
    });
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ;
      highestZ += 1;
      if (e.button === 0) {
        this.touchX = e.clientX;
        this.touchY = e.clientY;
        this.prevTouchX = e.clientX;
        this.prevTouchY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch events
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      moveHandler(touch.clientX, touch.clientY);
    });
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      const touch = e.touches[0];
      this.touchX = touch.clientX;
      this.touchY = touch.clientY;
      this.prevTouchX = touch.clientX;
      this.prevTouchY = touch.clientY;
      paper.style.zIndex = highestZ;
      highestZ += 1;
    });
    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}
const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
