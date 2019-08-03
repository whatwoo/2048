function showNumberWithAnimation(i,j,randNumber){
    var numberCell = $("#number-cell-"+i+"-"+j);
    numberCell.css({"background":getNumberBackgroundColor(randNumber),"color":getNumberColor(randNumber)});
    numberCell.text(randNumber);

    numberCell.animate({"width":100,"height":100,"top":getPosTop(i,j),"left":getPosLeft(i,j)},100);
}

function showMoveAnimation(fromx,fromy,tox,toy){
    var numberCell=$("#number-cell-"+fromx+"-"+fromy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updateScore(score){
    $("#score").text(score);
}

