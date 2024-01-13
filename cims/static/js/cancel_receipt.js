
var tblcancelBody=document.querySelector('#tblcancelBody');
$('#rcnumber').on('keyup', function(){
    var rno=$(this).val();
    if(rno.trim().length>0){
        tblcancelBody.innerHTML='';
        fetch("/finance/receipt_search/",{
            body:JSON.stringify({ rnumber:rno }),
            method: "POST",
        })
        .then((res)=>res.json())
        .then((data)=>{            
            if(data.length===0){
                $('#ptname').val('');
                $('#rctno').val('');  
                $('#rctamount').val(''); 
                $('#canc_reason').val('');
                $('#rcSearchStatus').innerHTML=''; 
                $('#tblcancel tbody tr').remove();
                $('#btnCancel').prop('disabled', true);
                
            }
            else{
              var jdata=data;
              var pname=''
              var rcptno=''
              var rcptamt=''

              jdata.forEach(element => {         
                pname=element.pname;
                rcptno=element.rctno; 
                rcptamt=element.rtotal; 

                tblcancelBody.innerHTML+=
                `<tr>                  
                      <td style='display:none';>${element.billref}</td>            
                      <td >${element.service}</td>
                      <td >${element.qnty}</td>
                      <td >${element.tprice}</td>                
                      <td >${element.rcby}</td>                
                      <td >${element.dtime}</td>                
                </tr>`;   
              })

                $('#ptname').val(pname);
                $('#rctno').val(rcptno); 
                $('#rctamount').val(rcptamt.toLocaleString('en-US',{maximumFractionDigits:2}));
                $('#btnCancel').prop('disabled', false);
              
             }
          })
       
    }
    else{
        document.querySelector('#rcSearchStatus').innerHTML='';
    }
})


$('#btnCancel').on('click',function(){
    var rcpt=$('#rctno').val()
    var notes=$('#canc_reason').val().trim();

    if(notes !=='' && notes.length>10){
    formdata=JSON.stringify({
        'rcpt':rcpt,
        'notes':notes
    });

    $.ajax({
    url: '/finance/cancel_receipt/',
    data: formdata, 
    method:'POST',       
    dataType: 'json',
    success: function (data) {
        if(data.msg=='success'){
            swal('Receipt no: '+rcpt,'Cancelled Successfuly','success');
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
        swal('You must state reason','','info');
    }

})

function  clearform(){
    $('#ptname').val('');
    $('#rctno').val('');  
    $('#rctamount').val(''); 
    $('#canc_reason').val('');
    $('#rcSearchStatus').innerHTML=''; 
    $('#tblcancel tbody tr').remove();
    $('#btnCancel').prop('disabled', true);
}


$('#dbtnsearch').on('click', function(){
    var dname=$('#dname').val();   
    $.ajax({
        url: '/finance/disease',
        data: JSON.stringify({'dname':dname}), 
        method:'POST',       
        dataType: 'json',
        success: function (data) {
                console.log(data);
                swal('','found','success');        
            },
            error: function(jqXHR, exception) {
                if(jqXHR.status === 500) {
                    swal('','Internal Server Error occurred.'+exception,'error');
                }
            }
        })

})