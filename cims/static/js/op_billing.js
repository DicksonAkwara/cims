const pcardNo =  document.querySelector('#pCardNo');
const btnSearch =  document.querySelector('.btn-search');
const svs_search =  document.querySelector('#search-service');
const pat_name =  document.querySelector('#pname');
const resultTableBody = document.querySelector('.bk-table-body');
const serviceTableBody = document.querySelector('.svs-table-body');




pcardNo.addEventListener('keyup',(e)=>{

    const pid = e.target.value;
    var pt=$('#pat_type').val();
    if(pid.trim().length>0){
      
        fetch("/consult/cons_pat_search/",{
        body:JSON.stringify({ searchText:pid,ptype:pt }),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        
        if(data.length===0){            
            document.querySelector('#pname').value='';
            document.querySelector('#pymode').value=''; 
            document.querySelector('#cl_patid').value='';           
            document.querySelector('#visitno').value='';           
            document.querySelector('#pyward').value='';   
            document.querySelector('#dateadm').value='';
            document.querySelector('#admdays').value='';
            document.querySelector('#psearchStatus').innerHTML='Patient not found';           
        }
        else{
          var jdata=data;          
          var pid
          jdata.forEach(element => { 
          pid =element.pid;         
          document.querySelector('#pname').value=element.fname;  
          document.querySelector('#cl_patid').value=pid;                    
          document.querySelector('#visitno').value=element.vno;                    
          document.querySelector('#pymode').value=element.scheme_name;
          document.querySelector('#pyward').value=element.wdname;
          document.querySelector('#dateadm').value=element.dateadm;
          })
          document.querySelector('#psearchStatus').innerHTML='';

          calculatedays();

          //search for acumulated bill
          //loadinvoice();
        }
      })
    }
    else{
        document.querySelector('#pname').value='';
        document.querySelector('#pymode').value=''; 
        document.querySelector('#cl_patid').value='';           
        document.querySelector('#visitno').value='';
        document.querySelector('#dateadm').value='';
        document.querySelector('#admdays').value='';
        document.querySelector('#psearchStatus').innerHTML='';
    }

})

function calculatedays(){
    var adm=$('#dateadm').val();
    // Create two Date objects for today and a past date
    const today = new Date();
    const pastDate = new Date(adm); // Replace this with your past date

    // Calculate the time difference in milliseconds
    const timeDifference = today - pastDate;

    // Convert the time difference to days
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))+1;

    $('#admdays').val(days);
}

$('#btn_view_invoice').on('click', function(){
    loadinvoice();
})



$('#pat_type').on('change',function(){
    var pt=$(this).val();
    if(pt=='In-Patient'){
       $('#ipdiv').show();
    }
    else{
        $('#ipdiv').hide();
    }
})


btnSearch.addEventListener('click',(e)=>{  
    var nme= pat_name.value ;
    if(nme !=''){
        if(nme.trim().length>5){
            $('#serviceModal').modal('show');
        }
        else{swal('Record full patient name','','info');}   
    }
    else{swal('sorry load patient first','','info')}

})


svs_search.addEventListener('keyup',(e)=>{

    var pid = e.target.value;
    
        if(pid.trim().length>0){
            //console.log(pid);
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
        }

});

const servicetbody = document.querySelector('#tbservicebody');
$("#tableOutputSvs tbody").on('click','tr', function() {
    var cost;
        var currentRow=$(this).closest("tr"); 
        
        var svs_name=currentRow.find("td:eq(0)").text(); 
        var normal_rate=currentRow.find("td:eq(1)").text(); 
        var special_rate=currentRow.find("td:eq(2)").text(); 
        var dept=currentRow.find("td:eq(3)").text();
        var svs_code=currentRow.find("td:eq(4)").text();

        const pym=document.querySelector('#pymode').value;

        if(pym !=='cash'){
            cost=special_rate;
        }
        else{
            cost=normal_rate;
        }

        var row = document.createElement('tr');        
        row.innerHTML=`              
        <td style="display:none;">${svs_code}</td>
        <td>${svs_name}</td>
        <td><textarea rows="1" cols="3" class='svc_qnt text-center'>1</textarea></td>
        <td>${cost}</td>
        <td>${cost}</td>
        <td>${dept}</td>
        <td><button class="btn btn-danger btn-sm" id='btnremove'>&times;</button></td>`;            
          
        var table = document.querySelector('#tbservicebody');
        table.appendChild(row);

        findTotal();
          
});


$("#tbservicebody").on('click', '#btnremove', function() {  
    var currentRow=$(this).closest("tr");
    var svs_name=currentRow.find("td:eq(1)").text(); 
    if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){
        $(this).closest('tr').remove();        
    }
    findTotal();
})

$('.btn-confirm').on('click',function(){
    const pid=$('#cl_patid').val();
    if(pid !==''){
    
    const ptype=$('#pat_type').val();
    const pym=$('#pymode').val();
    const vno=$('#visitno').val();
    var bill=[];
    var tb = document.getElementById('billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            vno:vno,
            ptype:ptype,
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            qnty:tb.rows[i].cells[2].children[0].value,
            cost:tb.rows[i].cells[4].innerHTML,
            dpt:tb.rows[i].cells[5].innerHTML
        });            
    }
   
   var data_json=JSON.stringify({bill});
   if(confirm("Save client's bill?")){
    $.ajax({
        url: '/records/save_bill/',
        method:'POST',
        data: data_json,
        dataType: 'json',
        success: function (data) {
            if (data) {
                swal(data.msg,'','success');
                $('#billOutputSvs tbody tr').remove();
            }
            /*else{
                $('#successModal').find('#modalAlert').addClass('alert-danger');
                $('#successModal').find('#modalAlert').html(data.msg).show;          
                $('#successModal').find('#modalAlert').removeClass('hidden');
                $('#successModal').modal('show');
            }*/
        },
        error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                swal('Internal Server Error occurred','','error');
            }
          }
      });
    }
    }
    else{
        swal('sorry load patient first','','info');
    }
    //console.log(data_json);
})



$("#btn_lab_confirm").on('click',function(){
    
    var tb = document.getElementById('billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;
    if(rw_count ==0){
        swal('Bill is empty. Add service!!','','info');
    }   
    else{
        if(confirm("Save laboratory bill?")){
        //var pid=$('#cl_patid').val();
        var ptype=$('#pat_type').val();
        var pym=$('#pymode').val();
        var vno=$('#visitno').val();
        var pname=$('#pname').val();

        
        var bill=[];

        for(var i=1;i<=rw_count;i++){        
            bill.push({
               // wlkno:pid,
                pym:pym,
                vno:vno,
                ptype:ptype,
                pname:pname,
                code:tb.rows[i].cells[0].innerHTML,
                svc:tb.rows[i].cells[1].innerHTML,
                
                cost:tb.rows[i].cells[4].innerHTML,
                dpt:tb.rows[i].cells[5].innerHTML
            });            
        }
       
       var data_json=JSON.stringify({bill});
       
        $.ajax({
            url: '/lab/save_bill/',
            method:'POST',
            data: data_json,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    swal('Walk-in Number:'+data.wkno,data.msg,'success');
                    $('#billOutputSvs tbody tr').remove();
                    $('#pname').val("");
                }
                /*else{
                    $('#successModal').find('#modalAlert').addClass('alert-danger');
                    $('#successModal').find('#modalAlert').html(data.msg).show;          
                    $('#successModal').find('#modalAlert').removeClass('hidden');
                    $('#successModal').modal('show');
                }*/
            },
            error: function(jqXHR, exception) {
                if(jqXHR.status === 500) {
                    swal('Internal Server Error occurred','','error');
                }
              }
          });
        } 
    }
    
    //console.log(data_json);
})


$('#billOutputSvs').on('keyup','.svc_qnt',function(e){
    //tb.rows[i].cells[2].children[0].value
    
    var currenRow=$(this).closest("tr");   
    var qnt = parseFloat(e.target.value);   
    
      if(isNaN(qnt)){
        $(this).val('');
      }
      else{  
        if(qnt>0){
       
        var price=parseFloat(currenRow.find("td:eq(3)").text());
        var totPrice=parseFloat(qnt*price);

        currenRow.find("td:eq(4)").html('').append(totPrice); 
        findTotal();         
       
      }  
      else{
        swal('','incorrect quantity entry','error');
        //resetAmount();
      }      
    }
    
  })

$('#btn_inv_summ').on('click', function(){
    loadsumminvoice();
})


var suminvoicebody=document.querySelector('#suminvoicebody')
function loadsumminvoice(){
    var vno=$('#visitno').val();
    var pno=$('#cl_patid').val();
    var ptype=$('#pat_type').val();
    if(pno !==''){
        invoicetbbody.innerHTML='';
    fetch("/finance/loadbill/",{
        body:JSON.stringify({ pno:pno,vno:vno,ptype:ptype}),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        //console.log('data',data);
        if(data.length===0){
            invoicetbbody.innerHTML='<tr><td colspan="6">No bill found </td></tr>';
            
        }
        else{
          $('#invheader').text('Summarized Interim Invoice'); 
          
          result = [];
          var ttsum=0;
          var ttdep=0;
          data.forEach(function (item) {
            ttsum=item.ttsum;
            ttdep=item.ttdep;
            if (!this[item.service]) {
                this[item.service] = { service: item.service, dept: item.dept, qnty: item.qnty, cost: item.cost };
                result.push(this[item.service]);
                return;
            }
            this[item.service].qnty += item.qnty;
            this[item.service].cost += item.cost;
        }, Object.create(null));
        
        //console.log(result);
            var sum=0;
            suminvoicebody.innerHTML='';
            result.forEach((item)=>{
            sum+=item.cost;           

            suminvoicebody.innerHTML+=
              `<tr>
              <td>${item.dept}</td>
              <td>${item.service}</td>              
              <td>${item.qnty}</td>
              <td>${item.cost}</td>
              </tr>`;
          }); 
          
        var nbill=parseFloat(sum)-parseFloat(ttsum)
        var ntbill=nbill.toLocaleString('en-US',  {maximumFractionDigits:2})
        suminvoicebody.innerHTML+=
        `<tr>
            <td style='text-align: center;'><b>Total Bill: ${sum.toLocaleString('en-US',{maximumFractionDigits:2})}</b></td>
            <td style='text-align: center;'><b>Deposits: ${ttdep.toLocaleString('en-US',{maximumFractionDigits:2})}</b></td>
            <td style='text-align: center;'><b>Paid: ${ttsum.toLocaleString('en-US',{maximumFractionDigits:2})}</b></td>
            <td style='text-align: center;'><b>Net Bill: ${ntbill}</b></td>
        </tr>`;
        }
        $('#suminvoiceModal').modal('show');

      })
    }
    else{
        swal('sorry load patient first','','info');
    }
}

var invoicetbbody=document.querySelector('#invoicetbbody');
function loadinvoice(){
    var vno=$('#visitno').val();
    var pno=$('#cl_patid').val();
    var ptype=$('#pat_type').val();
    if(pno !==''){
        invoicetbbody.innerHTML='';
    fetch("/finance/loadbill/",{
        body:JSON.stringify({ pno:pno,vno:vno,ptype:ptype}),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        //console.log('data',data);
        if(data.length===0){
            invoicetbbody.innerHTML='<tr><td colspan="6">No bill found </td></tr>';
            
        }
        else{
            //console.log(data);
          $('#invheader').text('Detailed Interim Invoice');
          var sum=0;
          var ttsum=0;
          var ttdep=0;

          data.forEach((item)=>{
            sum+=item.cost;
            ttsum=item.ttsum;
            ttdep=item.ttdep;
            invoicetbbody.innerHTML+=
              `<tr>              
              <td>${item.bdate}</td>
              <td>${item.dept}</td>
              <td>${item.service}</td>              
              <td>${item.qnty}</td>
              <td>${item.cost}</td>
              <td>${item.staff}</td>
              </tr>`
          });

          var nbill=parseFloat(sum)-parseFloat(ttsum);
          var ntbill=nbill.toLocaleString('en-US',  {maximumFractionDigits:2});
          
          invoicetbbody.innerHTML+=
        `<tr>
            <td colspan='2'><b>Accumulated Bill: ${sum.toLocaleString('en-US',  {maximumFractionDigits:2})}</b></td>
            <td><b>Deposits: ${ttdep.toLocaleString('en-US',  {maximumFractionDigits:2})}</b></td>
            <td><b>Paid: ${ttsum.toLocaleString('en-US',  {maximumFractionDigits:2})}</b></td>
            <td colspan='2'><b>Net Bill: ${ntbill}</b></td>
        </tr>`;
        }
        $('#invoiceModal').modal('show');

      })
    }
    else{
        swal('sorry load patient first','','info');
    } 
}
//not workin on more than one values
function formatnumber(num){
    num.toLocaleString('en-US',  {maximumFractionDigits:2})
    return num;
}

/* 
 pat_category ---exception =true
waiver_approval=true
update domains
waivers exception approvals */

//preauth
$('#btn_preauth').on('click', function(){
    var pid=$('#cl_patid').val();
    if(pid !==''){
    
    var ptype=$('#pat_type').val();
    var pym=$('#pymode').val();
    var vno=$('#visitno').val();    
    var bill=[];
    var tb = document.getElementById('billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            vno:vno,
            ptype:ptype,
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            qnty:tb.rows[i].cells[2].children[0].value,
            cost:tb.rows[i].cells[4].innerHTML,
            dpt:tb.rows[i].cells[5].innerHTML
        });            
    }
   
   var data_json=JSON.stringify({bill});
   if(confirm("Generate Preauth invoice?")){
    $.ajax({
        url: '/finance/preauth/',
        method:'POST',
        data: data_json,
        dataType: 'json',
        success: function (data) {
            if (data.msg=='success') {
                swal("Preauthorization",'Invoice generated successfully','success');
                generateinvoice(bill);                
            }
        },
        error: function(jqXHR, exception) {
            if(jqXHR.status === 500) {
                swal('Internal Server Error occurred','','error');
            }
          }
      });
    }
    }
    else{
        swal('sorry load patient first','','info');
    }
})

var tblfnmodalBody=document.querySelector('#tblfnmodalBody');
var tblfnmodalfooter=document.querySelector('#tblfnmodalfooter');
function generateinvoice(bill){
    var user=$('#username').val();
    $('#patfnscheme').text($('#pymode').val());
    $('#patfnnumber').text($('#cl_patid').val());
    $('#patfnname').text($('#pname').val());
    var pbill=bill;
    var tsum=0;
    pbill.forEach((item)=>{
      tsum +=parseInt(item.cost);
      tblfnmodalBody.innerHTML+=
        `<tr>              
        <td>${todaydate()}</td>
        <td>${item.svc}</td>             
        <td>${item.qnty}</td>
        <td>${item.cost/item.qnty}</td>
        <td>${item.cost}</td>
        </tr>`
    });
    tblfnmodalBody.innerHTML+=`<tr>
        <td colspan='3'></td>
        <td class='text-dark'>Total:</td>
        <td class='text-dark'>${tsum.toLocaleString('en-US',{maximumFractionDigits:2})}</td>
        </tr>`;
    tblfnmodalfooter.innerHTML+=`<tr><td colspan='6'>Prepared By:${user} </td></tr>`;
    
    $('#billOutputSvs tbody tr').remove();
    $('#preauthinvmodal').modal('show')
}

function todaydate(){
  var now = new Date();
  var month = (now.getMonth() + 1);               
  var day = now.getDate();
  if (month < 10) 
      month = "0" + month;
  if (day < 10) 
      day = "0" + day;
  var today = now.getFullYear() + '-' + month + '-' + day;
  return today;
}

function findTotal(){
    var sum=0;
    $("#billOutputSvs tbody tr").each(function(){
        var self=$(this);
        var ttp=parseFloat(self.find("td:eq(4)").text().trim());
        sum+=ttp;
    })

    $('#ttbill').val(parseFloat(sum));
}

$('#prtinvoice').on('click', function() {
  
  var printContents = document.getElementById("divinvoice").innerHTML;
  
  // Create a new iframe
  var iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  
  // Append the iframe to the body
  document.body.appendChild(iframe);
  
  // Get the iframe's document and write the content to it
  var iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write('<html><head><title>Print</title>');
  
  // Copy and apply the styles from the original document's head
  //styles not picking at the printing part
  var styles = document.head.getElementsByTagName("link");
  for (var i = 0; i < styles.length; i++) {
      iframeDoc.head.appendChild(styles[i].cloneNode(true));
  }
  
  iframeDoc.write('</head><body>');
  iframeDoc.write(printContents);
  iframeDoc.write('</body></html>');
  iframeDoc.close();
  
  // Print the iframe's content
  iframe.contentWindow.print();
  
  // Remove the iframe after printing
  iframe.remove();
  
  
  
  })