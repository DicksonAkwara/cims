
const pcardNo =  document.querySelector('#pCardNo');
const ListTblBody = document.querySelector('.ListTblBody');


$('#btnmakeappt').on('click',function(){
    $('#bookmodal').modal('show');

});

pcardNo.addEventListener('keyup',(e)=>{

    var pid = e.target.value;
    var pt='Out-Patient';
    if(pid.trim().length>0){
      
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid,ptype:pt }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){            
            clearfield();          
            $('#psearchStatus').text('Patient not found');           
        }
        else{
          var jdata=data;          
          var pid
          jdata.forEach(element => { 
          pid =element.pid;         
          $('#pname').val(element.fname);
          $('#patage').val(element.age); 
          $('#patgend').val(element.gender);
          $('#cl_patid').val(pid);
          $('#pphone').val(element.phone);
          })
          $('#psearchStatus').text('');
        }
      })
    }

})
 function clearfield(){
  $('#pname').val('');
  $('#pphone').val(''); 
  $('#patage').val(''); 
  $('#patgend').val(''); 
  $('#cl_patid').val(''); 
 }

function checkfuturedate (){
  var cdate = $('#cl_date').val().trim(); 
  if(cdate==''){
    swal('Clinic date','Sorry !! enter clinic date','error');       
  }
  // Get the selected date value from the input element
  var cl_date = document.getElementById('cl_date').value;
  // Convert the selected date to Date object
  var cl_date = new Date(cl_date);
  // Get the current date Date object
  var currentDate = new Date();
  console.log(cl_date);
  console.log(currentDate);
  if (cl_date > currentDate || cl_date === currentDate) {

     //save booking
     saveclinic();
  } 
  else if (cl_date < currentDate) {
      swal('Incorrect Clinic date','Selected date is in the past.','info');
  }  
 }

function saveclinic(){
  var pid = $('#cl_patid').val().trim();
    var cname = $('#cl_name').val().trim();
    var cdate = $('#cl_date').val().trim(); 
    var activity=$('#activity').val().trim()
    var ref=$('#refno').val().trim()

    var cat=$('#clinicCat').prop('selectedIndex',3);
  var formdata={
    pid: pid,
    cname: cname,
    cdate: cdate,
    activity:activity,
    reff:ref
   }

   $.ajax({
    url: '/records/savebookClinic/',
    data: JSON.stringify(formdata), 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      swal('Clinic Appointment',data.msg,'success');
      clearfield();
      $('#cl_date').val('');
      $('#psearchStatus').text('');
      $('#cl_name').prop('selectedIndex',0);
      loadClinicList(cat);
    },
    error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Error','Internal Server Error occurred','Error');
        }
      }
  });
}
$('#btnSave').on('click',function(e){
    e.preventDefault();
    var cname = $('#cl_name').val().trim();
    if(cname=='none'){
      swal('Clinic Name','You have not selected any clinic','info');
    }
    else{checkfuturedate();}
  })
  

$('#clinicCat').on('change',function(){
    var cat=$(this).val().trim();
    loadClinicList(cat)   
    
})

function loadClinicList(category){
    ListTblBody.innerHTML='';
    var cat=category;
    
    fetch("/records/clinicCategory/",{
        body:JSON.stringify({ searchText:cat }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
       
        if(data.length===0){            
            ListTblBody.innerHTML=`<tr>
            <td colspan='7'> no clinic found</td>
            </tr>`    
        }
        else{
            ListTblBody.innerHTML='';
        if(cat=='Prescribed'){
          var jdata=data;           
          jdata.forEach(item => { 
            ListTblBody.innerHTML+=
            `<tr>
                <td style='display:none'>${item.reff}</td>
                <td>${item.bookDate}</td>
                <td>${item.cardNo}</td>
                <td>${item.fullname}</td>
                <td>${item.age}</td>
                <td>${item.gender}</td>                        
                <td>${item.clname}</td>
                <td>${item.staff}</td>
                <td style='display:none'>${item.phone}</td>
            </tr> ` ;       
          })
        }
        else{
          var jdata=data;           
          jdata.forEach(item => { 
            ListTblBody.innerHTML+=
            `<tr>
               <td style='display:none'>${item.reff}</td>
                <td>${item.clinic_date}</td>
                <td>${item.op_number}</td>
                <td>${item.fullname}</td>
                <td>${item.age}</td>
                <td>${item.gender}</td>                        
                <td>${item.clinic_name}</td>
                <td>${item.staff}</td>
                <td style='display:none'>${item.phone}</td>
            </tr> ` ;       
          })
        }    
          
        } 
      })
}

$('#registerListTbl tbody').on('click','tr',function(){
    var cat=$('#clinicCat').val().trim();
    var currentRow=$(this).closest("tr");
    if(cat=='today'){
        
        if(confirm('Confirm patient visit')){
            document.querySelector('#activity').value='activate';
        }

        //click to load card activation
    }
    else if(cat=='Prescribed'){
        //load details and try 
        var ref=currentRow.find("td:eq(0)").text();
        var bkdate=currentRow.find("td:eq(1)").text();
        var pid=currentRow.find("td:eq(2)").text();
        var fname=currentRow.find("td:eq(3)").text();
        var clinic=currentRow.find("td:eq(6)").text();
        var phone=currentRow.find("td:eq(8)").text();

        document.querySelector('#pname').value=fname;
        document.querySelector('#pCardNo').value=pid;
        document.querySelector('#cl_patid').value=pid;
        document.querySelector('#cl_date').value=bkdate;
        document.querySelector('#cl_name').value=clinic;
        document.querySelector('#pphone').value=phone; 
        document.querySelector('#activity').value='receive';
        document.querySelector('#refno').value=ref;


    }
    else if(cat=='Pending'){

        if(confirm('Would you like to edit booking?')){
            var ref=currentRow.find("td:eq(0)").text();
            var bkdate=currentRow.find("td:eq(1)").text();
            var pid=currentRow.find("td:eq(2)").text();
            var fname=currentRow.find("td:eq(3)").text();
            var clinic=currentRow.find("td:eq(6)").text();
            var phone=currentRow.find("td:eq(8)").text();
    
            document.querySelector('#pname').value=fname;
            document.querySelector('#pCardNo').value=pid;
            document.querySelector('#cl_patid').value=pid;
            document.querySelector('#cl_date').value=bkdate;
            document.querySelector('#cl_name').value=clinic;
            document.querySelector('#pphone').value=phone;
            document.querySelector('#activity').value='edit';
            document.querySelector('#refno').value=ref;

            $('#bookmodal').modal('show');
        }
    }
    
    //var pid=currentRow.find("td:eq(0)").text();
})
$('#bkfilter').on('keyup',function(){
    var value = $(this).val().toLowerCase();
    $("#registerListTbl tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
})