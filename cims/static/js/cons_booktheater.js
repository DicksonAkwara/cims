$('#btnsearchpt').on('click', function(){
    $('#patsearchModal').modal('show');
})

$('#btnbooklist').on('click', function(){
    loadBookList();
    $('#booklist').modal('show');
})


var listTableBody=document.querySelector('#listTableBody');
function loadBookList(){
    listTableBody.innerHTML='';
    fetch("/consult/booklist/",{
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){
            listTableBody.innerHTML='<tr><td colspan="5">No bookings found </td></tr>';
        }
        else{
          var ttc=0;
          data.forEach((item)=>{
              ttc=item.ttproc;
              listTableBody.innerHTML+=
              `<tr>
              <td>${item.fullname}</td>
              <td>${item.patno}</td>
              <td>${item.bkdate}</td>
              <td>${item.schdate}</td>
              <td>${item.status}</td>
              </tr>`
          });

          listTableBody.innerHTML+=
              `<tr>
                <td colspan='4' style='text-align:right'>Total Procedures</td>
                <td>${ttc}</td>
              </tr>`;
        }
      })

}


var patientTableBody=document.querySelector('.patientTableBody');
$('#search_pat').on('keyup',function(){
    const searchValue = $(this).val();
    if(searchValue.trim().length>0){
        //console.log(searchValue);
        patientTableBody.innerHTML=''; //for table refresh
        fetch("/records/searchPatient/",{
        body:JSON.stringify({ searchText:searchValue }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){
            patientTableBody.innerHTML='<tr><td colspan="4">Patient not found </td></tr>';
        }
        else{
          data.forEach((item)=>{

              patientTableBody.innerHTML+=
              `<tr>
              <td>${item.fullname}</td>
              <td>${item.op_number}</td>
              <td>${item.national_idno}</td>
              <td>${item.patient_age}</td>
              <td>${item.gender}</td>
              </tr>`
          });
        }
      })
    }
    else{
        patientTableBody.innerHTML='';
    }
 })

 $('.patientTableBody').on('click','tr',function(){

    var currentRow=$(this).closest("tr"); 
     
    var fname=currentRow.find("td:eq(0)").text();      
    var card=currentRow.find("td:eq(1)").text(); 
    var age=currentRow.find("td:eq(3)").text();  
    var gnd=currentRow.find("td:eq(4)").text();  

    $('#pname').val(fname);
    $('#cardno').val(card);
    $('#page').val(age);
    $('#gender').val(gnd);

    $('#patsearchModal').modal('hide');
 })


 $('#btnsavebookTH').on('click', function(){
    //collect data         
    var card= $('#cardno').val();
    if(card !==''){

        var bktype=$('#bktype').val(); 
        var procd=$('#prodeure').val();  
        var bkdate=$('#bkdate').val();
        var addnotes=$('#addnotes').val();

        formdata={card:card,bktype:bktype,procd:procd,bkdate:bkdate,addnotes:addnotes}
        $.ajax({
            url: '/consult/saveTHBook/',
            data: JSON.stringify(formdata), 
            method:'POST',       
            dataType: 'json',
            success: function (data) {
              swal(data.msg,'','success'); 
              clearfields(); 
              $('#btnbooklist').trigger('click');        
              },
              error: function(jqXHR, exception) {
                if(jqXHR.status === 500) {
                  swal("Sorry!!","Internal Server Error occurred. try again later", "error");
                }
              }
          });

    }
    else{
        swal('select patient first','','info');
    }
    
 })

 function clearfields(){
    $('#pname').val(); 
    $('#cardno').val();  
    $('#page').val();
    $('#gender').val();

    $('#bktype').val(); 
    $('#prodeure').val();  
    $('#bkdate').val();
    $('#addnotes').val();
 }


 $('#bkcardno').on('keyup',function(){
    var value = $(this).val().toLowerCase();
    $("#listTable tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
