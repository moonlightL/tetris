// 方块由4个小方块组成
var Square = function(info) {
    this.info = info;
    // 小方块大小
    this.size = 30;
    // 当前下落方块div
    this.currentDivs = [];
    // 下一个方块div
    this.nextDivs = [];
    // 当前方块坐标对象
    this.current = null;
    // 下一个方块坐标对象
    this.next = null;
    this._init();
}

// 初始化
Square.prototype._init = function() {
    if (this.next == null) {
        this.current = this._getSquareType();
    } else {
        this.current = this.next;
    }
    this.next = this._getSquareType();
}

// 移动方块
Square.prototype._move = function(moveX, moveY, map) {
    for (var i = 0; i < this.current.length; i++) {
        var newX = this.current[i].x + moveX;
        var newY = this.current[i].y + moveY;
        if (this._isOverZone(newX, newY, map)) {
            return false;
        }
    }

    for (var j = 0; j < this.current.length; j++) {
        this.current[j].x += moveX;
        this.current[j].y += moveY;
    }
    return true;
}

// 向下移动
Square.prototype.moveDown = function(map) {
    if (this._move(0, 1, map)) {
        return false;
    }

    // 堆积
    for (var i = 0; i < this.current.length; i++) {
        map.mapDivs[this.current[i].y][this.current[i].x].className = "done";
    }

    // 消行
    for (var j = 0; j <= map.maxY; j++) {
        if (this._isCanRemoveLine(j, map)) {
            this._removeLine(j, map);
            // 加分
            this.info.plusScore(10);
        }
    }

    // 重新初始化
    this._init();
}

// 旋转
Square.prototype.round = function(map) {
    // 田字方块不用旋转
    if (this.current[0].className == "current_4") {
        return;
    }

    for (var i = 1; i < this.current.length; i++) {
        var newX = this.current[0].y + this.current[0].x - this.current[i].y;
        this._modify(newX, map);
    }

    for (var j = 1; j < this.current.length; j++) {
        var newX = this.current[0].y + this.current[0].x - this.current[j].y;
        var newY = this.current[0].y - this.current[0].x + this.current[j].x;
        this.current[j].x = newX;
        this.current[j].y = newY;
    }
}

// 向左移动
Square.prototype.moveLeft = function(map) {
    this._move(-1, 0, map);
}

// 向右移动
Square.prototype.moveRight = function(map) {
    this._move(1, 0, map);
}

// 坠落
Square.prototype.fastDown = function(map) {
    while (this._move(0, 1, map));
}

// 判断是否越界
Square.prototype._isOverZone = function(x, y, map) {
    // 判断是否超过边界
    if (x < map.minX || x > map.maxX || y < map.minY || y > map.maxY) {
        return true;
    }

    // 判断是否超过顶部
    if (y - 1 <= map.minY && map.mapDivs[y][x].className.indexOf("done") > -1) {
        map.closeFlag = true;
        return true;
    }

    // 判断是否碰到堆积地图
    return map.mapDivs[y][x].className.indexOf("done") > -1;
}

// 旋转修改方块
Square.prototype._modify = function(x, map) {
    if (x < map.minX) {
        this._modifyMoveRight(map);
    }

    if (x > map.maxX) {
        this._modifyMoveLeft(map);
    }
}

Square.prototype._modifyMoveRight = function(map) {
    for (var i = 0; i < this.current.length; i++) {
        this.current[i].x += 1;
        if (this.current[i].x < map.minX) {
             this.current[i].x += 1;
        }
    }
}

Square.prototype._modifyMoveLeft = function(map) {
    for (var j = 0; j < this.current.length; j++) {
        this.current[j].x -= 1;
        if (this.current[j].x > map.maxX) {
            this.current[j].x -= 1;
        }
    }
}

// 消行
Square.prototype._removeLine = function(row, map) {
    for (var col = 0; col <= map.maxX; col++) {
        for (var y = row; y > 0; y--) {
            // 当前行样式 = 上一行样式
            map.mapDivs[y][col].className = map.mapDivs[y - 1][col].className;
        }
        map.mapDivs[0][col].className = "none";
    }
}

// 是否可以消行
Square.prototype._isCanRemoveLine = function(row, map) {
    var flag = [];
    for (var col = 0; col <= map.maxX; col++) {
        flag.push(map.mapDivs[row][col].className);
    }
    return !(flag.join(",").indexOf("none") > -1);
}

// 随机获取方块，7种方块类型
Square.prototype._getSquareType = function() {
    // 坐标顺序决定旋转点
    var data = [
        [
            { x: 4, y: 0, className: "current_0" },
            { x: 3, y: 0, className: "current_0" },
            { x: 5, y: 0, className: "current_0" },
            { x: 6, y: 0, className: "current_0" }
        ],
        [
            { x: 4, y: 0, className: "current_1" },
            { x: 3, y: 0, className: "current_1" },
            { x: 4, y: 1, className: "current_1" },
            { x: 5, y: 0, className: "current_1" }
        ],
        [
            { x: 4, y: 0, className: "current_2" },
            { x: 3, y: 0, className: "current_2" },
            { x: 3, y: 1, className: "current_2" },
            { x: 5, y: 0, className: "current_2" }
        ],
        [
            { x: 4, y: 0, className: "current_3" },
            { x: 3, y: 1, className: "current_3" },
            { x: 4, y: 1, className: "current_3" },
            { x: 5, y: 0, className: "current_3" }
        ],
        [
            { x: 5, y: 0, className: "current_4" },
            { x: 4, y: 0, className: "current_4" },
            { x: 4, y: 1, className: "current_4" },
            { x: 5, y: 1, className: "current_4" }
        ],
        [
            { x: 4, y: 0, className: "current_5" },
            { x: 3, y: 0, className: "current_5" },
            { x: 5, y: 0, className: "current_5" },
            { x: 5, y: 1, className: "current_5" }
        ],
        [
            { x: 4, y: 0, className: "current_6" },
            { x: 3, y: 0, className: "current_6" },
            { x: 4, y: 1, className: "current_6" },
            { x: 5, y: 1, className: "current_6" }
        ]
    ];
    return data[Math.floor(Math.random() * data.length)];
}
