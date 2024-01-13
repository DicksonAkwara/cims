const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

$('#patno').on('keyup',function(){
    var pid = $(this).val();
    var pt=$('#pat_type').val();
    if(pid.trim().length>0){       
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid,ptype:pt }),
        method: "POST",
        headers: {'X-CSRFToken': csrftoken},
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            $('#psearchStatus').text('patient not found');
            $('#pname').val('');
            $('#patid').val(''); 
            $('#visitno').val(''); 
            $('#pymode').val('');
            $('#pgend').val('');
            $('#page').val('');
            $('#ppmode').val('');
            
           
            
        }
        else{          
           data.forEach((item)=>{
            $('#psearchStatus').text('');
            $('#pname').val(item.fname);
            $('#page').val(item.age);
            $('#pgend').val(item.gender);
            $('#patid').val(item.pid);
            $('#visitno').val(item.vno); 
            $('#pymode').val(item.scheme_type+"("+item.scheme_name+")");
            $('#ppmode').val(item.scheme_name);

        })        
        }
      })
    }
    else{
      document.querySelector('#psearchStatus').innerHTML='';
    }

})



$("#test_search").keyup(function(){ 
    var search = $(this).val();
    var pid = $('#patid').val();
    if(search != "" && pid !==''){    
        fetch("/lab/labSearchService/",{
        body:JSON.stringify({ searchText:search }),
        method: "POST",
        })
        .then((res)=>res.json())
        .then((data)=>{           
            var len = data.length; 
            $("#searchResult").empty(); 
            for( var i = 0; i<len; i++){ 
                var id = data[i]['scode'];  
                var svsname = data[i]['service_name'];              
                $("#searchResult").append("<li class='list-group-item' value='"+id+"'>"+svsname+"</li>"); 
            }
            // binding click event to li 
            $("#searchResult li").bind("click",function(){
                itemdetails(this); 
            }); 
            
        }); 
    }
    else{
        swal('Patient details','please select patient first','info');
        $(this).val('');
    } 
   });


   

   $("#rad_search").keyup(function(){ 
    var search = $(this).val();
    var pid = $('#patid').val();
    if(search != "" && pid !==''){    
        fetch("/rad/radSearchService/",{
        body:JSON.stringify({ searchText:search }),
        method: "POST",
        })
        .then((res)=>res.json())
        .then((data)=>{           
            var len = data.length; 
            $("#searchResult").empty(); 
            for( var i = 0; i<len; i++){ 
                var id = data[i]['scode'];  
                var svsname = data[i]['service_name'];              
                $("#searchResult").append("<li class='list-group-item' value='"+id+"'>"+svsname+"</li>"); 
            }
            // binding click event to li 
            $("#searchResult li").bind("click",function(){
                itemdetails(this); 
            }); 
            
        }); 
    }
    else{
        swal('Patient details','please select patient first','info');
        $(this).val('');
    } 
   });
  
   // Set Text to search box and get details 
  function itemdetails(element){ 
    var value = $(element).text(); 
    var sid = $(element).val(); 
    $("#test_search").val(''); 
    $("#searchResult").empty(); 
    
    // Request Item Details 
    $.ajax({ 
       url: '/lab/labServiceDetails/', 
       type: 'post', 
       data:JSON.stringify({sid:sid}), 
       dataType: 'json', 
       success: function(response){ 
          var len = response.length; 
          //$("#userDetail").empty(); 
          if(len > 0){ 
             var sname = response[0]['sname']; 
             var svid = response[0]['id'];
             var price = response[0]['price'];
             var dpt = response[0]['dpt'];
  
             $('#billtable tbody:last-child').append(`
                <tr>
                  <td style="display:none;">${svid}</td>
                  <td>${sname}</td>
                  <td contenteditable='true'>1</td>>
                  <td>${price}</td>
                  <td>${price}</td>        
                  <td>${dpt}</td>
                  <td><button class="btn btn-danger btn-sm btnRemove">&times</button></td>       
                </tr>
              `); 
  
              //get total bill
              billed_sum();
          } 
       } 
    }); 
  }
  
  function billed_sum(){
    //setTimeout(function() {
      var table = document.querySelector("#billtable"),
      sumVal = 0.0;
      var rw_length=table.rows.length
      if(rw_length>1){
        for (var i = 1; i < rw_length; i++) {
          sumVal +=parseFloat(table.rows[i].cells[4].innerHTML.trim());
        }    
        document.querySelector("#bill_amt").value =sumVal;
       
      }
      else{
        document.querySelector("#bill_amt").value =sumVal
        
      }
    //},1500)
      
    }

    $("#billtable tbody").on('click','.btnRemove',function(){ 
        $(this).closest('tr').remove(); 
        billed_sum();      
      });


$("#btn_lab_confirm").on('click',function(){
    
    var tb = document.getElementById('billtable');
    var rw_count = tb.tBodies[0].rows.length;
    if(rw_count ==0){
        swal('Bill is empty. Add service!!','','info');
    }   
    else{
        if(confirm("Save  bill?")){
        //var pid=$('#cl_patid').val();
        var ptype=$('#pat_type').val();
        var pym=$('#ppmode').val();
        var vno=$('#visitno').val();
        var pid=$('#patid').val();

        
        var bill=[];

        for(var i=1;i<=rw_count;i++){        
            bill.push({
               // wlkno:pid,
                pym:pym,
                vno:vno,
                ptype:ptype,
                pid:pid,
                code:tb.rows[i].cells[0].innerHTML,
                svc:tb.rows[i].cells[1].innerHTML,                
                qnt:tb.rows[i].cells[2].innerHTML,
                cost:tb.rows[i].cells[4].innerHTML,
                dpt:tb.rows[i].cells[5].innerHTML
            });            
        }
       var data_json=JSON.stringify({bill});
       
        $.ajax({
            url: '/lab/save_bill/',
            method:'POST',
            data: data_json,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    swal('Bill Status',data['msg'],'success');
                    $('#billtable tbody tr').remove();
                    clearfield();
                }                
            },
            error: function(jqXHR, exception) {
                if(jqXHR.status === 500) {
                    swal('Internal Server Error occurred','','error');
                }
              }
          });
        } 
    }
    
    //console.log(data_json);
})

function clearfield(){
    $('#psearchStatus').text('');
            $('#pname').val('');
            $('#patid').val(''); 
            $('#visitno').val(''); 
            $('#pymode').val('');
            $('#pgend').val('');
            $('#page').val('');
            $('#ppmode').val('');
            $('#patno').val('');
}