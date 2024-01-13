$('#testsearch').on('keyup',function(){
    var value = $(this).val().toLowerCase();
    $("#tbltests tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
   
})

$('#tbltests tbody').on('click','tr', function() {
    var currentRow=$(this).closest("tr");        
          document.querySelector('#testid').value=currentRow.find("td:eq(0)").text();
          document.querySelector('#id_service_name').value=currentRow.find("td:eq(2)").text();
          document.querySelector('#id_normal_rate').value=currentRow.find("td:eq(3)").text();
          document.querySelector('#id_scheme_rate').value=currentRow.find("td:eq(4)").text();
          document.querySelector('#id_status').value=currentRow.find("td:eq(6)").text();
})


$('#buttonAddst').on('click', function(){
  var formdata=$("#testform").serialize();
  $.ajax({
      url: '/lab/addtest/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{    
          swal(data.msg,'','success');
            location.reload(true); 
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
          swal('Internal Server Error occurred. try again','','error');
        }
      }
  })
})

$('#buttonEditst').on('click', function(){
  var formdata=$("#testform").serialize();
  $.ajax({
      url: '/lab/edittest/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            swal(data.msg,'','info'); 
            location.reload(true); 
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Internal Server Error occurred. try again','','error');
        }
      }
  })
})

$('#btn_testparamdetail').on('click', function(){
  fetch("/lab/labtestlist/",{    
    method: "POST",
})
.then((res)=>res.json())
.then((data)=>{
  if(data.length===0){
    //console.log(data);     
 }
 else{
  
   $("#testname").empty();
   var labitem=document.querySelector('#testname');
   labitem.innerHTML+=`<option value="">Select Test name</option>`;   
   data.forEach((item)=>{     
       labitem.innerHTML+=`<option value="${item.scode}">${item.service_name}</option>`;
   });
 }
})

})
function hidecolumns(selval){
   var posv=selval;
   if (posv=='values'){
    //$('#tblvalues').show();
    $('#tblparamvalues td:nth-child(6),th:nth-child(6)').hide();    
    $('#tblparamvalues td:nth-child(3),th:nth-child(3)').show();
    $('#tblparamvalues td:nth-child(4),th:nth-child(4)').show();
    $('#tblparamvalues td:nth-child(5),th:nth-child(5)').show();
    //$('#tbloptions').hide();
   }
   else if(posv=='options'){
    $('#tblparamvalues td:nth-child(6),th:nth-child(6)').show();   
    $('#tblparamvalues td:nth-child(3),th:nth-child(3)').hide();
    $('#tblparamvalues td:nth-child(4),th:nth-child(4)').hide(); 
    $('#tblparamvalues td:nth-child(5),th:nth-child(5)').hide();
    //$('#tbloptions').show();
    //$('#tblvalues').hide();
   }
}

$('#posresult').on('change', function(){
  loadparameters()

})

const tblvalbody = document.querySelector('#tblparamvaluesbody'); 
function loadparameters(){

  var psresult=$('#posresult').val();
  var tid=$('#testname').val();

  if(tid.trim().length>0 && tid !==""){
  
    fetch("/lab/labtestParam/",{
    body:JSON.stringify({ searchText:tid }),
    method: "POST",
})
.then((res)=>res.json())
  .then((data)=>{
      //console.log('data',data);
      if(data.length===0){
        tblvalbody.innerHTML='<tr><td colspan="7">No parameters found </td></tr>';                     
      }
      else{
        tblvalbody.innerHTML='';
        data.forEach((item)=>{
          
          tblvalbody.innerHTML+=
            `<tr> 
            <td >${item.prno}</td>
            <td contentEditable=true>${item.prtname}</td>
            <td contentEditable=true>${item.lower}</td>
            <td contentEditable=true>${item.upper}</td>
            <td contentEditable=true>${item.msunit}</td>
            <td contentEditable=true>${item.psrst}</td>             
            <td><button class="btn btn-sm btn-danger btnRemParam">Remove</button></td> 
            </tr>`
        });
  
        hidecolumns(psresult);
      }
    })
  }
  else{
    alert('select test first')
    $("select#posresult").prop('selectedIndex', 0);

  }
}

$('#testname').on('change',function(){
  $('#posresult').prop('selectedIndex',0);
})


$('#tblparamvalues').on('click','.btnRemParam',function(){
  var tstname=$('#testname :selected').text();
  var currentRow=$(this).closest("tr"); 
  currentRow.addClass('bg-info').siblings().removeClass('bg-info'); 
  var prno=currentRow.find("td:eq(0)").text();
  var prnm=currentRow.find("td:eq(1)").text();

  if(confirm('remove parameter '+prnm+' from '+tstname+' ?')){
    $.ajax({
      url: '/lab/dormantparam/',
      data: JSON.stringify({ prno:prno }), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            swal(data.msg,'','info');
            loadparameters() 
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Internal Server Error occurred. try again','','error');
        }
      }
  })
  }


})

// adding an empty row to a table 
/*$('.btnAddParam').on('click',function(){
  $('#tblparamvalues tbody').append(`<tr> 
  <td ></td>
  <td contentEditable=true></td>
  <td contentEditable=true></td>
  <td contentEditable=true></td>
  <td contentEditable=true></td> 
  <td><button class="btn btn-sm btn-danger btnRemParam">Remove</button></td> 
  </tr>`)
})*/

$('.btnAddParam').on('click',function(){
  var tstname=$('#testname :selected').text();
  var psrst=$('#posresult :selected').text();
  var tstid=$('#testname').val();
  var psrstv=$('#posresult').val();
  if(tstid=="" || psrstv==""){
    swal('sorry!! select test and its possible result first','','info');
  }
  else{
  document.querySelector('#paramTitle').innerHTML='Add Parameter for '+tstname+' test';
  document.querySelector('#testmno').value=tstid;
  document.querySelector('#rstform').value=psrst;
  document.querySelector('#rstformv').value=psrstv;
  $('#paramModal').modal('show');
  hidediv();
  }
})

function hidediv(){
  var posres=$('#posresult').val();
  if(posres=="values"){
    $('#divposrst').hide();
    $('#divlower').show();
    $('#divupper').show();
    $('#divunits').show();
  }
  else if(posres=="options"){
    $('#divposrst').show();
    $('#divlower').hide();
    $('#divupper').hide();
    $('#divunits').hide();
  }
}

$('#btnsaveParam').on('click', function(){
    var formdata=$("#paramaddform").serialize();
  $.ajax({
      url: '/lab/labparamadd/',
      data: formdata, 
      method:'POST',       
      dataType: 'json',
      success: function (data) {               
        if(data.length===0){}
        else{              
            swal(data.msg,'','success');
            loadparameters()         
        }                    
      },
      error: function(jqXHR, exception) {
        if(jqXHR.status === 500) {
            swal('Internal Server Error occurred. try again','','error');
        }
      }
  })

})

$('#buttonConfParam').on('click', function(){
  if(confirm('Update changes in parameters?')){
    var psrst=$('#posresult').val();
    var paramarray=[];
    
var tb = document.getElementById('tblparamvalues');
var rw_count = tb.tBodies[0].rows.length;   
  if(rw_count>0){
    if(psrst=='values'){
      for(var i=1;i<=rw_count;i++){           
        paramarray.push({
            prid:tb.rows[i].cells[0].innerHTML,          
            prname:tb.rows[i].cells[1].innerHTML,          
            llimit:tb.rows[i].cells[2].innerHTML,         
            ulimit:tb.rows[i].cells[3].innerHTML,         
            unit:tb.rows[i].cells[4].innerHTML, 
            psrst:psrst,        
        });
    }
    }
    else if(psrst=='options'){
      for(var i=1;i<=rw_count;i++){           
        paramarray.push({
            prid:tb.rows[i].cells[0].innerHTML,          
            prname:tb.rows[i].cells[1].innerHTML,          
            psbval:tb.rows[i].cells[5].innerHTML,
            psrst:psrst,
        });
    }
    }
    
    var data_json=JSON.stringify({paramarray});
   $.ajax({
          url: '/lab/confirmparamlist/',
          method:'POST',
          data: data_json,
          dataType: 'json',
          success: function (data) {               
            if(data.length===0){}
            else{              
                swal(data.msg,'','success'); 
                loadparameters();                            
            }                    
          },
          error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                swal('Internal Server Error occurred. try later','','error');
            }
          }
        });
  }
  else{
    swal('please add parameters first','','info');
  }
} 
})
