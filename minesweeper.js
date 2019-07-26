$(document).ready(function () {
    var bombsLeft = 0;
    var time = 0;
    var highScore = Number.MAX_SAFE_INTEGER;
    var timing;

    $("#start").click(function() {
        time = 0;
        var width = $("#width");
        var length = $("#length");
        var mineField = $("#mines");
        $("#field").empty()
        bombsLeft = mineField.val();
        updateBombs();
        timing = setInterval(function(){ 
            time++;
            $("#timer").text(time);
        }, 1000);
        createField(width.val(), length.val(), mineField.val());
    });

    var createField = (w, l, m) => {
        m = Math.max(1, m);
        m = Math.min((l*w)-1, m);

        let cells = [];
        for (let i = 0; i < w*l; i++) {
            cells[i] = i;
        }
        let mines = [];
        for (let i = 0; i < m; i++) {
            let r = Math.floor(Math.random()*(cells.length));
            mines[i] = cells[r];
            cells.splice(r, 1);
        }

        for (let i = 0; i < l; i++) {
            var row = $("<div></div>").appendTo("#field");
            row.addClass("row");
            for (let j = 0; j < w; j++) {
                let cell = $("<button flag=false></button>");
                if (mines.includes((w*i)+j)) {
                    cell.attr("mine", "-1");
                } else {
                	cell.attr("mine", "0");
                }
                cell.attr("row", i);
                cell.attr("col", j);
                cell.attr("id", i+"-"+j);
                cell.on("click", clicked);
                cell.appendTo(row);
            }
        }

        for (let i = 0; i < mines.length; i++) {
            let row = Math.floor(mines[i] / $("#width").val());
            let col = mines[i] % $("#width").val();
            for (let j = row-1; j < row+2; j++) {
                for (let k = col-1; k < col+2; k++) {
                    let cell = $("#field").find("#"+j+"-"+k);
                    let m = parseInt(cell.attr("mine"));
                    if (m > -1) {
                    		m++;
                    		cell.attr("mine", m);
                    }
                    
                }
            }
        }
        
        $("button").each(function() {
        		$(this).text($(this).attr("mine"));
        });
        
    };
    
    function clicked(e) {
        if (e.shiftKey) {
            if ($(this).attr("c") !== "true") {
                if ($(this).attr("flag") === "true") {
                    $(this).attr("flag", "false");
                   bombsLeft++;
                } else {
                    $(this).attr("flag", "true");
                    bombsLeft--;
                }
                updateBombs();
            }
        } else if ($(this).attr("c") === "true") {
            let m = parseInt($(this).attr("mine"));
            let row = parseInt($(this).attr("row"));
            let col = parseInt($(this).attr("col"));
            for (let i = row-1; i < row+2; i++) {
                for (let j = col-1; j < col+2; j++) {
                    let cell = $("#field").find("#"+i+"-"+j);
                    if (cell.attr("c") !== "true" && cell.attr("flag") === "true") {
                        m--;
                    }
                }
            }
            if (m === 0) {
                clear($(this));
            }
        } else {
            if ($(this).attr("flag") === "false") {
                $(this).attr("c", "true");
                if($(this).attr("mine") === "-1") {
                    $(this).addClass("kill");
                    lose();
                } else if($(this).attr("mine") === "0") {
                    clear($(this));
                }
            } 
        }
    	
      	if (checkWin()) {
            youWin();
        }
    }

    // function revealAdj(button) {
    //     let row = parseInt(button.attr("row"));
    //     let col = parseInt(button.attr("col"));
    //     for (let i = row-1; i < row+2; i++) {
    //         for (let j = col-1; j < col+2; j++) {
    //             if (i !== row || j !== col) {
    //                 let cell = $("#field").find("#"+i+"-"+j);
    //                 if (cell.attr("flag") === "false" && cell.attr("c") !== "true") {
    //                     cell.click();
    //                 }
    //             }
    //         }
    //     }
    // }
    
    function clear(button) {
        button.addClass("zero");
        let row = parseInt(button.attr("row"));
        let col = parseInt(button.attr("col"));
        for (let i = row-1; i < row+2; i++) {
            for (let j = col-1; j < col+2; j++) {
                if (i !== row || j !== col) {
                    let cell = $("#field").find("#"+i+"-"+j);
                    if (cell.attr("flag") === "false" && cell.attr("c") !== "true") {
                        cell.click();
                    }
                }
            }
        }
    }

    function updateBombs() {
        $("#bomb").text(bombsLeft);
    }

		var winner = false;

    function checkWin() {
        if (bombsLeft === 0) {
        		winner = true;
            
            $("#field button").each(function() {
                if ($(this).attr("mine") > -1) {
                    if ($(this).attr("c") !== "true") {
                        winner = false;
                    }
                } else if ($(this).hasClass("kill")) {
                    winner = false;
                }
            });
            
            return winner;
        } else {
            return false;
        }
    }

    function youWin() {
        clearInterval(timing);
        if (time < highScore) {
            highScore = time;
            $("#high").text(highScore);
        }
        alert("Congratulations!!");
        $("#field button").off();
    }

    function lose() {
        clearInterval(timing);
        alert("GAME OVER");
        $("#field button").attr("c", "true");
        $("#field button").off();
    }
    
    

});