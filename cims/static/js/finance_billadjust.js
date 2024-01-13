const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

$('#cardnumber').on('keyup',function(){
    var pid =$(this).val();
    var pt=$('#pat_type').val();
    if(pid.trim().length>0){
        fetch("/consult/cons_pat_search/",{
          body:JSON.stringify({ searchText:pid,ptype:pt }),
          method: "POST",
      })
      .then((res)=>res.json())
      .then((data)=>{          
          if(data.length===0){
              //tableOutput.innerHTML='<tr><td colspan="4">No records found </td></tr>'; 
             clearform();
              //document.querySelector('#ttbill').value='';              
          }
          else{
            var jdata=data;          
            var pid
            jdata.forEach(element => { 
            pid =element.pid;
            $('#patname').val(element.fname);
            $('#patage').val(element.age);
            $('#patpmode').val(element.scheme_name);
            $('#ppid').val(pid); 
            $('#vstno').val(element.vno); 
            $('#patgend').val(element.gender); 
            })
            document.querySelector('#patSearchStatus').innerHTML='';
            //checkAge();
            //if(pt=='In-Patient'){retrieveipBill(pid);}
            //else{retrieveBill(pid); }
            loadsumminvoice();            
           }
        })    
    }
    else{
      document.querySelector('#patSearchStatus').innerHTML=''; 
    }

})

function clearform(){
    $('#patname').val('');
    $('#patage').val('');
    $('#patpmode').val('');
    $('#ppid').val(''); 
    $('#vstno').val(''); 
    $('#patgend').val(''); 
    $('#ttpbill').val(''); 
    $('#ttdep').val(''); 
    $('#pbill').val(''); 
    $('#netbill').val(''); 
    $('#patSearchStatus').text('patient not found'); 
    $('#tbladjs tbody tr').remove();
}


var tbladjsbody=document.querySelector('#tbladjsbody')
function loadsumminvoice(){
    var vno=$('#vstno').val();
    var pno=$('#ppid').val();
    var ptype=$('#pat_type').val();
    if(pno !==''){
    tbladjsbody.innerHTML='';
    fetch("/finance/loadbill/",{
        body:JSON.stringify({ pno:pno,vno:vno,ptype:ptype}),
        method: "POST",
    })
    .then((res)=>res.json())
    .then((data)=>{
        //console.log('data',data);
        if(data.length===0){
            tbladjsbody.innerHTML='<tr><td colspan="6">No bill found </td></tr>';
            
        }
        else{
          
          result = [];
          var ttsum=0;
          var ttdep=0;
          var status='';

          data.forEach(function (item) {
            ttsum=item.ttsum;
            status=item.status;
            if (!this[item.service]) {
                this[item.service] = { service: item.service, dept: item.dept, qnty: item.qnty, cost: item.cost,status:item.status };
                result.push(this[item.service]);
                return;
            }
            this[item.service].qnty += item.qnty;
            this[item.service].cost += item.cost;
        }, Object.create(null));
        
        //console.log(result);
            var sum=0;
            tbladjsbody.innerHTML='';

        result.forEach((item)=>{
            sum+=item.cost;           

            tbladjsbody.innerHTML+=
              `<tr>
              <td>${item.dept}</td>
              <td>${item.service}</td>              
              <td>${item.qnty}</td>
              <td contenteditable='true' id='qnt'>${item.qnty}</td>
              <td>${item.cost/item.qnty}</td>
              <td>${item.cost}</td>
              <td style='display:none' id='stt'>${item.status}</td>
              </tr>`;
          }); 
          
        var nbill=parseFloat(sum)-parseFloat(ttsum)
        var ntbill=nbill.toLocaleString('en-US',  {maximumFractionDigits:2})
        $('#pbill').val(ttsum);
        $('#ttpbill').val(sum);
        $('#ttdep').val(ttdep);
        $('#netbill').val(ntbill);
        }
        checkstatus();
      })
    }
    else{
        swal('sorry load patient first','','info');
    }
}

//canot edit the cell if status =paid

$('#tbladjs tbody').on('keyup','#qnt',function(e){
    //tb.rows[i].cells[2].children[0].value
    var currenRow=$(this).closest("tr");   
    var qnt = parseFloat(currenRow.find("td:eq(2)").text());   
    var nqnt = parseFloat(currenRow.find("td:eq(3)").text());   
    var price = parseFloat(currenRow.find("td:eq(4)").text());   
    
      if(isNaN(qnt)){
        currenRow.find("td:eq(3)").html('').append(qnt);
      }
      else{
        if(nqnt<=qnt){       
            var price=parseFloat(currenRow.find("td:eq(4)").text());
            var totPrice=parseFloat(nqnt*price);
            currenRow.find("td:eq(5)").html('').append(totPrice);             
            findTotal();            
      }  
      else if(nqnt>qnt){
       // swal('','incorrect quantity entry','error');
       currenRow.find("td:eq(3)").html('').append(qnt);
        var totPrice=parseFloat(qnt*price);
        currenRow.find("td:eq(5)").html('').append(totPrice);             
        findTotal();
      }    
    }    
  })



function checkstatus() {
    $("#tbladjs tbody tr").each(function(){      
    var status = $(this).find('#stt').text();
    var newqnt =$(this).find('#qnt').get(0);
    if (status=='paid') {
        //newqnt.contentEditable = false;
        $(this).addClass('light-grey-bg');
    } else {
        newqnt.contentEditable = true;
        $(this).removeClass('light-grey-bg');
    }
    })
  }



function findTotal(){
    var sum=0;
    $("#tbladjs tbody tr").each(function(){
        var self=$(this);
        var ttp=parseFloat(self.find("td:eq(5)").text().trim());
        sum+=ttp;
    })
    $('#ttpbill').val(sum);
    var paid= $('#pbill').val();
    var dep= $('#ttdep').val();

    $('#netbill').val(parseFloat(sum-dep-paid));
}

$('#btnSaveAdj').on('click', function(){
    swal({
        title: "Bill confirmation",
        text: "Would you like to commit these changes?",
        icon: "info",
        buttons: [
          'No, cancel',
          'Yes,Proceed'
        ],
        dangerMode: true,
      }).then(function(isConfirm) {
        if (isConfirm) {
            var bill=[]
            $("#tbladjs tbody tr").each(function(){
                var ptype= $('#pat_type').val();     
                var patno= $('#ppid').val();     
                var vsno= $('#vstno').val();     
                var pymode= $('#patpmode').val();     
                var dpt = $(this).find("td:eq(0)").text();
                var svs = $(this).find("td:eq(1)").text();
                var qnt = $(this).find("td:eq(2)").text();
                var newqnt =$(this).find("td:eq(3)").text();
                var price =$(this).find("td:eq(4)").text();
        
                if (qnt==newqnt) {}
                else if(qnt>newqnt) {
                    var nqnt=parseFloat(newqnt-qnt);
                    var nttc=parseFloat(nqnt*price);
                    bill.push({
                        patno:patno,
                        visitno:vsno,
                        pym:pymode,
                        ptype:ptype,
                        dpt:dpt,
                        svsname:svs,
                        sub_qnt:nqnt,
                        sub_amt:nttc
                    })
                }
                })

            if(bill.length==0){swal('','No changes detected','info')}
            else{savechanges(bill);}
            
        } 
        else { }
      }) 
})

function savechanges(bill){
    var new_bill=JSON.stringify(bill);

    $.ajax({
        url: '/finance/update_bill/',
        data:new_bill, 
        method:'POST',       
        dataType: 'json',
        headers: {'X-CSRFToken': csrftoken},
        success: function (data) {
          if(data.msg=="success"){
            swal('Bill Adjustment',"Bill Ammendment made sucessfully",'success');
            //reset page
            clearform();
            $('#cardnumber').val('');
            $('#patSearchStatus').text(''); 
          } 
          else if(data.msg=="error"){
            swal("Error!!","Unable to make changes. Try later","info");
          }            
        },
        error: function(jqXHR, exception) {
          if(jqXHR.status === 400) {
            swal("Internal server error","Please contact support","error");
          }
        }
  
    });
}