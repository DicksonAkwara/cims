const btnSearch =  document.querySelector('.btn-search');
const svs_search =  document.querySelector('#search-service');
const pat_name =  document.querySelector('#pname');
const btn_confirm =  document.querySelector('.btn-confirm');

const resultTableBody = document.querySelector('.bk-table-body');
const serviceTableBody = document.querySelector('.svs-table-body');
const billOutputSvsBody = document.querySelector('.billOutputSvsBody')

btnSearch.addEventListener('click',(e)=>{  
    var pid=$('#pid').val().trim();
    if(pid !=''){
    $('#serviceModal').modal('show');
    }
    else{alert('sorry load patient first')}

})


svs_search.addEventListener('keyup',(e)=>{

    const pid = e.target.value;
    
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

$("#tableOutputSvs").on('click', 'tr', function() {
    var cost;
        var currentRow=$(this).closest("tr"); 
        
        var svs_name=currentRow.find("td:eq(0)").text(); 
        var normal_rate=currentRow.find("td:eq(1)").text(); 
        var special_rate=currentRow.find("td:eq(2)").text(); 
        var dept=currentRow.find("td:eq(3)").text();
        var svs_code=currentRow.find("td:eq(4)").text();

        const pym=document.querySelector('#pymode2').value;

        if(pym=='Scheme'){
            cost=special_rate;
        }
        else{
            cost=normal_rate;
        }
        //var data=svs_code+"\n"+svs_name+"\n"+cost+"\n"+dept;
        //alert(data);
        billOutputSvsBody.innerHTML+=
        `<tr>              
        <td style="display:none;">${svs_code}</td>
        <td>${svs_name}</td>
        <td>${cost}</td>
        <td>${dept}</td>
        <td><button class="btn btn-secondary btn-sm">Remove</button></td>
        </tr>`
});

$("#billOutputSvs").on('click', 'tr', function() {  
    var currentRow=$(this).closest("tr");
    var svs_name=currentRow.find("td:eq(1)").text(); 
    if(confirm(`Are you sure you want to remove( ${svs_name} )from bill?`)){
        var rw = this.rowIndex;
        document.getElementById("billOutputSvs").deleteRow(rw);        
    }
})

btn_confirm.addEventListener('click',(e)=>{
    const pid=$('#pid').val();
    const pym=$('#pymode2').val();
    var bill=[];
    var tb = document.getElementById('billOutputSvs');
    var rw_count = tb.tBodies[0].rows.length;   
    for(var i=1;i<=rw_count;i++){        
        bill.push({
            op_no:pid,
            pym:pym,
            code:tb.rows[i].cells[0].innerHTML,
            svc:tb.rows[i].cells[1].innerHTML,
            cost:tb.rows[i].cells[2].innerHTML,
            dpt:tb.rows[i].cells[3].innerHTML
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
                alert(data.msg);
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
                alert('Internal Server Error occurred.');
            }
          }
      });
    }
    //console.log(data_json);
})