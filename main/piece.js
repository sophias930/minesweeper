
class piece {

    constructor() {
        this.hasBomb = false;
        this.surroundBombs = 0;
        this.revealed = false;
        this.flagged = false;
        this.num = 0;
        this.y = 0;
        this.x = 0;
        
        this.coverImage = new Image(20, 20);
        this.coverImage.src = 'gray_square.jpg';
    
        this.underImage = new Image(20, 20);
        this.underImage.src = 'white_square.png';
    }

    setBomb() {
        this.hasBomb = true;
    }
    
    set Num(value) {
        this.num = value;
    }

    setUnderImage(pic) {
        this.underImage.src = pic;
    }

}




