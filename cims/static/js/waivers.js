$('#cardnumber').on('keyup', function(){
    var pid = $(this).val();
    var pt=$('#pptype').val();
    if(pid.trim().length>0){
      
     fetch("/consult/cons_pat_search/",{
          body:JSON.stringify({ searchText:pid,ptype:pt }),
          method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{
          
          if(data.length===0){
              document.querySelector('#ptname').value='';
              document.querySelector('#ptno').value=''; 
              document.querySelector('#ptvno').value=''; 
              document.querySelector('#ptage').value=''; 
              document.querySelector('#ptpmode').value=''; 
              document.querySelector('#pcat').value='';                           
              document.querySelector('#ttbill').value=''; 
              document.querySelector('#ntbill').value=''; 
              document.querySelector('#wvamount').value=''; 
              document.querySelector('#patSearchStatus').innerHTML='patient not found'; 
              $('#tblwaiver tbody tr').remove();
              
          }
          else{
            var jdata=data;          
            var pid
            jdata.forEach(element => { 
            pid =element.pid;        
            document.querySelector('#ptname').value=element.fname;
            document.querySelector('#ptno').value=pid; 
            document.querySelector('#ptvno').value=element.vno; 
            document.querySelector('#ptage').value=element.age;          
            document.querySelector('#ptpmode').value=element.scheme_name;
            document.querySelector('#pcat').value=element.pcat; 

            })
            document.querySelector('#patSearchStatus').innerHTML='';            
            retrieveBill(pid);
           }
        })
           
    }
    else{
      document.querySelector('#patSearchStatus').innerHTML=''; 
    }

})

var tblServicesBody=document.querySelector('#tblwaiverBody');
function retrieveBill(id){  
    var ptype=document.querySelector('#pptype').value; 
    var vno=document.querySelector('#ptvno').value; 
    $.ajax({
      url: '/finance/retrieveBill/',
      data: JSON.stringify({ pid:id,ptype:ptype,vno:vno}), 
      method:'POST',       
      dataType: 'json',
      success: function (data) {
        if(data.length===0){
            
            tblServicesBody.innerHTML=`<tr><td colspan='5'>No pending bill</td</tr>`;                     
        }
        else{           
            tblServicesBody.innerHTML='';
            var jdata=data;            
            jdata.forEach(element => {              
                tblServicesBody.innerHTML+=
                `<tr>                  
                      <td style='display:none';>${element.scode}</td>            
                      <td >${element.sname}</td>
                      <td >${element.qnt}</td>
                      <td >${element.nprice}</td>  
                      <td >${element.tprice}</td>                       
                      <td >${element.wvamount}</td>                      
                      <td style='display:none';>${element.reff_no}</td>                  
                </tr>`;
                findTotal();             
            });

           //color_code();
        }
      }
    });  
  }

  function findTotal(){ 
    var sum=0;
    var waiv=0;
    $("#tblwaiver tbody tr").each(function(){
        var self=$(this);
        var ttp=parseFloat(self.find("td:eq(4)").text().trim());
        var ttw=parseFloat(self.find("td:eq(5)").text().trim());
        sum+=ttp;
        waiv+=ttw;
    })
    $('#ttbill').val(sum)//.toLocaleString('en-US',{maximumFractionDigits:2}))
    $('#wvamount').val(waiv)//.toLocaleString('en-US',{maximumFractionDigits:2}));
    
    var diff=parseFloat(sum-waiv);
    document.querySelector('#ntbill').value=diff;    
  }


  
  //table checkbox

 /* $("#tblwaiver tbody").on('change','#chkbox', function() { 
    var currentRow=$(this).closest("tr");   
    if(this.checked) {          
      var ttp=currentRow.find("td:eq(4)").text();
      currentRow.find("td:eq(6)").text(ttp);

      
    }
    else {
      currentRow.find("td:eq(6)").text(0);
    }

    var tb=document.querySelector('#tblwaiver');
    var rw_count = tb.tBodies[0].rows.length;
    var ttw=0;
    for(var i=1;i<=rw_count;i++){        
        ttw+=parseFloat(tb.rows[i].cells[6].innerHTML);           
    } 

    $('#wvamount').val(ttw.toLocaleString('en-US',{maximumFractionDigits:2}));
    var sum=$('#ttbill').val();
    var diff=parseFloat(sum-ttw);
    $('#ntbill').val(diff);
    
  })*/

function calculate_waiver(){
  var tb=document.querySelector('#tblwaiver');
    var rw_count = tb.tBodies[0].rows.length;
    var ttw=0;
    for(var i=1;i<=rw_count;i++){        
        ttw+=parseFloat(tb.rows[i].cells[5].innerHTML);           
    } 

    $('#wvamount').val(ttw)//.toLocaleString('en-US',{maximumFractionDigits:2}));
    var sum=$('#ttbill').val();
    var diff=parseFloat(sum-ttw);
    $('#ntbill').val(diff);
}



$('#btnAssesment').on('click',function(){
    //check action and pno
    var pno=$('#ptno').val();    
    if(pno !==''){
      $('#notesModal').modal('show'); 
    }
    else{
        swal('Ensure Patient is selected ','','info');
    }
   
})


$('#btnsavenotes').on('click',function(){
  var notes=$('#asmnt_notes').val();
  var pno=$('#ptno').val();

if(notes !=='' && notes.length>10){
  if(confirm('Have you checked your Assessment notes and wish to save?')){
    data=[]
    data.push({notes:notes,pno:pno});
    formdata=JSON.stringify(data);
    $.ajax({
    url: '/finance/waivernotes/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
      console.log(data['msg']);
        if(data.msg=='success'){
          
            var nid=data.noteid;          
            swal('successfully saved','','success');            
            $('#notesid').val(nid);
            $('#notesModal').modal('hide');
            //clearform();
        }        
        },
        error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                swal('','Internal Server Error occurred.'+exception,'error');
            }
        }
    })
  }
}
else{
  swal('Wrong entry','Notepad empty or very few words','info');
}

})

$("#btndistribute").change(function() { 
  var sum=parseInt($('#ttbill').val());
  var ppamt=parseInt($('#ppamt').val());
  var pno=$('#ptno').val();
  
  if(this.checked) {   
    if(pno==''){
      swal('No patient Found','please search patient to waive','error');
    }
    else{
      if(ppamt=='' || ppamt.isNaN){
        swal('','Amount to utilize cannot be empty','error');
      }
      else{
        if(ppamt>sum){
          swal('wrong entry','Waiver amount cannot be greater than bill','error');
          $('#ppamt').val('');
        }
        else{
          //distribute the figure
          var tb=document.querySelector('#tblwaiver');
          var rw_count = tb.tBodies[0].rows.length;
          
          var wvamout=ppamt;
          for(var i=1;i<=rw_count;i++){        
              var bill=parseFloat(tb.rows[i].cells[4].innerHTML); 
              if(wvamout>bill){
                tb.rows[i].cells[5].innerHTML=bill;
                wvamout-=bill;
              }  
              else{
                tb.rows[i].cells[5].innerHTML=wvamout;
                break;
              }        
          } 
          calculate_waiver();
        }
      }
     
    }
    
  }
  else{
    var tb=document.querySelector('#tblwaiver');
    var rw_count = tb.tBodies[0].rows.length;
    for(var i=1;i<=rw_count;i++){        
      tb.rows[i].cells[5].innerHTML=0;        
    }
    calculate_waiver();
  }
  


})

$('#btnsavewv').on('click',function(){
    
    var pno=$('#ptno').val();
    var ptvno=$('#ptvno').val();
    var ptype=$('#pptype').val(); 
    var nid=$('#notesid').val();
    if(nid !==''){
      bill=[]
    var tb=document.querySelector('#tblwaiver');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            pno:pno,
            vno:ptvno,
            pty:ptype,            
            nid:nid,            
            wvamount:tb.rows[i].cells[5].innerHTML,
            rfno:tb.rows[i].cells[6].innerHTML,//patientbill reff number                    
        });            
    }

    formdata=JSON.stringify(bill);
    $.ajax({
    url: '/finance/save_waiver/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
        if(data.msg=='saved'){
            swal('successfully saved','','success');
            clearform();
        }        
        },
        error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                swal('','Internal Server Error occurred.'+exception,'error');
            }
        }
    })
    }
    else{
      swal('Error','Unable to proceed without notes','error');
    }
          
    
})

function clearform(){
    $('#cardnumber').val('');
    $('#ptname').val('');
    $('#ptno').val(''); 
    $('#ptvno').val(''); 
    $('#ptage').val(''); 
    $('#ptpmode').val(''); 
    $('#pcat').val('');                
    $('#ttbill').val(''); 
    $('#ntbill').val(''); 
    $('#wvamount').val('');
    $('#notesid').val(''); 
    $('#patSearchStatus').innerHTML=''; 
    $('#tblwaiver tbody tr').remove();
    //$('#transtype').prop('selectedIndex',0)
}
