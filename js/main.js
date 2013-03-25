var adam = {
		'client':'4788Z1TT13d4f4235a3',
		'position' : 'MIDDLE',
		'bannerDivId' : 'ad',
		'test' : false
};
var input_type = {'tel':'Tel','text':'Aa'}; //input type value
var margin = {
	'ad':48,
	'footer':50,
	'n_b':25//notification_bar
};
var color = {
		'toggle_bg0':'#ffffff',
		'toggle_color0':'#aaaaaa',
		'toogle_border0':'#aaaaaa',
		'toggle_bg1':'#4d90fe',
		'toggle_color1':'#ffffff',
		'toogle_border1':'#3079ed'
	};
var currentImg=0;

function button_swipe() {
	var IMG_WIDTH = $(window).width();

	var slope = 0; //for orientate start
	var supportsOrientationChange = "onorientationchange" in window,    
	orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";  
	window.addEventListener(orientationEvent, function() {
	    if (slope!=window.orientation){ 
	        slope = window.orientation; 
	        if(slope == 90 || slope == -90) {// 가로상태 
	        	IMG_WIDTH = $(window).height() + margin['n_b'];
				if (currentImg == 0) {
					previousImage();
				} else if (currentImg == 1) {
		        	nextImage();
				}
				setTimeout('output_resize()'); //textarea resise
				$('#ad').css('top',0); //ad show
				$('footer').css('bottom',0);
	        } 
	        else {// 세로상태 
	        	IMG_WIDTH = $(window).height() + margin['n_b'];
				if (currentImg == 0) {
					previousImage();
				} else if (currentImg == 1) {
		        	nextImage();
				}
				setTimeout('output_resize()'); //textarea resise
				$('#ad').css('top',0); //ad show
				$('footer').css('bottom',0);
	        } 
	    } 
	}, false);// for orientate end
	
	//var currentImg=0;
	var maxImages=2;
	var speed=500;

	var imgs;
		
	var swipeOptions= {
		triggerOnTouchEnd : true,	
		swipeStatus : swipeStatus,
		allowPageScroll:"vertical",
		threshold:75			
	};

	$(function() {				
		imgs = $("#imgs");
		imgs.swipe( swipeOptions );
	});

		
	/**
	* Catch each phase of the swipe.
	* move : we drag the div.
	* cancel : we animate back to where we were
	* end : we animate to the next image
	*/			
	function swipeStatus(event, phase, direction, distance) {
		//If we are moving before swipe, and we are going Lor R in X mode, or U or D in Y mode then drag.
		if( phase=="move" && (direction=="left" || direction=="right") ) {
			var duration=0;
			if (direction == "left")
				if (currentImg == maxImages - 1) { // 마지막 이미지에서 왼쪽 스와이프 제한
					scrollImages((IMG_WIDTH * currentImg) + distance/5, duration);
				} else {
					scrollImages((IMG_WIDTH * currentImg) + distance, duration);	
				}
			else if (direction == "right")
				if (currentImg == 0) { // 첫 이미지에서 오른쪽 스와이프 제한
					scrollImages((IMG_WIDTH * currentImg) - distance/5, duration);
				} else {
					scrollImages((IMG_WIDTH * currentImg) - distance, duration);	
				}
		} else if ( phase == "cancel") {
			scrollImages(IMG_WIDTH * currentImg, speed);
		} else if ( phase =="end" ) {
			if (direction == "right") {
				previousImage();
			} else if (direction == "left") {		
				nextImage();
			}
			toggle_morse(); //1.7.0
		}
	}
			
	function previousImage() {
		currentImg = Math.max(currentImg-1, 0);
		scrollImages( IMG_WIDTH * currentImg, speed);
	}

	function nextImage()
	{
		currentImg = Math.min(currentImg+1, maxImages-1);
		scrollImages( IMG_WIDTH * currentImg, speed);
	}
		
	/**
	* Manuallt update the position of the imgs on drag
	*/
	function scrollImages(distance, duration) {
		imgs = $("#imgs");
		imgs.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
		//inverse the number we set in the css
		var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
		imgs.css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
	}

	function toggle_morse() {
		if (currentImg == 0) {
			$('#input_textarea').attr('placeholder','한글, 영어, 숫자 및 문자를 입력하세요.').attr('type','text');
			$('#option').slideUp();
			$('.input_toggle').hide();
			$('#menu_toggle div').text('해석기');
			$('#menu_toggle img').attr('src','image/menu_forward.png');
		} else if (currentImg == 1) {
			$('#input_textarea').attr('placeholder','모스 부호를 입력하세요. (type: tel)').attr('type','tel');
			$('#option').slideDown();
			$('.input_toggle').show().attr('value',input_type['tel']);
			$('#menu_toggle div').text('변환기');
			$('#menu_toggle img').attr('src','image/menu_back.png');
		}
		$('.footer_output').slideUp();
	}
	$('#menu_toggle').click(function(){ //menu toggle translator <-> analyzer 1.6.0
		if (currentImg==0) {
			nextImage();
		} else {
			previousImage();
		}
		toggle_morse();
	});
}

function output_resize() {
	document.getElementById('output').style.height = 'auto';
    document.getElementById('output').style.height = document.getElementById('output').scrollHeight+'px';
}

function button_click() {
	$('#translate').swipe({
		click:function() {
			//$('#output').val('Translating...');
			ax.ext.ui.showProgress('Translating...');
			translate();
			setTimeout('output_resize()');
			ax.ext.ui.hideProgress();
		},
		swipe:function(){
			//스와이프에는 출력 방지
		}
	});
	$('#analyze').swipe({
		click:function() {
			//$('#output').val('Analyzing...');
			ax.ext.ui.showProgress('Analyzing...');
			analyze();
			setTimeout('output_resize()');
			ax.ext.ui.hideProgress();
		},
		swipe:function(){
			//스와이프에는 출력 방지
		}
	});
	$('#option').swipe( {
		swipeUp:function() {
          $('#option').slideUp();  
        },
        threshold:25
      });
	
	$('.input_toggle').click(function(){
		if ($(this).attr('value') == input_type['tel']) {
			$('#input_textarea').attr({'type':'text','placeholder':'모스 부호를 입력하세요. (type: text)'});
			$(this).attr('value',input_type['text']);
		} else {
			$('#input_textarea').attr({'type':'tel','placeholder':'모스 부호를 입력하세요. (type: tel)'});
			$(this).attr('value',input_type['tel']);
		}
	});
	
	$('input[type="text"]').keyup(function(){
		if (event.which == 13) {
			if (currentImg == 0) {
				translate();
			} else if (currentImg == 1) {
				analyze();
			}
		}
	}).keydown(function(event) {
		if (event.which == 13) {
			event.preventDefault();
		}
	});
	

	function option_toggel() {
		$('#option .button:has(input:checked)').css({'background':color['toggle_bg1'],'color':color['toggle_color1'],'border-color':color['toogle_border1']});//initialize
	} option_toggel();
	$('#option input[type=radio],#option input[type=checkbox]').click(function(){//radiobox toggle
		$('#option input[type=radio]:not(:checked), #option input[type=checkbox]:not(:checked)').parent().parent().css({'background':color['toggle_bg0'],'color':color['toggle_color0'],'border-color':color['toogle_border0']});
		option_toggel();
	});
	
	$('#menu_share').click(function(){
		$('.footer_output').slideUp();
		$('#footer_output_share').slideDown();
		//$('footer').css('margin-bottom','0');
		$('footer').mouseleave(function() {
			$('.footer_output').slideUp();
		});
	});
	$('#share_facebook').click(function(){
		window.location = "http://www.facebook.com/sharer/sharer.php?u=http://market.android.com/details?id=com.morsecode.translator.jinh";
	});
	$('#share_google').click(function(){
		window.location = "https://plus.google.com/share?url=http://market.android.com/details?id=com.morsecode.translator.jinh";
	});
	$('#share_kakaotalk').click(function(){
		kakao.link("talk").send({
	        msg : $('#output').val(),
	        url : "market://details?id=com.morsecode.translator.jinh",
	        appid : "com.morsecode.translator.jinh",
	        appver : "2.0",
	        appname : "모스 부호",
	        metainfo : JSON.stringify({metainfo : [ {os:"android", devicetype: "phone",installurl:"market://details?id=com.morsecode.translator.jinh", executeurl : "market://details?id=com.morsecode.translator.jinh"},{os:"ios", devicetype:"pad",installurl:"market://details?id=com.morsecode.translator.jinh",executeurl : "market://details?id=com.morsecode.translator.jinh"}]}),
	        type : "app"
		});
	});
	$('#share_mail').click(function(){
		window.location = "mailto:?subject=[모스 부호] 앱으로 만든 부호를 보냅니다.&body=" + $('#output').val() + " \r\n Play 스토어에서 보기: http://goo.gl/FW2hA";
	});
	$('#share_twitter').click(function(){
		window.location = "https://twitter.com/share?url=http://goo.gl/FW2hA%C2%A0@Bloger_JinH&text=" + $('#output').val();
	});
	
	$('#menu_review').click(function(){
		ax.ext.ui.confirm(function(r){
			if (r==true) {
				ax.ext.ui.open('http://market.android.com/details?id=com.morsecode.translator.jinh');
			}
		}, '별점과 리뷰를 남깁니다.');
	});
	
	$('#menu_setting').click(function(){
		$('.footer_output').slideUp();
		$('#footer_output_setting').slideDown();
		//$('footer').css('margin-bottom','0');
		$('footer').mouseleave(function() {
			$('.footer_output').slideUp();
		});
	});
}

function notice() {
	function notice_img() {//notice_animation
		$('#notice0').fadeIn().animate({top: '+=1em'},500,function(){
			$('#notice1').fadeIn().animate({top: '-=1em'},500,function(){
				$('#notice2').fadeIn(function(){
					$('#notice1').animate({opacity: '0'},250,function(){
						$('#notice2').animate({left: '-150px'},1000,function(){
							$('#notice2').css({left: '170px'}).hide().fadeIn();
							$('#notice1').css({opacity:'1'}).hide().fadeIn(function(){
								$('#notice3').fadeIn().animate({top: '+=1em'},1000,function(){
									$('#notice4').fadeIn();
								});
							});
						});
					});
				});
			});
		});
	}
	setTimeout(notice_img(),5000);
	//notice_img()
	
	if (window.localStorage.getItem('notice154') !== "read") {
		$('#notice').show();
	}
	$('#notice').click(function(){
		if($("#notice_check:checked").val() == 'on') {
			$('#notice').fadeOut();$('#notice_bg').fadeOut();
			window.localStorage.setItem('notice154', 'read');
		}
	});	
	$('#notice').click(function(){
		$(this).fadeOut();
	});
			
	$('footer a').click(function(){
		ax.ext.ui.confirm(function(r){
			if (r==true) {
				ax.ext.ui.open('http://jinh.tistory.com/m');
			}
		}, '블로그로 이동합니다.');
	});
	
	ax.ext.android.setOnOptionsItemSelected(function(s){ //android menu
		if (s === 0) {
		    window.location = "index.html";
		} else if (s === 1) {
	    	window.location = "license.html";
	    } else if (s === 2) {
	    	window.location = "info.html";
	    } else if (s === 3) {
	    	ax.ext.android.finish();
	    };
	});
	ax.ext.android.setOptionsItems(['초기 화면','오픈 소스 라이센스','정보','종료']);
}

var position_top = 0;
$(window).scroll(function() {
	/*if (document.height == null) { // this is for old IE
		pageYOffset = document.documentElement.scrollTop;
	}*/
	if (position_top - pageYOffset < 0) {
		if ($(document).height() - pageYOffset - $(window).height() < 50) {
			$('footer').css('bottom',0);
		} else {
			$('#ad').css('top',-$('#ad').height());
			$('footer').css('bottom',-margin['footer']);
		}
	} else if (position_top - pageYOffset > 0) {
		if (pageYOffset < 25) {
			$('#ad').css('top',0);
			//$('footer').css('bottom',-margin['footer']);
		} else {
			$('#ad').css('top',0);
			$('footer').css('bottom',0);
		}
	}
	position_top = pageYOffset;
	
	if(pageYOffset >= 1000) { //scroll side ad
		$('#sidead').css({'top':$(document).height() - 675});
	} else if(pageYOffset >=1850) {	}
});

$(function() {
	if (location.pathname == "/index.html") {
		output_resize();
		button_swipe();
		button_click();
	}
	notice();
}); 



