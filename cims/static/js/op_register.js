const btnSubmit = document.querySelector('.btnSubmit');
//const btnMchRegister = document.querySelector('#btnMchReg');
const county = document.querySelector('#county');
const scounty = document.querySelector('#scounty');

$('#btnSubmit').on('click',function(){
    var formdata = $("#OpRegForm").serialize();
      $.ajax({
        url: '/records/register_new/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            if (data) {
              if(data.vno==0){
                swal("Card no: "+data.id,data.msg,"success")
              }
              else{
                bill_consultation(data.id,data.vno,data.msg);
              }                         
            }
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
            swal("Patient Registration!","Internal Server Error occurred. try again later", "error");
          }
        }
    });
   

})

//
$('#idno').on('keyup',function(){
  //var id=$(this).val();
  this.value=this.value.replace(/\D/g,'');
  if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);

})

$('#phone').on('keyup',function(){
  //var id=$(this).val();
  this.value=this.value.replace(/\D/g,'');
  if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
})

$('#nokphone').on('keyup',function(){
  //var id=$(this).val();
  this.value=this.value.replace(/\D/g,'');
  if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
})

function  bill_consultation(pid,vno,message){
  $('#ppid').val(pid);
  $('#ppvno').val(vno);
  $('#msg').val(message); 
  $('#bmodal').modal('show'); 
  search_consultation();
}

var bill_body=document.querySelector('.bill_body');

function search_consultation(){  
  bill_body.innerHTML=''; //for table refresh
  fetch("/records/bill_cons_search/",{
  method: "POST",
  })
  .then((res)=>res.json())
  .then((data)=>{
      data.forEach((item)=>{
        bill_body.innerHTML+=
        `<tr>              
        <td>${item.service_name}</td>
        <td>${item.normal_rate}</td>
        <td>${item.scheme_rate}</td>
        <td>${item.service_point}</td>
        <td><input type="checkbox" id="svid" class="form-check-input"></td>
        <td style="display:none;">${item.scode}</td>
        </tr>`
    });
    })
}

$('.btnsaveBill').on('click', function(){
  var ppid=$('#ppid').val();
  var vno=$('#ppvno').val();
  var msg=$('#msg').val();
  var pymode=$('#pscheme').val();
  



$('#bmodal').modal('hide');
 //loop through the table to check the selected row
 var service_code=[];
 var cost=0;
 $("#table_seach_bill tr").each(function() {
  var checkbox = $(this).find("input[type='checkbox']");

  if (checkbox.prop("checked")) {
    var cellValue = $(this).find("td:eq(5)").text();
    var scheme = $(this).find("td:eq(2)").text();
    var cash = $(this).find("td:eq(1)").text();
    var spoint = $(this).find("td:eq(3)").text();

    if(pymode=='cash'){cost=cash;}
    else{cost=scheme}

    service_code.push({
      'code':cellValue,
      'vno':vno,
      'pid':ppid,
      'pymode':pymode,
      'cost':cost,
      'spoint':spoint,
     });

  }
 });
 //send the array to be saved
 if (service_code.length>0){
  $.ajax({
    url: "/records/cons_bill_save/",
    data: JSON.stringify(service_code), 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      swal("Card no: "+ppid,msg,"success");
      $('form#OpRegForm').trigger("reset");
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          swal('','Internal Server Error occurred.'+exception,'error');
      }
    }
  });
 }
 else{
  swal("Card no: "+ppid,msg+'Consultation not Billed',"info");
  $('form#OpRegForm').trigger("reset");
 }
 
})

$('#pcat').on('change',function(){
  var pcat=$(this).val();
  if(pcat=='Prisoner' || pcat=='SGBV'){
    document.getElementById('ppaymode').selectedIndex = 1;
    $('#ppaymode').trigger('change');      
    //document.getElementById('pscheme').selectedIndex = 4;      
    //$('#mbNumber').prop('disabled', true);
  }
})



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

 const searchField = document.querySelector('#patno');
 const tableOutput = document.querySelector('.tableOutput');
 const resultTableBody = document.querySelector('.rs-table-body');
 const selectPatientType = document.querySelector('#patient_type');
 const loadBtn = document.querySelector('.loadBtn');
 const p_age = document.querySelector('#age');

 // $(this).off("change");

 $('#patient_type').on('change', function(){
    var typeValue = $(this).val();
    if(typeValue=='revisit'){
      $('#revisitModal').modal('show');
      //alert(pt);
    }
    else if(typeValue=='newPatient'){
      $('form#OpRegForm').trigger("reset");
      document.getElementById('patient_type').selectedIndex = 1;
    }
    $(this).off("change");
  })


p_age.addEventListener('keyup',(e)=>{
  const age = parseInt(e.target.value);  
  var currentDateObj = new Date();
  var numberOfMlSeconds = currentDateObj.getTime();
  var addMlSeconds = age * 365 *24 *60 * 60 * 1000;

  var newDateObj = new Date(numberOfMlSeconds - addMlSeconds);
  var nDate = newDateObj.toISOString().substring(0,10);
  
  document.querySelector('#dob').value=nDate;
  calculate_pAge();
  //console.log(nDate);
})


 searchField.addEventListener('keyup',(e)=>{
    const searchValue = e.target.value;
    if(searchValue.trim().length>0){
        //console.log(searchValue);
        resultTableBody.innerHTML=''; //for table refresh
        fetch("/records/searchPatient/",{
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
              <td style='display:none'>${item.op_number}</td>
              <td>${item.patient_no}</td>
              <td>${item.fullname}</td>
              <td>${item.gender}</td>
              <td>${item.patient_age}</td>
              <td>${item.national_idno}</td>
              <td>${item.patient_phone}</td>
              <td>${item.residence}</td>
              <td><button class="btn btn-success form-control btn-sm" onClick="editUser(${item.op_number})">load</button></td>
              </tr>`
          });
        }
      })
    }
    else{
     //tableOutput.style.display='block';
    }
 })

 function editUser(id) {
  if (id) {      
    fetch("/records/op_load_patient_details/",{
        body:JSON.stringify({ pat_id:id }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
      data.forEach((item)=>{
        //console.log(item.county);   
        document.querySelector('#fullname').value=item.fullname;
        document.querySelector('#idno').value=item.national_idno;
        document.querySelector('#phone').value=item.patient_phone;
        //document.querySelector('#age').value=item.patient_age;
        document.querySelector('#dob').value=item.patient_DOB;
        document.querySelector('#gender').value=item.gender;
        document.querySelector('#county').value=item.county;        
        document.querySelector('#residence').value=item.residence;
        document.querySelector('#nokname').value=item.nok_name;
        document.querySelector('#nokphone').value=item.nok_phone;
        document.querySelector('#relation').value=item.nok_relation;
        document.querySelector('#editPatno').value=item.op_number;
        $('#revisitModal').modal('hide');

        $('#county').trigger("change");
        //document.querySelector('#scounty').value=item.sub_county;
        loadscounty(item.sub_county);
        calculate_pAge();
      })
    })     
    }
}
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

$('#btnMchReg').on('click',function(){  
  var formdata = $("#mchregistrationform").serialize();  
  //console.log(formdata);
      $.ajax({
        url: '/records/mchRegisterPatient/',
        data: formdata, 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
            if (data) {  
              alert(data.msg) ;
              $('form#mchregistrationform').trigger("reset");            
            }
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 500) {
              alert('Internal Server Error occurred. try again');
          }
        }
    });

})

$('.btnRegBaby').on('click',function(){
  $('#bregisterModal').modal('show');
})

$('#mdcardNo').on('keyup',function(){
  var cnt = $(this).val();
  if(cnt.trim() !==''){    
    fetch("/records/maidensearch/",{
    body:JSON.stringify({ searchText:cnt }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
     if(data.length===0){
       //console.log(data); 
       document.querySelector('#mdcardNo2').value='';  
       document.querySelector('#maidenm').innerHTML='';     
    }
    else{
      
      data.forEach((item)=>{
        //console.log(item.sub_county)
          document.querySelector('#maidenm').innerHTML=item.fullname;
          document.querySelector('#mdcardNo2').value=cnt;
      });
    }
  })
}
})

$('#buttonSaveBaby').on('click',function(){
  var mname=$('#mdcardNo2').val();
  
  if(mname!==''){
    var formdata = $("#bbdetailForm").serialize();  
  $.ajax({
    url: '/records/savebabyprofile/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {               
      if(data.length===0){}
      else{              
          if(confirm(data.msg+'.Register another baby?')){
            //do nothing 
            
          } 
          else{
            $('form#bbdetailForm').trigger("reset");
            $('#bregisterModal').modal('hide'); 
          }  
                        
      }             
      //$('form#motherProfForm').trigger("reset");              
    },
    error: function(jqXHR, exception) {
      if(jqXHR.status === 500) {
          swal('','Internal Server Error occurred. try again','error');
      }
    }
  })
  }
  else{swal('','load maiden details','info');}
  
})


$('.btnbill').on('click', function(){
  bill_consultation();
})


$('#pcat').on('change', function(){
   var pcat=$(this).val();
   if(pcat=='Prisoner' || pcat=='SGBV'){
     //hide payment details
      $('#pdiv').hide();
   }
   else{
    //show payment details
    $('#pdiv').show();
   }
})












