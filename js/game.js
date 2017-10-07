var Game = function() {
    this.info = null;
    this.square = null;
    this.map = null;
}

// 开始游戏
Game.prototype.start = function() {
    // 初始化数据
    this.info = new Info();
    this.square = new Square(this.info);
    this.map = new Map(this.square);
    this.map.init({
        "map":document.getElementById("map"),
        "shadow":document.getElementById("shadow"),
        "next":document.getElementById("next")
    });
    // 监听游戏状态
    var that = this;
    var timeId = setInterval(function() {
        if (that.map.closeFlag) {
            that.map.close();
            clearInterval(that.map.timeId);
            clearInterval(that.info.timeId);
            var startBtn = document.getElementById("startBtn");
            startBtn.removeAttribute("disabled");
            startBtn.innerHTML = "重新开始";
            document.getElementById("pauseBtn").setAttribute("disabled",true);
            clearInterval(timeId);
        }
    },10);
}

// 重新开始游戏
Game.prototype.restart = function() {
    var mapContainer = document.getElementById("map");
    while(mapContainer.hasChildNodes()) {
        mapContainer.removeChild(mapContainer.lastChild);
    }

    var shadow = document.createElement("div");
    shadow.id = "shadow";
    shadow.className = "shadow";
    mapContainer.appendChild(shadow);

    var nextContainer = document.getElementById("next");
    while(nextContainer.hasChildNodes()) {
        nextContainer.removeChild(nextContainer.firstChild);
    }
    this.start();
}

// 游戏暂停
Game.prototype.pause = function() {
    this.map.pauseFlag = !this.map.pauseFlag;
    this.info.pauseFlag = !this.info.pauseFlag;
    this.map.removeEventListener();
}

// 恢复游戏
Game.prototype.recover = function() {
    this.map.pauseFlag = !this.map.pauseFlag;
    this.info.pauseFlag = !this.info.pauseFlag;
    this.map.addEventListener();
}

window.onload = function() {
    var game = new Game();
    var startBtn = document.getElementById("startBtn");
    var pauseBtn = document.getElementById("pauseBtn");
    startBtn.addEventListener("click", function() {
         if (this.innerHTML == "开始游戏") {
            this.setAttribute("disabled",true);
            pauseBtn.style.display = "inline-block";
            pauseBtn.removeAttribute("disabled");
            game.start();
         } else {
            this.setAttribute("disabled",true);
            pauseBtn.style.display = "inline-block";
            pauseBtn.removeAttribute("disabled");
            game.restart();
         }
    });

    pauseBtn.addEventListener("click",function() {
        if (this.innerHTML == "暂停游戏") {
            this.innerHTML = "恢复游戏";
            game.pause();
        } else {
            this.innerHTML = "暂停游戏";
            game.recover();
        }
    });

}
