# screenShot
js+canvas+video screenShot
使用js+canvas+video 模拟QQ截图插件
调用方式obj.screen({options});
参数说明
options.video    ----要截图的视频；
options.scaleY   ----视频Y轴拉伸比例
options.scaleX   ----视频X轴拉伸比例
options.sendPic  ----按下截图功能中的确定按钮时，调用的回调函数，参数是canvas生成的base64格式的图片数据；
