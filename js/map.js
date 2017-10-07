var Map = function(square) {
    // 边界
    this.minX = this.minY = 0;
    this.maxX = 9;
    this.maxY = 19;
    // 当前移动的方块
    this.square = square;
    // 用于记录完成下落动作的方块
    this.mapDivs = [];
    // 定时器id
    this.timeId = null;
    // 暂停标记
    this.pauseFlag = false;
    // 关闭标记
    this.closeFlag = false;
    // 阴影
    this.shadow = null;
    this.shadowFlag = false;
}

// 初始化
Map.prototype.init = function(domObjs) {
    this.shadow = domObjs.shadow;

    // 绘制地图
    for (var i = 0; i <= this.maxY; i++) {
        var arr = [];
        for (var s = 0; s <= this.maxX; s++) {
            var mapDiv = document.createElement("div");
            mapDiv.className = "none";
            mapDiv.style.top = (i * this.square.size) + "px";
            mapDiv.style.left = (s * this.square.size) + "px";
            domObjs.map.appendChild(mapDiv);
            arr.push(mapDiv);
        }
        this.mapDivs.push(arr);
    }

    // 当前下落方块
    for (var j = 0; j < this.square.current.length; j++) {
        var cdiv = document.createElement("div");
        cdiv.className = this.square.current[j].className;
        cdiv.style.left = this.square.current[j].x * this.square.size + "px";
        cdiv.style.top = this.square.current[j].y * this.square.size + "px";
        domObjs.map.appendChild(cdiv);
        this.square.currentDivs.push(cdiv);
    }

    if (this.shadowFlag) {
        this._showShadow();
    }

    // 下一个方块
    for (var k = 0; k < this.square.next.length; k++) {
        var ndiv = document.createElement("div");
        ndiv.className = this.square.next[k].className;
        ndiv.style.left = (this.square.next[k].x - 2) * this.square.size + "px";
        ndiv.style.top = this.square.next[k].y * this.square.size + "px";
        domObjs.next.appendChild(ndiv);
        this.square.nextDivs.push(ndiv);
    }

    var that = this;

    // 启动定时器
    this.timeId = setInterval(function() {
        if (!that.pauseFlag) {
            that.square.moveDown(that);
            that._refreshMap();
        }
    }, 300);

    // 添加键盘监听器
    this.addEventListener();

}

 // 添加键盘监听
Map.prototype.addEventListener = function() {
    var that = this;
    // 键盘监听 上下左右键和空格键
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 32:
                that.square.fastDown(that);
                break;
            case 37:
                that.square.moveLeft(that);
                break;
            case 38:
                that.square.round(that);
                break;
            case 39:
                that.square.moveRight(that);
                break;
            case 40:
                that.square.moveDown(that);
                break;
            case 76:
                that.shadowFlag = !that.shadowFlag;
                break;
        }
        that._refreshMap();
    }


}

 // 移除键盘监听
Map.prototype.removeEventListener = function() {
    document.onkeydown = null;
}

// 显示阴影
Map.prototype._showShadow = function() {
    if (!this.shadowFlag) {
        this._closeShadow();
        return;
    }

    var max = Math.max(this.square.current[0].x,this.square.current[1].x,this.square.current[2].x,this.square.current[3].x);
    var min = Math.min(this.square.current[0].x,this.square.current[1].x,this.square.current[2].x,this.square.current[3].x);

    this.shadow.style.width = (max - min + 1) * this.square.size + "px";
    this.shadow.style.left = min * this.square.size + "px";
}

// 关闭阴影提示
Map.prototype._closeShadow = function() {
    this.shadow.style.width = 0;
}

// 刷新地图
Map.prototype._refreshMap = function() {
    var squareDivs = this.square.currentDivs;
    for (var j = 0; j < squareDivs.length; j++) {
        squareDivs[j].className = this.square.current[j].className;
        squareDivs[j].style.top = this.square.current[j].y * this.square.size + "px";
        squareDivs[j].style.left = this.square.current[j].x * this.square.size + "px";
    }

    // 阴影
    this._showShadow();

    var nextDivs = this.square.nextDivs;
    for (var k = 0; k < nextDivs.length; k++) {
        nextDivs[k].className = this.square.next[k].className;
        nextDivs[k].style.left = (this.square.next[k].x - 2) * this.square.size + "px";
        nextDivs[k].style.top = this.square.next[k].y * this.square.size + "px";
    }
}

// 关闭地图
Map.prototype.close = function() {

    this._closeShadow();

    this.removeEventListener();

    for (var i = 0; i <= this.maxY; i++) {
        for (var j = 0; j <= this.maxX; j++) {
            var className = this.mapDivs[i][j].className;
            if (className.indexOf("done") > -1) {
                this.mapDivs[i][j].className = "over";
            }
        }
    }

    for (var k = 0; k < this.square.currentDivs.length; k++) {
        this.square.currentDivs[k].className = "over";
    }

}
