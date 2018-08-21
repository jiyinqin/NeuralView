$(function(){
  var tag = false,ox = 0,left = 0,bgleft = 0;
  $('.progress_btn').mousedown(function(e) {
    ox = e.pageX - left;
    tag = true;
  });
  $(document).mouseup(function() {
    tag = false;
  });
  $('.progress').mousemove(function(e) {//鼠标移动
    if (tag) {
      left = e.pageX - ox;
      if (left <= 0) {
        left = 0;
      }else if (left > 100) {
        left = 100;
      }
      $('.progress_btn').css('left', left);
      $('.progress_bar').width(left);
      $('.text').html(parseInt((left/300)*300) + '%');
    }
  });
  $('.progress_bg').click(function(e) {//鼠标点击
    if (!tag) {
      bgleft = $('.progress_bg').offset().left;
      left = e.pageX - bgleft;
      if (left <= 0) {
        left = 0;
      }else if (left > 100) {
        left = 100;
      }
      $('.progress_btn').css('left', left);
      $('.progress_bar').animate({width:left},300);
      $('.text').html(parseInt((left/300)*300) + '%');
    }
  });
});
