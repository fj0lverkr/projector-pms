$(function(){

  // adjust navbar when document is scrolled
  $(document).scroll(
    function(){
      const $nav = $("#main-nav");
      //$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height()  && $(this).scrollTop() < $(document).height() - $(window).height() - 100);
      $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
});
