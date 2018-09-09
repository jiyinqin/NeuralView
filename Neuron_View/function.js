hidden_layers=new Array();
var distance;
function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function make_line(){  //在画板添加线
    var div_left=$('svg').offset().left;
    var x1=0,y1=200,x2=640,y2=200;
    var div_top=$('svg').offset().top;
    var num_neuron=1;
    $('svg').empty();
    if(hidden_layers.length>=2){
        for(var i=0;i<hidden_layers.length-1;i++){
            for(var fir=num_neuron;fir<hidden_layers[i]+num_neuron;fir++){
                for(var sec=num_neuron+hidden_layers[i];sec<hidden_layers[i+1]+num_neuron+hidden_layers[i];sec++){
                    var left_1=$('#'+fir).offset().left+40-div_left;
                    var top_1=$('#'+fir).offset().top+20-div_top;
                    var left_2=$('#'+sec).offset().left-div_left;
                    var top_2=$('#'+sec).offset().top+20-div_top;
                    var path=left_1+','+top_1+' '+left_2+','+top_2;
                    var line=makeSVG('polyline',{points:path,stroke:'rgb(56, 103, 214)'});
                    $('svg').append(line);
                }
            }
            num_neuron+=hidden_layers[i];
        }
    }
    if(hidden_layers.length>=1){
        var sum_neuron=get_neuron_num(1);
        for(var i=1;i<=sum_neuron;i++){
            var left=$('#'+i).offset().left-div_left;
            var top=$('#'+i).offset().top-div_top+20;
            var path=x1+','+y1+' '+left+','+top;
            var line=makeSVG('polyline',{points:path,stroke:'rgb(56, 103, 214)'});
            $('svg').append(line);
        }
        sum_neuron=get_neuron_num(hidden_layers.length-1);
        var all_neuron=get_neuron_num(hidden_layers.length);
        for(var i=sum_neuron+1;i<=all_neuron;i++){
            var left=$('#'+i).offset().left-div_left+40;
            var top=$('#'+i).offset().top-div_top+20;
            var path=x2+','+y2+' '+left+','+top;
            var line=makeSVG('polyline',{points:path,stroke:'rgb(56, 103, 214)'});
            $('svg').append(line);
        }
    }
}
function del_neuron(data){
    var layer=find_layer_th(data.id);
    hidden_layers[layer-1]-=1;
    neuron_display();
    make_line();
}
function neuron_display(){ //在画板添加neuron
    $('.display').empty();
    var length=hidden_layers.length;
    for(var i=0;i<length;i++){
        if(hidden_layers[i]==0){
            hidden_layers.splice(i,1)
        }
    }
    length=hidden_layers.length;
    var neuron_id=1;
    var distance_col=(640-40*hidden_layers.length)/(hidden_layers.length+1);
    for(var i=0;i<length;i++){
        var distance_row=(400-40*hidden_layers[i])/(hidden_layers[i]+1);
        var left=(i+1)*distance_col+i*40;
        for(var k=1;k<=hidden_layers[i];k++){
            var neuron='<div class="neuron neuron_1 temp neuron_2" style="position:absolute;" ' +
                'onclick="del_neuron(this)""></div>';
            var top=k*distance_row+(k-1)*40;
            $('.display').append(neuron);
            $('.temp').attr('id',neuron_id);
            neuron_id++;
            $('.temp').css({'left':left,'top':top});
            $('.temp').removeClass('temp');
        }
    }
}
function get_neuron_num(i){
    if(i>hidden_layers.length){
        return false;
    }
    var sum_neuron=0;
    for(var k=0;k<i;k++){
        sum_neuron+=hidden_layers[k];
    }
    return sum_neuron;
}
function id_sort(i){  //通过拖拽添加的神经元在第i层
    if(i<hidden_layers.length){
        var sum_neuron=get_neuron_num(i)+1;
        var all_neuron=get_neuron_num(hidden_layers.length-1)+hidden_layers[hidden_layers.length-1];
        for(var k=all_neuron;k>=sum_neuron;k--){
            $('#'+k).attr("id",k+1);
        }
    }
}
function find_layer_th(i){   //neuron的id为i
    for(var k=1;k<=hidden_layers.length;k++){
        if(i-hidden_layers[k-1]>0){
            i-=hidden_layers[k-1]
        }else{
            return k;            //k为第几层
        }
    }
}

$(function(){
    $('#slider').slider({
        range:"min",
        min:0,
        max:100,
        step:10,
        slide:function(event,ui){
            $('#dropout').html('当前dropout值为:'+ui.value+'%')
        }
    });
});
$(function () { $("[data-toggle='tooltip']").tooltip(); });
$(document).on('mousedown','.move',function(event){
    var divPageL=$('.neuron-network').offset().left;
    var divPageT=$('.neuron-network').offset().top;
    var divPageR=divPageL+640;
    var divPageB=divPageT+400;
    if(hidden_layers.length!==0){
        var _this=$(event.currentTarget);
        oldPageX=event.pageX;
        oldPageY=event.pageY;
        cloneHtml=$('<div class="neuron neuron_1" style="position: absolute;"></div>');
        cloneHtml.html("");
        cloneHtml.addClass('neuron-hover');
        var oldoffset=$(_this).offset();
        $(document.body).append(cloneHtml);
        cloneHtml.css({
            position:'absolute',
            left:oldoffset.left,
            top:oldoffset.top
        });
        $(document).mousemove(function(e){
            var currPageX = e.pageX;
            var currPageY = e.pageY;
            var movePageX = currPageX - oldPageX;
            var movePageY = currPageY - oldPageY;
            cloneHtml.css({
                position: 'absolute',
                left: oldoffset.left + movePageX,
                top: oldoffset.top + movePageY,
            });
        });
        $(document).mouseup(function () {
            var left=cloneHtml.offset().left;
            var top=cloneHtml.offset().top;
            cloneHtml.css({
                left: left-divPageL,
                top: top-divPageT,
            });
            var center_left=cloneHtml.offset().left+20;
            cloneHtml.removeClass('neuron-hover move');
            cloneHtml.addClass('neuron_1');
            var remain=left>=divPageL&&left<=divPageR-40&&top>=divPageT&&top<=divPageB-40;
            if(remain){
                $('svg').before(cloneHtml);
                var sum_neuron=1;
                var near_dis=999;
                var near_loc;
                for(var i=0;i<hidden_layers.length;i++){
                    var e_center=$('#'+sum_neuron).offset().left+20-divPageL;
                    var dis=Math.abs(e_center-center_left);
                    if(near_dis>=dis){
                        near_dis=dis;
                        near_loc=i+1;
                    }
                    sum_neuron+=hidden_layers[i];
                }
                if(hidden_layers[near_loc-1]<7){
                    sum_neuron=get_neuron_num(near_loc-1)+1;
                    id_sort(near_loc);
                    sum_neuron+=hidden_layers[near_loc-1];
                    hidden_layers[near_loc-1]+=1;
                    cloneHtml.remove();
                    neuron_display();
                    make_line();

                }else{
                    alert('该层神经元数已达到最大值！');
                    cloneHtml.remove();
                }
            }
            else{
                cloneHtml.remove();
            }
            $(document).off('mouseup');
            $(document).off('mousemove');
        });
    }
    else{
        alert('隐藏层数为0,请先添加隐藏层！');
    }
});
$(document).ready(function(){
    $('#add_layers').click(function(){
        if(hidden_layers.length<=5) {
            hidden_layers.push(2);
            neuron_display();
            make_line();
        }
        else
            alert('已达到最大隐藏层数！');
    });
    $('#del_layers').click(function(){
        if(hidden_layers.length>0){
            hidden_layers.pop();
            neuron_display();
            make_line();
        }
        else
            alert('隐藏层数已为0，不能再减！');
    });
});



