function Player(option){
	this.config = {
		target: "#container",
		ado: "",
		singer: "",
		imgConn: "",
		song: "",
		playRange: "",
		refresh: "",
		playBtn: "",
		currentTime: "",
		totalTime: "",
		loopType: "",
		prev: "",
		next: "",
		volBtn: "",
		volRange: ""
	}
	
	for(var i in option){
		this.config[i] = option[i];
	}
	
	this.isPlay = 0;
	this.isVol = 1;
	
	//循环方式
	this.isloopType = 0; //列表顺序播放
	//this.loopType = 1;  单曲循环
	//this.loopType = 2;  随机播放
	
	this.initDOM();//?
}

Player.prototype = {
	initDOM(){
		var that = this;
		this.container = document.querySelector(this.config.target);
		this.ado = document.querySelector(this.config.ado);
		this.singer = document.querySelector(this.config.singer);
		this.imgConn = document.querySelector(this.config.imgConn);
		this.song = document.querySelector(this.config.song);
		this.playRange = document.querySelector(this.config.playRange);
		this.refresh = document.querySelector(this.config.refresh);
		this.playBtn = document.querySelector(this.config.playBtn);
		this.currentTime = document.querySelector(this.config.currentTime);
		this.totalTime = document.querySelector(this.config.totalTime);
		this.loopType = document.querySelector(this.config.loopType);
		this.prev = document.querySelector(this.config.prev);
		this.next = document.querySelector(this.config.next);
		this.volBtn = document.querySelector(this.config.volBtn);
		this.volRange = document.querySelector(this.config.volRange);
		
		//默认声音的大小
		this.vol = this.ado.volume;
		
		//播放点击，注意this指向
		this.playBtn.onclick = function(){
			that.playOrPauseVdo(that);
		}

		//视频播放监控事件
		this.ado.addEventListener("timeupdate", function(){
			that.nowTime = that.showTime(that.ado.currentTime);
			that.currentTime.innerHTML = that.nowTime;
			that.playRange.value = that.ado.currentTime;
		}, false);
		/*timeupdate 事件在音频/视频（audio/video）的播放位置发生改变时触发。
		该事件可以在以下情况被调用：
		播放音频/视频（audio/video）
		移动音频/视频（audio/video）播放位置
		提示： timeupdate 事件通常与 Audio/Video 对象的 currentTime 属性一起使用，
		该属性返回音频/视频（audio/video）的播放位置（以秒计）。IE8及以前不支持*/
		
		//播放滑块变动
		this.playRange.onchange = function(){
			var val = this.value;
			that.ado.currentTime = val;
			that.isPlay = 0;
			that.playOrPauseVdo(that);
		}
		
		//声音点击
		this.volBtn.onclick = function(){
			that.mutedFn(that); //muted 表示静音
		}
		
		//音量滑块变动
		this.volRange.onchange = function(){
			var val = this.value;
			that.ado.volume = val/10; //注意range范围是0-1
		}
		
		//刷新按钮点击
		this.refresh.onclick = function(){
			that.ado.load();
			that.isPlay = 0;
			that.playOrPauseVdo(that);
		}
		
		var listArr = [
		    ["music/她的睫毛.mp3","她的睫毛"],
			["music/东风破.mp3","东风破"],
			["music/三年二班.mp3","三年二班"],
			["music/晴天 .mp3","晴天"]				
		];
		var index = 0;
		
		//列表信息点击播放
		var list = document.getElementById("list");
		var lis = list.getElementsByTagName("li");
		
		for(var i = 0; i < lis.length; i++){
			lis[i].index = i;
			lis[i].onclick = function(){
				for(var j=0;j<lis.length;j++){
					lis[j].removeAttribute("id", "activeTouch");
				}
				this.setAttribute("id", "activeTouch");
				that.ado.src = listArr[this.index][0];
				index = this.index;
				that.song.innerHTML = listArr[this.index][1];
				that.isPlay = 0;
				that.playOrPauseVdo(that);
				//console.log(that.ado.duration);//写在这时间读不出来必须延迟等到加载完
				var timer = setInterval(function(){
					if(!isNaN(that.ado.duration)){
						clearInterval(timer);
						that.duration = that.showTime(that.ado.duration);
						that.totalTime.innerHTML = that.duration;
						that.playRange.max = that.ado.duration;  //总时长
					}					
				},500)				
			}
		}
		
		//时长
		this.duration = this.showTime(this.ado.duration);
		this.totalTime.innerHTML = this.duration;
		this.playRange.max = this.ado.duration;  //总时长
		
		//循环方式按钮点击
		this.loopType.onclick = function(){
			that.loopFn(that);
		}
		
		//上一曲
		this.prev.onclick = function(){
			index--;
			index %= 4; /*0-3之间的整数*/
			if(index<0){
				index=0;
			}
			console.log(index);
			if(that.isloopType == 0){
				$('li').eq(index).attr("id", "activeTouch").siblings().attr("id","");
				console.log($('li'));
				that.ado.src = listArr[index][0];
				that.song.innerHTML = listArr[index][1];
				
				that.isPlay = 0;
				that.playOrPauseVdo(that);
				//console.log(that.ado.duration);//写在这时间读不出来必须延迟等到加载完
				var timer = setInterval(function(){
					if(!isNaN(that.ado.duration)){
						clearInterval(timer);
						that.duration = that.showTime(that.ado.duration);
						that.totalTime.innerHTML = that.duration;
						that.playRange.max = that.ado.duration;  //总时长
					}					
				},100)	
			}else{
				index = parseInt(Math.random()*4);
				that.ado.src = listArr[index][0];
				that.song.innerHTML = listArr[index][1];
				$('li').eq(index).attr("id", "activeTouch").siblings().attr("id","");
				that.isPlay = 0;
				that.playOrPauseVdo(that);
				//console.log(that.ado.duration);//写在这时间读不出来必须延迟等到加载完
				var timer = setInterval(function(){
					if(!isNaN(that.ado.duration)){
						clearInterval(timer);
						that.duration = that.showTime(that.ado.duration);
						that.totalTime.innerHTML = that.duration;
						that.playRange.max = that.ado.duration;  //总时长
					}					
				},100)
			}
		}
		//下一曲
		this.next.onclick = function(){
			index++;
			index %= 4; /*0-3之间的整数*/
			if(that.isloopType == 0){
				that.ado.src = listArr[index][0];
				that.song.innerHTML = listArr[index][1];
				$('li').eq(index).attr("id", "activeTouch").siblings().attr("id","");
				that.isPlay = 0;
				that.playOrPauseVdo(that);
				//console.log(that.ado.duration);//写在这时间读不出来必须延迟等到加载完
				var timer = setInterval(function(){
					if(!isNaN(that.ado.duration)){
						clearInterval(timer);
						that.duration = that.showTime(that.ado.duration);
						that.totalTime.innerHTML = that.duration;
						that.playRange.max = that.ado.duration;  //总时长
					}					
				},100)	
			}else{
				index = Math.floor(Math.random()*4);
				that.ado.src = listArr[index][0];
				that.song.innerHTML = listArr[index][1];
				$('li').eq(index).attr("id", "activeTouch").siblings().attr("id","");
				that.isPlay = 0;
				that.playOrPauseVdo(that);
				//console.log(that.ado.duration);//写在这时间读不出来必须延迟等到加载完
				var timer = setInterval(function(){
					if(!isNaN(that.ado.duration)){
						clearInterval(timer);
						that.duration = that.showTime(that.ado.duration);
						that.totalTime.innerHTML = that.duration;
						that.playRange.max = that.ado.duration;  //总时长
					}					
				},100)
			}
		}
		
		//自动播放下一首
		this.ado.addEventListener("ended", function(){
			that.next.onclick();
		}, false);
		
	},
	
	
	loopFn(that){
		if(that.isloopType == 0){
			that.isloopType = 1;
			that.loopType.innerHTML = '<i class="iconfont">&#xe62f;</i>';
		}else if(that.isloopType == 1){
			that.isloopType = 2;
			that.loopType.innerHTML = '<i class="iconfont">&#xe680;</i>';			
		}else if(that.isloopType == 2){
			that.isloopType = 0;
			that.loopType.innerHTML = '<i class="iconfont">&#xe683;</i>';
		}
	},
	
	mutedFn(that){
		if(that.isVol == 1){
			that.ado.volume = 0;
			that.volBtn.innerHTML = '<i class="iconfont">&#xe654;</i>';
			that.isVol = 0;
		}else{
			that.ado.volume = that.vol;
			that.volBtn.innerHTML = '<i class="iconfont">&#xe60d;</i>';
			that.isVol = 1;
		}
	},
	
	playOrPauseVdo(that){
		if(that.isPlay == 0){
			that.ado.play();
			that.playBtn.innerHTML = '<i class="iconfont">&#xe610;</i>';
			that.imgConn.style.transitionDuration = "0.3s";
			that.imgConn.style.transform = "rotate(0deg)";
			that.singer.setAttribute("class", "move");
			that.isPlay = 1;
		}else{
			that.ado.pause();
			that.playBtn.innerHTML  = '<i class="iconfont">&#xe651;</i>';
			that.imgConn.style.transitionDuration = "0.3s";
			that.imgConn.style.transform = "rotate(-15deg)";
			that.singer.removeAttribute("class", "move");
			that.isPlay = 0;
		}
	},
	
	showTime(time){
		var h = Math.floor(time / 3600);
		var m = Math.floor((time - h *3600) / 60);
		var s = Math.floor(time - h*3600 - m*60);
		m = m < 10 ? "0" + m : m;
		s = s < 10 ? "0" + s : s;
		var str = "";
		if(h > 0){
			str = h + ":" + m + ":" + s;
		}else{
			str =  m + ":" + s;
		}
		return str;
	}
}
