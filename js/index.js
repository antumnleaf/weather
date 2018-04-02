$.getScript("https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js",function(){
    var data=remote_ip_info;
    var city=data.city||"太原";
    
    getWeather(city);
});
function getWeather(city){
	$(".now_cityname").html(city);
	$.ajax({
		url:"http://api.jisuapi.com/weather/query?appkey=e5bac3fcb7146e1b&city="+city,
		dataType:"jsonp",
		success:function(r){
			$(".now_air h2").html(r.result.aqi.quality);
			$(".now_temp span").html(r.result.temp);
			$(".now_weather,.future_weather").html(r.result.weather);
			$(".now_winddirect").html(r.result.winddirect);
			$(".now_windpower").html(r.result.windpower);
			$(".now_notice").html(r.result.index[6].detail);
			$(".today_hightemp").html(r.result.temphigh);
			$(".today_lowtemp").html(r.result.templow);
			$(".today_image").html(`<img src="image/${r.result.img}.png" alt="">`);
			$(".tomrrow_hightemp").html(r.result.daily[1].day.temphigh);
			$(".tomrrow_lowtemp").html(r.result.daily[1].night.templow);
			$(".tomrrow_weather").html(r.result.daily[1].day.weather);
			$(".tomrrow_image").html(`<img src="image/${r.result.daily[1].day.img}.png" alt="">`);
			let hours=r.result.hourly;
			let hourstr="";
			$.each(hours,function(index,val){
				hourstr+=`
				<li>
					<h1 class="hours_time">${val.time}</h1>
					<div class="hours_img">
						<img src="image/${val.img}.png" alt="">
					</div>
					<h2 class="hours_temp">
						<span>${val.temp}</span>°
					</h2>
				</li>`;
			})
			$("#hours").html(hourstr);

			let data=r.result.daily;
			let datastr="";
			$.each(data,function(index,val){
				datastr+=`
				<li>
					<div class="day_date"><span>${val.date.slice(5,7)}/${val.date.slice(8,10)}</span></div>
					<div class="day_weather"><span>${val.day.weather}</span></div>
					<div class="day_img">
						<img src="image/${val.day.img}.png" alt="">
					</div>
					<div class="day_hightemp"><span>${val.day.temphigh}</span></div>
					<div class="day_lowtemp"><span>${val.night.templow}</span></div>
					<div class="day_wind"><span>${val.day.winddirect}</span></div>
					<div class="day_windlevel">
						<span>${val.day.windpower}</span>
					</div>
				</li>`;
			})
			$("#day").html(datastr);
		}
	})
}

$(".now_city").click(function(){
	$("#citys").show();
	var data=[]; //存放所有数据
    var province=[]; //存放所有省的数据
    var city=[]; //存放某个省的所有市
    $.ajax({
        url:"http://api.jisuapi.com/weather/city?appkey=e5bac3fcb7146e1b",
        dataType:"jsonp",
        success:function(r){
        	data=r.result;
        	province=$.grep(data,function(val,index){
	            if(val.parentid==="0"){
	            	return true;
	            }
	        });
	        let prostr="";
	        $.each(province,function(index,val){
	        	prostr+=`
	        	<div class="citys_hot citys_pro">
	        		<p class="province" id="${val.cityid}">${val.city}</p>
	        		<div class="citys_list">
	        		</div>
	        	</div>`;
	        })
	        $(".citys_commonly").html(prostr);

	        $(province).each(function(index,val){
	        	let id=val.cityid;
	        	city=$.grep(data,function(val,index){
	                if(val.parentid===id){
	                    return true;
	                }
	            });
	            let citystr="";
	            $.each(city,function(index,val){
	            	citystr+=`
	            	<div class="citys_name">
	            		<span class="citys_text">${val.city}</span>
					</div>`;
	            })
	            $(".citys_commonly .citys_list").eq(index).html(citystr);
	        })

          	$(".citys_list").on("click",".citys_name,.citys_hot_name",function(){
          		$("#citys").hide();
          		getWeather($(this).find(".citys_text").html());
          	})

          	$(".citys_search").blur(function(){
          		let val=$(".citys_search").val();
          		if(val==""){
          			return;
          		}
          		if(val!=$(".province").html()||val!=$(".citys_text").html()){
          			$(".citys_search").val("");
          			return;
          		}
          		$("#citys").hide();
          		getWeather(val);
          	})
        }
    });
})
$(".btn").click(function(){
	$("#citys").hide();
})
