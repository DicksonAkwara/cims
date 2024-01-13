
//const btn_ref_list =  document.querySelector('.btn_ref_list');
//const rsearch=  document.querySelector('#rsearch');


const requestTableBody = document.querySelector('.requestTableBody'); 
const filterTableBody = document.querySelector('.filterTableBody'); 

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


$('#pat_type').on('click', function(){
  retrieve_request();
})



function retrieve_request(){
   var ptype=$('#pat_type').val();
    $.ajax({
      url: '/rad/retrieve_request/',
      data: JSON.stringify({ ptype:ptype }), 
      method:'POST',       
      dataType: 'json',
      headers: {'X-CSRFToken': csrftoken},
      success: function (data) {
        if(data.length===0){
            
           // requestTableBody.innerHTML='<tr><td colspan="9">No request found </td></tr>';                    
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


  $("#requestsearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#requestTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#rsearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#filterTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  

  $("#rcsearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#filtercpTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  function retrieveptrequest(pid,pstatus){
   
    $.ajax({
      url: '/rad/retrievepatreq/',
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

$("#requestTable tbody").on('click','tr',function(){
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
        url: '/rad/paid_service/',
        data: JSON.stringify({reff_no:reff_no,test_id:testid,pid:pid,vno:vno}), 
        method:'POST',       
        dataType: 'json',
        headers: {'X-CSRFToken': csrftoken},
        success: function (data) {
            if (data.res) {              
              swal(data.res,'Image ID:'+data.sid,'success');
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
    
     var msg ='Record ['+sname+'] Imaging as unavailable at the moment?';   
     $('#unavailModal').find('#modalTitle').html(msg).show;
      document.querySelector('#req_ref').value=reff_no;    
      $('#unavailModal').modal('show');
    
  });
   
  
  $('#btn_unvail_confirm').on('click',function(){
    var rf=document.querySelector('#req_ref').value;
    var rs =document.querySelector('#miss_reason').value
    
    if(rs !=='none'){
      var formdata={
        reff_no:rf,
        rs:rs
      }
     
      $.ajax({
        url: '/rad/missreason/',
        data: JSON.stringify(formdata), 
        method:'POST', 
        headers: {'X-CSRFToken': csrftoken},      
        dataType: 'json',
        success: function (data) {
            if (data.res) {
              swal(data.res,'','success');
              $('#miss_reason').prop('selectedIndex',0);
              $('#unavailModal').modal('hide');
             }
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500) {
                swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
              }
            }
        
      })
    }
    else{
      swal('Sorry!! select reason first','','error');
    }
  });


  $('.nav_btn_refresh').on('click',function(){
    refresh_list();
  })
  
  $('#btnreflist').on('click', function(){
    refresh_list();
  })
  function refresh_list(){
    $.ajax({
      url: '/rad/refresh_list/',     
      method:'GET', 
      headers: {'X-CSRFToken': csrftoken},    
      success: function (data) {
        if(data.length===0){          
           // filterTableBody.innerHTML='<tr><td colspan="6">No examinations found </td></tr>';                     
        }
        else{           
            filterTableBody.innerHTML='';
            var jdata=data;
            
            jdata.forEach(element => {              
              filterTableBody.innerHTML+=
              `<tr>                  
                    <td style="display:none;">${element.ex_no}</td>
                    <td>${element.rdate}(${element.rtime})</td> 
                    <td>${element.pid}</td>            
                    <td>${element.pname}</td>
                    <td>${element.gend}</td>
                    <td>${element.age}</td>
                    <td>${element.service}</td>
                    <td>${element.uuid}</td>
                    <td>${element.status}</td>                          
                                 
              </tr>`                
            });
        }
      }
    });
  }




  $("#filterTable").on('click','tr',function(){
    // get the current row
    var currentRow=$(this).closest("tr");
    var reff_no=currentRow.find("td:eq(0)").text();
    var pname=currentRow.find("td:eq(3)").text();
    var exam=currentRow.find("td:eq(6)").text();
  
    var stt=currentRow.find("td:eq(8)").text();   
      var msg ='notes for ['+exam+']. patient['+pname+']';
      $('#notesModal').find('#notesTitle').html(msg).show;
       document.querySelector('#exam_ref').value=reff_no;
       $('#notesModal').modal('show');
       $('#divsave').show();  
        $('#divedit').hide();
      
    
  });

  $('#btn_save_notes').on('click',function(e){
    e.preventDefault();
    save_edit_note()
    refresh_list();
    
  })

  $('#btneditnotes').on('click',function(e){
    e.preventDefault();
     save_edit_note();
     completedateexams();

  })

function save_edit_note(){
 // var formdata =$("#radNotesForm").serialize();
  var examid=$('#exam_ref').val();
  var radtech=$('#radtech').val();
  var imgid=$('#imageId').val();
  var exnotes=$('#editor').html(); 
    
    $.ajax({
      url: '/rad/record_notes/',
      data: JSON.stringify({examid:examid,radtech:radtech,imgid:imgid,exnotes:exnotes}), 
      method:'POST',       
      dataType: 'json',
      headers: {'X-CSRFToken': csrftoken},
      success: function (data) {
        if(data.res){
          $('form#radNotesForm').trigger("reset");
          $('#notesModal').modal('hide');
          swal('Success',data.res,'success');         
        }        
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
          swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
        }
      }
  });

}

var filtercpTableBody=document.querySelector('.filtercpTableBody');
  $('.nav_btn_complete').on('click',function(){
    refreshcplist();
    
  })
  
  $('#btncreflist').on('click', function(){
    refreshcplist();
  })

  function refreshcplist(){
    $.ajax({
      url: '/rad/compexam/',     
      method:'GET', 
      headers: {'X-CSRFToken': csrftoken},    
      success: function (data) {
        if(data.length===0){          
          filtercpTableBody.innerHTML='<tr><td colspan="6">No examinations found </td></tr>';                     
        }
        else{           
          filtercpTableBody.innerHTML='';
            var jdata=data;
            
            jdata.forEach(element => {              
              filtercpTableBody.innerHTML+=
              `<tr>                  
                    <td style="display:none;">${element.ex_no}</td>
                    <td>${element.rdate}(${element.rtime})</td> 
                    <td>${element.pid}</td>            
                    <td>${element.pname}</td>
                    <td>${element.gend}</td>
                    <td>${element.age}</td>
                    <td>${element.service}</td>
                    <td>${element.uuid}</td>                         
                    <td>${element.rpby}</td>                          
                                 
              </tr>`                
            });
        }
      }
    });
  }

  $("#filtercpTable").on('click','tr',function(){

    var currentRow=$(this).closest("tr");
    var reff_no=currentRow.find("td:eq(0)").text();
    var pname=currentRow.find("td:eq(3)").text();
    var exam=currentRow.find("td:eq(6)").text();
    var rpby=currentRow.find("td:eq(8)").text();

    var usname=$('#username').val();
  
    fetch("/rad/search_exam_notes/",{
          body:JSON.stringify({ searchText:reff_no }),
          method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
        if(data.length===0){           
             swal('','no record found','info');            
      }
      else{ 
        data.forEach((item)=>{
        document.querySelector('#radtech').value=item.radtech
        //document.querySelector('#exnotes').value=item.exam_notes 
        document.querySelector('#editor').innerHTML=item.exam_notes;
        })
        var msg =' Edit notes for <br>['+exam+']. <br>patient['+pname+']';
        $('#notesModal').find('#notesTitle').html(msg).show;
        document.querySelector('#exam_ref').value=reff_no;
        $('#notesModal').modal('show'); 
        $('#divsave').hide();  
        $('#divedit').show();  
      }
      //check username
      if(rpby!==usname){
        //$('#exnotes').attr('readonly',true);
        $('#btneditnotes').attr('disabled','true');
        $('#us_alert').text('You cannot edit someone else notes');
      }
      else{
        $('#exnotes').attr('readonly',false);
        $('#us_alert').text('')
      }
      })

  })

  $('.btncomprep').on('click', function(){
    completedateexams();
  })

function completedateexams(){
  var fdate=$('#cfdate').val();
    var tdate=$('#ctdate').val();
    var fdata=JSON.stringify({fdate:fdate,tdate:tdate})
    $.ajax({
      url: '/rad/compdateexam/',     
      method:'POST', 
      data:fdata,
      headers: {'X-CSRFToken': csrftoken},    
      success: function (data) {
        if(data.length===0){          
          filtercpTableBody.innerHTML='<tr><td colspan="6">No examinations found </td></tr>';                     
        }
        else{           
          filtercpTableBody.innerHTML='';
            var jdata=data;
            
            jdata.forEach(element => {              
              filtercpTableBody.innerHTML+=
              `<tr>                  
                    <td style="display:none;">${element.ex_no}</td>
                    <td>${element.rdate}(${element.rtime})</td> 
                    <td>${element.pid}</td>            
                    <td>${element.pname}</td>
                    <td>${element.gend}</td>
                    <td>${element.age}</td>
                    <td>${element.service}</td>
                    <td>${element.uuid}</td>                         
                    <td>${element.rpby}</td>                          
                                 
              </tr>`                
            });
        }
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
          swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
        }
      }
    });

}


///////////////////////////////////////////////////////////////////////////////






$('#add_svc').on('click', function(){
  $('#addsvcModal').modal('show');   
  $('#btn_updatesvs').prop('disabled',true);
  $('#btn_addsvc').prop('disabled',false);
  clearfields();

})

$('#radsvctable').on('click','#btnEditSvs', function(){
  $('#addsvcModal').modal('show');   
  $('#btn_updatesvs').prop('disabled',false);
  $('#btn_addsvc').prop('disabled',true);
  
  var currentRow=$(this).closest("tr");
  $('#sid').val(currentRow.find("td:eq(0)").text());
  $('#svname').val(currentRow.find("td:eq(1)").text());
  $('#svnprice').val(currentRow.find("td:eq(2)").text());
  $('#schprice').val(currentRow.find("td:eq(3)").text());
  $('#avstatus').val(currentRow.find("td:eq(4)").text());
})


function fetchdata(){
  var data=JSON.stringify({
    sid:$('#sid').val(),
    sname:$('#svname').val(),
    cprice:$('#svnprice').val(),
    sprice:$('#schprice').val(),
    stt:$('#avstatus').val(),
  })
  return data;
}

function clearfields(){
  $('#svname').val('');
  $('#svnprice').val('');
  $('#schprice').val('');
  $('#sid').val('');
  $('#avstatus').prop('selectedIndex',0);
}

$('#btn_addsvc').on('click', function(){
  var sdata=fetchdata();
  $.ajax({
    url: '/rad/new_service/',
    data: sdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      if(data.res){
        $('#addsvcModal').modal('hide');
       swal('success',data.res,'success');
       clearfields();
       location.reload(true)
      }
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
        swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
      }
    }
});
})

$('#btn_updatesvs').on('click', function(){
  var sdata=fetchdata();
  $.ajax({
    url: '/rad/update_service/',
    data: sdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      if(data.res){
        $('#addsvcModal').modal('hide');
        swal('success',data.res,'success');
       clearfields();
       location.reload(true)
      }
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
        swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
      }
    }
});
})



$("#radsvcsearch").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#radsvctable tbody tr").filter(function() {
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

$('#btn_trynotes').on('click',function(){
  var nnotes=$('#editor').html();  
  $.ajax({
    url: '/rad/trynotes/',
    data: JSON.stringify({notes:nnotes}), 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      if(data.res){
        swal('success',data.res,'success');
      }
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
        swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
      }
    }
});
})


$('#btn_rtvnotes').on('click',function(){  
  fetch("/rad/rtv_notes/",{    
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  data.forEach((item)=>{
    document.querySelector('#editor').innerHTML=item.notes;
    })
})
})

