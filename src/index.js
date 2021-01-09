(function () {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    let using = false; // 是否按下
    let type = "pen"; // 默认类型为pen
    let imageData = null; // 存储之前的图像
    let last = { x: null, y: null };
    let isTouchDevice = "ontouchstart" in document.documentElement; // 判断是否是移动端设备，也可以用正则匹配 navigator.userAgent
    resize();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "white";
    // 禁止页面滚动
    document.body.addEventListener(
        "touchmove",
        function (e) {
            e.preventDefault();
        },
        { passive: false } //防止页面卡顿
    );
    // 全屏显示
    function resize() {
        setSize();
        window.onresize = function () {
            setSize();
        };
    }
    function setSize() {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
    }
    // 画线
    function drawLine(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    // 画矩形
    function drawRect(x1, y1, x2, y2) {
        let w = canvas.offsetWidth;
        let h = canvas.offsetHeight;
        ctx.clearRect(0, 0, w, h);
        if (imageData) {
            ctx.putImageData(imageData, 0, 0, 0, 0, w, h);
        }
        ctx.beginPath();
        ctx.rect(x1, y1, x2, y2);
        ctx.stroke();
        ctx.closePath();
    }
    // 渲染颜色
    color.onclick = (e) => {
        let target = e.target;
        if (target.tagName == "LI") {
            let allActive = document.querySelectorAll("#color li.active");
            allActive.forEach((item) => {
                item.classList.remove("active");
            });
            target.classList.add("active");
            ctx.strokeStyle = target.id;
        }
    };
    // 渲染粗细
    degree.onclick = (e) => {
        let target = e.target;
        let obj = {
            thin: 2,
            middle: 4,
            thick: 6,
        };
        if (target.tagName == "LI") {
            let allActive = document.querySelectorAll("#degree li.active");
            allActive.forEach((item) => {
                item.classList.remove("active");
            });
            target.classList.add("active");
            ctx.lineWidth = obj[target.id];
        }
    };
    // 工具栏
    tool.onclick = (e) => {
        let target = e.target;
        if (target.tagName == "I") {
            let allActive = document.querySelectorAll("#tool .active");
            allActive.forEach((item) => {
                item.classList.remove("active");
            });
            target.classList.add("active");
            type = target.id;
        } else if (target.tagName == "B") {
            let allActive = document.querySelectorAll("#tool .active");
            allActive.forEach((item) => {
                item.classList.remove("active");
            });
            target.classList.add("active");
            type = target.id;
        }
    };
    // 清除画板
    clear.onclick = (e) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        imageData = null;
    };
    // 下载图片
    download.onclick = () => {
        let url = canvas.toDataURL();
        let a = document.createElement("a");
        a.download = "painting.jpg";
        a.href = url;
        a.target = "_blank";
        a.click();
        a.remove();
    };
    // 判断是移动设备还是PC
    if (isTouchDevice) {
        canvas.ontouchstart = (e) => {
            using = true;
            last.x = e.touches[0].clientX;
            last.y = e.touches[0].clientY;
        };
        canvas.ontouchmove = (e) => {
            if (using) {
                if (type == "eraser") {
                    ctx.clearRect(
                        e.touches[0].clientX - 10,
                        e.touches[0].clientY - 10,
                        20,
                        20
                    );
                } else if (type == "rectangle") {
                    drawRect(
                        last.x,
                        last.y,
                        e.touches[0].pageX - last.x,
                        e.touches[0].pageY - last.y
                    );
                } else {
                    drawLine(
                        last.x,
                        last.y,
                        e.touches[0].clientX,
                        e.touches[0].clientY
                    );
                    last.x = e.touches[0].clientX;
                    last.y = e.touches[0].clientY;
                }
            }
        };
        canvas.ontouchend = () => {
            using = false;
            imageData = ctx.getImageData(
                0,
                0,
                canvas.offsetWidth,
                canvas.offsetHeight
            );
        };
    } else {
        canvas.onmousedown = (e) => {
            using = true;
            last.x = e.clientX;
            last.y = e.clientY;
        };
        canvas.onmousemove = (e) => {
            if (using) {
                if (type == "eraser") {
                    ctx.clearRect(e.clientX - 5, e.clientY - 5, 20, 20);
                } else if (type == "rectangle") {
                    drawRect(
                        last.x,
                        last.y,
                        e.pageX - last.x,
                        e.pageY - last.y
                    );
                } else {
                    drawLine(last.x, last.y, e.clientX, e.clientY);
                    last.x = e.clientX;
                    last.y = e.clientY;
                }
            }
        };
        canvas.onmouseup = () => {
            using = false;
            imageData = ctx.getImageData(
                0,
                0,
                canvas.offsetWidth,
                canvas.offsetHeight
            );
        };
    }
})();
