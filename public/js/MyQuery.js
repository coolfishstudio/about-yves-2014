/*
********************************************************
	Author:		yves
	Date:		20140410
	Name:		MyQuery.js  --该js库参考于jquery源码
	QQ:			461836324		
	Version:	1.0
	
	Function:	
********************************************************
*/
/* 构造函数 MyQuery对象 */
function MyQuery(arg){
	this.elements = [];//用于存元素
	this.domString = '';//存储待创建的字符串
	
	switch(typeof arg){//根据传进来的类型判断
		case 'function':
			addReady(arg);//执行函数
			break;
		case 'string':
			if(arg.indexOf('<') != -1){//判断传进来的字符串是否有左尖括号
				//如果有则创建元素
				
			}else{
				//如果没有则选择元素
				this.elements = getEle(arg);
			}
			break;
		case 'object':
			if(arg instanceof Array){
				this.elements = arg;
			}else{
				this.elements.push(arg);
			}
			break;
		default:
			return null;
	}
}
/* ---------------方法事件----------------- */
var arr = ['click', 'mouseover', 'mouseout', 'mousemove', 'mousedown', 'mouseup', 'keydown', 'keyup', 'dblclick', 'scroll', 'resize', 'change', 'contextmenu', 'focus', 'blur'];
function _add(s){
	MyQuery.prototype[s] = function (fn){
		for(var i = 0; i < this.elements.length; i++){
			addEvent(this.elements[i],s,fn);
		}
	};
}

for(var i = 0; i < arr.length; i++){
	_add(arr[i]);
}
/* ---------------方法函数----------------- */
//css方法 处理样式
MyQuery.prototype.css = function(name,value){
	//如果传进来的是1个值 那么是获取 如果是2个值 那么是修改
	if(arguments.length == 2){//修改
		for(var i = 0; i < this.elements.length; i++){//遍历这个元素的所有属性
			this.elements[i].style[name] = value;
		}
	}else{//获取 判断类型
		if(typeof name == 'string'){
			var obj = this.elements[0];
			return getStyle(obj,name);
		}else{//json 一组
			for(var i = 0; i < this.elements.length; i++){
				for(var j in name){
					this.elements[i].style[j] = name[j];
				}
			}
		}
	}
};
//attr方法 处理属性
MyQuery.prototype.attr = function(name,value){
	//如果传进来的是1个值 那么是获取 如果是2个值 那么是修改
	if(arguments.length == 2){//修改
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].setAttribute(name,value);
		}
	}else{//获取
		if(typeof name == 'string'){
			var obj = this.elements[0];
			return obj.getAttribute(name);
		}else{//一组
			for(var i = 0; i < this.elements.length; i++){
				for(var j in name){
					this.elements[i].setAttribute(j,name[j]);
				}
			}
		}
	}
};
//html方法
MyQuery.prototype.html = function(str){
	if(arguments.length == 1){//设置
		for(var i = 0; i < this.elements.length; i++){
			this.elements[i].innerHTML = str;
		}
	}else{//获取
		var obj = this.elements[0];
		return obj.innerHTML;
	}
};
//运动
MyQuery.prototype.animate = function(json){
	for(var i=0;i<this.elements.length;i++){
		move(this.elements[i], json);
	}
};
//移入
MyQuery.prototype.mouseenter = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		addEvent(this.elements[i],'mouseover',function(ev){
			var oFrom = ev.fromElement || ev.relatedTarget;
			if(isChild(this,oFrom))return;
			fn.call(this,ev);
		});
	}
};
//移出
MyQuery.prototype.mouseleave = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		addEvent(this.elements[i],'mouseout',function(ev){
			var oTo = ev.toElement || ev.relatedTarget;
			if(isChild(this,oTo))return;
			fn.call(this,ev);
		});
	}
};
//移入移出
MyQuery.prototype.hover = function(fnOver,fnOut){
	this.mouseenter(fnOver);
	this.mouseleave(fnOut);
};
//切换
MyQuery.prototype.toggle = function(){
	var _this = this;
	var _arg = arguments;
	for(var i = 0; i < this.elements.length; i++){
		(function(count){
			addEvent(_this.elements[i],'click',function(ev){
				_arg[count % _arg.length].call(this, ev);
				count++;
			});
		})(0);
	}	
};
//绑定
MyQuery.prototype.bind = function(name,fn){
	for(var i = 0; i < this.elements.length; i++){
		addEvent(this.elements[i],name,fn);
	}
};
//循环
MyQuery.prototype.each = function(fn){
	for(var i = 0; i < this.elements.length; i++){
		fn.call(this.elements[i],i,this.elements[i]);
	}
};
//找
MyQuery.prototype.find = function(str){
	var aChild = getEle(str,this.elements);//在父级下找
	return $(aChild);
};
//第几个
MyQuery.prototype.eq = function(n){
	return $(this.elements[n]);	
};
//总个数
MyQuery.prototype.length = function(){
	return this.elements.length;	
};
//转换对象类型
MyQuery.prototype.get = function(n){
	if(!isNaN(n) && n >= 0 && n < this.elements.length){
		return this.elements[n];
	}else{
		return null;
	}
};
//获取下标
MyQuery.prototype.index = function(){
	var obj = this.elements[this.elements.length - 1];
	var aSibling = obj.parentNode.children;//obj在同级元素中的序号
	for(var i = 0; i < aSibling.length; i++){
		if(aSibling[i] == obj){
			return i;
		}
	}
};
//插入
MyQuery.prototype.appendTo = function(str){
	var aParent = getEle(str);
	for(var i = 0; i < aParent.length; i++){
		_appendTo(aParent[i],this.domString);
	}
};
//删除
MyQuery.prototype.remove = function(){
	for(var i = 0; i < this.elements.length; i++){
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
};
//插件机制
MyQuery.prototype.extend = function(json){
	for(var i in json){
		MyQuery.prototype[i]=json[i];
	}
};
//判断是否支持HTML5
MyQuery.prototype.checkHtml5 = function (){
 	if(typeof(Worker) !== "undefined"){
		return true;//支持HTML5
 	}else{
		return false;//不支持HTML5
 	}
};
//复制
MyQuery.prototype.dumpEle = function(obj,tagName, data){
	var oTmp = document.createElement(tagName);
	oTmp.innerHTML = obj.outerHTML.replace(/\{\$\w+\}/g,function(s){
		s = s.substring(2, s.length-1);
		return data[s];
	});
	oTmp.children[0].id = '';
	return oTmp.children[0];
},
//ajax
MyQuery.prototype.ajax = function(url, fnSucc, fnFaild){
	//1.创建Ajax对象
	if(window.XMLHttpRequest){
		var oAjax = new XMLHttpRequest();
	}else{
		var oAjax = new ActiveXObject("Microsoft.XMLHTTP");
	}
	//2.连接服务器（打开和服务器的连接）
	oAjax.open('GET', url, true);
	//3.发送
	oAjax.send();
	//4.接收
	oAjax.onreadystatechange = function(){
		if(oAjax.readyState == 4){
			if(oAjax.status==200){
				//alert('成功了：'+oAjax.responseText);
				fnSucc(oAjax.responseText);
			}else{
				//alert('失败了');
				if(fnFaild){
					fnFaild();
				}
			}
		}
	};
};
//jsonp
MyQuery.prototype.jsonp = function(json,fnSucc,fnTime){
	//对参数的定义 进行默认处理
	if(!json.url){
		alert('url必须填写，不得为空。');	
		return;
	}
	json.time = json.time || 5;
	var timer = null;
	var fnName = 'jsonp'+Math.random();
	fnName = fnName.replace('.','');
	window[fnName] = function(json){
		fnSucc && fnSucc(json);
		clearTimeout(timer);
		oHead.removeChild(oS);	
	}
	
	json.data.cbName = fnName;
	//json.data.cbName = fnName;
	
	var arr = [];
	for(var name in json.data){
		arr.push(name + '=' + json.data[name]);
	}
	var str = arr.join('&');
	
	var oS = document.createElement('script');
	oS.src = json.url + '?' + str;	
	var oHead = document.getElementsByTagName('head')[0];
	oHead.appendChild(oS);	
	
	timer = setTimeout(function(){
		fnTime && fnTime();
	},json.time * 1000);
};
/* ---------------工具函数----------------- */
//根据className 获取元素
function getByClass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		var aEle = oParent.getElementsByTagName('*');
		var result = [];
		var re = new RegExp('\\b' + sClass + '\\b');
		for(var i = 0; i < aEle.length; i++){
			if(re.test(aEle[i].className)){
				result.push(aEle[i]);
			}
		}
	}
	return result;
}
//事件绑定
function addEvent(obj,sEv,fn){//sEv 函数名
	if(obj.addEventListener){//不兼容IE678
		obj.addEventListener(sEv,function(ev){
			if(false == fn.call(obj,ev)){
				ev.cancelBubble = true;//阻止冒泡
				ev.preventDefault();//取消事件的默认事件
			}
		},false);
	}else{
		obj.attachEvent('on' + sEv,function(){
			if(false == fn.call(obj,event)){
				event.cancelBubble = true;
				return false;
			}
		});
	}
}
//事件移除
function removeEvent(){
	if(obj.removeEventListener){
		obj.removeEventListener(sEv, fn, false);
	}else{
		obj.detachEvent('on'+sEv, fn);
	}
}
//获取真实样式
function getStyle(obj,name){
	return obj.currentStyle ? obj.currentStyle[name] : getComputedStyle(obj,false)[name];
}
//运动
function move(obj, json, options){
	options = options || {};
	options.type = options.type || 'buffer';
	options.time = options.time || 700;
	var count = parseInt(options.time / 30);
	var n = 0;
	var start = {};
	var dis = {};	
	for(var name in json){
		if(name == 'opacity'){
			start[name] = Math.round(parseFloat(getStyle(obj,name)) * 100);
		}else{
			start[name] = parseInt(getStyle(obj,name));
		}
		dis[name] = json[name] - start[name];
	}
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		n++;
		for(var name in json){
			switch(options.type){
				case 'linear'://匀速
					var cur = start[name] + dis[name] * n / count;
					break;
				case 'buffer'://缓冲
					var a = 1 - n / count;
					var cur = start[name] + dis[name] * (1 - a * a * a);
					break;
				case 'ease-in'://加速
					var a = n / count;
					var cur = start[name] + dis[name] * (a * a * a);
					break;
			}	
			if(name == 'opacity'){
				obj.style.filter = 'alpha(opacity:' + cur + ')';
				obj.style.opacity = cur / 100;
			}else{
				obj.style[name] = cur + 'px';
			}
		}
		if(n == count){
			clearInterval(obj.timer);
			options.end && options.end();
		}
	}, 30);
}
//
function isChild(oParent,obj){
	while(obj){
		if(oParent == obj)return true;
		obj = obj.parentNode;
	}
	return false;
}
//
function _appendTo(oParent,str){
	var oTmp = document.createElement('div');
	oTmp.innerHTML = str;
	while(oTmp.childNodes.length){
		oParent.appendChild(oTmp.childNodes[0]);
	}
}
/* ---------------选择器----------------- */
//支持 #box .box li li.box li#li1 li[title=aaa] li:firWst
//核心
function _getByStr(aParent,str){
	var aChild=[];//定义容器
	for(var i = 0; i < aParent.length; i++){
		switch(str.charAt(0)){//根据第一位的内容判断是什么类型
			case '#'://如果首位是# 则意味着 #box 是id
				var obj = document.getElementById(str.substring(1));//利用getById 获取元素 注意去掉#
				aChild.push(obj);
				break;
			case '.'://如果首位是. 则意味着 .box 是class
				var arr = getByClass(aParent[i],str.substring(1));//利用getByClass 获取元素 去掉.
				for(var j = 0; j < arr.length; j++){
					aChild.push(arr[j]);
				}
				break;
			default://其余的意味着是标签
				//li li.box li#li1 li[title=aaa] li:first
				if(/\w+\.\w+/.test(str)){//li.box	 /\w+\.\w+/			
					var aStr = str.split('.');//根据.切割
					// 0 标签  1 是class
					//1.获取aParent[i]下所有的对应标签
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					//2.判断对应标签的className是否与aStr[1]一样
					var re = new RegExp('\\b' + aStr[1] + '\\b');
					for(var j = 0; j < arr.length; j++){
						if(re.test(arr[j].className)){//如果一样的话 就放进容器里
							aChild.push(arr[j]);
						}
					}
				}else if(/\w+#w+/.test(str)){//li#li1    /\w+#w+/
					var aStr = str.split('#');//根据#切割
					// 0 标签 1 是id
					//1.获取对应标签
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					//2.判断id是否与aStr[1]一样
					for(var j = 0; j < arr.length; j++){
						if(arr[j].id == aStr[1]){
							aChild.push(arr[j]);
						}
					}
				}else if(/\w+\[\w+=\w+\]/.test(str)){//li[title=aaa]    /\w+\[\w+=\w+\]/
					var aStr = str.split(/\[|=|\]/g);//将li[title=aaa] 切割成 li title aaa
					//0标签 1属性名 2属性值
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					for(var j = 0; j < arr.length; j++){
						if(arr[j].getAttribute(aStr[1]) == aStr[2]){//如果属性名对应的值 与属性值相等
							aChild.push(arr[j]);
						}
					}
				}else if(/\w+:\w+(\(.+\))?/.test(str)){//li:first li:eq(0)	/\w+:\w+(\(.+\))?/
					var aStr = str.split(/:|\(|\)/g);
					//0 标签 1 伪类 2 参数
					var arr = aParent[i].getElementsByTagName(aStr[0]);//获取参数
					switch(aStr[1]){//判断伪类的类型 用于返回规定的值
						case 'first'://li:first 返回首个
							aChild.push(arr[0]);
							break;
						case 'last'://li:last 返回最后一个
							aChild.push(arr[arr.length-1]);
							break;
						case 'eq'://li:eq(1) 返回第2个
							var iNum = parseInt(aStr[2]);//记录 要获取第几个
							if(!isNaN(iNum) && iNum >= 0 && iNum < arr.length){
								aChild.push(arr[iNum]);
							}
							break;
						case 'gt'://li:gt(1) 返回第2个以后的
							var iNum = parseInt(aStr[2]);//记录 大于第2个
							if(!isNaN(iNum) && iNum >= 0 && iNum < arr.length){
								for(var j = iNum + 1; j < arr.length; j++){
									aChild.push(arr[j]);
								}	
							}
							break;
						case 'lt'://li:lt(1) 返回第2个以前的
							var iNum = parseInt(aStr[2]);
							if(!isNaN(iNum) && iNum >= 0 && iNum < arr.length){
								for(var j = 0; j < iNum; j++){
									aChild.push(arr[j]);
								}
							}
							break;
						case 'even'://li:even 匹配偶数个 位置从0开始
							for(var j = 1; j < arr.length; j += 2){
								aChild.push(arr[j]);
							}
							break;
						case 'odd'://li:odd 匹配奇数个 位置从0开始
							for(var j = 0; j < arr.length; j += 2){
								aChild.push(arr[j]);
							}
							break;
					}
				}else{//li 
					//直接获取对应标签
					var arr = aParent[i].getElementsByTagName(str);
					for(var j = 0; j < arr.length; j++){
						aChild.push(arr[j]);
					}
				}
				break;
		}
	}
	return aChild;
}
//选择器
function getEle(str,aParent){
	var arr = str.replace(/^\s+|\s+$/g,'').split(/\s+/g);//清除多余的空格
	aParent = aParent || [document];//定义父级为document
	var aChild = [];//定义元素容器
	for(var i = 0; i < arr.length; i++){
		aChild = _getByStr(aParent,arr[i]);//选择元素
		aParent = aChild;//定义下次的父级节点为现在的子节点
	}
	return aChild;
}
/* ---------------执行函数----------------- */
function addReady(fn){//domReady事件绑定
	if(document.addEventListener){//不兼容IE6、7、8
		document.addEventListener('DOMContentLoaded', fn, false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState == 'complete'){//判断文档是否加载完
				fn();
			}
		});
	}
}
/* ---------------简写------------------ */
// $替代MyQuery
function $(arg){
	return new MyQuery(arg);
}
$.fn = MyQuery.prototype;