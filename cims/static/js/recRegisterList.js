/*$(document).ready(function(){
    $('#dfrom').val(new Date().toDateInputValue());
})*/


const rgListTblbody = document.querySelector('.ListTblBody');

$("#searchlist").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#registerListTbl tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

$("#ClinicName").on('change', function(){
    var fdate=$('#dfrom').val().trim();
    var tdate=$('#dateto').val().trim();
    var cname=$(this).val().trim();
    if(fdate=='' || tdate==''){
        alert('select date range first');        
    }
    else{
    if(cname.length>0){   
        fetch("/records/filterClinicVisit/",{
        body:JSON.stringify({ searchText:cname,fdate:fdate,tdate:tdate}),
        method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
        
        rgListTblbody.innerHTML='';  
        data.forEach(item => {              
            rgListTblbody.innerHTML+=
          `<tr>                            
                <td>${item.visit_date}(${item.visit_time})</td>
                <td>${item.op_number}</td>
                <td>${item.fullname}</td>
                <td>${item.patient_age}</td>
                <td>${item.gender}</td>
                <td>${item.sub_name}</td>
                <td>${item.visit_type}</td>
                <td>${item.clinic_name}</td>
                <td>${item.username}</td>                                                         
          </tr>`  
    
        }); 
        countpatients();        
      })       
     }
    }
})
function countpatients(){
    var count=$('#registerListTbl tbody tr').length;
    document.querySelector('#sumClients').value=count;
}

var registeripbody=document.querySelector('#registeripbody');
$("#wardName").on('change', function(){
  var fdate=$('#ddfrom').val().trim();
  var tdate=$('#ddateto').val().trim();
  var cname=$(this).val().trim();
  if(fdate=='' || tdate==''){
      swal('Date error!!','select date range first','info');        
  }
  else{
  if(cname.length>0){   
      fetch("/records/filterwardVisit/",{
      body:JSON.stringify({ searchText:cname,fdate:fdate,tdate:tdate}),
      method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{      
      registeripbody.innerHTML=''; 
      if(data.length==0){
        registeripbody.innerHTML+=`<tr><td colspan='9'>no registration found</td></tr>`;
      } 
      else{
        data.forEach(item => {              
          registeripbody.innerHTML+=
        `<tr>                            
              <td>${item.visit_date}(${item.visit_time})</td>
              <td>${item.op_number}</td>
              <td>${item.fullname}</td>
              <td>${item.patient_age}</td>
              <td>${item.gender}</td>
              <td>${item.sub_name}</td>
              <td>${item.visit_type}</td>
              <td>${item.clinic_name}</td>
              <td>${item.username}</td>                                                         
        </tr>`; 

      }); 
      countinpatients();
      }        
    })       
   }
  }
})
function countinpatients(){
  var count=$('#registerip tbody tr').length;
  document.querySelector('#ssumClients').value=count;
}
$("#ssearchlist").on("keyup", function() {
  var value = $(this).val().toLowerCase();
  $("#registerip tbody tr").filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});