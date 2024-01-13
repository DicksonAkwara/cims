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

    var pid = e.target.value;  
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
            document.querySelector('#sttfind').innerHTML='patient not found';
            //document.querySelector('#pclinicnm').css("background-color","light-gray");
                        
        }
        else{
          
          var jdata=data;          
          var pid,cname          
          document.querySelector('#sttfind').innerHTML='';

          jdata.forEach(element => { 
          pid =element.pid;  
          cname=element.clname       
          document.querySelector('#pname').value=element.fname;
          document.querySelector('#last_visit').value=pid; 
          document.querySelector('#pat_age').value=element.age;
          document.querySelector('#pgender').value=element.gender;
          document.querySelector('#pymode').value=element.scheme_type+"("+element.scheme_name+")";
          document.querySelector('#pymode2').value=element.scheme_name;
          document.querySelector('#pclinicnm').value=element.clname;
          })
          receive_patient(pid);
          var clname=$('#cllname option:selected').text();
          if(clname.trim()==cname.trim()){
            $('#pclinicnm').removeClass('border-danger');//.siblings().removeClass('bg-success');
            $('#pclinicnm').addClass('border-success');
            loadHidden();
          }
          else {
            $('#pclinicnm').removeClass('border-success');
            $('#pclinicnm').addClass('border-danger');
          }         
         }
      })
    }

})


function receive_patient(id){
  var clname=$('#cllname option:selected').text();
  var clid=$('#cllname').val();
  formdata ={
    pid:id,
    cname:clname,
    clid:clid
  }
  $.ajax({
    url: '/consult/receive_patient/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      document.querySelector('#consnumber').value= data.cons_reff;
      document.querySelector('#consnumber1').value= data.cons_reff;
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
  });

}



btn_collapse.addEventListener('click',(e)=>{
  var pid=$('#last_visit').val();  
  if(pid==""){
      e.preventDefault()
      alert('ERROR!! please select patient first');
  }
  else{
    fetch("/consult/triage_search/",{
      body:JSON.stringify({ searchText:pid }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      if(data.length===0){
        triageTable.innerHTML='<tr><td colspan="4">No details found </td></tr>'
      }
      else{
        console.log(data)
        //data.forEach((item)=>{        
          triageTableBody.innerHTML= //remove the additional sign
          `<tr><td colspan='5'>Triage Time:${data.triage_time}</td></tr>
          <tr>                       
          <td>Body Temp:${data.temperature}(C)</td>          
          <td>Blood Press:${data.blood_pressure}(mm/hg)</td>
          <td>Pulse Rate:${data.pulse_rate}(b/m)</td>
          <td>Weight:${data.weight}(Kg)</td>          
          <td>Height:${data.height}(cm)</td>                
          </tr>`
      //});

      }
  })

  }
})
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
   
    var patno=document.querySelector('#last_visit').value;    
    //first check if diagnosis is enterred
    if(patno==null || patno==''){
      alert('please select patient first'); 
      $('#operation').prop('selectedIndex',0);    
    } 
    else{
      //check if patient diagnosis is entered
      formdata ={
        pid:patno
      }
      $.ajax({
        url: '/consult/check_diagnosis_entry/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
          data.forEach(element => {
             var pd=element.provisional_diagnosis;
             var cd=element.confirmed_diagnosis;

             if(pd !=null || cd !=null){
              $('#billOutputSvs').hide();
              $('#admdiv').hide();
              $('#clinicBook').hide();
              $('#pharOuttable').show();
              $('#pharmacyModal').modal('show');
             }
             else{
              alert('Diagnosis not found');
              $('#operation').prop('selectedIndex',0);
             }
           })          
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


search_pharmacy.addEventListener('keyup',(e)=>{

  const searchValue = e.target.value;  
  pat_type=document.querySelector('#pat_type').value;
  
  
  if(searchValue.trim().length>0){
      //console.log(searchValue);
      pharSearchTbBody.innerHTML=''; //for table refresh
      fetch("/consult/cons_pharm_search/",{
      body:JSON.stringify({ searchText:searchValue,pt:pat_type}),
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
      const pym=document.querySelector('#pymode').value;

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
  <td style="display:none;">${currentRow.find("td:eq(5)").text()}</td>     
  <td><button class="btn btn-danger btn-sm btnRemove">Remove</button></td>
      </tr>`
});

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
      </tr>`
});

$("#pharOuttable").on('click', '.btnRemove', function() {  
  var currentRow=$(this).closest("tr");
  var svs_name=currentRow.find("td:eq(1)").text(); 
  if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){       
      $(this).closest('tr').remove();      
  }
})

$("#billOutputSvs").on('click', 'tr', function() {  
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
    alert('Error!! select diagnosis type first');
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
            <td><input class="btn btn-success btn-sm btnSave" value='save'></td>
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
  //var diag_id=currentRow.find("td:eq(1)").text();

  var pid=$('#last_visit').val();
  var dtype=$('#diag_type').val();
 

  var formdata={
    pid:pid,
    diag_name:diag_name,
    diag_type:dtype,
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
            alert(data.res);
           }
          }
    });
  }

})

//doctors notes restrictions
doctor_notes.addEventListener('keyup',(e)=>{
  var pid=$('#last_visit').val();
  if(pid==""){
      e.preventDefault()
      e.target.value='';
      alert('ERROR!! please select patient first');
  }

})
//saving doctors notes
btn_doctor_notes.addEventListener('click',(e)=>{
     var rfdes =doctor_notes.value;
     var pid=$('#last_visit').val();
     if(pnotes==''){
       alert('Sorry !! some notes should be entered');       
     }
     else{
       var formdata={
         pid:pid,
         pnotes:pnotes
       }
       $.ajax({
        url: '/consult/save_doctor_notes/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
          alert(data.msg);
            }
      });

     }
})
//doctor confirm request sent


btn_confirm_request.addEventListener('click',(e)=>{

  var opt=document.querySelector('#operation').value;
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
  var url='';

  if(opt==1||opt==2||opt==3||opt==7){
    url='/consult/save_svs_request/';
    var tb = document.getElementById('billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            oper:opt,
            pyst:pystatus,
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            cost:tb.rows[i].cells[2].innerHTML,
            dpt:tb.rows[i].cells[3].innerHTML
        });            
    }
  }

else if(opt==4){
  var tb = document.getElementById('pharOuttable');
  url='/consult/savePrescription/';
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            oper:opt,
            pyst:pystatus,
            code:tb.rows[i].cells[0].innerHTML,           
            dose:tb.rows[i].cells[2].children[0].value,
            freq:tb.rows[i].cells[3].children[0].value,
            day:tb.rows[i].cells[4].children[0].value,
            qnt:tb.rows[i].cells[5].children[0].value,
            storeName:tb.rows[i].cells[7].innerHTML
        });            
    }

} 

else if(opt==5){
  var ward=document.querySelector('#ward').value;
  var notes=document.querySelector('#admitNotes').value;
  var cardNo=$('#last_visit').val();
  url='/consult/saveAdmission/';

      if(notes=='' ){
        alert('Sorry !! some notes should be entered');
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
          alert('select patient first');
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
          alert('Sorry !! some notes should be entered');
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
            alert('select patient first');
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
                  alert(data.msg);
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



//pharmacy quantity calculation
$('#pharOuttable').on('keyup','.svc_qnt',function(e){
  //tb.rows[i].cells[2].children[0].value
  
  var currenRow=$(this).closest("tr");   
  var qnt = parseFloat(e.target.value);

  var dos=currenRow.find(".dos").val();
  var freq=currenRow.find(".freq").val();
  var days=currenRow.find(".days").val();
  
  if(dos=='0' || freq=='0' ||days=='0'){
    alert('fill item options appropriately');
    //resetAmount();
  }
  else{
    if(isNaN(qnt)){}
    else{  
      if(qnt>0){
     
      var bal=parseFloat(currenRow.find("td:eq(6)").text());
      var hid_bal=parseFloat(currenRow.find("td:eq(8)").text());

           
      if(qnt>bal){
        alert('Cannot request more than Available');
        e.target.value=1;
        currenRow.find("td:eq(6)").html('').append(hid_bal);
      }
      else{
        currenRow.find("td:eq(6)").html('').append(bal-qnt);
      }   
     
    }  
    else{
      alert('incorrect quantity entry');
      //resetAmount();
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
    }

  })
  }
}

else{
    alert('select patient first');
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
    alert('select patient first');
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
    alert('No results. Examination in progress');
  }
  else if(status=='complete' && ptype=='lab'){
    alert('No results.Test complete but not verified');
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
  var rclinic=$('#rclinic').val();
 

      if(cardNo=='' ){
        alert('Sorry !! select patient first');
      }
      else{
        if(rfdes !==''){
         var formdata={
            pid:cardNo,
            rfrom:rclinic,
            rfdes:rfdes,
            rftype:rftype
          }
          $.ajax({
            url: '/consult/saveReferral/',
            data: formdata, 
            method:'POST',       
            dataType: 'json',
            success: function (data) {
              alert(data.msg);
              if(rftype=='internal'){internalReff();}              
              }
          });
     
        }
        else{
          alert('select referral to');
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

$('#vtcard').on('click', function(){
  var slct=$('#cllname option:selected').text();
  //alert(slct);
})

$('#denpatcat').on('change', function(){
  var upperA,lowerA,upperP,lowerP;
  upperA=[11,12,13,14,15,16,17,18,21,22,23,24,25,26,27,28];
  lowerA=[41,42,43,44,45,46,47,48,31,32,33,34,35,36,37,38]
  upperP=[51,52,53,54,55,61,62,63,64,65]
  lowerP=[81,82,83,84,85,71,72,73,74,75]

  var pcat=$(this).val();
  if(pcat=='Adult'){
    document.querySelector('#denUpper').innerHTML='';
    document.querySelector('#denUpper').innerHTML='<option value="none">--upper--</option>';
    document.querySelector('#denLower').innerHTML='';
    document.querySelector('#denLower').innerHTML='<option value="none">--lower--</option>';

    $.each(upperA, function(index,value){
      document.querySelector('#denUpper').innerHTML+=`<option value="${value}">${value}</option>`;      
    });
    $.each(lowerA, function(index,value){
      document.querySelector('#denLower').innerHTML+=`<option value="${value}">${value}</option>`;      
    });
  }
  else if(pcat=='peads'){
    document.querySelector('#denUpper').innerHTML='';
    document.querySelector('#denUpper').innerHTML='<option value="none">--upper--</option>';
    document.querySelector('#denLower').innerHTML='';
    document.querySelector('#denLower').innerHTML='<option value="none">--lower--</option>';

    $.each(upperP, function(index,value){
      document.querySelector('#denUpper').innerHTML+=`<option value="${value}">${value}</option>`;      
    });
    $.each(lowerP, function(index,value){
      document.querySelector('#denLower').innerHTML+=`<option value="${value}">${value}</option>`;      
    });
  }
})

$('#denUpper').on('change', function(){
  var slc=$(this).val();
  var ttval=$('#thselect').val();
  if(ttval==''){
  document.querySelector('#thselect').value=slc;
  }
  else{document.querySelector('#thselect').value=ttval+","+slc;}
  
})
$('#denLower').on('change', function(){
  var slc=$(this).val();
  var ttval=$('#thselect').val();
  if(ttval==''){
  document.querySelector('#thselect').value=slc;
  }
  else{document.querySelector('#thselect').value=ttval+","+slc;}
  
})
$('#cllname').on('change',function(){
  if($(this).val()!=='none'){
    $('#cllname').removeClass('border-danger');
  }
})

$('#btnOpenClerk').on('click',function(){
  var rgcln=$('#pclinicnm').val().trim();//registered clinic
  var spcln=$('#cllname option:selected').text().trim();//selected special clinic
  
  if(spcln=='select'){ 
    $('#cllname').addClass('border-danger');
    alert('select station clinic first');
  }
  else{    
    if(rgcln !==spcln){
      alert('patient not queued on '+spcln+' clinic or referral not done');
    }
    else{
      if(spcln.includes('Dental')){ 
        $("#divDental").show();
        $("#divEye").hide(); 
        $("#divGbv").hide();
        $("#divGeneral").hide(); 
           
      }
      else if(spcln.includes('Eye')){
        
        $("#divEye").show();
        $("#divDental").hide();        
        $("#divGbv").hide();
        $("#divGeneral").hide();
        
      }
     /* else if(spcln.includes('GBV')){
        $("#divGbv").show();
        $("#divDental").hide();
        $("#divEye").hide();        
        $("#divGeneral").hide();
        
      }*/
      else{
        $("#divGeneral").show();
        $("#divDental").hide();
        $("#divEye").hide(); 
        $("#divGbv").hide();       
        
      }
    }
  }
   
})


function loadHidden(){ 
  var id=$('#last_visit').val();
  var cname=$('#cllname option:selected').text();

  document.querySelector('#spid').value=id; 
  document.querySelector('#sclname').value=cname;
  document.querySelector('#spid1').value=id; 
  document.querySelector('#sclname1').value=cname;
}

$('#submitDental').on('click',function(){   
  var formdata = $("#dentalForm").serialize();  
  $.ajax({
    url: '/consult/savespnotes/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          alert(data.msg); 
          $('form#dentalForm').trigger("reset");
                        
      }                    
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          alert('Internal Server Error occurred. try again');
      }
    }
})
})





