$('#bdtype').on('change', function(){
    var bdtype=$(this).val();
    if(bdtype=='bid'){
        $('.divhpno').hide();
        $('.divob').show();
    }
    else if(bdtype=='int'){
        $('.divhpno').show()
        $('.divob').hide();
    }

})

$('#btnfwregister').on('click',(e)=>{
    e.preventDefault();
    var formdata = $("#bodyRegister").serialize();
    var bdtype=$('#bdtype').val();
    if(bdtype !==''){
        $.ajax({
            url: '/farewell/bodyregister/',
            data: formdata, 
            method:'POST',       
            dataType: 'json',
            success: function (data) {
                if (data) {
                  $('form#bodyRegister').trigger("reset");
                  resetDate();
                  swal('Registration no: '+data.id,data.msg,"success");                       
                }
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500) {
                swal("Registration!!","Internal Server Error occurred. try again later", "error");
              }
            }
        });
    }
    else{
        swal('','Select registration type first!! ',"info");
    }
  
})

function resetDate(){
    var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if (month < 10) 
      month = "0" + month;
  if (day < 10) 
      day = "0" + day;
  var today = now.getFullYear() + '-' + month + '-' + day;
  $('#dod').val(today);
}


///// billing methods /////////////////////////


$('.btnSearchDec').on('click', function(){
    $('#bodySearchModal').modal('show');
})

const decTableBody = document.querySelector('.tbdeceasedBody');
$('#searchtxt').on('keyup', function(){
    var searchkey=$(this).val()
    if(searchkey==''){
        $('#dnumber').val('');
        $('#dname').val('');
        $('#dsex').val('');
        $('#nname').val('');
        $('#nphone').val('');
    }
    else{
        //send search query
        decTableBody.innerHTML=''; //for table refresh
        fetch("/farewell/searchbody/",{
        body:JSON.stringify({ searchText:searchkey }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){
            decTableBody.innerHTML='<tr><td colspan="5">no details found..</td></tr>';            
        }
        else{
          data.forEach((item)=>{
              decTableBody.innerHTML+=
              `<tr>              
              <td>${item.bdid}</td>
              <td>${item.fname}</td>
              <td>${item.dcid}</td>
              <td>${item.obno}</td>
              <td>${item.nokn}</td>
              <td style="display:none;>${item.sex}</td>
              <td style="display:none;>${item.age}</td>              
              <td style="display:none;>${item.nokp}</td>
              </tr>`
          });
        }
      })
    }
})

$('#tbdeceased tbody').on('click','tr', function(){
    var currentRow=$(this).closest("tr");
    var bdid=currentRow.find("td:eq(0)").text();
    var fname=currentRow.find("td:eq(1)").text();
    var nokn=currentRow.find("td:eq(4)").text();
    var sex=currentRow.find("td:eq(5)").text();
    var nokp=currentRow.find("td:eq(7)").text();

    $('#dnumber').val(bdid);
    $('#dname').val(fname);
    $('#dsex').val(sex);
    $('#nname').val(nokn);
    $('#nphone').val(nokp);

    //search bill
    //searchbill(bdid)
})

function searchbill(bdid){
    var bodyno=$('#dnumber').val();
    fetch("/farewell/searchbill/",{
        body:JSON.stringify({ searchText:bodyno }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        if(data.length===0){
            decTableBody.innerHTML='<tr><td colspan="5">no bills found..</td></tr>';            
        }
        else{
          data.forEach((item)=>{
              decTableBody.innerHTML+=
              `<tr>              
              <td>${item.bdid}</td>
              <td>${item.fname}</td>
              <td>${item.dcid}</td>
              <td>${item.obno}</td>
              <td>${item.nokn}</td>
              <td style="display:none;>${item.sex}</td>
              <td style="display:none;>${item.age}</td>              
              <td style="display:none;>${item.nokp}</td>
              </tr>`
          });
        }
      })



}


$('.btn-search').on('click', function(){
    $('#serviceModal').modal('show');
})


const serviceTableBody = document.querySelector('.tbsearchsvsbody');

$('#search-service').on('keyup', function(){
    serviceTableBody.innerHTML=''; //for table refresh
    fetch("/records/bill_svs_search/",{
    body:JSON.stringify({ searchText:pid }),
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
    //console.log('data',data);
    if(data.length===0){
        serviceTableBody.innerHTML='<tr><td colspan="3">Sorry..No service found </td></tr>';
        
    }
    else{
        //console.log(data);
      data.forEach((item)=>{
          serviceTableBody.innerHTML+=
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
})