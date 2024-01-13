$('#pCardNo').on('keyup',function(){

    const pid = $(this).val();  
    if(pid.trim().length>0){     
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            document.querySelector('#pname').value='';
            document.querySelector('#pid').value=''; 
            document.querySelector('#pymode').value=''; 
            document.querySelector('#pymode2').value=''; 
            document.querySelector('#visitno').value=''; 
            document.querySelector('#psearchStt').innerHTML='Patient not found';             
        }
        else{
          var jdata=data;          
          jdata.forEach(element => {                    
          document.querySelector('#pname').value=element.fname;
          document.querySelector('#pid').value=element.pid;          
          document.querySelector('#pymode').value=element.scheme_type+"("+element.scheme_name+")";
          document.querySelector('#pymode2').value=element.scheme_name;
          document.querySelector('#visitno').value=element.vno; 
          document.querySelector('#psearchStt').innerHTML='';
          })          
         }
      })
    }

})

$('#ppaymode').on('change',function(){
    var pm = $(this).val().trim();
    if(pm =='Non-scheme'){
      document.getElementById('pscheme').selectedIndex = 4;      
      $('#mbNumber').prop('disabled', true);
    }
    else if(pm=='Scheme'){  
      document.getElementById('pscheme').selectedIndex = 0;      
      $('#mbNumber').prop('disabled', false);
    }
  })

  $('#pmodeButton').on('click',function(){
    var vno=$('#visitno').val().trim();    
    var pid=$('#pid').val().trim();    
    var pmode=$('#ppaymode').val().trim();
    var scname=$('#pscheme').val().trim();
    var mbnumber=$('#mbNumber').val().trim();
    //pid:2090pmode:Schemescname:nhif civil servantno:676767
    var formdata={
        vno:vno,
        pid:pid,
        pmode:pmode,
        scname:scname,
        no:mbnumber
    }
    
    $.ajax({
        url: '/records/changePaymode/',
        data: JSON.stringify(formdata), 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            alert(data.res)
        },
        error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                alert('Internal Server Error occurred. try again'+exception);
            }
          }
        
      });

  })

