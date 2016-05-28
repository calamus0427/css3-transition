// JavaScript Document

var $id=function(n){
    return document.getElementById(n) || n;
  }  
  
 
//修改css属性的函数
//自带浏览器前缀功能
var pfx = (function() {
        var style = document.createElement('dummy').style,
            prefixes = ['Webkit','Moz','O','ms','Khtml'], //主流浏览器内核前缀
            memory = {};
 
        function _pfx(prop) {
            if(typeof memory[prop] === "undefined") {
                var ucProp = prop.charAt(0).toUpperCase()+prop.substr(1),
                    props = [prop].concat(prefixes.map(function(prefix) {
                        return prefix+ucProp;
                    }));
                memory[prop] = null;
                for(var i in props) {
                    if(style[props[i]] !== undefined) {
                        memory[prop] = props[i];
                        break;
                    }
                }
            }
            return memory[prop];
        }
 
        return _pfx;
    })();
	
//将修改css属性，封装成函数
function css(el, props) {
        for(var key in props) {
            var pkey = pfx(key);
            if(pkey !== null) el.style[pkey] = props[key];
        }
        return el;
}

  $id("canvas").addEventListener("mousedown", main, false); //监听canvas鼠标按下事件
  var con=$id("canvas").getContext('2d');
  
  //存放拖动数据的数组
  //sta起点坐标
  //end终点坐标
  //cr1控制起点坐标
  //cr2控制终点坐标
  var vector={sta:[],end:[],cr1:[],cr2:[]}
  //存放用户输入数据的数组
  //time：duration，delay
  var inputTime={time:[],bezier:[]}
  //canvas事件
  function main(){
    var e=arguments[0];
    var cx=e.layerX || e.offsetX, //鼠标起点
    cy=e.layerY || e.offsetY;
    init(cx,cy);   //初始化点
    var sx=parseInt(vector.sta[0]), //起点
        sy=parseInt(vector.sta[1]),
        ex=parseInt(vector.end[0]), //终点
        ey=parseInt(vector.end[1]),
        cr1x=parseInt(vector.cr1[0]), //控制点1
        cr1y=parseInt(vector.cr1[1]),
        cr2x=parseInt(vector.cr2[0]), //控制点2
        cr2y=parseInt(vector.cr2[1]);
    if(vector.end[0] == undefined) return alert("请选择终点");;  //仅有起点时，退出。
    if(cr1x-10< cx&&cx< cr1x+10&&cr1y-10< cy&&cy< cr1y+10){ //选中控制点1
      discern('ctr1',cx,cy,cr1x,cr1y,cr2x,cr2y);
    }
    else if(cr2x-10< cx&&cx< cr2x+10&&cr2y-10< cy &&cy< cr2y+10){//选中控制点2
      discern('ctr2',cx,cy,cr1x,cr1y,cr2x,cr2y);
    }
    else if(sx-5< cx&&cx< sx+5&&sy-5 < cy&&cy< sy+5){  //选中起点
       discern('start',cx,cy,cr1x,cr1y,cr2x,cr2y);
    }
    else if(ex-5< cx&&cx< ex+5&&ey-5< cy&&cy< ey+5 ){  //选中终点
       discern('end',cx,cy,cr1x,cr1y,cr2x,cr2y);
    }
    document.onmouseup=function(){
      document.onmousemove=null;
    }
  }
  function init(cx,cy){
    if(vector.sta[0] == undefined){  //若无起点时，初始化起点
      vector.sta[0] = vector.cr1[0] = cx;
      vector.sta[1] = vector.cr1[1] = cy;
      con.fillRect(vector.sta[0]-1, vector.sta[1]-1 ,3,3);
    }
    else if(vector.end[0] == undefined){  //若无终点，初始化终点
      vector.end[0] = vector.cr2[0] = cx;
      vector.end[1] = vector.cr2[1] = cy;
      con.fillRect(vector.end[0]-1, vector.end[1]-1 ,3,3);
      draw()  //已有两点，开始绘线
    }
   }
   function discern(v,cx,cy,cr1x,cr1y,cr2x,cr2y){
     document.onmousemove=function(e){
     var dx=e.layerX || e.offsetX,  //鼠标当前坐标
     dy=e.layerY || e.offsetY;
     switch(v) {
       case 'start' :  //拖动起点
         vector.sta[0]=dx;
         vector.sta[1]=dy;
         vector.cr1[0] = cr1x + (dx-cx);
         vector.cr1[1] = cr1y + (dy-cy);
         break;
      case 'end' :
        vector.end[0]=dx;
        vector.end[1]=dy;
        vector.cr2[0] = cr2x + (dx-cx);
        vector.cr2[1] = cr2y + (dy-cy);
        break;
      case 'ctr1' :
        vector.cr1[0] = dx;
        vector.cr1[1] = dy;
        break;
      case 'ctr2' :
        vector.cr2[0] = dx;
        vector.cr2[1] = dy;
        break;
      default: break;
     }
     draw();
    }
  }
 

 function draw(){
   con.clearRect(0,0,800,500);
     //画贝塞尔曲线	 
     con.beginPath();
     con.moveTo(vector.sta[0], vector.sta[1]);
     con.bezierCurveTo(vector.cr1[0], vector.cr1[1], vector.cr2[0], 
        vector.cr2[1], vector.end[0], vector.end[1]);
		con.lineWidth=5;              //设置曲线宽度
		con.strokeStyle = "rgba(177,8,171,0.5)";      //设置曲线颜色
      con.stroke();

	  //画参考直线
	    con.beginPath(); 
		con.strokeStyle = "rgba(255,255,255,0.5)"; 
		con.moveTo(vector.sta[0], vector.sta[1]); 
		con.lineTo(vector.end[0], vector.end[1]); 
		con.lineWidth=5;             
		con.stroke();
		con.closePath();
		
     //画控制线1
     con.beginPath();
     con.moveTo(vector.sta[0],vector.sta[1]);
     con.lineTo(vector.cr1[0], vector.cr1[1]);
	 con.lineWidth=2;             
	 con.strokeStyle ="red"; 
     con.stroke();
     //画控制线2
     con.beginPath();
     con.moveTo(vector.end[0], vector.end[1]);
     con.lineTo(vector.cr2[0], vector.cr2[1]);
	 con.lineWidth=2;             
		con.strokeStyle ="blue"; 
     con.stroke();
     //画4个控制点
	 //控制点1
	 con.beginPath();
	 con.fillStyle="blue";
	 con.arc(vector.cr2[0]-1, vector.cr2[1]-1 ,10,0,Math.PI*2,false);
	 con.fill();
	 con.closePath();
	 //控制点2
	 con.beginPath();
	 con.fillStyle="red";
	 con.arc(vector.cr1[0]-1, vector.cr1[1]-1 ,10,0,Math.PI*2,false);
	 con.fill();
	 con.closePath();
	 //起点
	 con.beginPath();
	 con.fillStyle="red";
	 con.arc(vector.sta[0]-1, vector.sta[1]-1 ,2,0,Math.PI*2,false);
	 con.fill();
	 con.closePath();
	 //终点
	 con.beginPath();
	 con.fillStyle="blue";
	 con.arc(vector.end[0]-1, vector.end[1]-1,2,0,Math.PI*2,false);
	 con.fill();
	 con.closePath();
     //输出贝塞尔函数
	 var arg1=(vector.cr1[0]/300).toFixed(2);
	 var arg2=(1-((vector.cr1[1]-200)/300)).toFixed(2);
	 var arg3=(vector.cr2[0]/300).toFixed(2);
	 var arg4=(1-((vector.cr2[1]-200)/300)).toFixed(2);
     $id('bezierArg').innerHTML='cubic-bezier(' +arg1+','+ arg2
       +',' + arg3+',' + arg4 +');';
   }

//timing-function的属性选择
function ease(){
//	alert("cubic-bezier(0.25,0.1,0.25,1))");
	vector.sta[0]=50;
	vector.sta[1]=450;
	vector.end[0]=250;
	vector.end[1]=250;
	vector.cr1[0]=200;
	vector.cr1[1]=380;
	vector.cr2[0]=200;
	vector.cr2[1]=250;
	draw();
	}
function easeIn(){
//	alert("cubic-bezier(0.42,0,1,1)");
	vector.sta[0]=50;
	vector.sta[1]=450;
	vector.end[0]=250;
	vector.end[1]=250;
	vector.cr1[0]=234;
	vector.cr1[1]=450;
	vector.cr2[0]=350;
	vector.cr2[1]=250;
	draw();
}
function easeOut(){
//	alert("cubic-bezier(0,0,0.58,1)");
	vector.sta[0]=50;
	vector.sta[1]=450;
	vector.end[0]=250;
	vector.end[1]=250;
	vector.cr1[0]=150;
	vector.cr1[1]=450;
	vector.cr2[0]=266;
	vector.cr2[1]=250;
	draw();
	}
function easeInOut(){
//	alert("cubic-bezier(0.42,0,0.58,1)");
		vector.sta[0]=50;
	vector.sta[1]=450;
	vector.end[0]=250;
	vector.end[1]=250;
	vector.cr1[0]=234;
	vector.cr1[1]=450;
	vector.cr2[0]=266;
	vector.cr2[1]=250;
	draw();
	}
function linear(){
//	alert("cubic-bezier(0,0,1,1)");
	vector.sta[0]=50;
	vector.sta[1]=450;
	vector.end[0]=250;
	vector.end[1]=250;
	vector.cr1[0]=150;
	vector.cr1[1]=450;
	vector.cr2[0]=350;
	vector.cr2[1]=250;
	draw();
	}
	
//获取canvas内鼠标移动时的坐标修改后需要的bezier参数
function getXY(e)
{
		var e=e||window.event;                //client鼠标在页面上可视区域的位置
		x=(e.clientX-100)/300;           
		x1=x.toFixed(2);
		y=(e.clientY-263)/300;
		y1=(1-y).toFixed(2);
		document.getElementById('timerPercent').innerHTML=""+x1+"";
		document.getElementById('progressPercent').innerHTML=""+y1+"";
		
	}
function clearXY(){
	document.getElementById('timerPercent').innerHTML="";
	document.getElementById('progressPercent').innerHTML="";	
	}



//获取delay、duration数值,最大值均为10s
//duration必须有初值，所以最小值为0.1，delay最小值为0
//inputTime={time:[],bezier:[]} time内存放duration和delay参数
	var deTime=0;
	var duTime=3;
	var ode=$id('delayNum');
	var odu=$id('durationNum');
	var oDu=$id('progressDuration');
	var oDe=$id('progressDelay');
	var odeBox=$id('delayBox');
	var oduBox=$id('durationBox');
	odeBox.addEventListener("click",clickDelay,false);
	oduBox.addEventListener("click",clickDuration,false);
	function clickDelay(){
	var e=arguments[0];
    var x1=e.layerX || e.offsetX, //鼠标起点
	 	x2=(x1/22).toFixed(2);             
		ode.innerText=x2+"s";
		if(x1>=200){oDe.style.left="200px";}         //防止鼠标点击超出范围
		else if(x1<=10){oDe.style.left="0px"}
		else  oDe.style.left=x1-10+"px";
		inputTime.time[1]=x2;
		}
	
	function clickDuration(){
		var e=arguments[0];
	 var x1=e.layerX || e.offsetX, //鼠标起点
	 	x2=(x1/22).toFixed(2);             
		odu.innerText=x2+"s";
		if(x1>=200){oDu.style.left="200px";}         //防止鼠标点击超出范围
		else if(x1<=10){oDu.style.left="0px"}
		else  oDu.style.left=x1-10+"px";
		inputTime.time[0]=x2;
		}
  

//输入参数对话框的关闭函数
 function msgbox(n){
            document.getElementById('inputbox').style.display=n?'block':'none';   //点击按钮打开/关闭 对话框		 
        }
//输出参数对话框的关闭函数
function msgbox1(n)
{
	document.getElementById('outputbox').style.display=n?'block':'none'; 
	}
	
//获取用户输入的参数
var flag;
function submitBezier(){
	flag=0;
	document.getElementById('inputbox').style.display='block';
	var myValX1= document.getElementById("x1")     //参数1
	var myValY1=document.getElementById("y1")      //参数2
	var myValX2= document.getElementById("x2")      //参数3
	var myValY2= document.getElementById("y2")    //参数4
	//判断用户输入的是否是数字
	if(isNaN(myValX1.value)||isNaN(myValY1.value)||isNaN(myValX2.value)||isNaN(myValY2.value)){
		alert("参数必须是数字");myValX1="";}
	if(myValX1.value==""||myValX2.value==""||myValY1.value==""||myValY2.value==""){alert("参数不能为空");}
	else {alert("保存成功" );flag=1;
}	
	inputTime.bezier[0]=myValX1.value;
	inputTime.bezier[1]=myValX2.value;
	inputTime.bezier[2]=myValY1.value;
	inputTime.bezier[3]=myValY2.value;
	return flag;
}


//输出代码函数
function alertMsg(n)
{	
	document.getElementById('outputbox').style.display='block'; 
	var currentduT=inputTime.time[0];
	var currentdeT=inputTime.time[1];
	var arg1=(vector.cr1[0]/300).toFixed(2);
	var arg2=(1-((vector.cr1[1]-200)/300)).toFixed(2);
	var arg3=(vector.cr2[0]/300).toFixed(2);
	var arg4=(1-((vector.cr2[1]-200)/300)).toFixed(2);
	var a=inputTime.bezier[0];
	var a1=inputTime.bezier[1];
	var a2=inputTime.bezier[2];
	var a3=inputTime.bezier[3];
  var list=document.getElementById("outputMsg");//获取检索范围
  var str=list.getElementsByTagName("span");//获取检索内容块
 for(var i=0;i<str.length;i++)//遍历内容块
   { if(str[i].className=="TF")//判断类名是否为kkk
   		{ if(!flag){str[i].innerHTML='cubic-bezier(' +arg1+','+ arg2
       +',' + arg3+',' + arg4 +')';}
		else {
			str[i].innerHTML='cubic-bezier(' +a+','+ a1
       +',' + a2+',' + a3 +')';}}
	if(str[i].className=="duT")
		str[i].innerHTML=currentduT;
	if(str[i].className=="deT")
		str[i].innerHTML=currentdeT;	}
	}

//判断输出函数参数
//输出函数代码
var outputArg={duration:[],bezier:[],delay:[]};
function outputArg(){
	  var time1=inputTime[0];
	  var time2=inputTime[1];
	  //控制参数
	  var bezier1=(vector.cr1[0]/300).toFixed(2);           
	  var bezier2=arg2=(1-((vector.cr1[1]-200)/300)).toFixed(2);
	  var bezier3=arg3=(vector.cr2[0]/300).toFixed(2);
	  var bezier4=(1-((vector.cr2[1]-200)/300)).toFixed(2);
	  	var a=inputTime.bezier[0];
	var a1=inputTime.bezier[1];
	var a2=inputTime.bezier[2];
	var a3=inputTime.bezier[3];
	  outputArg.duration[0]=time1;
	  outputArg.delay[0]=time2;

	if(!flag){
	  outputArg.bezier[0]=bezier1;
	  outputArg.bezier[1]=bezier2;
	  outputArg.bezier[2]=bezier3;
	  outputArg.bezier[3]=bezier4;
		}
	else {
  	  outputArg.bezier[0]=a;
	  outputArg.bezier[1]=a1;
	  outputArg.bezier[2]=a2;
	  outputArg.bezier[3]=a3;
	}	

	}


/*********************演示动画函数*********************************/
/***************存储所有动画参数
/***************并同时改变transition参数值
/***************一共种中演示效果
/****************************************************************/
var opreviewImg=document.getElementById("previewImg");       //演示动画的变量
function runArg(n){
	var arg1=outputArg.bezier[0];
	var arg2=outputArg.bezier[1];
	var arg3=outputArg.bezier[2];
	var arg4=outputArg.bezier[3];
	var delay=inputTime.time[1];
	var duration=inputTime.time[0];

	switch(n)
	{
		case 1: 
		opreviewImg.style.background=="yellow";
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";//添加transition过渡属性，并传入参数
		break;
		case 2: 
		opreviewImg.style.background="rgba(255,255,0,1)";
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		case 3: 
		opreviewImg.style.width="200px";
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		case 4:
		opreviewImg.style.height="200px";
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		case 5:
		opreviewImg.style.transform="scale(1.8,1.8)";
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		case 6: 
		opreviewImg.style.transform="scale(0.5,0.5)";
    	 css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		case 7: 
		opreviewImg.style.transform="rotate(360deg)";
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		case 8: 
		css(opreviewImg,{"transform":"translateX(300px)"});
     	css(opreviewImg,{"transition-property":"all","transition-timing-function":" cubic-bezier(arg1,arg2 ,arg3,arg4)"}); 
		opreviewImg.style.transitionDuration=duration+"s";
		opreviewImg.style.transitionDelay=delay+"s";
		break;
		}
	
	}
		
//清除改变后的演示效果，回到最终状态	
function clearRun(){
	document.getElementById('remind').style.display='none'; 
	opreviewImg.style.background=="";
	opreviewImg.style.background="";
	opreviewImg.style.width="";
	opreviewImg.style.height="";
	opreviewImg.style.transform="";
	opreviewImg.style.transform="";
	opreviewImg.style.transform="";
	opreviewImg.style.transform="";
	}	
	
//运行演示效果
function run(n)
{
	var opreviewImg=document.getElementById("previewImg");
	document.getElementById('remind').style.display='block';     //显示提示信息
	switch(n)
	{
		case 1: runArg(1);
		break;
		case 2: runArg(2);
		break;
		case 3: runArg(3);
		break;
		case 4: runArg(4);
		break;
		case 5: runArg(5);
		break;
		case 6: runArg(6);
		break;
		case 7: runArg(7);
		break;
		case 8: runArg(8);
		break;
		}
	}