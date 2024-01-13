const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

$('#addbnchtest').on('click', function(){
    var tname=$('#testname').val();
    var dptname=$('#deptname').val();

    if(tname !=='none' &&  dptname !=='none'){
        var fdata=JSON.stringify({tsid:tname,dptid:dptname})
        
        $.ajax({
            url: '/lab/savebenchtest/',
            data: fdata, 
            method:'POST',
            headers: {'X-CSRFToken': csrftoken},        
            dataType: 'json',
            success: function (data) {
              swal('Response',data.res,'success');
              //table refresh    
              refreshbenchtestlist();
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500) {
                swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
              }
            }
          })

    }
    else{
        swal('Empty field','Please match test with department','error');
    }

})

var tblbenchtestbody=document.querySelector('#tblbenchtestbody');
function refreshbenchtestlist(){
    fetch("/lab/benchtestlist/",{
        method: "GET",
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.length===0){
            
        tblbenchtestbody.innerHTML='<tr><td colspan="4">No tests found </td></tr>';                     
    }
    else{           
      tblbenchtestbody.innerHTML='';
        var jdata=data;            
        jdata.forEach(element => {              
          tblbenchtestbody.innerHTML+=
              `<tr>                  
                    <td style="display:none;">${element.entid}</td> 
                    <td>${element.deptname}</td>            
                    <td>${element.testname}</td> 
                    <td>${element.cdate}</td>   
                    <td>${element.staff}</td>                                             
              </tr>`        
        });
  
       //color_code();
    }
    })
}


$("#testsearchbnch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tblbenchtest tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


$('#tblbench tbody').on('click','tr',function(){   
    var currentRow=$(this).closest("tr"); 
    currentRow.addClass('bg-info').siblings().removeClass('bg-info');   

    var dptid=currentRow.find("td:eq(0)").text();
    var dname=currentRow.find("td:eq(2)").text();
    var descr=currentRow.find("td:eq(3)").text();

    $('#benchid').val(dptid);
    $('#id_departmentname').val(dname);
    $('#id_description').val(descr);
})

$("#benchsearch").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#tblbench tbody tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });


$('#addbench').on('click', function(){
    var dptname=$('#id_departmentname').val();
    var dptdesc=$('#id_description').val();

    if(confirm('Would you like to add '+dptname+ ' as a new lab department?')){
        var fdata=JSON.stringify({dptname:dptname,dptdesc:dptdesc})
        $.ajax({
            url: '/lab/savebench/',
            data: fdata, 
            method:'POST',
            headers: {'X-CSRFToken': csrftoken},        
            dataType: 'json',
            success: function (data) {
              swal('Response',data.res,'success');
              //table refresh    
              refreshbenchlist();
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500) {
                swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
              }
            }
          })
    }

  })


  $('#editbench').on('click', function(){
    var did=$('#benchid').val();
    var dptname=$('#id_departmentname').val();
    var dptdesc=$('#id_description').val();

    if(confirm('Would you like to edit '+dptname+ '?')){
        var fdata=JSON.stringify({did:did,dptname:dptname,dptdesc:dptdesc})
        $.ajax({
            url: '/lab/updatebench/',
            data: fdata, 
            method:'POST',
            headers: {'X-CSRFToken': csrftoken},        
            dataType: 'json',
            success: function (data) {
              swal('Response',data.res,'success');
              //table refresh    
              refreshbenchlist();
            },
            error: function(jqXHR, exception) {
              if(jqXHR.status === 500) {
                swal("","Internal Server Error occurred. try again later"+jqXHR, "error");
              }
            }
          })
    }

  })


var tblbenchbody=document.querySelector('#tblbenchbody');
function refreshbenchlist(){
    fetch("/lab/benchlist/",{
        method: "GET",
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(data.length===0){
            
        tblbenchbody.innerHTML='<tr><td colspan="4">No lab bench found </td></tr>';                     
    }
    else{           
      tblbenchbody.innerHTML='';
        var jdata=data;            
        jdata.forEach(element => {              
          tblbenchbody.innerHTML+=
              `<tr>                  
                    <td style="display:none;">${element.did}</td>                     
                    <td>${element.cdate}</td>
                    <td>${element.deptname}</td>            
                    <td>${element.descp}</td>   
                    <td>${element.staff}</td>                                             
              </tr>`        
        });
    }
    })
}



