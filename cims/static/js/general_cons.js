$(document).ready(function(){

const pcardNo =  document.querySelector('#pCardNo');
const operation =  document.querySelector('#operation');
const modal_header =  document.querySelector('#modal_header');
const search_service =  document.querySelector('#search_service');
const search_pharmacy =  document.querySelector('#search_pharmacy');

//const btn_confirm =  document.querySelector('#btn_confirm');
const btn_collapse =  document.querySelector('#btn_triage_det');
const search_diag =  document.querySelector('#search_diag');
const doctor_notes =  document.querySelector('#doctor_notes');
const btn_doctor_notes =  document.querySelector('#btn_doctor_notes');
const btn_confirm_request =  document.querySelector('#btn_confirm_request');
const btnLabRes =  document.querySelector('#btnLabRes');
const btnRadRes =  document.querySelector('#btnRadRes');


const triageTableBody = document.querySelector('.triageTableBody');
const billOutputSvsBody = document.querySelector('.billOutputSvsBody');
const diagOutputSvsBody = document.querySelector('.diagOutputSvsBody');
const diagOutputSvs = document.querySelector('.diagOutputSvs');
const resultTableBody = document.querySelector('.resultTableBody');
const pharSearchTbBody = document.querySelector('.pharSearchTbBody');
const pharOuttableBody = document.querySelector('.pharOuttableBody');
const resOutputSvsBody = document.querySelector('.resOutputSvsBody');
const tableVerifiedBody = document.querySelector('.tableVerifiedBody');


pcardNo.addEventListener('keyup',(e)=>{

    const pid = e.target.value;
    
    if(pid.trim().length>0){
        //console.log(pid);
        //tableOutput.innerHTML=''; //for table refresh
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){
            //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>';
            document.querySelector('#pname').value='';
            document.querySelector('#last_visit').value=''; 
            document.querySelector('#pymode').value=''; 
            document.querySelector('#pymode2').value=''; 
            document.querySelector('#visitno').value='';
            document.querySelector('#nsurgency').value='';
            document.querySelector('#pat_age').value='';
            document.querySelector('#pgender').value='';
            document.querySelector('#rclinic').value='';

            triageTableBody.innerHTML='';
            
        }
        else{

          var jdata=data;          
          var pid
          jdata.forEach(element => { 
          pid =element.pid;         
          document.querySelector('#pname').value=element.fname;
          document.querySelector('#last_visit').value=pid; 
          document.querySelector('#visitno').value=element.vno; 
          document.querySelector('#pat_age').value=element.age;
          document.querySelector('#pgender').value=element.gender;
          document.querySelector('#pymode').value=element.scheme_type+"("+element.scheme_name+")";
          document.querySelector('#pymode2').value=element.scheme_name;
          document.querySelector('#rclinic').value=element.clname;
          document.querySelector('#nsurgency').value=element.urg;
          })
          receive_patient(pid);
          find_triage();
         }
      })
    }

})


function receive_patient(id){
  var clid=$('#cllname').val();
  var vno=$('#visitno').val();
  var ptype=$('#pat_type').val();
  formdata ={
    pid:id,
    clid:clid,
    vno:vno,
    ptype:ptype,
  }
  $.ajax({
    url: '/consult/receive_patient/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {        
        document.querySelector('#consnumber').value=data.consno;
    }
  });

}

$('#pat_type').on('change', function(){
  var ptype=$(this).val();
  
  if(ptype=='In-Patient'){
    $('#divwdname').show();
    $('#divclname').hide();
    $('.divcontnotes').show();
    $('#admdischarge').show();
    $.ajax({
      url: '/consult/loadWards/',      
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        document.querySelector('#cllname').innerHTML='';
          var jdata=data;  
          document.querySelector('#cllname').innerHTML+=`<option value="none">----------</option>`;            
          jdata.forEach(element => {          
            document.querySelector('#cllname').innerHTML+=`<option value="${element.wardName}">${element.wardName}</option>`;
            
          })
      }
    });
  }
  else if(ptype=='Out-Patient'){
    $('#divclname').show();
    $('#admdischarge').hide();
    $('#divwdname').hide();
    $('.divcontnotes').hide();
    $.ajax({
      url: '/consult/loadClinics/',      
      method:'POST',       
      dataType: 'json',
      success: function (data) {
         document.querySelector('#cllname').innerHTML='';
          var jdata=data;  
          document.querySelector('#cllname').innerHTML+=`<option value="none">----------</option>`;               
          jdata.forEach(element => {          
            document.querySelector('#cllname').innerHTML+=`<option value="${element.clinic_name}">${element.clinic_name}</option>`;
          })
      }
    });
  }
})


$('#cllname').on('change', function(){
  showtablelist();
  loadwaitlist();
})

$('#btnwtlist').on('click', function(){
  showtablelist();
  loadwaitlist();
})

function showtablelist(){
  $('#wtlistdiv').show();
  $('#clerkformdiv').hide();
}

function showclerkform(){
  $('#wtlistdiv').hide();
  $('#clerkformdiv').show();
}

function loadwaitlist(){
  var ptype=$('#pat_type').val();
  var cl_wd=$('#cllname').val();
  if(ptype=='In-Patient'){
    inpatentlist(cl_wd)
  }
  else{
    outpatentlist(cl_wd)
  }
}


var wtlistBody=document.querySelector('#wtlistBody');
function outpatentlist(clinic){
  wtlistBody.innerHTML='';
  fetch("/nurse/outpatient_list/",{
    body:JSON.stringify({clinic:clinic }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      wtlistBody.innerHTML=`
      <tr>
        <td colspan='9'>No patients found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        wtlistBody.innerHTML +=`
        <tr>
          <td>${item.adate}</td>
          <td>${item.atime}</td>
          <td>${item.pno}</td>
          <td>${item.pname}</td>
          <td>${item.page}</td>
          <td>${item.pgend}</td>
          <td>${item.pward}</td>
          <td>${item.pmode}</td>
          <td>${item.urg}</td>
          <td style='display:none'>${item.vno}</td>
          <td style='display:none'>Out-Patient</td>
        </tr>`;
      })
      
    }
})

}

function inpatentlist(pt){
  var ptype=pt;
  wtlistBody.innerHTML='';
  fetch("/nurse/inpatient_list/",{
    body:JSON.stringify({ptype:ptype }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      wtlistBody.innerHTML=`
      <tr>
        <td colspan='9'>No admissions found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        wtlistBody.innerHTML +=`
        <tr>
          <td>${item.adate}</td>
          <td>${item.atime}</td>
          <td>${item.pno}</td>
          <td>${item.pname}</td>
          <td>${item.page}</td>
          <td>${item.pgend}</td>
          <td>${item.pward}</td>
          <td>${item.pmode}</td>
          <td>${item.urg}</td>
          <td style='display:none'>${item.vno}</td>
          <td style='display:none'>In-Patient</td>
        </tr>`;
      })
      
    }
})

}


$('#wtlist tbody').on('click','tr', function(){
  //check for consultation payment first
  var ptype=$('#pat_type').val();
  var currentRow=$(this).closest("tr"); 
  var pid=currentRow.find("td:eq(2)").text();

  if(ptype=='In-Patient'){
    currentRow.addClass('bg-info').siblings().removeClass('bg-info');      
    document.querySelector('#last_visit').value=currentRow.find("td:eq(2)").text(); 
    document.querySelector('#pname').value=currentRow.find("td:eq(3)").text().toUpperCase();
    document.querySelector('#pat_age').value=currentRow.find("td:eq(4)").text();
    document.querySelector('#pgender').value=currentRow.find("td:eq(5)").text().toUpperCase();
    document.querySelector('#rclinic').value=currentRow.find("td:eq(6)").text(); 
    document.querySelector('#pymode').value=currentRow.find("td:eq(7)").text(); 
    document.querySelector('#pymode2').value=currentRow.find("td:eq(7)").text(); 
    document.querySelector('#nsurgency').value=currentRow.find("td:eq(8)").text();
    document.querySelector('#visitno').value=currentRow.find("td:eq(9)").text();
    //open clerking form
    showclerkform();
    receive_patient(pid);
    find_triage();
  }
  else{
    fetch("/nurse/check_cons_payment/",{
      body:JSON.stringify({pid:pid}),
      method: "POST",
    })
  .then((res)=>res.json())
  .then((data)=>{
    if (data.msg=='paid'){ 
      currentRow.addClass('bg-info').siblings().removeClass('bg-info');      
      document.querySelector('#last_visit').value=currentRow.find("td:eq(2)").text(); 
      document.querySelector('#pname').value=currentRow.find("td:eq(3)").text().toUpperCase();
      document.querySelector('#pat_age').value=currentRow.find("td:eq(4)").text();
      document.querySelector('#pgender').value=currentRow.find("td:eq(5)").text().toUpperCase();
      document.querySelector('#rclinic').value=currentRow.find("td:eq(6)").text(); 
      document.querySelector('#pymode').value=currentRow.find("td:eq(7)").text(); 
      document.querySelector('#pymode2').value=currentRow.find("td:eq(7)").text(); 
      document.querySelector('#nsurgency').value=currentRow.find("td:eq(8)").text();
      document.querySelector('#visitno').value=currentRow.find("td:eq(9)").text();
      //open clerking form
      showclerkform();
      receive_patient(pid);
      find_triage();

    }
    else{
      currentRow.siblings().removeClass('bg-info');
      swal('','Consultation fee not paid','info')
    }
  })
  }
})
$('#btnptriage').on('click',function(){
  var pid=$('#last_visit').val();  
  if(pid==""){
    swal('','ERROR!! please select patient first','info');
  }
  else{
    find_triage(pid);
    
  }
})


function find_triage(ppid){
  var pid=ppid;  
  if(pid==""){
      e.preventDefault()
      swal('','ERROR!! please select patient first','info');
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
                    <td>${element.spo}</td>
                    <td>${element.muac}</td>
                    <td>${element.wgt}</td>
                    <td>${element.hgt}</td>                                                 
                    <td>${element.notes}</td>                                                 
              </tr>`             
            });
            $('.triageTable td:contains("Critical")').parent('tr').css('background-color', 'red');
            $('.triageTable td:contains("Mild")').parent('tr').css('background-color', 'yellow');

            $('#TriageModal').modal('show');
      }

  })

  

  }
}
//department to request service from select buttion
operation.addEventListener('change',(e)=>{
  const opt = e.target.value;
  
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
    modal_header.innerHTML="";
    modal_header.innerHTML+="Drug/item Request";

    var patno=$('#last_visit').val();  
    var consno=$('#consnumber').val();  
    //first check if diagnosis is enterred
    if(patno==null || patno==''){
      swal('','please select patient first','error'); 
      $('#operation').prop('selectedIndex',0);    
    } 
    else{
      //check if patient diagnosis is entered
  
      formdata ={
        pid:patno,
        consno:consno,
      }
      var conf_diag='';
      $.ajax({
        url: '/consult/check_diagnosis_entry/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
         var jdata=data;
         jdata.forEach(element => { 
          conf_diag=element.cd;
         })

        if(conf_diag=='none'){
         swal('','Confirmed Diagnosis not found','info');
          $('#operation').prop('selectedIndex',0);
          $('.btndiagnosis').trigger('click');
         }
         else{
          $('#billOutputSvs').hide();
          $('#admdiv').hide();
          $('#clinicBook').hide();
          $('#pharOuttable').show();
          $('#pharmacyModal').modal('show');

         }
          /* data.forEach(element => {
             pd=element.provisional_diagnosis;
             cd=element.confirmed_diagnosis;

           }) */         
        }
      });
      
    }   
       
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
})
function loaddate(){
  $( "#pdate" ).datepicker({
    dateFormat: 'dd-mm-yy',
});
}

//searching service to request
search_service.addEventListener('keyup',(e)=>{

  const pid = e.target.value;
  const opt = operation.value;
  
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


$('#search_pharmacy').on('keyup',function(){

  var searchValue =$(this).val();  
  var store =$('#prescstore').val();   
 
  if(searchValue.trim().length>0){
      //console.log(searchValue);
      pharSearchTbBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_pharm_search/",{
      body:JSON.stringify({ searchText:searchValue,stid:store}),
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
            <td>${item.balance}</td>             
            <td style="display:none;">${item.servePoint}</td>                      
                                  
            </tr>`
        });
      }
    })
  }
  else{
    pharSearchTbBody.innerHTML='';
  }

})

$("#pharSearchTb").on('click', 'tr', function() {
  var cost=0;
      var currentRow=$(this).closest("tr");      
      
      var normal_rate=currentRow.find("td:eq(2)").text(); 
      var special_rate=currentRow.find("td:eq(3)").text();   

      var servPnt=currentRow.find("td:eq(6)").text();
      const pym=document.querySelector('#pymode').value;

      if(pym.includes('cash')){
          cost=normal_rate;
      }
      else{
          cost=special_rate;
      }

     //storename column 2
     /*
     <select class='dos'>
            <option value='0'>----</option>
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
            <option value="IV">IV</option>
            <option value="2ml">2ml</option>
            <option value="5ml">5ml</option>
            <option value="10ml">10ml</option>
            <option value="15ml">15ml</option>
        </select>
     */ 
     pharOuttableBody.innerHTML+=
      `<tr>              
      <td style="display:none;">${currentRow.find("td:eq(0)").text()}</td>      
      <td>${currentRow.find("td:eq(1)").text()}</td>   
      
      <td contenteditable='true'>0</td>
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
  <td contenteditable='true' class='svc_qnt text-center' id="txt_area_qnt">1</td>
  <td>${currentRow.find("td:eq(4)").text()}</td>
  <td>${currentRow.find("td:eq(5)").text()}</td>
  <td style="display:none;">${cost}</td>       
  <td><button class="btn btn-danger btn-sm btnRemove">X</button></td>
      </tr>`
});
//<textarea rows="1" cols="3" >1</textarea></td>
$(".resultTableBody").on('click', 'tr', function() {
  var cost;
      var currentRow=$(this).closest("tr"); 
      
      var svs_name=currentRow.find("td:eq(0)").text(); 
      var normal_rate=currentRow.find("td:eq(1)").text(); 
      var special_rate=currentRow.find("td:eq(2)").text(); 
      var dept=currentRow.find("td:eq(3)").text();
      var svs_code=currentRow.find("td:eq(4)").text();

      const pym=document.querySelector('#pymode').value;

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
      <td><button class="btn btn-danger btn-sm btnRmsvs">X</button></td>    
      </tr>`
});

$("#pharOuttable").on('click', '.btnRemove', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})

$("#billOutputSvs").on('click', '.btnRmsvs', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})


//diagnosis search box

search_diag.addEventListener('keyup',(e)=>{
  const tp=document.querySelector("#diag_type");
  if(tp.selectedIndex==0){
    e.target.value='';
    swal('','Error!! select diagnosis type first','error');
  }
  else{

  const pid = e.target.value;
  
  if(pid.trim().length>0){
      //console.log(pid);
      diagOutputSvsBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_search_diagnosis/",{
      body:JSON.stringify({ searchText:pid }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
          diagOutputSvsBody.innerHTML='<tr><td colspan="4">No such diagnosis found </td></tr>';                     
      }
      else{
        data.forEach((item)=>{
            diagOutputSvsBody.innerHTML+=
            `<tr>              
            <td>${item.disease_name}</td>
            <td style="display:none;" >${item.disease_code}</td>
            <td><input type='button' class="btn btn-success btn-sm btnSave" value='save'></td>
            </tr>`
        });
      }
    })
  }
  else{
    diagOutputSvsBody.innerHTML='';
  }
}
})


$(".diagOutputSvsBody").on('click', '.btnSave', function() {

  var currentRow=$(this).closest("tr"); 
      
  var diag_name=currentRow.find("td:eq(0)").text(); 
  var diag_id=currentRow.find("td:eq(1)").text();

  var pid=$('#last_visit').val();
  var dtype=$('#diag_type').val();
  var conid=$('#consnumber').val();
 

  var formdata={
    pid:pid,
    diag_id:diag_id,
    diag_name:diag_name,
    diag_type:dtype,
    conid:conid
  }

if(confirm('SAVE '+dtype+" diagnosis["+diag_name+"] ?")){    
    $.ajax({
      url: '/consult/save_diagnosis/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
          if (data) {
            $('#diagOutputSvs tbody tr').remove();
            $('#diag_type').prop('selectedIndex',0);
            document.querySelector('#search_diag').value='';
            swal('',data.res,'success');
            $('.btndr_request').trigger('click');
           }
          }
    });
  }

})


function check_load_patient(){
  var pid=$('#last_visit').val();
  if(pid==""){
      e.preventDefault()
      e.target.value='';
      swal('','ERROR!! please select patient first','info');
  }
}
//doctors notes restrictions
doctor_notes.addEventListener('keyup',(e)=>{
  check_load_patient();
})
//saving doctors notes
$('#save_notes').on('click',function(){
     var consNo =$('#consnumber').val();
     var ptype =$('#pat_type').val();
     var pid=$('#last_visit').val();
     var hnotes=$('#hist_doctor_notes').val();
     var pnotes=$('#doctor_notes').val();
     var vno=$('#visitno').val();
     var complains=$('#chiefcomplain').val();

     //get tb screening data
     var tbdata =[]
     var tb=document.querySelector('#tbscreen');
     var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
      tbdata.push({
            code:tb.rows[i].cells[0].innerHTML,           
            status:tb.rows[i].cells[1].children[0].value,
            comment:tb.rows[i].cells[2].innerHTML,
        });            
    }

     
     if(pnotes=='' || hnotes==''){
       swal('','Sorry !! some notes should be entered','error');       
     }
     else{
      if(confirm('Have you cross checked your notes?')){
        var formdata={
          pid:pid,
          ptype:ptype,
          vno:vno,
          hnotes:hnotes,
          pnotes:pnotes,
          consNo:consNo,
          complains:complains,
          tbd:tbdata,
        }
        $.ajax({
         url: '/consult/save_doctor_notes/',
         data: JSON.stringify(formdata), 
         method:'POST',       
         dataType: 'json',
         success: function (data) {
           swal('',data.msg,'success');
           $('.btndiagnosis').trigger('click');
           $('#hist_doctor_notes').val('');
           $('#doctor_notes').val('');
           $('#chiefcomplain').val('');
           }
       });
      }
     }
})

$('.btn_drnotes').on('click',function(){
  $('.btnpat_details').trigger('click');
  //add patient details similar function with click to remove
  //currentRow.addClass('bg-info').siblings().removeClass('bg-info');
})


btn_confirm_request.addEventListener('click',(e)=>{

  var opt=document.querySelector('#operation').value;
  const pid=$('#last_visit').val();
  const pym=$('#pymode2').val();
  var pt=$('#pat_type').val();
  var consno=$('#consnumber').val();
  var vno=$('#visitno').val();

  var pystatus='';
  if(pym=='cash'){
    pystatus='pending';
  }
  else{
    pystatus='paid';
  }
  var bill=[];
  var url='';

  if(opt==1||opt==2||opt==3||opt==7){
    url='/consult/save_svs_request/';
    var tb = document.getElementById('billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            vno:vno,
            pym:pym,
            consno:consno,
            oper:opt,
            pyst:pystatus,
            ptype:pt,
            btype:'normal',
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            cost:tb.rows[i].cells[2].innerHTML,
            dpt:tb.rows[i].cells[3].innerHTML
        });            
    }
  }

else if(opt==4){
  var tb = document.getElementById('pharOuttable');
 
  var pt=$('#pat_type').val();
  url='/consult/savePrescription/';
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            oper:opt,
            vno:vno,
            consno:consno,
            pyst:pystatus,
            ptype:pt,
            code:tb.rows[i].cells[0].innerHTML,           
            dose:replacebr(tb.rows[i].cells[2].innerHTML.trim()),//.children[0].value,
            freq:tb.rows[i].cells[3].children[0].value,
            day:replacebr(tb.rows[i].cells[4].children[0].value),
            qnt:replacebr(tb.rows[i].cells[5].innerHTML.trim()),//children[0].value,
            storeName:tb.rows[i].cells[7].innerHTML,
            price:tb.rows[i].cells[8].innerHTML,
            cons_type:'general'
        });            
    }
} 

else if(opt==5){
  var ward=document.querySelector('#ward').value;
  var notes=document.querySelector('#admitNotes').value;
  var cardNo=$('#last_visit').val();
  url='/consult/saveAdmission/';

      if(notes=='' ){
        swal('','Sorry !! some notes should be entered','error');
      }
      else{
        if(pid !==''){
          var formdata={
            pid:cardNo,
            pnotes:notes,
            ward:ward
          }
        bill=formdata;
        }
        else{
          swal('','select patient first','error');
        }
    }
  } 
  else if(opt==6){
    var pdate=document.querySelector('#prdate').value;
    var urgency=document.querySelector('#bkType').value;
    var dept=document.querySelector('#bkDept').value;
    var notes=document.querySelector('#clinicNotes').value;
    var cardNo=$('#last_visit').val();

    url='/consult/saveClinicBook/';
  
        if(notes=='' ){
          swal('','Sorry !! some notes should be entered','error');
        }
        else{
          if(pid !==''){
            var formdata={
              pid:cardNo,
              pnotes:notes,
              dept:dept,
              urgency:urgency,
              pdate:pdate
            }
          bill=formdata;
          }
          else{
            swal('','select patient first','error');
          }
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
                  swal('',data.msg,'success');
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
  
})

function replacebr(str){
  var rtn=str.replace(/<br>(?=(?:\s*<[^>]*>)*$)|(<br>)|<[^>]*>/gi, (x,y) => y ? ' & ' : '');
  return rtn;
}

//pharmacy quantity calculation
$('#pharOuttable tbody').on('keyup','.svc_qnt',function(e){
 
  var currenRow=$(this).closest("tr");   
  var qnt = parseInt(currenRow.find("td:eq(5)").text());

  var dos=parseInt(currenRow.find("td:eq(2)").text());
  var freq=currenRow.find(".freq").val();
  var days=currenRow.find(".days").val();
  
  if(dos==0 || freq=='0' ||days=='0'){
    swal('','fill item options appropriately','info');
     currenRow.find("td:eq(5)").text('0');
  }
  else{
    if(isNaN(qnt)){}
    else{  
      if(qnt>0){
     
      var bal=parseFloat(currenRow.find("td:eq(6)").text());
      var hid_bal=parseFloat(currenRow.find("td:eq(8)").text());

           
      if(qnt>bal){
        swal('','Cannot request more than Available','info');
        currenRow.find("td:eq(5)").text('0');
        currenRow.find("td:eq(6)").html('').append(hid_bal);
      }
      else{
        currenRow.find("td:eq(6)").html('').append(bal-qnt);
      }   
     
    }  
    else{
      swal('','incorrect quantity entry','error');
      currenRow.find("td:eq(5)").text('0');
    }      
  }
  }
})
btnLabRes.addEventListener('click',(e)=>{
  var cardNo=$('#last_visit').val();
  document.querySelector('#resDept').value='lab';

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

btnRadRes.addEventListener('click',(e)=>{
  var cardNo=$('#last_visit').val();
  document.querySelector('#resDept').value='rad';
  
  if(cardNo !==''){
    if(cardNo.trim().length>0){     
      //tableOutput.innerHTML=''; //for table refresh
      
      fetch("/rad/consResultSearch/",{
      body:JSON.stringify({ searchText:cardNo }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
   if(data.length >0){
    //console.log(data);
    resOutputSvsBody.innerHTML='';
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
    resOutputSvsBody.innerHTML='<tr><td colspan="4">no item found/request not received</td></tr>';  
   
   }
    
  })
  }
}

else{
    swal('select patient first','','info');
  }
})

$(".resOutputSvsBody").on('click', 'tr', function() {
 var ptype=document.querySelector("#resDept").value;
 var pname=document.querySelector("#pname").value;
 
  var currentRow=$(this).closest("tr");       
  var reffNo=currentRow.find("td:eq(0)").text(); 
  var service=currentRow.find("td:eq(2)").text(); 
  var status=currentRow.find("td:eq(3)").text();  
  
  if(status=='in-progress'){
    swal('','No results. Examination in progress','info');
  }
  else if(status=='complete' && ptype=='lab'){
    swal('','No results.Test complete but not verified','info');
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

$('#referaltype').on('change',function(){
  var rtype =$(this).val();
  if(rtype!==''){
    if(rtype.trim()!==''){
      fetch("/consult/listDestination/",{
      body:JSON.stringify({ searchText:rtype }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){          
        
    }
    else{ 
      if(rtype=='internal'){        
        document.querySelector('#destlabel').innerHTML='Select Clinic';
      }
      else if(rtype=='external'){
        document.querySelector('#destlabel').innerHTML='Select Facility';
      }                        
      document.querySelector('#rfdestination').innerHTML='';      
      var jdata=data;              
      jdata.forEach(element => {          
          document.querySelector('#rfdestination').innerHTML+=`<option value="${element.desid}">${element.desname}</option>`;
        })
    }

  })
  }
  }
})

$('#btnconfreferral').on('click',function(){
  var rftype=$('#referaltype').val();
  var rfdes=$('#rfdestination').val();
  var cardNo=$('#last_visit').val();
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

function internalReff(){
  var formdata={
    pid:document.querySelector('#last_visit').value,
    schname:document.querySelector('#pymode2').value,
    clname:document.querySelector('#rclinic').value,
    vtype:'referral',
  }
  $.ajax({
    url: '/consult/referralOpvisit/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      //alert(data.msg);
    }
  });          
}

})
var prevnotesBody=document.querySelector('.prevnotesBody');
$('#prevtd_notes').on('click', function(){
  var cardno=$('#last_visit').val();
  fetch("/consult/findprevnotes/",{
    body:JSON.stringify({ searchText:cardno }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  prevnotesBody.innerHTML='';
    data.forEach((item)=>{
      prevnotesBody.innerHTML+=
        `<tr>
        <td>${item.cdate}  ${item.ctime} </td>       
        <td>${item.hist}</td>
        <td>${item.phnotes}</td>
        <td>Provisional:${item.pdiag}  Confirmed:${item.cdiag}</td>
        <td>${item.doc}</td>
        <td>${item.svs}</td>                            
        </tr>`
    });
    $('#prevnotesModal').modal('show');
}) 
})

$('#btnptcard').on('click',function(){
  $('#patcard').modal('show');
})

$('#pcgenerate').on('click', function(){
  var pno=$('#last_visit').val();
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
    $('#divpcardtb').show();
    $('#divpcardpdf').hide();
    loadpatcard(data);
  }
})


$('#pdfgenerate').on('click', function(){
  var pno=$('#last_visit').val();
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
    $('#divpcardtb').hide();
    $('#divpcardpdf').show();
    patientcardpdf(data);
  }
})

var pcardbody=document.querySelector('#pcardbody')

function loadpatcard(data){

  fetch("/consult/patcard/",{
    body:data,
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  pcardbody.innerHTML='';
  if(data.length===0){
    pcardbody.innerHTML+='<tr><td colspan="6"> no medical history found</td></tr>';
  }
  else{
    var jdata=data;        
    jdata.forEach(element => {                      
      pcardbody.innerHTML+=
      `<tr>
          <td style='display:none'>${element.vno}</td>
          <td>${element.cdate}@${element.ctime}</td>
          <td contenteditable='true'><b>Chief Complain</b>:${element.ccomplain}<br><b>History</b>:${element.hist}<br><b>Physical Exam</b>:${element.phnotes}<br><b>Continuation Notes</b>:${element.cnotes}</td>         
          <td contenteditable='true'><b>Provisional</b>:${element.pdiag}<br><b>Confirmed</b>:${element.cdiag}</td>         
          <td>${element.svs}</td>
          <td></td>
          <td>${element.presc}</td>
          <td class='user_doc'>${element.doc}</td>
          <td>${element.disp}</td>                                  
          <td>${element.pharmacist}</td>                                  
          <td><input type='button' class="btn btn-info btn-sm btnUpd" value='Update'></td>                                 
      </tr>`                 
    });
  }
  
  checkusername();
  $('#patcard').modal('show');
})
}

function checkusername(){
  var usname=$('#usname').val();  
  $('#pcard tr').each(function () {    
    if ($(this).find('.user_doc').html() == usname) {
        $(this).find('.btnUpd').prop('disabled', false);
    }
    else {
        $(this).find('.btnUpd').prop('disabled', true);
    }
});

}


$('#pcard tbody').on('click','.btnUpd',function () {
  var currentRow=$(this).closest("tr"); 
  var pid=currentRow.find("td:eq(2)").text();
  alert('notes updated');
  $('#pcgenerate').trigger('click')
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
          <td><b>Patient Name:</b>${$('#pname').val()}</td>       
          <td><b>Hosp No:</b>${$('#last_visit').val()}</td>       
          <td><b>Age:</b>${$('#pat_age').val()}</td>
          <td><b>Gender:</b>${$('#pgender').val()}</td>
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

  $('#patcard').modal('show');
})
}


////////////////////////// death notification ///////////////////////////////////

var tbdetailsBody=document.querySelector('#tbdetailsBody');
$('#btnConfirModal').on('click',(e)=>{
   e.preventDefault();
   //collect all values
   tbdetailsBody.innerHTML='';
   var pno=$('#ipop').val();
   var fname=$('#dc_name').val();
   var age=$('#dc_age').val();
   var sex=$('#dc_gender').val();
   var bfname=$('#dc_bfullname').val();
   var bphone=$('#dc_bphone').val();
   var bnid=$('#dc_bidno').val();
   var brelation=$('#dc_brelation').val();
   var nfname=$('#dc_nkfullname').val();
   var nphone=$('#dc_nkage').val();
   var nnid=$('#dc_nkidno').val();
   var nrelation=$('#dc_relation').val();
   var cause=$('#dcause').val();
   var place=$('#pod').val();
   var notes=$('#clnotes').val();
   var d1=$('#sheetno').val();
   var doc=$('#docname').val();
   var resg=$('#designation').val();
   var ppost=$('#station').val();

   tbdetailsBody.innerHTML+=
   `<tr>
       <td colspan='4'><b>Deceased Details;</b></td>
    </tr>
    <tr>
       <td>Hosp No:${pno}</td>
       <td>Name:${fname}</td>
       <td>Age:${age}</td>
       <td>Sex:${sex}</td>
    </tr>

    <tr>
       <td colspan='4'><b>Brought By;</b></td>
    </tr>
    <tr>
       <td>Name:${bfname}</td>
       <td>Phone:${bphone}</td>
       <td>Svno/Idno:${bnid}</td>
       <td>Relation:${brelation}</td>
    </tr>
    <tr>
       <td colspan='4'><b>Next of Kin Details;</b></td>
    </tr>
    <tr>
       <td>Name:${nfname}</td>
       <td>Phone:${nphone}</td>
       <td>Idno:${nnid}</td>
       <td>Relation:${nrelation}</td>
    </tr>
    <tr>
       <td colspan='4'><b>Clinical Notes;</b></td>
    </tr>
    <tr>
       <td>General Cause:${cause}</td>
       <td>Place:${place}</td>
       <td colspan='2' style="word-wrap:break-word;">${notes}</td>
    </tr>
    <tr>
      <td colspan='4'><b>Doctor's Consent;</b></td>
    </tr>
    <tr>
        <td>Sheet No:${d1}</td>
        <td>Name: ${doc}</td>
        <td>Cadre:${resg}</td>
        <td>Police Post:${ppost}</td>
    </tr>
    `; 

  // create modal to confirm the details
    $('#confirmModal').modal('show');
  // the if yes save notification
})

$('#btncopy').on('click',(e)=>{
  e.preventDefault();
  var bfname=$('#dc_bfullname').val();
   var bphone=$('#dc_bphone').val();
   var bnid=$('#dc_bidno').val();
   var brelation=$('#dc_brelation').val();

   $('#dc_nkfullname').val(bfname);
   $('#dc_nkage').val(bphone);
   $('#dc_nkidno').val(bnid);
   $('#dc_relation').val(brelation);

})

$('#btnNotifyDeath').on('click',(e)=>{
    e.preventDefault();
    var formdata = $("#d1form").serialize();
    
    $.ajax({
      url: '/consult/saveNotification/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
          if (data) {
            $('#confirmModal').modal('hide');
            $('form#d1form').trigger("reset");
            swal('',data.msg,"success");                       
          }
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
          swal("Saving Notification!!","Internal Server Error occurred. try again later", "error");
        }
      }
  });

})



// inpatient continuation notes
//first check if history ws eve entered for the visit
// if not enter first
// else continue to show the pop up
$('#cont_notes').on('click', function(){
  swal('','button clicked', 'success');
})


//triage entry

$('#rectriage').on('click', function(){
  //check for consultation payment first 
    var pid=$('#last_visit').val();
    fetch("/nurse/check_cons_payment/",{
      body:JSON.stringify({pid:pid}),
      method: "POST",
    })
  .then((res)=>res.json())
  .then((data)=>{
   
    if (data.msg=='paid'){ //load triage modal
      
      document.querySelector('#tr_pname').innerHTML=$('#pname').val();
      document.querySelector('#tr_age').innerHTML=$('#pat_age').val();
      document.querySelector('#trgender').innerHTML=$('#pgender').val();
      document.querySelector('#tr_hospno').innerHTML=pid;                 
      document.querySelector('#trpatid').value=pid;                 
      document.querySelector('#trvno').value=$('#visitno').val();                 
      document.querySelector('#trpymode').innerHTML=$('#pymode2').val();
      document.querySelector('#trurgency').innerHTML=$('#nsurgency').val();
      $('#triageFormModal').modal('show');
    }
    else{
      swal('','Consultation fee not paid','info')
    }
  })
})


$('#btnsave').on('click',function(){   
  var formdata = $("#triageForm").serialize();
  var pname =document.querySelector('#tr_pname').innerHTML;
      $.ajax({
        url: '/nurse/save_triage/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            if (data.user) {             
              swal('',data.user.msg +"for ["+pname+"] saved successfully",'success')

              $('#triageFormModal').modal('hide');
              $('form#triageForm').trigger("reset");
              document.querySelector('#tr_pname').innerHTML="";
              document.querySelector('#tr_age').innerHTML="";
              document.querySelector('#trgender').innerHTML="";
              document.querySelector('#tr_hospno').innerHTML="";                 
              document.querySelector('#trpymode').innerHTML="";
              document.querySelector('#trurgency').innerHTML="";
              document.querySelector('#muac').innerHTML="";
              document.querySelector('#spo').innerHTML="";

            }
        }
    });
    

})