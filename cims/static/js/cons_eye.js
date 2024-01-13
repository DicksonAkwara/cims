$('#btnwaitlist').on('click', function(){
    $('#waitlist').modal('show');
    var ptype=$('#pat_type').val();
    loadwaitlist(ptype);
})
var listTableBody=document.querySelector('#listTableBody');
function loadwaitlist(ptype){
    var ptype=ptype;
    listTableBody.innerHTML='';

    fetch("/consult/waitlist_eye/",{
      body:JSON.stringify({ searchText:ptype }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){
        listTableBody.innerHTML='<tr><td colspan="6">No patient waiting </td></tr>'
      }
      else{  
       
        var jdata=data;            
            jdata.forEach(element => {              
                listTableBody.innerHTML+=
              `<tr> 
                    <td>${element.vdate}(${element.vtime})</td>            
                    <td>${element.pname}</td>            
                    <td>${element.pno}</td>            
                    <td>${element.age}</td>            
                    <td>${element.gender}</td>
                    <td>${element.pmode}</td>                                                 
                    <td style='display:none'>${element.subname}</td> 
                    <td style='display:none'>${element.vno}</td> 
              </tr>`             
            });            
      }
  })


}

$('#pCardNo').on('keyup',function(){
  var value = $(this).val().toLowerCase();
  $("#listTable tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

$('#listTable tbody').on('click','tr', function(){
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-warning').siblings().removeClass('bg-warning'); 
  var pnm=currentRow.find("td:eq(1)").text().toUpperCase();
  var pn=currentRow.find("td:eq(2)").text().toUpperCase();
  var age=currentRow.find("td:eq(3)").text()
  var gnd=currentRow.find("td:eq(4)").text().toUpperCase();
  var pmd=currentRow.find("td:eq(5)").text()
  var pmd2=currentRow.find("td:eq(6)").text()
  var vno=currentRow.find("td:eq(7)").text()

  //document.querySelector('#fname').innerHTML=
  $('#fname').val(pnm);
  document.querySelector('#fname2').innerHTML=pnm;
  $('#cardno').val(pn);
  $('#ptage').val(age);
  $('#ptgender').val(gnd);
  $('#pmode').val(pmd);
  $('#pmode2').val(pmd2);
  $('#vno').val(vno); 

  $('#spid1').val(pn);
  $('#sclname1').val(pmd2);

  $('#waitlist').modal('hide');
  $('#btn_pat_det').trigger('click');
  receive_patient(pn)
})



function receive_patient(pn){
  formdata ={
    pid:pn,
    cname:'Eye'
  }
  $.ajax({
    url: '/consult/receive_patient/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      $('#consnumber').val(data.consno)
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
        swal("Sorry!!","Internal Server Error occurred. try again", "error");
      }
    }
  });

}



$('#btn_triage_det').on('click', function(){
  find_triage();
})

var triageTableBody=document.querySelector('.triageTableBody');
function find_triage(){
  var pid=$('#cardno').val();  
  if(pid==""){
      e.preventDefault()
      alert('ERROR!! please select patient first');
  }
  else{
    triageTableBody.innerHTML='';
    fetch("/consult/triage_search/",{
      body:JSON.stringify({ searchText:pid }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){
        triageTableBody.innerHTML='<tr><td colspan="7">No triage details found </td></tr>'
      }
      else{  
       
        var jdata=data;            
            jdata.forEach(element => {              
              triageTableBody.innerHTML+=
              `<tr> 
                    <td>${element.date}   ${element.time}</td>            
                    <td>${element.urg}</td>            
                    <td>${element.temp}</td>            
                    <td>${element.press}</td>            
                    <td>${element.pulse}</td>
                    <td>${element.wgt}</td>
                    <td>${element.hgt}</td>                                                 
              </tr>`             
            });
            $('.triageTable td:contains("Critical")').parent('tr').css('background-color', 'red');
            $('.triageTable td:contains("Mild")').parent('tr').css('background-color', 'yellow');
      }
  })

  

  }
}


$('#epart').on('change', function(){
  var slc=$(this).val();
  var side=$('#eyesel').val();
  if(side=='none'){}
  else{
    var ttval=$('#eyeselect').val();
    if(ttval==''){
    document.querySelector('#eyeselect').value=side+'-'+slc;
    }
    else{document.querySelector('#eyeselect').value=ttval+","+side+'-'+slc;}
  }
  
  
})

$('#submitEye').on('click',function(){   
  var formdata = $("#eyeForm").serialize();  
  $.ajax({
    url: '/consult/savespnotes/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          swal("Success!!",data.msg, "success");
          $('form#eyeForm').trigger("reset");
          $('#btn_service').trigger('click');
                        
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          swal("Sorry!!","Internal Server Error occurred. try again", "error");
      }
    }
})
})


//department to request service from select buttion
$("#operation").on('change',function(){   
  var patno=$('#cardno').val();  
  if(patno==null || patno==''){
    swal("please select patient first",'',"info") 
    $('#operation').prop('selectedIndex',0);    
  }

  else{
    const opt = $(this).val();
  
    if(opt==1||opt==2||opt==3||opt==7){
    $('#serviceModal').modal('show');
  
    $('#billOutputSvs').show();
    $('#pharOuttable').hide();
    $('#admdiv').hide();
    $('#clinicBook').hide();
  
      if(opt==1){
        modal_header.innerHTML="";
        modal_header.innerHTML+="Nursing procedure Request";
      }
      if(opt==2){
        modal_header.innerHTML="";
        modal_header.innerHTML+="Laboratory Test Request";
      }
      if(opt==3){
        modal_header.innerHTML="";
        modal_header.innerHTML+="Radiology Image Request";
      }
    }
    else if(opt==4){  
      //first check if diagnosis is enterred
      var formdata ={ pid:patno }
        $.ajax({
          url: '/consult/eye_diagnosis_entry/',
          data: formdata, 
          method:'POST',       
          dataType: 'json',
          success: function (data) {
            data.forEach(element => {
               var cd=element.cd; 
               console.log(cd); 
               if(cd !=='none'){
                $('#billOutputSvs').hide();
                $('#admdiv').hide();
                $('#clinicBook').hide();
                $('#pharOuttable').show();
                $('#pharmacyModal').modal('show');
               }
               else{
                swal("Error!!","Diagnosis not found. clerk patient and select condition first","info"); 
                $('#operation').prop('selectedIndex',0);
                $('#btnOpenClerk').trigger('click');                
               }
             })          
          }
        });  
         
    }
    else  if(opt==5){
      $('#billOutputSvs').hide();
      $('#pharOuttable').hide();
      $('#clinicBook').hide();
      $('#admdiv').show();
      
    }
    else  if(opt==6){
      $('#billOutputSvs').hide();
      $('#pharOuttable').hide();
      $('#admdiv').hide();
      $('#clinicBook').show();
      //date picker method
      //loaddate();
      
    }

  }

})


//searching service to request
var resultTableBody=document.querySelector('.resultTableBody');
$("#search_service").on('keyup',function(){

  var pid = $(this).val();
  var opt = $("#operation").val();
  
  if(pid.trim().length>0){
      //console.log(pid);
      resultTableBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_service_search/",{
      body:JSON.stringify({ searchText:pid,opt:opt }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
          resultTableBody.innerHTML='<tr><td colspan="4">No such service found </td></tr>';                     
      }
      else{
        data.forEach((item)=>{
            resultTableBody.innerHTML+=
            `<tr>              
            <td>${item.service_name}</td>
            <td>${item.normal_rate}</td>
            <td>${item.scheme_rate}</td>
            <td>${item.service_point}</td>
            <td style="display:none;">${item.scode}</td>                 
            </tr>`
        });
      }
    })
  }

})

var pharSearchTbBody=document.querySelector('.pharSearchTbBody');
var pharSearchTb=document.querySelector('#pharSearchTb');
var pharOuttableBody=document.querySelector('.pharOuttableBody');

$("#search_pharmacy").on('keyup',function(){

  var searchValue =$(this).val();  
  var pat_type=$('#pat_type').val();
  var stid = $("#prescstore").val();
  
  if(searchValue.trim().length>0){
      pharSearchTbBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_pharm_search/",{
      body:JSON.stringify({ searchText:searchValue,pt:pat_type,stid:stid}),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
          pharSearchTbBody.innerHTML='<tr><td colspan="4">Item not found </td></tr>';                     
      }
      else{
        
        data.forEach((item)=>{
          pharSearchTbBody.innerHTML+=
            `<tr>
            <td style="display:none;">${item.item_code}</td>             
            <td>${item.item_name}(${item.strength})</td>
            <td>${item.price}</td>
            <td>${item.sprice}</td>
            <td>${item.storeName}</td>
            <td>${item.balance}</td>             
            <td style="display:none;">${item.servePoint}</td>                      
            <td style="display:none;">${item.strength}</td>                      
                                  
            </tr>`
        });
      }
    })
  }
  else{
    pharSearchTbBody.innerHTML='';
  }

})

$("#pharSearchTb tbody").on('click', 'tr', function() {
  var cost;
      var currentRow=$(this).closest("tr");      
      
      var normal_rate=currentRow.find("td:eq(2)").text(); 
      var special_rate=currentRow.find("td:eq(3)").text();   

      var servPnt=currentRow.find("td:eq(6)").text();
      const pym=$('#pmode2').val();

      if(pym.includes('cash')){
          cost=normal_rate;
      }
      else{
          cost=special_rate;
      }

     //storename column 2
     pharOuttableBody.innerHTML+=
      `<tr>              
      <td style="display:none;">${currentRow.find("td:eq(0)").text()}</td>      
      <td>${currentRow.find("td:eq(1)").text()}</td>   
      
      <td>
      <textarea rows="1" cols="6" class='svc_qnt text-center dos' id="dos">${currentRow.find("td:eq(7)").text()}</textarea>
      </td>
      <td>
          <select class='freq'>
            <option value='0'>----</option>
            <option value="OD">OD</option>
            <option value="BD">BD</option>
            <option value="TID">TID</option>
            <option value="QID">QID</option>
            <option value="Stat">Stat</option>
            <option value="Prn">Prn</option>
        </select>
      </td>
      <td>
      <select class='days'>
        <option value='0'>----</option>
        <option value="once">once</option>
        <option value="1">1</option>
        <option value="3">3</option>
        <option value="5">5</option>
        <option value="7">7</option>
        <option value="10">10</option>
        <option value="14">14</option>
        <option value="30">30</option>
    </select>
  </td>  
  <td><textarea rows="1" cols="3" class='svc_qnt text-center' id="txt_area_qnt">1</textarea></td>
  <td>${currentRow.find("td:eq(5)").text()}</td>
  <td>${currentRow.find("td:eq(4)").text()}</td>     
  <td style="display:none;">${parseInt(cost)}</td>     
  <td><button class="btn btn-danger btn-sm btnRemove">&times;</button></td>
      </tr>`
});


var billOutputSvsBody=document.querySelector('.billOutputSvsBody');
$(".resultTableBody").on('click', 'tr', function() {
  var cost;
      var currentRow=$(this).closest("tr"); 
      
      var svs_name=currentRow.find("td:eq(0)").text(); 
      var normal_rate=currentRow.find("td:eq(1)").text(); 
      var special_rate=currentRow.find("td:eq(2)").text(); 
      var dept=currentRow.find("td:eq(3)").text();
      var svs_code=currentRow.find("td:eq(4)").text();

      const pym=document.querySelector('#pmode2').value;

      if(pym.includes('cash')){
          cost=normal_rate;
      }
      else{
          cost=special_rate;
      }
      //var data=svs_code+"\n"+svs_name+"\n"+cost+"\n"+dept;
      //alert(data);
      billOutputSvsBody.innerHTML+=
      `<tr>              
      <td style="display:none;">${svs_code}</td>
      <td>${svs_name}</td>
      <td>${cost}</td>
      <td>${dept}</td>
      <td><button class="btn btn-danger btn-sm btnSvRemove">&times;</button></td>       
      </tr>`
});






$("#pharOuttable").on('click', '.btnRemove', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})

$("#billOutputSvs tbody").on('click', '.btnSvRemove', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})

var pharOuttableBody=document.querySelector('.pharOuttableBody');


$("#btn_confirm_request").on('click',function(){

  var opt=$('#operation').val();
  var pid=$('#cardno').val();
  var pym=$('#pmode2').val();
  var consno=$('#consnumber').val();
  var ptype=$('#pat_type').val();
  var vno=$('#vno').val();

if(pid=='' || pid==null){
  swal('select patient first !!','','info');
}
else{
  var pystatus='';
  if(pym.includes('cash')){
    pystatus='pending';
  }
  else{
    pystatus='paid';
  }
  var bill=[];
  var url='';

  if(opt==1||opt==2||opt==3||opt==7){
    url='/consult/save_sp_request/';
    var tb = document.querySelector('#billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            oper:opt,
            consno:consno,
            pyst:pystatus,
            ptype:ptype,
            vno:vno,
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            cost:tb.rows[i].cells[2].innerHTML,
            dpt:tb.rows[i].cells[3].innerHTML
        });            
    }
  }

else if(opt==4){
  var tb = document.querySelector('#pharOuttable');
  url='/consult/savePrescription/';
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            oper:opt,
            pyst:pystatus,
            consno:consno,
            vno:vno,
            code:tb.rows[i].cells[0].innerHTML,           
            dose:tb.rows[i].cells[2].children[0].value,
            freq:tb.rows[i].cells[3].children[0].value,
            day:tb.rows[i].cells[4].children[0].value,
            qnt:tb.rows[i].cells[5].children[0].value,
            storeName:tb.rows[i].cells[7].innerHTML,
            price:tb.rows[i].cells[8].innerHTML,
            cons_type:'special'
            
        });            
    }

} 

else if(opt==5){
  var ward=$('#ward').val();
  var notes=$('#admitNotes').val();
  var cardNo=$('#cardno').val();
  url='/consult/saveAdmission/';

      if(notes=='' ){
        swal('some notes should be entered','','info');
      }
      else{
      
          var formdata={
            pid:cardNo,
            pnotes:notes,
            ward:ward
          }
        bill=formdata;       
    }
  } 
else if(opt==6){
    var pdate=$('#prdate').val();
    var urgency=$('#bkType').val();
    var dept=$('#bkDept').val();
    var notes=$('#clinicNotes').val();
    var cardNo=$('#cardno').val();

    url='/consult/saveClinicBook/';
  
        if(notes=='' ){
          swal('some notes should be entered','','info');
        }
        else{
         var formdata={
              pid:cardNo,
              pnotes:notes,
              dept:dept,
              urgency:urgency,
              pdate:pdate
            }
          bill=formdata;
      
      }
    }

    var data_json=JSON.stringify({bill});
    //console.log(data_json); 
      $.ajax({
          url: url,
          method:'POST',
          data: data_json,
          dataType: 'json',
          success: function (data) {
              if (data) {

                  swal('Success !!',data.msg,'success');

                  $('#billOutputSvs tbody tr').remove();
                  $('#pharOuttable tbody tr').remove();
                  $('#admdiv').hide();
                  $('#ward').prop('selectedIndex',0);
                  $('#admNotes').val("");
                  $('#operation').prop('selectedIndex',0);

                  $('#pdate').prop('selectedIndex',0);
                  $('#bkType').prop('selectedIndex',0);
                  $('#bkDept').prop('selectedIndex',0);
                  $('#clinicBook').hide();
              }        
          }
        }); 

}  
  
})



var resOutputSvsBody = document.querySelector('.resOutputSvsBody');

$("#btnLabRes").on('click',function(){
  var cardNo=$('#cardno').val();
  $('#resDept').val('lab');

  if(cardNo !==''){
    if(cardNo.trim().length>0){
      //console.log(pid);
      //tableOutput.innerHTML=''; //for table refresh
      fetch("/lab/consLabResSearch/",{
      body:JSON.stringify({ searchText:cardNo }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){          
        resOutputSvsBody.innerHTML='<tr><td colspan="5">No verified results found </td></tr>'; 
    }
    else{                  
        resOutputSvsBody.innerHTML='';
        var jdata=data;          
        jdata.forEach(element => {              
          resOutputSvsBody.innerHTML+=
          `<tr> 
                <td style='display:none';>${element.sampID}</td>
                <td>${element.rdate}</td>               
                <td>${element.service}</td>                                                                   
                <td>${element.status}</td>                                                                   
                                                                                
          </tr>` 
                  
        });         

      //color_code();
      $('.resOutputSvs td:contains("in-progress")').parent('tr').css('background-color', 'lightgray');
      $('.resOutputSvs td:contains("complete")').parent('tr').css('background-color', 'yellow');
      $('.resOutputSvs td:contains("verified")').parent('tr').css('background-color', 'lightgreen');
    }

  })
  }
}

else{
    swal('select patient first','','info');
  }
})


var tableVerifiedBody=document.querySelector('.tableVerifiedBody');

$(".resOutputSvsBody").on('click', 'tr', function() {
  var ptype=document.querySelector("#resDept").value;
  var pname=document.querySelector("#fname").value;
  
   var currentRow=$(this).closest("tr");       
   var reffNo=currentRow.find("td:eq(0)").text(); 
   var service=currentRow.find("td:eq(2)").text(); 
   var status=currentRow.find("td:eq(3)").text();  
   
   if(status=='in-progress'){
     swal('Examination in progress.Please Wait!!','','info');
   }
   else if(status=='complete' && ptype=='lab'){
     swal('Test complete but not verified','','info');
   }
   else if(status=='complete' && ptype=='rad'){
       var formdata={        
         reffNo:reffNo
       }
       
         if(Object.keys(formdata).length>0){   //getting the length of the object  
             fetch("/rad/consResultNotes/",{
             body:JSON.stringify({ reffNo:reffNo }),
             method: "POST",
           })
           .then((res)=>res.json())
           .then((data)=>{
           if(data.length >0){
                    
             data.forEach((item)=>{
               document.querySelector('#radHeader').innerHTML=item.notes_by +"'s notes for [" +service+" ]";
               document.querySelector('#radResNotes').value=item.exam_notes;
               document.querySelector('#radResDetails').value='Result Date: '+item.exam_notes_date+' Result time: '+item.exam_notes_time;
               $('#radNotesModal').modal('show');
             
             });
           }
 
         })
       }
     }
 
 
   else if(status=='verified' && ptype=='lab'){
     if(reffNo.trim().length>0){   
       fetch("/lab/labSearchResult/",{
       body:JSON.stringify({ searchText:reffNo }),
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
                 <td><b>Receive Date:</b> ${recDate}</td>            
                 <td><b>Receive Time:</b> ${recTime}</td>                                                                           
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
                 <td><b>Result Date:</b> ${recDate}</td>            
                 <td><b>Result Time:</b> ${recTime}</td>                                                                           
           </tr>
           <tr>                  
               <td><b>Performed By:</b> ${perfby}</td>            
               <td><b>Confirmed By:</b> ${verby}</td>                                                                           
           </tr>`;
   
       });
       document.querySelector('#testVerDetails').innerHTML='Name: '+pname+' (Test: '+service+')';    
       $('#verifiedModal').modal('show');
         
     })
     }
 
   }
  
   })



   $("#btnRadRes").on('click',function(){
    var cardNo=$('#cardno').val();
    document.querySelector('#resDept').value='rad';
    
    if(cardNo !==''){
      if(cardNo.trim().length>0){     
        resOutputSvsBody.innerHTML='';
        
        fetch("/rad/consResultSearch/",{
        body:JSON.stringify({ searchText:cardNo }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
     if(data.length >0){
      //console.log(data);
      
      data.forEach((item)=>{
  
        resOutputSvsBody.innerHTML+=
          `<tr>
          <td style="display:none;">${item.ex_no}</td>       
          <td>${item.rdate}</td>
          <td>${item.service}</td>
          <td>${item.status}</td>
          <td style="display:none;">${item.dept}</td>                              
          </tr>`
      });
     }
     else{
      resOutputSvsBody.innerHTML='<tr><td colspan="4">no investigation found/request not received</td></tr>';      
     }
      
    })
    }
  }
  
  else{
      swal('select patient first','','info');
    }
  })


 
$('#btnconfreferral').on('click',function(){
  var rftype=$('#referaltype').val();
  var rfdes=$('#rfdestination').val();
  var cardNo=$('#cardno').val();
  var rfnotes=$('#refnotes').val().trim();
  var rclinic=$('#rclinic').val();
  var vno=$('#visitno').val();
 

      if(cardNo=='' ){
        swal('select patient first','','info');
      }
      else{
        if(rfdes !=='' && rfnotes.length>10){
         var formdata={
            pid:cardNo,
            rfrom:rclinic,
            rfdes:rfdes,
            rfnotes:rfnotes,
            rftype:rftype,
            vno:vno,
          }
          $.ajax({
            url: '/consult/saveReferral/',
            data: JSON.stringify(formdata), 
            method:'POST',       
            dataType: 'json',
            success: function (data) {
              swal(data.msg,'','success');
              if(rftype=='internal'){internalReff();}              
              }
          });
     
        }
        else{
          swal('Empty Fields','referral destination not selected/notes too short','info');

        }
    }
})
