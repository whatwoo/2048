var board = new Array();
var score = 0;
var hasConflicted = new Array();

$(document).ready(function(){
    newgame();
});

function newgame(){
    // 初始化棋盘格
    init();
    // 随机生成两个数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell = $("#grid-cell-"+i+"-"+j);
            gridCell.css({"top":getPosTop(i,j),"left":getPosLeft(i,j)});
            // gridCell.css("top",getPosTop(i,j));
            // gridCell.css("left",getPosLeft(i,j));
        }
    }
    
    for(var i=0;i<4;i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j=0;j<4;j++){
            board[i][j] = 0;
            hasConflicted[i][j]=false;
        }
    }

    updateBoardView();
    score=0;
    updateScore(score);
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>');
            var theNumberCell = $("#number-cell-"+i+"-"+j);
            if(board[i][j]==0){
                theNumberCell.css({"width":0,"height":0,"top":getPosTop(i,j)+50,"left":getPosLeft(i,j)+50});
            }
            else{
                theNumberCell.css({"fontSize":getFontSize(board[i][j]),"width":100,"height":100,"top":getPosTop(i,j),"left":getPosLeft(i,j),"backgroundColor":getNumberBackgroundColor(board[i][j]),"color":getNumberColor(board[i][j])})
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j]=false;
        }
    }
}

function generateOneNumber(){
    // 生成一个随机位置
    if(nospace(board)){
        return false;
    }
    // 生成一个随机数
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));
    var times=0;
    while(times<50){
        if(board[randx][randy]==0)
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=0;j<4;j++){
                if(board[i][j]==0){
                    randx=i;
                    randy=j;
                }
            }
    }

    var randNumber = Math.random()<0.5 ? 2:4;
    board[randx][randy]=randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
}

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37:
            if(moveLeft()){
                setTimeout( "generateOneNumber()",250 );
                setTimeout( "isgameover()",1000 );
            }
            break;
        case 38:
            if(moveUp()){
                setTimeout( "generateOneNumber()",250 );
                setTimeout( "isgameover()",1000 );
            }
            break;
        case 39:
            if(moveRight()){
                setTimeout( "generateOneNumber()",250 );
                setTimeout( "isgameover()",1000 );
            }
            break;
        case 40:
            if(moveDown()){
                setTimeout( "generateOneNumber()",250 );
                setTimeout( "isgameover()",1000 );
            }
            break;
        default:
            break;
    }
});

function isgameover(){
    if(nospace(board) && nomove(board)){
        gameover();
    }
}
function gameover(){
    $(".over").show();
	$(document).click(function(){
		$(".over").hide()
	})
}


function moveLeft(){
    if(!canMoveLeft(board)){
        return false;
    }

    for(var i=0;i<4;i++){
        for(var j=1;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<j;k++){
                    if(board[i][k]==0 && noBlockHorizontal(i,k,j,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][k]==board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //add score
                        score += board[i][k];
                        updateScore(score);
                        
                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);

    return true;
}

function  moveRight(){
    if(!canMoveRight(board)){
        return false;
    }

    for(var i=0;i<4;i++){
        for(var j=2;j>=0;j--){
            if(board[i][j]!=0){
                for(var k=3;k>j;k--){
                    if(board[i][k]==0 && noBlockHorizontal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][j]==board[i][k] && noBlockHorizontal(i,j,k,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k]+=board[i][j];
                        board[i][j]=0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){
    if(!canMoveUp(board)){
        return false;
    }

    for(var i=1;i<4;i++){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=0;k<i;k++){
                    if(board[k][j]==0 && noBlockVertical(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][j]==board[k][j] && noBlockVertical(j,k,i,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if(!canMoveDown(board)){
        return false;
    }

    for(var i=2;i>=0;i--){
        for(var j=0;j<4;j++){
            if(board[i][j]!=0){
                for(var k=3;k>i;k--){
                    if(board[k][j]==0 && noBlockVertical(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]=board[i][j];
                        board[i][j]=0;
                        continue;
                    }
                    else if(board[i][j]==board[k][j] && noBlockVertical(j,i,k,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j]+=board[i][j];
                        board[i][j]=0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j]=true;
                        continue;
                    }
                }
            }
        }
    }
    
    setTimeout("updateBoardView()",200);
    return true;
}