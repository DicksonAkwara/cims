var labtestb = document.querySelector('#labtestb');
$('#pCardNo').on('keyup',function(){
    var pid = $(this).val();
    var pt='In-Patient';    
    if(pid.trim().length>0){      
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid,ptype:pt }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            $('#psearch').text('Patient not found');
            clearfields();
        }
        else{
          $('#psearch').text('');

          var jdata=data;   
          jdata.forEach(element => {  

            $('#pid').val(element.pid); 
            $('#vsno').val(element.vno); 
            $('#pname').val(element.fname); 
            $('#age').val(element.age); 
            $('#pgender').val(element.gender); 
            $('#pward').val(element.wdname); 
            $('#pymode').val(element.scheme_type+"("+element.scheme_name+")"); 
            $('#ttbill').val(''); 
            $('#ttpaid').val(''); 
            $('#tbalance').val(''); 
            $('#nkname').val(element.nokname); 
            $('#nkid').val(''); 
            $('#nkphone').val(element.nokphone); 
            $('#nkrelation').val(element.nokrel); 
          
          })          
         }
      })
    }
    else{
          clearfields();
            $('#psearch').text(''); 
    }

})


function clearfields(){
  $('#pid').val(''); 
  $('#vsno').val(''); 
  $('#pname').val(''); 
  $('#age').val(''); 
  $('#pgender').val(''); 
  $('#pward').val(''); 
  $('#pymode').val(''); 
  $('#ttbill').val(''); 
  $('#ttpaid').val(''); 
  $('#tbalance').val(''); 
  $('#nkname').val(''); 
  $('#nkid').val(''); 
  $('#nkphone').val(''); 
  $('#nkrelation').prop('selectedIndex',0); 
}

$('#btnaddtest').on('click', function(){
    var pid=$('#pid').val();
    if(pid !==''){
        $('#serviceModal').modal('show');
    }
    else{
        alert('please select patient first')
    }

})

var searchtbody=document.querySelector('#searchtbBody');
$('#search_service').on('keyup',function(){
     var sname = $(this).val(); 
    if(sname.trim().length>0){
      fetch("/pho/search_service/",{
      body:JSON.stringify({ searchText:sname }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.length===0){            
      searchtbody.innerHTML='<tr><td colspan="5">No such service found </td></tr>';                     
  }
  else{           
      searchtbody.innerHTML='';
      var jdata=data;
      
      jdata.forEach(element => {              
        searchtbody.innerHTML+=
        `<tr>                  
                    <td style="display:none;">${element.sid}</td>
                    <td>${element.sname}</td>
                    <td>${element.nrate}</td>
                    <td>${element.srate}</td>
                    <td>${element.spoint}</td>
              </tr>`;                
      });
  }
  })
  }  
  })

  var labtestbBody=document.querySelector('#labtestbBody');

  $('#searchtb tbody').on('click','tr', function(){
    var cost;
    var currentRow=$(this).closest("tr");
    var scode=currentRow.find("td:eq(0)").text(); 
    var sname=currentRow.find("td:eq(1)").text(); 
    var np=currentRow.find("td:eq(2)").text();
    var sp=currentRow.find("td:eq(3)").text();
    var dpt=currentRow.find("td:eq(4)").text();

    const pym=$('#pymode').val();

      if(pym.includes('cash')){
          cost=np;
      }
      else{
          cost=sp;
      }
  // check if service alredy entered in table

      labtestbBody.innerHTML+=
      `<tr>              
          <td style="display:none;">${scode}</td>
          <td>${sname}</td>
          <td contentEditable>1</td>
          <td>${cost}</td>
          <td>${cost}</td>
          <td>${dpt}</td>
          <td><button type='button' class='btn btn-sm btn-danger btnremove'>&times;</button></td>`;
  })

  $('#labtestb tbody').on('click','.btnremove', function(){
    var currentRow=$(this).closest("tr");
    var svs_name=currentRow.find("td:eq(1)").text(); 
    if(confirm(`Discard( ${svs_name} )from Request?`)){     
    $(this).closest('tr').remove();             
  }

  })


$('#btnconfirm').on('click', function(){
    var pid=$('#pid').val();
    var pym=$('#pymode2').val();
    var bill=[];
    var tb=document.querySelector('#labtestb'); 
    var rw_count = tb.tBodies[0].rows.length;
    if(rw_count>0){
      for(var i=1;i<=rw_count;i++){        
        bill.push({
            pno:pid,            
            pym:pym,
            scode:tb.rows[i].cells[0].innerHTML,  //service code
            qnt:tb.rows[i].cells[2].innerHTML,
            ttp:tb.rows[i].cells[4].innerHTML,           
            spoint:tb.rows[i].cells[5].innerHTML,           
        });            
    }
    
    var formdata = JSON.stringify(bill);      
       $.ajax({
        url: "/pho/raisebill/",
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
          alert(data.msg);
          clearfield();
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred.'+exception);
          }
        }
      });
  }
  else{
    alert('no item to bill');
  }

})



$('#tstsearch').on('keyup',function(){
  var pid=$(this).val()
  var fdate=$('#vfdate').val();
  var tdate=$('#vtdate').val(); 
  if(fdate !=="" && tdate !==""){
   fetch("/lab/loadVerFilterRes/",{
      body:JSON.stringify({ fdate:fdate,tdate:tdate }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.length===0){          
      tableVerifiedResBody.innerHTML='<tr><td colspan="6">No request found </td></tr>';                    
    }
    else{
      tableVerifiedResBody.innerHTML='';
      data.forEach(element => {
        tableVerifiedResBody.innerHTML+=
              `<tr> 
                    <td style='display:none';>${element.ex_no}</td>
                    <td>${element.rdate}</td>                  
                    <td>${element.pid}</td>            
                    <td>${element.pname}</td>
                    <td>${element.service}</td>                                                                   
                    <td ><button class='btn btn-sm btn-success btnViewRes'>View</button></td>                                                                   
                    <td ><button class='btn btn-sm btn-danger btnprintAll'>Print All</button></td>                                                                   
                                                                                    
              </tr>` 
       })
    }
  })
  }

})