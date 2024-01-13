
const county = document.querySelector('#county');
const scounty = document.querySelector('#scounty');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
/*btnSubmit.addEventListener('click',(e)=>{
  e.preventDefault();
  var formdata = $("#ipRegForm").serialize();
  console.log(formdata);
      $.ajax({
        url: '/records/register_new/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            if (data) {  
              alert(data.msg) ;          
            }
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    });
    $('form#ipRegForm').trigger("reset");

})*/



 function check_paymode(){
    var pm = document.getElementById('ppaymode').value;
    if(pm =='Non-scheme'){
      document.getElementById('pscheme').selectedIndex = 4;      
      $('#mbNumber').prop('disabled', true);
    }
    else if(pm=='Scheme'){  
      document.getElementById('pscheme').selectedIndex = 0;      
      $('#mbNumber').prop('disabled', false);
    }
  }

  function find_subcounties(county){
    var cnt =county;
    //var cnt = e.target.value;
    if(cnt.trim().length>0){    
      fetch("/records/load_sub_counties/",{
      body:JSON.stringify({ searchText:cnt }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
       if(data.length===0){
         //console.log(data);
          
      }
      else{
        $("#scounty").empty();
        data.forEach((item)=>{
          //console.log(item.sub_county)
            scounty.innerHTML+=`<option value="${item.sub_county}">${item.sub_county}</option>`
        });
      }
    })
  }

  }

 $('#county').on('change',function(){
    var cnt = $(this).val();
    find_subcounties(cnt);    
  })

  function loadscounty(scn){
    setTimeout(function() {
       $('#scounty').val(`${scn}`);
     }, 2000);
  }

  function calculate_pAge(){
   var dob=$('#dob').val();
   past = new Date(dob)
   var today=new Date();
   var day = 1000 * 60 * 60 * 24 //milliseconds 
   var days=0;var months=0;var years=0;
  
  
   var diff=today.getTime()-past.getTime();
   if(diff>=0){
     var x = Math.floor(diff/day);
       if(x>=365){
         years=Math.floor(x/365);
         x=x%365;
         if(x>=31){
           months=Math.floor(x/31);
           days=x%31;
         }
         else{
           days=x;
         }
       }
       else{
         if(x>=31){
           months=Math.floor(x/31);
           days=x%31;
         }
         else{
           days=x;
         }
       }
       message=years+':yrs '+months+':mnths '+ days+':dys';
       document.querySelector('#act_years').innerHTML=message;      
       document.querySelector('#age').value=years;
       
   }
   else{
     alert('Date of birth cannot be greater than today');
     document.querySelector('#act_years').innerHTML='';
 
   }
  }
 
  $('#dob').change(function(){
   var past = new Date($(this).val())
   var today=new Date();
   var diff=today.getTime()-past.getTime();
   if(diff>=0){
     calculate_pAge();
   }
   else{
     alert('Date of birth cannot be greater than today');    
     var month = (today.getMonth() + 1);               
     var day = today.getDate();
     if (month < 10) 
         month = "0" + month;
     if (day < 10) 
         day = "0" + day;
     var res = today.getFullYear() + '-' + month + '-' + day;   
     $('#dob').val(res);
 
   }   
 });

 const searchField = document.querySelector('#patno');
 const tableOutput = document.querySelector('.tableOutput');
 const resultTableBody = document.querySelector('.rs-table-body');
 const selectPatientType = document.querySelector('#patienttype');
 const loadBtn = document.querySelector('.loadBtn');
 const p_age = document.querySelector('#age');


  $('#pptype').on('change',function(){
    var opt=$(this).val().trim()
    if(opt=='newAdm'){
      $('form#IpRegForm').trigger("reset");
      $(this).prop('selectedIndex',1);
    }
    else if('readm'){
      $('#readmModal').modal('show');
    }
    
  })
  
  $('#fmsubmit').on('click', function(e){
    e.preventDefault();
    var patno=$('#editPatno').val().trim();
    if(patno==''){
      swal('Patient Number','Search by outpatient number','info');
    }
    else{
      var formdata = $("#ipregistration").serialize();
      $.ajax({
        url: '/records/registerIp/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            if (data) {  
              swal(data.msg,'','success');
              $('form#ipregistration').trigger("reset");          
            }
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
            swal('','Internal Server Error occurred. try again','error');
          }
        }
    });
    
    }  

  })

$('#age').on('keyup',function(){  
    var age=parseInt($(this).val());
    var currentDateObj = new Date();
    var numberOfMlSeconds = currentDateObj.getTime();
    var addMlSeconds = age * 365 *24 *60 * 60 * 1000;
  
    var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
    var nDate = newDateObj.toISOString().substring(0,10);  
    document.querySelector('#dob').value=nDate;
    calculate_pAge();
  
  
  //console.log(nDate);
})


 $('#searchIpnumber').on('keyup',function(){
    const searchValue = $(this).val();
    if(searchValue.trim().length>0){
        //console.log(searchValue);
        resultTableBody.innerHTML=''; //for table refresh
        fetch("/records/searchInPatient/",{
        body:JSON.stringify({ searchText:searchValue }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        //console.log('data',data);
        if(data.length===0){
            resultTableBody.innerHTML='<tr><td colspan="4">No records found </td></tr>';
        }
        else{
          data.forEach((item)=>{

              resultTableBody.innerHTML+=

              `<tr>
              <td>${item.op_number}</td>
              <td>${item.fullname}</td>
              <td>${item.national_idno}</td>
              <td>${item.op_number}</td>
              <td>${item.residence}</td>
              <td style='display:none'>${item.patient_DOB}</td>
              <td style='display:none'>${item.patient_phone}</td>
              <td style='display:none'>${item.patient_age}</td>
              <td style='display:none'>${item.gender}</td>
              <td style='display:none'>${item.county}</td>
              <td style='display:none'>${item.sub_county}</td>
              <td style='display:none'>${item.nok_name}</td>              
              <td style='display:none'>${item.nok_phone}</td>
              <td style='display:none'>${item.nok_relation}</td>
             
              <td><button class="btn btn-success form-control btn-sm" id='btnloadIp'>Load</button></td>
              </tr>`;
          });
        }
      })
    }
    else{
     //tableOutput.style.display='block';
    }
 })

 $('#opsearchfield').on('keyup',function() {
  var id=$(this).val().trim();
  if(id==''){
    $('form#ipregistration').trigger("reset"); 
    document.querySelector('#act_years').innerHTML='';
  }
  else{
    fetch("/records/op_load_patient_details/",{
      body:JSON.stringify({ pat_id:id }),
      method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.length==0){
      document.querySelector('#searchindicator').innerHTML='no patient found';
    }
    else{
    data.forEach((item)=>{
      document.querySelector('#searchindicator').innerHTML='';   
      document.querySelector('#fullname').value=item.fullname;
      document.querySelector('#idno').value=item.national_idno;
      document.querySelector('#phone').value=item.patient_phone;
      //document.querySelector('#age').value=item.patient_age;
      document.querySelector('#dob').value=item.patient_DOB;
      document.querySelector('#gender').value=item.gender;
      document.querySelector('#county').value=item.county;
      //document.querySelector('#scounty').value=item.sub_county;
      document.querySelector('#residence').value=item.residence;
      document.querySelector('#nokname').value=item.nok_name;
      document.querySelector('#nokphone').value=item.nok_phone;
      document.querySelector('#relation').value=item.nok_relation;

      document.querySelector('#editPatno').value=item.op_number;

      $('#county').trigger("change");
      loadscounty(item.sub_county);
      calculate_pAge();
      //document.querySelector('#scounty').value=item.sub_county;
     
            
    })
   }
  })
  }
     
       
})

$('#tableOutput').on('click','#btnloadIp',function(){
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-info').siblings().removeClass('bg-info');

  var ipno=currentRow.find("td:eq(0)").text();
  var fname=currentRow.find("td:eq(1)").text();
  var id=currentRow.find("td:eq(2)").text();
  var fno=currentRow.find("td:eq(3)").text();
  var resd=currentRow.find("td:eq(4)").text();
  var dob=currentRow.find("td:eq(5)").text();
  var phone=currentRow.find("td:eq(6)").text();
  var age=currentRow.find("td:eq(7)").text();
  var sex=currentRow.find("td:eq(8)").text();
  var cnty=currentRow.find("td:eq(9)").text();
  var scnty=currentRow.find("td:eq(10)").text();
  var nokn=currentRow.find("td:eq(11)").text();
  var nokp=currentRow.find("td:eq(12)").text();
  var rel=currentRow.find("td:eq(13)").text();

  document.querySelector('#fullname').value=fname;
  document.querySelector('#idno').value=id;
  document.querySelector('#phone').value=phone;
  //document.querySelector('#age').value=age;
  document.querySelector('#dob').value=dob;
  document.querySelector('#gender').value=sex;
  document.querySelector('#county').value=cnty;
  //document.querySelector('#scounty').value=scnty;
  document.querySelector('#residence').value=resd;
  document.querySelector('#nokname').value=nokn;
  document.querySelector('#nokphone').value=nokp;
  document.querySelector('#relation').value=rel;
  document.querySelector('#editPatno').value=ipno;
  document.querySelector('#mfilenumber').value=fno;

  $('#readmModal').modal('hide');
  $('#county').trigger("change");
  loadscounty(scnty);
  calculate_pAge();
})

var admreqtableBody=document.querySelector('#admreqtableBody');
$('#admrequest').on('click', function(){
  //fetch today requests  
    fetch("/records/adm_request/",{
      method: "GET", 
      headers: {'X-CSRFToken': csrftoken}, 
    })
  .then((res)=>res.json())
  .then((data)=>{
    if(data.length==0){
      admreqtableBody.innerHTML='<tr><td colspan="8">No request found </td></tr>';
    }
    else{
      data.forEach((item)=>{
        admreqtableBody.innerHTML+=
        `<tr>
        <td style='display:none'>${item.rqid}</td>
        <td>${item.rqdate}(${item.rqtime})</td>
        <td>${item.pno}</td>
        <td>${item.pname}</td>
        <td>${item.gend}</td>
        <td>${item.age}</td>
        <td>${item.doc}</td>
        <td>${item.ward}</td>      
        <td><button class="btn btn-info btn-sm" id='btnloadreq'>Load</button></td>
        </tr>`;
    });
   }
  })
})


$('#loadtreq').on('click', function(){
  //fetch today requests  
    fetch("/records/daterequest/",{
      method: "POST", 
      body:JSON.stringify({reqdate:$('#arqdate').val()}),
      headers: {'X-CSRFToken': csrftoken}, 
    })
  .then((res)=>res.json())
  .then((data)=>{
    admreqtableBody.innerHTML='';
    if(data.length==0){
      admreqtableBody.innerHTML='<tr><td colspan="8">No request found </td></tr>';
    }
    else{
      data.forEach((item)=>{
        admreqtableBody.innerHTML+=
        `<tr>
        <td style='display:none'>${item.rqid}</td>
        <td>${item.rqdate}(${item.rqtime})</td>
        <td>${item.pno}</td>
        <td>${item.pname}</td>
        <td>${item.gend}</td>
        <td>${item.age}</td>
        <td>${item.doc}</td>
        <td>${item.ward}</td>      
        <td><button class="btn btn-info btn-sm" id='btnloadreq'>Load</button></td>
        </tr>`;
    });
   }
  })
})

$('#ptsearch').on('keyup', function(){
  var value = $(this).val().toLowerCase();
  $("#admreqtable tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
})
