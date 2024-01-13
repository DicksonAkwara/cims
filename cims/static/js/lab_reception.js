const pcardNo =  document.querySelector('#pCardNo');

const btnTestUnavail =  document.querySelector('.btntestOs');
const nav_btn_refresh =  document.querySelector('.nav_btn_refresh');
const BtnUnVerResult =  document.querySelector('.BtnUnVerResult');
const btnRefUnList =  document.querySelector('.btnRefUnList');
const rsearch=  document.querySelector('#rsearchrequest');
const txtFilterVerRes=  document.querySelector('#txtFilterVerRes');
//const btnResultsView=  document.querySelector('.btnResultsView');
const processType=document.querySelector('.processType');
const btnVerifyRes=document.querySelector('.btnVerifyRes');
const btnEditRes=document.querySelector('.btnEditRes');
const btnRequestEdit=document.querySelector('.btnRequestEdit');
const BtnVerifiedResult=document.querySelector('.BtnVerifiedResult');


//const btn_save_notes=  document.querySelector('#btn_save_notes');
const saveResults=  document.querySelector('.btnSaveTestResults');

const requestTableBody = document.querySelector('.requestTableBody'); 
const filterTableBody = document.querySelector('.filterTableBody'); 
const tbltestreqbody = document.querySelector('.tbltestreqbody'); 
const testParatablebody = document.querySelector('.testParatablebody'); 
const testParatableResbody = document.querySelector('.testParatableResbody'); 
const filterTableResBody = document.querySelector('.filterTableResBody'); 
const tableVerifyBody = document.querySelector('.tableVerifyBody'); 
const tableVerifiedResBody = document.querySelector('.tableVerifiedResBody'); 
const tableVerifiedBody = document.querySelector('.tableVerifiedBody'); 
const testSearchTabBody2 = document.querySelector('.testSearchTabBody2'); 
const testSearchTabBody = document.querySelector('.testSearchTabBody'); 
const testSearchTab = document.querySelector('.testSearchTab'); 
const pcardTableBody = document.querySelector('.pcardTableBody'); 


const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


$('#pat_type').on('click', function(){
  retrieve_request();
})



function retrieve_request(){
   var ptype=$('#pat_type').val();
    $.ajax({
      url: '/lab/retrieve_request/',
      data: JSON.stringify({ ptype:ptype }), 
      method:'POST',       
      dataType: 'json',
      headers: {'X-CSRFToken': csrftoken},
      success: function (data) {
        if(data.length===0){
            
            requestTableBody.innerHTML='<tr><td colspan="9">No request found </td></tr>';                    
        }
        else{           
            requestTableBody.innerHTML='';
            var jdata=data;            
            jdata.forEach(element => {              
              requestTableBody.innerHTML+=
              `<tr> 
                    <td>${element.urgency}</td>
                    <td>${element.date}</td>            
                    <td>${element.pno}</td>            
                    <td>${element.pname}</td> 
                    <td>${element.age}</td> 
                    <td>${element.gend}</td> 
                    <td>${element.pymode}</td> 
                    <td>${element.pstatus}</td>                    
                    <td>${element.staff}</td>        
                    <td style='display:none'>${element.vno}</td>        
              </tr>`             
            });

            $('.requestTable td:contains("Critical")').parent('tr').css('background-color', 'red');           
        }
      }
    });
  
  }

var pendtestBody=document.querySelector('#pendtestBody');


function retrieveptrequest(pid,pstatus){
   
    $.ajax({
      url: '/lab/patientrequest/',
      data: JSON.stringify({ pid:pid }), 
      method:'POST',       
      dataType: 'json', 
      headers: {'X-CSRFToken': csrftoken},     
      success: function (data) {
        if(data.length===0){
            
            pendtestBody.innerHTML='<tr><td colspan="6">No request found </td></tr>';                     
        }
        else{           
            pendtestBody.innerHTML='';
            var jdata=data;          
            jdata.forEach(element => {              
              pendtestBody.innerHTML+=
              `<tr'>
                    <td style="display:none;">${element.reff_no}</td>
                    <td>${element.svs_name}</td>
                    <td>${element.qnt}</td>
                    <td>${element.total/element.qnt}</td>
                    <td>${element.total}</td>
                    <td>${element.py_status}</td>
                    <td style="display:none;">${element.test_no}</td>                                       
                    <td><button class="btn btn-sm btn-danger btn_unavail">OS</button></td> 
                    <td><button class="btn btn-sm btn-success btn_proceed">Receive</button></td>                                 
              </tr>`             
            });   

            $('#pendtest').modal('show');

            if(pstatus=='pending' || pstatus=='billed'){
              $('#raisebilldiv').show();
              disablebutton();
              
            }
            else if(pstatus=='paid'){
              $('#raisebilldiv').hide();
            }
           
        }
      }
    });
  
  }

function disablebutton(){
  $('#pendtestable tr').each(function() { 
    $(this).find('.btn_proceed').each(function() {       
      $(this).prop('disabled', true);
    }); 
  }); 
}
  $("#requestTable").on('click','tr',function(){
    // get the current row
    var currentRow=$(this).closest("tr"); 
    var pid =currentRow.find("td:eq(2)").text();
    var pname =currentRow.find("td:eq(3)").text();
    var age =currentRow.find("td:eq(4)").text();
    var gend =currentRow.find("td:eq(5)").text();
    var pmode =currentRow.find("td:eq(6)").text();    
    var pstatus=currentRow.find("td:eq(7)").text();
    var vno =currentRow.find("td:eq(9)").text();   
    
    //if(pstatus=='pending' && pmode=='cash'){    
    if(pstatus=='pending' || pstatus=='paid'){
      $('#pid').val(pid); 
      $('#ptname').val(pname); 
      $('#ptage').val(age); 
      $('#ptgend').val(gend); 
      $('#ptpmode').val(pmode); 
      $('#visitNo').val(vno); 
      
      //open modal to send payment request 
      retrieveptrequest(pid,pstatus);     
    }
    else if(pstatus=='billed'){  
      swal({
        title: "Bill already raised",
        text: "Would you like to view billed items?",
        icon: "info",
        buttons: [
          'No, cancel it!',
          'Yes,Show'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
           retrieveptrequest(pid,pstatus)
        } else {          
        }
      })  
    }    
  });



$('.btnraisebill').on('click', function(){
    var bill=[];
    var tb = document.querySelector('#pendtestable');   
   
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){      
      var rfno=tb.rows[i].cells[0].innerHTML;
        bill.push({           
            rfno:rfno                      
        });          
      }
      var bdata=JSON.stringify(bill);
      $.ajax({
        url: '/rad/cash_bill_service/',
        data: bdata, 
        method:'POST',       
        dataType: 'json',
        headers: {'X-CSRFToken': csrftoken},
        success: function (data) {
          swal('',data.res,'success');
          clearraisebillmodal();
          retrieve_request();

        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
            swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
          }
        }
      })

})

function clearraisebillmodal(){
  $('#pid').val(''); 
  $('#ptname').val(''); 
  $('#ptage').val(''); 
  $('#ptgend').val(''); 
  $('#ptpmode').val(''); 
  $('#visitNo').val('');   
  pendtestBody.innerHTML='';
  $('#pendtest').modal('hide');

}

$("#pendtestable tbody").on('click','.btn_proceed',function(){
  // get the current row
  var currentRow=$(this).closest("tr");
  var reff_no=currentRow.find("td:eq(0)").text();
  var testid=currentRow.find("td:eq(6)").text();
  var pid=$('#pid').val();
  var vno=$('#visitNo').val();

  $.ajax({
      url: '/lab/paidBillService/',
      data: JSON.stringify({reff_no:reff_no,test_id:testid,pid:pid,vno:vno}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
          if (data.res) {            
            swal(data.res,'Sample ID:'+data.sid,'success');
            currentRow.remove(); 
            checklastrequest();           
           }
          },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
          swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
        }
      }
    }) 
  
});

function checklastrequest(){
  var tb = document.getElementById('requestTable');
  var rw_count = tb.tBodies[0].rows.length;
  if(rw_count ==0){
    $('#pendtest').modal('hide');
  }
}

$("#pendtestable tbody").on('click','.btn_unavail',function(){
 
  // get the current row
  var currentRow=$(this).closest("tr"); 

  var reff_no=currentRow.find("td:eq(0)").text();
  var sname=currentRow.find("td:eq(1)").text();
  
   var msg ='Record ['+sname+'] test as unavailable at the moment?';   
   $('#unavailModal').find('#modalTitle').html(msg).show;
    document.querySelector('#req_ref').value=reff_no;    
    $('#unavailModal').modal('show');
  
});
 

btnTestUnavail.addEventListener('click',(e)=>{
  var rf=document.querySelector('#req_ref').value;
  var rs =document.querySelector('#miss_reason').value
  
  if(rs !=='none'){
    var formdata={
      reff_no:rf,
      rs:rs
    }
   
    $.ajax({
      url: '/lab/labTestMiss/',
      data: JSON.stringify(formdata), 
      method:'POST', 
      headers: {'X-CSRFToken': csrftoken},      
      dataType: 'json',
      success: function (data) {
          if (data.res) {
            swal(data.res,'','success');
            $('#miss_reason').prop('selectedIndex',0);
            $('#unavailModal').modal('hide');
            //$('#diagOutputSvs tbody tr').remove();
           }
          }
    })
  }
  else{
    swal('Sorry!! select reason first','','error');
  }
});

nav_btn_refresh.addEventListener('click',(e)=>{
  refresh_list();
});

$('.btnResEntryList').on('click',function(){
  var fdate=$('#rsfdate').val();
  var tdate=$('#rstdate').val(); 

  if(fdate !=="" && tdate !==""){
    fetch("/lab/labRefreshResList/",{
      body:JSON.stringify({ fdate:fdate,tdate:tdate }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.length===0){
          
      filterTableBody.innerHTML='<tr><td colspan="3">No request found </td></tr>';                     
  }
  else{           
    filterTableBody.innerHTML='';
      var jdata=data;            
      jdata.forEach(element => {              
        filterTableBody.innerHTML+=
            `<tr>                  
                  <td>${element.pid}</td>            
                  <td>${element.pname}</td>                  
                  <td>${element.rdate}</td>   
                  <td><button class="btn btn-sm btn-success btnResults">Enter Results</button></td>                                              
            </tr>`        
      });

     //color_code();
  }
  })
}

})

function refresh_list(){
  $.ajax({
    url: '/lab/labRefreshList/',     
    method:'POST',    
    success: function (data) {
      if(data.length===0){          
          //filterTableBody.innerHTML='<tr><td colspan="5">No examinations found </td></tr>'; 
      }
      else{           
          filterTableBody.innerHTML='';
          var jdata=data;
          
          jdata.forEach(element => {              
            filterTableBody.innerHTML+=
            `<tr>                  
                  <td>${element.pid}</td>            
                  <td>${element.pname}</td>                  
                  <td>${element.rdate}</td>   
                  <td><button class="btn btn-sm btn-success btnResults">Enter Results</button></td>                                              
            </tr>`         
          });         

         //color_code();
      }
    }
  });
}


/*BtnUnVerResult.addEventListener('click',(e)=>{
  refresh_unverified_list();
});*/

function refresh_unverified_list(){
  $.ajax({
    url: '/lab/labUnverifiedList/',     
    method:'POST',    
    success: function (data) {
      if(data.length===0){          
          filterTableResBody.innerHTML='<tr><td colspan="5">No results found </td></tr>'; 
      }
      else{           
          filterTableResBody.innerHTML='';
          var jdata=data;          
          jdata.forEach(element => {              
            filterTableResBody.innerHTML+=
            `<tr> 
                  <td style='display:none';>${element.ex_no}</td>
                  <td>${element.rdate}</td>                  
                  <td>${element.pid}</td>            
                  <td>${element.pname}</td>
                  <td>${element.service}</td>                                                                   
                  <td>${element.doneby}</td>                                                                   
            </tr>` 
                    
          });         

         //color_code();
      }
    }
  });
}
/*btnRefUnList.addEventListener('click',(e)=>{
  refresh_unverified_list();
});*/
// click table eto load results to be verified
$('#filterTableRes').on('click','tr',function(){
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-primary').siblings().removeClass('bg-primary'); 
  var resNo=currentRow.find("td:eq(0)").text();
  var pname=currentRow.find("td:eq(3)").text();
  var svs=currentRow.find("td:eq(4)").text();

  var doneby=currentRow.find("td:eq(5)").text();
  var currentusername=$('#username').val();
  if(currentusername !==doneby || currentusername=='admin' ){
    document.querySelector('#rstNumber').value=resNo //setting the result no
    if(resNo.trim().length>0){   
      fetch("/lab/SearchUnverifiedResult/",{
      body:JSON.stringify({searchText:resNo}),
      method: "POST",
    })
    .then((res)=>res.json()) 
    .then((data)=>{
      var pfby,rcdate,rctime,rsdate,rstime;
      tableVerifyBody.innerHTML='';  
      data.forEach(element => {
        pfby=element.performed_by;     
        rcdate=element.receive_date;
        rctime=element.receive_time;
        rsdate=element.results_date;
        rstime=element.results_time;
  
        resV=element.result_value;
        resV.forEach(para => {
          tableVerifyBody.innerHTML+=
          `<tr>                  
                <td >${para.name}</td>            
                <td >${para.res}</td>                                                                    
          </tr>`
        })           
         
  
      });
      document.querySelector('#testDetails').innerHTML='Patient Name: '+pname+' (Test: '+svs+')';    
      document.querySelector('#otherDetails').innerHTML='Performed By: ['+pfby+'] Received['+rcdate+'@'+rctime+'].Posted on ['+rsdate+'@'+rstime+'. ]';    
      $('#verifyModal').modal('show');
        
    })
    }
  }
  else{
    swal('Control Information!!','You are not allowed to verify your own work','info');
  }

})



$("#filterTable").on('click','.btnResults',function(){
  // get the current row
  var currentRow=$(this).closest("tr"); 

  var pid=currentRow.find("td:eq(0)").text();
  var pname=currentRow.find("td:eq(1)").text();  
  
  if(pid.trim().length>0){   
    fetch("/lab/labEnterResult/",{
    body:JSON.stringify({ searchText:pid }),
    method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    tbltestreqbody.innerHTML='';  
    data.forEach(element => {              
      tbltestreqbody.innerHTML+=
      `<tr>                  
            <td style='display:none';>${element.ex_no}</td>            
            <td style='display:none';>${element.service_code}</td>                  
            <td>${element.service_name}</td>                                                         
      </tr>`  

    });
    document.querySelector('#modalResTitle').innerHTML='Patient Name: '+pname;    
    $('#testResultModal').modal('show');
      
  })
  
  }    
   
});

$(".tbltestreq").on('click','tr',function(){
 
  // get the current row
  var currentRow=$(this).closest("tr");  
  currentRow.addClass('bg-primary').siblings().removeClass('bg-primary'); 

  var res_no=currentRow.find("td:eq(0)").text();//sample id
  var scode=currentRow.find("td:eq(1)").text(); //service id

  document.querySelector('#txtTextNo').value=res_no; 

  if(scode.trim().length>0){
    
    fetch("/lab/loadTestParams/",{
    body:JSON.stringify({ searchText:scode,sampId:res_no }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  if(data.length===0){
          
    testParatablebody.innerHTML='<tr><td colspan="5">No parameters found </td></tr>';                     
}
else{    
    
    var jdata=data;
    var message =''; 
    
    jdata.forEach(item=>{
      message=item.msg;
    })

    if(message=='' || message==undefined || message==null){
      testParatablebody.innerHTML='';

      jdata.forEach(element => { 
        var paramType=element.prType; 
        $('#divTestParam').show() ;  
        $('#divTestRes').hide() ;  
        //$('#testParatable tr:first').show(); --hiding the first column
        if(paramType=='options'){        
          var opt=element.posResult;
          //var rs=opt.split('/');           
          testParatablebody.innerHTML+=
          `<tr>                  
              <td style='display:none';>${element.prId}</td>            
              <td>${element.prName}</td>              
              <td colspan='2'>
              <select class="form-control form-control-sm" id="prValue">`+opt.split('/').map(part => "<option value="+part+">"+part+"</option>");`</select>
              '</td>'                                     
              </tr>`     
        }        
        else if(paramType=='values'){
          testParatablebody.innerHTML+=
          `<tr>                  
              <td style='display:none';>${element.prId}</td>            
              <td>${element.prName}</td>
              <td><textarea rows="1" cols="3" class='prValue text-center' id="prValue"></textarea></td>             
              <td>${element.prUnits}</td>           
              <td>${element.lLimit}<-->${element.uLimit}</td>                              
              </tr>`
        }
                        
      });
      $('.btnSaveTestResults').attr('disabled',false);
    }
    else{
     

      $('#divTestParam').hide() ;  
      $('#divTestRes').show() ;
      
      testParatableResbody.innerHTML='';
      document.getElementById('testResHeader').innerHTML=message+ '.Would you like to Edit?'
     
         jdata.forEach(item=>{
            var rst=item.result;
            rst.forEach(item2=>{
              var rsv=item2.result_value;
              rsv.forEach(item3=>{
                testParatableResbody.innerHTML+=
                  `<tr>           
                    <td>${item3.name}</td>
                    <td>${item3.res}</td>
                  </tr>`
                //console.log(item3.name+'--'+item3.res);
              })
            })       
          })
          $('.btnSaveTestResults').attr('disabled',true);
      
    }
  

   //color_code();
}
})
} 
});

saveResults.addEventListener('click',(e)=>{
  var txtResult=[];
    var tb = document.getElementById('testParatable');
    var txtTextNo=document.querySelector("#txtTextNo").value;
    var txtCom=document.querySelector("#testComment").value;

    txtResult.push({
      testId:txtTextNo
    })
    txtResult.push({
      comment:txtCom
    })
    
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){
      //var prCode=tb.rows[i].cells[0].innerHTML; 
      var prName=tb.rows[i].cells[1].innerHTML; 
      var prRes=tb.rows[i].cells[2].children[0].value 
        txtResult.push({           
            name:prName,
            res:prRes                       
        });          
      }
       
      //console.log(JSON.stringify(txtResult));
      $.ajax({
        url:'/lab/labSaveResults/',
        method: 'POST',
        data:JSON.stringify(txtResult),
        dataType:'json',
        success:function(data){
          if(data){
            swal(data.res,'','success');
            $('#testParatable tbody tr').remove();
          }
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              swal('Internal Server Error occurred.'+exception,'','error');
          }
        }
      })
   
      
});



/*rsearch.addEventListener('keyup',(e)=>{
  pid = e.target.value; 
  if(pid.trim().length>0){
    //console.log(pid);
    //tableOutput.innerHTML=''; //for table refresh
    fetch("/rad/refresh_list_pat/",{
    body:JSON.stringify({ searchText:pid }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  if(data.length===0){
          
    filterTableBody.innerHTML='<tr><td colspan="5">No request found </td></tr>';                     
}
else{           
    filterTableBody.innerHTML='';
    var jdata=data;
    
    jdata.forEach(element => {              
      filterTableBody.innerHTML+=
      `<tr>                  
                  <td style="display:none;">${element.ex_no}</td>
                  <td>${element.pid}</td>            
                  <td>${element.pname}</td>
                  <td>${element.service}</td>
                  <td>${element.status}</td>
                  <td>${element.rdate}</td>          
                               
            </tr>`                 
    });

   //color_code();
}
})
}  
});*/

processType.addEventListener('change',(e)=>{
  e.preventDefault();
  
  var action =e.target.value;
  if(action=='verify'){
    $('.btnVerifyRes').attr('disabled',false);
    $('.btnEditRes').attr('disabled',true);
    refresh_unverified_list();
  }
  else if(action=='edit'){
    $('.btnVerifyRes').attr('disabled',true);
    $('.btnEditRes').attr('disabled',false);
    loadEditResult();
  }
})
function loadEditResult(){
  $.ajax({
    url: '/lab/loadEditResult/',     
    method:'POST',    
    success: function (data) {
      if(data.length===0){          
          filterTableResBody.innerHTML='<tr><td colspan="5">No request found </td></tr>'; 
      }
      else{           
          filterTableResBody.innerHTML='';
          var jdata=data;          
          jdata.forEach(element => {              
            filterTableResBody.innerHTML+=
            `<tr> 
                  <td style='display:none';>${element.ex_no}</td>
                  <td>${element.rdate}</td>                  
                  <td>${element.pid}</td>            
                  <td>${element.pname}</td>
                  <td>${element.service}</td>                                                                   
                  <td style='display:none'>${element.reason}</td>                                                                   
            </tr>` 
                    
          });         

         //color_code();
      }
    }
  });

}


btnVerifyRes.addEventListener('click',(e)=>{
 
    var testid=document.querySelector("#rstNumber").value;      
      //console.log(JSON.stringify(txtResult));
      $.ajax({
        url:'/lab/labVerifyResults/',
        method: 'POST',
        data:JSON.stringify({testid:testid}),
        dataType:'json',
        success:function(data){
          if(data){
            swal(data.res,'','success');
            $('#verifyModal').modal('hide');
            refresh_unverified_list();
          }
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              swal('Internal Server Error occurred.','','error');
          }
        }
      })      
});

btnEditRes.addEventListener('click',(e)=>{
 
  var testid=document.querySelector("#rstNumber").value;      
    //console.log(JSON.stringify(txtResult));

    $.ajax({
      url:'/lab/labAuthorizeEdit/',
      method: 'POST',
      data:JSON.stringify({testid:testid}),
      dataType:'json',
      success:function(data){
        if(data){
          swal(data.res,'','info')
          $('#verifyModal').modal('hide');
          loadEditResult();
        }
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Internal Server Error occurred.','','error');
        }
      }
    })      
});


btnRequestEdit.addEventListener('click',(e)=>{ 
  
  var testid=document.querySelector("#txtTextNo").value;      
  var reason=document.querySelector("#testEditComment").value;      
  //console.log(JSON.stringify(txtResult));
  if(reason !==''){
    $.ajax({
      url:'/lab/labrequestEdit/',
      method: 'POST',
      data:JSON.stringify({testid:testid,reason:reason}),
      dataType:'json',
      success:function(data){
        if(data){
          swal(data.res,'','info');
          $('#testResultModal').modal('hide');
          
        }
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Internal Server Error occurred','','error');
        }
      }
    })
  }
  else{
    swal('Please give a reason to edit!!','','info');
  }
 
});

BtnVerifiedResult.addEventListener('click',(e)=>{
  $.ajax({
    url: '/lab/loadVerifiedResult/',     
    method:'POST',    
    success: function (data) {
      if(data.length===0){          
          tableVerifiedResBody.innerHTML='<tr><td colspan="6">No verified results found </td></tr>'; 
      }
      else{           
          tableVerifiedResBody.innerHTML='';
          var jdata=data;          
          jdata.forEach(element => {              
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
                    
          });         

         //color_code();
      }
    }
  });
})

$('#tableVerifiedRes').on('click','.btnViewRes',function(){
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-info').siblings().removeClass('bg-info'); 
  var resNo=currentRow.find("td:eq(0)").text();
  var pname=currentRow.find("td:eq(3)").text();
  var svs=currentRow.find("td:eq(4)").text();

  if(resNo.trim().length>0){   
    fetch("/lab/labSearchResult/",{
    body:JSON.stringify({ searchText:resNo }),
    method: "POST",
  })
  .then((res)=>res.json()) 
  .then((data)=>{
    
    tableVerifiedBody.innerHTML='';  
    data.forEach(element => {
      resV=element.result_value;
      recDate=element.receive_date;
      recTime=element.receive_time;
      resDate=element.results_date;
      restime=element.results_time;
      perfby=element.performed_by;
      verby=element.confirmed_by;
      comment=element.testComment;

      tableVerifiedBody.innerHTML+=
        `<tr>                  
              <td><b>Sample Receive Date:</b> ${recDate}</td>            
              <td><b>Sample Receive Time:</b> ${recTime}</td>                                                                           
        </tr>
        <tr>                  
            <td><b>Parameter</b> </td>            
            <td><b>Result</b> </td>                                                                           
         </tr>`;


      resV.forEach(para => {
        tableVerifiedBody.innerHTML+=
        `<tr>                  
              <td >${para.name}</td>            
              <td >${para.res}</td>                                                                    
        </tr>` 
      });

      tableVerifiedBody.innerHTML+=
        `
        <tr>                  
              <td colspan='2'><b>Test Comment:</b> ${comment}</td>            
                                                                                        
        </tr>
        <tr>                  
              <td><b>Result Date:</b> ${resDate}</td>            
              <td><b>Result Time:</b> ${restime}</td>                                                                           
        </tr>
        <tr>                  
            <td><b>Performed By:</b> ${perfby}</td>            
            <td><b>Confirmed By:</b> ${verby}</td>                                                                           
        </tr>`;

    });
    document.querySelector('#testVerDetails').innerHTML='Name: '+pname+' (Test: '+svs+')';    
    $('#verifiedModal').modal('show');      
  }) 
  }
})

$("#txtFilterVerRes").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#tableVerifiedRes tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});



$('#btnFilterVerRes').on('click',function(){
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






$("#searchPatResult").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#filterTableRes tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$("#rsearchrequest").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#filterTable tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});


$("#raisebill").on('click',function(){
  $('#billModal').modal('show');
})



$("#labpatsearch").on('keyup',function(){
  var tname=$(this).val();
  
  if(tname.trim().length>0){
    //console.log(pid);
    testSearchTabBody.innerHTML=''; //for table refresh
    fetch("/lab/labSearchService/",{
    body:JSON.stringify({ searchText:tname }),
    method: "POST",
})
.then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
        testSearchTabBody.innerHTML='<tr><td colspan="4">No such service found </td></tr>';                     
      }
      else{
        
        data.forEach((item)=>{
          testSearchTabBody.innerHTML+=
            `<tr>              
            <td>${item.service_name}</td>
            <td style='display:none';>${item.normal_rate}</td>
            <td style='display:none';>${item.scheme_rate}</td>           
            <td style="display:none;">${item.scode}</td>
            <td  style="display:none;">${item.service_point}</td>
            </tr>`
        });
      }
    })
  }
})

$('.testSearchTab').on('click','tr',function(){
  var paymode =$('#pymode2').val().trim()
  var price='';
 
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-info').siblings().removeClass('bg-info'); 
  var scode=currentRow.find("td:eq(3)").text();
  var sname=currentRow.find("td:eq(0)").text();
  var nprice=currentRow.find("td:eq(1)").text();
  var sprice=currentRow.find("td:eq(2)").text();
  var spoint=currentRow.find("td:eq(4)").text();

  if (paymode=='cash'){
    price=nprice;
  }
  else{
    price=sprice;
  }

  testSearchTabBody2.innerHTML+=
  `<tr>                  
        <td style='display:none';>${scode}</td>            
        <td >${sname}</td>                                                                    
        <td >${price}</td>                                                                    
        <td >${spoint}</td>                                                                    
        <td ><button class='btn btn-sm btn-info btnRemTest'>remove</button></td>                                                                    
  </tr>`;  
})

$('#btnconfirmReq').on('click',function(){
 
  const pid=$('#last_visit').val();
  const pym=$('#pymode2').val();
  var pystatus='';

  if(pym=='cash'){
    pystatus='pending';
  }
  else{
    pystatus='paid';
  }
  var bill=[]; 
    
    var tb = document.getElementById('testSearchTab2');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,            
            pyst:pystatus,
            btype:'direct bill',
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            cost:tb.rows[i].cells[2].innerHTML,
            dpt:tb.rows[i].cells[3].innerHTML
        });            
    }
    var data_json=JSON.stringify({bill});
    //console.log(data_json); 
      $.ajax({
          url: '/lab/saveDirectBill/',
          method:'POST',
          data: data_json,
          dataType: 'json',
          success: function (data) {
              if (data) {
                  swal(data.msg,'','success');
                  retrieve_request(pid); 
                  $('#billModal').modal('hide');
                  $('#testSearchTab tbody tr').remove();
                  $('#testSearchTab2 tbody tr').remove();

              }
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500) {
                swal('Internal Server Error occurred','','error');
              }
            }

       })  
})

$("#testSearchTab2").on('click', '.btnRemTest', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})

$('#pcardBtn').on('click',function(){
  const pid=$('#last_visit').val();
 
  if(pid==''){
    alert('select patient first');
  }
  else{
    if(pid.trim().length>0){
     
      fetch("/lab/labPatientCard/",{
      body:JSON.stringify({ searchText:pid }),
      method: "POST",
  })
  .then((res)=>res.json())
    .then((data)=>{        
        if(data.length===0){
          pcardTableBody.innerHTML='<tr><td colspan="4">No data found </td></tr>';                     
        }
        else{
          $('#patientCardModal').modal('show');
          
          /*data.forEach((item)=>{
            pcardTableBody.innerHTML+=
            `<tr>
              <td>patient card loading</td>
            </tr>`
            
          });*/
          
        }
      })
    }
  }

})




$('.btnfilterequest').on('click',function(){
   var fdate=$('#rqfdate').val();
   var tdate=$('#rqtdate').val();
   var ptype=$('#pat_type').val();
   if(fdate !=="" && tdate !==""){
    fetch("/lab/labfilterdaterequest/",{
      body:JSON.stringify({ fdate:fdate,tdate:tdate,ptype:ptype}),
      method: "POST",
  })
  .then((res)=>res.json())
    .then((data)=>{
      if(data.length===0){
            
        requestTableBody.innerHTML='<tr><td colspan="9">No request found </td></tr>';                    
    }
    else{           
        requestTableBody.innerHTML='';
        var jdata=data;            
        jdata.forEach(element => {              
          requestTableBody.innerHTML+=
          `<tr> 
                <td>${element.urgency}</td>
                <td>${element.date}</td>            
                <td>${element.pno}</td>            
                <td>${element.pname}</td> 
                <td>${element.age}</td> 
                <td>${element.gend}</td> 
                <td>${element.pymode}</td> 
                <td>${element.pstatus}</td>                    
                <td>${element.staff}</td>        
                <td style='display:none'>${element.vno}</td>        
          </tr>`             
        });

        $('.requestTable td:contains("Critical")').parent('tr').css('background-color', 'red');           
    } 
  });
  }
})

$('#navstoretabtn').on('click', function(){
  fetch("/lab/labstoreitems/",{    
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  if(data.length===0){
    //console.log(data);     
 }
 else{
  
   $("#labitems").empty();
   var labitem=document.querySelector('#labitems');
   labitem.innerHTML+=`<option value="">-----------</option>`;
   
   data.forEach((item)=>{     
       labitem.innerHTML+=`<option value="${item.itcode}">${item.itname}</option>`;
   });
 }
})
})
 var storeitable=document.querySelector('#tblitemsbody');
$('#labitems').on('change',function(){
   var itcode=$(this).val();
   if(itcode !==""){
    fetch("/lab/labselecteditem/",{
      body:JSON.stringify({itcode:itcode}),
      method: "POST",
  })
  .then((res)=>res.json())
    .then((data)=>{
      if(data.length===0){            
        storeitable.innerHTML='<tr><td colspan="5">error!! no details found </td></tr>';                     
    }
    else{           
        storeitable.innerHTML='';
        var jdata=data;            
        jdata.forEach(element => {              
          storeitable.innerHTML+=
          `<tr>                     
                
                <td style="display:none;">${element.itcode}</td>            
                <td>${element.itname}</td>          
                <td>${element.pkg}</td>          
                <td>${element.itbal}</td>            
                <td><textarea rows="1" cols="1" class='itqnt' id="itqnt">1</textarea></td>                                                     
                <td><button class="btn btn-sm btn-danger btnrmv">Remove</button></td>                                 
          </tr>`             
        });

    }
      })

   }
})

$("#tblitems").on('click', '.btnrmv', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from order?`)){       
      $(this).closest('tr').remove();      
  }
})

$('#tblitems').on('keyup','.itqnt',function(e){
 
  var currenRow=$(this).closest("tr");   
  var qnt = parseFloat(e.target.value);

    if(isNaN(qnt)){}
    else{  
      if(qnt>0){     
      var bal=parseFloat(currenRow.find("td:eq(3)").text());           
      if(qnt>bal){
        swal('Cannot request more than Available','','info');
        e.target.value=1;        
      }
      else{}    
    }  
    else{
      swal('incorrect quantity entry','','info');
      //resetAmount();
    }      
  }
  
})

$('#btnlabConfReq').on('click', function(){
  var tb = document.getElementById('tblitems'); 
  var bench=$('#labbench').val();
  bill=[];
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            bench:bench,
            itcode:tb.rows[i].cells[0].innerHTML, 
            qnt:tb.rows[i].cells[4].children[0].value,            
        });            
    }

    var data_json=JSON.stringify({bill});
    //console.log(data_json); 
      $.ajax({
          url: '/lab/labitemorder/',
          method:'POST',
          data: data_json,
          dataType: 'json',
          success: function (data) {
              if (data) {
                  swal(data.msg,'','success');
                  $('#tblitems tbody tr').remove();                  
              }        
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                swal('Internal Server Error occurred','','error');
            }
          }
        }); 
})

$("#requestsearch").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#requestTable tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});


////////////////////////////////// patient card ///////////////////////////////////
$('.btnptcard').on('click', function(){
  $('#patcard').modal('show');

})

$('#pdfgenerate').on('click', function(){
  var pno=$('#pid').val();
  var fdate=$('#pcfdate').val();
  var tdate=$('#pctdate').val();
  var ptype=$('#pat_type').val();
  var chkdate;
  if(pno==''){
    swal('','select patient first','info');
  }
  else{
    if($('#chkdate').is(":checked")){
      chkdate='checked';
    }
    else{
      chkdate='all';
    }
    var data=JSON.stringify({pno:pno,fdate:fdate,tdate:tdate,chkdate:chkdate,ptype:ptype})
    patientcardpdf(data);
  }
})


var pcardpdfbody=document.querySelector('#pcardpdfbody')

function patientcardpdf(data){
  
  fetch("/consult/patcard/",{
    body:data,
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  pcardpdfbody.innerHTML='';
  if(data.length===0){
    pcardpdfbody.innerHTML+='<tr><td colspan="6"> no medical history found</td></tr>';
  }
  else{
    pcardpdfbody.innerHTML+=`<tr>
          <td colspan='2'><b>Patient Name:</b>${$('#ptname').val()}</td>       
          <td><b>Hosp No:</b>${$('#pid').val()}</td>       
          <td><b>Age:</b>${$('#ptage').val()}</td>
          <td><b>Gender:</b>${$('#ptgend').val()}</td>
          </tr>`
    var jdata=data;  

    jdata.forEach(element => {      
      
      pcardpdfbody.innerHTML+=
      `<tr><td colspan='5'><b>Seen On: </b>${element.cdate}@${element.ctime}</td> </tr>`
      pcardpdfbody.innerHTML+=`<tr>    
          <td>Doctor/Clinician Notes:</td>
          <td colspan='3'><b>Chief Complain</b>:${element.ccomplain}<br><b>History</b>:${element.hist}<br><b>Physical Exam</b>:${element.phnotes}<br><b>Continuation Notes</b>:${element.cnotes}</td>
          <td>${element.doc}</td>
          </tr>` 
      pcardpdfbody.innerHTML+=`<tr>
          <td><b>Diagnosis:</b></td>       
          <td colspan='2'><b>Provisional</b>:${element.pdiag}</td>
          <td colspan='2'><b>Confirmed</b>:${element.cdiag}</td>
          </tr>`

      pcardpdfbody.innerHTML+=`<tr>
         <td><b>Service Requested:</b></td>
          <td colspan='3'>${element.svs}</td>
          <td>${element.doc}</td>
          </tr>`

       pcardpdfbody.innerHTML+=`<tr>
          <td><b>Prescription:</b></td>
          <td colspan='3'>${element.presc}</td>
          <td>${element.doc}</td>
          </tr>`

       pcardpdfbody.innerHTML+=`<tr>
          <td><b>Dispensed:</b></td>
          <td colspan='3'>${element.disp}</td>                                  
          <td>${element.pharmacist}</td>   
      </tr>`                 
    });
  }

  
})
}





//trying to split

function split_value(){
  const splitsplit=document.querySelector('#splitsplit');
  fetch("/records/split_value/",{
    body:JSON.stringify({ searchText:2091 }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  var jdata=data;
  var dt=jdata[0].fullname;
  const rs=dt.split('/');
  $('#splitsplit').empty();
  for(var i=0;i<rs.length;i++){    
    splitsplit.innerHTML+=`<option value="${rs[i]}">${rs[i]}</option>`;
  }
 
  /*const splitsplit=document.querySelector('#splitsplit');
 
    console.log(item);
    splitsplit.innerHTML+=`<option value="${item}">${item}</option>`;*/
  
/*
 <tr data-toggle="collapse" data-target="#company1" class="accordion-toggle">
                <td><a href="{% url 'company_detail' country_code=job.jurisdiction %}?company_number={{ job.company_number }}">{{ job.name }}</a></td>
                <td>{{ job.company_number }}</td>
                <td><a href="#{{ job.company_number }}" aria-expanded="true">View</button></td>
                <td>{{ job.jurisdiction }}</td>
                <td>{{ job.job_type }}</td>
                <td>{{ job.time_submitted|date:"d M Y"}}</td>
                <td><a href="{% url 'mark_as_completed' %}?job_id={{ job.id }}">Mark as Completed</td>
            </tr>
            <tr>
                <td colspan="6" class="hiddenRow">
                    <div id="company1" class="accordion-body collapse">Hello there!</div>
                </td>
            </tr>
 */
  
})
}


