function GetPos(obj) {
    return {Top: obj.offsetTop, Left: obj.offsetLeft, Width: obj.offsetWidth, Height: obj.offsetHeight}
}
function Screen(obj){
    var that=this;
    this.sendPic=obj.sendPic;
    this.video=obj.video;
    this.baseURL=null;
    this.cutBox=this.createEle(document.body,'div','cutBox');
    this.sizeBox=this.createEle(this.cutBox,'div','sizeBox');
    this.canvas=this.createEle(this.sizeBox,'canvas','screenCanvas');
    this.dRightDown=this.createEle(this.sizeBox,'div','dRightDown');
    this.dLeftDown=this.createEle(this.sizeBox,'div','dLeftDown');
    this.dRightUp=this.createEle(this.sizeBox,'div','dRightUp');
    this.dLeftUp=this.createEle(this.sizeBox,'div','dLeftUp');
    this.dLeft=this.createEle(this.sizeBox,'div','dLeft');
    this.dRight=this.createEle(this.sizeBox,'div','dRight');
    this.dDown=this.createEle(this.sizeBox,'div','dDown');
    this.dUp=this.createEle(this.sizeBox,'div','dUp');
    this.context=this.canvas.getContext('2d');
    this.btnList=this.createEle(this.sizeBox,'div','btnList');
    this.sure=this.createEle(this.btnList,'button','screenSure');
    this.sure.innerHTML='确定';
    this.cancel=this.createEle(this.btnList,'button','screenCancel');
    this.cancel.innerHTML='取消';
    this.rect=this.createEle(this.btnList,'button','screenRect');
    this.rect.innerHTML='标记';
    this.save=this.createEle(this.btnList,'button','screenSave');
    this.save.innerHTML='保存';
    that.scaleY=obj.scaley||1;
    that.scaleX=obj.scalex||1;
    that.cutBox.style.width=that.video.offsetWidth+'px';
    that.cutBox.style.height=that.video.offsetHeight+'px';
    this.setSize();
}
Screen.prototype.setSize=function(){
    var that=this;
    var _resize = new Resize(that.sizeBox, {Max: true, mxContainer:"cutBox",onResize:function(){
        var p=GetPos(that.sizeBox);
        that.canvas.width= p.Width-2;
        that.canvas.height= p.Height-2;
        that.context.drawImage(that.video, p.Left* that.scaleX, p.Top* that.scaleY, p.Width* that.scaleX, p.Height* that.scaleY,0,0,p.Width, p.Height);
        that.baseURL=that.canvas.toDataURL('jpg');
        if(p.Width>that.cutBox.offsetHeight-50){
            that.btnList.style.bottom=0;
        }
    }});
    _resize.Set(that.dRightDown,"right-down");
    _resize.Set(that.dLeftDown, "left-down");
    _resize.Set(that.dRightUp, "right-up");
    _resize.Set(that.dLeftUp, "left-up");
    _resize.Set(that.dRight, "right");
    _resize.Set(that.dLeft, "left");
    _resize.Set(that.dDown, "down");
    _resize.Set(that.dUp, "up");
    that.savePic();
    that.cancelCut();
    that.sign();
    that.sendBack();
    // var _drag = new Drag(that.sizeBox, { Limit: true,onResize: Bind(this, this.SetPos) , Transparent: true });
    /*        var sx,sy,mx,my;
     var sizeBox=$(that.sizeBox);
     var off=false;
     that.cutBox.onmousedown=function (event) {
     off=true;
     /!*           if(sx<0){sx=0;}
     else if(sx>=pic.offsetWidth)
     {sx=pic.offsetWidth;}
     else{sx=event.clientX;}
     if(sy<0){sy=0;}
     else if(sy>=pic.offsetHeight)
     {sy=pic.offsetHeight;}
     else{
     sy=event.clientY;}*!/
     sx=event.clientX;
     sy=event.clientY;
     };
     that.cutBox.onmousemove=function (event) {
     var cx= 0,cy= 0,wh= 0,ht=0;
     if(off){
     mx=event.clientX;
     my=event.clientY;
     mx=mx>0?mx:0;
     mx=mx>pic.width()?pic.width():mx;
     my=my>0?my:0;
     my=my>pic.width()?pic.width():my;
     if(sx>mx&&sy>my){
     sizeBox.css({right:(pic.width()-sx)+'px',bottom:(pic.height()-sy)+'px'});
     cx=mx;cy=my;
     }
     else if(sx>mx&&sy<my){
     sizeBox.css({right:(pic.width()-sx)+'px',top:sy+'px'});
     cx=mx;cy=sy;
     }
     else if(sx<mx&&sy<my){
     sizeBox.css({left:sx+'px',top:sy+'px'});
     cx=sx;cy=sy;
     }
     else if(sx<mx&&sy>my){
     sizeBox.css({left:sx+'px',bottom:(pic.height()-sy)+'px'});
     cx=sx;cy=my;
     }
     wh=Math.abs(mx-sx);
     ht=Math.abs(my-sy);
     if(ht>pic.height()-50){
     $(that.btnList).css('bottom',0);
     }
     sizeBox.width(wh);
     sizeBox.height(ht);
     that.cut(cx, cy, wh,ht);
     }
     };
     that.cutBox.onmouseup=function () {
     off=false;
     that.savePic();
     that.cancelCut();
     that.sign();
     that.sendBack();
     return false;
     };*/
};
Screen.prototype.createEle=function(father,type,id){
    var ele=document.createElement(type);
    ele.id=id;
    father.appendChild(ele);
    return ele;
};
Screen.prototype.cut=function(left,top,wh,ht){
    var that=this;
    var canvas=this.canvas;
    canvas.width = wh;
    canvas.height = ht;
    this.context.drawImage(that.video, left*that.scaleX, top*that.scaleY, wh*that.scaleX, ht*that.scaleY,0, 0, wh, ht);
    this.baseURL=that.canvas.toDataURL('png');
};
Screen.prototype.download=function(type){
    //设置保存图片的类型
    var imgdata =  this.baseURL;
    console.log(imgdata);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    var fixtype = function (type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    };
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream');
    //将图片保存到本地
    var saveFile = function (data, filename) {
        var link = document.createElement('a');
        link.href = data;
        link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    };
    var filename = new Date().toLocaleDateString() + '.' + type;
    saveFile(imgdata, filename);
};
Screen.prototype.cancelFun=function(){
    $(this.cutBox).remove();
};
Screen.prototype.cancelCut=function(){
    var that=this;
    this.cancel.onclick=function(){
        that.cancelFun();
    };
    var body=document.body;
    body.onkeydown=function () {
        if (event.keyCode === 27) {
            that.cancelFun();
            return false;
        }
    }
};
Screen.prototype.sign=function(){
    var that=this;
    this.rect.onclick=function(){
        that.rectSign()
    };
};
Screen.prototype.rectSign=function(){
    this.cutBox.onmousedown=null;
    this.cutBox.onmousemove=null;
    this.cutBox.onmouseup=null;
    var ogc= this.context;
    this.canvas.style.cursor='crosshair';
    var that=this;
    var p=GetPos(that.sizeBox);
    this.canvas.onmousedown = function(ev){
        var ev=ev || window.event;
        ogc.strokeStyle ='#e31e26';
        ogc.moveTo(ev.clientX-p.Left,ev.clientY-p.Top);
        document.onmousemove = function(ev){
            var ev = ev || window.event;
            ogc.lineTo(ev.clientX-p.Left,ev.clientY-p.Top);
            ogc.stroke();
        };
        document.onmouseup = function(){
            that.baseURL=that.canvas.toDataURL('png');
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
};
Screen.prototype.savePic=function(){
    var that=this;
    var type = 'png';

    that.save.onclick=function(){
        that.download(type);
        that.cancelFun();
    }
};
Screen.prototype.sendBack=function(){
    var that=this;
    that.sure.onclick=function(){
        if (that.sendPic !== null) {
            that.sendPic.call(that,that.baseURL);
            that.cancelFun();
        }
    }
};
(function($){
    $.fn.screen = function(options) {
        var _ = this;
        return _.each(function(index, element) {
            element.onclick =function(){
                this.screen=new Screen(options)
            };
        });
    };
})(jQuery);
