/*
- Make array full of piece objects 
- connect to canvas on html 
*/

var placesLeft;
var clicked;

function minesweeper(width, height, mines) {
    $('.game').empty();
    $(document).ready(function () {
        var w = width;
        var h = height;
        var m = mines;
        placesLeft = w * h;
        clicked = false;
        // mines: 1 to size-1
        if (m < 1) {
            m = 1;
            $('.mines').val(m);
        } else if (m > placesLeft-1) {
            m = placesLeft-1;
            console.log(m);
            $('.mines').val(m);
        }
        $('.bombs').html(m);

        // width: 8 to 40
        if (w < 8) {
            w = 8;
            $('.width').val(w);
        } else if (w > 40) {
            w = 40;
            $('.width').val(w);
        }

        // height: 8 to 30
        if (h < 8) {
            h = 8;
            $('.height').val(h);
        } else if (h > 30) {
            h = 30;
            $('.height').val(h);
        }

        setUp(w, h, m);
    })
}

function setUp(w, h, m) {
    // draw board w divs and appends
    var width = w;
    var height = h;
    var mines = m;
    var everything = [];
    for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
            let temp = new piece();
            temp.y = j;
            temp.x = i;
            everything.push(temp);

            $('.game').append('<div class="tile" id="' + j + '-' + i + '">');
            $('#'+ j + '-' + i).append(temp.coverImage);

            var defaultImage = new Image(20, 20);
            defaultImage.src = 'gray_square.jpg';
            


            /// tie click event to each 'temp' 
            $('#'+ j + '-' + i).click(function (event) {
                //if first click, start timer
                if (!clicked) {
                    begin();
                }

                clicked = true;
                var imagePortions = temp.underImage.src.split("/");
                let lastPiece = imagePortions[imagePortions.length-1];
                // shiftkey and still gray and not flagged, then flag 
                if (event.shiftKey && !temp.revealed && !temp.flagged) {
                    setFlag(i, j);
                    temp.flagged = true;

                    var currentBombs = parseInt($('.bombs').html());
                    var now = currentBombs -1;
                    $('.bombs').html(now);

                    placesLeft--;
                    if (placesLeft == 0) {
                        determineWin(everything);
                    }

                // shiftkey and still gray and flagged, then unflag 
                // TODO----- UNFLAGGING IS MAKING STUFF VANISH WTf
                } else if (event.shiftKey && !temp.revealed && temp.flagged) {
                    var id = j+'-'+i;
                    $('#'+id).empty();
    
                    // unflag
                    $('#'+id).append(defaultImage);
                    temp.flagged = false;

                    var currentBombs = parseInt($('.bombs').html());
                    var now = currentBombs+1;
                    $('.bombs').html(now);

                    placesLeft++;

                /// if underneath is white 
                } else if (!temp.revealed && !temp.flagged && 
                    lastPiece=='white_square.png') {
                    setWhites(i, j, everything, width, height);

                // if underneath is HEART 
                } else if (!temp.revealed && !temp.flagged && lastPiece=='bomb.jpg') {
                    alert("You lose! :(");
                    revealAll(everything);

                /// normal; not revealed and not flagged and not white or bomb; NUMBER
                } else if (!temp.revealed && !temp.flagged){
                    var id = j+'-'+i;
                    setImage(id, everything, width, height);
                
                } else if (temp.revealed) {
                    // if revealed, 
                        // and if surroundFlags == surroundBombs
                        // uncover unflagged surroundings
                    
                    //calculate number of flags surrounding
                    var surroundFlags = 0;
                    let x = i;
                    let y = j;
                    var left = everything.find(function (element) {
                        if (x != 0) {
                            return (element.x == x-1 && element.y == y);
                        } else {
                            return null;
                        }
                    });
                    if (left != null) {
                        if (left.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var right = everything.find(function (element) {
                        if (x != width-1) {
                            return (element.x == x+1 && element.y == y);
                        } else {
                            return null;
                        }
                    });
                    if (right != null) {
                        if (right.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var up = everything.find(function (element) {
                        if (y != 0) {
                            return (element.x == x && element.y == y-1);
                        } else {
                            return null;
                        }
                    });
                    if (up != null) {
                        if (up.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var down = everything.find(function (element) {
                        if (y != height-1) {
                            return (element.x == x && element.y == y+1);
                        } else {
                            return null;
                        }
                    });
                    if (down != null) {
                        if (down.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var upLeft = everything.find(function (element) {
                        if (y != 0 && x!=9) {
                            return (element.x == x-1 && element.y == y-1);
                        } else {
                            return null;
                        }
                    });
                    if (upLeft != null) {
                        if (upLeft.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var upRight = everything.find(function (element) {
                        if (y != 0 && x!= width-1) {
                            return (element.x == x+1 && element.y == y-1);
                        } else {
                            return null;
                        }
                    });
                    if (upRight != null) {
                        if (upRight.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var downLeft = everything.find(function (element) {
                        if (y != height-1 && x!=0) {
                            return (element.x == x-1 && element.y == y+1);
                        } else {
                            return null;
                        }
                    });
                    if (downLeft != null) {
                        if (downLeft.flagged) {
                            surroundFlags++;
                        }
                    }
            
                    var downRight = everything.find(function (element) {
                        if (y != height-1 && x!= width-1) {
                            return (element.x == x+1 && element.y == y+1);
                        } else {
                            return null;
                        }
                    });
                    if (downRight != null) {
                        if (downRight.flagged) {
                            surroundFlags++;
                        }
                    }

                    if (surroundFlags == temp.surroundBombs) {
                        // uncover other spaces
                        if (up!=null && !up.flagged) {
                            var id = up.y+'-'+up.x;
                            setImage(id, everything, width, height);
                            if (up.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (down!=null && !down.flagged) {
                            var id = down.y+'-'+down.x;
                            setImage(id, everything, width, height);
                            if (down.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (left!=null && !left.flagged) {
                            var id = left.y+'-'+left.x;
                            setImage(id, everything, width, height);
                            if (left.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (right!=null && !right.flagged) {
                            var id = right.y+'-'+right.x;
                            setImage(id, everything, width, height);
                            if (right.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (upLeft!=null && !upLeft.flagged) {
                            var id = upLeft.y+'-'+upLeft.x;
                            setImage(id, everything, width, height);
                            if (upLeft.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (upRight!=null && !upRight.flagged) {
                            var id = upRight.y+'-'+upRight.x;
                            setImage(id, everything, width, height);
                            if (upRight.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (downLeft!=null && !downLeft.flagged) {
                            var id = downLeft.y+'-'+downLeft.x;
                            setImage(id, everything, width, height);
                            if (downLeft.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                        if (downRight!=null && !downRight.flagged) {
                            var id = downRight.y+'-'+downRight.x;
                            setImage(id, everything, width, height);
                            if (downRight.hasBomb) {
                                alert("You lost! :(");
                                revealAll(everything);
                            }
                        }
                    }
                }
            });
        }
        $('.game').append("<br>");
    }

    // set mines randomly in array

    while (mines > 0) {
        // TODO maybe its going random forever if it doesn't hit an empty spot... 
        min = 0;
        max = height - 1;
        yMine = Math.floor(Math.random() * (+max - +min)) + +min;
        min = 0;
        max = width - 1;
        xMine = Math.floor(Math.random() * (+max - +min)) + +min;
        var found = everything.find(function (element) {
            return (element.x == xMine && element.y == yMine);
        });
        if (found.hasBomb == false) {
            found.setBomb();
            mines--;
        }
    }

    for (let k = 0; k < everything.length; k++) {
        var tile = everything[k];
        let x = tile.x;
        let y = tile.y;
        var current = everything.find(function (element) {
            return (element.x == x && element.y == y);
        });

        // count bombs on the eight surrounding spaces
        var bombCounter = 0;

        var left = everything.find(function (element) {
            if (x != 0) {
                return (element.x == x-1 && element.y == y);
            } else {
                return null;
            }
        });
        if (left != null) {
            if (left.hasBomb) {
                bombCounter++;
            }
        }

        var right = everything.find(function (element) {
            if (x != width-1) {
                return (element.x == x+1 && element.y == y);
            } else {
                return null;
            }
        });
        if (right != null) {
            if (right.hasBomb) {
                bombCounter++;
            }
        }

        var up = everything.find(function (element) {
            if (y != 0) {
                return (element.x == x && element.y == y-1);
            } else {
                return null;
            }
        });
        if (up != null) {
            if (up.hasBomb) {
                bombCounter++;
            }
        }

        var down = everything.find(function (element) {
            if (y != height-1) {
                return (element.x == x && element.y == y+1);
            } else {
                return null;
            }
        });
        if (down != null) {
            if (down.hasBomb) {
                bombCounter++;
            }
        }

        var upLeft = everything.find(function (element) {
            if (y != 0 && x!=9) {
                return (element.x == x-1 && element.y == y-1);
            } else {
                return null;
            }
        });
        if (upLeft != null) {
            if (upLeft.hasBomb) {
                bombCounter++;
            }
        }

        var upRight = everything.find(function (element) {
            if (y != 0 && x!= width-1) {
                return (element.x == x+1 && element.y == y-1);
            } else {
                return null;
            }
        });
        if (upRight != null) {
            if (upRight.hasBomb) {
                bombCounter++;
            }
        }

        var downLeft = everything.find(function (element) {
            if (y != height-1 && x!=0) {
                return (element.x == x-1 && element.y == y+1);
            } else {
                return null;
            }
        });
        if (downLeft != null) {
            if (downLeft.hasBomb) {
                bombCounter++;
            }
        }

        var downRight = everything.find(function (element) {
            if (y != height-1 && x!= width-1) {
                return (element.x == x+1 && element.y == y+1);
            } else {
                return null;
            }
        });
        if (downRight != null) {
            if (downRight.hasBomb) {
                bombCounter++;
            }
        }

        /// if bomb, set image to bomb 
        if (current.hasBomb) {
            current.setUnderImage('bomb.jpg');
        }

        /// based on bombCounter, setUnderImage
            // to correct number
        if (!current.hasBomb) {
            current.surroundBombs = bombCounter;

            if (bombCounter == 1) {
                current.setUnderImage('one.png');
            } else if (bombCounter == 2) {
                current.setUnderImage('two.png');
            } else if (bombCounter == 3) {
                current.setUnderImage('three.png');
            } else if (bombCounter == 4) {
                current.setUnderImage('four.png');
            } else if (bombCounter == 5) {
                current.setUnderImage('five.png');
            } else if (bombCounter == 6) {
                current.setUnderImage('six.png');
            } else if (bombCounter == 7) {
                current.setUnderImage('seven.png');
            } else if (bombCounter == 8) {
                current.setUnderImage('eight.png');
            }
        }


    }


}

function setUnder(xCoord, yCoord, image, allArray) {
    // helper method for setting the under image
    //using specific coordinates from id to get "span"

    // find correct thing in array 
    var found = allArray.find(function (element) {
        return (element.x == xCoord && element.y == yCoord);
    });

    found.setUnderImage(image);
}

function setImage(id, allArray, width, height) {
    // using underimage

    // empty anything under span 
    var coordinates = id.split("-");
    var yCoord = coordinates[0];
    var xCoord = coordinates[1];

    var found = allArray.find(function (element) {
        return (element.x == xCoord && element.y == yCoord);
    });

    $('#'+id).empty();

    // set to underImage
    $('#'+id).append(found.underImage);
    found.revealed = true;

    var imagePortions = found.underImage.src.split("/");
    let lastPiece = imagePortions[imagePortions.length-1];

    placesLeft--;
    if (placesLeft == 0) {
        determineWin(allArray);
    }
    

}

function setFlag(xCoord, yCoord) {
    var flagImage = new Image(20, 20);
    flagImage.src = 'flag.png';
    var id = yCoord+'-'+xCoord;

    $('#'+id).empty();

    // set to flag
    $('#'+id).append(flagImage);
}

function setWhites(xCoord, yCoord, everything, width, height) {
    let x = xCoord;
    let y = yCoord;
    var id = y+'-'+x;
    setImage(id, everything, width, height);

    var left = everything.find(function (element) {
        if (x != 0) {
            return (element.x == x-1 && element.y == y);
        } else {
            return null;
        }
    });

    var right = everything.find(function (element) {
        if (x != width-1) {
            return (element.x == x+1 && element.y == y);
        } else {
            return null;
        }
    });

    var up = everything.find(function (element) {
        if (y != 0) {
            return (element.x == x && element.y == y-1);
        } else {
            return null;
        }
    });

    var down = everything.find(function (element) {
        if (y != height-1) {
            return (element.x == x && element.y == y+1);
        } else {
            return null;
        }
    });

    var upLeft = everything.find(function (element) {
        if (y != 0 && x!=9) {
            return (element.x == x-1 && element.y == y-1);
        } else {
            return null;
        }
    });

    var upRight = everything.find(function (element) {
        if (y != 0 && x!= width-1) {
            return (element.x == x+1 && element.y == y-1);
        } else {
            return null;
        }
    });

    var downLeft = everything.find(function (element) {
        if (y != height-1 && x!=0) {
            return (element.x == x-1 && element.y == y+1);
        } else {
            return null;
        }
    });

    var downRight = everything.find(function (element) {
        if (y != height-1 && x!= width-1) {
            return (element.x == x+1 && element.y == y+1);
        } else {
            return null;
        }
    });
    
        // uncover other spaces
        if (up!=null && !up.revealed && !up.flagged) {
            var id = up.y+'-'+up.x;
            var imagePortions = up.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(up.x, up.y, everything, width, height, up);
            } else {
                setImage(id, everything, width, height);
            }
        }
        if (down!=null && !down.revealed && !down.flagged) {
            var id = down.y+'-'+down.x;
            var imagePortions = down.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(down.x, down.y, everything, width, height, down);
            } else {
                setImage(id, everything, width, height);
            }
        }
        if (left!=null && !left.revealed && !left.flagged) {
            var id = left.y+'-'+left.x;
            var imagePortions = left.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(left.x, left.y, everything, width, height);
            } else {
                setImage(id, everything, width, height);
            }
        }
        if (right!=null && !right.revealed && !right.flagged) {
            var id = right.y+'-'+right.x;
            var imagePortions = right.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(right.x, right.y, everything, width, height);
            } else {
                setImage(id, everything, width, height);
            }        }
        if (upLeft!=null && !upLeft.revealed && !upLeft.flagged) {
            var id = upLeft.y+'-'+upLeft.x;
            var imagePortions = upLeft.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(upLeft.x, upLeft.y, everything, width, height);
            } else {
                setImage(id, everything, width, height);
            }        }
        if (upRight!=null && !upRight.revealed && !upRight.flagged) {
            var id = upRight.y+'-'+upRight.x;
            var imagePortions = upRight.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(upRight.x, upRight.y, everything, width, height);
            } else {
                setImage(id, everything, width, height);
            }        }
        if (downLeft!=null && !downLeft.revealed && !downLeft.flagged) {
            var id = downLeft.y+'-'+downLeft.x;
            var imagePortions = downLeft.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(downLeft.x, downLeft.y, everything, width, height);
            } else {
                setImage(id, everything, width, height);
            }        }
        if (downRight!=null && !downRight.revealed && !downRight.flagged) {
            var id = downRight.y+'-'+downRight.x;
            var imagePortions = downRight.underImage.src.split("/");
            let lastPiece = imagePortions[imagePortions.length-1];
            if (lastPiece=='white_square.png') {
                setWhites(downRight.x, downRight.y, everything, width, height);
            } else {
                setImage(id, everything, width, height);
            }       
         }

    }

    function revealAll(allArray) {
        for (let i = 0; i < allArray.length; i++) {
            let id = allArray[i].y + '-' + allArray[i].x;

            // set to underImage
            $('#'+id).empty();
            $('#'+id).append(allArray[i].underImage);
        }
    }

    function determineWin(allArray) {
        var lost = false;
        for (let i = 0; i < allArray.length; i++) {

            let current = allArray[i];

            // check if all flags are bombs
            if (current.flagged && !current.hasBomb) {
                alert("You lose! :(");
                revealAll(allArray);
                lost = true;
            } else if (!current.flagged && current.hasBomb) {
                alert("You lose! :(");
                revealAll(allArray);
                lost = true;
            }

        }
        if (!lost) {
            alert("You win! :D");
            revealAll(allArray);

            // STOP TIMER AND RECORD
            var minutes = parseInt($('#minutes').html());
            var seconds = parseInt($('#seconds').html());

            var currentHigh = $('.score').html();
            console.log("currentHigh: " + currentHigh);
            var minSecs = currentHigh.split(":");
            var highTotal = (minSecs[0] * 60) + minSecs[1];
            
            var currentTotal = (minutes * 60) + seconds;
            console.log("currentTotal: " + currentTotal);

            if (currentTotal < highTotal || highTotal == null) {
                $('.score').html(minutes+":"+seconds);
            }

        }


    }


