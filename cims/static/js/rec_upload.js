$('#btnfile').on('click',function(){
    var formdata = $("#fmdoc").serialize();
      $.ajax({
        url: '/records/uploadoc/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            alert(data.success);
            console.log(data.errors);
        },
        error: function(xhr,status, exception) {
          if(xhr.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    });
})