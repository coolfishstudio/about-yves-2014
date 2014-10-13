function toMenu(iMenuNum){
	var arrMenuCA = ['首页','信息','项目','案例','交流'];
	var arrMenuEA = ['homepage','personage','article','cases','communication'];
	//默认事件
	$('#menuSliderBar').css('width',20 + 100 * iMenuNum + 'px');
	$('#menu ul li a').eq(iMenuNum).css('backgroundImage','url(/img/menu_' + arrMenuEA[iMenuNum] + '_on.png)');

	//菜单
	$('#menu ul li').hover(function(){
		$(this).find('a').css('backgroundImage','');
		$(this).find('a').html(arrMenuCA[$(this).index()]);
		$('#menuSliderBar').animate({width : 20 + 100 * $(this).index()});
	},function(){
		if(iMenuNum == $(this).index()){
			$(this).find('a').css('backgroundImage','url(/img/menu_' + arrMenuEA[$(this).index()] + '_on.png)');
		}else{
			$(this).find('a').css('backgroundImage','url(/img/menu_' + arrMenuEA[$(this).index()] + '.png)');
		}
		$(this).find('a').html('');
		$('#menuSliderBar').animate({width : 20 + 100 * iMenuNum});
	});
	//logo按钮
	$('.item').hover(function(){
		$(this).animate({width : 125});
		$(this).find('.item_content').animate({opacity : 100});
		$(this).find('img').eq(1).animate({opacity : 0});
	},function(){
		$(this).animate({width : 28});
		$(this).find('.item_content').animate({opacity : 0});
		$(this).find('img').eq(1).animate({opacity : 100});
	});
	//foot 下载
	$('.foot a').hover(function(){
		$(this).css('color','#52b00e');
	},function(){
		$(this).css('color','#cccccc');
	});
}
