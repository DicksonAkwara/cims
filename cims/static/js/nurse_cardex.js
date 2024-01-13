var ptriageBody=document.querySelector('#ptriageBody');

function inpatentlist(ward){
  var ptype='In-Patient';
  ptriageBody.innerHTML='';
  fetch("/nurse/inpatient_list/",{
    body:JSON.stringify({ward:ward }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      ptriageBody.innerHTML=`
      <tr>
        <td colspan='9'>No admissions found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        ptriageBody.innerHTML +=`
        <tr>
          <td>${item.adate}(${item.atime})</td>
          <td>${item.pno}</td>
          <td>${item.pname}</td>
          <td>${item.page}</td>
          <td>${item.pgend}</td>
          <td>${item.pward}</td>
          <td><button class="btn btn-sm btn-warning form-control" id="btn_add_cardex">Add</button></td>
          <td><button class="btn btn-sm btn-success form-control" id="btn_read_cardex">View</button></td>
          <td style='display:none'>${item.vno}</td>
          <td style='display:none'>In-Patient</td>
        </tr>`;
      })
      
    }
})

}

$('#btntgreport').on('click',function(){
  
})

$('#patward').on('change',function(){
   var ward = $(this).val();
   inpatentlist(ward);
});


$('#pCardNo').on('keyup',function(){
  var value = $(this).val().toLowerCase();
  $("#ptriage tbody tr").filter(function() {
  $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
 });
});


$('#ptriage tbody').on('click','#btn_add_cardex',function(){
  var currentRow=$(this).closest("tr"); 
  var pid=currentRow.find("td:eq(1)").text();
  var pname=currentRow.find("td:eq(2)").text();
  var page=currentRow.find("td:eq(3)").text();
  var psex=currentRow.find("td:eq(4)").text();
  var vno=currentRow.find("td:eq(8)").text();

  $('#cpid').text('Pat No:'+pid);
  $('#cpname').text('Name:'+pname);
  $('#cpage').text('Age:'+page);
  $('#cpsex').text('Gender:'+psex);
  $('#vno').val(vno);
  $('#pno').val(pid);

  $('#cardexModal').modal('show');

});

$('#save_cdx').on('click', function(){
  var pid=$('#pno').val();
  var vno=$('#vno').val();

  var notes=$('#cardex_notes_txt').val();
  var cdate=$('#cdate').val();
  var ctime=$('#timepicker').val();
  if(notes !==""|| ctime!==""){
    var formdata={'pid':pid,'vno':vno,'notes':notes,'cdate':cdate,'ctime':ctime}
    $.ajax({
      url: '/nurse/save_cardex/',
          data: JSON.stringify(formdata), 
          method:'POST',       
          dataType: 'json',
          success: function (data) { 
            var msg='';
            data.forEach((item)=>{
              msg=item.msg;
            })           
                swal('',msg,'success');
                $('#cardexModal').modal('hide');
                $('#cpid').text('');
                $('#cpname').text('');
                $('#cpage').text('');
                $('#cpsex').text('');
                $('#vno').val('');
                $('#pno').val('');
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500 ||jqXHR.status === 404) {
                  swal('Internal Server Error occurred.','','error');
              }
            }
    })
  }
  
})


var cdxtableBody=document.querySelector('#cdxtableBody');
$('#ptriage tbody').on('click','#btn_read_cardex',function(){
  //fetch patient details

  var currentRow=$(this).closest("tr"); 
  var pid=currentRow.find("td:eq(1)").text();
  var pname=currentRow.find("td:eq(2)").text();
  var page=currentRow.find("td:eq(3)").text();
  var psex=currentRow.find("td:eq(4)").text();
  var vno=currentRow.find("td:eq(8)").text();

  $('#rvno').val(vno);
  $('#rpno').val(pid);

  $('#mdheader').text('Cardex for '+pname+'(age-'+page+',Gender-'+psex+')')


  //fetch all cardex for today

  cdxtableBody.innerHTML='';
  fetch("/nurse/cardex_notes/",{
    body:JSON.stringify({pid:pid,vno:vno}),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    if(data.length===0){
      cdxtableBody.innerHTML=`
      <tr>
        <td colspan='6'>No cardex entry found</td>
      </tr>`;
    }
    else{
      data.forEach((item)=>{
        cdxtableBody.innerHTML +=`
        <tr>
          <td>${item.cdate}</td>
          <td>${item.ctime}</td>
          <td style='word-wrap:break-word;'><b>${item.notes}</b></td>
          <td>${item.nurse}</td>
          <td>${item.rdate}</td>
          <td><button class="btn btn-sm btn-warning form-control" id="btn_upd_cardex">Edit</button></td>
          <td style='display:none'>${item.vno}</td>
          <td style='display:none'>${item.refno}</td>
        </tr>`;
      })
      
    }
})


  $('#cdxModal').modal('show');

})

$('#cdxtable tbody').on('click','#btn_upd_cardex',function(){
  var currentRow=$(this).closest("tr"); 

  var current_user=$('#ussname').val(); 
  var usname=currentRow.find("td:eq(3)").text();
  var vno=currentRow.find("td:eq(6)").text();
  var refno=currentRow.find("td:eq(7)").text();

  if(usname==current_user){
    swal('','you can edit'+vno+'--'+refno,'success');

  }
  else{
    swal('','you cannot edit','error');
  }


})