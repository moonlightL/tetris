var Info = function() {
    // 用时
    this.time = null;
    // 分数
    this.score = null;
    // 定时器id
    this.timeId = null;
    this.pauseFlag = false;
    this._init();
}

Info.prototype._init = function() {
    this.time =  document.getElementById("time");
    this.time.innerHTML = 0;

    this.score = document.getElementById("score");
    this.score.innerHTML = 0;

    var that = this;
    this.timeId = setInterval(function() {
        if (!that.pauseFlag) {
            that.time.innerHTML = parseInt(that.time.innerHTML) + 1;
        }
    },1000);
}

Info.prototype.plusScore = function(score) {
    var that = this;
    that.score.innerHTML = parseInt(that.score.innerHTML) + score;
}
